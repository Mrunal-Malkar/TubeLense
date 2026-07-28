/* eslint-disable @typescript-eslint/no-explicit-any */

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
        const secondArgument = "A video about automotive reviews, driving test drives, vehicle modifications, racing sports, car maintenance tutorials, or ownership experiences featuring specific brands, models, engines, and road performance.";
        console.log("got the second argument:", secondArgument,"first argument:",);

        await ensureOffscreenDocument();

        // Forward to the offscreen document, which does the actual work.
        console.log("calling for offscreen")
        const res = await chrome.runtime.sendMessage({
          target: "offscreen",
          task: "evaluate_relativity",
          text: message.text,
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