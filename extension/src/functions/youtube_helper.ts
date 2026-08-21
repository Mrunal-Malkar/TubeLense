import { YOUTUBE_CHANNEL_SELECTORS, YOUTUBE_TITLE_SELECTORS } from "../lib/selectors";
import { BALANCED_STRICTNESS_SCORE, CHECK_INTERVAL, MISMATCH_THRESHOLD, RELAXED_STRICTNESS_SCORE, STRICT_STRICTNESS_SCORE, WINDOW_SIZE } from "../lib/statics";

export function extractYoutubeChannelName(container: Element): string {
  for (const sel of YOUTUBE_CHANNEL_SELECTORS) {
    const el = container.querySelector(sel);

    const text = el?.textContent?.trim();

    if (text) return text;
  }

  return "";
}

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

export function youtubeFilterationCheck(relativityScore:number,userPreferredStrictness:string){
 console.log("yoututbe filteration check helper,relativityScore;",relativityScore,"userPrefferedStrictness:",userPreferredStrictness)
  switch(userPreferredStrictness){
    case "relaxed":
      return relativityScore<RELAXED_STRICTNESS_SCORE
    case "balanced":
      return relativityScore<BALANCED_STRICTNESS_SCORE
    case "strict":
      return relativityScore<STRICT_STRICTNESS_SCORE
  }
}




// mismatchTracker.ts
//
// Detects "this filter and this feed don't match" without a strict
// consecutive streak (which resets too easily on one lucky match) and
// without checking on every single video (wasted work — the ratio barely
// moves video-to-video, so there's no value in recomputing it that often).
 
export type MismatchCallback = () => void;

const recentResults: boolean[] = []; // true = hidden
let sinceLastCheck = 0;
let bannerShownThisSession = false; // once true, never fires again until resetMismatchTracker()
 
/**
 * Call this every time a video finishes scoring, with whether it was hidden.
 * Internally throttles the actual ratio check to every CHECK_INTERVAL calls,
 * and after the mismatch callback fires once, goes permanently silent for
 * the rest of the session (until resetMismatchTracker() is explicitly called).
 */
export function recordFilterResult(wasHidden: boolean, onMismatchDetected: MismatchCallback) {
  recentResults.push(wasHidden);
  if (recentResults.length > WINDOW_SIZE) recentResults.shift();
 
  if (bannerShownThisSession) {
    console.log("[mismatchTracker] banner already shown this session, staying quiet");
    return;
  }
 
  sinceLastCheck++;
  if (sinceLastCheck < CHECK_INTERVAL) return;
  sinceLastCheck = 0;
 
  if (recentResults.length < WINDOW_SIZE) {
    console.log(`[mismatchTracker] not enough data yet: ${recentResults.length}/${WINDOW_SIZE}`);
    return;
  }
 
  const hiddenCount = recentResults.filter(Boolean).length;
  const ratio = hiddenCount / recentResults.length;
  console.log(`[mismatchTracker] checked ratio: ${hiddenCount}/${recentResults.length} = ${ratio.toFixed(2)} (threshold ${MISMATCH_THRESHOLD})`);
 
  if (ratio >= MISMATCH_THRESHOLD) {
    console.log("[mismatchTracker] MISMATCH DETECTED — firing banner");
    bannerShownThisSession = true;
    onMismatchDetected();
  }
}
 
/**
 * Clears the rolling window (e.g. on SPA navigation to a very different
 * view — home vs a search results page). Deliberately does NOT reset
 * bannerShownThisSession by default, since "session" here means the whole
 * tab's lifetime, not each individual page nav — pass resetBannerFlag=true
 * only if you want a full reset (e.g. actual page reload).
 */
export function resetMismatchTracker(resetBannerFlag = false) {
  recentResults.length = 0;
  sinceLastCheck = 0;
  if (resetBannerFlag) bannerShownThisSession = false;
}