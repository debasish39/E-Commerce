import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import Logo from "../assets/logo.png";
import {
  FaDownload, FaBoxOpen, FaCheckCircle, FaTruck,
  FaShoppingBag, FaRupeeSign, FaClock, FaReceipt,
  FaChevronDown, FaChevronUp,
} from "react-icons/fa";
import { MdPayments, MdLocalShipping } from "react-icons/md";
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
import { FaTimes } from "react-icons/fa";
import { FaFilter, FaUserCircle } from "react-icons/fa";
/* ── status config ── */
const STATUS_CFG = {
  Placed:    { bg:"#fef3c7", border:"#fbbf24", text:"#b45309", icon:<FaReceipt   size={11}/>, dot:"#f59e0b" },
  Confirmed: { bg:"#eff6ff", border:"#93c5fd", text:"#1d4ed8", icon:<FaCheckCircle size={11}/>, dot:"#3b82f6" },
  Shipped:   { bg:"#f5f3ff", border:"#a78bfa", text:"#6d28d9", icon:<FaTruck      size={11}/>, dot:"#8b5cf6" },
  Delivered: { bg:"#f0fdf4", border:"#6ee7b7", text:"#065f46", icon:<FaCheckCircle size={11}/>, dot:"#10b981" },
  Processing:{ bg:"#eef2ff", border:"#a5b4fc", text:"#3730a3", icon:<BsBoxSeam    size={11}/>, dot:"#6366f1" },
};

