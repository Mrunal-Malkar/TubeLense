/* eslint-disable @typescript-eslint/no-explicit-any */

import { CARD_DATA } from "../lib/cards";
import { initStore } from "../store/store";

let creatingOffscreenDocument: Promise<void> | null = null;

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

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.task === "evaluate_relativity") {
    (async () => {
      try {
        const preference = (await (await initStore()).getState()).preference;
        const userPrefferedTopics: string[] | undefined =
          preference?.activeMode === "custom"
            ? preference?.custom.topics
            : CARD_DATA.find(c => c.name === preference?.cards?.selectedCardName)?.topics;

        if (!userPrefferedTopics) throw new Error("userPrefferedTopics is undefined");

        await ensureOffscreenDocument();
        const res = await chrome.runtime.sendMessage({
          target: "offscreen",
          task: "evaluate_relativity",
          firstArgument: message.text,
          secondArgument: userPrefferedTopics,
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