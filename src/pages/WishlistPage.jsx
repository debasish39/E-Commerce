import React from "react";
import { useWishlist } from "../hooks/useWishlist";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500 p-3">
        <p className="text-xl font-semibold mb-4">Your wishlist is empty 💔</p>
        <p className="text-gray-400">Start adding items you love to your wishlist!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-wide">
          My Wishlist ❤️
        </h2>
        <button
          onClick={clearWishlist}
          className="text-sm bg-red-100 text-red-600 px-5 py-2 rounded-lg hover:bg-red-200 transition-all duration-300 shadow-sm"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="border rounded-2xl shadow-md p-5 flex flex-col items-center bg-white hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            {/* Make image clickable */}
            <Link to={`/products/${item.id}`} className="w-full h-48 overflow-hidden rounded-xl mb-4">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </Link>

            {/* Make title clickable */}
            <Link to={`/products/${item.id}`} className="text-lg font-semibold text-gray-900 text-center mb-2 line-clamp-2 hover:text-red-500 transition-colors">
              {item.title}
            </Link>

            <p className="text-red-500 font-bold text-lg mb-4">₹{item.price}</p>

            <button
              onClick={() => removeFromWishlist(item.id)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-red-100 text-gray-700 text-sm px-5 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <FaTrash className="text-red-500" /> Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
