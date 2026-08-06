import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import {
  FaSearch, FaBoxOpen, FaCheckCircle, FaTruck,
  FaTimesCircle, FaClock, FaMapMarkerAlt,
  FaRupeeSign, FaShoppingBag, FaEnvelope,
  FaPhoneAlt, FaUser, FaCreditCard, FaTimes,
  FaBarcode, FaTruckMoving, FaBox,
} from "react-icons/fa";
import { MdLocalShipping, MdAutoAwesome } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
/* ── ORDER STATUS PIPELINE ── */
const STATUS_STEPS = [
  { key: "Placed", label: "Order Placed", icon: <FaBoxOpen size={14} />, color: "#f59e0b" },
  { key: "Confirmed", label: "Confirmed", icon: <FaCheckCircle size={14} />, color: "#3b82f6" },
  { key: "Shipped", label: "Shipped", icon: <FaTruckMoving size={14} />, color: "#8b5cf6" },
  { key: "Delivered", label: "Delivered", icon: <FaTruck size={14} />, color: "#10b981" },
];

const STATUS_ORDER = ["Placed", "Confirmed", "Shipped", "Delivered"];

const STATUS_CFG = {
  Placed: { bg: "#fef3c7", border: "#fbbf24", text: "#b45309", dot: "#f59e0b" },
  Confirmed: { bg: "#eff6ff", border: "#93c5fd", text: "#1d4ed8", dot: "#3b82f6" },
  Shipped: { bg: "#f5f3ff", border: "#a78bfa", text: "#6d28d9", dot: "#8b5cf6" },
  Delivered: { bg: "#f0fdf4", border: "#6ee7b7", text: "#065f46", dot: "#10b981" },
  Cancelled: { bg: "#fef2f2", border: "#fca5a5", text: "#b91c1c", dot: "#ef4444" },
  Processing: { bg: "#eef2ff", border: "#a5b4fc", text: "#3730a3", dot: "#6366f1" },
};

