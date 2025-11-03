import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import successAnimation from "../assets/success.json"; 
const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center space-y-5 px-4 ">
      {/* 🎉 Lottie Success Animation */}
      <div className="w-56 h-56 sm:w-64 sm:h-64">
        <Lottie
          animationData={successAnimation}
          loop={true}
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* ✅ Success Message */}
      <h1 className="text-2xl sm:text-3xl font-bold text-green-600">
        🎉 Order Placed Successfully!
      </h1>

      <p className="text-gray-300 text-base sm:text-lg max-w-md">
        Your order will be delivered within{" "}
        <span className="font-semibold text-red-500">7 days</span>.
      </p>

      {/* 🛍 Continue Button */}
      <button
        onClick={() => navigate("/products")}
        className="mt-2 bg-red-500 text-white px-6 py-2.5 rounded-md text-sm sm:text-base font-semibold 
                   shadow-md hover:bg-red-600 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderSuccess;
