/* eslint-disable @typescript-eslint/no-explicit-any */

import { CARD_DATA, type CardData } from "../lib/cards";
import { initStore } from "../store/store";

let creatingOffscreenDocument: Promise<void> | null = null;

// initialize store and get the userPreffered topics
const storePromise=initStore();
const preference=(await storePromise).getState().preference
let userPrefferedTopics:string[] | undefined = [];
if(preference?.activeMode==="custom"){
  userPrefferedTopics=preference?.custom.topics;
}else{
  const card=preference?.cards?.selectedCardName;
  const Topics=CARD_DATA.find((cardProp:CardData)=>cardProp.name===card)?.topics;
  userPrefferedTopics=Topics;
}

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
    async function call() {
      try {
        console.log("evaluate_relativity message received", message);
        await ensureOffscreenDocument();

        // Forward to the offscreen document, which does the actual work.
        console.log("calling for offscreen")
        if(!userPrefferedTopics){
          throw Error("userPrefferedTopics is undefined, cannot evaluate relativity");
        }
        const res = await chrome.runtime.sendMessage({
          target: "offscreen",
          task: "evaluate_relativity",
          firstArgument: message.text,
          secondArgument:userPrefferedTopics,
        });

        console.log("the final response of the model:", res);
        sendResponse(res ?? "sample");
      } catch (err) {
        console.log("evaluate_relativity failed", err);
        sendResponse({ Error: err instanceof Error ? err.message : err });
      }
    }
    call();
    return true; // keep the channel open for the async work above
  } else if (message?.task == "add here task") {
    //
  } else {
    sendResponse({ message: "No such message" });
  }
});