/* eslint-disable @typescript-eslint/no-explicit-any */

import { getRelativityScore } from "./content";

let youtubeObserver: MutationObserver | null = null;
let youtubeNavigateFinishHandler: (() => void) | null = null;

// Every container type YouTube uses across Home, Search, Watch (related/sidebar),
// Subscriptions, Channel pages, and Shorts shelves. YouTube changes these
// periodically (the ongoing "Lockup" redesign) — if a video type still isn't
// getting flagged, inspect it in devtools and add its tag name here.
const YOUTUBE_VIDEO_SELECTORS = [
  "ytd-rich-item-renderer", // Home page grid
  "ytd-video-renderer", // Search results, many shelves
  "ytd-compact-video-renderer", // Watch page sidebar / "related" list
  "ytd-grid-video-renderer", // Channel / subscriptions grid (older layout)
  "ytd-playlist-video-renderer", // Inside playlists
  "ytd-playlist-panel-video-renderer", // Queue / "up next" panel
  "ytd-reel-item-renderer", // Shorts shelf entries (legacy markup)
  "yt-lockup-view-model", // New "Lockup" redesign — increasingly used everywhere
].join(", ");

// Multiple strategies for pulling a title out of a container, since old and
// new (Lockup) renderer markup differ, and some elements expose title only
// via aria-label before the visible text node is populated.
const YOUTUBE_TITLE_SELECTORS = [
  "#video-title",
  "yt-formatted-string#video-title",
  ".yt-lockup-metadata-view-model__heading-reset",
  "h3 a",
  "a#video-title-link",
];

export function extractYoutubeTitle(container: Element): string {
  for (const sel of YOUTUBE_TITLE_SELECTORS) {
    const el = container.querySelector(sel);
    const text = el?.textContent?.trim();
    if (text) return text;
  }
  // Fallback: the thumbnail/title anchor's aria-label often carries the full
  // title (plus metadata) even before the visible title node has bound text.
  const link = container.querySelector("a#thumbnail, a") as HTMLAnchorElement | null;
  const label = link?.getAttribute("aria-label")?.trim();
  if (label) return label;
  return "";
}

export function debounce<T extends (...args: any[]) => void>(fn: T, waitMs: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };
}

// --- Core Logic ---
export async function processYoutubeVideos() {
  const videoElements = document.querySelectorAll(YOUTUBE_VIDEO_SELECTORS);

  videoElements.forEach(async (videoContainer) => {
    // Prevent overlapping async passes on the same node.
    if (videoContainer.hasAttribute("data-extension-processing")) return;

    const currentTitle = extractYoutubeTitle(videoContainer);
    if (!currentTitle) {
      // Title not rendered/bound yet (lazy-loaded tile). Don't mark it —
      // the next mutation batch (or debounced pass) will retry it.
      return;
    }

    // YouTube recycles DOM nodes in list views (e.g. re-searching reuses the
    // same ytd-video-renderer instances with new data bound in). Fingerprint
    // on the title text itself instead of a one-time boolean flag, so a
    // recycled node with a new video gets reprocessed automatically.
    const previouslyScoredTitle = videoContainer.getAttribute("data-extension-title");
    if (previouslyScoredTitle === currentTitle) return;

    videoContainer.setAttribute("data-extension-processing", "true");
    videoContainer.setAttribute("data-extension-title", currentTitle);

    try {
      const relativityScore = await getRelativityScore(currentTitle);
      (videoContainer as HTMLElement).style.display =
        relativityScore <= 0.25 ? "none" : "";
      // (videoContainer as HTMLElement).style.backgroundColor =
      //   relativityScore <= 0.25 ? "yellow" : "";
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
      document.addEventListener("DOMContentLoaded", () => resolve(), { once: true })
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
    document.removeEventListener("yt-navigate-finish", youtubeNavigateFinishHandler);
    youtubeNavigateFinishHandler = null;
  }
  document.querySelectorAll(YOUTUBE_VIDEO_SELECTORS).forEach((el) => {
    // (el as HTMLElement).style.backgroundColor = "";
    (el as HTMLElement).style.display = "";
    el.removeAttribute("data-extension-title");
    el.removeAttribute("data-extension-processing");
  });
}
