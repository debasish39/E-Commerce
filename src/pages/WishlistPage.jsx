import React, { useState } from "react";
import { useWishlist } from "../context/wishlistContext";
import { FaTrash, FaEye, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function WishlistPage() {

  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  const [activeCardId, setActiveCardId] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const toggleOverlay = (id) => {
    setActiveCardId(prev => prev === id ? null : id);
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

  /* ================= EMPTY STATE ================= */

 if (!wishlist.length) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center text-gray-400">

      <div className="text-6xl mb-4 text-indigo-400">
        💜
      </div>

      <h2 className="text-2xl font-semibold mb-2">
        Your wishlist is empty
      </h2>

      <p className="text-gray-500 mb-6 max-w-sm">
        Save products you love and access them quickly anytime.
      </p>

      <Link
        to="/products"
        className="
        px-6 py-3
        rounded-xl
        bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
        text-white font-semibold
        shadow-lg shadow-indigo-500/30
        hover:scale-105
        transition
        "
      >
        Browse Products
      </Link>

    </div>
  );
}

  /* ================= PAGE ================= */

  return (
    <div className="min-h-screen text-white py-10 px-6">

      {/* Header */}
   <div className="flex justify-between items-center mb-10">

  <h2 className="text-2xl sm:text-4xl font-bold flex items-center gap-3">

    <FaHeart className="text-indigo-400" />

    <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
      My Wishlist
    </span>

    <span className="text-sm bg-black/10 px-3 py-1 rounded-full border text-indigo-500 border-white/10">
      {wishlist.length}
    </span>

  </h2>

  <button
    onClick={() => setModalType("clear")}
    className="
    px-3 py-2 
    rounded-xl
    border border-indigo-400
    bg-indigo-500/10
    text-indigo-900 text-sm font-semibold sm:text-2xl
    hover:bg-indigo-100
    transition
    cursor-pointer
    "
  >
    Clear All
  </button>

</div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {wishlist.map(item => (

        <div
  key={item.productId}
  onClick={() => toggleOverlay(item.productId)}
  className="
  group relative
  rounded-3xl overflow-hidden
  bg-white/5 backdrop-blur-xl
  border border-indigo-400/10
  shadow-xl
  hover:shadow-indigo-500/20
  transition duration-300
  hover:-translate-y-1
"
>

{/* Hover Glow */}
<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition blur-xl bg-gradient-to-tr from-blue-500/20 via-indigo-500/10 to-purple-500/20"></div>

            {/* Image */}
            <div className="relative h-56 overflow-hidden">

              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                onError={(e) => e.target.src = "https://via.placeholder.com/300"}
              />

              {/* Overlay */}
            <div
  className={`absolute inset-0 flex items-center justify-center gap-3 bg-black/60 backdrop-blur-sm transition ${
    activeCardId === item.productId
      ? "opacity-100"
      : "opacity-0 group-hover:opacity-100"
  }`}
>

               <Link
  to={`/products/${item.productId}`}
  onClick={(e) => e.stopPropagation()}
  className="
  px-4 py-2 rounded-lg
  bg-white text-black
  flex items-center gap-2
  hover:bg-gray-200
  transition
  "
>
  <FaEye /> View
</Link>

<button
  onClick={(e) => {
    e.stopPropagation();
    handleRemoveItem(item.productId);
  }}
  className="
  px-4 py-2 rounded-lg
  bg-gradient-to-r from-blue-600 to-indigo-600
  text-white
  flex items-center gap-2
  hover:opacity-90
  transition
  "
>
  <FaTrash /> Remove
</button>

              </div>


              {/* Price */}
            <div className="
absolute top-3 left-3
bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
px-3 py-1
rounded-full
text-sm font-semibold
shadow-lg
">
                ₹{item.price}
              </div>

            </div>


            {/* Product Info */}
            <div className="p-4 text-center">

              <Link
                to={`/products/${item.productId}`}
                className="block font-semibold text-lg text-indigo-400 hover:text-indigo-600 transition line-clamp-2 cursor-pointer"
              >
                {item.title}
              </Link>

              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                {item.description?.slice(0, 60) || "No description available"}
              </p>

            </div>

          </div>

        ))}

      </div>


      {/* ================= REMOVE MODAL ================= */}

      {modalType === "remove" && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">

          <div className="bg-white/10 border border-white/20 backdrop-blur-xl p-6 rounded-xl text-center w-[300px] shadow-2xl">

            <h2 className="text-lg font-semibold mb-3">
              Remove item?
            </h2>

            <p className="text-gray-400 mb-5 text-sm">
              This product will be removed from wishlist
            </p>

            <div className="flex justify-center gap-3">

              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-lg border border-gray-400/40 hover:bg-gray-500/10"
              >
                Cancel
              </button>

              <button
                onClick={confirmRemoveItem}
                className="
px-4 py-2 rounded-lg
bg-gradient-to-r from-blue-600 to-indigo-600
hover:opacity-90
"
              >
                Remove
              </button>

            </div>

          </div>

        </div>
      )}


      {/* ================= CLEAR MODAL ================= */}

      {modalType === "clear" && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">

          <div className="bg-white/10 border border-white/20 backdrop-blur-xl p-6 rounded-xl text-center w-[300px] shadow-2xl">

            <h2 className="text-lg font-semibold mb-3">
              Clear Wishlist?
            </h2>

            <p className="text-gray-400 mb-5 text-sm">
              All items will be removed permanently
            </p>

            <div className="flex justify-center gap-3">

              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-lg border border-gray-400/40 hover:bg-gray-500/10"
              >
                Cancel
              </button>

              <button
                onClick={confirmClearWishlist}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600"
              >
                Clear
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}