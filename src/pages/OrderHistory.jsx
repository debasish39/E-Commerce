import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import Logo from "../assets/logo.png";
import {
  FaDownload, FaBoxOpen, FaCheckCircle, FaTruck,
  FaShoppingBag, FaRupeeSign, FaClock, FaReceipt,
  FaChevronDown, FaChevronUp, FaTimes, FaFilter, FaUserCircle,
  FaEye, FaArrowRight, FaPhone, FaMapPin, FaCalendarAlt,
} from "react-icons/fa";
import { MdPayments, MdLocalShipping, MdVerifiedUser } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { useUser } from "@clerk/clerk-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

/* ── STATUS CONFIG ── */
const STATUS_CFG = {
  Placed: {
    bg: "#fef3c7",
    border: "#fbbf24",
    text: "#b45309",
    icon: <FaReceipt size={11} />,
    dot: "#f59e0b",
    gradient: "from-amber-400 to-amber-600",
  },
  Confirmed: {
    bg: "#eff6ff",
    border: "#93c5fd",
    text: "#1d4ed8",
    icon: <FaCheckCircle size={11} />,
    dot: "#3b82f6",
    gradient: "from-blue-400 to-blue-600",
  },
  Shipped: {
    bg: "#f5f3ff",
    border: "#a78bfa",
    text: "#6d28d9",
    icon: <FaTruck size={11} />,
    dot: "#8b5cf6",
    gradient: "from-purple-400 to-purple-600",
  },
  Delivered: {
    bg: "#f0fdf4",
    border: "#6ee7b7",
    text: "#065f46",
    icon: <FaCheckCircle size={11} />,
    dot: "#10b981",
    gradient: "from-green-400 to-green-600",
  },
  Processing: {
    bg: "#eef2ff",
    border: "#a5b4fc",
    text: "#3730a3",
    icon: <BsBoxSeam size={11} />,
    dot: "#6366f1",
    gradient: "from-indigo-400 to-indigo-600",
  },
};

