import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaArrowLeft, FaDownload, FaCheckCircle, FaTruck,
  FaRupeeSign, FaPhone, FaEnvelope, FaMapPin,
  FaCalendarAlt, FaClock, FaTimes, FaExclamationTriangle,
  FaBarcode, FaCopy, FaReceipt, FaClipboardList,
} from "react-icons/fa";
import { MdPayments, MdVerifiedUser } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
/* ── STATUS CONFIG (mirrors OrderHistory) ── */
const STATUS_CFG = {
  Placed: {
    bg: "#fef3c7",
    border: "#fbbf24",
    text: "#b45309",
    icon: <FaReceipt size={11} />,
    dot: "#f59e0b",
    canCancel: true,
  },
  Confirmed: {
    bg: "#eff6ff",
    border: "#93c5fd",
    text: "#1d4ed8",
    icon: <FaCheckCircle size={11} />,
    dot: "#3b82f6",
    canCancel: true,
  },
  Processing: {
    bg: "#eef2ff",
    border: "#a5b4fc",
    text: "#3730a3",
    icon: <BsBoxSeam size={11} />,
    dot: "#6366f1",
    canCancel: true,
  },
  Shipped: {
    bg: "#f5f3ff",
    border: "#a78bfa",
    text: "#6d28d9",
    icon: <FaTruck size={11} />,
    dot: "#8b5cf6",
    canCancel: false,
  },
  Delivered: {
    bg: "#f0fdf4",
    border: "#6ee7b7",
    text: "#065f46",
    icon: <FaCheckCircle size={11} />,
    dot: "#10b981",
    canCancel: false,
  },
  Cancelled: {
    bg: "#fef2f2",
    border: "#fca5a5",
    text: "#7c2d12",
    icon: <FaTimes size={11} />,
    dot: "#dc2626",
    canCancel: false,
  },
};

const VALID_STATUS = [
  "Pending Payment",
  "Confirmed",
  "Processing",
  "Packed",
  "Ready for Pickup",
  "Shipped",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Return Requested",
  "Return Approved",
  "Returned",
  "Refund Processing",
  "Refund Completed",
];


const STATUS_ICONS = {
  "Pending Payment": <MdPayments size={18} />,
  Confirmed: <FaCheckCircle size={18} />,
  Processing: <BsBoxSeam size={18} />,
  Packed: <BsBoxSeam size={18} />,
  "Ready for Pickup": <FaTruck size={18} />,
  Shipped: <FaTruck size={18} />,
  "In Transit": <FaTruck size={18} />,
  "Out for Delivery": <FaTruck size={18} />,
  Delivered: <FaCheckCircle size={18} />,
  Cancelled: <FaTimes size={18} />,
  "Return Requested": <FaExclamationTriangle size={18} />,
  "Return Approved": <FaCheckCircle size={18} />,
  Returned: <FaTruck size={18} />,
  "Refund Processing": <MdPayments size={18} />,
  "Refund Completed": <FaCheckCircle size={18} />,
};
function SingleOrderPage({ order: initialOrder, onBack }) {
  const [order, setOrder] = useState(initialOrder);
  const [downloading, setDownloading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      mirror: false,
    });
  }, []);

  useEffect(() => {
    AOS.refreshHard();
  }, [order?.status]);

