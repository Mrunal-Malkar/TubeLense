/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addBlockedVideo,
} from "../storage/yt";
import {extractYoutubeChannelName,
extractYoutubeTitle,
recordFilterResult,
resetMismatchTracker,
youtubeFilterationCheck,} from "../functions/youtube_helper"
import { YOUTUBE_VIDEO_SELECTORS } from "../lib/selectors";
import type { PreferencesState } from "../store/baseInfoStore";
import { getRelativityScore } from "./content";
import { showMismatchBanner } from "../components/small_components/MismatchedBanner";

console.log("youtube.ts loaded", { href: location.href });

let youtubeObserver: MutationObserver | null = null;
let youtubeNavigateFinishHandler: (() => void) | null = null;
let userPrefferedStrictness: string;
const scoredThisPass = new Map<string, { score: number; check: boolean }>();

// --- NEW: visibility-gated scoring ---
let intersectionObserver: IntersectionObserver | null = null;

const PENDING_STYLE = {
  opacity: "0.15",
  filter: "blur(6px)",
  transition: "opacity 0.25s ease, filter 0.25s ease",
};

function applyPendingStyle(el: HTMLElement) {
  el.style.transition = PENDING_STYLE.transition;
  el.style.opacity = PENDING_STYLE.opacity;
  el.style.filter = PENDING_STYLE.filter;
}

// inside applyRevealStyle, extend the signature to carry what's needed for the record
function applyRevealStyle(
  el: HTMLElement,
  check: boolean,
  meta: { key: string; title: string; channelName: string; score: number },
) {
  if (check) {
    console.log("making it go invisible.")
    el.style.opacity = "0";
    el.style.filter = "blur(6px)";
    setTimeout(() => {
      el.style.display = "none";
    }, 220);

    addBlockedVideo({
      key: meta.key,
      title: meta.title,
      channelName: meta.channelName,
      score: meta.score,
    }).catch((err) =>
      console.log("[youtube] failed to record blocked video", err),
    );
  } else {
    el.style.display = "";
    el.style.opacity = "1";
    el.style.filter = "";
  }
}

function getIntersectionObserver(): IntersectionObserver {
  if (intersectionObserver) return intersectionObserver;

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        intersectionObserver!.unobserve(el); // score once, then stop watching
        scoreVideoElement(el);
      }
    },
    {
      root: null, // viewport
      rootMargin: "400px 0px", // start scoring ~400px before it's actually visible
      threshold: 0,
    },
  );

  return intersectionObserver;
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace !== "local") return;
  const preference = changes.preference?.newValue as PreferencesState;
  if (preference) {
    console.log("youtube.ts message event preference:", preference);
    userPrefferedStrictness = preference.strictness;
  }
});

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  waitMs: number,
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
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

// --- NEW: the actual scoring logic, now only invoked once an element is
// about to be visible (called from the IntersectionObserver callback) ---
async function scoreVideoElement(videoContainer: Element) {
  if (videoContainer.hasAttribute("data-extension-processing")) return;

  const currentTitle = extractYoutubeTitle(videoContainer);
  const currentChannelName = extractYoutubeChannelName(videoContainer);
  if (!currentTitle) return; // title still not bound — just drop it, discovery pass will re-catch it later

  const previouslyScoredTitle = videoContainer.getAttribute(
    "data-extension-title",
  );
  if (previouslyScoredTitle === currentTitle) return;

  const key = `${currentChannelName}:${currentTitle}`;
  const el = videoContainer as HTMLElement;

  if (scoredThisPass.has(key)) {
    const cached = scoredThisPass.get(key)!;
    applyRevealStyle(el, cached.check, {
      key,
      title: currentTitle,
      channelName: currentChannelName ?? "",
      score: cached.score,
    });
    videoContainer.setAttribute("data-extension-title", currentTitle);
    return;
  }

  videoContainer.setAttribute("data-extension-processing", "true");
  videoContainer.setAttribute("data-extension-signature", currentTitle);
  videoContainer.setAttribute("data-extension-title", currentTitle);

  try {
    const relativityScore = await getRelativityScore(key);
      console.log("got the relativity score in youtube.ts for title",currentTitle,"it's",relativityScore);
    if (!userPrefferedStrictness) {
      const result = await chrome.storage.local.get("preference");
      const preference = result.preference as PreferencesState;
      userPrefferedStrictness = preference?.strictness ?? "balanced";
    }

    const check =
      youtubeFilterationCheck(relativityScore, userPrefferedStrictness) ??
      false;
      console.log("this is the check.",check,"for",currentTitle);
    scoredThisPass.set(key, { score: relativityScore, check });
    console.log("going in",currentTitle,"for applyRevealStyle")
    applyRevealStyle(el, check, {
      key,
      title: currentTitle,
      channelName: currentChannelName ?? "",
      score: relativityScore,
    });
    console.log("done with the applyRevealStyle")
    recordFilterResult(check, () => {
  showMismatchBanner({
    onAdjustStrictness: () => {
      // content scripts can't force-open the popup directly — ask background to try
      chrome.runtime.sendMessage({ action: "OPEN_POPUP_REQUEST" });
    },
    onPauseSession: () => {
      stopYoutubeFiltering(); // already defined in this file
    },
    onDismiss: () => {
      // no-op — banner just closes, filtering continues as-is
    },
  });
});
  } finally {
    videoContainer.removeAttribute("data-extension-processing");
  }
}

