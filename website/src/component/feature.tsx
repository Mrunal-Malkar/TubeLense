import { PlusCircle, SlidersHorizontal, Zap } from "lucide-react"
import BeforeAfterSlider from "./beforeAfterCarousel"

const Feature=()=>{
return(
        <section id="features" className="py-24 relative bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Heading */}
            <div className="text-center mb-16">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-black text-xs mb-6 uppercase tracking-widest">
                Features
              </div>
              
              <h2 className="text-3xl lg:text-5xl font-black mb-6 text-slate-900 leading-tight">
                Built for <span className="relative inline-block whitespace-nowrap">
                  deep work
                  {/* Decorative curved underline */}
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-500 opacity-70" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"/>
                  </svg>
                </span> <br className="hidden md:block"/> & healthy binging.
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">Replace the opaque algorithm with transparent, user-controlled filters that respect your time.</p>
            </div>

            {/* HIGH IMPORTANCE: Before/After Slider Container */}
            <div className="relative max-w-5xl mx-auto mb-24 mt-12 group">
              {/* Soft ambient glow behind the slider */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 via-indigo-100 to-purple-200 rounded-[3rem] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>
              
              {/* Browser Mockup Frame */}
              <div className="relative z-10 bg-white p-2 md:p-3 rounded-[2rem] shadow-2xl border border-slate-200/80">
                
                {/* Fake Browser Top Bar */}
                <div className="flex items-center gap-4 px-4 py-3 mb-2">
                  {/* Traffic Light Buttons */}
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-200 hover:bg-red-400 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-200 hover:bg-amber-400 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-200 hover:bg-emerald-400 transition-colors"></div>
                  </div>
                  {/* Fake URL Bar */}
                  <div className="flex-1 max-w-md mx-auto bg-slate-50 text-slate-400 text-xs font-bold px-4 py-2 rounded-full flex items-center justify-center gap-2 border border-slate-100">
                    youtube.com <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider">Filtered</span>
                  </div>
                </div>
                
                {/* The Slider Component Wrapper */}
                <div className="rounded-[1.25rem] overflow-hidden bg-slate-100 border border-slate-100 relative shadow-inner">
                  {/* Assuming BeforeAfterSlider handles its own height/aspect ratio */}
                  <BeforeAfterSlider />
                </div>
              </div>

              {/* Playful Floating Labels (Hidden on small screens) */}
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 bg-white px-5 py-3 rounded-2xl shadow-xl border border-slate-100 transform -rotate-6 z-20 hidden lg:flex items-center gap-2 animate-[bounce_3s_infinite_ease-in-out]">
                <span className="text-2xl">😵‍💫</span> 
                <span className="text-sm font-black text-slate-700">The Noise</span>
              </div>
              
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 bg-slate-900 px-5 py-3 rounded-2xl shadow-xl border border-slate-800 transform rotate-6 z-20 hidden lg:flex items-center gap-2 animate-[bounce_3s_infinite_ease-in-out_0.5s]">
                <span className="text-2xl">🧘‍♂️</span> 
                <span className="text-sm font-black text-white">The Focus</span>
              </div>
            </div>

            {/* 3-Column Features Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Pre-built Filter Cards</h3>
                <p className="text-slate-600 mb-6 text-sm leading-relaxed font-medium">Activate our expertly curated topic packs instantly. Block the noise with a single click.</p>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm font-bold text-slate-700 bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-100">
                    <span className="mr-3 text-lg">📚</span> NO BS: Pure Educational
                  </li>
                  <li className="flex items-center text-sm font-bold text-slate-700 bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-100">
                    <span className="mr-3 text-lg">😂</span> Good Vibes: Comedy & Fun
                  </li>
                  <li className="text-xs text-blue-600 font-bold pl-2 pt-1">+ 5 more specialized cards</li>
                </ul>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Focus Intensity</h3>
                <p className="text-slate-600 mb-8 text-sm leading-relaxed font-medium">Not all days require military-grade focus. Dial in your exact level of control dynamically.</p>
                <div className="bg-slate-200 p-1.5 rounded-2xl flex text-sm text-center relative overflow-hidden">
                  <div className="absolute inset-y-1.5 left-[33%] w-[33%] bg-white rounded-xl shadow-sm border border-slate-100 transition-all"></div>
                  <div className="flex-1 py-3 text-slate-500 font-bold z-10">Relaxed</div>
                  <div className="flex-1 py-3 text-slate-900 font-black z-10">Balanced</div>
                  <div className="flex-1 py-3 text-slate-500 font-bold z-10">Strict</div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Build Custom Cards</h3>
                <p className="text-slate-600 mb-6 text-sm leading-relaxed font-medium">Your feed, your rules. Group your own topics, keywords, and channels into custom decks.</p>
                <div className="mt-8 border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-100 hover:border-blue-300 transition-all cursor-pointer flex flex-col items-center justify-center gap-2">
                  <PlusCircle className="w-8 h-8 text-slate-400" />
                  <span className="text-sm font-bold text-slate-600">Create New Deck</span>
                </div>
              </div>
            </div>
            
          </div>
        </section>)
}

export default Feature