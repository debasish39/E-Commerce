import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // or react-hot-toast

const TrackOrder = () => {
  const { id } = useParams();

  const [orderId, setOrderId] = useState(id || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "https://eshop-backend-y0e7.onrender.com";

  // 🔍 Fetch Order
  const fetchOrder = async (customId) => {
    if (!customId) return;

    try {
      setLoading(true);
      setOrder(null);

      const res = await fetch(`${BACKEND_URL}/api/order/${customId}`);
      const data = await res.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        setOrder(null);
        toast.error("Order not found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch order");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  // 📦 Auto load if URL has ID
  useEffect(() => {
    if (id) {
      fetchOrder(id);
    }
  }, [id]);

  // ❌ Cancel Order
  const handleCancel = async () => {
    if (!order) return;

    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      setCancelLoading(true);

      const res = await fetch(
        `${BACKEND_URL}/api/order/cancel/${order._id}`,
        { method: "PUT" }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Order cancelled successfully ✅");
        setOrder(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error cancelling order");
    } finally {
      setCancelLoading(false);
    }
  };

  // ⏱️ Check cancel eligibility
  const canCancel =
    order &&
    !order.cancelled &&
    (new Date() - new Date(order.createdAt)) /
      (1000 * 60 * 60 * 24) <= 7;

  return (
  <div className="min-h-[65vh] flex flex-col   px-4 mt-9
    bg-transparent relative overflow-hidden justify-center items-center mb-9">

    {/* 🔵 BACKGROUND GLOW */}
    <div className="absolute w-[500px] h-[500px] bg-indigo-400 opacity-20 blur-3xl rounded-full -top-32 -left-32" />
    <div className="absolute w-[400px] h-[400px] bg-blue-400 opacity-20 blur-3xl rounded-full bottom-0 right-0" />

    {/* 🔍 SEARCH CARD */}
    <div className="relative w-full max-w-md mb-6
      bg-white/40 backdrop-blur-xl border border-white/30
      rounded-2xl shadow-xl p-6">

      <h1 className="text-lg font-semibold text-indigo-600 mb-4 flex items-center gap-2">
        🔍 Track Your Order
      </h1>

      <div className="flex gap-2">

        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg
            bg-white/70 border border-white/40
            focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={() => fetchOrder(orderId)}
          className="px-4 py-2 rounded-lg text-white font-medium
            bg-gradient-to-r from-indigo-500 to-blue-600
            hover:scale-105 active:scale-95 transition"
        >
          Track
        </button>

      </div>
    </div>

    {/* ⏳ LOADING */}
    {loading && (
      <div className="text-indigo-600 font-medium animate-pulse">
        Loading order details...
      </div>
    )}

    {/* ❌ NOT FOUND */}
    {!loading && order === null && orderId && (
      <div className="text-red-500 font-medium">
        Order not found
      </div>
    )}

    {/* ✅ ORDER DETAILS */}
    {order && (
      <div className="relative w-full max-w-xl
        bg-white/40 backdrop-blur-xl border border-white/30
        rounded-2xl shadow-2xl p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            📦 Order Details
          </h2>

          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            order.status === "Cancelled"
              ? "bg-red-100 text-red-600"
              : "bg-indigo-100 text-indigo-600"
          }`}>
            {order.status}
          </span>
        </div>

        {/* GRID INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

          <div className="glass-card">
            <p className="label">🆔 Order ID</p>
            <p className="value text-indigo-600">{order._id}</p>
          </div>

          <div className="glass-card">
            <p className="label">👤 Name</p>
            <p className="value">{order.user}</p>
          </div>

          <div className="glass-card">
            <p className="label">📧 Email</p>
            <p className="value">{order.email}</p>
          </div>

          <div className="glass-card">
            <p className="label">📞 Phone</p>
            <p className="value">{order.phone}</p>
          </div>

          <div className="glass-card">
            <p className="label">💰 Total</p>
            <p className="value text-green-600 font-bold">₹{order.total}</p>
          </div>

          <div className="glass-card">
            <p className="label">💳 Payment</p>
            <p className="value">
              {order.paymentMethod} ({order.paymentStatus})
            </p>
          </div>

        </div>

        {/* DATE */}
        <div className="text-xs text-gray-500 text-center">
          🕒 {new Date(order.createdAt).toLocaleString()}
        </div>

        {/* ADDRESS */}
        {order.deliveryAddress && (
          <div className="glass-box">
            <p className="title">📍 Delivery Address</p>
            <p className="text-sm">
              {order.deliveryAddress.street}<br />
              {order.deliveryAddress.state} - {order.deliveryAddress.postcode}<br />
              {order.deliveryAddress.country}
            </p>
          </div>
        )}

        {/* ITEMS */}
        {order.items?.length > 0 && (
          <div className="glass-box">
            <p className="title">🛒 Order Items</p>

            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm border-b py-2">
                <span>{item.title} × {item.quantity}</span>
                <span className="font-semibold">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CANCEL */}
        <div className="text-center">
          {canCancel ? (
            <button
              disabled={cancelLoading}
              onClick={handleCancel}
              className="px-6 py-2 rounded-lg text-white font-medium
                bg-gradient-to-r from-red-500 to-red-600
                hover:scale-105 transition disabled:opacity-50"
            >
              {cancelLoading ? "Cancelling..." : "❌ Cancel Order"}
            </button>
          ) : (
            <p className="text-xs text-gray-500">
              ❌ Cannot cancel after 7 days
            </p>
          )}
        </div>

      </div>
    )}
  </div>
);
};

export default TrackOrder;