const OrderHistory = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [downloading, setDownloading] = useState({});
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("latest");

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `https://eshop-backend-y0e7.onrender.com/api/orders/${user.id}`
        );
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const toggleExpand = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

 const generateInvoice = (order) => {
  setDownloading((p) => ({ ...p, [order._id]: true }));

  try {
    const doc = new jsPDF("p", "mm", "a4");

    // =============================
    // CONFIG
    // =============================
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 15;

    const colors = {
      primary: [99, 102, 241], // Indigo
      dark: [17, 24, 39],
      gray: [107, 114, 128],
      light: [243, 244, 246],
      border: [229, 231, 235],
      success: [16, 185, 129],
      warning: [245, 158, 11],
      danger: [239, 68, 68],
    };

    const formatCurrency = (value) => `₹${value.toFixed(2)}`;

    const orderDate = order.createdAt
      ? new Date(order.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

    // =============================
    // HEADER
    // =============================
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageWidth, 42, "F");

    // Logo
    try {
      doc.addImage(Logo, "PNG", pageWidth - 42, 8, 20, 20);
    } catch {}

    // Brand
    doc.setTextColor(255, 255, 255);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("EShop", margin, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Premium Online Shopping Experience", margin, 26);

    doc.setFontSize(8);
    doc.text("https://eshop.debasish.xyz", margin, 32);
    doc.text("support@eshop.com", margin, 36);

    // =============================
    // INVOICE TITLE
    // =============================
    let y = 55;

    doc.setTextColor(...colors.dark);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("INVOICE", margin, y);

    // Invoice info card
    doc.setDrawColor(...colors.border);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(pageWidth - 85, 48, 70, 32, 3, 3, "FD");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");

    doc.text("Invoice No:", pageWidth - 80, 56);
    doc.text("Order ID:", pageWidth - 80, 63);
    doc.text("Order Date:", pageWidth - 80, 70);

    doc.setFont("helvetica", "normal");

    doc.text(
      `INV-${order._id.slice(-6).toUpperCase()}`,
      pageWidth - 35,
      56,
      { align: "right" }
    );

    doc.text(
      order._id.slice(-8).toUpperCase(),
      pageWidth - 35,
      63,
      { align: "right" }
    );

    doc.text(orderDate, pageWidth - 35, 70, {
      align: "right",
    });

    // =============================
    // PAYMENT BADGE
    // =============================
    const paymentColor =
      order.paymentMethod === "COD"
        ? colors.warning
        : colors.success;

    doc.setFillColor(...paymentColor);
    doc.roundedRect(pageWidth - 55, 84, 40, 9, 3, 3, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    doc.text(
      order.paymentMethod || "COD",
      pageWidth - 35,
      90,
      { align: "center" }
    );

    // =============================
    // BILLING SECTION
    // =============================
    y = 105;

    doc.setTextColor(...colors.dark);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Billing Information", margin, y);

    doc.setDrawColor(...colors.border);
    doc.setFillColor(255, 255, 255);

    doc.roundedRect(margin, y + 5, pageWidth - margin * 2, 38, 3, 3, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const billingLines = [
      `Customer: ${order.user || "Guest User"}`,
      `Phone: ${order.phone || "N/A"}`,
      `Email: ${order.email || "N/A"}`,
      `Address: ${order.deliveryAddress?.street || ""}`,
      `${order.deliveryAddress?.state || ""} - ${
        order.deliveryAddress?.postcode || ""
      }`,
      `${order.deliveryAddress?.country || ""}`,
    ];

    let infoY = y + 14;

    billingLines.forEach((line) => {
      if (line.trim()) {
        doc.text(line, margin + 5, infoY);
        infoY += 5.5;
      }
    });

    // =============================
    // ITEMS TABLE
    // =============================
    y = 160;

    // Table header background
    doc.setFillColor(...colors.primary);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 10, 2, 2, "F");

    doc.setTextColor(255, 255, 255);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text("Product", margin + 5, y + 6.5);
    doc.text("Qty", 115, y + 6.5);
    doc.text("Price", 140, y + 6.5);
    doc.text("Total", 175, y + 6.5);

    y += 12;

    // Table rows
    doc.setTextColor(...colors.dark);

    order.items.forEach((item, index) => {
      if (y > pageHeight - 70) {
        doc.addPage();
        y = 30;
      }

      if (index % 2 === 0) {
        doc.setFillColor(...colors.light);
        doc.roundedRect(
          margin,
          y - 5,
          pageWidth - margin * 2,
          10,
          1,
          1,
          "F"
        );
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      doc.text(`${index + 1}. ${item.title}`, margin + 5, y);

      doc.text(`${item.quantity}`, 118, y);

      doc.text(formatCurrency(item.price), 140, y);

      doc.text(
        formatCurrency(item.price * item.quantity),
        175,
        y
      );

      y += 10;
    });

    // =============================
    // TOTAL SECTION
    // =============================
    const subtotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const shipping = 0;
    const handling = 5;
    const grandTotal = subtotal + shipping + handling;

    y += 10;

    // Summary card
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(pageWidth - 85, y, 70, 42, 3, 3, "F");

    doc.setTextColor(...colors.dark);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    doc.text("Payment Summary", pageWidth - 80, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text("Subtotal", pageWidth - 80, y + 18);
    doc.text(formatCurrency(subtotal), pageWidth - 20, y + 18, {
      align: "right",
    });

    doc.text("Shipping", pageWidth - 80, y + 25);
    doc.text("FREE", pageWidth - 20, y + 25, {
      align: "right",
    });

    doc.text("Handling", pageWidth - 80, y + 32);
    doc.text(formatCurrency(handling), pageWidth - 20, y + 32, {
      align: "right",
    });

    // Divider
    doc.setDrawColor(...colors.border);
    doc.line(pageWidth - 80, y + 35, pageWidth - 20, y + 35);

    // Grand total
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    doc.setTextColor(...colors.success);

    doc.text("Grand Total", pageWidth - 80, y + 41);

    doc.text(formatCurrency(grandTotal), pageWidth - 20, y + 41, {
      align: "right",
    });

    // =============================
    // STATUS SECTION
    // =============================
    doc.setTextColor(...colors.dark);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    doc.text("Order Information", margin, y + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(
      `Order Status: ${order.status || "Placed"}`,
      margin,
      y + 20
    );

    doc.text(
      `Payment Status: ${order.paymentStatus || "Pending"}`,
      margin,
      y + 27
    );

    doc.text(
      `Payment Method: ${order.paymentMethod || "COD"}`,
      margin,
      y + 34
    );

    // =============================
    // FOOTER
    // =============================
    doc.setDrawColor(...colors.border);
    doc.line(margin, pageHeight - 28, pageWidth - margin, pageHeight - 28);

    doc.setTextColor(...colors.gray);

    doc.setFontSize(8);

    doc.text(
      "Thank you for shopping with EShop.",
      pageWidth / 2,
      pageHeight - 20,
      { align: "center" }
    );

    doc.text(
      "This is a computer-generated invoice and does not require a signature.",
      pageWidth / 2,
      pageHeight - 15,
      { align: "center" }
    );

    doc.text(
      "© 2026 EShop • support@eshop.com • www.eshop.com",
      pageWidth / 2,
      pageHeight - 9,
      { align: "center" }
    );

    // =============================
    // SAVE
    // =============================
    doc.save(`Invoice-${order._id.slice(-6)}.pdf`);
  } finally {
    setTimeout(() => {
      setDownloading((p) => ({
        ...p,
        [order._id]: false,
      }));
    }, 1200);
  }
};

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
      ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      : "";

  const filteredOrders = orders
    .filter((order) => {
      if (statusFilter !== "All" && order.status !== statusFilter) return false;

      if (dateFilter !== "All") {
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        const diff = now - orderDate;

        if (dateFilter === "7days" && diff > 7 * 24 * 60 * 60 * 1000) return false;
        if (dateFilter === "30days" && diff > 30 * 24 * 60 * 60 * 1000) return false;
      }

      if (searchQuery) {
        const match = order.items.some((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (!match) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortOption === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOption === "priceHigh") return b.total - a.total;
      if (sortOption === "priceLow") return a.total - b.total;
      return 0;
    });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        :root {
          --ind: #4f46e5;
          --blue: #2563eb;
          --lt: #eef2ff;
        }

        .oh-root * {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .oh-serif {
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

        @keyframes expandIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes skeletonPulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
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
        .card-enter {
          animation: slideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .expand-in {
          animation: expandIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* ── ORDER CARD ── */
        .oh-card {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(16px);
          border: 1.5px solid rgba(99, 102, 241, 0.15);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.32s cubic-bezier(0.34, 1.15, 0.64, 1);
          box-shadow: 0 2px 12px rgba(79, 70, 229, 0.08);
        }

        .oh-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 56px rgba(79, 70, 229, 0.18);
          border-color: rgba(99, 102, 241, 0.35);
        }

        /* ── ITEM ROW ── */
        .item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 0;
          border-bottom: 1px solid rgba(99, 102, 241, 0.08);
          font-size: 13.5px;
          transition: all 0.2s;
        }

        .item-row:last-child {
          border-bottom: none;
        }

        .item-row:hover {
          background: rgba(238, 242, 255, 0.6);
          border-radius: 10px;
          padding-left: 8px;
          padding-right: 8px;
        }

        /* ── BILL ROW ── */
        .bill-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #6b7280;
          padding: 5px 0;
        }

        /* ── DOWNLOAD BUTTON ── */
        .dl-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 20px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 700;
          background: linear-gradient(135deg, #4f46e5, #2563eb);
          background-size: 200% 100%;
          color: white;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.24s cubic-bezier(0.34, 1.15, 0.64, 1);
          box-shadow: 0 4px 16px rgba(79, 70, 229, 0.32);
        }

        .dl-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(79, 70, 229, 0.42);
        }

        .dl-btn:active {
          transform: scale(0.96);
        }

        .dl-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(105deg, transparent 35%, rgba(255, 255, 255, 0.2) 50%, transparent 65%);
          background-size: 200% 100%;
          animation: shimmer 2.4s infinite;
        }

        .dl-btn.loading {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .dl-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* ── EXPAND BUTTON ── */
        .expand-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #4f46e5, #2563eb);
          border: none;
          border-radius: 12px;
          padding: 8px 16px;
          cursor: pointer;
          transition: all 0.24s;
        }

        .expand-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.36);
        }

        /* ── SKELETON ── */
        .skel {
          background: linear-gradient(90deg, #e0e7ff 25%, #c7d2fe 50%, #e0e7ff 75%);
          background-size: 200% 100%;
          animation: skeletonPulse 1.4s ease-in-out infinite;
          border-radius: 12px;
        }

        /* ── EMPTY STATE ── */
        .empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #eef2ff, #e0e7ff);
          border: 3px solid rgba(99, 102, 241, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── STAT CARD ── */
        .stat-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1.5px solid rgba(99, 102, 241, 0.15);
          border-radius: 18px;
          padding: 18px 22px;
          transition: all 0.28s;
        }

        .stat-card:hover {
          border-color: rgba(99, 102, 241, 0.35);
          box-shadow: 0 8px 24px rgba(99, 70, 229, 0.12);
          transform: translateY(-2px);
        }
      `}</style>

      <div
        className="oh-root min-h-screen relative overflow-x-hidden"
        style={{ background: "linear-gradient(135deg,#eef2ff 0%,#f0f4ff 40%,#ffffff 100%)" }}
      >
        {/* ── BLOBS ── */}
        <div
          className="blob1 pointer-events-none fixed -top-40 -left-40 w-96 h-96 opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle,#c7d2fe,transparent)" }}
        />
        <div
          className="blob2 pointer-events-none fixed -bottom-32 -right-32 w-96 h-96 opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle,#bfdbfe,transparent)" }}
        />
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle,#4f46e5 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

          {/* ── HEADER ── */}
          <div className="page-enter flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-indigo-100 rounded-full px-4 py-1.5 text-[10px] font-bold text-indigo-500 tracking-widest uppercase mb-3 shadow-sm">
                <FaUserCircle size={11} />
                My Account
              </div>

              <h1 className="oh-serif text-3xl sm:text-5xl font-bold text-indigo-950 leading-tight">
                Order History
              </h1>

              <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md">
                Track, manage and download invoices for all your purchases
              </p>
            </div>

            <button
              onClick={() => setShowFilterModal(true)}
              className="flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-bold rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition"
            >
              <FaFilter size={13} />
              Advanced Filters
            </button>
          </div>

          {/* ── STATS BAR ── */}
          {!loading && orders.length > 0 && (
            <div className="page-enter grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
              {[
                {
                  label: "Total Orders",
                  value: orders.length,
                  icon: <FaBoxOpen size={17} style={{ color: "#4f46e5" }} />,
                  bg: "#eef2ff",
                },
                {
                  label: "Delivered",
                  value: orders.filter((o) => o.status === "Delivered").length,
                  icon: <FaCheckCircle size={17} style={{ color: "#10b981" }} />,
                  bg: "#f0fdf4",
                },
                {
                  label: "In Transit",
                  value: orders.filter((o) => o.status === "Shipped").length,
                  icon: <FaTruck size={17} style={{ color: "#8b5cf6" }} />,
                  bg: "#f5f3ff",
                },
                {
                  label: "Total Spent",
                  value: `₹${orders.reduce((s, o) => s + o.total, 0).toLocaleString("en-IN")}`,
                  icon: <FaRupeeSign size={15} style={{ color: "#2563eb" }} />,
                  bg: "#eff6ff",
                },
              ].map(({ label, value, icon, bg }) => (
                <div key={label} className="stat-card text-center">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                    style={{ background: bg }}
                  >
                    {icon}
                  </div>
                  <p className="text-lg sm:text-xl font-extrabold text-indigo-950">{value}</p>
                  <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-widest">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ── LOADING SKELETONS ── */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="oh-card p-6 space-y-4">
                  <div className="flex justify-between">
                    <div className="skel h-6 w-48" />
                    <div className="skel h-6 w-24" />
                  </div>
                  <div className="skel h-3 w-32" />
                  <div className="skel h-px w-full" />
                  <div className="skel h-3 w-full" />
                  <div className="skel h-3 w-4/5" />
                </div>
              ))}
            </div>
          )}

          {/* ── EMPTY STATE ── */}
          {!loading && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-28 text-center page-enter">
              <div className="empty-icon mb-6">
                <FaShoppingBag size={38} style={{ color: "#6366f1" }} />
              </div>
              <h2 className="oh-serif text-3xl font-bold text-indigo-950 mb-3">No orders yet</h2>
              <p className="text-slate-400 text-sm max-w-sm mb-8">
                Start shopping to see your orders here. Every purchase will be tracked and
                organized for easy access.
              </p>
              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold shadow-lg hover:shadow-xl transition">
                Start Shopping
              </button>
            </div>
          )}

          {/* ── ORDER CARDS ── */}
          {!loading && filteredOrders.length > 0 && (
            <div className="space-y-5">
              {filteredOrders.map((order, idx) => {
                const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
                const handling = 5;
                const grandTotal = subtotal + handling;
                const isExp = !!expanded[order._id];
                const isDL = !!downloading[order._id];
                const statusCfg = STATUS_CFG[order.status] || STATUS_CFG.Placed;

                return (
                  <div
                    key={order._id}
                    className="oh-card card-enter"
                    style={{ animationDelay: `${idx * 0.06}s` }}
                  >
                    {/* ── TOP ACCENT LINE ── */}
                    <div
                      className="h-1.5 w-full"
                      style={{
                        background: `linear-gradient(90deg,${statusCfg.dot},rgba(99,102,241,0.3))`,
                      }}
                    />

                    <div className="p-6 sm:p-7">

                      {/* ── CARD HEADER ── */}
                      <div className="flex flex-col gap-4 mb-5">

                        {/* TOP ROW */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            {/* Icon */}
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                              style={{
                                background: statusCfg.bg,
                                border: `1.5px solid ${statusCfg.border}`,
                              }}
                            >
                              <span style={{ color: statusCfg.text }}>{statusCfg.icon}</span>
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-indigo-950 text-sm">
                                Order #{order._id.slice(-8).toUpperCase()}
                              </p>
                              <p className="text-xs text-slate-400 font-medium mt-1">
                                Placed by <span className="text-indigo-600 font-bold">{order.user}</span>
                              </p>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span
                                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${
                                    order.paymentMethod === "COD"
                                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                                      : "bg-green-50 text-green-700 border border-green-200"
                                  }`}
                                >
                                  <MdPayments size={10} />
                                  {order.paymentMethod}
                                </span>
                                {order.paymentStatus === "paid" && (
                                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1.5">
                                    <MdVerifiedUser size={10} />
                                    Verified
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex-shrink-0">
                            <span
                              className="inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full whitespace-nowrap"
                              style={{
                                background: statusCfg.bg,
                                color: statusCfg.text,
                                border: `1.5px solid ${statusCfg.border}`,
                              }}
                            >
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ background: statusCfg.dot }}
                              />
                              {order.status || "Placed"}
                            </span>
                          </div>
                        </div>

                        {/* DELIVERY ADDRESS */}
                        {order.deliveryAddress?.street && (
                          <div className="flex items-start gap-3 bg-indigo-50/50 border border-indigo-200/50 rounded-2xl px-4 py-3">
                            <FaMapPin
                              size={13}
                              style={{ color: "#6366f1", marginTop: "2px", flexShrink: 0 }}
                            />
                            <div className="text-xs text-slate-600 leading-relaxed">
                              <p className="font-semibold text-indigo-900">
                                {order.deliveryAddress.street}
                              </p>
                              <p className="text-slate-500 mt-1">
                                {order.deliveryAddress.state} - {order.deliveryAddress.postcode} •{" "}
                                {order.deliveryAddress.country}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* ORDER DATE & PHONE */}
                        <div className="flex flex-wrap gap-3 text-xs">
                          <div className="flex items-center gap-2 text-slate-500">
                            <FaCalendarAlt size={11} style={{ color: "#6366f1" }} />
                            <span className="font-medium">
                              {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                            </span>
                          </div>
                          {order.phone && (
                            <div className="flex items-center gap-2 text-slate-500">
                              <FaPhone size={11} style={{ color: "#6366f1" }} />
                              <span className="font-medium">{order.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ── ITEMS PREVIEW (COLLAPSED) ── */}
                      {!isExp && (
                        <div className="flex flex-wrap gap-2 mb-5 pb-5 border-b border-indigo-100">
                          {order.items.slice(0, 3).map((item, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-xl font-medium truncate max-w-[180px]"
                            >
                              {item.title} ×{item.quantity}
                            </span>
                          ))}
                          {order.items.length > 3 && (
                            <span className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-xl font-bold">
                              +{order.items.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* ── EXPANDED ITEMS ── */}
                      {isExp && (
                        <div className="expand-in mb-5 bg-gradient-to-br from-indigo-50/50 to-blue-50/30 border border-indigo-200/50 rounded-3xl p-5">
                          <p className="text-[11px] font-bold tracking-widest text-indigo-500 uppercase mb-4">
                            📦 Order Items ({order.items.length})
                          </p>
                          {order.items.map((item, i) => (
                            <div key={i} className="item-row">
                              <span className="text-slate-700 font-medium flex items-center gap-3 min-w-0">
                                <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                                  {i + 1}
                                </span>
                                <span className="line-clamp-2 text-sm">{item.title}</span>
                              </span>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="text-slate-400 text-xs font-normal">× {item.quantity}</span>
                                <span className="flex items-center text-indigo-600 font-bold text-sm">
                                  <FaRupeeSign size={11} />
                                  {(item.price * item.quantity).toFixed(0)}
                                </span>
                              </div>
                            </div>
                          ))}

                          {/* BILL BREAKDOWN */}
                          <div className="mt-5 pt-4 border-t border-indigo-200/60 space-y-1.5">
                            <div className="bill-row">
                              <span className="text-slate-600 font-medium">Subtotal</span>
                              <span className="font-bold text-slate-800">
                                ₹{subtotal.toFixed(2)}
                              </span>
                            </div>
                            <div className="bill-row">
                              <span className="text-slate-600 font-medium">Delivery</span>
                              <span className="font-bold text-green-600 text-xs">FREE</span>
                            </div>
                            <div className="bill-row">
                              <span className="text-slate-600 font-medium">Handling</span>
                              <span className="font-bold text-slate-800">₹{handling.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-indigo-200 font-bold text-slate-900">
                              <span>Grand Total</span>
                              <span className="flex items-center text-lg text-indigo-600">
                                <FaRupeeSign size={12} />
                                {grandTotal.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── FOOTER ACTIONS ── */}
                      <div className="flex items-center justify-between gap-3 flex-wrap pt-4 border-t border-indigo-100">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                            Total
                          </span>
                          <span className="flex items-center font-extrabold text-2xl text-indigo-600">
                            <FaRupeeSign size={14} />
                            {grandTotal.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            className="expand-btn"
                            onClick={() => toggleExpand(order._id)}
                          >
                            {isExp ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
                            {isExp ? "Hide" : "Details"}
                          </button>

                          <button
                            className={`dl-btn ${isDL ? "loading" : ""}`}
                            onClick={() => !isDL && generateInvoice(order)}
                            disabled={isDL}
                          >
                            {isDL ? (
                              <div className="dl-spinner relative z-10" />
                            ) : (
                              <FaDownload size={12} className="relative z-10" />
                            )}
                            <span className="relative z-10">{isDL ? "Generating…" : "Invoice"}</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── NO RESULTS (FILTERED) ── */}
          {!loading && orders.length > 0 && filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center page-enter">
              <div className="empty-icon mb-6">
                <FaFilter size={36} style={{ color: "#6366f1" }} />
              </div>
              <h2 className="oh-serif text-2xl font-bold text-indigo-950 mb-2">No orders match</h2>
              <p className="text-slate-400 text-sm max-w-sm mb-6">
                Try adjusting your filters or search terms to find your orders.
              </p>
              <button
                onClick={() => {
                  setStatusFilter("All");
                  setDateFilter("All");
                  setSearchQuery("");
                  setSortOption("latest");
                }}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold text-sm shadow-lg hover:shadow-xl transition"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ── FILTER MODAL ── */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        hideCloseButton
        placement="bottom"
        backdrop="blur"
        size="lg"
        classNames={{
          backdrop: "bg-indigo-900/40 backdrop-blur-md",
        }}
      >
        <ModalContent className="rounded-t-3xl bg-gradient-to-br from-white via-indigo-50 to-blue-50 border-t border-indigo-200/50 shadow-2xl">
          {(onClose) => (
            <>
              {/* HEADER */}
              <ModalHeader className="relative flex flex-col items-center pt-5 pb-2">
                <div className="w-10 h-1.5 bg-gradient-to-r from-indigo-300 to-blue-300 rounded-full mb-3" />
                <h2 className="text-xl font-bold text-indigo-950">Filter Orders</h2>
                <button
                  onClick={onClose}
                  className="absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/70 border border-indigo-200 text-indigo-600 hover:bg-indigo-100 transition"
                >
                  <FaTimes size={13} />
                </button>
              </ModalHeader>

              {/* BODY */}
              <ModalBody className="space-y-6 px-6 pb-4">
                {/* SEARCH */}
                <div>
                  <p className="text-xs font-bold text-indigo-500 mb-3 uppercase tracking-wider">
                    🔍 Search Product
                  </p>
                  <input
                    type="text"
                    placeholder="Find product by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-indigo-200 bg-white/70 backdrop-blur text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  />
                </div>

                {/* STATUS */}
                <div>
                  <p className="text-xs font-bold text-indigo-500 mb-3 uppercase tracking-wider">
                    📊 Order Status
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Placed", "Confirmed", "Processing", "Shipped", "Delivered"].map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`px-4 py-2 text-xs font-bold rounded-full transition ${
                            statusFilter === status
                              ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg"
                              : "bg-white border border-indigo-200 text-indigo-600 hover:border-indigo-400"
                          }`}
                        >
                          {status}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* SORT */}
                <div>
                  <p className="text-xs font-bold text-indigo-500 mb-3 uppercase tracking-wider">
                    🔀 Sort By
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Latest", value: "latest" },
                      { label: "Oldest", value: "oldest" },
                      { label: "Price High", value: "priceHigh" },
                      { label: "Price Low", value: "priceLow" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSortOption(opt.value)}
                        className={`px-4 py-2 text-xs font-bold rounded-full transition ${
                          sortOption === opt.value
                            ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg"
                            : "bg-white border border-indigo-200 text-indigo-600 hover:border-indigo-400"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DATE */}
                <div>
                  <p className="text-xs font-bold text-indigo-500 mb-3 uppercase tracking-wider">
                    📅 Date Range
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "All Time", value: "All" },
                      { label: "Last 7 Days", value: "7days" },
                      { label: "Last 30 Days", value: "30days" },
                    ].map((item) => (
                      <button
                        key={item.value}
                        onClick={() => setDateFilter(item.value)}
                        className={`px-4 py-2 text-xs font-bold rounded-full transition ${
                          dateFilter === item.value
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                            : "bg-white border border-blue-200 text-blue-600 hover:border-blue-400"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </ModalBody>

              {/* FOOTER */}
              <ModalFooter className="px-6 pb-6 gap-3">
                <Button
                  className="flex-1 border-2 border-indigo-200 bg-white text-indigo-600 font-bold text-sm hover:bg-indigo-50"
                  variant="bordered"
                  onPress={() => {
                    setStatusFilter("All");
                    setDateFilter("All");
                    setSearchQuery("");
                    setSortOption("latest");
                  }}
                >
                  Reset All
                </Button>

                <Button
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold text-sm shadow-lg"
                  onPress={onClose}
                >
                  Apply Filters
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default OrderHistory;