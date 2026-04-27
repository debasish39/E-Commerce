import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await API.get("/api/orders");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleItems = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.user?.toLowerCase().includes(search.toLowerCase()) ||
      o.phone?.includes(search);

    const matchStatus =
      statusFilter === "All" ||
      o.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchPayment =
      paymentFilter === "All" ||
      o.paymentMethod?.toLowerCase() === paymentFilter.toLowerCase();

    return matchSearch && matchStatus && matchPayment;
  });

  return (
    <div className="min-h-screen sm:p-6 bg-transparent p-3"> 

      {/* 🔷 HEADER */}
      <div className="flex justify-between items-center sm:mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          Orders
        </h2>

        <span className="text-sm bg-indigo-500/10 text-indigo-700 px-4 py-1.5 rounded-full font-medium">
          {filteredOrders.length} Orders
        </span>
      </div>

      {/* 🔍 FILTER PANEL */}
      <div className="mb-6  rounded-2xl  p-4 space-y-3">

        <div className="flex flex-col md:flex-row gap-3">

          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search user or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-white/90 border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white/90 shadow-sm focus:ring-2 focus:ring-indigo-400"
          >
            <option value="All">All Status</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white/90 shadow-sm focus:ring-2 focus:ring-indigo-400"
          >
            <option value="All">All Payments</option>
            <option value="COD">COD</option>
            <option value="Razorpay">Razorpay</option>
          </select>

          {/* Reset */}
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setPaymentFilter("All");
            }}
            className="px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition shadow"
          >
            Reset
          </button>
        </div>

        {/* Active Filters (UX improvement) */}
        <div className="flex gap-2 flex-wrap">
          {statusFilter !== "All" && (
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
              Status: {statusFilter}
            </span>
          )}
          {paymentFilter !== "All" && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Payment: {paymentFilter}
            </span>
          )}
        </div>
      </div>

      {/* 🔄 LOADING */}
      {loading && (
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/50 animate-pulse" />
          ))}
        </div>
      )}

      {/* ❌ EMPTY */}
      {!loading && filteredOrders.length === 0 && (
        <div className="text-center mt-12">
          <p className="text-gray-500 text-lg">No matching orders</p>
          <p className="text-sm text-gray-400">
            Try adjusting filters or search
          </p>
        </div>
      )}

      
{/* 🧾 ORDERS CARDS */}
{!loading && filteredOrders.length > 0 && (
  <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">

 {filteredOrders.map((o) => (
  <div
    key={o._id}
    className="relative group bg-gradient-to-br from-gray-10 to-gray-100 backdrop-blur-xl border border-white/40 rounded-2xl shadow-md p-4 sm:p-5 space-y-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
  >

    {/* 🌈 Top Gradient Accent */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-400 rounded-t-2xl" />

    {/* 🔹 Header */}
    <div className="flex justify-between items-start">
      <div className="min-w-0">
        <p className="font-semibold text-indigo-900 truncate">
          {o.user}
        </p>
        <p className="text-xs text-gray-500">
          {o.phone || "-"}
        </p>
      </div>

      {/* 💰 Price */}
      <div className="text-right">
        <p className="text-[10px] text-gray-400">Total</p>
        <p className="text-indigo-600 font-bold text-lg">
          ₹ {o.total}
        </p>
      </div>
    </div>

    {/* 📍 Address Card */}
    <div className="bg-gradient-to-br from-gray-200 to-gray-100 p-3 rounded-xl border border-indigo-300 text-xs">
      <p className="text-gray-400 mb-1 text-[18px] font-medium">
        Delivery Address
      </p>

      <p className="text-gray-700 leading-tight break-words">
        {o.deliveryAddress?.street || "-"},<br />
        {o.deliveryAddress?.state} - {o.deliveryAddress?.postcode}<br />
        {o.deliveryAddress?.country}
      </p>
    </div>

    {/* 📦 Items */}
    <div className="text-xs text-gray-600 flex flex-col gap-1">
      <p className="text-gray-400 font-medium">Items</p>

      {(expanded[o._id] ? o.items : o.items.slice(0, 2)).map(
        (item, i) => (
          <span key={i} className="truncate">
            • {item.title}
          </span>
        )
      )}

      {o.items.length > 2 && (
        <button
          onClick={() => toggleItems(o._id)}
          className="text-indigo-600 text-xs mt-1 text-left hover:underline"
        >
          {expanded[o._id]
            ? "Show less"
            : `+${o.items.length - 2} more`}
        </button>
      )}
    </div>

    {/* 🔻 Footer */}
    <div className="flex flex-wrap gap-2 justify-between items-center pt-2 border-t text-[10px] sm:text-xs">

      {/* Payment */}
      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
        {o.paymentMethod}
      </span>

      {/* Payment Status */}
      <span className="bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium">
        {o.paymentStatus}
      </span>

      {/* Order Status */}
      <span
        className={`px-2 py-1 rounded-full font-medium ${
          o.status === "Delivered"
            ? "bg-green-50 text-green-600"
            : o.status === "Cancelled"
            ? "bg-red-50 text-red-600"
            : "bg-indigo-50 text-indigo-600"
        }`}
      >
        {o.status}
      </span>

      {/* Date */}
      <span className="text-gray-400 w-full text-right sm:w-auto">
        {new Date(o.createdAt).toLocaleDateString("en-IN")}
      </span>
    </div>

  </div>
))}

</div>
)}

     
    </div>
  );
}