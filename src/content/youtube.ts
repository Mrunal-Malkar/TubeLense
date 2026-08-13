/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  extractYoutubeChannelName,
  extractYoutubeTitle,
  youtubeFilterationCheck,
} from "../functions/youtube_helper";
import { YOUTUBE_VIDEO_SELECTORS } from "../lib/selectors";
import type { PreferencesState } from "../store/baseInfoStore";
import { getRelativityScore } from "./content";

console.log("youtube.ts loaded", { href: location.href });

let youtubeObserver: MutationObserver | null = null;
let youtubeNavigateFinishHandler: (() => void) | null = null;
let userPrefferedStrictness: string;
const scoredThisPass = new Map<string, { score: number; check: boolean }>();

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace !== "local") return;

  const preference = changes.preference?.newValue as PreferencesState;
  console.log("youtube.ts message event preference:", preference);
  if (preference) {
    userPrefferedStrictness = preference.strictness;
  }
});

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  waitMs: number,
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    try {
      console.log("debounce called", { waitMs, args });
    } catch (e) {
      /* ignore logging errors */
      console.log("debounce error",e)
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };
}

function getTopLevelVideoElements(): Element[] {
  const all = Array.from(document.querySelectorAll(YOUTUBE_VIDEO_SELECTORS));
  return all.filter(
    (el) => !all.some((other) => other !== el && other.contains(el)),
  );
}

// Log discovery of top-level video elements
try {
  const _ = getTopLevelVideoElements();
  console.log("getTopLevelVideoElements initial count", _.length);
} catch (e) {
  /* ignore during initialization */
  console.log("getTopLevelVideoElements error",e);
}

// --- Core Logic ---
export async function processYoutubeVideos() {
  const videoElements = getTopLevelVideoElements();
  console.log("processYoutubeVideos - found videoElements", videoElements.length, {
    scoredThisPassSize: scoredThisPass.size,
  });

  videoElements.forEach(async (videoContainer) => {
    console.log("processing videoContainer", videoContainer.nodeName);
    // Prevent overlapping async passes on the same node.
    if (videoContainer.hasAttribute("data-extension-processing")) return;

    const currentTitle = extractYoutubeTitle(videoContainer);
    const currentChannelName = extractYoutubeChannelName(videoContainer);
    if (!currentTitle) {
      // Title not rendered/bound yet (lazy-loaded tile). Don't mark it —
      // the next mutation batch (or debounced pass) will retry it.
      console.log("processYoutubeVideos - title not ready for", currentChannelName, videoContainer);
      return;
    }

    // YouTube recycles DOM nodes in list views (e.g. re-searching reuses the
    // same ytd-video-renderer instances with new data bound in). Fingerprint
    // on the title text itself instead of a one-time boolean flag, so a
    // recycled node with a new video gets reprocessed automatically.
    const previouslyScoredTitle = videoContainer.getAttribute(
      "data-extension-title",
    );
    if (previouslyScoredTitle === currentTitle) return;
    const key = `${currentChannelName}:${currentTitle}`; // same key you use for scoring
    console.log("this is the key",key);
    if (scoredThisPass.has(key)) {
      const cached = scoredThisPass.get(key)!;
      (videoContainer as HTMLElement).style.backgroundColor = cached.check
        ? "yellow"
        : "";
      videoContainer.setAttribute("data-extension-title", currentTitle);
      console.log("reused cached score for", key, cached);
      return; // skip the actual model call, reuse the result
    }
    videoContainer.setAttribute("data-extension-processing", "true");
    videoContainer.setAttribute("data-extension-signature", currentTitle);
    console.log("marked video as processing", key);

    try {
      console.log("this is the quee", scoredThisPass);
      const relativityScore = await getRelativityScore(
        `${currentChannelName}:${currentTitle}`,
      );
      if (!userPrefferedStrictness) {
        const result = await chrome.storage.local.get("preference");
        const preference = result.preference as PreferencesState;
        userPrefferedStrictness = preference?.strictness ?? "balanced"; // or whatever default you want
        console.log("userPreferredStrictness", userPrefferedStrictness);
      }
      const check =
        youtubeFilterationCheck(relativityScore, userPrefferedStrictness) ?? false;
      scoredThisPass.set(key, { score: relativityScore, check });
      console.log("coloring the video if i should", relativityScore, { key, check });
      // (videoContainer as HTMLElement).style.display = check ? "none" : "";
      (videoContainer as HTMLElement).style.backgroundColor = check
        ? "yellow"
        : "";
      console.log("did what i should,check:", check);
    } finally {
      videoContainer.removeAttribute("data-extension-processing");
    }
  });
}

export const scheduleProcessYoutubeVideos = debounce(() => {
  processYoutubeVideos();
}, 150);

// --- Lifecycle Management ---
export async function startYoutubeFiltering() {
  console.log("startYoutubeFiltering called");
  if (youtubeObserver) return; // Already running

  if (document.readyState === "loading") {
    await new Promise<void>((resolve) =>
      document.addEventListener("DOMContentLoaded", () => resolve(), {
        once: true,
      }),
    );
  }

  youtubeObserver = new MutationObserver(() => scheduleProcessYoutubeVideos());
  youtubeObserver.observe(document.body, { childList: true, subtree: true });

  // YouTube is an SPA: navigating Home -> Search -> Subscriptions etc. does
  // NOT reload the page, it fires this custom event instead. Hooking it
  // makes flagging kick in immediately on navigation rather than waiting on
  // whatever DOM mutations happen to fire.
  youtubeNavigateFinishHandler = () => scheduleProcessYoutubeVideos();
  document.addEventListener("yt-navigate-finish", youtubeNavigateFinishHandler);

  processYoutubeVideos(); // Catch existing videos already on the page
}

export function stopYoutubeFiltering() {
  console.log("stopYoutubeFiltering called");
  if (youtubeObserver) {
    youtubeObserver.disconnect();
    youtubeObserver = null;
  }
  if (youtubeNavigateFinishHandler) {
    document.removeEventListener(
      "yt-navigate-finish",
      youtubeNavigateFinishHandler,
    );
    youtubeNavigateFinishHandler = null;
  }
  document.querySelectorAll(YOUTUBE_VIDEO_SELECTORS).forEach((el) => {
    (el as HTMLElement).style.backgroundColor = "";
    // (el as HTMLElement).style.display = "";
    el.removeAttribute("data-extension-signature");
    el.removeAttribute("data-extension-processing");
  });
  scoredThisPass.clear();
}
