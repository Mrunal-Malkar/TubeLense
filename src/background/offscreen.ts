/* eslint-disable @typescript-eslint/no-explicit-any */
import { env, pipeline } from "@huggingface/transformers";
import { getOppositeTitle } from "../functions/get";
import { CENTROIDS, type CardName } from "../lib/cards";

// This file runs inside an offscreen document — a real page with `window`
// and `document` — which is why the ONNX WASM backend (and WebGPU) can
// actually initialize here. A background service worker has neither, and
// this version of onnxruntime-web hard-references `window` during init,
// which is what caused "no available backend found" / "window is not
// defined" when we ran this in background.ts directly.
console.log("[offscreen] startup: initializing offscreen pipeline config");
if (env.backends.onnx.wasm) {
  env.backends.onnx.wasm.wasmPaths = chrome.runtime.getURL("wasm/");
  env.backends.onnx.wasm.numThreads = 1;
  env.backends.onnx.wasm.proxy = false;
  console.log("[offscreen] wasm backend config set", {
    wasmPaths: chrome.runtime.getURL("wasm/"),
    numThreads: env.backends.onnx.wasm.numThreads,
    proxy: env.backends.onnx.wasm.proxy,
  });
} else {
  console.log("[offscreen] wasm backend config missing, using default fallback");
}

let extractorPromise: Promise<any> | null = null;
let activeDevice: "webgpu" | "wasm" | null = null;

async function isWebGPUAvailable(): Promise<boolean> {
  console.log("[offscreen] checking WebGPU availability");
  try {
    if (typeof navigator === "undefined" || !(navigator as any).gpu) {
      console.log("[offscreen] navigator.gpu unavailable");
      return false;
    }
    const adapter = await (navigator as any).gpu.requestAdapter();
    const available = Boolean(adapter);
    console.log("[offscreen] WebGPU adapter result", { available, adapterName: adapter?.name ?? "none" });
    return available;
  } catch (err) {
    console.log("[offscreen] WebGPU adapter check failed", err);
    return false;
  }
}

async function createExtractor(device: "webgpu" | "wasm") {
  console.log(`[offscreen] Initializing extractor pipeline on ${device}...`);
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { device });
  console.log("[offscreen] extractor created successfully", { device });
  return extractor;
}

function getExtractor() {
  
  if (extractorPromise) {
    console.log("[offscreen] Reusing existing extractor promise", { activeDevice });
    return extractorPromise;
  }

  console.log("[offscreen] no extractor yet, creating one");

  extractorPromise = (async () => {
    const webGPUAvailable = await isWebGPUAvailable();

    if (webGPUAvailable) {
      try {
        const extractor = await createExtractor("webgpu");
        activeDevice = "webgpu";
        console.log("[offscreen] extractor ready on webgpu", { activeDevice });
        return extractor;
      } catch (err) {
        console.log("[offscreen] WebGPU pipeline init failed, falling back to wasm", err);
        // fall through to wasm below
      }
    } else {
      console.log("[offscreen] WebGPU unavailable, using wasm");
    }

    const extractor = await createExtractor("wasm");
    activeDevice = "wasm";
    console.log("[offscreen] extractor ready on wasm", { activeDevice });
    return extractor;
  })();

  return extractorPromise;
}

function normalizeEmbedding(output: any): number[] {
  console.log("[offscreen] normalizeEmbedding input type", { type: Array.isArray(output) ? "array" : typeof output, keys: output ? Object.keys(output).slice(0, 5) : [] });
  if (typeof output?.toArray === "function") {
    const value = output.toArray();
    console.log("[offscreen] normalizeEmbedding from toArray", { length: value.length });
    return value;
  }
  if (Array.isArray(output)) {
    console.log("[offscreen] normalizeEmbedding from array", { length: output.length });
    return output;
  }
  if (Array.isArray(output?.data)) {
    console.log("[offscreen] normalizeEmbedding from output.data", { length: output.data.length });
    return output.data;
  }
  if (output?.data && typeof output.data.length === "number") {
    const value = Array.from(output.data) as number[];
    console.log("[offscreen] normalizeEmbedding from Array.from(output.data)", { length: value.length });
    return value;
  }
  if (typeof output?.tolist === "function") {
    const value = output.tolist();
    console.log("[offscreen] normalizeEmbedding from tolist", { length: value.length });
    return value;
  }
  console.log("[offscreen] normalizeEmbedding could not parse embedding output", output);
  return [];
}

function cosineSimilarity(a: number[], b: number[]): number {
  console.log("[offscreen] cosineSimilarity start", { aLen: a.length, bLen: b.length, match: a.length === b.length });
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    console.log("[offscreen] cosineSimilarity early exit: invalid vectors");
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
  console.log("[offscreen] cosineSimilarity computed", { dot, normA, normB, denom, similarity });
  return similarity;
}

