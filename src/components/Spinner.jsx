import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-gray-700 rounded-full animate-spin border-t-orange-500"></div>

        {/* Inner glow */}
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full border-t-yellow-400 animate-ping"></div>
      </div>
    </div>
  );
};

export default Spinner;
