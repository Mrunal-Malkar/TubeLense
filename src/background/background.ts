/* eslint-disable @typescript-eslint/no-explicit-any */
// This background service worker no longer runs the transformers.js
// pipeline itself. onnxruntime-web's WASM backend hard-references `window`
// during init, and a service worker has no `window` (only `self`) — that's
// what produced "no available backend found: [wasm] ReferenceError: window
// is not defined". WebGPU also can't reliably get an adapter from a
// service worker context ("No available adapters"), so both backends were
// failing here for different reasons.
//
// The fix: run the actual model inference in an Offscreen Document, which
// is a real page with window/DOM. This file just ensures that document
// exists and relays messages to it.

// IMPORTANT: the `url:` prefix is Parcel's asset-URL import scheme (Plasmo
// is built on Parcel). Importing it this way — rather than hardcoding the
// string "offscreen.html" — is what makes the bundler actually discover
// offscreen.html (and, through its <script src="./offscreen.ts">,
// offscreen.ts too) and include them in the final build output. A bare
// string path with no import has no dependency-graph link, so Parcel has
// no reason to bundle those files at all.
// import offscreenHtmlUrl from "./offscreen.html?url";

let creatingOffscreenDocument: Promise<void> | null = null;

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

        // const storageResult = await chrome.storage.local.get("user_preference_topics");
        // const secondArgument = JSON.stringify(storageResult) ?? "car";
        const secondArgument = "car";
        console.log("got the second argument:", secondArgument,"first argument:",);

        await ensureOffscreenDocument();

        // Forward to the offscreen document, which does the actual work.
        console.log("calling for offscreen")
        const res = await chrome.runtime.sendMessage({
          target: "offscreen",
          task: "evaluate_relativity",
          text: message.title,
          secondArgument,
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