async function embedText(extractor: any, text: string): Promise<number[]> {
  console.log("[offscreen] embedding text", { textPreview: text.slice(0, 180), length: text.length });
  const output = await extractor(text, { pooling: "mean", normalize: true });
  const embedding = normalizeEmbedding(output);
  console.log("[offscreen] embedding result length", { length: embedding.length, sample: embedding.slice(0, 10) });
  return embedding;
}

function getCentroidByCardName(cardName: string): number[] | undefined {
  console.log("[offscreen] resolving centroid for card", { cardName });

  for (const [key, value] of Object.entries(CENTROIDS)) {
    console.log("check if",key,"is same as",cardName)
    if (key === cardName) {
      console.log("[offscreen] matched centroid key", { key, valueLength: value.length },"value:",value);
      return value;
    }
  }

  console.log("[offscreen] no centroid match found for card", { cardName });
  return undefined;
}

async function scoreVideo(
  title: string,
  customTopics?: string[] | string,
  standardCardName?: CardName,
): Promise<number> {
  console.log("[offscreen] scoreVideo start", {
    title,
    customTopics,
    standardCardName,
    customTopicsType: Array.isArray(customTopics) ? "array" : typeof customTopics,
  });

  const extractor = await getExtractor();
  const titleEmb = await embedText(extractor, title);
  console.log("[offscreen] title embedding ready", { titleLength: title.length, embeddingLength: titleEmb.length });

  if (standardCardName) {
    console.log("[offscreen] scoring using standard card path");
    const userCardCentroid = getCentroidByCardName(standardCardName);
    const oppositeCardName = getOppositeTitle(standardCardName);
    const oppositeCardCentroid = oppositeCardName
    ? getCentroidByCardName(oppositeCardName)
    : undefined;
    console.log("the userCardCentroid:",userCardCentroid,"oppositeCardCentroid:",oppositeCardCentroid);

    console.log("[offscreen] standard-card centroid debug", {
      standardCardName,
      oppositeCardName,
      hasUserCardCentroid: Boolean(userCardCentroid),
      hasOppositeCardCentroid: Boolean(oppositeCardCentroid),
      userCardCentroidLength: userCardCentroid?.length ?? 0,
      oppositeCardCentroidLength: oppositeCardCentroid?.length ?? 0,
    });

    if (!userCardCentroid) {
      console.log("[offscreen] no user centroid found, returning 0");
      return 0;
    }

    const simUserCard = cosineSimilarity(titleEmb, userCardCentroid);
    const simOppositeCard = oppositeCardCentroid
      ? cosineSimilarity(titleEmb, oppositeCardCentroid)
      : 0;
    const finalScore = simUserCard - simOppositeCard;
    console.log("[offscreen] standard-card final score", {
      simUserCard,
      simOppositeCard,
      finalScore,
    });

    return finalScore;
  }

  if (customTopics) {
    const topicText = Array.isArray(customTopics)
      ? customTopics.join(", ")
      : customTopics;
    console.log("[offscreen] scoring using custom topics", { topicText, topicCount: Array.isArray(customTopics) ? customTopics.length : 1 });
    const topicsEmbedding = await embedText(extractor, topicText);
    const similarity = cosineSimilarity(titleEmb, topicsEmbedding);
    console.log("[offscreen] custom-topic similarity", { similarity });
    return similarity;
  }

  console.log("[offscreen] no scoring path matched, returning 0");
  return 0;
}

// Only handle messages specifically routed to the offscreen document by the
// background script (see background.ts's `target: "offscreen"` wrapper),
// so we don't double-handle messages meant elsewhere.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("[offscreen] incoming message", message);
  
  // Adapted to check for the scoring task. 
  // You can adjust the task string to match what your background script sends.
  if (message?.target !== "offscreen" || (message?.task !== "score_video" && message?.task !== "evaluate_relativity")) {
    console.log("[offscreen] ignoring message: not offscreen scoring task", { target: message?.target, task: message?.task });
    return false;
  }

  (async () => {
    try {
      console.log("[offscreen] score_video message received", message);
      
      // Extract title from message (handles both potential structures during migration)
      const title = message.title ?? message.text ?? message.firstArgument;
      const customTopics = message.customTopics ?? message.secondArgument;
      const standardCardName = message.standardCardName;
      console.log("[offscreen] extracted payload", {
        title,
        customTopics,
        standardCardName,
        hasCustomTopics: Boolean(customTopics),
      });

      const score = await scoreVideo(title, customTopics, standardCardName);

      console.log("[offscreen] final score before response", { score, device: activeDevice, title });
      
      sendResponse({
        success: true,
        title,
        similarity: score,
        device: activeDevice,
      });
      console.log("[offscreen] response sent", {
        success: true,
        title,
        similarity: score,
        device: activeDevice,
      });
    } catch (err) {
      console.log("[offscreen] score_video failed", err);
      sendResponse({ Error: err instanceof Error ? err.message : String(err) });
    }
  })();

  return true; // keep channel open for async work
});

console.log("[offscreen] registering ready ping");
chrome.runtime.sendMessage({ target: "offscreen-ready" });