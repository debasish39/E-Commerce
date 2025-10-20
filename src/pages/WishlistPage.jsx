import React, { useState } from "react";
import { useWishlist } from "../hooks/useWishlist";
import { FaTrash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  const [showModal, setShowModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [activeCardId, setActiveCardId] = useState(null);

  const handleRemoveItem = (id) => {
    setSelectedItemId(id);
    setShowModal(true);
  };

  const confirmRemoveItem = () => {
    if (selectedItemId) removeFromWishlist(selectedItemId);
    setShowModal(false);
    setSelectedItemId(null);
  };

  const handleClearWishlist = () => {
    setShowClearModal(true);
  };

  const confirmClearAll = () => {
    clearWishlist();
    setShowClearModal(false);
  };

  const toggleOverlay = (id) => {
    if (activeCardId === id) {
      setActiveCardId(null);
    } else {
      setActiveCardId(id);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500 p-3">
        <p className="text-xl font-semibold mb-4">Your wishlist is empty 💔</p>
        <p className="text-gray-400">
          Start adding items you love to your wishlist!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[18px] sm:text-3xl font-bold text-gray-900 tracking-wide">
          My Wishlist ❤️
        </h2>
        <button
          onClick={handleClearWishlist}
          className="text-sm bg-red-100 text-red-600 px-5 py-2 rounded-lg hover:bg-red-200 transition-all duration-300 shadow-sm cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="relative bg-gray-200 border rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            onClick={() => toggleOverlay(item.id)}
          >
            <div className="relative w-full h-56 overflow-hidden">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div
                className={`absolute inset-0 bg-black/40 flex justify-center items-center gap-3 transition-all duration-300 ${
                  activeCardId === item.id
                    ? "opacity-100"
                    : "opacity-0 sm:opacity-0 sm:group-hover:opacity-100"
                }`}
              >
                <Link
                  to={`/products/${item.id}`}
                  className="bg-white text-gray-800 font-semibold px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaEye /> View
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(item.id);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600 cursor-pointer"
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>

            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
              ₹{item.price}
            </div>

            <div className="p-4 text-center">
              <Link
                to={`/products/${item.id}`}
                className="block text-lg font-semibold text-gray-900 hover:text-red-500 transition-colors line-clamp-2 mb-2"
              >
                {item.title}
              </Link>
              <p className="text-gray-500 text-sm line-clamp-2">
                {item.description?.slice(0, 60) || "No description available"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 cursor-pointer">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-3">
              Remove from Wishlist?
            </h2>
            <p className="text-gray-500 mb-5">
              Are you sure you want to remove this item?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveItem}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-3">Clear Wishlist?</h2>
            <p className="text-gray-500 mb-5">
              This will remove all items from your wishlist.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearAll}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
