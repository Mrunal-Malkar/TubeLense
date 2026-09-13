import { ArrowRight, BrainCircuit, Cpu, Filter, ShieldCheck, Sparkles } from 'lucide-react'

const HowItWorks = () => {
  return (
    <section
          id="how-it-works"
          className="py-24 relative bg-[#050505] border-t border-slate-800/60 overflow-hidden"
        >
          {/* Playful Background Elements - Darker Opacities */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-900/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl border-[2px] border-dashed border-slate-800/60 rounded-[4rem] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4 relative z-10">
            {/* Heading */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/50 text-indigo-400 font-black text-xs mb-6 uppercase tracking-widest border border-indigo-500/20">
                Under The Hood
              </div>
              <h2 className="text-3xl lg:text-5xl font-black mb-6 text-white leading-tight">
                Smart enough to understand, <br className="hidden md:block" />
                <span className="inline-block bg-emerald-950 text-emerald-400 px-4 py-1 rounded-2xl ml-1 border-2 border-emerald-800/60 transform rotate-1 shadow-sm">
                  private enough
                </span>{" "}
                to stay on device.
              </h2>
            </div>

            {/* Playful Staggered Grid */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Point 1: Privacy First */}
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 shadow-xl border-2 border-slate-800 relative group hover:-translate-y-1 transition-transform">
                <div className="absolute -top-4 -right-4 bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg transform rotate-6 group-hover:rotate-12 transition-transform">
                  Zero Cloud
                </div>
                <div className="w-14 h-14 bg-emerald-950/50 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 border border-emerald-900/50">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-white">
                  100% Privacy First
                </h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  Everything happens locally. There are no sneaky cloud servers
                  analyzing your feed. Your browsing habits, selected topics,
                  and processed videos{" "}
                  <strong className="text-slate-200">
                    never leave your device.
                  </strong>
                </p>
              </div>

              {/* Point 2: WebGPU + Transformers */}
              <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-xl border border-slate-800 md:translate-y-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
                <div className="flex gap-3 mb-6 relative z-10">
                  <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                    <Cpu className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      Powered by
                    </span>
                    <span className="text-white font-black bg-slate-950 px-3 py-1 rounded-lg mt-1 text-sm inline-block border border-slate-800">
                      Transformers.js
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-3 text-white relative z-10">
                  WebGPU Acceleration
                </h3>
                <p className="text-slate-400 leading-relaxed font-medium relative z-10">
                  By predominantly utilizing{" "}
                  <strong className="text-slate-200">WebGPU</strong>, the
                  extension taps directly into your browser's hardware. It runs
                  heavy machine-learning models blazingly fast without eating up
                  your battery.
                </p>
              </div>

              {/* Point 3: The Mini-LLM */}
              <div className="bg-blue-950/20 backdrop-blur-sm rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-2xl rounded-bl-2xl p-8 md:p-10 shadow-sm border-2 border-blue-900/30 mt-8 md:mt-0 relative">
                <div className="absolute top-8 right-8 animate-pulse text-blue-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="w-14 h-14 bg-blue-900/30 text-blue-400 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-800/30">
                  <BrainCircuit className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-white">
                  Mini-LLM Brain
                </h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  We packed a highly optimized, lightweight Large Language Model
                  right into the extension. It acts as a smart reader, instantly
                  understanding the real context of a video title and thumbnail.
                </p>
              </div>

              {/* Point 4: Context Filtering */}
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 shadow-sm border-2 border-dashed border-purple-900/50 md:translate-y-12 relative hover:border-purple-600 transition-colors">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-14 h-14 bg-purple-900/30 text-purple-400 rounded-xl flex items-center justify-center transform -rotate-6 border border-purple-800/50">
                    <Filter className="w-7 h-7" />
                  </div>
                  <div className="bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 flex items-center gap-1 shadow-sm">
                    Match <ArrowRight className="w-3 h-3" /> Filter
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-3 text-white">
                  Semantic Filtering
                </h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  It doesn't just block dumb keywords. The model
                  cross-references the video's context against your active{" "}
                  <strong className="text-slate-200">Card Topics</strong>. If
                  it’s a distraction, it vanishes from your screen before you
                  even scroll to it.
                </p>
              </div>
            </div>
          </div>
        </section>
  )
}

export default HowItWorks