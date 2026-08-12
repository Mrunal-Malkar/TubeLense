/* eslint-disable @typescript-eslint/no-explicit-any */

import { CARD_DATA } from "../lib/cards";
import type { PreferencesState, TopicsPack } from "../store/baseInfoStore";
import { initStore } from "../store/store";

let creatingOffscreenDocument: Promise<void> | null = null;
let userPreferredTopics: string[] | undefined;
let isStandardCard: boolean;
let cardName: string | undefined;

// Resolves once the offscreen document has told us it's actually listening.
let offscreenReady: Promise<void> | null = null;
let resolveOffscreenReady: (() => void) | null = null;

function getOffscreenDocumentPath(): string {
  return chrome.runtime.getURL("src/background/offscreen.html");
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

function resetReadyGate() {
  offscreenReady = new Promise((resolve) => {
    resolveOffscreenReady = resolve;
  });
}

async function ensureOffscreenDocument() {
  if (await hasOffscreenDocument()) {
    // Document exists (e.g. survived a service worker restart) but we have
    // no readiness promise for it in this SW lifetime — assume it's ready
    // since it must have already signalled once to exist stably. If you
    // want to be extra safe you could re-ping it here instead.
    if (!offscreenReady) resetReadyGate();
    if (resolveOffscreenReady) resolveOffscreenReady();
    return;
  }

  if (creatingOffscreenDocument) {
    await creatingOffscreenDocument;
    return;
  }

  console.log("creating the offscreen file.");
  resetReadyGate();

  creatingOffscreenDocument = chrome.offscreen.createDocument({
    url: getOffscreenDocumentPath(),
    reasons: [chrome.offscreen.Reason.WORKERS],
    justification:
      "Run @huggingface/transformers feature-extraction pipeline, which requires window/DOM APIs not available in a service worker.",
  });

  try {
    await creatingOffscreenDocument;
  } finally {
    creatingOffscreenDocument = null;
  }

  // Wait for the offscreen doc to announce it's actually ready to receive
  // messages (its script loaded + pipeline initialized), with a timeout
  // so we don't hang forever if something goes wrong.
  await Promise.race([
    offscreenReady,
    new Promise<void>((_, reject) =>
      setTimeout(
        () => reject(new Error("Offscreen document readiness timed out")),
        15000,
      ),
    ),
  ]);
}

// Listen for the offscreen document's "I'm ready" ping.
chrome.runtime.onMessage.addListener((message) => {
  if (message?.target === "offscreen-ready") {
    console.log("offscreen document signalled ready.");
    if (!resolveOffscreenReady) resetReadyGate();
    resolveOffscreenReady?.();
  }
});

// Wrap sendMessage with a couple of retries to absorb any remaining
// timing flakiness (e.g. "Could not establish connection" races).
async function sendToOffscreen(payload: any, attempts = 3): Promise<any> {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await chrome.runtime.sendMessage(payload);
      if (res !== undefined) return res;
    } catch (err) {
      if (i === attempts - 1) throw err;
    }
    await new Promise((r) => setTimeout(r, 300 * (i + 1)));
  }
  throw new Error("No response from offscreen document after retries");
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
  const pack: TopicsPack | undefined = preference?.topicsPack.find(
    (i) => i.label === preference.activeTopicPack,
  );

  if (pack && CARD_DATA.some((i) => i.name === pack.label)) {
    cardName = pack.label;
    isStandardCard = true;
    userPreferredTopics = undefined;
  } else {
    isStandardCard = false;
    cardName = undefined;
    userPreferredTopics = pack?.topics.map((topic) => topic.topic);
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.task === "evaluate_relativity") {
    (async () => {
      if (!userPreferredTopics && !isStandardCard) {
        const preference: PreferencesState = (await initStore()).getState()
          .preference;
        const pack: TopicsPack | undefined = preference?.topicsPack.find(
          (i) => i.label === preference.activeTopicPack,
        );

        if (pack && CARD_DATA.some((i) => i.name === pack.label)) {
          cardName = pack.label;
          isStandardCard = true;
          userPreferredTopics = undefined;
        } else {
          isStandardCard = false;
          cardName = undefined;
          userPreferredTopics = pack?.topics.map((topic) => topic.topic);
        }
      }
      try {
        await ensureOffscreenDocument();

        if (isStandardCard && cardName) {
          const res = await sendToOffscreen({
            target: "offscreen",
            task: "evaluate_relativity",
            title: message.text,
            standardCardName: cardName,
          });
          sendResponse(res);
          return;
        }

        if (!userPreferredTopics || userPreferredTopics.length === 0) {
          throw new Error("userPreferredTopics is undefined or empty");
        }

        const res = await sendToOffscreen({
          target: "offscreen",
          task: "evaluate_relativity",
          title: message.text,
          customTopics: userPreferredTopics,
        });
        sendResponse(res);
      } catch (err) {
        sendResponse({ Error: err instanceof Error ? err.message : err });
      }
    })();
    return true; // keep channel open
  }
  sendResponse({ message: "No such message" });
});
