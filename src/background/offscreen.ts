/* eslint-disable @typescript-eslint/no-explicit-any */
import { env, pipeline } from "@huggingface/transformers";

// This file runs inside an offscreen document — a real page with `window`
// and `document` — which is why the ONNX WASM backend (and WebGPU) can
// actually initialize here. A background service worker has neither, and
// this version of onnxruntime-web hard-references `window` during init,
// which is what caused "no available backend found" / "window is not
// defined" when we ran this in background.ts directly.
if(env.backends.onnx.wasm){
    env.backends.onnx.wasm.wasmPaths = chrome.runtime.getURL("wasm/");
    env.backends.onnx.wasm.numThreads = 1;
    env.backends.onnx.wasm.proxy = false;
}else{
    console.log("no env..backend.onnx.wasm , so this is a else console log")
}

let extractorPromise: Promise<any> | null = null;
let activeDevice: "webgpu" | "wasm" | null = null;

async function isWebGPUAvailable(): Promise<boolean> {
  try {
    if (typeof navigator === "undefined" || !(navigator as any).gpu) {
      return false;
    }
    const adapter = await (navigator as any).gpu.requestAdapter();
    return Boolean(adapter);
  } catch (err) {
    console.log("[offscreen] WebGPU adapter check failed", err);
    return false;
  }
}

async function createExtractor(device: "webgpu" | "wasm") {
  console.log(`[offscreen] Initializing extractor pipeline on ${device}...`);
  return pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { device });
}

async function getExtractor() {
  if (extractorPromise) {
    console.log("[offscreen] Reusing existing extractor promise", { activeDevice });
    return extractorPromise;
  }

  const webGPUAvailable = await isWebGPUAvailable();

  if (webGPUAvailable) {
    try {
      extractorPromise = createExtractor("webgpu");
      await extractorPromise;
      activeDevice = "webgpu";
      return extractorPromise;
    } catch (err) {
      console.log("[offscreen] WebGPU pipeline init failed, falling back to wasm", err);
      extractorPromise = null;
    }
  } else {
    console.log("[offscreen] WebGPU unavailable, using wasm");
  }

  extractorPromise = createExtractor("wasm");
  activeDevice = "wasm";
  return extractorPromise;
}

function normalizeEmbedding(output: any): number[] {
  if (typeof output?.toArray === "function") return output.toArray();
  if (Array.isArray(output)) return output;
  if (Array.isArray(output?.data)) return output.data;
  if (output?.data && typeof output.data.length === "number") return Array.from(output.data);
  if (typeof output?.tolist === "function") return output.tolist();
  console.log("[offscreen] normalizeEmbedding could not parse embedding output", output);
  return [];
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

async function embedText(extractor: any, text: string): Promise<number[]> {
  const output = await extractor(text, { pooling: "mean", normalize: true });
  return normalizeEmbedding(output);
}

async function handleTransformerMessage(firstArgument: string, secondArgument: string) {
  const extractor = await getExtractor();
  const [embeddingA, embeddingB] = await Promise.all([
    embedText(extractor, firstArgument),
    embedText(extractor, secondArgument),
  ]);
  const similarity = cosineSimilarity(embeddingA, embeddingB);
  console.log("[offscreen] similarity score:", similarity, { device: activeDevice });
  return {
    success: true,
    firstArgument,
    secondArgument,
    similarity,
    device: activeDevice,
  };
}

// Only handle messages specifically routed to the offscreen document by the
// background script (see background.ts's `target: "offscreen"` wrapper),
// so we don't double-handle messages meant elsewhere.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("The offscreen is called!! and this is the message object:",message);
  if (message?.target !== "offscreen" || message?.task !== "evaluate_relativity") {
    return false;
  }

  (async () => {
    try {
      console.log("[offscreen] evaluate_relativity message received", message);
      const res = (await handleTransformerMessage(message.firstArgument,JSON.stringify(message.secondArgument))) ?? "sample";
      sendResponse(res);
    } catch (err) {
      console.log("[offscreen] evaluate_relativity failed", err);
      sendResponse({ Error: err instanceof Error ? err.message : String(err) });
    }
  })();

  return true; // keep channel open for async work
});