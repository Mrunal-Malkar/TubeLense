import { useState, useEffect } from "react";
import { Wind, SlidersHorizontal, ShieldAlert } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setStrictness } from "../store/baseInfoStore";

export default function StrictnessToggle() {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const strictness: string = useSelector((state: any) => state.preference.strictness);
  
  // Local state to track chrome storage value
  const [isActive, setIsActive] = useState<boolean>(false);
  const [intensity, setIntensity] = useState<string>(strictness);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if chrome.storage is available to prevent crashes in local dev environments
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      // 1. Get initial value on mount
      chrome.storage.local.get(["lens_active"], (result) => {
        const active = result.lens_active;
        setIsActive(active === true || active === "true");
      });

      // 2. Listen for changes in case it gets toggled elsewhere in the extension
      const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
        if (areaName === "local" && changes.lens_active) {
          const active = changes.lens_active.newValue;
          setIsActive(active === true || active === "true");
        }
      };

      chrome.storage.onChanged.addListener(handleStorageChange);

      // Cleanup listener on unmount
      return () => {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      };
    }
  }, []);

  function handleClick(arg: string) {
    if (!isActive) return;
    setIntensity(arg);
    dispatch(setStrictness(arg));
  }

  return (
    <div 
      className={`relative bg-white rounded-2xl h-fit p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] z-10 transition-all duration-300 ${
        !isActive ? "opacity-50 grayscale pointer-events-none" : ""
      }`}
    >
      {/* 
        INVISIBLE SHIELD OVERLAY: 
        This sits on top of everything when inactive. Because the parent has pointer-events-none, 
        we add pointer-events-auto here to capture the mouse, enforce the 'not-allowed' cursor, 
        and block ALL clicks/hovers from reaching the buttons underneath.
      */}
      {!isActive && (
        <div className="absolute inset-0 z-50 cursor-not-allowed pointer-events-auto rounded-2xl" />
      )}

      <div className="flex justify-between h-fit items-start mb-4">
        <div className="h-fit">
          <h3 className="text-sm font-semibold mb-1 text-gray-900">Focus Intensity</h3>
          <p className="text-[10px] text-gray-500 min-h-[15px] transition-all">
            {intensity === "relaxed" && "Gentle filtering. Allows casual browsing."}
            {intensity === "balanced" && "Standard filtering. Blocks obvious distractions."}
            {intensity === "strict" && "Maximum focus. Zero tolerance for noise."}
          </p>
        </div>

        {/* Dynamic Icon */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
            intensity === "relaxed"
              ? "bg-blue-50 text-blue-500"
              : intensity === "balanced"
              ? "bg-indigo-50 text-indigo-500"
              : "bg-rose-50 text-rose-500"
          }`}
        >
          {intensity === "relaxed" && <Wind size={16} />}
          {intensity === "balanced" && <SlidersHorizontal size={16} />}
          {intensity === "strict" && <ShieldAlert size={16} />}
        </div>
      </div>

      {/* Segmented Control Container */}
      <div className="bg-gray-50 p-1 rounded-xl relative">
        <div className="relative flex w-full">
          {/* --- The Sliding Background Pill --- */}
          <div
            className={`absolute inset-y-0 left-0 w-1/3 bg-white rounded-lg shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out z-0 ${
              intensity === "relaxed"
                ? "translate-x-0"
                : intensity === "balanced"
                ? "translate-x-full"
                : "translate-x-[200%]"
            }`}
          />

          {/* Buttons */}
          <button
            onClick={() => handleClick("relaxed")}
            className={`flex-1 relative z-10 text-xs py-2 rounded-lg font-medium transition-colors duration-300 ${
              intensity === "relaxed" ? "text-gray-800" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Relaxed
          </button>

          <button
            onClick={() => handleClick("balanced")}
            className={`flex-1 relative z-10 text-xs py-2 rounded-lg font-medium transition-colors duration-300 ${
              intensity === "balanced" ? "text-gray-800" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Balanced
          </button>

          <button
            onClick={() => handleClick("strict")}
            className={`flex-1 relative z-10 text-xs py-2 rounded-lg font-medium transition-colors duration-300 ${
              intensity === "strict" ? "text-gray-800" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Strict
          </button>
        </div>
      </div>
    </div>
  );
}