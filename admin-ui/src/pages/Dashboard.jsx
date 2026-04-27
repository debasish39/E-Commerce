import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // ✅ GROUP DATA BY DATE (IMPORTANT FIX)
  const grouped = {};

  orders.forEach((o) => {
    const date = new Date(o.createdAt).toLocaleDateString("en-IN");

    if (!grouped[date]) {
      grouped[date] = {
        date,
        total: 0,
      };
    }

    grouped[date].total += o.total || 0;
  });

  const chartData = Object.values(grouped);

  // ✅ STATS
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const avgOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

  return (
    <div className="sm:p-6 p-3 min-h-screen">

      {/* 🔷 HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-indigo-900">
          Dashboard
        </h1>
        <p className="text-sm text-indigo-500 mt-1">
          Overview of your store performance
        </p>
      </div>

      {/* 🔢 STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-6">

        <div className="bg-white/70 border border-indigo-100 p-5 rounded-xl shadow">
          <p className="text-indigo-500 text-sm">Total Orders</p>
          <h2 className="text-2xl font-bold text-indigo-900 mt-1">
            {totalOrders}
          </h2>
        </div>

        <div className="bg-white/70 border border-indigo-100 p-5 rounded-xl shadow">
          <p className="text-indigo-500 text-sm">Total Revenue</p>
          <h2 className="text-2xl font-bold text-blue-600 mt-1">
            ₹ {totalRevenue}
          </h2>
        </div>

        <div className="bg-white/70 border border-indigo-100 p-5 rounded-xl shadow">
          <p className="text-indigo-500 text-sm">Avg Order Value</p>
          <h2 className="text-2xl font-bold text-indigo-700 mt-1">
            ₹ {avgOrder}
          </h2>
        </div>

      </div>

      {/* 📊 CHART */}
      <div className="bg-white/80 backdrop-blur-xl border border-indigo-100 p-5 rounded-2xl shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-indigo-900">
              Sales Overview
            </h2>
            <p className="text-xs text-gray-400">
              Revenue trend over time
            </p>
          </div>

          <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
            {orders.length} Orders
          </span>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="h-64 flex items-center justify-center text-indigo-400">
            Loading chart...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-indigo-300">
            No data available
          </div>
        ) : (

          /* ✅ SCROLLABLE CHART (FIXED) */
          <div className="w-full overflow-x-auto">
            <LineChart
              width={Math.max(chartData.length * 80, 600)}
              height={300}
              data={chartData}
            >

              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />

              <YAxis
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  border: "1px solid #e0e7ff",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#4f46e5" }}
              />

              <Line
                type="monotone"
                dataKey="total"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: "#ffffff",
                }}
                activeDot={{
                  r: 6,
                  fill: "#4f46e5",
                }}
              />

            </LineChart>
          </div>
        )}
      </div>

    </div>
  );
}