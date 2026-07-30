import toast from "react-hot-toast";
import { ToastContainer } from "react-toastify";

const FocusScoreAndAnimatedSphere = () => {
  async function activeExtension() {
    const current = (await chrome.storage.local.get("lens_active")).lens_active;
    const type = typeof current;
    console.log("type", type);
    if (!(type == "boolean")) {
      toast.error("unexpected lens_active type");
      return;
    }
    await chrome.storage.local.set({ lens_active: !current });
    toast.success("activated");
  }

  return (
    <div className="flex justify-between items-start mt-2 relative z-10">
      <ToastContainer/>
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium text-gray-800">Focus Score</h2>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-500">
            91%
          </span>
          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">
            Excellent
          </span>
        </div>
        {/* Progress Dots */}
        <div className="flex gap-1.5 mt-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${i < 9 ? "bg-indigo-500" : "bg-indigo-100"}`}
            />
          ))}
        </div>
      </div>

      {/* Animated 3D Ring/Sphere */}
      <div
        onClick={activeExtension}
        className="relative w-28 h-28 flex items-center justify-center mr-2"
      >
        {/* Glowing Center */}
        <div className="absolute w-16 h-16 bg-linear-to-br from-indigo-300 to-purple-400 rounded-full blur-md opacity-70"></div>
        <div className="absolute w-14 h-14 bg-linear-to-br from-blue-200 to-purple-300 rounded-full shadow-inner z-10"></div>

        {/* Orbiting Rings Container with a Mask for Faded Depth Illusion */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            // This mask fades the rings *inside* the sphere region, creating depth as they spin past.
            maskImage:
              "radial-gradient(circle, transparent 0%, transparent 15%, rgba(0,0,0,0.5) 25%, black 40%, black 100%)",
            WebkitMaskImage:
              "radial-gradient(circle, transparent 0%, transparent 15%, rgba(0,0,0,0.5) 25%, black 40%, black 100%)",
          }}
        >
          {/* Speed significantly increased (durations reduced to 4s-10s) */}

          <div
            className="absolute w-24 h-24"
            style={{ transform: "rotateX(65deg) rotateY(25deg)" }}
          >
            <div className="w-full h-full border border-indigo-400/70 border-t-indigo-400/10 rounded-full animate-[spin_4s_linear_infinite]" />
          </div>

          <div
            className="absolute w-24 h-24"
            style={{ transform: "rotateX(65deg) rotateY(-45deg)" }}
          >
            <div className="w-full h-full border border-purple-400/70 border-b-purple-400/10 rounded-full animate-[spin_5s_linear_infinite_reverse]" />
          </div>

          <div
            className="absolute w-24 h-24"
            style={{ transform: "rotateX(20deg) rotateY(65deg)" }}
          >
            <div className="w-full h-full border border-blue-400/70 border-l-blue-400/10 rounded-full animate-[spin_7s_linear_infinite]" />
          </div>

          <div
            className="absolute w-24 h-24"
            style={{ transform: "rotateX(75deg) rotateY(15deg)" }}
          >
            <div className="w-full h-full border border-indigo-500/60 border-r-indigo-500/10 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
          </div>

          <div
            className="absolute w-24 h-24"
            style={{ transform: "rotateX(45deg) rotateY(85deg)" }}
          >
            <div className="w-full h-full border border-purple-500/60 border-t-purple-500/10 rounded-full animate-[spin_10s_linear_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusScoreAndAnimatedSphere