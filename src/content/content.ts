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

// --- Site Dispatch ---
// Central place to route to the right site's filtering logic based on the
// current page's hostname. Add a new `case` + real start/stop functions
// (mirroring the Youtube* pattern above) when adding support for a new site.
function startFilteringForCurrentSite() {
  const hostname = window.location.hostname;

  switch (true) {
    case hostname.includes("youtube.com"):
      console.log("starting to filter (youtube)");
      startYoutubeFiltering();
      break;

    // case hostname.includes("twitter.com"):
    // case hostname.includes("x.com"):
    //   console.log("starting to filter (twitter)");
    //   startTwitterFiltering();
    //   break;

    // case hostname.includes("reddit.com"):
    //   console.log("starting to filter (reddit)");
    //   startRedditFiltering();
    //   break;

    default:
      console.log("no filtering logic for this site", hostname);
  }
}

function stopFilteringForCurrentSite() {
  const hostname = window.location.hostname;

  switch (true) {
    case hostname.includes("youtube.com"):
      console.log("stopping filter (youtube)");
      stopYoutubeFiltering();
      break;

    // case hostname.includes("twitter.com"):
    // case hostname.includes("x.com"):
    //   console.log("stopping filter (twitter)");
    //   stopTwitterFiltering();
    //   break;

    // case hostname.includes("reddit.com"):
    //   console.log("stopping filter (reddit)");
    //   stopRedditFiltering();
    //   break;

    default:
      console.log("no filtering logic for this site", hostname);
  }
}

// --- Dummy stubs for other sites (implement when adding support) ---
// function startTwitterFiltering() {
//   console.log("startTwitterFiltering called (not implemented)");
// }
// function stopTwitterFiltering() {
//   console.log("stopTwitterFiltering called (not implemented)");
// }
// function startRedditFiltering() {
//   console.log("startRedditFiltering called (not implemented)");
// }
// function stopRedditFiltering() {
//   console.log("stopRedditFiltering called (not implemented)");
// }

// --- Initialize State ---
chrome.storage.local.get(["lens_active"], (result) => {
  console.log("reult:", result.lens_active);
  if (result.lens_active === true) {
    console.log("starting to filter");
    startFilteringForCurrentSite();
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
      startFilteringForCurrentSite();
    } else {
      console.log("stopping the filtering", changes.lens_active);
      stopFilteringForCurrentSite();
    }
  }
});

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

function extractYoutubeTitle(container: Element): string {
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

function debounce<T extends (...args: any[]) => void>(fn: T, waitMs: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };
}

// --- Core Logic ---
async function processYoutubeVideos() {
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
      const relativityScore = await getYoutubeRelativityScore(currentTitle);
      (videoContainer as HTMLElement).style.backgroundColor =
        relativityScore <= 0.25 ? "yellow" : "";
    } finally {
      videoContainer.removeAttribute("data-extension-processing");
    }
  });
}

const scheduleProcessYoutubeVideos = debounce(() => {
  processYoutubeVideos();
}, 150);

// --- Lifecycle Management ---
async function startYoutubeFiltering() {
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

function stopYoutubeFiltering() {
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
    (el as HTMLElement).style.backgroundColor = "";
    el.removeAttribute("data-extension-title");
    el.removeAttribute("data-extension-processing");
  });
}

async function getYoutubeRelativityScore(videoTitle: string) {
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
    console.log("getYoutubeRelativityScore failed", error);
    return 1;
  }
}