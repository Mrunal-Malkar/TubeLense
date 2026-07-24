chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("received the popup msg");
  if (message.task == "activate_extension") {
    // heading class= ytLockupMetadataViewModelHeadingReset     to get title => .ttle
    // video thumbnail container = ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio16By9 ytThumbnailViewModelLarge
    // the whole container of content => .content    -> to exclude the short form content => .contents

    localStorage.setItem("lens_activate", "true");
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
  }
});

// --- Listen for Real-time Changes (from Popup) ---
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.lens_active) {
    if (changes.lens_active.newValue == true) {
      console.log("starting the filtering.")
      startFiltering();
    } else {
      stopFiltering();
    }
  }
});

let observer: MutationObserver | null = null;
const VIDEO_SELECTORS = "ytd-rich-item-renderer, ytd-video-renderer";

// --- Core Logic ---
async function processVideos() {
  console.log("Looking for video elements");
  const videoElements = document.querySelectorAll(VIDEO_SELECTORS);
  console.log("got the video elements");

  videoElements.forEach(async (videoContainer) => {
    console.log("itereating through each videos");
    if (videoContainer.hasAttribute("data-extension-processed")) return;

    const titleElement = videoContainer.querySelector("#video-title") as
      | HTMLAnchorElement
      | HTMLSpanElement
      | null;
    console.log("got the title element");
    if (titleElement) {
      const videoTitle = titleElement.textContent?.trim() || "";
      const relativityScore = await getRelativityScore(videoTitle);
      if (relativityScore <= 0.5) {
        // (videoContainer as HTMLElement).style.display = 'none';
        (videoContainer as HTMLElement).style.background =
          "rgba(255, 255, 255, 0.3";
        console.log("the video", videoTitle, "=>blureed it");
      }
    }
    console.log("done with the job");
    videoContainer.setAttribute("data-extension-processed", "true");
  });
}

// function checkTitleFilters(title: string): boolean {
//   return ['clickbait', 'spoiler',"song","game","video"].some(word => title.toLowerCase().includes(word));
// }

// --- Lifecycle Management ---
async function startFiltering() {
  if (observer) return; // Already running

  observer = await new MutationObserver(async () => await processVideos());
  const appContainer = document.querySelector("ytd-app") || document.body;
  observer.observe(appContainer, { childList: true, subtree: true });

  processVideos(); // Catch existing videos
}

function stopFiltering() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  // Optional: Restore hidden videos if extension is turned off
  document.querySelectorAll(VIDEO_SELECTORS).forEach((el) => {
    // (el as HTMLElement).style.display = '';
    // (el as HTMLElement).style.backdropFilter = '';
    (el as HTMLElement).style.background = "";
    el.removeAttribute("data-extension-processed");
  });
}

async function getRelativityScore(videoTitle: string) {
  const response = await chrome.runtime.sendMessage({
    task: "evaluate_relativity",
    title: videoTitle,
  });
  if (!response.success) return 1;

  return Number(response.relativityScore);
}
