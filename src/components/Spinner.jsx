import React, { useEffect, useState } from "react";

export default function Spinner() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 5));
    }, 120);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/90">

      <div className="relative w-20 h-20 flex items-center justify-center">

        {/* Progress circle */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(red ${progress * 3.6}deg, #1f2937 0deg)`
          }}
        />

        {/* Inner circle */}
        <div className="absolute w-16 h-16 rounded-full bg-black/60 flex items-center justify-center">

          {/* Percentage */}
          <span className="text-white text-sm font-semibold">
            {progress}%
          </span>

        </div>

      </div>

    </div>
  );
}