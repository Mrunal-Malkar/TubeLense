import extImage from "./assets/ext.png"
import ext2Image from "./assets/ext2.png"
import ext3Image from "./assets/ext3.png"
import logo from "./assets/Logov4.svg";
import { 
  CheckCircle2, 
  Sparkles, 
  MonitorPlay,
  ArrowRight,
  ShieldCheck, // New
  Cpu,         // New
  BrainCircuit, // New
  Filter       // New
} from 'lucide-react';
import Feature from "./component/feature";

const Homepage = () => {
  return (
    <div className="min-h-screen text-slate-900 bg-[#17221e] selection:bg-blue-500/30 overflow-x-hidden font-sans">
      
      {/* Navbar - Light Mode */}
     {/* Playful Floating Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          
          {/* Logo Area */}
          <div className="flex items-center gap-3 flex-1 cursor-pointer group">
            {/* Playful tilted logo box */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300 bg-white">
              <img src={logo} alt="Tubelens logo" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-slate-900">TubeLens</span>
              {/* Little floating version badge */}
              <span className="hidden sm:inline-block bg-indigo-50 text-indigo-600 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-indigo-100 uppercase tracking-widest shadow-sm">
                Beta
              </span>
            </div>
          </div>
          
          {/* Centered Navigation (Inner Pill Menu) */}
          <div className="hidden md:flex items-center space-x-1 flex-1 justify-center bg-slate-100/50 p-1.5 rounded-full border border-slate-200/50">
            <a href="#features" className="text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-white px-5 py-2 rounded-full transition-all shadow-sm shadow-transparent hover:shadow-slate-200/50">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-white px-5 py-2 rounded-full transition-all shadow-sm shadow-transparent hover:shadow-slate-200/50">
              How it Works
            </a>
            <a href="#pricing" className="text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-white px-5 py-2 rounded-full transition-all shadow-sm shadow-transparent hover:shadow-slate-200/50">
              Pricing
            </a>
          </div>
          
          {/* Right side CTA */}
          <div className="flex-1 flex justify-end">
            <button className="group relative bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 overflow-hidden border border-slate-800">
              <span className="relative z-10">Add to Chrome</span>
              {/* Very subtle shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite] z-0"></div>
            </button>
          </div>
          
        </div>
      </nav>
       
   <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-start min-h-screen">
          
          {/* Foreground Text & CTA - Moved to the Top */}
          <div className="relative z-20 text-center flex flex-col items-center bg-transparent max-w-3xl w-full mb-16">
            
            {/* Clean Headline - Removed tilted banner, colored 'Intentionally' */}
            <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[1.1] m-0 text-white mb-6">
              Watch <br className="sm:hidden" />
              <span className="text-purple-500">Intentionally.</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed font-medium">
              Take back control of your feed. Filter out distractions automatically with smart, topic-based cards. Choose exactly what you want to see.
            </p>
            
            {/* Buttons and Badge anchored together */}
            <div className="flex flex-col items-center gap-6 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group w-full sm:w-auto">
                  Get TubeLens for Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-transparent text-white border-2 border-slate-700 px-8 py-4 rounded-xl font-bold text-base hover:border-slate-500 hover:bg-slate-800 transition-all flex items-center justify-center w-full sm:w-auto shadow-sm">
                  See Pricing
                </button>
              </div>

              {/* Web Store Badge - Moved below CTAs for Social Proof */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs shadow-sm">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Now available on Chrome Web Store
              </div>
            </div>
          </div>

          {/* Fanning Image Cards - Moved below the text block */}
          <div className="relative w-full max-w-5xl h-[400px] flex justify-center items-center opacity-90 md:opacity-100 z-0 mt-8">
            {/* Left Card */}
            <img 
              src={ext2Image} 
              alt="Background left" 
              className="absolute w-[230px] lg:w-[300px] rounded-2xl shadow-xl transform -rotate-12 -translate-x-32 lg:-translate-x-64 translate-y-8 border border-slate-700 opacity-80 transition-transform hover:rotate-0 hover:z-20 hover:scale-105 duration-300"
            />
            {/* Right Card */}
            <img 
              src={ext3Image} 
              alt="Background right" 
              className="absolute w-[230px] lg:w-[300px] rounded-2xl shadow-xl transform rotate-12 translate-x-32 lg:translate-x-64 translate-y-8 border border-slate-700 opacity-80 transition-transform hover:rotate-0 hover:z-20 hover:scale-105 duration-300"
            />
            {/* Center Card */}
            <img 
              src={extImage} 
              alt="Background center" 
              className="absolute w-[250px] lg:w-[340px] rounded-2xl shadow-2xl transform -translate-y-4 border border-slate-600 z-10 transition-transform hover:scale-105 duration-300"
            />
          </div>
        </section>

      <Feature/>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-24 relative bg-slate-50 border-t border-slate-200 overflow-hidden">
          
          {/* Playful Background Elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-100/50 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl border-[2px] border-dashed border-slate-200/50 rounded-[4rem] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* Heading */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-black text-xs mb-6 uppercase tracking-widest border border-indigo-100">
                Under The Hood
              </div>
              <h2 className="text-3xl lg:text-5xl font-black mb-6 text-slate-900 leading-tight">
                Smart enough to understand, <br className="hidden md:block"/>
                <span className="inline-block bg-emerald-100 text-emerald-800 px-4 py-1 rounded-2xl ml-1 border-2 border-emerald-200 transform rotate-1 shadow-sm">
                  private enough
                </span> to stay on device.
              </h2>
            </div>

            {/* Playful Staggered Grid */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              {/* Point 1: Privacy First */}
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-lg border-2 border-slate-100 relative group hover:-translate-y-1 transition-transform">
                <div className="absolute -top-4 -right-4 bg-emerald-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-md transform rotate-6 group-hover:rotate-12 transition-transform">
                  Zero Cloud
                </div>
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-slate-900">100% Privacy First</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Everything happens locally. There are no sneaky cloud servers analyzing your feed. Your browsing habits, selected topics, and processed videos <strong>never leave your device.</strong>
                </p>
              </div>

              {/* Point 2: WebGPU + Transformers */}
              <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-xl border border-slate-800 md:translate-y-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
                <div className="flex gap-3 mb-6 relative z-10">
                  <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                    <Cpu className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Powered by</span>
                    <span className="text-white font-black bg-slate-800 px-3 py-1 rounded-lg mt-1 text-sm inline-block">
                      Transformers.js
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-3 text-white relative z-10">WebGPU Acceleration</h3>
                <p className="text-slate-400 leading-relaxed font-medium relative z-10">
                  By predominantly utilizing <strong>WebGPU</strong>, the extension taps directly into your browser's hardware. It runs heavy machine-learning models blazingly fast without eating up your battery.
                </p>
              </div>

              {/* Point 3: The Mini-LLM */}
              <div className="bg-blue-50 rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-2xl rounded-bl-2xl p-8 md:p-10 shadow-sm border-2 border-blue-100 mt-8 md:mt-0 relative">
                <div className="absolute top-8 right-8 animate-pulse text-blue-300">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="w-14 h-14 bg-white text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <BrainCircuit className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-slate-900">Mini-LLM Brain</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  We packed a highly optimized, lightweight Large Language Model right into the extension. It acts as a smart reader, instantly understanding the real context of a video title and thumbnail.
                </p>
              </div>

              {/* Point 4: Context Filtering */}
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border-2 border-dashed border-purple-300 md:translate-y-12 relative hover:border-purple-500 transition-colors">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center transform -rotate-6 border border-purple-100">
                    <Filter className="w-7 h-7" />
                  </div>
                  <div className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1 shadow-sm">
                    Match <ArrowRight className="w-3 h-3" /> Filter
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-3 text-slate-900">Semantic Filtering</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  It doesn't just block dumb keywords. The model cross-references the video's context against your active <strong>Card Topics</strong>. If it’s a distraction, it vanishes from your screen before you even scroll to it.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 relative bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-black text-xs mb-6 uppercase tracking-widest border border-blue-100">
                Simple Pricing
              </div>

              <h2 className="text-3xl lg:text-5xl font-black mb-6 text-slate-900">
                Invest in your <span className="inline-block bg-slate-100 text-slate-800 px-4 py-1 rounded-xl ml-1 border border-slate-200">attention.</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium">Start for free. Upgrade once. Own it forever.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
              
              {/* Free Tier */}
              <div className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-xl hover:shadow-2xl transition-shadow">
                <h3 className="text-2xl font-bold mb-2 text-white">Starter</h3>
                <div className="text-5xl font-extrabold mb-6 text-white">$0</div>
                <p className="text-slate-400 mb-8 text-sm font-medium h-10">Perfect for casual users looking to build better digital habits.</p>
                <ul className="space-y-5 mb-10">
                  <li className="flex items-center text-slate-300 font-medium"><CheckCircle2 className="w-5 h-5 text-slate-500 mr-3" /> Filter up to 300 videos / day</li>
                  <li className="flex items-center text-slate-300 font-medium"><CheckCircle2 className="w-5 h-5 text-slate-500 mr-3" /> Access to 3 Basic Cards</li>
                  <li className="flex items-center text-slate-300 font-medium"><CheckCircle2 className="w-5 h-5 text-slate-500 mr-3" /> Standard Intensity Control</li>
                </ul>
                <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold transition-colors">
                  Get Started Free
                </button>
              </div>

              {/* Premium Tier */}
              <div className="relative rounded-[2.5rem] p-[2px] bg-linear-to-b from-blue-500 to-indigo-600 shadow-2xl md:-translate-y-4 hover:shadow-blue-500/20 transition-shadow">
                <div className="absolute -top-4 right-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg z-20">
                  Lifetime Value
                </div>
                <div className="bg-slate-950 rounded-[2.4rem] p-10 h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
                  
                  <h3 className="text-2xl font-bold mb-2 text-white">Pro</h3>
                  <div className="text-5xl font-extrabold mb-6 text-white">
                    $2.70 <span className="text-lg font-medium text-blue-400">one-time</span>
                  </div>
                  <p className="text-blue-100/70 mb-8 text-sm font-medium h-10">Unlock complete freedom and unlimited intentional watching forever.</p>
                  
                  <ul className="space-y-5 mb-10">
                    <li className="flex items-center text-white font-medium"><CheckCircle2 className="w-5 h-5 text-blue-400 mr-3" /> <strong>Unlimited</strong> daily video filtering</li>
                    <li className="flex items-center text-white font-medium"><CheckCircle2 className="w-5 h-5 text-blue-400 mr-3" /> All 7+ Premium Pre-built Cards</li>
                    <li className="flex items-center text-white font-medium"><CheckCircle2 className="w-5 h-5 text-blue-400 mr-3" /> Create <strong>Unlimited</strong> Custom Cards</li>
                    <li className="flex items-center text-white font-medium"><CheckCircle2 className="w-5 h-5 text-blue-400 mr-3" /> Advanced Intensity Controls</li>
                  </ul>
                  
                  <button className="w-full bg-white text-slate-900 hover:bg-slate-100 py-4 rounded-xl font-black transition-all shadow-lg hover:scale-[1.02]">
                    Unlock Lifetime Pro
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <MonitorPlay className="w-5 h-5 text-blue-600" />
              <span className="font-black text-slate-900 tracking-tight">TubeLens</span>
            </div>
            
            <div className="flex space-x-8 text-sm font-bold text-slate-500">
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Contact Support</a>
            </div>
          </div>
          <div className="mt-8 text-center md:text-left text-slate-400 font-medium text-xs">
            © {new Date().getFullYear()} TubeLens. All rights reserved.
          </div>
        </div>
      </footer>
  //   </div>
  );
};

export default Homepage;