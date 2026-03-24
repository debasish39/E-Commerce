import { useState } from "react";

const Offline = () => {
  const [checking, setChecking] = useState(false);

  const handleRetry = () => {
    setChecking(true);

    setTimeout(() => {
      if (navigator.onLine) {
        window.location.reload();
      } else {
        setChecking(false);
      }
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden text-gray-800">

      {/* ===== Background ===== */}
      <div className="absolute inset-0 -z-30 bg-gradient-to-br from-gray-100 via-gray-200 to-blue-100" />

      {/* Glow blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-400/30 blur-[180px] rounded-full animate-pulse -z-20" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-300/30 blur-[200px] rounded-full animate-[float_12s_ease-in-out_infinite] -z-20" />

      {/* Noise */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.05)_1px,_transparent_0)] bg-[length:40px_40px] opacity-10 -z-20" />

      {/* ===== Content ===== */}
      <div className="relative z-10 text-center px-6">

        {/* Glass Card */}
        <div className="relative  p-10 max-w-md mx-aut">

          {/* Animated Ring */}
          <div className="absolute -inset-[1px] rounded-3xl " />

          {/* Inner content */}
          <div className="relative z-10">

            {/* Icon with pulse */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-400/30 blur-xl animate-ping" />
                <div className="relative text-5xl animate-bounce">📡</div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Connection Lost
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 mt-3 text-sm leading-relaxed">
              We couldn’t reach the network.  
              Please check your internet connection and try again.
            </p>

            {/* Status Badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-medium">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Offline Mode
            </div>

            {/* Divider */}
            <div className="w-20 h-[2px] bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto my-6 rounded-full" />

            {/* Retry Button */}
            <button
              onClick={handleRetry}
              disabled={checking}
              className={`w-full py-2.5 rounded-xl font-medium text-white 
              transition-all duration-300 cursor-pointer
              ${
                checking
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:scale-[1.03] shadow-[0_0_25px_rgba(59,130,246,0.6)]"
              }`}
            >
              {checking ? "Checking..." : "Retry Connection"}
            </button>

            {/* Extra Actions */}
            <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
              <span className="hover:text-blue-500 cursor-pointer transition">
                Wi-Fi
              </span>
              <span>•</span>
              <span className="hover:text-blue-500 cursor-pointer transition">
                Mobile Data
              </span>
              <span>•</span>
              <span className="hover:text-blue-500 cursor-pointer transition">
                Router
              </span>
            </div>

          </div>
        </div>

        {/* Footer Hint */}
        <p className="text-xs text-gray-500 mt-6 opacity-70">
          We’ll automatically reconnect when you're back online
        </p>

      </div>
    </div>
  );
};

export default Offline;