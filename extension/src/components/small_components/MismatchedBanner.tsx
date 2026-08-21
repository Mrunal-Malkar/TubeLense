// mismatchBanner.ts
//
// A floating toast pinned to the viewport (position: fixed, not sticky).
// YouTube scrolls an inner container, not document.body — sticky would
// only "stick" relative to that inner scroll ancestor, which meant a
// body-appended sticky element just scrolled out of view immediately.
// Fixed positioning anchors to the viewport itself, so this stays visible
// regardless of how deep the user has scrolled into the feed.

export interface BannerActions {
  onAdjustStrictness: () => void;
  onPauseSession: () => void;
  onDismiss: () => void;
}

const BANNER_ID = "yt-filter-mismatch-banner";
const STYLE_ID = "yt-filter-mismatch-banner-styles";
const AUTO_DISMISS_MS = 12000; // disappears on its own if the user ignores it

function ensureAnimationStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes yt-filter-banner-in {
      from { opacity: 0; transform: translate(-50%, -12px); }
      to   { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes yt-filter-banner-out {
      from { opacity: 1; transform: translate(-50%, 0); }
      to   { opacity: 0; transform: translate(-50%, -12px); }
    }
  `;
  document.head.appendChild(style);
}

export function showMismatchBanner(actions: BannerActions) {
  if (document.getElementById(BANNER_ID)) return; // already showing, don't stack
  ensureAnimationStyles();

  const banner = document.createElement("div");
  banner.id = BANNER_ID;
  banner.style.cssText = `
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 2147483647;
    display: flex;
    align-items: center;
    gap: 14px;
    max-width: min(640px, calc(100vw - 32px));
    padding: 12px 16px;
    background: #212121;
    color: #fff;
    font-family: Roboto, Arial, sans-serif;
    font-size: 13px;
    line-height: 1.4;
    border-radius: 10px;
    box-shadow: 0 4px 18px rgba(0,0,0,0.45);
    animation: yt-filter-banner-in 0.25s ease-out;
  `;

  let autoDismissTimer: ReturnType<typeof setTimeout> | null = null;

  function closeBanner() {
    if (autoDismissTimer) clearTimeout(autoDismissTimer);
    banner.style.animation = "yt-filter-banner-out 0.2s ease-in forwards";
    setTimeout(() => banner.remove(), 300);
  }

  const message = document.createElement("span");
  message.textContent = "TubeLens is hiding most of what's in your feed right now.";
  message.style.flex = "1";

  const actionsWrap = document.createElement("div");
  actionsWrap.style.cssText = "display:flex; gap:8px; align-items:center; flex-shrink:0;";

  function makeButton(label: string, onClick: () => void, primary = false): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.style.cssText = `
      padding: 6px 10px;
      border-radius: 6px;
      border: none;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
      background: ${primary ? "#3ea6ff" : "#3f3f3f"};
      color: ${primary ? "#0f0f0f" : "#fff"};
    `;
    btn.onclick = () => {
      onClick();
      closeBanner();
    };
    return btn;
  }

  actionsWrap.appendChild(makeButton("Adjust strictness", actions.onAdjustStrictness, true));
  actionsWrap.appendChild(makeButton("Pause for this session", actions.onPauseSession));
  actionsWrap.appendChild(makeButton("Dismiss", actions.onDismiss));

  banner.appendChild(message);
  banner.appendChild(actionsWrap);
  document.body.appendChild(banner); // appendChild, not prepend — position:fixed makes DOM order irrelevant anyway

  autoDismissTimer = setTimeout(closeBanner, AUTO_DISMISS_MS);
}

export function removeMismatchBanner() {
  document.getElementById(BANNER_ID)?.remove();
}