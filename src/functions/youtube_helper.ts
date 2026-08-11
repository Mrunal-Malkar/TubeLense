import { YOUTUBE_CHANNEL_SELECTORS, YOUTUBE_TITLE_SELECTORS } from "../lib/selectors";
import { BALANCED_STRICTNESS_SCORE, RELAXED_STRICTNESS_SCORE, STRICT_STRICTNESS_SCORE } from "../lib/statics";

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