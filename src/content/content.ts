/* eslint-disable @typescript-eslint/no-explicit-any */

import { startYoutubeFiltering, stopYoutubeFiltering } from "./youtube";
import { type PreferencesState } from "../store/baseInfoStore";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("received the popup msg", message);
  if (message.task == "activate_extension") {
    console.log("activate_extension received", { senderUrl: sender?.url });
    localStorage.setItem("lens_activate", "true");
    console.log("lens_activation stored in localStorage");
    sendResponse({ isActive: true, message: "done!" });
  } else {
    console.log("no such message", sender);
  }
  return true;
});

// --- Site Dispatch ---
// Central place to route to the right site's filtering logic based on the
// current page's hostname. Add a new `case` + real start/stop functions
// (mirroring the Youtube* pattern above) when adding support for a new site.
function startFilteringForCurrentSite() {
  const hostname = window.location.hostname;
  switch (true) {
    case hostname.includes("youtube.com"):
      console.log("starting to filter (youtube)");
      startYoutubeFiltering();
      break;

    // case hostname.includes("twitter.com"):
    // case hostname.includes("x.com"):
    //   console.log("starting to filter (twitter)");
    //   startTwitterFiltering();
    //   break;

    // case hostname.includes("reddit.com"):
    //   console.log("starting to filter (reddit)");
    //   startRedditFiltering();
    //   break;

    default:
      console.log("no filtering logic for this site", hostname);
  }
}

function stopFilteringForCurrentSite() {
  const hostname = window.location.hostname;

  switch (true) {
    case hostname.includes("youtube.com"):
      console.log("stopping filter (youtube)");
      stopYoutubeFiltering();
      break;

    // case hostname.includes("twitter.com"):
    // case hostname.includes("x.com"):
    //   console.log("stopping filter (twitter)");
    //   stopTwitterFiltering();
    //   break;

    // case hostname.includes("reddit.com"):
    //   console.log("stopping filter (reddit)");
    //   stopRedditFiltering();
    //   break;

    default:
      console.log("no filtering logic for this site", hostname);
  }
}

// --- Dummy stubs for other sites (implement when adding support) ---
// function startTwitterFiltering() {
//   console.log("startTwitterFiltering called (not implemented)");
// }
// function stopTwitterFiltering() {
//   console.log("stopTwitterFiltering called (not implemented)");
// }
// function startRedditFiltering() {
//   console.log("startRedditFiltering called (not implemented)");
// }
// function stopRedditFiltering() {
//   console.log("stopRedditFiltering called (not implemented)");
// }

// --- Initialize State ---
chrome.storage.local.get(["lens_active"], (result) => {
  console.log("reult:", result.lens_active);
  if (result.lens_active === true) {
    console.log("starting to filter");
    startFilteringForCurrentSite();
  } else {
    console.log("extension state is not active yet", result);
  }
});

// --- Listen for Real-time Changes (from Popup) ---
chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log("storage changed", { namespace, changes });
  if (namespace === "local" && changes.lens_active) {
    if (changes.lens_active.newValue == true) {
      console.log("starting the filtering.");
      startFilteringForCurrentSite();
    } else {
      console.log("stopping the filtering", changes.lens_active);
      stopFilteringForCurrentSite();
    }
  }else if(namespace==="local" && changes.preference){
    const preferenceOld:any=changes.preference.oldValue;
    const preferenceNew:any=changes.preference.newValue;
    if(preferenceNew.custom?.sites){
      const sitesNew=preferenceNew?.custom?.sites;
      const sitesOld=preferenceOld?.custom?.sites;
      alterSitesProcessing({sitesNew,sitesOld});
    }else if(preferenceNew.cards?.selectedCardName){
    // 
    }
  }
});

function alterSitesProcessing({sitesNew,sitesOld}:{sitesNew:PreferencesState["custom"]["sites"],sitesOld:PreferencesState["custom"]["sites"]}){
  console.log("got the two arguments",{sitesNew,sitesOld});
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
  console.log("sending relativity check for title", videoTitle);
  try {
    const response = await chrome.runtime.sendMessage({
      task: "evaluate_relativity",
      text: videoTitle,
    });
    console.log("relativity response received", response, "as number", Number(response.similarity));
    if (!response.success) return 1;

    return Number(response.similarity);
  } catch (error) {
    console.log("getYoutubeRelativityScore failed", error);
    return 1;
  }
}

const getSiteFunction={"ytStart":startYoutubeFiltering,"instaStart":()=>{console.log("insta start not implemented")},"xStart":()=>{console.log("x start not implemented")},"googleStart":()=>{console.log("google start not implemented")},"ytStop":stopYoutubeFiltering,"instaStop":()=>{console.log("insta stop not implemented")},"xStop":()=>{console.log("x stop not implemented")},"googleStop":()=>{console.log("google stop not implemented")}} as any;