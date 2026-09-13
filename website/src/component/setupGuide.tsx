import React from 'react';
import { CreditCard, Download, Settings, FolderUp, CheckCircle2, FileArchive } from 'lucide-react';

const SetupGuide = () => {
  return (
    <section id="setup-guide" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/50">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">
          1-Minute <span className="text-blue-500">Setup Guide</span>
        </h2>
        <p className="text-lg text-slate-400 font-medium">
          Because TubeLens is completely independent and not bound by Web Store restrictions, installation takes a few simple manual steps.
        </p>
      </div>

      {/* Pre-requisite: Payment & Download Path */}
      <div className="max-w-4xl mx-auto mb-20 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-center gap-8 shadow-lg">
        <div className="flex flex-col items-center text-center max-w-xs">
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 mb-3 border border-blue-500/20">
            <CreditCard size={24} />
          </div>
          <h4 className="text-white font-bold mb-1">1. Secure Checkout</h4>
          <p className="text-xs text-slate-400">Complete your one-time payment securely via Stripe.</p>
        </div>
        
        {/* Connecting Line */}
        <div className="hidden md:block w-24 h-px bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0"></div>
        
        <div className="flex flex-col items-center text-center max-w-xs">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mb-3 border border-emerald-500/20">
            <Download size={24} />
          </div>
          <h4 className="text-white font-bold mb-1">2. Auto-Download</h4>
          <p className="text-xs text-slate-400">Your TubeLens .zip file will download instantly after payment.</p>
        </div>
      </div>

      {/* Steps Timeline */}
      <div className="max-w-5xl mx-auto flex flex-col gap-24">
        
        {/* Step 1: Extract (New) */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xl shadow-lg shadow-blue-600/30">
              1
            </div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <FileArchive className="text-blue-400" /> Extract the .zip file
            </h3>
            <p className="text-slate-400 leading-relaxed text-lg">
              Chrome cannot install raw `.zip` files, so you need to extract it first. <br/><br/>
              Locate the downloaded <strong>TubeLens.zip</strong> file. Right-click it and select <strong>"Extract All..."</strong> (Windows) or double-click it (Mac) to unzip it into a regular folder. Remember where you saved this extracted folder!
            </p>
          </div>
          {/* Image Placeholder */}
          <div className="flex-1 w-full relative">
            <div className="aspect-video bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden group">
              {/* REPLACE THIS DIV WITH YOUR <img src={step1Image} /> */}
              <span className="text-slate-600 font-medium group-hover:scale-105 transition-transform text-center px-4">Add Extract/Unzip Image Here</span>
            </div>
          </div>
        </div>

        {/* Step 2: Manage Extensions (Alternating Layout) */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xl shadow-lg shadow-blue-600/30">
              2
            </div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <Settings className="text-blue-400" /> Go to Manage Extensions
            </h3>
            <p className="text-slate-400 leading-relaxed text-lg">
              Open a new tab in Chrome and navigate to <code className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-sm">chrome://extensions</code>. <br/><br/>
              <strong>Crucial:</strong> Toggle on <strong>"Developer mode"</strong> in the top right corner of the page.
            </p>
          </div>
          {/* Image Placeholder */}
          <div className="flex-1 w-full relative">
            <div className="aspect-video bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden group">
              {/* REPLACE THIS DIV WITH YOUR <img src={step2Image} /> */}
              <span className="text-slate-600 font-medium group-hover:scale-105 transition-transform text-center px-4">Add Extensions Page Image Here</span>
            </div>
          </div>
        </div>

        {/* Step 3: Load Unpacked */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xl shadow-lg shadow-blue-600/30">
              3
            </div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <FolderUp className="text-blue-400" /> Click "Load unpacked"
            </h3>
            <p className="text-slate-400 leading-relaxed text-lg">
              Once Developer mode is on, a new menu bar will appear at the top left of your screen. Click the button that says <strong>"Load unpacked"</strong>.
            </p>
          </div>
          {/* Image Placeholder */}
          <div className="flex-1 w-full relative">
            <div className="aspect-video bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden group">
              {/* REPLACE THIS DIV WITH YOUR <img src={step3Image} /> */}
              <span className="text-slate-600 font-medium group-hover:scale-105 transition-transform text-center px-4">Add "Load Unpacked" Image Here</span>
            </div>
          </div>
        </div>

        {/* Step 4: Select Folder (Alternating Layout) */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500 text-white font-black text-xl shadow-lg shadow-emerald-500/30">
              4
            </div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <CheckCircle2 className="text-emerald-400" /> Select the Unzipped Folder
            </h3>
            <p className="text-slate-400 leading-relaxed text-lg">
              A file window will open. Select the <strong>extracted folder</strong> from Step 1 <em>(Make sure to select the regular folder, not the original .zip file!)</em>. <br/><br/>
              That's it! The extension is now installed. Pin it to your toolbar to access your settings and start watching intentionally.
            </p>
          </div>
          {/* Image Placeholder */}
          <div className="flex-1 w-full relative">
            <div className="aspect-video bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden group">
               {/* REPLACE THIS DIV WITH YOUR <img src={step4Image} /> */}
              <span className="text-slate-600 font-medium group-hover:scale-105 transition-transform text-center px-4">Add Final Step Image Here</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SetupGuide;