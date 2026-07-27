/* eslint-disable @typescript-eslint/no-explicit-any */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("received the popup msg", message);
  if (message.task == "activate_extension") {
    console.log("activate_extension received", { senderUrl: sender?.url });
    localStorage.setItem("lens_activate", "true");
    console.log("lens_activation stored in localStorage");
    sendResponse({ isActive: true, message: "done!" });
  } else {
    console.log("no such message", sender);
  }
  return true;
});

// --- Initialize State ---
chrome.storage.local.get(["lens_active"], (result) => {
  console.log("reult:", result.lens_active);
  if (result.lens_active === true) {
    console.log("starting to filter");
    startFiltering();
  } else {
    console.log("extension state is not active yet", result);
  }
});

// --- Listen for Real-time Changes (from Popup) ---
chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log("storage changed", { namespace, changes });
  if (namespace === "local" && changes.lens_active) {
    if (changes.lens_active.newValue == true) {
      console.log("starting the filtering.");
      startFiltering();
    } else {
      console.log("stopping the filtering", changes.lens_active);
      stopFiltering();
    }
  }
});

let observer: MutationObserver | null = null;
let navigateFinishHandler: (() => void) | null = null;

// Every container type YouTube uses across Home, Search, Watch (related/sidebar),
// Subscriptions, Channel pages, and Shorts shelves. YouTube changes these
// periodically (the ongoing "Lockup" redesign) — if a video type still isn't
// getting flagged, inspect it in devtools and add its tag name here.
const VIDEO_SELECTORS = [
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
const TITLE_SELECTORS = [
  "#video-title",
  "yt-formatted-string#video-title",
  ".yt-lockup-metadata-view-model__heading-reset",
  "h3 a",
  "a#video-title-link",
];

function extractTitle(container: Element): string {
  for (const sel of TITLE_SELECTORS) {
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

function debounce<T extends (...args: any[]) => void>(fn: T, waitMs: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };
}

// --- Core Logic ---
async function processVideos() {
  const videoElements = document.querySelectorAll(VIDEO_SELECTORS);

  videoElements.forEach(async (videoContainer) => {
    // Prevent overlapping async passes on the same node.
    if (videoContainer.hasAttribute("data-extension-processing")) return;

    const currentTitle = extractTitle(videoContainer);
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
      (videoContainer as HTMLElement).style.backgroundColor =
        relativityScore <= 0.25 ? "yellow" : "";
    } finally {
      videoContainer.removeAttribute("data-extension-processing");
    }
  });
}

const scheduleProcessVideos = debounce(() => {
  processVideos();
}, 150);

// --- Lifecycle Management ---
async function startFiltering() {
  console.log("startFiltering called");
  if (observer) return; // Already running

  if (document.readyState === "loading") {
    await new Promise<void>((resolve) =>
      document.addEventListener("DOMContentLoaded", () => resolve(), { once: true })
    );
  }

  observer = new MutationObserver(() => scheduleProcessVideos());
  observer.observe(document.body, { childList: true, subtree: true });

  // YouTube is an SPA: navigating Home -> Search -> Subscriptions etc. does
  // NOT reload the page, it fires this custom event instead. Hooking it
  // makes flagging kick in immediately on navigation rather than waiting on
  // whatever DOM mutations happen to fire.
  navigateFinishHandler = () => scheduleProcessVideos();
  document.addEventListener("yt-navigate-finish", navigateFinishHandler);

  processVideos(); // Catch existing videos already on the page
}

function stopFiltering() {
  console.log("stopFiltering called");
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  if (navigateFinishHandler) {
    document.removeEventListener("yt-navigate-finish", navigateFinishHandler);
    navigateFinishHandler = null;
  }
  document.querySelectorAll(VIDEO_SELECTORS).forEach((el) => {
    (el as HTMLElement).style.backgroundColor = "";
    el.removeAttribute("data-extension-title");
    el.removeAttribute("data-extension-processing");
  });
}

async function getRelativityScore(videoTitle: string) {
  console.log("sending relativity check for title", videoTitle);
  try {
    const response = await chrome.runtime.sendMessage({
      task: "evaluate_relativity",
      text: videoTitle,
    });
    console.log("relativity response received", response, "as number", Number(response.similarity));
    if (!response.success) return 1;

    return Number(response.similarity);
  } catch (error) {
    console.log("getRelativityScore failed", error);
    return 1;
  }
}