const handleDownloadInvoice = async () => {
  setDownloading(true);

  try {
    // Load logo from public/logo.png
    const logo = new Image();
    logo.src = "/logo.png";

    await new Promise((resolve, reject) => {
      logo.onload = resolve;
      logo.onerror = reject;
    });

    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    // ===========================
    // Modern Header
    // ===========================
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, pageWidth, 42, "F");

    // Logo
    doc.addImage(logo, "PNG", margin, 8, 30, 22);

    // Invoice Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(31, 41, 55);
    doc.text("INVOICE", pageWidth - margin, 17, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text("Online Shopping Invoice", pageWidth - margin, 24, {
      align: "right",
    });

    // Divider
    doc.setDrawColor(220);
    doc.line(margin, 42, pageWidth - margin, 42);

    let y = 52;

    // ===========================
    // Order Details
    // ===========================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("ORDER DETAILS", margin, y);

    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(`Order ID : ${order._id}`, margin, y);
    y += 6;

    doc.text(
      `Order Date : ${new Date(order.createdAt).toLocaleString("en-IN")}`,
      margin,
      y
    );
    y += 6;

    doc.text(`Status : ${order.status}`, margin, y);
    y += 6;

    doc.text(`Payment Method : ${order.payment.method}`, margin, y);
    y += 6;

    doc.text(`Payment Status : ${order.payment.status}`, margin, y);

    // ===========================
    // Customer Details
    // ===========================
    y += 12;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("CUSTOMER DETAILS", margin, y);

    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(`Name : ${order.fullname || order.user}`, margin, y);
    y += 6;

    doc.text(`Email : ${order.email}`, margin, y);
    y += 6;

    doc.text(`Phone : ${order.phone}`, margin, y);
    y += 6;

   doc.text(
  `Address : ${order.deliveryAddress.address.addressLine1}, ${
    order.deliveryAddress.address.addressLine2
  }, ${order.deliveryAddress.address.landmark}, ${
    order.deliveryAddress.address.area
  }, ${order.deliveryAddress.address.city}, ${
    order.deliveryAddress.address.district
  }, ${order.deliveryAddress.address.state}, ${
    order.deliveryAddress.address.postalCode
  }, ${order.deliveryAddress.address.country}`,
  margin,
  y
);

    // ===========================
    // Products Table
    // ===========================
    y += 15;

    doc.setFillColor(37, 99, 235);
    doc.roundedRect(margin, y - 5, pageWidth - 30, 10, 2, 2, "F");

    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");

    doc.text("Product", margin + 3, y + 1);
    doc.text("Qty", 120, y + 1);
    doc.text("Price", 145, y + 1);
    doc.text("Total", 175, y + 1);

    y += 12;

    doc.setTextColor(0);
    doc.setFont("helvetica", "normal");

    order.items.forEach((item) => {
      doc.text(item.title.substring(0, 30), margin + 3, y);
      doc.text(String(item.quantity), 120, y);
      doc.text(`₹${item.price}`, 145, y);
      doc.text(`₹${item.price * item.quantity}`, 175, y);

      y += 8;
    });

    // ===========================
    // Totals
    // ===========================
    y += 8;

    doc.setDrawColor(220);
    doc.line(120, y, 195, y);

    y += 8;

    doc.text("Subtotal", 120, y);
    doc.text(`₹${order.pricing.subtotal}`, 175, y);

    y += 7;

    doc.text("Shipping", 120, y);
    doc.text(`₹${order.pricing.shippingCharge}`, 175, y);

    y += 7;

    doc.text("Tax", 120, y);
    doc.text(`₹${order.pricing.tax}`, 175, y);

    if ( order.pricing.couponDiscount > 0) {
      y += 7;

      doc.setTextColor(220, 38, 38);
      doc.text(`Coupon (${order.pricing.couponCode})`, 120, y);
      doc.text(`-₹${ order.pricing.couponDiscount}`, 175, y);

      doc.setTextColor(0);
    }

    y += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    doc.text("Grand Total", 120, y);
    doc.text(`₹${order.pricing.total}`, 175, y);

    // ===========================
    // Razorpay Details
    // ===========================
    if (order.paymentMethod === "Razorpay") {
      y += 18;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("PAYMENT DETAILS", margin, y);

      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text(
        `Payment ID : ${order.payment.gateway.paymentId || "-"}`,
        margin,
        y
      );

      y += 6;

      doc.text(
        `Order ID : ${order.payment.gateway.orderId || "-"}`,
        margin,
        y
      );
    }

    // ===========================
    // Footer
    // ===========================
    y += 20;

    doc.setDrawColor(220);
    doc.line(margin, y, pageWidth - margin, y);

    y += 8;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(120);

    doc.text(
      "Thank you for shopping with Odikart!",
      pageWidth / 2,
      y,
      { align: "center" }
    );

    doc.save(`Invoice-${order._id.slice(-6)}.pdf`);

    toast.success("Invoice downloaded successfully");
  } catch (err) {
    console.error(err);
    toast.error("Failed to download invoice");
  } finally {
    setDownloading(false);
  }
};
  const handleCancelOrder = async () => {
  if (!order?._id) return;

  setCancelling(true);

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://eshop-backend-y0e7.onrender.com/api/order/cancel/${order._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      toast.error(data.message || "Failed to cancel order");
      return;
    }

    // Update UI with latest order returned by backend
    setOrder(data.order);

    setShowCancelModal(false);

    toast.success(data.message || "Order cancelled successfully");
  } catch (error) {
    console.error(error);
    toast.error("Server error while cancelling order");
  } finally {
    setCancelling(false);
  }
};

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—";
  const formatTime = (d) =>
    d ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";

  if (!order) {
    return (
      <div
        className="oh-root min-h-screen flex items-center justify-center py-12 px-4"
        style={{ background: "linear-gradient(135deg,#eef2ff 0%,#f0f4ff 40%,#ffffff 100%)" }}
      >
        <style>{PAGE_CSS}</style>
        <div className="text-center" data-aos="zoom-in">
          <div className="empty-icon mb-6 mx-auto">
            <FaExclamationTriangle size={38} style={{ color: "#dc2626" }} />
          </div>
          <h2 className="oh-serif text-3xl font-bold text-indigo-950 mb-2">Order Not Found</h2>
          <p className="text-slate-400 text-sm mb-8">The order you're looking for doesn't exist.</p>
          <button onClick={onBack} className="expand-btn">
            <FaArrowLeft size={12} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const subtotal =
    order.pricing.subtotal ?? order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = order.pricing.shippingCharge ?? 0;
  const tax = order.pricing.tax ?? 0;
  const couponDiscount =  order.pricing.couponDiscount ?? 0;
  const couponCode = order.pricing.couponCode ?? "";
  const grandTotal = order.pricing.total ?? subtotal + shipping + tax - couponDiscount;

  const statusCfg = STATUS_CFG[order.status] || STATUS_CFG.Placed;
  const canCancel = statusCfg.canCancel && order.status !== "Cancelled";

  const orderDate = new Date(order.createdAt);
  const diffDays = (new Date() - orderDate) / (1000 * 60 * 60 * 24);
  const isCancelExpired = diffDays > 7;

  return (
    <div
      className="oh-root min-h-screen relative overflow-x-hidden"
      style={{ background: "linear-gradient(135deg,#eef2ff 0%,#f0f4ff 40%,#ffffff 100%)" }}
    >
      <style>{PAGE_CSS}</style>

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
        <div className="flex items-center gap-4 mb-8" data-aos="fade-down" data-aos-duration="500">
          <button
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white/80 hover:bg-white border border-indigo-200 text-indigo-600 transition shadow-sm flex-shrink-0"
          >
            <FaArrowLeft size={16} />
          </button>
          <div>
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-indigo-100 rounded-full px-4 py-1.5 text-[10px] font-bold text-indigo-500 tracking-widest uppercase mb-2 shadow-sm">
              <FaBarcode size={11} />
              Order Details
            </div>
            <h1 className="oh-serif text-3xl sm:text-4xl font-bold text-indigo-950 leading-tight">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── MAIN COLUMN ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Order summary card */}
            <div className="oh-card" data-aos="fade-up">
              <div
                className="h-1.5 w-full"
                style={{ background: `linear-gradient(90deg,${statusCfg.dot},rgba(99,102,241,0.3))` }}
              />
              <div className="p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: statusCfg.bg, border: `1.5px solid ${statusCfg.border}` }}
                    >
                      <span style={{ color: statusCfg.text }}>{statusCfg.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Placed by</p>
                      <p className="font-bold text-indigo-950 text-sm mt-0.5">{order.deliveryAddress?.customer?.fullName}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${
                            order.paymentMethod === "COD"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-green-50 text-green-700 border border-green-200"
                          }`}
                        >
                          <MdPayments size={10} />
                          {order.payment.method}
                        </span>
                        {order.payment.status === "paid" && (
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1.5">
                            <MdVerifiedUser size={10} />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className="inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full whitespace-nowrap"
                    style={{ background: statusCfg.bg, color: statusCfg.text, border: `1.5px solid ${statusCfg.border}` }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: statusCfg.dot }} />
                    {order.status}
                  </span>
                </div>

                {/* Order ID box */}
                <div className="order-id-box mt-6">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <FaBarcode size={13} style={{ color: "#4f46e5" }} />
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Order ID</p>
                        <p className="text-sm font-bold text-indigo-600 break-all">{order._id}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(order._id);
                        toast.success("Order ID copied!");
                      }}
                      className="px-2 py-1 rounded-lg bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-600 transition flex-shrink-0"
                    >
                      <FaCopy size={11} />
                    </button>
                  </div>
                </div>

                {/* Tracking number */}
                <div className="order-id-box mt-3">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <FaTruck size={13} style={{ color: "#4f46e5" }} />
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tracking Number</p>
                        <p className="text-sm font-bold text-indigo-600 break-all">{order.trackingNumber || "—"}</p>
                      </div>
                    </div>
                    {order.trackingNumber && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(order.trackingNumber);
                          toast.success("Tracking number copied!");
                        }}
                        className="px-2 py-1 rounded-lg bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-600 transition flex-shrink-0"
                      >
                        <FaCopy size={11} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Date */}
                <div className="flex flex-wrap gap-3 text-xs mt-5">
                  <div className="flex items-center gap-2 text-slate-500">
                    <FaCalendarAlt size={11} style={{ color: "#6366f1" }} />
                    <span className="font-medium">
                      {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking timeline */}
        <div className="oh-card p-6 sm:p-7" data-aos="fade-up" data-aos-delay="100">

<p className="oh-serif text-xl font-bold text-indigo-950 mb-5">
  📍 Order Tracking
</p>


<div className="mt-5">

{
VALID_STATUS.map((status,index)=>{

  const history =
    order.statusHistory?.find(
      h => h.status === status
    );


  const currentIndex =
    VALID_STATUS.indexOf(order.status);


  const isCompleted =
    index <= currentIndex;


  const isActive =
    status === order.status;


  const cfg =
    STATUS_CFG[status] || STATUS_CFG.Placed;


return (

<div
key={status}
className="flex gap-4 relative pb-8 last:pb-0"
>


{
index !== VALID_STATUS.length-1 && (

<span
className="absolute left-[27px] top-14 w-[3px] h-[calc(100%-40px)] rounded-full"
style={{
background:
isCompleted
? cfg.dot
:"#e5e7eb"
}}
/>

)

}



<div
className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
style={{

background:
isActive
? `linear-gradient(135deg,${cfg.dot},#2563eb)`
:
isCompleted
? cfg.bg
:"#f3f4f6",


border:
`2px solid ${
isCompleted
? cfg.border
:"#e5e7eb"
}`,

color:
isActive
?"white"
:
isCompleted
?cfg.text
:"#9ca3af"

}}

>

{
STATUS_ICONS[status]
}

</div>



<div className="flex-1 pt-1">


<h4
className={`font-bold ${
isCompleted
?"text-indigo-950"
:"text-slate-400"
}`}
>

{status}

</h4>



{
history ? (

<div className="mt-2">

<div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">

<FaClock />

{formatDate(history.date)}

{" at "}

{formatTime(history.date)}

</div>



{
history.remark && (

<p className="text-xs text-slate-500 mt-1">
{history.remark}
</p>

)

}

</div>


):(


<div className="text-xs text-slate-400 mt-2">
Pending
</div>


)

}



</div>



</div>


)


})

}


