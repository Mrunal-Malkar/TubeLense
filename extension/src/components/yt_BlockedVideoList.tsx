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
<div className="flex flex-col w-full min-h-[400px] min-w-full max-h-full bg-white rounded-xl shadow-sm">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-red-600 bg-red-100 rounded-full">
            {videos.length}
          </span>
          <span className="text-sm font-semibold text-gray-800">Blocked Videos</span>
        </div>
        <button
          className="px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors rounded-md hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          onClick={() => clearBlockedVideos().then(() => setVideos([]))}
        >
          Clear all
        </button>
      </div>

      {/* List Container */}
      <ul className="flex flex-col flex-1 gap-1 p-2 overflow-y-auto">
        {videos.length > 0 ? (
          videos.map((video) => (
            <li 
              key={video.key} 
              className="group flex items-start gap-3 p-3 transition-all duration-200 border border-transparent rounded-xl hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm"
            >
              {/* Fake Video Thumbnail / Icon Placeholder */}
              <div className="flex-shrink-0 flex items-center justify-center w-14 h-10 mt-0.5 bg-gray-200 rounded-lg text-gray-400 group-hover:text-red-500 group-hover:bg-red-100/50 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
                </svg>
              </div>

              {/* Video Info */}
              <div className="flex flex-col flex-1 min-w-0 gap-1.5">
                <span className="text-sm font-medium leading-snug text-gray-800 line-clamp-2 group-hover:text-black">
                  {video.title}
                </span>
                
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
                  <span className="font-semibold text-gray-600 truncate max-w-[120px]">
                    {video.channelName}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{timeAgo(video.hiddenAt)}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded shadow-sm text-gray-600">
                    score: {video.score.toFixed(3)}
                  </span>
                </div>
              </div>
            </li>
          ))
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center flex-1 h-full py-16 text-gray-400">
            <svg className="w-12 h-12 mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span className="text-sm">No blocked videos</span>
          </div>
        )}
      </ul>
    </div>
  );
}
