import Header from "../components/header";
import {
  Clock,
  EyeOff,
  ShieldCheck,
  X,
  Smile,
  Plus,
  Sparkles,
  Home,
  SlidersHorizontal,
  PieChart,
  History,
} from "lucide-react";
import PlatformsToggles from "../components/toggle_platforms";
import { ToastContainer } from "react-toastify";
import FocusScoreAndAnimatedSphere from "../components/FocusScoreAndAnimatedSphere";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { toggleActiveMode } from "../store/baseInfoStore";
import { useState } from "react";
import CardDrawer from "../components/cardDrawer";
import { CARD_DATA, type CardData } from "../lib/cards";

const ExtensionPopup = () => {

//   const {data:baseInfo,isLoading,error}=useQuery({
//   queryKey:["getBaseInfo"],
//   queryFn:getBaseInfo
// });
const [showConfirmCardClickPopup,setShowConfirmCardClickPopup]=useState<boolean>(false);
const dispatch=useDispatch();
const preference=useSelector((state: RootState)=>state.preference);
console.log("preference",preference);

const baseCard:CardData | undefined=(CARD_DATA.filter((card) => card.name === String(preference.cards.selectedCardName))[0]);
console.log("The baseCard",baseCard);
const base_activeMode=preference.activeMode;

function changeMode(){
dispatch(toggleActiveMode());
};


// if(error){
//   return 
// }
  return (
    <div className="w-95 min-h-195 h-fit pb-8 bg-[#f6f7fb] rounded-4xl p-3 font-sans relative overflow-y-hidden scrollbar-auto shadow-2xl flex flex-col gap-3 text-[#1a1a2e]">
      <ToastContainer />
      {/* --- HEADER --- */}
      <Header />

      {/* --- FOCUS SCORE & ANIMATED SPHERE --- */}
      <FocusScoreAndAnimatedSphere />

      {/* --- TODAY'S IMPACT --- */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] z-10">
        <h3 className="text-sm font-semibold mb-3">Today's Impact</h3>
        <div className="grid grid-cols-3 gap-2 divide-x divide-gray-100">
          <div className="flex flex-col items-center justify-center text-center">
            <Clock size={20} className="text-gray-400 mb-2" />
            <div className="text-xl font-bold">
              42 <span className="text-xs font-normal text-gray-500">min</span>
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Time Saved</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <EyeOff onClick={changeMode} size={20} className="text-gray-400 mb-2" />
            <div className="text-xl font-bold">0</div>
            <div className="text-[10px] text-gray-500 mt-1">Doomscrolls</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <ShieldCheck size={20} className="text-gray-400 mb-2" />
            <div className="text-xl font-bold">91</div>
            <div className="text-[10px] text-gray-500 mt-1">Relevant Posts</div>
          </div>
        </div>
      </div>

      {/* --- CURRENT BRAIN MODE --- */}
      <div onClick={()=>setShowConfirmCardClickPopup(true)} className={`${base_activeMode=="cards"?"":"opacity-85"} cursor-pointer bg-white rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex justify-between items-center z-10`}>
        <div>
          <h3 className="text-sm font-semibold mb-1">{baseCard?.title}</h3>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="font-bold text-sm">{baseCard?.name}</span>
          </div>
          <p className="text-[10px] text-gray-500">
            {baseCard?.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Decorative Squiggle Line */}
          <svg
            width="60"
            height="20"
            viewBox="0 0 60 20"
            fill="none"
            className="opacity-40"
          >
            <path
              d="M0 10 Q 15 20, 30 10 T 60 10"
              stroke={baseCard?.svgColor}
              strokeWidth="2"
              fill="transparent"
            />
          </svg>
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
            {baseCard?.icon && <baseCard.icon size={20} />}
          </div>
        </div>
      </div>

      <PlatformsToggles />

      {/* --- FEED ALIGNMENT --- */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] z-10">
        <h3 className="text-sm font-semibold mb-3">Feed Alignment</h3>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-2 bg-indigo-50 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: "78%" }}
            ></div>
          </div>
          <span className="font-bold text-sm">78%</span>
        </div>
        <p className="text-[10px] text-gray-500">
          Your feed is mostly aligned with your focus.
        </p>
      </div>

      {/* --- SMART SUGGESTIONS --- */}
      <div className="flex flex-col gap-2 z-10">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold">Smart Suggestions</h3>
          <button className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800">
            View All
          </button>
        </div>

        {/* Scrollable Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          <div className="bg-white border border-gray-100 rounded-xl p-2.5 shrink-0 flex items-center gap-2 shadow-sm min-w-30">
            <X size={16} className="text-indigo-400" />
            <div>
              <div className="text-[11px] font-semibold">Hide Cricket</div>
              <div className="text-[9px] text-gray-400">Too much content</div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-2.5 shrink-0 flex items-center gap-2 shadow-sm min-w-30">
            <Smile size={16} className="text-orange-400" />
            <div>
              <div className="text-[11px] font-semibold">Reduce Memes</div>
              <div className="text-[9px] text-gray-400">Low value</div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-2.5 shrink-0 flex items-center gap-2 shadow-sm min-w-32.5">
            <Plus size={16} className="text-emerald-500" />
            <div>
              <div className="text-[11px] font-semibold">Add System Design</div>
              <div className="text-[9px] text-gray-400">High relevance</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ACTION BUTTON --- */}
      <button className="w-full mt-auto bg-linear-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-200/50 transition-all z-10 mb-12">
        <Sparkles size={16} />
        Apply Suggestions
      </button>

      {/* --- BOTTOM NAVIGATION --- */}
      <div className="sticky bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 flex justify-around items-center z-20">
        <button className="flex flex-col items-center gap-1 text-indigo-600">
          <Home size={20} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition">
          <SlidersHorizontal size={20} />
          <span className="text-[10px] font-medium">Filters</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition">
          <PieChart size={20} />
          <span className="text-[10px] font-medium">Insights</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition">
          <History size={20} />
          <span className="text-[10px] font-medium">History</span>
        </button>
      </div>

      {/* confirm card Click popup drawer (down to top) */}
      <CardDrawer isOpen={showConfirmCardClickPopup} onClose={() => setShowConfirmCardClickPopup(false)} />
    </div>
  );
};

export default ExtensionPopup;