import React, { useEffect } from "react";
import { IoCartOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, cartItem } = useCart();

  const isAlreadyInCart = cartItem.some((item) => item.id === product.id);

  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: "ease-in-out",
      once: false,
      offset: 50,
    });
  }, []);

  return (
    <div
      className="relative group bg-white/20 backdrop-blur-lg border border-red-200/50 rounded-2xl 
                 p-4 shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer 
                 hover:scale-[1.04] active:scale-[1.02] overflow-hidden"
      data-aos="zoom-in-up"
      data-aos-delay="100"
    >
      {/* 🌈 Animated Gradient Glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition duration-700 bg-gradient-to-tr from-red-400/30 via-pink-300/20 to-red-400/30 pointer-events-none"></div>

      {/* 🖼 Product Image Section */}
      <div
        className="relative flex justify-center items-center h-56 sm:h-64 overflow-hidden rounded-xl"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.title}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/200?text=No+Image")
          }
        />

        {/* ✨ Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        {/* 🔖 Tag */}
        <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
          Featured
        </span>
      </div>

      {/* 📋 Product Info */}
      <div className="mt-4 text-center space-y-1">
        <h1 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
          {product.title}
        </h1>
        <p className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-500 text-transparent bg-clip-text">
          ₹{product.price}
        </p>
      </div>

      {/* 🛒 Add to Cart Button */}
      <div className="mt-4">
        <button
          className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm sm:text-base font-semibold rounded-lg shadow-md transition-all duration-300 ${
            isAlreadyInCart
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg hover:shadow-red-300"
          }`}
          disabled={isAlreadyInCart}
          onClick={() => addToCart(product)}
          data-tooltip-id="product-tooltip"
          data-tooltip-content={
            isAlreadyInCart ? "Already in Cart" : "Add to Cart"
          }
        >
          <IoCartOutline className="w-5 h-5" />
          {isAlreadyInCart ? "Added" : "Add to Cart"}
        </button>
      </div>

      {/* 💬 Tooltip */}
      <Tooltip
        id="product-tooltip"
        place="top"
        effect="solid"
        style={{
          backgroundColor: "#f53347",
          color: "white",
          fontSize: "12px",
          borderRadius: "6px",
          padding: "6px 10px",
        }}
      />
    </div>
  );
}
