import { YOUTUBE_CHANNEL_SELECTORS, YOUTUBE_TITLE_SELECTORS } from "../lib/selectors";

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