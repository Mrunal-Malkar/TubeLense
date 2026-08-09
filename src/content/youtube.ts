/* eslint-disable @typescript-eslint/no-explicit-any */
import { extractYoutubeChannelName, extractYoutubeTitle } from "../functions/youtube_helper";
import { YOUTUBE_VIDEO_SELECTORS } from "../lib/selectors";
import { getRelativityScore } from "./content";

let youtubeObserver: MutationObserver | null = null;
let youtubeNavigateFinishHandler: (() => void) | null = null;


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
    const currentChannelName=extractYoutubeChannelName(videoContainer);
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
    videoContainer.setAttribute("data-extension-signature", currentTitle);

    try {
      const relativityScore = await getRelativityScore(`${currentChannelName}:${currentTitle}`);
      (videoContainer as HTMLElement).style.display =
        relativityScore <= 0.1 ? "none" : "";
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
    el.removeAttribute("data-extension-signature");
    el.removeAttribute("data-extension-processing");
  });
}
