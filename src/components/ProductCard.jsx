import React, { useEffect } from "react";
import { IoCartOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, cartItem } = useCart();

  const isAlreadyInCart = cartItem.some(
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

  return (
    <div
      className="relative group bg-white/10 backdrop-blur-lg border border-red-200/40 rounded-2xl 
                 p-3 sm:p-4 shadow-md transition-all duration-300 cursor-pointer 
                 sm:hover:scale-[1.03] active:scale-[0.99] overflow-hidden"
      data-aos="zoom-in-up"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition duration-700 bg-gradient-to-tr from-red-400/30 via-pink-300/20 to-red-400/30 pointer-events-none"></div>

      {/* Image */}
      <div
        className="relative flex justify-center items-center h-44 sm:h-60 overflow-hidden rounded-xl bg-white/50"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-contain transition-transform duration-500 sm:group-hover:scale-110"
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/200?text=No+Image")
          }
        />

        <span className="absolute top-2 left-2 text-xs sm:text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold px-2 sm:px-3 py-1 rounded-full shadow-md">
          ✨ Featured
        </span>
      </div>

      {/* Info */}
      <div className="mt-3 sm:mt-4 text-center space-y-1">
        <h1
          className="text-sm sm:text-lg font-semibold text-gray-300 line-clamp-2"
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

      {/* Button */}
      <div className="mt-3 sm:mt-4">
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
