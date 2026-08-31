/* eslint-disable @typescript-eslint/no-explicit-any */

import { CARD_DATA } from "../lib/cards";
import type { PreferencesState, TopicsPack } from "../store/baseInfoStore";
import { initStore } from "../store/store";

console.log("background.ts loaded", { href: location.href });

let creatingOffscreenDocument: Promise<void> | null = null;
let userPreferredTopics: string[] | undefined;
let isStandardCard: boolean;
let cardName: string | undefined;

// Resolves once the offscreen document has told us it's actually listening.
let offscreenReady: Promise<void> | null = null;
let resolveOffscreenReady: (() => void) | null = null;
// const ignoredChannels:string[]=((await chrome.storage.local.get("ignoredChannels"))?.ignoredChannels)??[];
let ignoredChannels:string[];

function getOffscreenDocumentPath(): string {
  return chrome.runtime.getURL("src/background/offscreen.html");
}

async function hasOffscreenDocument(): Promise<boolean> {
  if ("getContexts" in chrome.runtime) {
    const contexts = await (chrome.runtime as any).getContexts({
      contextTypes: ["OFFSCREEN_DOCUMENT"],
      documentUrls: [getOffscreenDocumentPath()],
    });
    try {
      console.log("hasOffscreenDocument contexts length", contexts.length);
    } catch (e) {
      /* ignore */
      console.log("error in hasOffscreenDocument context length:", e);
    }
    return contexts.length > 0;
  }
  return false;
}

function resetReadyGate() {
  console.log("resetReadyGate called");
  offscreenReady = new Promise((resolve) => {
    resolveOffscreenReady = resolve;
  });
}

async function ensureOffscreenDocument() {
  if (await hasOffscreenDocument()) {
    // Document exists (e.g. survived a service worker restart) but we have
    // no readiness promise for it in this SW lifetime — assume it's ready
    // since it must have already signalled once to exist stably. If you
    // want to be extra safe you could re-ping it here instead.
    if (!offscreenReady) resetReadyGate();
    if (resolveOffscreenReady) resolveOffscreenReady();
    return;
  }

  if (creatingOffscreenDocument) {
    await creatingOffscreenDocument;
    return;
  }

  console.log("creating the offscreen file.");
  resetReadyGate();

  creatingOffscreenDocument = chrome.offscreen.createDocument({
    url: getOffscreenDocumentPath(),
    reasons: [chrome.offscreen.Reason.WORKERS],
    justification:
      "Run @huggingface/transformers feature-extraction pipeline, which requires window/DOM APIs not available in a service worker.",
  });

  try {
    await creatingOffscreenDocument;
    console.log("created offscreen document");
  } finally {
    creatingOffscreenDocument = null;
  }

  // Wait for the offscreen doc to announce it's actually ready to receive
  // messages (its script loaded + pipeline initialized), with a timeout
  // so we don't hang forever if something goes wrong.
  await Promise.race([
    offscreenReady,
    new Promise<void>((_, reject) =>
      setTimeout(
        () => reject(new Error("Offscreen document readiness timed out")),
        15000,
      ),
    ),
  ]);
}


async function checkForIgnoredChannelName(channelName:string){
  if(!ignoredChannels){
    ignoredChannels=((await chrome.storage.local.get("ignoredChannels"))?.ignoredChannels??[]) as string[];
  }
  console.log("the ignoredChannels",ignoredChannels);
  if(ignoredChannels.length==0)return false;

  return ignoredChannels.includes(channelName);
}

// Listen for the offscreen document's "I'm ready" ping.
chrome.runtime.onMessage.addListener((message) => {
  if (message?.target === "offscreen-ready") {
    console.log("offscreen document signalled ready.");
    if (!resolveOffscreenReady) resetReadyGate();
    resolveOffscreenReady?.();
  }
});

