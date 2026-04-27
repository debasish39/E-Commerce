import { useState } from "react";
import API from "../api/axios";

export default function Wishlist() {
  const [userId, setUserId] = useState("");
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!userId) return alert("Enter User ID");

    try {
      setLoading(true);
      const res = await API.get(`/api/wishlist/${userId}`);
      setWishlist(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      await API.delete("/api/wishlist/remove", {
        data: { userId, productId },
      });
      fetchWishlist();
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  const clearWishlist = async () => {
    try {
      await API.delete(`/api/wishlist/clear/${userId}`);
      fetchWishlist();
    } catch (err) {
      console.error(err);
      alert("Failed to clear wishlist");
    }
  };

  return (
    <div className="p-6">

      {/* 🔷 Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Wishlist Management
        </h2>

        {wishlist?.items?.length > 0 && (
          <span className="text-sm bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
            {wishlist.items.length} items
          </span>
        )}
      </div>

      {/* 🔍 Search Bar */}
      <div className=" p-4 rounded-xl  mb-6 flex flex-col md:flex-row gap-3">

        <input
          placeholder="Enter User ID..."
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="flex-1 p-2 border rounded-lg text-sm border-indigo-500 focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={fetchWishlist}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-700 transition"
        >
          Load Wishlist
        </button>

        {wishlist?.items?.length > 0 && (
          <button
            onClick={clearWishlist}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
          >
            Clear All
          </button>
        )}
      </div>

      {/* 🔄 Loading */}
      {loading && (
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-white/60 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* ❌ Empty */}
      {!loading && wishlist?.items?.length === 0 && (
        <div className="text-center mt-10 text-gray-500">
          <p className="text-lg">No items in wishlist</p>
        </div>
      )}

      {/* ❤️ Wishlist Grid */}
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {wishlist?.items?.map((item) => (
          <div
            key={item.productId}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group"
          >
            {/* 🖼️ Image */}
            <div className="relative">
              <img
                src={item.image || "https://via.placeholder.com/200"}
                alt={item.title}
                className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
              />

              {/* ❤️ Badge */}
              <span className="absolute top-2 right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                ♥
              </span>
            </div>

            {/* 📦 Info */}
            <div className="p-3">
              <h3 className="font-semibold text-sm line-clamp-2">
                {item.title}
              </h3>

              <p className="text-pink-600 font-semibold mt-1">
                ₹ {item.price}
              </p>

              {/* ❌ Remove */}
              <button
                onClick={() => removeItem(item.productId)}
                className="mt-3 w-full bg-red-500 text-white py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}