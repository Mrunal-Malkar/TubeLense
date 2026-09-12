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


let youtubeObserver: MutationObserver | null = null;
let youtubeNavigateFinishHandler: (() => void) | null = null;
let userPrefferedStrictness: string;
const scoredThisPass = new Map<string, { score: number; check: boolean }>();

// --- visibility-gated scoring ---
let intersectionObserver: IntersectionObserver | null = null;

const PENDING_STYLE = {
  opacity: "0.15",
  filter: "blur(6px)",
  transition: "opacity 0.25s ease, filter 0.25s ease",
};

// --- Failure-recovery tuning ---
const MAX_TITLE_RETRIES = 5;
const TITLE_RETRY_DELAY_MS = 500;
const SAFETY_TIMEOUT_MS = 8000;

function applyPendingStyle(el: HTMLElement) {
  el.style.transition = PENDING_STYLE.transition;
  el.style.opacity = PENDING_STYLE.opacity;
  el.style.filter = PENDING_STYLE.filter;

  // Fail-safe: if this element never gets resolved for ANY reason
  // (observer never fires, scoring throws, title never appears, etc.)
  // don't leave it stuck blurred forever.
  setTimeout(() => {
    const stillPending = el.style.opacity === PENDING_STYLE.opacity;
    const resolved = el.hasAttribute("data-extension-title");
    if (stillPending && !resolved) {
      console.error(
        "[youtube-filter] video stuck blurred past safety timeout — reverting",
        el,
      );
      revertPendingStyle(el);
      el.removeAttribute("data-extension-observed"); // let discovery pick it up again
    }
  }, SAFETY_TIMEOUT_MS);
}

function revertPendingStyle(el: HTMLElement) {
  el.style.transition = "";
  el.style.opacity = "1";
  el.style.filter = "";
  el.style.display = "";
}

// inside applyRevealStyle, extend the signature to carry what's needed for the record
function applyRevealStyle(
  el: HTMLElement,
  check: boolean,
  meta: { key: string; title: string; channelName: string; score: number },
) {
  if (check) {
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
    })
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
        scoreVideoElement(el).catch((err) => {
          console.error(
            "[youtube-filter] unexpected error scoring element",
            err,
            el,
          );
          revertPendingStyle(el);
        });
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

// --- the actual scoring logic, only invoked once an element is about to be
// visible (called from the IntersectionObserver callback), with retry +
// error logging so failures can never leave a video silently stuck blurred ---
async function scoreVideoElement(
  videoContainer: Element,
  retryCount = 0,
): Promise<void> {
  if (videoContainer.hasAttribute("data-extension-processing")) return;

  const el = videoContainer as HTMLElement;
  const currentTitle = extractYoutubeTitle(videoContainer);
  const currentChannelName = extractYoutubeChannelName(videoContainer);

  if (!currentTitle) {
    if (retryCount < MAX_TITLE_RETRIES) {
      setTimeout(() => {
        scoreVideoElement(videoContainer, retryCount + 1).catch((err) => {
          console.error(
            "[youtube-filter] retry scoring threw",
            err,
            videoContainer,
          );
          revertPendingStyle(el);
        });
      }, TITLE_RETRY_DELAY_MS);
      return;
    }
    console.error(
      "[youtube-filter] title never appeared after",
      MAX_TITLE_RETRIES,
      "retries — reverting blur",
      videoContainer,
    );
    revertPendingStyle(el);
    videoContainer.removeAttribute("data-extension-observed");
    return;
  }

  const previouslyScoredTitle = videoContainer.getAttribute(
    "data-extension-title",
  );
  if (previouslyScoredTitle === currentTitle) return;

  const key = `${currentTitle}SPLIT-_-SPLIT${currentChannelName}`;

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
    if (!userPrefferedStrictness) {
      const result = await chrome.storage.local.get("preference");
      const preference = result.preference as PreferencesState;
      userPrefferedStrictness = preference?.strictness ?? "balanced";
    }

    const check =
      youtubeFilterationCheck(relativityScore, userPrefferedStrictness) ??
      false;
    scoredThisPass.set(key, { score: relativityScore, check });
    applyRevealStyle(el, check, {
      key,
      title: currentTitle,
      channelName: currentChannelName ?? "",
      score: relativityScore,
    });
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
  } catch (err) {
    console.error(
      "[youtube-filter] scoring failed for",
      currentTitle,
      err,
    );
    // fail OPEN — show the video rather than leave it permanently blurred
    revertPendingStyle(el);
    videoContainer.removeAttribute("data-extension-title");
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
    const key = `${currentTitle}SPLIT-_-SPLIT${currentChannelName}`;
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