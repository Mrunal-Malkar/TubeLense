import { Link, useSearchParams } from "react-router";


export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();

  // Get values from Dodo's redirect URL
  const paymentId =
    searchParams.get("payment_id") ||
    searchParams.get("paymentId");

  const status = searchParams.get("status");

  const email = searchParams.get("email");

  const customerName =
    searchParams.get("name") ||
    searchParams.get("customer_name");

  // Get every parameter Dodo sent
  const dodoParams = Object.fromEntries(
    searchParams.entries()
  );

  console.log("Dodo redirect data:", dodoParams);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-8 text-white">

        {/* Success icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-3xl">
            ✓
          </div>
        </div>

        <h1 className="text-center text-3xl font-bold">
          Payment Successful
        </h1>

        <p className="mt-3 text-center text-white/60">
          Thanks for purchasing TubeLense!
        </p>

        {/* Payment details */}
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

          {customerName && (
            <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
              <span className="text-white/50">
                Name
              </span>

              <span className="text-right">
                {customerName}
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

              <span className="capitalize text-green-400">
                {status}
              </span>
            </div>
          )}

        </div>

        {/* Continue */}
        <Link
          to="/"
          className="mt-8 block w-full rounded-xl bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-white/90"
        >
          Back to TubeLense
        </Link>

      </div>
    </div>
  );
}
