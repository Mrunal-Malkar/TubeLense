
import { MoreHorizontal, Sparkles } from "lucide-react";
import finaLogo from "./../assets/Logov4.svg";

export default function Header(){
  return (
    <div className="flex justify-between items-center z-10">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
          
          {/* 2. Use the imported variable as the src */}
          <img src={finaLogo} alt="TubeLens Logo" className="w-full object-fill" />
          
        </div>
        <div>
          
          {/* 3. Changed to font-semibold for the perfect semi-bold weight */}
          <h1 className="font-semibold text-black tracking-tight text-lg flex items-center gap-1.5">
            TubeLens <Sparkles size={16} strokeWidth={1.5} className="text-blue-400" />
          </h1>
          <p className="text-xs text-gray-500">Keeping you intentional.</p>
          
        </div>
      </div>
      <button className="w-8 h-8 hover:cursor-pointer bg-white rounded-full flex items-center justify-center shadow-sm text-gray-800 hover:text-black transition">
        <MoreHorizontal size={18} />
      </button>
    </div>
  );
};
