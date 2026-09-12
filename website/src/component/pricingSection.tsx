/* eslint-disable react-hooks/set-state-in-effect */
import { CheckCircle2 } from "lucide-react";
import { supabase } from "../utils/supabase";
import { toast, ToastContainer } from "react-toastify";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const PricingSection = () => {
  
const [session, setSession] = useState<Session | null>(null);
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


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
const Price=2.95;

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
    return userLogIn();
  }

  const { data, error } = await supabase.functions.invoke(
    "create-checkout"
  );
  console.log("the data",data);

  if (error) {
    console.error("Checkout error:", error);
    toast.error("error while creating checkout session, please contact developer if problem persists.");
    return;
  }

  if (!data?.checkout_url) {
    console.error("No checkout URL returned");
    toast.error("error while creating checkout session, please contact developer if problem persists.");
    return;
  }

 window.location.assign(data.checkout_url);
};

 async function userLogIn() {
    try {
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
    }
  }
  return (
     <section
          id="pricing"
          className="py-24 relative bg-black border-t border-slate-900"
        >
    <ToastContainer/>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/50 text-blue-400 font-black text-xs mb-6 uppercase tracking-widest border border-blue-900/50">
                Simple Pricing
              </div>

              <h2 className="text-3xl lg:text-5xl font-black mb-6 text-white">
                Invest in your{" "}
                <span className="inline-block bg-slate-900 text-white px-4 py-1 rounded-xl ml-1 border border-slate-800">
                  attention.
                </span>
              </h2>
              <p className="text-lg text-slate-400 font-medium">
                Start Now. Upgrade once. Own it forever.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
              {/* Free Tier */}
              <div className="bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] p-10 border border-slate-800 shadow-xl hover:shadow-2xl transition-shadow">
                <h3 className="text-2xl font-bold mb-2 text-white">Starter</h3>
                <div className="text-5xl font-extrabold mb-6 text-white">
                  $0
                </div>
                <p className="text-slate-400 mb-8 text-sm font-medium h-10">
                  Perfect for casual users looking to build better digital
                  habits.
                </p>
                <ul className="space-y-5 mb-10">
                  <li className="flex items-center text-slate-300 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-slate-500 mr-3" />{" "}
                    Filter up to 300 videos / day
                  </li>
                  <li className="flex items-center text-slate-300 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-slate-500 mr-3" />{" "}
                    Access to 3 Basic Cards
                  </li>
                  <li className="flex items-center text-slate-300 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-slate-500 mr-3" />{" "}
                    Standard Intensity Control
                  </li>
                </ul>
                <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold transition-colors border border-slate-700">
                  Get Started Free
                </button>
              </div>

              {/* Premium Tier */}
              <div className="relative rounded-[2.5rem] p-[2px] bg-gradient-to-b from-blue-500 to-indigo-600 shadow-[0_0_30px_rgba(59,130,246,0.15)] md:-translate-y-4 hover:shadow-[0_0_40px_rgba(59,130,246,0.25)] transition-shadow">
                <div className="absolute -top-4 right-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg z-20">
                  Lifetime Value
                </div>
                <div className="bg-slate-950 rounded-[2.4rem] p-10 h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>

                  <h3 className="text-2xl font-bold mb-2 text-white">Pro</h3>
                  <div className="text-5xl font-extrabold mb-6 text-white">
                    ${Price?.toFixed(2) || '2.95'}{" "}
                    <span className="text-lg font-medium text-blue-400">
                      one-time
                    </span>
                  </div>
                  <p className="text-blue-100/70 mb-8 text-sm font-medium h-10">
                    Unlock complete freedom and unlimited intentional watching
                    forever.
                  </p>

                  <ul className="space-y-5 mb-10">
                    <li className="flex items-center text-white font-medium">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3" />{" "}
                      <strong className="mr-1">Unlimited</strong> daily video
                      filtering
                    </li>
                    <li className="flex items-center text-white font-medium">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3" />{" "}
                      All 7+ Premium Pre-built Cards
                    </li>
                    <li className="flex items-center text-white font-medium">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3" />{" "}
                      Create <strong className="ml-1">Unlimited</strong> Custom
                      Cards
                    </li>
                    <li className="flex items-center text-white font-medium">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3" />{" "}
                      Advanced Intensity Controls
                    </li>
                  </ul>

                  <button onClick={handlePurchase} className="w-full bg-white text-slate-900 hover:bg-slate-200 py-4 rounded-xl font-black transition-all shadow-lg hover:scale-[1.02]">
                    Unlock Lifetime Pro
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
  )
}

export default PricingSection