const OrderHistory = () => {
  const { user }                    = useUser();
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [expanded, setExpanded]     = useState({});
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

      console.log(data);

      if (data.success) {

        setOrders(
          data.orders || []
        );

      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  fetchOrders();

}, [user]);

  const toggleExpand = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const generateInvoice = (order) => {
    setDownloading(p => ({ ...p, [order._id]: true }));
    try {
      const doc       = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight= doc.internal.pageSize.getHeight();
      const margin    = 15;
      const centerX   = pageWidth / 2;
      const primary   = [59, 130, 246];
      const secondary = [99, 102, 241];

      /* header */
      doc.setFillColor(...primary);
      doc.rect(0, 0, pageWidth, 40, "F");
      doc.setTextColor(255, 255, 255);
      try { doc.addImage(Logo, "PNG", pageWidth - 45, 5, 30, 30); } catch {}
      doc.setFont("helvetica","bold"); doc.setFontSize(20);
      doc.text("EShop", margin, 20);
      doc.setFont("helvetica","normal"); doc.setFontSize(10);
      doc.text("https://eshop.debasish.xyz", margin, 28);
      doc.text("eshopcustomerinfo@gmail.com", margin, 34);

      /* invoice info */
      doc.setTextColor(0,0,0);
      const fd = order.createdAt
        ? new Date(order.createdAt).toLocaleString("en-IN",{ day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit" })
        : "N/A";
      doc.setFont("helvetica","bold"); doc.setFontSize(16);
      doc.text("INVOICE", margin, 55);
      doc.setFont("helvetica","normal"); doc.setFontSize(11);
      doc.text(`Invoice No: INV-${order._id.slice(-6)}`, pageWidth-margin, 55, { align:"right" });
      doc.text(`Date: ${fd}`, pageWidth-margin, 62, { align:"right" });
      doc.setFontSize(10);
      doc.setTextColor(...(order.paymentMethod==="COD" ? [202,138,4] : [34,197,94]));
      doc.text(`Payment: ${order.paymentMethod||"N/A"}`, pageWidth-margin, 68, { align:"right" });
      doc.setTextColor(0,0,0);

      /* bill to */
      const customerInfo = [
        order.user||"Guest", order.deliveryAddress?.street||"",
        `${order.deliveryAddress?.state||""} ${order.deliveryAddress?.postcode||""}`,
        order.deliveryAddress?.country||"", `Phone: ${order.phone||""}`,
        `Email: ${order.email||""}`,
      ];
      doc.setFillColor(245,247,250);
      doc.roundedRect(margin,70,pageWidth-margin*2,40,3,3,"F");
      doc.setFont("helvetica","bold"); doc.text("Bill To",margin+5,78);
      doc.setFont("helvetica","normal");
      let infoY=85; customerInfo.forEach(l=>{ doc.text(l,margin+5,infoY); infoY+=6; });

      /* table */
      let tableY=120;
      const colX={ item:margin+5, qty:pageWidth/2-25, price:pageWidth/2+5, total:pageWidth-margin-25 };
      doc.setFillColor(...primary); doc.setTextColor(255,255,255);
      doc.roundedRect(margin,tableY-6,pageWidth-margin*2,10,2,2,"F");
      doc.setFont("helvetica","bold");
      doc.text("Item",colX.item,tableY); doc.text("Qty",colX.qty,tableY);
      doc.text("Price",colX.price,tableY); doc.text("Total",colX.total,tableY);
      tableY+=10; doc.setTextColor(0,0,0); doc.setFont("helvetica","normal");
      order.items.forEach((item,i) => {
        if (tableY>pageHeight-60) { doc.addPage(); tableY=30; }
        if (i%2===0) { doc.setFillColor(248,250,252); doc.rect(margin,tableY-5,pageWidth-margin*2,8,"F"); }
        doc.text(`${i+1}. ${item.title}`,colX.item,tableY);
        doc.text(`${item.quantity}`,colX.qty,tableY);
        doc.text(`₹${item.price.toFixed(2)}`,colX.price,tableY);
        doc.text(`₹${(item.price*item.quantity).toFixed(2)}`,colX.total,tableY);
        tableY+=8;
      });

      /* total box */
      const subtotal = order.items.reduce((s,i)=>s+i.price*i.quantity,0);
      tableY+=10;
      doc.setFillColor(240,245,255);
      doc.roundedRect(pageWidth-90,tableY-5,75,35,3,3,"F");
      doc.setFont("helvetica","bold");
      doc.text("Subtotal:",pageWidth-85,tableY); doc.text(`₹${subtotal.toFixed(2)}`,pageWidth-20,tableY,{align:"right"});
      tableY+=7;
      doc.text("Handling:",pageWidth-85,tableY); doc.text("₹5.00",pageWidth-20,tableY,{align:"right"});
      tableY+=10;
      doc.setTextColor(...secondary); doc.setFontSize(13);
      doc.text("Total:",pageWidth-85,tableY); doc.text(`₹${(subtotal+5).toFixed(2)}`,pageWidth-20,tableY,{align:"right"});

      /* footer */
      doc.setFontSize(10); doc.setTextColor(120,120,120);
      doc.text("Thank you for shopping with EShop ❤️",centerX,pageHeight-25,{align:"center"});
      doc.text("For support:eshopcustomerinfo@gmail.com",centerX,pageHeight-18,{align:"center"});
      doc.text("Generated automatically by EShop © 2026",centerX,pageHeight-12,{align:"center"});
      doc.save(`EShop-Invoice-${order._id}.pdf`);
    } finally {
      setTimeout(() => setDownloading(p => ({ ...p, [order._id]: false })), 1000);
    }
  };

  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString("en-IN",{ day:"numeric",month:"short",year:"numeric" })
    : "—";
  const formatTime = (d) => d
    ? new Date(d).toLocaleTimeString("en-IN",{ hour:"2-digit",minute:"2-digit" })
    : "";
const filteredOrders = orders
  .filter((order) => {
    // ✅ STATUS
    if (statusFilter !== "All" && order.status !== statusFilter) return false;

    // ✅ DATE
    if (dateFilter !== "All") {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const diff = now - orderDate;

      if (dateFilter === "7days" && diff > 7 * 24 * 60 * 60 * 1000) return false;
      if (dateFilter === "30days" && diff > 30 * 24 * 60 * 60 * 1000) return false;
    }

    // ✅ SEARCH (product title)
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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        :root{--ind:#4f46e5;--blue:#2563eb;--lt:#eef2ff;}
        .oh-root * { font-family:'DM Sans',sans-serif; }
        .oh-serif  { font-family:'Playfair Display',serif; }

        @keyframes fadeUp {
          from{opacity:0;transform:translateY(22px);}
          to{opacity:1;transform:translateY(0);}
        }
        @keyframes slideIn {
          from{opacity:0;transform:translateX(-16px);}
          to{opacity:1;transform:translateX(0);}
        }
        @keyframes blobDrift {
          0%,100%{transform:translate(0,0) scale(1);border-radius:60% 40% 55% 45%/50% 60% 40% 50%;}
          40%{transform:translate(20px,-18px) scale(1.05);}
          70%{transform:translate(-12px,12px) scale(0.96);}
        }
        @keyframes shimmer {
          0%{background-position:-200% center;}
          100%{background-position:200% center;}
        }
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes expandIn{
          from{opacity:0;transform:translateY(-6px);}
          to{opacity:1;transform:translateY(0);}
        }
        @keyframes skeletonPulse {
          0%,100%{opacity:1;}50%{opacity:0.4;}
        }

        .blob1{animation:blobDrift 10s ease-in-out infinite;}
        .blob2{animation:blobDrift 13s ease-in-out infinite reverse;}
        .page-enter{animation:fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both;}
        .card-enter{animation:slideIn 0.5s cubic-bezier(0.22,1,0.36,1) both;}
        .expand-in{animation:expandIn 0.3s cubic-bezier(0.22,1,0.36,1) both;}

        /* order card */
        .oh-card {
          background:rgba(255,255,255,0.88);
          backdrop-filter:blur(14px);
          border:1px solid rgba(99,102,241,0.12);
          border-radius:22px;
          overflow:hidden;
          transition:transform 0.28s cubic-bezier(0.34,1.15,0.64,1), box-shadow 0.28s, border-color 0.25s;
        }
        .oh-card:hover {
          transform:translateY(-3px);
          box-shadow:0 16px 48px rgba(79,70,229,0.14);
          border-color:rgba(99,102,241,0.25);
        }

        /* item row */
        .item-row {
          display:flex;align-items:center;justify-content:space-between;
          padding:9px 0; border-bottom:1px solid rgba(99,102,241,0.07);
          font-size:13px;
          transition:background 0.18s;
        }
        .item-row:last-child{border-bottom:none;}
        .item-row:hover{background:rgba(238,242,255,0.5);border-radius:8px;padding-left:6px;padding-right:6px;}

        /* bill row */
        .bill-row{display:flex;justify-content:space-between;font-size:13px;color:#6b7280;padding:4px 0;}

        /* download btn */
        .dl-btn {
          display:flex;align-items:center;gap:7px;
          padding:9px 20px;border-radius:12px;
          font-size:13px;font-weight:700;
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          background-size:200% 100%;
          color:white;border:none;cursor:pointer;
          position:relative;overflow:hidden;
          transition:transform 0.2s,box-shadow 0.2s;
        }
        .dl-btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(79,70,229,0.38);}
        .dl-btn:active{transform:scale(0.96);}
        .dl-btn::after{
          content:'';position:absolute;inset:0;border-radius:inherit;
          background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%);
          background-size:200% 100%;
          animation:shimmer 2.4s infinite;
        }
        .dl-btn.loading{opacity:0.7;cursor:not-allowed;}

        .dl-spinner{
          width:14px;height:14px;
          border:2px solid rgba(255,255,255,0.3);
          border-top-color:white;
          border-radius:50%;
          animation:spin 0.7s linear infinite;
        }

        /* expand btn */
        .expand-btn{
          display:flex;align-items:center;gap:5px;
          font-size:12px;font-weight:600;
          color:#6366f1;background:rgba(99,102,241,0.08);
          border:1px solid rgba(99,102,241,0.18);
          border-radius:999px;padding:5px 14px;
          cursor:pointer;transition:all 0.2s;
        }
        .expand-btn:hover{background:rgba(99,102,241,0.14);border-color:rgba(99,102,241,0.3);}

        /* skeleton */
        .skel{
          background:linear-gradient(90deg,#e0e7ff 25%,#c7d2fe 50%,#e0e7ff 75%);
          background-size:200% 100%;
          animation:skeletonPulse 1.4s ease-in-out infinite;
          border-radius:10px;
        }

        /* empty */
        .empty-icon{
          width:72px;height:72px;border-radius:50%;
          background:linear-gradient(135deg,#eef2ff,#e0e7ff);
          border:2px solid rgba(99,102,241,0.15);
          display:flex;align-items:center;justify-content:center;
        }

        /* stats bar */
        .stat-card{
          background:rgba(255,255,255,0.8);
          border:1px solid rgba(99,102,241,0.12);
          border-radius:16px;padding:16px 20px;
          transition:border-color 0.2s,box-shadow 0.2s;
        }
        .stat-card:hover{border-color:rgba(99,102,241,0.28);box-shadow:0 4px 16px rgba(99,102,241,0.1);}
      `}</style>

      <div className="oh-root min-h-screen relative overflow-x-hidden"
        style={{ background:"linear-gradient(135deg,#eef2ff 0%,#f0f4ff 40%,#ffffff 100%)" }}>

        {/* blobs */}
        <div className="blob1 pointer-events-none fixed -top-32 -left-32 w-96 h-96 opacity-25 blur-3xl"
          style={{ background:"radial-gradient(circle,#c7d2fe,transparent)" }}/>
        <div className="blob2 pointer-events-none fixed -bottom-24 -right-24 w-80 h-80 opacity-20 blur-3xl"
          style={{ background:"radial-gradient(circle,#bfdbfe,transparent)" }}/>
        <div className="pointer-events-none fixed inset-0 opacity-[0.025]"
          style={{ backgroundImage:"radial-gradient(circle,#4f46e5 1px,transparent 1px)", backgroundSize:"28px 28px" }}/>

        <div className="relative z-10 max-w-4xl mx-auto px-5 py-9">

          {/* ── HEADER ── */}
      <div className="page-enter flex flex-row items-center justify-between gap-4 mb-6">

  {/* LEFT SIDE (Title + subtitle) */}
  <div className="text-left">

    {/* Tag */}
    <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur 
    border border-indigo-100 rounded-full px-3 py-1 text-[10px] font-semibold 
    text-indigo-500 tracking-widest uppercase mb-2 shadow-sm">
      <FaUserCircle size={10} />
      My Account
    </div>

    {/* Title */}
    <h1 className="oh-serif text-xl sm:text-4xl font-bold text-indigo-950 leading-tight">
      Order History
    </h1>

    {/* Subtitle */}
    <p className="text-slate-400 text-xs sm:text-sm mt-1">
      Track and manage all your past purchases
    </p>
  </div>

  {/* RIGHT SIDE (Filter Button) */}
  <div className="flex justify-end">
    <button
      onClick={() => setShowFilterModal(true)}
      className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold 
      rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white 
      shadow-md hover:scale-105 transition"
    >
      <FaFilter size={12} />
      Filters
    </button>
  </div>

</div>

          {/* ── STATS BAR ── */}
          {!loading && orders.length > 0 && (
            <div className="page-enter grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label:"Total Orders",   value:orders.length,
                  icon:<FaBoxOpen  size={16} style={{ color:"#4f46e5" }}/>, bg:"#eef2ff" },
                { label:"Delivered",
                  value:orders.filter(o=>o.status==="Delivered").length,
                  icon:<FaCheckCircle size={16} style={{ color:"#10b981" }}/>, bg:"#f0fdf4" },
                { label:"In Transit",
                  value:orders.filter(o=>o.status==="Shipped").length,
                  icon:<FaTruck size={16} style={{ color:"#8b5cf6" }}/>, bg:"#f5f3ff" },
                { label:"Total Spent",
                  value:`₹${orders.reduce((s,o)=>s+o.total,0).toLocaleString("en-IN")}`,
                  icon:<FaRupeeSign size={15} style={{ color:"#2563eb" }}/>, bg:"#eff6ff" },
              ].map(({ label, value, icon, bg }) => (
                <div key={label} className="stat-card text-center">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2"
                    style={{ background:bg }}>
                    {icon}
                  </div>
                  <p className="text-lg font-extrabold text-indigo-950 leading-none">{value}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── LOADING SKELETONS ── */}
          {loading && (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="oh-card p-6 space-y-3">
                  <div className="flex justify-between">
                    <div className="skel h-5 w-40"/>
                    <div className="skel h-5 w-20"/>
                  </div>
                  <div className="skel h-3 w-28"/>
                  <div className="skel h-px w-full"/>
                  <div className="skel h-3 w-full"/>
                  <div className="skel h-3 w-3/4"/>
                </div>
              ))}
            </div>
          )}

          {/* ── EMPTY ── */}
          {!loading && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center page-enter">
              <div className="empty-icon mb-5">
                <FaShoppingBag size={30} style={{ color:"#6366f1" }}/>
              </div>
              <h2 className="oh-serif text-2xl font-bold text-indigo-950 mb-2">No orders yet</h2>
              <p className="text-slate-400 text-sm max-w-xs">
                Looks like you haven't placed any orders. Start shopping to see them here.
              </p>
            </div>
          )}

          {/* ── ORDER CARDS ── */}
          {!loading && orders.length > 0 && (
            <div className="space-y-4">
              {filteredOrders.map((order, idx) => {
                const subtotal   = order.items.reduce((s,i)=>s+i.price*i.quantity,0);
                const grandTotal = subtotal + 5;
                const isExp      = !!expanded[order._id];
                const isDL       = !!downloading[order._id];
                const statusCfg  = STATUS_CFG[order.status] || STATUS_CFG.Placed;

                return (
                  <div key={order._id}
                    className="oh-card card-enter"
                    style={{ animationDelay:`${idx*0.06}s` }}>

                    {/* top accent line */}
                    <div className="h-1 w-full" style={{ background:`linear-gradient(90deg,${statusCfg.dot},rgba(99,102,241,0.4))` }}/>

                    <div className="p-5 sm:p-6">

                      {/* ── CARD HEADER ── */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

                        <div className="flex items-start gap-3">
                          {/* order icon */}
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background:statusCfg.bg, border:`1px solid ${statusCfg.border}` }}>
                            <span style={{ color:statusCfg.text }}>{statusCfg.icon}</span>
                          </div>
                          <div>
                            <p className="font-bold text-indigo-950 text-sm">{order.user}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="text-xs text-slate-400 font-mono">#{order._id.slice(-8).toUpperCase()}</span>
                              {/* payment badge */}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                order.paymentMethod==="COD"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-green-50 text-green-700 border border-green-200"
                              }`}>
                                <MdPayments size={9} style={{ display:"inline", marginRight:3 }}/>
                                {order.paymentMethod}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                          {/* status badge */}
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                            style={{ background:statusCfg.bg, color:statusCfg.text, border:`1px solid ${statusCfg.border}` }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background:statusCfg.dot }}/>
                            {order.status || "Placed"}
                          </span>
                          {/* date */}
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <FaClock size={10}/>
                            {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* ── DELIVERY ADDRESS ── */}
                      {order.deliveryAddress?.street && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
                          <MdLocalShipping size={14} style={{ color:"#6366f1", flexShrink:0 }}/>
                          {order.deliveryAddress.street}, {order.deliveryAddress.state} {order.deliveryAddress.postcode}
                        </div>
                      )}

                      {/* ── ITEMS PREVIEW (collapsed) ── */}
                      {!isExp && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {order.items.slice(0,3).map((item,i) => (
                            <span key={i} className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg font-medium truncate max-w-[160px]">
                              {item.title} ×{item.quantity}
                            </span>
                          ))}
                          {order.items.length > 3 && (
                            <span className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-600 px-2.5 py-1 rounded-lg font-semibold">
                              +{order.items.length-3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* ── EXPANDED ITEMS ── */}
                      {isExp && (
                        <div className="expand-in mb-4 bg-white/60 border border-indigo-100 rounded-2xl p-4">
                          <p className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase mb-3">Order Items</p>
                          {order.items.map((item, i) => (
                            <div key={i} className="item-row">
                              <span className="text-slate-700 font-medium flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-400 flex-shrink-0">{i+1}</span>
                                <span className="line-clamp-1">{item.title}</span>
                                <span className="text-slate-400 text-xs font-normal flex-shrink-0">× {item.quantity}</span>
                              </span>
                              <span className="flex items-center text-indigo-600 font-bold text-sm flex-shrink-0 ml-4">
                                <FaRupeeSign size={10}/>{(item.price*item.quantity).toFixed(0)}
                              </span>
                            </div>
                          ))}

                          {/* bill breakdown */}
                          <div className="mt-4 pt-3 border-t border-indigo-100 space-y-1">
                            <div className="bill-row"><span>Subtotal</span><span className="font-semibold text-slate-700">₹{subtotal.toFixed(2)}</span></div>
                            <div className="bill-row"><span>Delivery</span><span className="text-green-600 font-semibold text-xs">FREE</span></div>
                            <div className="bill-row"><span>Handling</span><span className="font-semibold text-slate-700">₹5.00</span></div>
                            <div className="flex justify-between pt-2 border-t border-indigo-100">
                              <span className="font-bold text-slate-800">Grand Total</span>
                              <span className="flex items-center font-extrabold text-indigo-600 text-base"><FaRupeeSign size={11}/>{grandTotal.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── FOOTER ROW ── */}
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        {/* total (always visible) */}
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-slate-400 font-medium">Total</span>
                          <span className="flex items-center font-extrabold text-lg text-indigo-600">
                            <FaRupeeSign size={12}/>{grandTotal.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* expand toggle */}
                          <button className="expand-btn" onClick={() => toggleExpand(order._id)}>
                            {isExp ? <FaChevronUp size={10}/> : <FaChevronDown size={10}/>}
                            {isExp ? "Hide Details" : "View Details"}
                          </button>

                          {/* download invoice */}
                          <button
                            className={`dl-btn ${isDL?"loading":""}`}
                            onClick={() => !isDL && generateInvoice(order)}
                            disabled={isDL}>
                            {isDL ? <div className="dl-spinner relative z-10"/> : <FaDownload size={12} className="relative z-10"/>}
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

        </div>
      </div>
   <Modal
  isOpen={showFilterModal}
  onClose={() => setShowFilterModal(false)}
  hideCloseButton
  placement="center"
  backdrop="blur"
  classNames={{
    base: "bg-indigo-300/20 backdrop-blur-sm",
    backdrop: "bg-indigo-900/30 backdrop-blur-md",
  }}
>
  <ModalContent
    className="mx-auto mb-0 mt-auto rounded-t-3xl p-0
    bg-gradient-to-br from-white/90 via-indigo-50/70 to-blue-50/80
    backdrop-blur-2xl border border-indigo-200/30
    shadow-[0_-10px_40px_rgba(79,70,229,0.25)] max-w-md"
  >
    {(onClose) => (
      <>
        {/* HEADER */}
    <ModalHeader className="relative flex items-center justify-center pt-4">

  {/* Handle */}
  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-indigo-200 rounded-full" />

  {/* Title */}
  <h2 className="text-lg font-bold text-indigo-900">
    Filter Orders
  </h2>

  {/* Close Button */}
  <button
    onClick={onClose}
    className="absolute right-4 top-3 w-8 h-8 flex items-center justify-center 
    rounded-full bg-white/70 backdrop-blur border border-indigo-200 
    text-indigo-600 cursor-pointer hover:bg-indigo-100 transition"
  >
    <FaTimes size={12} />
  </button>

</ModalHeader>

        {/* BODY */}
        <ModalBody className="space-y-5 px-5 pb-4">

        
          {/* SEARCH */}
          <div>
            <p className="text-xs font-semibold text-indigo-400 mb-2 uppercase">
              Search Product
            </p>

            <input
              type="text"
              placeholder="Search product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-indigo-200
              bg-white/70 backdrop-blur text-sm outline-none
              focus:ring-2 focus:ring-indigo-400"
            />
          </div>
  {/* STATUS */}
          <div>
            <p className="text-xs font-semibold text-indigo-400 mb-2 uppercase">
              Status
            </p>

            <div className="flex flex-wrap gap-2">
              {["All","Placed","Confirmed","Processing","Shipped","Delivered","Cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition
                    ${
                      statusFilter === status
                        ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow"
                        : "bg-white/70 text-indigo-600 border border-indigo-200"
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* SORT */}
          <div>
            <p className="text-xs font-semibold text-indigo-400 mb-2 uppercase">
              Sort By
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
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full
                    ${
                      sortOption === opt.value
                        ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                        : "bg-white/70 text-indigo-600 border border-indigo-200"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* DATE */}
          <div>
            <p className="text-xs font-semibold text-indigo-400 mb-2 uppercase">
              Date
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
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full
                    ${
                      dateFilter === item.value
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                        : "bg-white/70 text-blue-600 border border-blue-200"
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

        </ModalBody>

        {/* FOOTER */}
        <ModalFooter className="px-5 pb-5">

          <Button
            variant="bordered"
            className="flex-1 border-indigo-200 text-indigo-600"
            onPress={() => {
              setStatusFilter("All");
              setDateFilter("All");
              setSearchQuery("");
              setSortOption("latest");
            }}
          >
            Reset
          </Button>

          <Button
            className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 text-white"
            onPress={onClose}
          >
            Apply
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