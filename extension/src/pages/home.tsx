import { useState, useSyncExternalStore } from "react";
import Header from "../components/header";
import { ToastContainer } from "react-toastify";
import FocusScoreAndAnimatedSphere from "../components/FocusScoreAndAnimatedSphere";
import CardDrawer from "../components/cardDrawer";
import { CARD_DATA, type CardData } from "../lib/cards";
import { useSelector } from "react-redux";
import StrictnessToggle from "../components/strictnessToggle";

// 1. Create the store outside the component to prevent listener duplication
function createLensActiveStore() {
  let cache = false;
  const listeners = new Set<() => void>();

  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    // Initial fetch
    chrome.storage.local.get(["lens_active"], (result) => {
      if (result.lens_active !== undefined) {
        cache = result.lens_active === true || result.lens_active === "true";
        listeners.forEach((l) => l());
      }
    });

    // Listen for changes
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "local" && changes.lens_active) {
        const active = changes.lens_active.newValue;
        cache = active === true || active === "true";
        listeners.forEach((l) => l());
      }
    });
  }

  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => cache,
    getServerSnapshot: () => false,
  };
}

const lensActiveStore = createLensActiveStore();

const HomePage = ({ goToInfoPage }: { goToInfoPage: () => void }) => {
  // 2. Safely read Chrome storage without triggering render loops
  const isActive = useSyncExternalStore(
    lensActiveStore.subscribe,
    lensActiveStore.getSnapshot,
    lensActiveStore.getServerSnapshot
  );

  const [showConfirmCardClickPopup, setShowConfirmCardClickPopup] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const preference = useSelector((state: any) => state.preference);

  // Note: Used .find() instead of .filter()[0] as it's cleaner for finding a single item
  const baseCard: CardData | undefined = CARD_DATA.find(
    (card) => card.name === String(preference.cards.selectedCardName)
  );
  
  const base_activeMode = preference.activeMode;
  const base_activeCard = preference.activeTopicPack;

  // 3. FIXED: Derive state directly instead of using useState/setState
  const isCustomCardActive = baseCard?.name !== base_activeMode;
  const realActiveCard = isCustomCardActive ? base_activeCard : null;

  return (
    <div className="w-95 min-h-screen h-fit pb-8 scrollbar-none bg-[#f6f7fb] rounded-4xl p-3 font-sans relative overflow-y-hidden shadow-2xl flex flex-col gap-3 text-[#1a1a2e]">
      <ToastContainer />
      <Header goToInfoPage={goToInfoPage} />
      <FocusScoreAndAnimatedSphere />

      {/* --- CURRENT BRAIN MODE --- */}
      <div
        onClick={() => {
          if (!isActive) return;
          setShowConfirmCardClickPopup(true);
        }}
        className={`relative bg-white rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex justify-between items-center z-10 transition-all duration-300 ${
          !isActive
            ? "opacity-50 grayscale pointer-events-none"
            : "cursor-pointer hover:shadow-md"
        } ${base_activeMode === "cards" ? "" : "opacity-85"}`}
      >
        {!isActive && (
          <div className="absolute inset-0 z-50 cursor-not-allowed pointer-events-auto rounded-2xl" />
        )}

        <div>
          <h3 className="text-sm font-semibold mb-1">
            {realActiveCard ? "Custom Card" : baseCard?.title}
          </h3>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="font-bold text-sm">
              {realActiveCard ? realActiveCard : baseCard?.name}
            </span>
          </div>
          <p className="text-[10px] text-gray-500">
            {realActiveCard ? "custom card is currently active" : baseCard?.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Decorative Squiggle Line */}
          <svg width="60" height="20" viewBox="0 0 60 20" fill="none" className="opacity-40">
            <path
              d="M0 10 Q 15 20, 30 10 T 60 10"
              stroke={realActiveCard ? "#10b981" : baseCard?.svgColor}
              strokeWidth="2"
              fill="transparent"
            />
          </svg>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: `${realActiveCard ? "#10b981" : baseCard?.svgColor}15`,
              color: baseCard?.svgColor,
            }}
          >
            {realActiveCard ? "" : (baseCard?.icon && <baseCard.icon size={20} />)}
          </div>
        </div>
      </div>
      
      <StrictnessToggle />
      
      <CardDrawer
        isOpen={showConfirmCardClickPopup}
        onClose={() => setShowConfirmCardClickPopup(false)}
      />
    </div>
  );
};

export default HomePage;