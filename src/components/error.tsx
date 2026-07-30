import React, { useState } from "react";
import { AlertTriangle, Mail} from "lucide-react";
import { Email } from "../lib/statics";
import ActionableToast from "../ui/actionableToast";

export default function ErrorPopup({
  title = "Something went unexpected",
  message = "We encountered an issue while processing your request. Please try again in a moment.",
}) {
  const [actionableToast, setActionableToast] = useState<boolean>(false);

  const handleRefresh = () => {
    setActionableToast(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-black/5 transition-all">
        {actionableToast && (
          <ActionableToast
            isOpen={actionableToast}
            message="Re-trying will reload webpage, proceed?"
            onCancel={() => setActionableToast(false)}
            onConfirm={() => window.location.reload()}
          />
        )}
        {/* Icon & Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 mb-5 ring-8 ring-red-50/50">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <h3 className="text-xl font-semibold text-black tracking-tight mb-2">
            {title}
          </h3>

          <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-6">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleRefresh}
            className="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all"
          >
            Try Again
          </button>
        </div>

        {/* Help / Support Footer */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Persistent issue? Reach out to us at{" "}
            <a
              href={`mailto:${Email}`}
              className="inline-flex items-center gap-1 font-medium text-black hover:underline mt-1 sm:mt-0"
            >
              <Mail className="w-3.5 h-3.5 text-red-600" />
              {Email}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
