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
    <div className="min-h-screen w-full flex flex-col items-center justify-center ">

      <div className="relative w-20 h-20 flex items-center justify-center">

        {/* Progress circle */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(#2563eb ${progress * 3.6}deg, #7c3aed ${progress *
              1.8}deg, #4f46e5 ${progress * 3.6}deg, #e5e7eb 0deg)`
          }}
        />

        {/* Inner circle */}
        <div className="absolute w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">

          {/* Percentage */}
          <span className="text-indigo-600 text-sm font-semibold">
            {progress}%
          </span>

        </div>

      </div>

    </div>
  );
}