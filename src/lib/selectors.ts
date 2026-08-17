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
  // Standard video renderers
  "ytd-rich-item-renderer", // Home page grid
  "ytd-video-renderer", // Search results, many shelves
  "ytd-compact-video-renderer", // Watch page sidebar / "related" list
  "ytd-grid-video-renderer", // Channel / subscriptions grid (older layout)
  "ytd-playlist-video-renderer", // Inside playlists
  "ytd-playlist-panel-video-renderer", // Queue / "up next" panel

  // "Lockup" redesign — increasingly replacing the renderers above everywhere
  "yt-lockup-view-model",

  // Shorts — legacy shelf markup (home page / channel "Shorts" tab)
  "ytd-reel-item-renderer",

  // Shorts — newer card markup (this is the one showing up in *search results*)
  "ytm-shorts-lockup-view-model-v2",
  "ytm-shorts-lockup-view-model",

  // Shorts — sometimes rendered as a plain video-renderer with a shorts flag
  "ytd-video-renderer[is-shorts]",
  "ytd-rich-item-renderer[is-shorts]",

  // Shorts shelf container itself (e.g. "Shorts remixing this video" on watch page)
  "ytd-reel-shelf-renderer ytd-reel-item-renderer",
].join(", ");

export const YOUTUBE_TITLE_SELECTORS = [
  "#video-title",
  "yt-formatted-string#video-title",
  ".yt-lockup-metadata-view-model__heading-reset",
  "h3 a",
  "a#video-title-link",
];