// Wrap sendMessage with a couple of retries to absorb any remaining
// timing flakiness (e.g. "Could not establish connection" races).
async function sendToOffscreen(payload: any, attempts = 3): Promise<any> {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await chrome.runtime.sendMessage(payload);
      if (res === undefined)
        console.log("sendToOffscreen got undefined response, attempt", i + 1);
      if (res !== undefined) return res;
    } catch (err) {
      console.log("sendToOffscreen attempt failed", i + 1, err);
      if (i === attempts - 1) throw err;
    }
    await new Promise((r) => setTimeout(r, 300 * (i + 1)));
  }
  throw new Error("No response from offscreen document after retries");
}

chrome.storage.onChanged.addListener(async (changes, areaName) => {
  console.log("background storage.onChanged", { changes, areaName });
  if (areaName !== "local") return;

  const preferenceChange = changes.preference;
  if (!preferenceChange) return;

  const oldPref = preferenceChange.oldValue as PreferencesState | undefined;
  const newPref = preferenceChange.newValue as PreferencesState | undefined;
  if (!newPref) return;
  if (oldPref?.activeTopicPack === newPref.activeTopicPack) return;

  const preference: PreferencesState = (await initStore()).getState()
    .preference;
  const pack: TopicsPack | undefined = preference?.topicsPack.find(
    (i) => i.label === preference.activeTopicPack,
  );

  if (pack && CARD_DATA.some((i) => i.name === pack.label)) {
    cardName = pack.label;
    isStandardCard = true;
    userPreferredTopics = undefined;
  } else {
    isStandardCard = false;
    cardName = undefined;
    userPreferredTopics = pack?.topics.map((topic) => topic.topic);
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("background onMessage received", message);
  if (message?.target === "offscreen") {
    return false;
  }
  if (message?.task === "evaluate_relativity") {
    (async () => {
      if (!userPreferredTopics && !isStandardCard) {
        const preference: PreferencesState = (await initStore()).getState()
          .preference;
        const pack: TopicsPack | undefined = preference?.topicsPack.find(
          (i) => i.label === preference.activeTopicPack,
        );

        if (pack && CARD_DATA.some((i) => i.name === pack.label)) {
          cardName = pack.label;
          isStandardCard = true;
          userPreferredTopics = undefined;
        } else {
          isStandardCard = false;
          cardName = undefined;
          userPreferredTopics = pack?.topics.map((topic) => topic.topic);
        }
      }
      try {
        console.log("message",message,"the splitted messsage not 1:",(message.text as string).split("SPLIT-_-SPLIT"))
        const channelName=((message.text as string).split("SPLIT-_-SPLIT"))[1];
        console.log("got splitted channelName",channelName,"going for the check");
        const check=await checkForIgnoredChannelName(channelName);
        if(check===true){
           sendResponse({
        success: true,
        title:message.text,
        similarity: 5,
        device: "None",
      });
      return
        }
        await ensureOffscreenDocument();
        if (isStandardCard && cardName) {
          const res = await sendToOffscreen({
            target: "offscreen",
            task: "evaluate_relativity",
            title: message.text,
            standardCardName: cardName,
          });
          sendResponse(res);
          return;
        }

        if (!userPreferredTopics || userPreferredTopics.length === 0) {
          throw new Error("userPreferredTopics is undefined or empty");
        }

        const channelAndTitleSorted=message.text.split("SPLIT-_-SPLIT").join("");
        console.log("channelAndTitleSorted before sending to offscreen:",channelAndTitleSorted);
        const res = await sendToOffscreen({
          target: "offscreen",
          task: "evaluate_relativity",
          title: channelAndTitleSorted,
          customTopics: userPreferredTopics,
        });
        sendResponse(res);
      } catch (err) {
        sendResponse({ Error: err instanceof Error ? err.message : err });
      }
    })();
    return true; // keep channel open
  }
  sendResponse({ message: "No such message" });
});

// background.ts — handle the popup-open request (best-effort; requires Chrome 127+, and may silently no-op on older versions)
chrome.runtime.onMessage.addListener((message) => {
  if (message?.action === "OPEN_POPUP_REQUEST") {
    chrome.action.openPopup().catch(() => {
      console.log("could not open the banner.");
      // not supported on this Chrome version — nothing to do, user can still click the icon manually
    });
  }
});
