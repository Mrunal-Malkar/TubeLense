import Header from "../components/header";

// async function activeExtension() {
//   const current = (await chrome.storage.local.get("lens_active")).lens_active;
//   const type = typeof current;
//   console.log("type", type);
//   if (!(type == "boolean")) {
//     toast.error("unexpected lens_active type");
//     return;
//   }
//   await chrome.storage.local.set({ lens_active: !current });
//   toast.success("activated");
// }
// import React from 'react';
import { 
  Clock, 
  EyeOff, 
  ShieldCheck, 
  Brain, 
  X, 
  Smile, 
  Plus, 
  Sparkles, 
  Home, 
  SlidersHorizontal, 
  PieChart, 
  History 
} from 'lucide-react';
import PlatformsToggles from "../components/toggle_platforms";

const ExtensionPopup = () => {
  return (
    <div className="w-95 h-195 bg-[#f6f7fb] bg-amber-500 rounded-4xl p-5 font-sans relative overflow-auto scrollbar-none shadow-2xl flex flex-col gap-4 text-[#1a1a2e]">
        
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
            <div className="text-xl font-bold">42 <span className="text-xs font-normal text-gray-500">min</span></div>
            <div className="text-[10px] text-gray-500 mt-1">Time Saved</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <EyeOff size={20} className="text-gray-400 mb-2" />
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
      <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex justify-between items-center z-10">
        <div>
          <h3 className="text-sm font-semibold mb-1">Current Brain Mode</h3>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="font-bold text-sm">Deep Work</span>
          </div>
          <p className="text-[10px] text-gray-500">High focus • Low distraction</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Decorative Squiggle Line */}
          <svg width="60" height="20" viewBox="0 0 60 20" fill="none" className="opacity-40">
            <path d="M0 10 Q 15 20, 30 10 T 60 10" stroke="#10b981" strokeWidth="2" fill="transparent"/>
          </svg>
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
            <Brain size={20} />
          </div>
        </div>
      </div>

      <PlatformsToggles/>

      {/* --- FEED ALIGNMENT --- */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] z-10">
        <h3 className="text-sm font-semibold mb-3">Feed Alignment</h3>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-2 bg-indigo-50 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '78%' }}></div>
          </div>
          <span className="font-bold text-sm">78%</span>
        </div>
        <p className="text-[10px] text-gray-500">Your feed is mostly aligned with your focus.</p>
      </div>

      {/* --- SMART SUGGESTIONS --- */}
      <div className="flex flex-col gap-2 z-10">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold">Smart Suggestions</h3>
          <button className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800">View All</button>
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
      <div className="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 flex justify-around items-center z-20">
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

    </div>
  );
};

export default ExtensionPopup;


const FocusScoreAndAnimatedSphere = () => {
  return(
  <div className="flex justify-between items-start mt-2 relative z-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium text-gray-800">Focus Score</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-500">
              91%
            </span>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">
              Excellent
            </span>
          </div>
          {/* Progress Dots */}
          <div className="flex gap-1.5 mt-2">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className={`h-2 w-2 rounded-full ${i < 9 ? 'bg-indigo-500' : 'bg-indigo-100'}`} 
              />
            ))}
          </div>
        </div>

        {/* Animated 3D Ring/Sphere */}
        <div className="relative w-28 h-28 flex items-center justify-center mr-2">
          {/* Glowing Center */}
          <div className="absolute w-16 h-16 bg-linear-to-br from-indigo-300 to-purple-400 rounded-full blur-md opacity-70"></div>
          <div className="absolute w-14 h-14 bg-linear-to-br from-blue-200 to-purple-300 rounded-full shadow-inner z-10"></div>
          
          {/* Orbiting Rings Container with a Mask for Faded Depth Illusion */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ 
              // This mask fades the rings *inside* the sphere region, creating depth as they spin past.
              maskImage: 'radial-gradient(circle, transparent 0%, transparent 15%, rgba(0,0,0,0.5) 25%, black 40%, black 100%)',
              WebkitMaskImage: 'radial-gradient(circle, transparent 0%, transparent 15%, rgba(0,0,0,0.5) 25%, black 40%, black 100%)'
            }}
          >
            {/* Speed significantly increased (durations reduced to 4s-10s) */}
            
            <div className="absolute w-24 h-24" style={{ transform: 'rotateX(65deg) rotateY(25deg)' }}>
              <div className="w-full h-full border border-indigo-400/70 border-t-indigo-400/10 rounded-full animate-[spin_4s_linear_infinite]" />
            </div>
            
            <div className="absolute w-24 h-24" style={{ transform: 'rotateX(65deg) rotateY(-45deg)' }}>
              <div className="w-full h-full border border-purple-400/70 border-b-purple-400/10 rounded-full animate-[spin_5s_linear_infinite_reverse]" />
            </div>
            
            <div className="absolute w-24 h-24" style={{ transform: 'rotateX(20deg) rotateY(65deg)' }}>
              <div className="w-full h-full border border-blue-400/70 border-l-blue-400/10 rounded-full animate-[spin_7s_linear_infinite]" />
            </div>
            
            <div className="absolute w-24 h-24" style={{ transform: 'rotateX(75deg) rotateY(15deg)' }}>
              <div className="w-full h-full border border-indigo-500/60 border-r-indigo-500/10 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
            </div>
            
            <div className="absolute w-24 h-24" style={{ transform: 'rotateX(45deg) rotateY(85deg)' }}>
              <div className="w-full h-full border border-purple-500/60 border-t-purple-500/10 rounded-full animate-[spin_10s_linear_infinite]" />
            </div>
          </div>
        </div>
      </div>
  );
};