/* eslint-disable react-hooks/set-state-in-effect */
import { CheckCircle2 } from "lucide-react";
const PricingSection = ({handleGetTubeLense}:{handleGetTubeLense:()=>void}) => {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
const Price=2.95;

  return (
     <section
          id="pricing"
          className="py-24 relative bg-black border-t border-slate-900"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/50 text-blue-400 font-black text-xs mb-6 uppercase tracking-widest border border-blue-900/50">
                Best offer
              </div>

              <h2 className="text-3xl lg:text-5xl font-black mb-6 text-white">
                Invest in your{" "}
                <span className="inline-block bg-slate-900 text-emerald-400 px-4 py-1 rounded-xl ml-1 border border-slate-800">
                  attention.
                </span>
              </h2>
              <p className="text-lg text-slate-400 font-medium">
                Start Now. Upgrade once. Own it forever.
              </p>
            </div>

            <div className="gap-8 max-w-4xl mx-auto items-center">
              {/* Free Tier */}
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

                  <button onClick={handleGetTubeLense} className="w-full hover:cursor-pointer bg-white text-slate-900 hover:bg-slate-200 py-4 rounded-xl font-black transition-all shadow-lg hover:scale-[1.02]">
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