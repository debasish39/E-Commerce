import React, { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/wishlistContext";
import { toast } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";
import { useUser } from "@clerk/clerk-react";
import { FaRupeeSign } from "react-icons/fa";
export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, cartItem } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isSignedIn } = useUser();

  const [imgLoading, setImgLoading] = useState(true);

  const isAlreadyInCart = cartItem.some(
    (item) => String(item.productId) === String(product.id)
  );

  const isLiked = wishlist.some(
    (item) => String(item.productId) === String(product.id)
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
    if (!isSignedIn) {
      toast.error("Please login first");
      navigate("/sign-in");
      return;
    }

    if (isAlreadyInCart) {
      toast.info("Product already in cart 🛒");
      return;
    }

    addToCart(product);
    toast.success("Added to cart 🛒");
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error("Please login first");
      navigate("/sign-in");
      return;
    }

    if (isLiked) {
      removeFromWishlist(String(product.id));
      toast("Removed from wishlist 💔");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist ❤️");
    }
  };

  return (
    <div
      className="relative group bg-white/80 backdrop-blur-md border border-blue-100 rounded-xl
      p-3 sm:p-4 shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
      data-aos="zoom-in-up"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition duration-700 bg-gradient-to-tr from-blue-400/30 via-indigo-300/20 to-blue-400/30 pointer-events-none"></div>

      {/* Wishlist */}
  
  <button
    onClick={handleToggleWishlist}
    className={`absolute top-4.5 sm:top-6 right-4.5 sm:right-5 z-10 p-2 rounded-full
    bg-white/80 backdrop-blur border border-gray-200

    transition-all duration-300
 cursor-pointer
    ${
      isLiked
        ? "text-pink-500 scale-110"
        : "text-gray-400 hover:text-pink-500"
    }`}
  >
    <FaHeart className="w-4 h-4 sm:w-5 sm:h-5" />
  </button>

      {/* Product Image */}
      <div
        className="relative flex justify-center items-center h-33 sm:h-55 overflow-hidden rounded-xl bg-gray-300"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        {imgLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="1.5" />
              <circle cx="9" cy="9" r="2" strokeWidth="1.5" />
              <path d="M21 15l-5-5L5 21" strokeWidth="1.5" />
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

        {/* Featured badge */}
        <span className="absolute top-1.5 left-2 text-[9px] sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-2 sm:px-3 py-1 rounded-full shadow-md">
          ✨ Featured
        </span>
      </div>

      {/* Product Info */}
      <div className="mt-1 sm:mt-4 text-center sm:space-y-1">
        <h1
          className="text-sm sm:text-lg font-semibold text-indigo-800 hover:text-indigo-600 transition-colors line-clamp-2"
          onClick={() => navigate(`/products/${product.id}`)}
        >
          {product.title}
        </h1>

        <p className="text-xs text-gray-500">by {product.brand}</p>

       <p className="flex items-center justify-center  text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
  <FaRupeeSign className="text-blue-600" />
  {product.price}
</p>
      </div>

      {/* Add to Cart */}
      <div className="mt-1 sm:mt-3">
        <button
          className={`w-full flex items-center justify-center gap-2 py-2 text-sm sm:text-base font-semibold rounded-lg shadow-md transition-all duration-300 active:scale-95 cursor-pointer ${
            isAlreadyInCart
              ? "bg-gray-200 text-gray-700"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-[0_8px_25px_rgba(99,102,241,0.35)]"
          }`}
          onClick={() =>
            isAlreadyInCart ? navigate("/cart") : handleAddToCart()
          }
        >
          <IoCartOutline className="w-5 h-5" />
          {isAlreadyInCart ? "View Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}