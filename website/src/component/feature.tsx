import { useState } from "react"
import { PlusCircle, SlidersHorizontal, Zap } from "lucide-react"
import BeforeAfterSlider from "./beforeAfterCarousel"

const Feature = () => {
  // Track which component is large and centered
  const [activeComponent, setActiveComponent] = useState('slider');

  return (
    <section id="features" className="py-24 relative bg-[#020202] border-t border-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-slate-300 font-black text-xs mb-6 uppercase tracking-widest border border-slate-800">
            Features
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-black mb-6 text-white leading-tight">
            Built for <span className="relative inline-block whitespace-nowrap">
              productivity
              {/* Decorative curved underline */}
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-500 opacity-80 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"/>
              </svg>
            </span> <br className="hidden md:block"/> & healthy binging.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">Replace the opaque algorithm with transparent, user-controlled filters that respect your time.</p>
        </div>

        {/* HIGH IMPORTANCE: Interactive Slider & Video Container */}
        {/* We give it a fixed height so the absolute positioned children don't collapse the layout */}
        <div className="relative max-w-5xl mx-auto mb-32 mt-12 group h-[620px] lg:h-[650px]">
          
          {/* Soft ambient glow behind the active component */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-900/40 via-indigo-600/40 to-purple-600/40 rounded-[3rem] blur-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>
          
          {/* 1. Before/After Slider Component */}
          <div 
            className={`absolute top-0 left-0 w-full bg-[#0a0a0a] p-2 md:p-3 rounded-[2rem] shadow-2xl border border-slate-800/80 origin-bottom-right transition-all duration-500 ease-in-out ${
              activeComponent === 'slider' 
                ? 'scale-100 translate-x-0 translate-y-0 z-10' 
                : 'scale-[0.30] translate-x-4 translate-y-8 sm:translate-x-12 sm:translate-y-12 z-30 cursor-pointer hover:border-slate-500 hover:scale-[0.32] shadow-[0_0_40px_rgba(0,0,0,0.8)]'
            }`}
            onClick={() => activeComponent !== 'slider' && setActiveComponent('slider')}
          >
            {/* Invisible overlay to block interactions with slider while it is small */}
            {activeComponent !== 'slider' && <div className="absolute inset-0 z-50 rounded-[2rem]" />}
            
            {/* Fake Browser Top Bar */}
            <div className="flex items-center gap-4 px-4 py-3 mb-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500 transition-colors"></div>
              </div>
              <div className="flex-1 max-w-md mx-auto bg-black text-slate-400 text-xs font-bold px-4 py-2 rounded-full flex items-center justify-center gap-2 border border-slate-800 shadow-inner">
                youtube.com <span className="bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider border border-blue-800/50">Filtered</span>
              </div>
            </div>
            
            <div className="rounded-[1.25rem] overflow-hidden bg-slate-900 border border-slate-800 relative shadow-inner">
              <BeforeAfterSlider />
            </div>
          </div>

          {/* 2. YouTube Video Component */}
          <div 
            className={`absolute top-0 left-0 w-full bg-[#0a0a0a] p-2 md:p-3 rounded-[2rem] shadow-2xl border border-slate-800/80 origin-bottom-right transition-all duration-500 ease-in-out ${
              activeComponent === 'video' 
                ? 'scale-100 translate-x-0 translate-y-0 z-10' 
                : 'scale-[0.30] translate-x-4 translate-y-8 sm:translate-x-12 sm:translate-y-12 z-30 cursor-pointer hover:border-slate-500 hover:scale-[0.32] shadow-[0_0_40px_rgba(0,0,0,0.8)]'
            }`}
            onClick={() => activeComponent !== 'video' && setActiveComponent('video')}
          >
            {/* Invisible overlay to block iframe clicks while it is small */}
            {activeComponent !== 'video' && <div className="absolute inset-0 z-50 rounded-[2rem]" />}

            {/* Fake Browser Top Bar */}
            <div className="flex items-center gap-4 px-4 py-3 mb-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500 transition-colors"></div>
              </div>
              <div className="flex-1 max-w-md mx-auto bg-black text-slate-400 text-xs font-bold px-4 py-2 rounded-full flex items-center justify-center gap-2 border border-slate-800 shadow-inner">
                youtube.com <span className="bg-red-900/40 text-red-400 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider border border-red-800/50">Unfiltered</span>
              </div>
            </div>
            
            <div className="h-[540px] rounded-[1.25rem] overflow-hidden bg-slate-900 border border-slate-800 relative shadow-inner">
            <iframe className="w-full h-full pointer-events-auto" src="https://www.youtube.com/embed/xOD69LngPzI?si=aen5i3DpiUJkZTED" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>
          </div>

          {/* Playful Floating Labels */}
          <div className={`absolute -left-8 top-1/2 -translate-y-1/2 bg-slate-900 px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.8)] border border-slate-700 transform -rotate-6 z-20 hidden lg:flex items-center gap-2 animate-[bounce_3s_infinite_ease-in-out] transition-opacity duration-300 ${activeComponent === 'video' ? 'opacity-0' : 'opacity-100'}`}>
            <span className="text-2xl">😵‍💫</span> 
            <span className="text-sm font-black text-slate-200">The Noise</span>
          </div>
          
          <div className={`absolute -right-8 top-1/2 -translate-y-1/2 bg-black px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.8)] border border-slate-800 transform rotate-6 z-20 hidden lg:flex items-center gap-2 animate-[bounce_3s_infinite_ease-in-out_0.5s] transition-opacity duration-300 ${activeComponent === 'video' ? 'opacity-0' : 'opacity-100'}`}>
            <span className="text-2xl">🧘‍♂️</span> 
            <span className="text-sm font-black text-white">The Focus</span>
          </div>
        </div>

        {/* 3-Column Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 sm:mt-8">
          {/* Feature 1 */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-[2rem] p-8 border border-slate-800 hover:shadow-xl hover:shadow-blue-900/10 transition-all hover:-translate-y-1 duration-300 group">
            <div className="w-12 h-12 bg-blue-900/30 text-blue-400 rounded-xl flex items-center justify-center mb-6 border border-blue-800/30 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Pre-built Filter Cards</h3>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed font-medium">Activate our expertly curated topic packs instantly. Block the noise with a single click.</p>
            <ul className="space-y-3">
              <li className="flex items-center text-sm font-bold text-slate-200 bg-slate-950 px-4 py-3 rounded-xl shadow-sm border border-slate-800">
                <span className="mr-3 text-lg">📚</span> NO BS: Pure Educational
              </li>
              <li className="flex items-center text-sm font-bold text-slate-200 bg-slate-950 px-4 py-3 rounded-xl shadow-sm border border-slate-800">
                <span className="mr-3 text-lg">😂</span> Good Vibes: Comedy & Fun
              </li>
              <li className="text-xs text-blue-400 font-bold pl-2 pt-1">+ 5 more specialized cards</li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-[2rem] p-8 border border-slate-800 hover:shadow-xl hover:shadow-blue-900/10 transition-all hover:-translate-y-1 duration-300 group">
            <div className="w-12 h-12 bg-blue-900/30 text-blue-400 rounded-xl flex items-center justify-center mb-6 border border-blue-800/30 group-hover:scale-110 transition-transform">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Focus Intensity</h3>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed font-medium">Not all days require military-grade focus. Dial in your exact level of control dynamically.</p>
            <div className="bg-slate-950 border border-slate-800 p-1.5 rounded-2xl flex text-sm text-center relative overflow-hidden">
              <div className="absolute inset-y-1.5 left-[33%] w-[33%] bg-slate-800 rounded-xl shadow-md border border-slate-700 transition-all"></div>
              <div className="flex-1 py-3 text-slate-500 font-bold z-10 hover:text-slate-300 transition-colors cursor-pointer">Relaxed</div>
              <div className="flex-1 py-3 text-white font-black z-10 cursor-pointer">Balanced</div>
              <div className="flex-1 py-3 text-slate-500 font-bold z-10 hover:text-slate-300 transition-colors cursor-pointer">Strict</div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-[2rem] p-8 border border-slate-800 hover:shadow-xl hover:shadow-blue-900/10 transition-all hover:-translate-y-1 duration-300 group">
            <div className="w-12 h-12 bg-blue-900/30 text-blue-400 rounded-xl flex items-center justify-center mb-6 border border-blue-800/30 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Build Custom Cards</h3>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed font-medium">Your feed, your rules. Group your own topics, keywords, and channels into custom decks.</p>
            <div className="mt-8 border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-800/50 hover:border-blue-500/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group/btn">
              <PlusCircle className="w-8 h-8 text-slate-500 group-hover/btn:text-blue-400 transition-colors" />
              <span className="text-sm font-bold text-slate-400 group-hover/btn:text-slate-200 transition-colors">Create New Deck</span>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  )
}

export default Feature