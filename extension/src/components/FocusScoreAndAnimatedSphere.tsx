import { useSyncExternalStore } from "react";
import { toast, ToastContainer } from "react-toastify";
// Import toast and ToastContainer wherever they are coming from...

// 1. Create a generic factory for Chrome Storage stores OUTSIDE the component
// This prevents it from recreating on every render.
function createChromeStore<T>(key: string, defaultValue: T) {
  let cache: T = defaultValue;
  const listeners = new Set<() => void>();

  if (typeof chrome !== "undefined" && chrome.storage) {
    // Fetch initial data
    chrome.storage.local.get(key, (result) => {
      if (result[key] !== undefined) {
        cache = result[key] as T;
        listeners.forEach((l) => l());
      }
    });

    // Listen for cross-extension changes
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "local" && changes[key]) {
        cache = (changes[key].newValue !== undefined ? changes[key].newValue : defaultValue) as T;
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
    getServerSnapshot: () => defaultValue, // Prevents errors during SSR/Next.js if applicable
  };
}

// 2. Instantiate your specific stores
const focusScoreStore = createChromeStore<number>("focus_score", 0);
const lensActiveStore = createChromeStore<boolean>("lens_active", false);

const FocusScoreAndAnimatedSphere = () => {
  // 3. Connect to the stores directly (No useEffect or useState needed!)
  const focusScore = useSyncExternalStore(
    focusScoreStore.subscribe,
    focusScoreStore.getSnapshot,
    focusScoreStore.getServerSnapshot
  );

  const isActive = useSyncExternalStore(
    lensActiveStore.subscribe,
    lensActiveStore.getSnapshot,
    lensActiveStore.getServerSnapshot
  );

  const wording = focusScore >= 70 ? "Excellent" : focusScore >= 40 ? "Good" : "Watch related videos, improve your score";
  const dotsOutOfTwelve = Math.round((focusScore / 100) * 12);

  async function activeExtension() {
    if (typeof chrome === "undefined" || !chrome.storage) {
      toast.error("Chrome storage unavailable");
      return;
    }

    const newState = !isActive;
    
    // Setting this in Chrome storage automatically triggers the listener 
    // inside our store, which natively updates the React component. 
    // No manual setState required!
    await chrome.storage.local.set({ lens_active: newState });

  }

  return (
    <div className="flex justify-between items-start mt-2 relative z-10">
      <ToastContainer />
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium text-gray-800">Focus Score</h2>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-500">
            {focusScore}%
          </span>
          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">
            {wording}
          </span>
        </div>
        {/* Progress Dots */}
        <div className="flex gap-1.5 mt-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i < dotsOutOfTwelve ? "bg-indigo-500" : "bg-indigo-100"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Replaced Animated Sphere with a High-Tech Smart Toggle */}
      <div className="flex flex-col items-center justify-center mr-2 mt-2">
        <button
          onClick={activeExtension}
          className={`relative w-24 h-12 rounded-full transition-colors duration-500 ease-in-out focus:outline-none p-1 shadow-inner ${
            isActive
              ? "bg-linear-to-r from-blue-600 to-indigo-500"
              : "bg-gray-200"
          }`}
        >
          {/* Background Text Labels */}
          <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none">
            <span
              className={`text-[10px] font-black tracking-wider text-white transition-opacity duration-300 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              ON
            </span>
            <span
              className={`text-[10px] font-black tracking-wider text-gray-400 transition-opacity duration-300 ${
                !isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              OFF
            </span>
          </div>

          {/* The Moving Toggle Thumb */}
          <div
            className={`relative w-10 h-10 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)] flex items-center justify-center transform transition-transform duration-500 ease-in-out z-10 ${
              isActive ? "translate-x-12" : "translate-x-0"
            }`}
          >
            {/* Kept a tiny spinning ring animation when active for the "cool" factor */}
            {isActive && (
              <div className="absolute inset-0 rounded-full border-2 border-indigo-100 border-t-indigo-500 animate-[spin_2s_linear_infinite]" />
            )}

            {/* Universal Power Icon */}
            <svg
              className={`w-5 h-5 transition-colors duration-500 ${
                isActive ? "text-indigo-600" : "text-gray-400"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
              <line x1="12" y1="2" x2="12" y2="12"></line>
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default FocusScoreAndAnimatedSphere;