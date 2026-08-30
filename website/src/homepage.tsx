import extImage from "/ext.png";
import ext2Image from "/ext2.png";
import ext3Image from "/ext3.png";
import logo from "/trans_logo.png";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  BrainCircuit,
  Filter,
} from "lucide-react";
import Feature from "./component/feature";
import { supabase } from "./utils/supabase";
import { toast, ToastContainer } from "react-toastify";

import { useState, useEffect } from "react";
import {type Session } from "@supabase/supabase-js";
import Footer from "./component/footer";
import PricingSection from "./component/pricingSection";
import HowItWorks from "./component/howItWorks";
// Make sure to import your supabase client and toast here

const Homepage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1. Fetch the initial session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Listen for login/logout events to update state automatically
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 3. Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  const handlePurchase = async () => {
    console.log("hello there")
    const {
  data: { session },
} = await supabase.auth.getSession();

console.log("SESSION:", session);
console.log("ACCESS TOKEN:", session?.access_token);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Show your login UI
    return;
  }

  const { data, error } = await supabase.functions.invoke(
    "create-checkout"
  );
  console.log("the data",data);

  if (error) {
    console.error("Checkout error:", error);
    return;
  }

  if (!data?.checkout_url) {
    console.error("No checkout URL returned");
    return;
  }
 window.location.href = data.checkout_url;
};

  async function userLogIn() {
    try {
      setIsLoading(true);
      if (session) return;
      // it works
      // OAuth redirects the page, so the loader will spin until the redirect happens
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
    redirectTo: `${window.location.origin}/`,
        },
      });
    
    } catch (err) {
      const error = err instanceof Error ? err.message : "unexpected";
      toast.error(`Error: ${error}`);
      console.log(`Error:`,err);
      setIsLoading(false); // Only turn off loading if there's an error (preventing redirect)
    }
  }

  async function userLogOut() {
    try {
      setIsLoading(true);
      if (!session) return;
      
      await supabase.auth.signOut();
      toast.success("Logged out!");
    } catch (err) {
      const error = err instanceof Error ? err.message : "unexpected";
      toast.error(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-slate-100 bg-black selection:bg-blue-500/30 overflow-x-hidden font-sans">
      <ToastContainer />
      
      {/* Playful Floating Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 bg-black/70 backdrop-blur-xl border border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.4)] rounded-full px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          
          {/* Logo Area */}
          <div className="flex items-center gap-3 flex-1 cursor-pointer group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300 border border-slate-800">
              <img src={logo} alt="Tubelens logo" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-white">
                TubeLens
              </span>
              <span className="hidden sm:inline-block bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-widest shadow-sm">
                Beta
              </span>
            </div>
          </div>

          {/* Centered Navigation */}
          <div className="hidden md:flex items-center space-x-1 flex-1 justify-center bg-slate-900/50 p-1.5 rounded-full border border-slate-800/50">
            <a href="#features" className="text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 px-5 py-2 rounded-full transition-all shadow-sm shadow-transparent hover:shadow-slate-900/50">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 px-5 py-2 rounded-full transition-all shadow-sm shadow-transparent hover:shadow-slate-900/50">
              How it Works
            </a>
            <a href="#pricing" className="text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 px-5 py-2 rounded-full transition-all shadow-sm shadow-transparent hover:shadow-slate-900/50">
              Pricing
            </a>
          </div>

          {/* Right side CTA & Auth */}
          <div className="flex-1 flex justify-end items-center gap-3">
            
            {/* Auth Button */}
            <button 
              onClick={session ? userLogOut : userLogIn}
              disabled={isLoading}
              className="group relative flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-300 hover:text-white bg-transparent hover:bg-slate-800/80 border border-slate-700/60 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                session ? "Sign out" : "Sign in"
              )}
            </button>

            {/* Primary Action Button */}
            <button className="hidden sm:flex group relative bg-white hover:bg-slate-200 text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 items-center gap-2 overflow-hidden">
              <span className="relative z-10">Add to Chrome</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-slate-400/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite] z-0"></div>
            </button>

          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-start min-h-screen">
          {/* Foreground Text & CTA */}
          <div className="relative z-20 text-center flex flex-col items-center bg-transparent max-w-3xl w-full mb-16">
            {/* Clean Headline */}
            <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[1.1] m-0 text-white mb-6">
              Watch <br className="sm:hidden" />
              <span className="text-emerald-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.2)]">
                Intentionally.
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed font-medium">
              Take back control of your feed. Filter out distractions
              automatically with smart, topic-based cards. Choose exactly what
              you want to see.
            </p>

            {/* Buttons and Badge anchored together */}
            <div className="flex flex-col items-center gap-6 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button onClick={handlePurchase} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-blue-500 transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 group w-full sm:w-auto">
                  Get TubeLens for Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-slate-900 text-white border-2 border-slate-700 px-8 py-4 rounded-xl font-bold text-base hover:border-slate-500 hover:bg-slate-800 transition-all flex items-center justify-center w-full sm:w-auto shadow-sm">
                  See Pricing
                </button>
              </div>

              {/* Web Store Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs shadow-sm">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Now available on Chrome Web Store
              </div>
            </div>
          </div>

          {/* Fanning Image Cards */}
          <div className="relative w-full max-w-5xl h-[400px] flex justify-center items-center opacity-90 md:opacity-100 z-0 mt-8">
            <img
              src={ext2Image}
              alt="Background left"
              className="absolute w-[230px] lg:w-[300px] rounded-2xl shadow-2xl transform -rotate-12 -translate-x-32 lg:-translate-x-64 translate-y-8 border border-slate-800 opacity-80 transition-transform hover:rotate-0 hover:z-20 hover:scale-105 duration-300"
            />
            <img
              src={ext3Image}
              alt="Background right"
              className="absolute w-[230px] lg:w-[300px] rounded-2xl shadow-2xl transform rotate-12 translate-x-32 lg:translate-x-64 translate-y-8 border border-slate-800 opacity-80 transition-transform hover:rotate-0 hover:z-20 hover:scale-105 duration-300"
            />
            <img
              src={extImage}
              alt="Background center"
              className="absolute w-[250px] lg:w-[340px] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] transform -translate-y-4 border border-slate-700 z-10 transition-transform hover:scale-105 duration-300"
            />
          </div>
        </section>

        <Feature />

        {/* How it Works Section */}
        <HowItWorks/>

        {/* Pricing Section */}
       <PricingSection />
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Homepage;