// --- Discovery pass: finds new video nodes, blurs them immediately, and
// hands them to the IntersectionObserver instead of scoring right away ---
export function processYoutubeVideos() {
  const videoElements = getTopLevelVideoElements();
  const observer = getIntersectionObserver();

  videoElements.forEach((videoContainer) => {
    // already discovered & being watched/scored — skip
    if (videoContainer.hasAttribute("data-extension-observed")) return;

    const currentTitle = extractYoutubeTitle(videoContainer);
    if (!currentTitle) return; // not rendered yet, next pass will catch it

    videoContainer.setAttribute("data-extension-observed", "true");

    const el = videoContainer as HTMLElement;

    // If we already have a cached score from this pass (e.g. duplicate
    // shelf entry for a video we already scored), apply it instantly —
    // no need to blur-then-reveal for something we already know about.
    const currentChannelName = extractYoutubeChannelName(videoContainer);
    const key = `${currentChannelName}:${currentTitle}`;
    if (scoredThisPass.has(key)) {
      const cached = scoredThisPass.get(key)!;
      applyRevealStyle(el, cached.check, {
        key,
        title: currentTitle,
        channelName: currentChannelName ?? "",
        score: cached.score,
      });
      videoContainer.setAttribute("data-extension-title", currentTitle);
      return;
    }

    // Genuinely new — blur immediately, then let IntersectionObserver
    // trigger the real scoring once it's about to be visible.
    applyPendingStyle(el);
    observer.observe(videoContainer);
  });
}

export const scheduleProcessYoutubeVideos = debounce(() => {
  processYoutubeVideos();
}, 150);

// --- Lifecycle Management ---
export async function startYoutubeFiltering() {
  console.log("startYoutubeFiltering called");
  if (youtubeObserver) return;

  if (document.readyState === "loading") {
    await new Promise<void>((resolve) =>
      document.addEventListener("DOMContentLoaded", () => resolve(), {
        once: true,
      }),
    );
  }

  youtubeObserver = new MutationObserver(() => scheduleProcessYoutubeVideos());
  youtubeObserver.observe(document.body, { childList: true, subtree: true });

// in the yt-navigate-finish handler, alongside your existing cache clears:
youtubeNavigateFinishHandler = () => {
  scoredThisPass.clear();
  intersectionObserver?.disconnect();
  intersectionObserver = null;
  resetMismatchTracker(); // clears the rolling window; banner stays suppressed for the tab's lifetime
  scheduleProcessYoutubeVideos();
};

  document.addEventListener("yt-navigate-finish", youtubeNavigateFinishHandler);

  processYoutubeVideos();
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
  intersectionObserver?.disconnect();
  intersectionObserver = null;

  document.querySelectorAll(YOUTUBE_VIDEO_SELECTORS).forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.backgroundColor = "";
    htmlEl.style.opacity = "";
    htmlEl.style.filter = "";
    htmlEl.style.display = "";
    htmlEl.style.transition = "";
    el.removeAttribute("data-extension-signature");
    el.removeAttribute("data-extension-processing");
    el.removeAttribute("data-extension-observed");
    el.removeAttribute("data-extension-title");
  });
  scoredThisPass.clear();
}
