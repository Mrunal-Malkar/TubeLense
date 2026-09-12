/* eslint-disable @typescript-eslint/no-explicit-any */
import { env, pipeline } from "@huggingface/transformers";
import { getOppositeTitle } from "../functions/get";
import { CENTROIDS, type CardName } from "../lib/cards";

// This file runs inside an offscreen document — a real page with `window`
if (env.backends.onnx.wasm) {
  env.backends.onnx.wasm.wasmPaths = chrome.runtime.getURL("wasm/");
  env.backends.onnx.wasm.numThreads = 1;
  env.backends.onnx.wasm.proxy = false;
}

let extractorPromise: Promise<any> | null = null;
let activeDevice: "webgpu" | "wasm" | null = null;

async function isWebGPUAvailable(): Promise<boolean> {
  try {
    if (typeof navigator === "undefined" || !(navigator as any).gpu) {
      return false;
    }
    const adapter = await (navigator as any).gpu.requestAdapter();
    const available = Boolean(adapter);
    return available;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
  return false;
  }
}

async function createExtractor(device: "webgpu" | "wasm") {
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { device });
  return extractor;
}

function getExtractor() {
  
  if (extractorPromise) {
    return extractorPromise;
  }


  extractorPromise = (async () => {
    const webGPUAvailable = await isWebGPUAvailable();

    if (webGPUAvailable) {
      try {
        const extractor = await createExtractor("webgpu");
        activeDevice = "webgpu";
        return extractor;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // fall through to wasm below
      }
    } 
    const extractor = await createExtractor("wasm");
    activeDevice = "wasm";
    return extractor;
  })();

  return extractorPromise;
}

function normalizeEmbedding(output: any): number[] {
  if (typeof output?.toArray === "function") {
    const value = output.toArray();
   return value;
  }
  if (Array.isArray(output)) {
   return output;
  }
  if (Array.isArray(output?.data)) {
    return output.data;
  }
  if (output?.data && typeof output.data.length === "number") {
    const value = Array.from(output.data) as number[];
    return value;
  }
  if (typeof output?.tolist === "function") {
    const value = output.tolist();
   
    return value;
  }
  return [];
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0;
  }
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  const similarity = denom === 0 ? 0 : dot / denom;
  return similarity;
}

async function embedText(extractor: any, text: string): Promise<number[]> {
  const output = await extractor(text, { pooling: "mean", normalize: true });
  const embedding = normalizeEmbedding(output);
  return embedding;
}

function getCentroidByCardName(cardName: string): number[] | undefined {
  for (const [key, value] of Object.entries(CENTROIDS)) {
    if (key === cardName) {
      return value;
    }
  }

  return undefined;
}

async function scoreVideo(
  title: string,
  customTopics?: string[] | string,
  standardCardName?: CardName,
): Promise<number> {

  const extractor = await getExtractor();
  const titleEmb = await embedText(extractor, title);

  if (standardCardName) {
    const userCardCentroid = getCentroidByCardName(standardCardName);
    const oppositeCardName = getOppositeTitle(standardCardName);
    const oppositeCardCentroid = oppositeCardName
    ? getCentroidByCardName(oppositeCardName)
    : undefined;

    if (!userCardCentroid) {
      return 0;
    }

    const simUserCard = cosineSimilarity(titleEmb, userCardCentroid);
    const simOppositeCard = oppositeCardCentroid
      ? cosineSimilarity(titleEmb, oppositeCardCentroid)
      : 0;
    const finalScore = simUserCard - simOppositeCard;

    return finalScore;
  }

  if (customTopics) {
    const topicText = Array.isArray(customTopics)
      ? customTopics.join(", ")
      : customTopics;
    const topicsEmbedding = await embedText(extractor, topicText);
    const similarity = cosineSimilarity(titleEmb, topicsEmbedding);
    return similarity;
  }

  return 0;
}

// Only handle messages specifically routed to the offscreen document by the
// background script (see background.ts's `target: "offscreen"` wrapper),
// so we don't double-handle messages meant elsewhere.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  
  // Adapted to check for the scoring task. 
  // You can adjust the task string to match what your background script sends.
  if (message?.target !== "offscreen" || (message?.task !== "score_video" && message?.task !== "evaluate_relativity")) {
    return false;
  }

  (async () => {
    try {
      
      // Extract title from message (handles both potential structures during migration)
      const title = message.title ?? message.text ?? message.firstArgument;
      const customTopics = message.customTopics ?? message.secondArgument;
      const standardCardName = message.standardCardName;

      const score = await scoreVideo(title, customTopics, standardCardName);

      
      sendResponse({
        success: true,
        title,
        similarity: score,
        device: activeDevice,
      });
    } catch (err) {
      sendResponse({ Error: err instanceof Error ? err.message : String(err) });
    }
  })();

  return true; // keep channel open for async work
});

chrome.runtime.sendMessage({ target: "offscreen-ready" });