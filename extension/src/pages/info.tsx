
import { Sparkles, CheckCircle2, XCircle, Lightbulb, ArrowLeft } from 'lucide-react';

const Info = ({ goToHome }: { goToHome: () => void }) => {
  return (
    <div className="flex flex-col h-full p-4 max-w-sm gap-4 bg-[#f6f7fb] text-slate-800 font-sans pb-8">
      
      {/* Header */}
      <div className="flex items-center min-h-fit gap-3 mb-1">
        {/* Optional: Add an onClick here to go back to the previous page using your router */}
        <button onClick={goToHome} className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-600 hover:text-black transition">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Lightbulb size={20} className="text-indigo-500" />
          How to Use
        </h1>
      </div>

      {/* Top Prominent Recommendation */}
      <div className="bg-gradient-to-r h-fit from-indigo-500 to-blue-600 rounded-xl p-4 text-white shadow-md">
        {/* Decorative background element */}
        <div className="absolute -right-4 -top-4 opacity-10">
          <Sparkles size={80} />
        </div>
        
        <h2 className="text-sm font-bold flex items-center gap-1.5 mb-1.5 relative z-10 uppercase tracking-wide">
          <Sparkles size={14} /> Highly Recommended
        </h2>
        <p className="text-[11px] text-indigo-50 font-medium leading-relaxed relative z-10">
          The 7 pre-built cards are heavily optimized. We strongly recommend using them over building your own custom cards for the best experience.
        </p>
      </div>

      {/* Guide: Creating Custom Topics */}
      <div className="bg-white rounded-xl min-h-screen h-fit p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col gap-5 border border-slate-100">
        <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">
          Effective Custom Topics
        </h3>

        {/* Rule 1: Positive Framing */}
        <div>
          <h4 className="text-[12px] font-bold text-slate-700 mb-1.5">1. Frame Positively</h4>
          <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
            Always tell the AI exactly what you <strong>want</strong> to see, rather than what to exclude.
          </p>
          
          <div className="flex flex-col gap-2 text-[11px]">
            <div className="flex items-start gap-2 bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-100">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-500 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold block mb-0.5">Do this:</span>
                "Study related videos, motivation, informational."
              </div>
            </div>
            
            <div className="flex items-start gap-2 bg-red-50 text-red-800 p-2.5 rounded-lg border border-red-100">
              <XCircle size={16} className="shrink-0 text-red-500 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold block mb-0.5">Instead of:</span>
                "No funny videos, no romantising, no clickbait."
              </div>
            </div>
          </div>
        </div>

        {/* Rule 2: Ideal Examples */}
        <div>
          <h4 className="text-[12px] font-bold text-slate-700 mb-1.5">2. Ideal Length & Tone</h4>
          <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
            Keep your topic sentences roughly this length. Be descriptive, focused, and objective:
          </p>
          
          <ul className="flex flex-col gap-2.5 text-[11px] text-slate-600 font-medium italic">
            <li className="bg-slate-50 p-3 rounded-lg border border-slate-100 relative pl-4 leading-relaxed">
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400 rounded-l-lg"></span>
              "Educational content focused on learning, solving, or building something real."
            </li>
            <li className="bg-slate-50 p-3 rounded-lg border border-slate-100 relative pl-4 leading-relaxed">
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400 rounded-l-lg"></span>
              "Direct, efficient explanations delivered by someone knowledgeable and to the point."
            </li>
          </ul>
        </div>

{/* Rule 3: minimum topic sentences */}
        <div>
          <h4 className="text-[12px] font-bold text-slate-700 mb-1.5">3. Minimum Topic Sentences</h4>
          <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
        Ensure the custome card(pack) has at least 3 topic sentences. This allows the AI to have enough context to generate relevant content.
          </p>
          <p>One minimal </p>
          <ul className="flex flex-col gap-2.5 text-[11px] text-slate-600 font-medium italic">
            <li className="bg-slate-50 p-3 rounded-lg border border-slate-100 relative pl-4 leading-relaxed">
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400 rounded-l-lg"></span>
              "Educational content focused on learning, solving, or building something real."
            </li>
            <li className="bg-slate-50 p-3 rounded-lg border border-slate-100 relative pl-4 leading-relaxed">
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400 rounded-l-lg"></span>
              "Direct, efficient explanations delivered by someone knowledgeable and to the point."
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Info;