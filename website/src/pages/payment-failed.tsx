import { useSearchParams, Link } from "react-router";

export default function PaymentFailed() {
  const [searchParams] = useSearchParams();

  const paymentId =
    searchParams.get("payment_id") ||
    searchParams.get("paymentId");

  const status = searchParams.get("status");

  const email = searchParams.get("email");

  const errorMessage =
    searchParams.get("message") ||
    searchParams.get("error");

  // See everything Dodo sent in the URL
  const dodoParams = Object.fromEntries(
    searchParams.entries()
  );

  console.log("Dodo payment failed data:", dodoParams);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-8 text-white">

        {/* Failed icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl text-red-400">
            ×
          </div>
        </div>

        <h1 className="text-center text-3xl font-bold">
          Payment Failed
        </h1>

        <p className="mt-3 text-center text-white/60">
          Your payment could not be completed.
          You haven't been charged successfully for
          TubeLense.
        </p>

        {/* Payment information */}
        <div className="mt-8 space-y-4">

          {email && (
            <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
              <span className="text-white/50">
                Email
              </span>

              <span className="max-w-[60%] truncate text-right">
                {email}
              </span>
            </div>
          )}

          {paymentId && (
            <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
              <span className="text-white/50">
                Payment ID
              </span>

              <span className="max-w-[60%] truncate text-right font-mono text-sm">
                {paymentId}
              </span>
            </div>
          )}

          {status && (
            <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
              <span className="text-white/50">
                Status
              </span>

              <span className="capitalize text-red-400">
                {status}
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4">
              <p className="text-sm text-white/50">
                Reason
              </p>

              <p className="mt-1 text-sm text-white/80">
                {errorMessage}
              </p>
            </div>
          )}

        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">

          <button
            onClick={() => window.history.back()}
            className="w-full rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-white/90"
          >
            Try Payment Again
          </button>

          <Link
            to="/"
            className="w-full rounded-xl border border-white/10 px-5 py-3 text-center font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Back to TubeLense
          </Link>

        </div>

      </div>
    </div>
  );
}