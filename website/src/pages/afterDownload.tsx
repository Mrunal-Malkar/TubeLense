/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { 
  Download, 
  Sparkles, 
  CheckCircle2, 
  PartyPopper, 
  Loader2, 
  Receipt, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import SetupGuide from '../component/setupGuide'; // Adjust the path if needed
import { supabase } from '../utils/supabase';

interface paymentDetailsType{
amount: any;
    currency: any;
    status: any;
    created_at: any;
    card_last_four: any;
    card_network: any;
    payment_id: any;
}

const AfterDownload = () => {
  const [cooldown, setCooldown] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Payment Details State
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<paymentDetailsType|null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  // 1. Fetch User and Payment Status
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          setIsPaid(false);
          return;
        }

        // Fetch the specific user's profile to check access
        const { data, error } = await supabase
          .from("profiles")
          .select("has_lifetime_access")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          setIsPaid(false);
        } else {
          setIsPaid(!!data?.has_lifetime_access);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, []);

  // 2. Handle the 15-second countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [cooldown]);

  // 3. Download Logic via Supabase Storage
  const handleDownload = async () => {
    if (cooldown > 0 || isDownloading) return;
    
    try {
      setIsDownloading(true);
      
      const { data, error } = await supabase.storage
        .from('extension_bucket') 
        .download('Tubelense.zip');

      if (error) {
        console.error("Error downloading file:", error);
        alert("Failed to download the extension. Please try again or contact support.");
        return;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'TubeLense.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setCooldown(15);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // 4. Fetch Payment Details on demand
  const handleTogglePaymentDetails = async () => {
    setShowPaymentDetails(!showPaymentDetails);

    // Only fetch if we haven't fetched it yet
    if (!showPaymentDetails && !paymentDetails) {
      setIsLoadingPayment(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // IMPORTANT: Ensure your table name here matches your database (e.g., 'payments')
          const { data, error } = await supabase
            .from('payments') 
            .select('amount, currency, status, created_at, card_last_four, card_network, payment_id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (error) {
            console.error("Error fetching payment details:", error);
          } else if (data) {
            setPaymentDetails(data);
          }
        }
      } catch (err) {
        console.error("Unexpected error fetching payments:", err);
      } finally {
        setIsLoadingPayment(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {isPaid && (
        <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center flex flex-col items-center">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none -z-10" />

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm shadow-sm backdrop-blur-md mb-8">
            <CheckCircle2 className="w-4 h-4" />
            Payment Successful
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-white mb-6">
            You're all set! <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center gap-3 mt-2">
              Welcome to TubeLense <PartyPopper className="w-10 h-10 text-indigo-400" />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed font-medium">
            Thank you for taking control of your focus. Your extension is ready. Download the file below and follow the quick 1-minute setup guide to get started.
          </p>

          <div className="flex flex-col items-center gap-4 w-full">
            <button
              onClick={handleDownload}
              disabled={cooldown > 0 || isDownloading}
              className={`relative flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 w-full sm:w-auto min-w-[280px] shadow-lg ${
                cooldown > 0 || isDownloading
                  ? "bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-blue-500"
              }`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Preparing file...
                </>
              ) : cooldown > 0 ? (
                <span className="animate-pulse">Please wait {cooldown}s</span>
              ) : (
                <>
                  Download TubeLense .zip
                  <Download className="w-6 h-6" />
                </>
              )}
            </button>
            
            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> 
              Requires manual installation (See below)
            </p>

            {/* --- NEW PAYMENT DETAILS SECTION --- */}
            <div className="mt-6 w-full max-w-md mx-auto">
              <button
                onClick={handleTogglePaymentDetails}
                className="mx-auto flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                <Receipt className="w-4 h-4" />
                {showPaymentDetails ? "Hide payment details" : "See payment details"}
                {showPaymentDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Collapsible Content */}
              {showPaymentDetails && (
                <div className="mt-4 w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-left backdrop-blur-md shadow-xl transition-all">
                  {isLoadingPayment ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    </div>
                  ) : paymentDetails ? (
                    <div className="space-y-4 text-sm">
                      {/* Amount */}
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <span className="text-slate-400">Total Paid</span>
                        <span className="font-semibold text-white text-base">
                          {new Intl.NumberFormat('en-US', { 
                            style: 'currency', 
                            currency: paymentDetails.currency 
                          }).format(paymentDetails.amount / 100)} {/* Assumes amount is in cents */}
                        </span>
                      </div>
                      
                      {/* Date */}
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <span className="text-slate-400">Date</span>
                        <span className="text-slate-200">
                          {new Date(paymentDetails.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Card Details (Only if available) */}
                      {(paymentDetails.card_last_four || paymentDetails.card_network) && (
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                          <span className="text-slate-400">Payment Method</span>
                          <span className="text-slate-200 capitalize">
                            {paymentDetails.card_network} •••• {paymentDetails.card_last_four}
                          </span>
                        </div>
                      )}

                      {/* Status */}
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <span className="text-slate-400">Status</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 capitalize border border-emerald-500/20">
                          {paymentDetails.status}
                        </span>
                      </div>

                      {/* Transaction ID */}
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-slate-400">Transaction ID</span>
                        <span className="font-mono text-xs text-slate-500 max-w-[150px] truncate" title={paymentDetails.payment_id}>
                          {paymentDetails.payment_id}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 py-4">
                      No recent payment details found.
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* --- END PAYMENT DETAILS SECTION --- */}

          </div>
        </section>
      )}

      <SetupGuide />
      
    </div>
  );
};

export default AfterDownload;