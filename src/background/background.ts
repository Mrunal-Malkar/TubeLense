/* eslint-disable @typescript-eslint/no-explicit-any */

import type { PreferencesState, TopicsPack } from "../store/baseInfoStore";
import { initStore } from "../store/store";

let creatingOffscreenDocument: Promise<void> | null = null;
let userPreferredTopics: string[] | undefined;
// initialize store and get the userPreffered topics
// const storePromise=initStore();
// const preference=(await storePromise).getState().preference
// let userPrefferedTopics:string[] | undefined = [];
// if(preference?.activeMode==="custom"){
//   userPrefferedTopics=preference?.custom.topics;
// }else{
//   const card=preference?.cards?.selectedCardName;
//   const Topics=CARD_DATA.find((cardProp:CardData)=>cardProp.name===card)?.topics;
//   userPrefferedTopics=Topics;
// }

function getOffscreenDocumentPath(): string {
  return chrome.runtime.getURL("src//background/offscreen.html");
}

async function hasOffscreenDocument(): Promise<boolean> {
  if ("getContexts" in chrome.runtime) {
    const contexts = await (chrome.runtime as any).getContexts({
      contextTypes: ["OFFSCREEN_DOCUMENT"],
      documentUrls: [getOffscreenDocumentPath()],
    });
    return contexts.length > 0;
  }
  return false;
}

async function ensureOffscreenDocument() {
  if (await hasOffscreenDocument()) {
    return;
  }

  if (creatingOffscreenDocument) {
    await creatingOffscreenDocument;
    return;
  }

  creatingOffscreenDocument = chrome.offscreen.createDocument({
    url: getOffscreenDocumentPath(),
    reasons: [chrome.offscreen.Reason.WORKERS], // running WASM/ML workload
    justification:
      "Run @huggingface/transformers feature-extraction pipeline, which requires window/DOM APIs not available in a service worker.",
  });

  try {
    await creatingOffscreenDocument;
  } finally {
    creatingOffscreenDocument = null;
  }
}

chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName !== "local") return;

  const preferenceChange = changes.preference;
  if (!preferenceChange) return;

  const oldPref = preferenceChange.oldValue as PreferencesState | undefined;
  const newPref = preferenceChange.newValue as PreferencesState | undefined;
  if (!newPref) return;
  if (oldPref?.activeTopicPack === newPref.activeTopicPack) return;

  const preference: PreferencesState = (await initStore()).getState()
    .preference;
  const pack: TopicsPack = preference?.topicsPack.filter(
    (i) => i.label == preference.activeTopicPack,
  )?.[0];
  userPreferredTopics = pack?.topics.map((i) => i.topic);
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.task === "evaluate_relativity") {
    (async () => {
      if (!userPreferredTopics) {
        const preference: PreferencesState = (await initStore()).getState()
          .preference;
        const pack: TopicsPack = preference?.topicsPack.filter(
          (i) => i.label == preference.activeTopicPack,
        )?.[0];
        userPreferredTopics = pack.topics.map((i) => i.topic);
      }
      try {
        if (!userPreferredTopics)
          throw new Error("userPrefferedTopics is undefined");

        console.log("the userPrefferedTopics:", userPreferredTopics);
        await ensureOffscreenDocument();
        const res = await chrome.runtime.sendMessage({
          target: "offscreen",
          task: "evaluate_relativity",
          firstArgument: message.text,
          secondArgument: userPreferredTopics,
        });
        sendResponse(res ?? "sample");
      } catch (err) {
        sendResponse({ Error: err instanceof Error ? err.message : err });
      }
    })();
    return true; // keep channel open
  }
  sendResponse({ message: "No such message" });
});