</div>

</div>

            {/* Items */}
            <div className="oh-card p-6 sm:p-7" data-aos="fade-up" data-aos-delay="150">
              <p className="text-[11px] font-bold tracking-widest text-indigo-500 uppercase mb-4">
                📦 Order Items ({order.items.length})
              </p>
              {order.items.map((item, i) => (
                <div
                  key={item._id || i}
                  className="item-row flex items-center justify-between gap-3"
                  data-aos="fade-up"
                  data-aos-delay={100 + i * 60}
                  data-aos-duration="450"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                      {i + 1}
                    </span>
                    <img
                      src={item.image || "https://via.placeholder.com/80"}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-700 line-clamp-2">{item.title}</h4>
                      <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-slate-400 text-xs">× {item.quantity}</span>
                    <span className="flex items-center text-indigo-600 font-bold text-sm">
                      <FaRupeeSign size={11} />
                      {(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Bill breakdown */}
              <div className="mt-5 pt-4 border-t border-indigo-200/60 space-y-1.5">
                <div className="bill-row">
                  <span className="text-slate-600 font-medium">Subtotal</span>
                  <span className="font-bold text-slate-800">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="bill-row">
                  <span className="text-slate-600 font-medium">Shipping</span>
                  <span className="font-bold text-slate-800">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="bill-row">
                  <span className="text-slate-600 font-medium">Tax</span>
                  <span className="font-bold text-slate-800">₹{tax.toFixed(2)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="bill-row">
                    <span className="text-red-600 font-medium">Coupon ({couponCode})</span>
                    <span className="font-bold text-red-600">-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-indigo-200 font-bold text-slate-900">
                  <span>Grand Total</span>
                  <span className="flex items-center text-lg text-indigo-600">
                    <FaRupeeSign size={12} />
                    {grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery address */}
            {order.deliveryAddress?.street && (
              <div className="oh-card p-6 sm:p-7" data-aos="fade-up" data-aos-delay="200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                    <FaMapPin size={15} />
                  </div>
                  <p className="oh-serif text-xl font-bold text-indigo-950">Delivery Address</p>
                </div>
                <div className="bg-indigo-50/50 border border-indigo-200/50 rounded-2xl px-4 py-3">
                  <p className="font-semibold text-indigo-900 text-sm">{order.deliveryAddress.street}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    {order.deliveryAddress.state} - {order.deliveryAddress.postcode} • {order.deliveryAddress.country}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-5">
            <div className="stat-card" data-aos="fade-left" data-aos-delay="100">
              <p className="oh-serif text-lg font-bold text-indigo-950 mb-3">Summary</p>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Items</span>
                  <span className="font-bold text-indigo-950">{order.items.length}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-500">Total Amount</span>
                  <span className="flex items-center font-extrabold text-indigo-600 text-lg">
                    <FaRupeeSign size={13} />
                    {grandTotal.toFixed(2)}
                  </span>
                </div>
                <div className="pt-3 border-t border-indigo-100">
                  <span
                    className="inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full w-full justify-center"
                    style={{
                      background: order.payment.status === "paid" ? "#f0fdf4" : "#fef3c7",
                      color: order.payment.status === "paid" ? "#065f46" : "#b45309",
                      border: `1.5px solid ${order.payment.status === "paid" ? "#6ee7b7" : "#fbbf24"}`,
                    }}
                  >
                    {order.payment.status === "paid" ? <FaCheckCircle size={11} /> : <FaClock size={11} />}
                    {order.payment.status === "paid" ? "Payment Confirmed" : "Payment Pending"}
                  </span>
                </div>
              </div>
            </div>

            <div className="stat-card" data-aos="fade-left" data-aos-delay="150">
              <p className="oh-serif text-lg font-bold text-indigo-950 mb-3">Contact Info</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <FaPhone size={13} style={{ color: "#6366f1" }} />
                  <span className="text-slate-600">{order.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm min-w-0">
                  <FaEnvelope size={13} style={{ color: "#6366f1" }} />
                  <span className="text-slate-600 truncate">{order.email}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3" data-aos="fade-left" data-aos-delay="200">
              <button
                className={`dl-btn w-full justify-center ${downloading ? "loading" : ""}`}
                onClick={() => !downloading && handleDownloadInvoice()}
                disabled={downloading}
              >
                {downloading ? (
                  <div className="dl-spinner relative z-10" />
                ) : (
                  <FaDownload size={12} className="relative z-10" />
                )}
                <span className="relative z-10">{downloading ? "Generating…" : "Download Invoice"}</span>
              </button>

              {canCancel && !isCancelExpired && (
                <button
                  className="cancel-btn w-full justify-center"
                  onClick={() => setShowCancelModal(true)}
                >
                  <FaTimes size={12} />
                  Cancel Order
                </button>
              )}

              {canCancel && isCancelExpired && (
                <div
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold"
                  style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
                >
                  <FaExclamationTriangle size={11} />
                  Cancellation period expired
                </div>
              )}

              {!canCancel && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <p className="text-xs text-amber-800 font-bold">
                    ℹ️ {order.status === "Delivered" ? "Order Delivered" : "Cannot be cancelled"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── CANCEL CONFIRMATION MODAL ── */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        hideCloseButton
        backdrop="blur"
        size="sm"
      >
        <ModalContent className="rounded-2xl bg-white shadow-2xl border border-indigo-100">
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-3 pt-6 pb-2">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <FaExclamationTriangle size={16} style={{ color: "#dc2626" }} />
                </div>
                <h2 className="text-lg font-bold text-indigo-950">Cancel Order?</h2>
              </ModalHeader>

              <ModalBody className="py-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Are you sure you want to cancel this order? This action cannot be undone, and you will
                  receive a refund according to our refund policy.
                </p>
                <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs font-semibold text-amber-800 mb-1">⏰ Refund Timeline</p>
                  <p className="text-xs text-amber-700">
                    Refunds are processed within 5-7 business days after cancellation approval.
                  </p>
                </div>
              </ModalBody>

              <ModalFooter className="gap-2 pb-6">
                <Button
                  className="border-2 border-indigo-200 text-indigo-600 font-bold rounded-xl"
                  variant="bordered"
                  onPress={onClose}
                >
                  Keep Order
                </Button>
                <Button
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg rounded-xl"
                  onPress={handleCancelOrder}
                  disabled={cancelling}
                >
                  {cancelling ? "Cancelling..." : "Yes, Cancel Order"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  :root {
    --ind: #4f46e5;
    --blue: #2563eb;
    --lt: #eef2ff;
  }

  .oh-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .oh-serif { font-family: 'Playfair Display', serif; }

  @keyframes blobDrift {
    0%, 100% { transform: translate(0, 0) scale(1); border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; }
    40% { transform: translate(20px, -18px) scale(1.05); }
    70% { transform: translate(-12px, 12px) scale(0.96); }
  }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .blob1 { animation: blobDrift 10s ease-in-out infinite; }
  .blob2 { animation: blobDrift 13s ease-in-out infinite reverse; }

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

  .item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 0;
    border-bottom: 1px solid rgba(99, 102, 241, 0.08);
    font-size: 13.5px;
    transition: all 0.2s;
  }

  .item-row:last-child { border-bottom: none; }

  .item-row:hover {
    background: rgba(238, 242, 255, 0.6);
    border-radius: 10px;
    padding-left: 8px;
    padding-right: 8px;
  }

  .bill-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #6b7280;
    padding: 5px 0;
  }

  .dl-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 11px 20px;
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

  .dl-btn:active { transform: scale(0.96); }

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

  .expand-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 12.5px;
    font-weight: 700;
    color: white;
    background: linear-gradient(135deg, #4f46e5, #2563eb);
    border: none;
    border-radius: 12px;
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.24s;
  }

  .expand-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.36);
  }

  .cancel-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12.5px;
    font-weight: 700;
    color: white;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    border: none;
    border-radius: 12px;
    padding: 11px 20px;
    cursor: pointer;
    transition: all 0.24s;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  .cancel-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  }

  .cancel-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

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

  .order-id-box {
    background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(37, 99, 235, 0.1));
    border: 1.5px solid rgba(99, 102, 241, 0.2);
    border-radius: 12px;
    padding: 12px;
    font-family: 'Courier New', monospace;
  }

  @media (prefers-reduced-motion: reduce) {
    .blob1, .blob2 { animation: none !important; }
  }
`;

export default SingleOrderPage;