import { Info, Sparkles } from "lucide-react";
import finaLogo from "/favicon.png";

export default function Header({ goToInfoPage }: { goToInfoPage: () => void }){
  return (
    <div className="flex justify-between items-center z-10">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
          <img src={finaLogo} alt="TubeLens Logo" className="w-full object-fill" />
        </div>
        <div>
          <h1 className="font-semibold text-black tracking-tight text-lg flex items-center gap-1.5">
            TubeLens <Sparkles size={16} strokeWidth={1.5} className="text-blue-400" />
          </h1>
          <p className="text-xs text-gray-500">Keeping you intentional.</p>
        </div>
      </div>

      {/* Added 'group' and 'relative' to the button */}
      <button onClick={goToInfoPage} className="group relative w-8 h-8 hover:cursor-pointer bg-white rounded-full flex items-center justify-center shadow-sm text-gray-800 hover:text-black transition">
        <Info size={18} />
        
        {/* Tooltip text plate */}
        <div className="absolute top-full right-0 mt-2 w-max px-2.5 py-1.5 bg-gray-800 text-white text-[10px] font-medium rounded shadow-lg opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 z-50">
          How to use effectively
        </div>
      </button>
    </div>
  );
}