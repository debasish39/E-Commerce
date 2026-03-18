import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import successAnimation from "../assets/success.json";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4
    bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">

      {/* CARD */}
      <div className="bg-transparent  
      flex flex-col items-center text-center max-w-md w-full">

        {/* 🎉 ANIMATION */}
        <div className="w-48 h-48 sm:w-56 sm:h-56">
          <Lottie
            animationData={successAnimation}
            autoplay
            loop={false}
          />
        </div>

        {/* ✅ TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-3">
          Order Placed Successfully 🎉
        </h1>

        {/* 📦 MESSAGE */}
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Your order will be delivered within{" "}
          <span className="font-semibold text-indigo-600">
            5–7 business days
          </span>.
        </p>

        {/* 🛍 BUTTON */}
        <button
          onClick={() => navigate("/products")}
          className="mt-6  sm:w-auto px-6 py-3 rounded-lg font-medium text-white
          bg-gradient-to-r from-blue-500 to-indigo-600
          hover:from-blue-600 hover:to-indigo-700
          shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer"
        >
          Continue Shopping →
        </button>

      </div>
    </div>
  );
};

export default OrderSuccess;