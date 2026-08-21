// blockedVideosStore.ts
//
// Single source of truth for "which videos are currently blocked, and why."
// Written to by the content script (youtube.ts) whenever it hides a video,
// read by the popup UI to render a live list. Uses chrome.storage.session
// (not .local) so this clears automatically per browser session instead of
// persisting stale entries across restarts — swap to .local if you want it
// to survive browser restarts instead.
// blockedVideosStore.ts
//
// Single source of truth for "which videos are currently blocked, and why."
// Written to by the content script (youtube.ts) whenever it hides a video,
// read by the popup UI to render a live list. Uses chrome.storage.local,
// which is accessible from every extension context (content scripts,
// background, popup) with zero setup — persists across browser restarts,
// so the list survives closing/reopening the browser. If you'd rather it
// reset per-session instead, add a chrome.runtime.onStartup listener in
// background.ts that calls clearBlockedVideos().

export interface BlockedVideoEntry {
  key: string; // "channelName:title" — same key used for scoring/dedup
  title: string;
  channelName: string;
  score: number;
  hiddenAt: number; // Date.now() timestamp
  url?: string; // optional, if you want a "why was this hidden" or "go watch anyway" link later
}

const STORAGE_KEY = "blockedVideos";
const MAX_ENTRIES = 200; // cap so storage doesn't grow unbounded during a long scroll session

export async function addBlockedVideo(
  entry: Omit<BlockedVideoEntry, "hiddenAt">,
): Promise<void> {
  const existing = await getBlockedVideos();
  if (existing.length >= 100) {
    await clearBlockedVideos();
    return;
}
  // dedupe by key — if already recorded (e.g. reprocessed on navigation), just move it to the front / refresh timestamp
  const withoutDuplicate = existing.filter((v) => v.key !== entry.key);
  const updated: BlockedVideoEntry[] = [
    { ...entry, hiddenAt: Date.now() },
    ...withoutDuplicate,
  ].slice(0, MAX_ENTRIES);

  await chrome.storage.local.set({ [STORAGE_KEY]: updated });
}

export async function getBlockedVideos(): Promise<BlockedVideoEntry[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as BlockedVideoEntry[]) ?? [];
}

export async function clearBlockedVideos(): Promise<void> {
  await chrome.storage.local.remove(STORAGE_KEY);
}

// Call this from the popup (or anywhere) to react live as new videos get
// blocked while the popup is open.
export function subscribeToBlockedVideos(
  callback: (videos: BlockedVideoEntry[]) => void,
): () => void {
  const listener = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: chrome.storage.AreaName,
  ) => {
    if (areaName !== "local") return;
    if (!changes[STORAGE_KEY]) return;
    callback((changes[STORAGE_KEY].newValue as BlockedVideoEntry[]) ?? []);
  };

  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}
