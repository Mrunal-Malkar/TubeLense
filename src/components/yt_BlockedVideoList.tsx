import { useEffect, useState } from "react";
import {
  getBlockedVideos,
  subscribeToBlockedVideos,
  clearBlockedVideos,
  type BlockedVideoEntry,} from "../storage/yt"

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export default function BlockedVideosList() {
  const [videos, setVideos] = useState<BlockedVideoEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlockedVideos()
      .then(setVideos)
      .finally(() => setLoading(false));

    // live-update as new videos get blocked while the popup is open
    const unsubscribe = subscribeToBlockedVideos(setVideos);
    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-400 px-3 py-2">Loading…</div>;
  }

  if (videos.length === 0) {
    return (
      <div className="text-sm text-gray-400 px-3 py-4 text-center">
        Nothing blocked yet — keep scrolling.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
        <span className="text-sm font-medium">{videos.length} blocked</span>
        <button
          className="text-xs text-gray-400 hover:text-gray-600"
          onClick={() => clearBlockedVideos().then(() => setVideos([]))}
        >
          Clear
        </button>
      </div>

      <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100">
        {videos.map((video) => (
          <li key={video.key} className="px-3 py-2 flex flex-col gap-0.5">
            <span className="text-sm font-medium line-clamp-2">
              {video.title}
            </span>
            <span className="text-xs text-gray-400">
              {video.channelName} · {timeAgo(video.hiddenAt)} · score{" "}
              {video.score.toFixed(3)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
