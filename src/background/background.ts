/* eslint-disable @typescript-eslint/no-explicit-any */
import { pipeline } from "@huggingface/transformers";
import { stringify } from "querystring";

// No env.backends.onnx.wasm.wasmPaths needed anymore — we're not using
// the wasm backend at all, so none of that config applies.

let extractorPromise: Promise<any> | null = null;
async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      {
        device: "wasm", // <-- the key change
      },
    );
    console.log("got the extractorPromise", extractorPromise);
  }
  return extractorPromise;
}

function normalizeEmbedding(output: any): number[] {
  if (typeof output?.toArray === "function") {
    return output.toArray();
  }
  if (Array.isArray(output)) {
    return output;
  }
  if (Array.isArray(output?.data)) {
    return output.data;
  }
  // Float32Array / typed array case — not a plain Array, but array-like
  if (output?.data && typeof output.data.length === "number") {
    return Array.from(output.data);
  }
  if (typeof output?.tolist === "function") {
    return output.tolist();
  }
  return [];
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  // We already normalize:true at extraction time, so this division is
  // usually redundant (norms ≈ 1), but keeping it makes the function
  // correct even if normalize is ever turned off upstream.
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.task === "evaluate_relativity") {
    async function call() {
      try {
        const secondArgument =
          stringify(await chrome.storage.local.get("user_preference_topics")) ??
          "car";
        console.log("got the second argument:", secondArgument);
        const res =
          (await handleTransformerMessage(message.text, secondArgument)) ??
          "sample";
        console.log("the final response of the model:", res);
        sendResponse(res);
      } catch (err) {
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

async function embedText(extractor: any, text: string): Promise<number[]> {
  const output = await extractor(text, { pooling: "mean", normalize: true });
  return normalizeEmbedding(output);
}

async function handleTransformerMessage(
  firstArgument: string,
  secondArgument: string,
) {
  const extractor = await getExtractor();

  const [embeddingA, embeddingB] = await Promise.all([
    embedText(extractor, firstArgument),
    embedText(extractor, secondArgument),
  ]);

  const similarity = cosineSimilarity(embeddingA, embeddingB);

  console.log("similarity score:", similarity);

  return {
    success: true,
    firstArgument: firstArgument,
    secondArgument: secondArgument,
    similarity,
  };
}
