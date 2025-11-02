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
      className="relative group bg-white/50 backdrop-blur-md border border-red-200 rounded-2xl p-4  shadow-md hover:shadow-2xl hover:shadow-red-200 transition-all duration-500 cursor-pointer hover:scale-[1.04] active:scale-[1.02]"
      data-aos="zoom-in-up"
      data-aos-delay="100"
    >
      {/* ✨ Subtle red glowing ring on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-xl bg-gradient-to-r from-red-400/30 via-pink-300/20 to-red-400/30 pointer-events-none"></div>

      {/* 🖼 Product Image */}
      <div
        className="relative flex justify-center"
        onClick={() => navigate(`/products/${product.id}`)}
        data-tooltip-id="product-tooltip"
        data-tooltip-content="View Product Details"
      >
        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.title}
          className="w-full h-60 object-contain rounded-xl drop-shadow-md transition-transform duration-500 group-hover:scale-110"
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/200?text=No+Image")
          }
        />

        {/* 🔖 Featured Tag */}
        <span className="absolute top-3 left-3 bg-[#f53347] text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow-md">
          Featured
        </span>
      </div>

      {/* 🧾 Product Info */}
      <div className="mt-4 text-center space-y-2">
        <h1 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {product.title}
        </h1>
        <p className="text-xl font-bold text-red-500">₹{product.price}</p>
      </div>

      {/* 🛒 Add to Cart Button */}
      <div className="mt-4">
        <button
          className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm sm:text-base font-semibold rounded-lg shadow-md transition-all duration-300 ${
            isAlreadyInCart
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-[#f53347] hover:bg-[#d02b3b] text-white hover:shadow-lg hover:shadow-red-300"
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
