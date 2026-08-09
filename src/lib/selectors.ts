export const YOUTUBE_CHANNEL_SELECTORS = [
  // Common video renderers
  "#channel-name a",
  "ytd-channel-name a",

  // Newer Lockup markup
  ".yt-content-metadata-view-model__metadata-row a",

  // Some layouts expose the channel in metadata
  "ytd-video-meta-block #channel-name a",

  // Generic fallback
  "a[href^='/@']",
  "a[href^='/channel/']",
  "a[href^='/c/']",
  "a[href^='/user/']",
];

export const YOUTUBE_VIDEO_SELECTORS = [
  "ytd-rich-item-renderer", // Home page grid
  "ytd-video-renderer", // Search results, many shelves
  "ytd-compact-video-renderer", // Watch page sidebar / "related" list
  "ytd-grid-video-renderer", // Channel / subscriptions grid (older layout)
  "ytd-playlist-video-renderer", // Inside playlists
  "ytd-playlist-panel-video-renderer", // Queue / "up next" panel
  "ytd-reel-item-renderer", // Shorts shelf entries (legacy markup)
  "yt-lockup-view-model", // New "Lockup" redesign — increasingly used everywhere
].join(", ");

export const YOUTUBE_TITLE_SELECTORS = [
  "#video-title",
  "yt-formatted-string#video-title",
  ".yt-lockup-metadata-view-model__heading-reset",
  "h3 a",
  "a#video-title-link",
];