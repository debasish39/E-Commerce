import React, { useState } from "react";
import { useWishlist } from "../context/wishlistContext";
import { FaTrash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  const [activeCardId, setActiveCardId] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const toggleOverlay = (id) => {
    setActiveCardId((prev) => (prev === id ? null : id));
  };

  const handleRemoveItem = (id) => {
    setSelectedItemId(id);
    setModalType("remove");
  };

  const confirmRemoveItem = () => {
    removeFromWishlist(selectedItemId);
    setModalType(null);
    setSelectedItemId(null);
  };

  const confirmClearWishlist = () => {
    clearWishlist();
    setModalType(null);
  };

  // Empty Wishlist UI
  if (!wishlist.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-400 text-center p-6">
        <p className="text-xl font-semibold mb-2">Your wishlist is empty 💔</p>
        <p className="text-gray-500">
          Start adding items you love to your wishlist!
        </p>

        <Link
          to="/products"
          className="mt-5 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white py-10 px-6">

      {/* Header */}
      <div className="flex flex-row justify-between items-center mb-10 gap-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-300">
          <span className="text-red-400">❤️</span> My Wishlist
        </h2>

        <button
          onClick={() => setModalType("clear")}
          className="text-sm bg-red-500/20 text-red-400 border border-red-400/50 px-5 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-300"
        >
          Clear All
        </button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div
  key={item.id}
  onClick={() => toggleOverlay(item.id)}
  className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl shadow-xl hover:shadow-red-500/20 hover:-translate-y-1 transition-all duration-300"
>
  {/* Image */}
  <div className="relative w-full h-56 sm:h-60 overflow-hidden">
    <img
      src={item.thumbnail}
      alt={item.title}
      className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:brightness-90"
    />

    {/* Glass Overlay */}
    <div
      className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-row justify-center items-center gap-3 transition-all duration-300 ${
        activeCardId === item.id
          ? "opacity-100"
          : "opacity-0 group-hover:opacity-100"
      }`}
    >
      <Link
        to={`/products/${item.id}`}
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-2 px-4 py-2 bg-white/90 text-gray-900 font-semibold rounded-lg shadow hover:bg-white transition"
      >
        <FaEye /> View
      </Link>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveItem(item.id);
        }}
        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
      >
        <FaTrash /> Remove
      </button>
    </div>

    {/* Price Badge */}
    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-400 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg">
      ₹{item.price}
    </div>
  </div>

  {/* Product Info */}
  <div className="p-4 text-center">
    <Link
      to={`/products/${item.id}`}
      className="block text-lg font-semibold text-white hover:text-red-400 transition line-clamp-2"
    >
      {item.title}
    </Link>

    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
      {item.description?.slice(0, 60) || "No description available"}
    </p>
  </div>
</div>
        ))}
      </div>

      {/* Remove Modal */}
      {modalType === "remove" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 w-full max-w-sm text-center shadow-xl">
            <h2 className="text-lg font-semibold mb-2">
              Remove from Wishlist?
            </h2>

            <p className="text-gray-300 mb-5 text-sm">
              Are you sure you want to remove this item?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-gray-400/20 border border-gray-400/30 rounded-md hover:bg-gray-400/30"
              >
                Cancel
              </button>

              <button
                onClick={confirmRemoveItem}
                className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Modal */}
      {modalType === "clear" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 w-full max-w-sm text-center shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Clear Wishlist?</h2>

            <p className="text-gray-300 mb-5 text-sm">
              This will remove all items from your wishlist.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-gray-400/20 border border-gray-400/30 rounded-md hover:bg-gray-400/30"
              >
                Cancel
              </button>

              <button
                onClick={confirmClearWishlist}
                className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-600"
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