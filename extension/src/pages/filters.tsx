import React, { useEffect, useState } from 'react';
import Carousel from '../components/topicsCarousel';
import StrictnessToggle from '../components/strictnessToggle';
import { useDispatch, useSelector } from 'react-redux';
import { addIgnoredChannels, appendChannel, removeChannel } from '../store/baseInfoStore';
import { toast, ToastContainer } from 'react-toastify';

const Filters = () => {
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ignoredChannels: string[] = useSelector((state: any) => state.preference?.ignoredChannels);
  const [inputValue, setInputValue] = useState('');
  const [safeChannels,setSafeChannels]=useState<string[]>(ignoredChannels??[]);

  // 1. Load initially from Chrome storage
  useEffect(() => {
    const fetchChannels = async () => {
      if (!ignoredChannels) {
        const result = await chrome.storage.local.get("ignoredChannels");
        const channels = (result.ignoredChannels as string[]) ?? [];
        dispatch(addIgnoredChannels(channels));
      }
    };
    fetchChannels();
  }, [ignoredChannels, dispatch]);

  // 2. Add channel (Updates Redux + Chrome Storage)
  const handleAddChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedChannel = inputValue.trim();
    
    if (trimmedChannel && !safeChannels.includes(trimmedChannel)) {
      const updatedChannels = [...safeChannels, trimmedChannel];
      
      // Update Redux
      dispatch(appendChannel(trimmedChannel));
      
      // Update Chrome Local Storage
      await chrome.storage.local.set({ ignoredChannels: updatedChannels });
      
      setInputValue(''); 
    }
  };

  // 3. Remove channel (Updates Redux + Chrome Storage)
  const handleRemoveChannel = async (channelToRemove: string) => {
    const updatedChannels = safeChannels.filter(channel => channel !== channelToRemove);
    setSafeChannels(updatedChannels);
    // Update Redux
    dispatch(removeChannel(channelToRemove)); 
    
    // Update Chrome Local Storage
    await chrome.storage.local.set({ ignoredChannels: updatedChannels });
    toast.info("refresh tab to see changes!")
  };

  return (
    <div className="flex flex-col h-full p-4 max-w-sm gap-6">
      <ToastContainer/>
      <div>
        <h1 className="text-lg font-semibold text-slate-700 m-0.5 flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-indigo-400" />
          Packs & corresponding topics
        </h1>
        <div className="mt-2">
          <Carousel />
        </div>
      </div>

      <div className="flex flex-col p-1">
        <h2 className="text-sm p-2 font-semibold text-slate-600 mb-3 flex items-center justify-between">
          Ignored Channels
          <span className="bg-slate-100 text-slate-500 py-0.5 px-2 rounded-full text-xs font-medium">
            {safeChannels.length}
          </span>
        </h2>
        
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          
          <form onSubmit={handleAddChannel} className="relative flex items-center mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. Cocomelon, T-Series"
              className="w-full pl-3 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-1.5 p-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 disabled:opacity-50 disabled:hover:bg-indigo-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </form>

          {safeChannels.length > 0 ? (
            <ul className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
              {safeChannels.map((channel: string, index: number) => (
                <li 
                  key={index} 
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm transition-colors hover:border-red-300 hover:bg-red-50 group cursor-default"
                >
                  <span className="truncate max-w-[140px]">{channel}</span>
                  
                  <button 
                    type="button"
                    onClick={() => handleRemoveChannel(channel)}
                    className="text-slate-300 group-hover:text-red-500 rounded-full transition-colors focus:outline-none"
                    aria-label={`Remove ${channel}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 text-slate-400">
              <span className="text-sm italic">No channels ignored yet</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <StrictnessToggle />
      </div>
      
    </div>
  );
};

export default Filters;