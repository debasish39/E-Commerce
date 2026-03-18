import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronRight, FaHome } from "react-icons/fa";

const Breadcrums = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-start sm:justify-start sm:px-6 md:px-10  sm:py-10">
    <div
  className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 md:gap-3 
  bg-white/70 backdrop-blur-lg border border-blue-100
  shadow-[0_6px_25px_rgba(0,0,0,0.08)]
  px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full
  transition-all duration-300 hover:bg-blue-50 hover:shadow-[0_8px_30px_rgba(37,99,235,0.15)]"
>
        {/* Home */}
        <span
          onClick={() => navigate("/")}
          className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:text-blue-600 text-xs sm:text-sm md:text-base font-medium cursor-pointer  transition-colors"
        >
          <FaHome className="text-blue-500 text-xs sm:text-sm md:text-base" />
          Home
        </span>

        <FaChevronRight className="text-gray-400 text-[10px] sm:text-xs md:text-sm" />

        {/* Products */}
        <span
          onClick={() => navigate("/products")}
          className=" text-xs sm:text-sm md:text-base font-medium cursor-pointer text-gray-600 hover:text-blue-600 transition-colors"
        >
          Products
        </span>

        <FaChevronRight className="text-gray-500 text-[10px] sm:text-xs md:text-sm" />

        {/* Current Page */}
        <span
          className="text-xs sm:text-sm md:text-base font-semibold text-transparent bg-clip-text 
         bg-gradient-to-r from-blue-600 to-blue-400 truncate max-w-[120px] sm:max-w-[180px] md:max-w-none"
          title={title}
        >
          {title}
        </span>
      </div>
    </div>
  );
};

export default Breadcrums;
