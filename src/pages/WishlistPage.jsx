import React, { useState } from "react";
import { useWishlist } from "../context/wishlistContext";
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

  const handleClearWishlist = () => setShowClearModal(true);
  const confirmClearAll = () => {
    clearWishlist();
    setShowClearModal(false);
  };

  const toggleOverlay = (id) => {
    setActiveCardId(activeCardId === id ? null : id);
  };

  // Empty Wishlist UI
  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-400 p-6 text-center">
        <p className="text-xl font-semibold mb-2">Your wishlist is empty 💔</p>
        <p className="text-gray-500">
          Start adding items you love to your wishlist!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#140202] to-black text-white py-10 px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          ❤️ My Wishlist
        </h2>
        <button
          onClick={handleClearWishlist}
          className="text-sm bg-red-500/20 text-red-400 border border-red-400/50 px-5 py-2 rounded-lg 
          hover:bg-red-500/30 transition-all duration-300 shadow-lg backdrop-blur-md"
        >
          Clear All
        </button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="relative rounded-3xl overflow-hidden shadow-lg backdrop-blur-md bg-white/10 border border-white/10
            transition-all duration-300 hover:scale-[1.03] hover:shadow-red-500/30"
            onClick={() => toggleOverlay(item.id)}
          >
            {/* Image */}
            <div className="relative w-full h-56 sm:h-60">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover rounded-t-3xl transition-transform duration-500 hover:scale-110"
              />
              {/* Overlay */}
              <div
                className={`absolute inset-0 bg-black/60 flex flex-col sm:flex-row justify-center items-center gap-3 transition-all duration-300 ${
                  activeCardId === item.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <Link
                  to={`/products/${item.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white/80 text-gray-800 font-semibold px-4 py-2 rounded-md 
                  flex items-center gap-2 hover:bg-white w-32 justify-center backdrop-blur-md"
                >
                  <FaEye /> View
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(item.id);
                  }}
                  className="bg-red-500/80 text-white px-4 py-2 rounded-md 
                  flex items-center gap-2 hover:bg-red-600 w-32 justify-center backdrop-blur-md"
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>

            {/* Price Tag */}
            <div className="absolute top-3 left-3 bg-red-500/80 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-md">
              ₹{item.price}
            </div>

            {/* Info Section */}
            <div className="p-4 text-center">
              <Link
                to={`/products/${item.id}`}
                className="block text-lg font-semibold text-white hover:text-red-400 transition-colors line-clamp-2 mb-1"
              >
                {item.title}
              </Link>
              <p className="text-gray-300 text-sm line-clamp-2">
                {item.description?.slice(0, 60) || "No description available"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Remove Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start py-69 justify-center z-50 px-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl p-6 w-full max-w-sm text-center shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Remove from Wishlist?</h2>
            <p className="text-gray-300 mb-5 text-sm">
              Are you sure you want to remove this item?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400/20 border border-gray-400/30 text-white rounded-md hover:bg-gray-400/30"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveItem}
                className="px-4 py-2 bg-red-500/80 border border-red-500/50 text-white rounded-md hover:bg-red-600/80"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl p-6 w-full max-w-sm text-center shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Clear Wishlist?</h2>
            <p className="text-gray-300 mb-5 text-sm">
              This will remove all items from your wishlist.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 bg-gray-400/20 border border-gray-400/30 text-white rounded-md hover:bg-gray-400/30"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearAll}
                className="px-4 py-2 bg-red-500/80 border border-red-500/50 text-white rounded-md hover:bg-red-600/80"
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
