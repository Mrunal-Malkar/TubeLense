import React from 'react';
import { AlertCircle, Check, X } from 'lucide-react';

export default function ActionableToast({ 
  isOpen, 
  message, 
  onConfirm, 
  onCancel
}:{isOpen:boolean,message:string,onConfirm:()=>void,onCancel:()=>void}) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center max-w-md w-full p-4 bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 animate-slide-up transition-all">
      
      {/* Icon */}
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600 mr-3">
        <AlertCircle className="w-5 h-5" />
      </div>

      {/* Content & Actions */}
      <div className="flex-1 mr-3">
        <p className="text-sm font-medium text-black leading-snug mb-3">
          {message}
        </p>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-all shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            "Proceed"
          </button>
          
          <button
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
          >
            <X className="w-3.5 h-3.5 text-gray-500" />
            "Cancel"
          </button>
        </div>
      </div>

      {/* Close Toast Button */}
      <button 
        onClick={onCancel}
        className="self-start text-gray-400 hover:text-black transition-colors p-1 rounded-md hover:bg-gray-50"
        aria-label="Close toast"
      >
        <X className="w-4 h-4" />
      </button>

    </div>
  );
}