/* eslint-disable @typescript-eslint/no-explicit-any */
import { pipeline } from "@huggingface/transformers";

// No env.backends.onnx.wasm.wasmPaths needed anymore — we're not using
// the wasm backend at all, so none of that config applies.

let extractorPromise: Promise<any> | null = null;
async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
      device: "wasm", // <-- the key change
    });
    console.log("got the extractorPromise", extractorPromise);
  }
  return extractorPromise;
}

function normalizeEmbedding(output: any) {
  if (typeof output?.toArray === "function") {
    return output.toArray();
  }
  if (Array.isArray(output)) {
    return output;
  }
  if (Array.isArray(output?.data)) {
    return output.data;
  }
  if (typeof output?.tolist === "function") {
    return output.tolist();
  }
  return [];
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.task === "Trans") {
  async function call() {
      try {
        const res = (await handleTransformerMessage(message.text))??"sample";
        console.log("the final response of the model:",res);
        sendResponse(res);
      } catch (err) {
        sendResponse({ Error: err instanceof Error ? err.message : err });
      }
    }
    call();
    return true; // keep the channel open for the async work above
  }else if(message?.task=="activate_extension"){
    // 
  }else {
    sendResponse({ message: "No such message" });
  }
});

async function handleTransformerMessage(text: string) {
  const extractor = await getExtractor();
  const output = await extractor(text, { pooling: "mean", normalize: true });
  const embedding = normalizeEmbedding(output);

  return {
    success: true,
    text,
    embeddingLength: Array.isArray(embedding) ? embedding.length : 0,
    embeddingPreview: Array.isArray(embedding)
      ? embedding.slice(0, 8)
      : embedding,
  };
}