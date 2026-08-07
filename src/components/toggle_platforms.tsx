import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { toggleSiteEnabled } from '../store/baseInfoStore';

type PlatformId = 'yt' | 'x' | 'insta' | 'google';

type PlatformOption = {
  id: PlatformId;
  name: string;
  short: string;
};

const PlatformsToggles = () => {
  const dispatch=useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const initials=useSelector((state:any)=>state.preference.sites);
  const [platforms, setPlatforms] = useState<Record<PlatformId, boolean>>({
    yt: initials.yt,
    x: initials.x,
    insta: initials.insta,
    google: initials.google,
  });

  const togglePlatform = (platformId: PlatformId) => {
    try{
      setPlatforms((prev) => ({
        ...prev,
        [platformId]: !prev[platformId],
      }));
      dispatch(toggleSiteEnabled(platformId));
    }catch(e){
      const Error=e instanceof ErrorEvent?true:false;
      toast.error(`failed to perform operation ${Error?Error:":unexpected."}`);
    }
  };

  const platformData: PlatformOption[] = [
    { id: 'yt', name: 'YouTube', short: 'yt' },
    { id: 'x', name: 'X (Twitter)', short: 'x' },
    { id: 'insta', name: 'Instagram', short: 'insta' },
    { id: 'google', name: 'Google Search', short: 'google' },
  ];

  return (
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] z-10 relative">
          <ToastContainer/>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-800">Platform Blockers</h3>
            <span className="text-[10px] text-gray-400 font-medium">Toggle active filtering</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {platformData.map((plat) => (
              <div key={plat.id} className="flex justify-between items-center">
                <span className="text-xs text-gray-700 font-normal">{plat.name}</span>
                
                {/* --- CUSTOM SLEEK TOGGLE --- */}
                <button
                  onClick={() => togglePlatform(plat.id)}
                  type="button"
                  aria-pressed={platforms[plat.id]}
                  // The container with relative positioning
                  className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full p-0.5 transition-all duration-300 ease-in-out focus:outline-none 
                    ${platforms[plat.id]
                        ? 'bg-linear-to-r from-indigo-400 to-indigo-600 shadow-[inset_0_1px_4px_rgba(0,0,0,0.15)]'
                        : 'bg-gray-100 shadow-[inset_0_1px_4px_rgba(0,0,0,0.1)]'
                    }`}
                >
                  <span className="sr-only">Toggle {plat.name} Blocker</span>
                  
                  {/* Faded short name embedded *inside* the track (behind the circle) */}
                  <span 
                    className={`absolute inset-0 flex items-center justify-center font-bold text-[10px] uppercase tracking-wider transition-opacity duration-300 select-none
                      ${platforms[plat.id] 
                        ? 'text-white/30 opacity-100' // Faded white when on indigo background
                        : 'text-gray-900/10 opacity-100' // Barely visible black when on gray background
                      }`}
                  >
                    {plat.short}
                  </span>

                  {/* The moving circle (Thumb) */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out
                      ${platforms[plat.id] ? 'translate-x-6' : 'translate-x-0'}`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
  );
};

export default PlatformsToggles;