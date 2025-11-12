import React, { useEffect } from "react";
import { IoCartOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaStar } from "react-icons/fa";

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
      className="relative group bg-white/30 backdrop-blur-lg border border-red-200/40 rounded-2xl 
                 p-3 sm:p-4 shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer 
                 hover:scale-[1.03] active:scale-[0.99] overflow-hidden"
      data-aos="zoom-in-up"
      data-aos-delay="100"
    >
      {/* 🌈 Glow Animation */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition duration-700 bg-gradient-to-tr from-red-400/30 via-pink-300/20 to-red-400/30 pointer-events-none"></div>

      {/* 🖼 Product Image */}
      <div
        className="relative flex justify-center items-center h-44 xs:h-52 sm:h-60 overflow-hidden rounded-xl bg-white/60"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/200?text=No+Image")
          }
        />

        {/* ✨ Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        {/* 🔖 Tag */}
        <span className="absolute top-2 left-2 text-[10px] xs:text-xs sm:text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md backdrop-blur-sm">
          Featured
        </span>
      </div>

      {/* 📋 Product Info */}
      <div className="mt-3 sm:mt-4 text-center space-y-1">
        <h1 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-300 line-clamp-2 leading-snug" onClick={() => navigate(`/products/${product.id}`)}>
          {product.title}
        </h1>
        <p className="text-[12px] text-gray-400">by {product.brand}</p>

        <p className="text-lg xs:text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-500 text-transparent bg-clip-text">
          ₹{product.price}
        </p>
        <p>
          <span className="font-semibold text-gray-200">Stock:</span>{" "}
          {product.stock > 0 ? (
            <span className="text-green-400">In Stock ({product.stock})</span>
          ) : (
            <span className="text-red-400">Out of Stock</span>
          )}
        </p>
      </div>

      {/* 🛒 Add to Cart Button */}
      <div className="mt-3 sm:mt-4">
        <button
          className={`w-full flex items-center justify-center gap-1.5 xs:gap-2 py-2 text-sm sm:text-base font-semibold rounded-lg shadow-md transition-all duration-300 active:scale-95 ${isAlreadyInCart
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
          <IoCartOutline className="w-4 h-4 sm:w-5 sm:h-5" />
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