const TrackOrder = () => {
 const [searchParams] = useSearchParams();

const id = searchParams.get("id");
  const [orderId, setOrderId] = useState(id || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(true);
  const navigate = useNavigate();

  const BACKEND_URL ="http://localhost:5000";
const fetchOrder =
  async (customId) => {

    if (

      !customId ||

      customId.trim() === ""

    ) {

      toast.error(

        "Order ID required",

        {

          description:
            "Enter the Order ID sent to your email.",

        }

      );

      return;

    }

    try {

      setLoading(true);

      setOrder(null);

      setSearched(true);

      const token =
        localStorage.getItem(
          "token"
        );
        if (!token) {

  navigate("/sign-in");

  return;

}

      const res =
        await fetch(

          `${BACKEND_URL}/api/order/${customId}`,

          {

            headers: {

              Authorization:
                `Bearer ${token}`,

            },

          }

        );

      const data =
        await res.json();

      if (data.success) {

        setOrder(
          data.order
        );

      } else {

        setOrder(null);

        toast.error(

          data.message ||

          "Order not found",

          {

            description:
              "Please check your Order ID.",

          }

        );

      }

    } catch (e) {

      console.error(e);

      toast.error(
        "Failed to fetch order"
      );

      setOrder(null);

    } finally {

      setLoading(false);

    }

  };

useEffect(() => {

  if (id) {

    setOrderId(id);

    fetchOrder(id);

  }

}, [id]);

 const handleCancel =
  async () => {

    if (!order)
      return;

    try {

      setCancelLoading(true);

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {

        navigate(
          "/sign-in"
        );

        return;

      }

      const res =
        await fetch(

          `${BACKEND_URL}/api/order/cancel/${order._id}`,

          {

            method: "PUT",

            headers: {

              Authorization:
                `Bearer ${token}`,

            },

          }

        );

      const data =
        await res.json();

      if (data.success) {

        toast.success(

          "Order cancelled",

          {

            description:
              "Your order has been successfully cancelled.",

          }

        );

      setOrder(data.order);
setShowCancelModal(false);

// refresh page
window.location.reload();

      } else {

        toast.error(

          data.message ||

          "Failed to cancel order"

        );

      }

    } catch (error) {

      console.error(
        error
      );

      toast.error(
        "Error cancelling order"
      );

    } finally {

      setCancelLoading(
        false
      );

    }

  };

  const canCancel =
    order &&
    !order.cancelled &&
    (new Date() - new Date(order.createdAt)) / (1000 * 60 * 60 * 24) <= 7 &&
    order.status !== "Cancelled" &&
    order.status !== "Delivered";

  const currentStepIdx = STATUS_ORDER.indexOf(order?.status);
  const isCancelled = order?.status === "Cancelled";

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      : "—";
  const formatTime = (d) =>
    d
      ? new Date(d).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
      : "";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNoticeModal(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="result-enter result-card w-full space-y-6 p-6 sm:p-7">
      <div className="space-y-3">
        <div className="h-4 w-32 rounded-lg bg-gradient-to-r from-indigo-200 to-blue-200 animate-pulse" />
        <div className="h-6 w-64 rounded-lg bg-gradient-to-r from-indigo-200 to-blue-200 animate-pulse" />
      </div>
      <div className="h-32 w-full rounded-lg bg-gradient-to-r from-indigo-100 to-blue-100 animate-pulse" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-gradient-to-r from-indigo-100 to-blue-100 animate-pulse" />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        :root {
          --ind: #4f46e5;
          --blue: #2563eb;
          --lt: #eef2ff;
        }

        .to-root * {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .to-serif {
          font-family: 'Playfair Display', serif;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-18px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes blobDrift {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
          }
          40% {
            transform: translate(20px, -18px) scale(1.05);
          }
          70% {
            transform: translate(-12px, 12px) scale(0.96);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes stepIn {
          from {
            opacity: 0;
            transform: scale(0.7);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes lineGrow {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.15);
            opacity: 1;
          }
        }

        .blob1 {
          animation: blobDrift 10s ease-in-out infinite;
        }
        .blob2 {
          animation: blobDrift 13s ease-in-out infinite reverse;
        }
        .page-enter {
          animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .result-enter {
          animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
        }

        /* Search Card */
        .search-card {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px);
          border: 1.5px solid rgba(99, 102, 241, 0.15);
          border-radius: 24px;
          box-shadow: 0 8px 40px rgba(79, 70, 229, 0.1);
          transition: all 0.3s;
        }

        .search-card:hover {
          border-color: rgba(99, 102, 241, 0.28);
          box-shadow: 0 16px 56px rgba(79, 70, 229, 0.15);
        }

        /* Input */
        .s-input {
          flex: 1;
          min-width: 0;
          background: #f8faff;
          border: 1.5px solid rgba(99, 102, 241, 0.18);
          border-radius: 14px;
          padding: 13px 18px;
          font-size: 14px;
          font-weight: 500;
          color: #1e1b4b;
          transition: all 0.24s;
        }

        .s-input::placeholder {
          color: #a5b4fc;
        }

        .s-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3.5px rgba(99, 102, 241, 0.16);
          background: white;
        }

        /* Button */
        .s-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 24px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 700;
          background: linear-gradient(135deg, #4f46e5, #2563eb);
          color: white;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          transition: all 0.24s;
          box-shadow: 0 4px 16px rgba(79, 70, 229, 0.32);
        }

        .s-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(79, 70, 229, 0.42);
        }

        .s-btn:active {
          transform: scale(0.96);
        }

        .s-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(105deg, transparent 35%, rgba(255, 255, 255, 0.2) 50%, transparent 65%);
          background-size: 200% 100%;
          animation: shimmer 2.4s infinite;
        }

        /* Result Card */
        .result-card {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px);
          border: 1.5px solid rgba(99, 102, 241, 0.15);
          border-radius: 28px;
          box-shadow: 0 16px 56px rgba(79, 70, 229, 0.12);
          overflow: hidden;
        }

        /* Timeline */
        .timeline-wrap {
          display: flex;
          align-items: flex-start;
          gap: 0;
          position: relative;
          padding: 20px 16px;
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.03), rgba(37, 99, 235, 0.03));
          border-radius: 20px;
          border: 1px solid rgba(99, 102, 241, 0.1);
        }

        .tl-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .tl-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2.5px solid #e5e7eb;
          background: white;
          transition: all 0.4s ease;
          position: relative;
          z-index: 2;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .tl-circle.done {
          background: linear-gradient(135deg, #4f46e5, #2563eb);
          border-color: transparent;
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
          animation: stepIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .tl-circle.current {
          background: white;
          border-color: #6366f1;
          box-shadow: 0 0 0 5px rgba(99, 102, 241, 0.18);
          animation: pulse 2s ease-in-out infinite;
        }

        .tl-line {
          position: absolute;
          top: 22px;
          left: calc(50% + 22px);
          right: calc(-50% + 22px);
          height: 2.5px;
          background: #e5e7eb;
          z-index: 0;
          border-radius: 2px;
          overflow: hidden;
        }

        .tl-line-fill {
          height: 100%;
          background: linear-gradient(90deg, #4f46e5, #2563eb);
          animation: lineGrow 0.6s ease both;
          border-radius: 2px;
        }

        .tl-label {
          margin-top: 10px;
          text-align: center;
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          max-width: 80px;
          line-height: 1.3;
        }

        .tl-label.done {
          color: #4f46e5;
        }

        .tl-label.current {
          color: #4f46e5;
          font-weight: 800;
        }

        /* Info Chip */
        .info-chip {
          background: linear-gradient(135deg, #f8faff, #f0f4ff);
          border: 1.5px solid rgba(99, 102, 241, 0.12);
          border-radius: 16px;
          padding: 14px 16px;
          transition: all 0.24s;
        }

        .info-chip:hover {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(99, 102, 241, 0.28);
          transform: translateY(-2px);
        }

        /* Item Row */
        .item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(99, 102, 241, 0.08);
          font-size: 13px;
        }

        .item-row:last-child {
          border-bottom: none;
        }

        /* Cancel Button */
        .cancel-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 700;
          background: linear-gradient(135deg, #ef4444, #f43f5e);
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.24s;
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
        }

        .cancel-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(239, 68, 68, 0.42);
        }

        .cancel-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Spinner */
        .spinner {
          width: 16px;
          height: 16px;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* Address Box */
        .addr-box {
          background: linear-gradient(135deg, #f8faff, #f0f4ff);
          border: 1.5px solid rgba(99, 102, 241, 0.12);
          border-radius: 18px;
          padding: 16px 18px;
        }

        /* Empty State */
        .empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          border: 3px solid rgba(239, 68, 68, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <div
        className="to-root min-h-screen relative overflow-x-hidden"
        style={{
          background: "linear-gradient(135deg, #eef2ff 0%, #f0f4ff 40%, #ffffff 100%)",
        }}
      >
        {/* ── BLOBS ── */}
        <div
          className="blob1 pointer-events-none fixed -top-40 -left-40 w-96 h-96 opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #c7d2fe, transparent)" }}
        />
        <div
          className="blob2 pointer-events-none fixed -bottom-32 -right-32 w-96 h-96 opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #bfdbfe, transparent)" }}
        />
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #4f46e5 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-16 flex flex-col items-center">
          {/* ── HEADER ── */}
          <div className="page-enter text-center mb-8 w-full">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-indigo-100 rounded-full px-4 py-1.5 text-[10px] font-bold text-indigo-500 tracking-widest uppercase mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block" />
              Order Tracking
            </div>

            <h1 className="to-serif text-4xl sm:text-5xl font-bold text-indigo-950 leading-tight mb-2">
              Track Your Order
            </h1>

            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Enter your order ID to get real-time shipping updates and delivery information
            </p>
          </div>

          {/* ── SEARCH CARD ── */}
          <div className="page-enter search-card w-full p-6 sm:p-7 mb-8">
            <label className="block text-xs font-bold tracking-widest text-indigo-500 uppercase mb-3">
              <MdAutoAwesome size={12} style={{ display: "inline-block", marginRight: "6px" }} />
              Order ID
            </label>

            <div className="flex gap-3 items-center flex-col sm:flex-row">
              <input
                type="text"
                placeholder="e.g. 683a12b4c9e7f2b1..."
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchOrder(orderId)}
                className="s-input w-full sm:flex-1"
              />
              <button className="s-btn w-full sm:w-auto" onClick={() => fetchOrder(orderId)}>
                {loading ? (
                  <div className="spinner relative z-10" />
                ) : (
                  <FaSearch size={16} className="relative z-10" />
                )}
                <span className="relative z-10">{loading ? "Searching…" : "Track"}</span>
              </button>
            </div>
          </div>

          {/* ── NOT FOUND ── */}
          {!loading && searched && !order && (
            <div className="result-enter text-center py-16 w-full">
              <div className="empty-icon mx-auto mb-4">
                <FaTimesCircle size={36} style={{ color: "#ef4444" }} />
              </div>
              <h2 className="to-serif text-2xl font-bold text-indigo-950 mb-2">Order Not Found</h2>
              <p className="text-slate-400 text-sm mb-6">
                Double-check your Order ID and try again. You can find it in your confirmation email.
              </p>
              <button
                onClick={() => setSearched(false)}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold text-sm shadow-lg hover:shadow-xl transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ── LOADING ── */}
          {loading && searched && <SkeletonLoader />}

          {/* ── ORDER RESULT ── */}
          {order && (
            <div className="result-enter result-card w-full">
              {/* ── TOP ACCENT ── */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: `linear-gradient(90deg, ${isCancelled ? "#ef4444" : STATUS_CFG[order.status]?.dot || "#6366f1"
                    }, rgba(99, 102, 241, 0.3))`,
                }}
              />

              <div className="p-6 sm:p-8 space-y-7">
                {/* ── TOP ROW ── */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase mb-2">
                      <FaBarcode size={11} style={{ display: "inline-block", marginRight: "6px" }} />
                      Order ID
                    </p>
                    <p className="font-mono text-sm font-bold text-indigo-950 break-all">{order._id}</p>
                    <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                      <FaClock size={11} />
                      {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
                    </p>
                  </div>

                  <span
                    className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full flex-shrink-0 whitespace-nowrap"
                    style={{
                      background: STATUS_CFG[order.status]?.bg || "#eef2ff",
                      color: STATUS_CFG[order.status]?.text || "#3730a3",
                      border: `1.5px solid ${STATUS_CFG[order.status]?.border || "#a5b4fc"}`,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: STATUS_CFG[order.status]?.dot || "#6366f1" }}
                    />
                    {order.status}
                  </span>
                </div>

                {/* ── STATUS TIMELINE ── */}
                {!isCancelled && (
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-indigo-500 uppercase mb-5">
                      📦 Shipment Progress
                    </p>
                    <div className="timeline-wrap">
                      {STATUS_STEPS.map((step, i) => {
                        const isDone = currentStepIdx > i;
                        const isCurrent = currentStepIdx === i;
                        const isLast = i === STATUS_STEPS.length - 1;

                        return (
                          <div key={step.key} className="tl-step">
                            {/* ── CONNECTOR LINE ── */}
                            {!isLast && (
                              <div className="tl-line">
                                {isDone && (
                                  <div
                                    className="tl-line-fill"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                  />
                                )}
                              </div>
                            )}

                            {/* ── CIRCLE ── */}
                            <div
                              className={`tl-circle ${isDone ? "done" : isCurrent ? "current" : ""}`}
                              style={isDone ? { animationDelay: `${i * 0.12}s` } : {}}
                            >
                              {isDone ? (
                                <FaCheckCircle size={16} color="white" />
                              ) : (
                                <span style={{ color: isCurrent ? "#6366f1" : "#cbd5e1" }}>
                                  {step.icon}
                                </span>
                              )}
                            </div>

                            {/* ── LABEL ── */}
                            <p className={`tl-label ${isDone ? "done" : isCurrent ? "current" : ""}`}>
                              {step.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isCancelled && (
                  <div className="flex items-center gap-4 bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/50 rounded-2xl px-5 py-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <FaTimesCircle size={18} style={{ color: "#ef4444" }} />
                    </div>
                    <div>
                      <p className="font-bold text-red-700 text-sm">Order Cancelled</p>
                      <p className="text-xs text-red-600 mt-0.5">
                        This order has been cancelled. A refund will be processed soon.
                      </p>
                    </div>
                  </div>
                )}

                {/* ── INFO GRID ── */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      icon: <FaUser size={12} style={{ color: "#6366f1" }} />,
                      label: "Customer",
                      value: order.user,
                    },
                    {
                      icon: <FaEnvelope size={12} style={{ color: "#2563eb" }} />,
                      label: "Email",
                      value: order.email,
                    },
                    {
                      icon: <FaPhoneAlt size={12} style={{ color: "#10b981" }} />,
                      label: "Phone",
                      value: order.phone,
                    },
                    {
                      icon: <FaCreditCard size={12} style={{ color: "#8b5cf6" }} />,
                      label: "Payment",
                      value: `${order.paymentMethod} · ${order.paymentStatus}`,
                    },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="info-chip">
                      <div className="flex items-center gap-2 mb-2">
                        {icon}
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                          {label}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 truncate">{value || "—"}</p>
                    </div>
                  ))}
                </div>

                {/* ── TOTAL ── */}
                <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600 rounded-2xl px-6 py-5 relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, white 1px, transparent 1px)",
                      backgroundSize: "14px 14px",
                    }}
                  />
                  <div className="relative">
                    <p className="text-indigo-200 text-[10px] font-bold tracking-widest uppercase mb-1">
                      Order Total
                    </p>
                    <p className="text-white/70 text-xs">Incl. taxes & handling</p>
                  </div>
                  <p className="relative to-serif text-3xl font-extrabold text-white flex items-baseline gap-1">
                    <FaRupeeSign size={18} />
                    {order.total?.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* ── DELIVERY ADDRESS ── */}
                {order.deliveryAddress && (
                  <div className="addr-box">
                    <div className="flex items-center gap-2 mb-3">
                      <FaMapMarkerAlt size={13} style={{ color: "#6366f1" }} />
                      <p className="text-[10px] font-bold tracking-widest text-indigo-500 uppercase">
                        Delivery Address
                      </p>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {order.deliveryAddress.street}
                      <br />
                      {order.deliveryAddress.state}
                      {order.deliveryAddress.postcode ? ` - ${order.deliveryAddress.postcode}` : ""}
                      <br />
                      {order.deliveryAddress.country}
                    </p>
                  </div>
                )}

                {/* ── ORDER ITEMS ── */}
                {order.items?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-indigo-500 uppercase mb-3">
                      📦 Items ({order.items.length})
                    </p>
                    <div className="bg-gradient-to-br from-white/60 to-indigo-50/30 border border-indigo-100/50 rounded-2xl px-4 py-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="item-row">
                          <span className="flex items-center gap-2 text-slate-700 font-medium min-w-0">
                            <span className="w-5 h-5 rounded-lg bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                              {i + 1}
                            </span>
                            <span className="line-clamp-1 text-sm">{item.title}</span>
                            <span className="text-slate-400 text-xs font-normal flex-shrink-0">
                              ×{item.quantity}
                            </span>
                          </span>
                          <span className="flex items-center gap-1 font-bold text-indigo-600 text-sm flex-shrink-0 ml-3">
                            <FaRupeeSign size={10} />
                            {(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── CANCEL BUTTON ── */}
                <div className="flex justify-center pt-3">
                  {canCancel ? (
                    <button
                      className="cancel-btn"
                      onClick={() => setShowCancelModal(true)}
                      disabled={cancelLoading}
                    >
                      {cancelLoading ? (
                        <>
                          <div className="spinner" />
                          Cancelling…
                        </>
                      ) : (
                        <>
                          <FaTimes size={13} />
                          Cancel Order
                        </>
                      )}
                    </button>
                  ) : !isCancelled ? (
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <FaClock size={11} />
                      Cancellation window has passed (7 days)
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CANCEL MODAL ── */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        hideCloseButton
        backdrop="blur"
        size="sm"
      >
        <ModalContent className="rounded-2xl bg-white shadow-2xl border border-red-100">
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-4 pt-6 pb-2">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                  <FaTimesCircle size={18} style={{ color: "#ef4444" }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-indigo-950">Cancel Order?</h2>
                  <p className="text-xs text-red-500 font-semibold mt-0.5">This action cannot be undone</p>
                </div>
              </ModalHeader>

              <ModalBody className="py-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Are you sure you want to cancel this order? You will receive a refund according to our refund policy.
                </p>

                <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-xs font-bold text-amber-800 mb-2">⏰ Refund Timeline</p>
                  <p className="text-xs text-amber-700">
                    Refunds are processed within 5–7 business days after cancellation approval.
                  </p>
                </div>
              </ModalBody>

              <ModalFooter className="gap-2 pb-6">
                <Button
                  className="flex-1 border-2 border-indigo-200 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50"
                  variant="bordered"
                  onPress={onClose}
                >
                  Keep Order
                </Button>

                <Button
                  className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl shadow-lg"
                  onPress={handleCancel}
                  disabled={cancelLoading}
                >
                  {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ── INFO NOTICE MODAL ── */}
      <Modal
        isOpen={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
        backdrop="blur"
        placement="center"
        size="md"
        hideCloseButton
      >
        <ModalContent className="rounded-3xl overflow-hidden border bg-white border-amber-100 shadow-2xl">
          {(onClose) => (
            <>
              {/* ── TOP ACCENT ── */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: "linear-gradient(90deg, #f59e0b, #fbbf24, #fde68a)",
                }}
              />

              <ModalHeader className="pt-7 pb-3 flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-50 flex items-center justify-center shadow-lg flex-shrink-0">
                  <FaEnvelope size={24} style={{ color: "#d97706" }} />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Save Your Order ID</h2>
                  <p className="text-xs text-amber-600 font-bold mt-1 tracking-widest uppercase">
                    Important Notice
                  </p>
                </div>
              </ModalHeader>

              <ModalBody className="pb-4">
                <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 p-5 space-y-3">
                  <p className="text-sm leading-relaxed text-slate-700 font-medium">
                    Your Order ID has been sent to your registered email address. Please copy and save it for:
                  </p>

                  <div className="space-y-2">
                    {["📍 Tracking your order", "💬 Requesting support", "❌ Cancelling your order", "📄 Invoice verification"].map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 text-sm text-slate-700 font-medium"
                        >
                          <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-center text-slate-400 mt-3 font-medium">
                  This message will close automatically in a few seconds
                </p>
              </ModalBody>

              <ModalFooter className="pb-6 pt-3">
                <Button
                  onPress={onClose}
                  className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-6 text-sm shadow-lg hover:shadow-xl transition"
                >
                  Got It
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default TrackOrder;