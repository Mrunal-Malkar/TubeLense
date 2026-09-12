/* eslint-disable @typescript-eslint/no-explicit-any */

import { startYoutubeFiltering, stopYoutubeFiltering } from "./youtube";
import { type PreferencesState } from "../store/baseInfoStore";

// --- Site Dispatch ---
// Central place to route to the right site's filtering logic based on the
// current page's hostname. Add a new `case` + real start/stop functions
// (mirroring the Youtube* pattern above) when adding support for a new site.
async function startFilteringForCurrentSite() {
  const host = window.location.hostname;
  const hostName: string = getHostName(host) ?? "";
  switch (hostName) {
    case "yt":
      startYoutubeFiltering();
      break;

    default:
  }
}

function stopFilteringForCurrentSite() {
  const hostname = window.location.hostname;

  switch (true) {
    case hostname.includes("youtube.com"):
      stopYoutubeFiltering();
      break;

    default:
  }
}

// --- Initialize State ---
chrome.storage.local.get(["lens_active"], (result) => {
  if (result.lens_active === true) {
    startFilteringForCurrentSite();
  }});

// --- Listen for Real-time Changes (from Popup) ---
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace != "local") return;

  if (changes.lens_active) {
    if (changes.lens_active.newValue == true) {
      startFilteringForCurrentSite();
    } else {
      stopFilteringForCurrentSite();
    }
  } else if (changes.preference) {
    const preferenceOld: any = changes.preference.oldValue;
    const preferenceNew: any = changes.preference.newValue;
    if (preferenceNew.sites) {
      const sitesNew = preferenceNew?.sites;
      const sitesOld = preferenceOld?.sites;
      alterSitesProcessing({ sitesNew, sitesOld });
    }
    if(preferenceNew.strictness!=preferenceOld.strictness){
      rebootCurrentSite();
    }
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "REBOOT_CURRENT_SITE") {
    rebootCurrentSite()
      .then(() => {
        sendResponse({
          status: "success",
          message: "Current site rebooted successfully",
        });
      })
      .catch((error) => {
        console.error("Reboot failed:", error);

        sendResponse({
          status: "error",
          message: "Failed to reboot current site",
        });
      });

    return true;
  }

  return false;
});

function alterSitesProcessing({
  sitesNew,
  sitesOld,
}: {
  sitesNew: PreferencesState["sites"];
  sitesOld: PreferencesState["sites"];
}) {
  for (const site in sitesNew) {
    const siteKey = site as keyof typeof sitesNew;
    if (sitesNew[siteKey] !== sitesOld[siteKey]) {
      if (sitesNew[siteKey] === true) {
        getSiteFunction[`${siteKey}Start`]();
      } else {
        getSiteFunction[`${siteKey}Stop`]();
      }
    }
  }
}

export async function getRelativityScore(videoTitle: string) {
  try {
    const response = await chrome.runtime.sendMessage({
      task: "evaluate_relativity",
      text: videoTitle,
    });
    if (!response.success) return 2;

    return Number(response.similarity);
  } catch (error) {
    if(error){
      return 1;
    }
  }
  return 1;
}

async function rebootCurrentSite() {
  const host = window.location.hostname;
  const site = getHostName(host);

  if (!site) {
    return;
  }

  const startFunction = getSiteFunction[`${site}Start`];
  const stopFunction = getSiteFunction[`${site}Stop`];

  if (!startFunction || !stopFunction) {
    return;
  }


  await stopFunction();
  await startFunction();

}

const getSiteFunction = {
  ytStart: startYoutubeFiltering,
  instaStart: () => {
  },
  xStart: () => {
  },
  googleStart: () => {
  },
  ytStop: stopYoutubeFiltering,
  instaStop: () => {
  },
  xStop: () => {
  },
  googleStop: () => {
  },
} as any;
const getHostName = (host: string) => {
  if (host.includes("youtube.com")) {
    return "yt";
  } else if (host.includes("x.com")) {
    return "x";
  } else if (host.includes("instagram.com")) {
    return "insta";
  } else if (host.includes("google.com")) {
    return "google";
  }
};
