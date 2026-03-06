import React, { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/wishlistContext";
import { toast } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, cartItem } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [imgLoading, setImgLoading] = useState(true);

  const isAlreadyInCart = cartItem.some(
    (item) => item.id === product.id
  );

  const isLiked = wishlist.some(
    (item) => item.id === product.id
  );

  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: "ease-in-out",
      once: false,
      offset: 50,
    });
  }, []);

  const handleAddToCart = () => {
    if (isAlreadyInCart) {
      toast.info("Already in cart 🛒");
      return;
    }

    addToCart(product);

    toast.success("Added to cart!", {
      description: product.title,
    });
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();

    if (isLiked) {
      removeFromWishlist(product.id);
      toast("Removed from wishlist 💔");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist ❤️");
    }
  };

  return (
    <div
      className="relative group bg-white/10 backdrop-blur-lg border border-red-200/40 rounded-2xl 
                 p-3 sm:p-4 shadow-md transition-all duration-300 cursor-pointer 
                 overflow-hidden"
      data-aos="zoom-in-up"
    >

      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition duration-700 bg-gradient-to-tr from-red-400/30 via-pink-300/20 to-red-400/30 pointer-events-none"></div>

      {/* ❤️ Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-5 sm:top-7 right-4 sm:right-7 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-300 cursor-pointer ${
          isLiked
            ? "bg-transparent text-red-600 shadow-lg scale-110"
            : "hover:scale-110"
        }`}
      >
        <FaHeart className="w-4 h-4" />
      </button>

      {/* Product Image */}
      <div
        className="relative flex justify-center items-center h-39 sm:h-55 overflow-hidden rounded-xl bg-gray-200/40"
        onClick={() => navigate(`/products/${product.id}`)}
      >

        {/* Placeholder while loading */}
        {imgLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="1.5"/>
              <circle cx="9" cy="9" r="2" strokeWidth="1.5"/>
              <path d="M21 15l-5-5L5 21" strokeWidth="1.5"/>
            </svg>
          </div>
        )}

        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.title}
          loading="lazy"
          onLoad={() => setImgLoading(false)}
          className={`w-full h-full object-contain transition-all duration-500 sm:group-hover:scale-110 ${
            imgLoading ? "opacity-0" : "opacity-100"
          }`}
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/300x200?text=No+Image")
          }
        />

        <span className="absolute top-1 left-2 text-[9px] sm:text-sm bg-gradient-to-r from-red-600 to-red-900 text-white font-semibold px-2 sm:px-3 py-1 rounded-full shadow-md">
          ✨ Featured
        </span>

      </div>

      {/* Product Info */}
      <div className="mt-1 sm:mt-4 text-center sm:space-y-1">

        <h1
          className="text-sm sm:text-lg font-semibold text-gray-300 hover:text-red-400 transition-colors line-clamp-2"
          onClick={() => navigate(`/products/${product.id}`)}
        >
          {product.title}
        </h1>

        <p className="text-xs text-gray-400">
          by {product.brand}
        </p>

        <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-500 text-transparent bg-clip-text">
          ₹{product.price}
        </p>

      </div>

      {/* Add to Cart */}
      <div className="mt-1 sm:mt-3">
        <button
          className={`w-full flex items-center justify-center gap-2 py-2 text-sm sm:text-base font-semibold rounded-lg shadow-md transition-all duration-300 active:scale-95 ${
            isAlreadyInCart
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 to-pink-500 text-white sm:hover:shadow-lg sm:hover:shadow-red-300"
          }`}
          disabled={isAlreadyInCart}
          onClick={handleAddToCart}
        >
          <IoCartOutline className="w-4 h-4 sm:w-5 sm:h-5" />
          {isAlreadyInCart ? "Added" : "Add to Cart"}
        </button>
      </div>

    </div>
  );
}