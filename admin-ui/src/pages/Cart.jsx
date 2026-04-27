import { useState } from "react";
import API from "../api/axios";

export default function Cart() {
  const [userId, setUserId] = useState("");
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📡 Fetch Cart
  const fetchCart = async () => {
    if (!userId) return alert("Enter User ID");

    try {
      setLoading(true);
      const res = await API.get(`/api/cart/${userId}`);
      setCart(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  // ➕ Increase
  const increaseQty = async (productId) => {
    await API.put("/api/cart/increase", { userId, productId });
    fetchCart();
  };

  // ➖ Decrease
  const decreaseQty = async (productId) => {
    await API.put("/api/cart/decrease", { userId, productId });
    fetchCart();
  };

  // ❌ Remove
  const removeItem = async (productId) => {
    await API.delete("/api/cart/remove", {
      data: { userId, productId },
    });
    fetchCart();
  };

  return (
 <div className="p-4 md:p-6 min-h-screen">

  {/* 🔷 Header */}
  <div className="mb-6 flex justify-between items-center">
    <h2 className="text-2xl font-semibold text-indigo-900">
      Cart Management
    </h2>

    {cart?.items?.length > 0 && (
      <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
        {cart.items.length} items
      </span>
    )}
  </div>

  {/* 🔍 Search */}
  <div className="mb-6 bg-transparent sm:p-4 rounded-xl  flex  sm:flex-row gap-3 items-center">

    <input
      placeholder="Enter User ID"
      value={userId}
      onChange={(e) => setUserId(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && fetchCart()}
      className="flex-1 border border-indigo-400 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
    />

    <button
      onClick={fetchCart}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition whitespace-nowrap"
    >
      {loading ? "Loading..." : "Load Cart"}
    </button>

  </div>

  {/* ⏳ Loading */}
  {loading && (
    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-56 rounded-xl bg-white/60 animate-pulse border border-indigo-100"
        />
      ))}
    </div>
  )}

  {/* ❌ Empty */}
  {!loading && cart?.items?.length === 0 && (
    <div className="text-center mt-16 text-indigo-400">
      <p className="text-lg">🛒 Cart is empty</p>
      <p className="text-sm mt-1">No products added yet</p>
    </div>
  )}

  {/* 🛒 Items */}
  {!loading && cart?.items?.length > 0 && (
    <>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

        {cart.items.map((item) => (
          <div
            key={item.productId}
            className="bg-white/60 rounded-xl shadow hover:shadow-xl transition overflow-hidden border border-indigo-100 group"
          >
            {/* 🖼️ Image */}
            <div className="relative overflow-hidden">
              <img
                src={item.image || "https://via.placeholder.com/200"}
                alt={item.title}
                className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
              />

              {/* Quantity Badge */}
              <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full shadow">
                x{item.quantity}
              </span>
            </div>

            {/* 📦 Info */}
            <div className="p-4">
              <h3 className="font-semibold text-sm text-indigo-900 line-clamp-2">
                {item.title}
              </h3>

              <p className="text-blue-600 font-semibold mt-1">
                ₹ {item.price}
              </p>

              {/* 🔢 Controls */}
              <div className="flex items-center justify-between mt-4">

                {/* Quantity */}
                <div className="flex items-center gap-2 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">

                  <button
                    onClick={() => decreaseQty(item.productId)}
                    className="px-2 text-indigo-600 hover:text-indigo-900"
                  >
                    −
                  </button>

                  <span className="text-sm font-medium w-6 text-center text-indigo-900">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQty(item.productId)}
                    className="px-2 text-indigo-600 hover:text-indigo-900"
                  >
                    +
                  </button>

                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-500 text-xs hover:text-red-600"
                >
                  Remove
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 💰 Summary */}
      <div className="mt-8 bg-white/30 rounded-xl shadow p-5 flex justify-between items-center border border-indigo-100">

        <span className="text-indigo-600 font-medium">
          Total Items: {cart.items.reduce((sum, i) => sum + i.quantity, 0)}
        </span>

        <span className="text-xl font-bold text-indigo-700">
          ₹{" "}
          {cart.items.reduce(
            (sum, i) => sum + i.price * i.quantity,
            0
          )}
        </span>

      </div>
    </>
  )}
</div>
  );
}