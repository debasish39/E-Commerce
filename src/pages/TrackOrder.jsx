import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  FaSearch, FaBoxOpen, FaCheckCircle, FaTruck,
  FaTimesCircle, FaClock, FaMapMarkerAlt,
  FaRupeeSign, FaShoppingBag, FaEnvelope,
  FaPhone, FaUser, FaCreditCard,
} from "react-icons/fa";
import { MdLocalShipping, MdInventory2 } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";

/* ── order status pipeline ── */
const STATUS_STEPS = [
  { key:"Placed",    label:"Order Placed",   icon:<FaBoxOpen    size={14}/> },
  { key:"Confirmed", label:"Confirmed",      icon:<FaCheckCircle size={14}/> },
  { key:"Shipped",   label:"Shipped",        icon:<MdLocalShipping size={14}/> },
  { key:"Delivered", label:"Delivered",      icon:<FaTruck      size={14}/> },
];

const STATUS_ORDER = ["Placed","Confirmed","Shipped","Delivered"];

const STATUS_CFG = {
  Placed:    { bg:"#fef3c7", border:"#fbbf24", text:"#b45309", dot:"#f59e0b" },
  Confirmed: { bg:"#eff6ff", border:"#93c5fd", text:"#1d4ed8", dot:"#3b82f6" },
  Shipped:   { bg:"#f5f3ff", border:"#a78bfa", text:"#6d28d9", dot:"#8b5cf6" },
  Delivered: { bg:"#f0fdf4", border:"#6ee7b7", text:"#065f46", dot:"#10b981" },
  Cancelled: { bg:"#fff1f2", border:"#fca5a5", text:"#b91c1c", dot:"#ef4444" },
  Processing:{ bg:"#eef2ff", border:"#a5b4fc", text:"#3730a3", dot:"#6366f1" },
};

const TrackOrder = () => {
  const { id }          = useParams();
  const [orderId, setOrderId]         = useState(id || "");
  const [order,  setOrder]            = useState(null);
  const [loading, setLoading]         = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [searched, setSearched]       = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://eshop-backend-y0e7.onrender.com";

  const fetchOrder = async (customId) => {
   if (!customId || customId.trim() === "") {
  toast.error("Order ID required", {
    description: "Enter the Order ID sent to your email.",
  });
  return;
}
    try {
      setLoading(true); setOrder(null); setSearched(true);
      const res  = await fetch(`${BACKEND_URL}/api/order/${customId}`);
      const data = await res.json();
      if (data.success) setOrder(data.order);
      else { setOrder(null); toast.error("Order not found", {
  description: "Please check your Order ID and try again.",
});}
    } catch (e) { console.error(e); toast.error("Failed to fetch order"); setOrder(null); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (id) fetchOrder(id); }, [id]);

  const handleCancel = () => {
    if (!order) return;
    toast("Cancel this order?", {
      description: "This action cannot be undone.",
      action: { label:"Yes, cancel", onClick: async () => {
        try {
          setCancelLoading(true);
          const res  = await fetch(`${BACKEND_URL}/api/order/cancel/${order._id}`, { method:"PUT" });
          const data = await res.json();
          if (data.success) { toast.success("Order cancelled", {
  description: "Your order has been successfully cancelled.",
}); setOrder(data.order); }
          else toast.error(data.message);
        } catch { toast.error("Error cancelling order"); }
        finally { setCancelLoading(false); }
      }},
      cancel: { label:"No" },
    });
  };

  const canCancel = order && !order.cancelled &&
    (new Date() - new Date(order.createdAt)) / (1000*60*60*24) <= 7 &&
    order.status !== "Cancelled" && order.status !== "Delivered";

  const currentStepIdx = STATUS_ORDER.indexOf(order?.status);
  const isCancelled    = order?.status === "Cancelled";

  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString("en-IN",{ day:"numeric",month:"short",year:"numeric" })
    : "—";
  const formatTime = (d) => d
    ? new Date(d).toLocaleTimeString("en-IN",{ hour:"2-digit",minute:"2-digit" })
    : "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        :root{--ind:#4f46e5;--blue:#2563eb;--lt:#eef2ff;}
        .to-root * { font-family:'DM Sans',sans-serif; }
        .to-serif  { font-family:'Playfair Display',serif; }

        @keyframes fadeUp {
          from{opacity:0;transform:translateY(22px);}
          to{opacity:1;transform:translateY(0);}
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
        @keyframes stepIn {
          from{opacity:0;transform:scale(0.7);}
          to{opacity:1;transform:scale(1);}
        }
        @keyframes lineGrow{
          from{width:0%;}
          to{width:100%;}
        }
        @keyframes pulse{
          0%,100%{transform:scale(1);opacity:0.7;}
          50%{transform:scale(1.15);opacity:1;}
        }

        .blob1{animation:blobDrift 10s ease-in-out infinite;}
        .blob2{animation:blobDrift 13s ease-in-out infinite reverse;}
        .page-enter{animation:fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both;}
        .result-enter{animation:fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both;}

        /* search card */
        .search-card {
          background:rgba(255,255,255,0.85);
          backdrop-filter:blur(18px);
          border:1px solid rgba(99,102,241,0.14);
          border-radius:24px;
          box-shadow:0 8px 40px rgba(79,70,229,0.1);
        }

        /* search input */
        .s-input {
          flex:1; min-width:0;
          background:#f8faff;
          border:1px solid rgba(99,102,241,0.18);
          border-radius:13px;
          padding:12px 16px;
          font-size:14px; font-weight:500;
          color:#1e1b4b;
          transition:border-color 0.2s, box-shadow 0.2s;
        }
        .s-input::placeholder{color:#a5b4fc;}
        .s-input:focus{outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.14);background:white;}

        /* search btn */
        .s-btn {
          display:flex;align-items:center;justify-content:center;gap:7px;
          padding:12px 22px;border-radius:13px;
          font-size:14px;font-weight:700;
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          color:white;border:none;cursor:pointer;
          position:relative;overflow:hidden;flex-shrink:0;
          transition:transform 0.2s,box-shadow 0.2s;
        }
        .s-btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(79,70,229,0.38);}
        .s-btn:active{transform:scale(0.96);}
        .s-btn::after{
          content:'';position:absolute;inset:0;border-radius:inherit;
          background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%);
          background-size:200% 100%;
          animation:shimmer 2.4s infinite;
        }

        /* result card */
        .result-card {
          background:rgba(255,255,255,0.88);
          backdrop-filter:blur(18px);
          border:1px solid rgba(99,102,241,0.14);
          border-radius:24px;
          box-shadow:0 12px 50px rgba(79,70,229,0.12);
          overflow:hidden;
        }

        /* status timeline */
        .timeline-wrap { display:flex;align-items:flex-start;gap:0; position:relative; }

        .tl-step {
          flex:1; display:flex;flex-direction:column;align-items:center;
          position:relative; z-index:1;
        }
        .tl-circle {
          width:38px;height:38px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          border:2.5px solid #e5e7eb;
          background:white;
          transition:all 0.4s ease;
          position:relative;z-index:2;
        }
        .tl-circle.done {
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          border-color:transparent;
          box-shadow:0 4px 16px rgba(79,70,229,0.35);
          animation:stepIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .tl-circle.current {
          background:white;
          border-color:#6366f1;
          box-shadow:0 0 0 4px rgba(99,102,241,0.16);
          animation:pulse 2s ease-in-out infinite;
        }
        .tl-circle.cancelled {
          background:#fff1f2; border-color:#fca5a5;
        }

        .tl-line {
          position:absolute;top:19px;left:calc(50% + 19px);
          right:calc(-50% + 19px);
          height:2.5px;
          background:#e5e7eb;
          z-index:0;
          border-radius:2px;
          overflow:hidden;
        }
        .tl-line-fill {
          height:100%;
          background:linear-gradient(90deg,#4f46e5,#2563eb);
          animation:lineGrow 0.6s ease both;
          border-radius:2px;
        }

        .tl-label {
          margin-top:8px;text-align:center;
          font-size:11px;font-weight:600;color:#94a3b8;
          max-width:72px;line-height:1.3;
        }
        .tl-label.done    {color:#4f46e5;}
        .tl-label.current {color:#4f46e5;font-weight:700;}

        /* info grid */
        .info-chip {
          background:#f8faff;
          border:1px solid rgba(99,102,241,0.12);
          border-radius:14px;
          padding:12px 14px;
          transition:border-color 0.2s,background 0.2s;
        }
        .info-chip:hover{background:white;border-color:rgba(99,102,241,0.28);}

        /* item row */
        .item-row {
          display:flex;align-items:center;justify-content:space-between;
          padding:10px 0;border-bottom:1px solid rgba(99,102,241,0.07);
          font-size:13px;
        }
        .item-row:last-child{border-bottom:none;}

        /* cancel btn */
        .cancel-btn {
          display:inline-flex;align-items:center;gap:7px;
          padding:11px 24px;border-radius:13px;
          font-size:13px;font-weight:700;
          background:linear-gradient(135deg,#ef4444,#f43f5e);
          color:white;border:none;cursor:pointer;
          transition:transform 0.2s,box-shadow 0.2s;
        }
        .cancel-btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(239,68,68,0.35);}
        .cancel-btn:disabled{opacity:0.6;cursor:not-allowed;transform:none;}

        /* spinner */
        .spinner{
          width:16px;height:16px;
          border:2.5px solid rgba(255,255,255,0.3);
          border-top-color:white;
          border-radius:50%;
          animation:spin 0.7s linear infinite;
        }

        /* address box */
        .addr-box {
          background:#f8faff;
          border:1px solid rgba(99,102,241,0.12);
          border-radius:14px;
          padding:14px 16px;
        }
      `}</style>

      <div className="to-root min-h-screen relative overflow-x-hidden"
        style={{ background:"linear-gradient(135deg,#eef2ff 0%,#f0f4ff 40%,#ffffff 100%)" }}>

        {/* blobs */}
        <div className="blob1 pointer-events-none fixed -top-32 -left-32 w-96 h-96 opacity-25 blur-3xl"
          style={{ background:"radial-gradient(circle,#c7d2fe,transparent)" }}/>
        <div className="blob2 pointer-events-none fixed -bottom-24 -right-24 w-80 h-80 opacity-20 blur-3xl"
          style={{ background:"radial-gradient(circle,#bfdbfe,transparent)" }}/>
        <div className="pointer-events-none fixed inset-0 opacity-[0.025]"
          style={{ backgroundImage:"radial-gradient(circle,#4f46e5 1px,transparent 1px)", backgroundSize:"28px 28px" }}/>

        <div className="relative z-10 max-w-2xl mx-auto px-1 sm:px-5 py-6 sm:py-12 flex flex-col items-center">

          {/* ── HEADER ── */}
          <div className="page-enter text-center mb-3 w-full">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-indigo-100 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-500 tracking-widest uppercase mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block"/>
              Order Tracking
            </div>
            <h1 className="to-serif text-4xl sm:text-5xl font-bold text-indigo-950 leading-tight mb-1">
              Track Your Order
            </h1>
            <p className="text-slate-400 text-sm font-normal max-w-xs mx-auto">
              Enter your order ID to get real-time shipping updates
            </p>
          </div>

          {/* ── SEARCH CARD ── */}
          <div className="page-enter search-card w-full p-6 mb-6">
            <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">
              Order ID
            </p>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="e.g. 683a12b4c9e..."
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                onKeyDown={e => e.key==="Enter" && fetchOrder(orderId)}
                className="s-input"
              />
              <button className="s-btn" onClick={() => fetchOrder(orderId)}>
                {loading
                  ? <div className="spinner relative z-10"/>
                  : <FaSearch size={18} className="relative z-10"/>}
                <span className="relative z-10 hidden sm:inline">{loading?"Searching…":"Track"}</span>
              </button>
            </div>
          </div>

          {/* ── NOT FOUND ── */}
          {!loading && searched && !order && (
            <div className="result-enter text-center py-10">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-3">
                <FaTimesCircle size={22} style={{ color:"#ef4444" }}/>
              </div>
              <p className="font-bold text-slate-700 mb-1">Order Not Found</p>
              <p className="text-xs text-slate-400">Double-check your Order ID and try again.</p>
            </div>
          )}

          {/* ── ORDER RESULT ── */}
          {order && (
            <div className="result-enter result-card w-full">

              {/* top accent */}
              <div className="h-1.5 w-full"
                style={{ background:`linear-gradient(90deg,${isCancelled?"#ef4444":STATUS_CFG[order.status]?.dot||"#6366f1"},rgba(99,102,241,0.3))` }}/>

              <div className="p-6 sm:p-7 space-y-6">

                {/* ── TOP ROW ── */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-1">Order ID</p>
                    <p className="font-mono text-sm font-bold text-indigo-950 break-all">{order._id}</p>
                    <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <FaClock size={10}/>
                      {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full flex-shrink-0"
                    style={{
                      background:STATUS_CFG[order.status]?.bg||"#eef2ff",
                      color:STATUS_CFG[order.status]?.text||"#3730a3",
                      border:`1px solid ${STATUS_CFG[order.status]?.border||"#a5b4fc"}`,
                    }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background:STATUS_CFG[order.status]?.dot||"#6366f1" }}/>
                    {order.status}
                  </span>
                </div>

                {/* ── STATUS TIMELINE ── */}
                {!isCancelled && (
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase mb-5">Shipment Progress</p>
                    <div className="timeline-wrap px-2">
                      {STATUS_STEPS.map((step, i) => {
                        const isDone    = currentStepIdx > i;
                        const isCurrent = currentStepIdx === i;
                        const isLast    = i === STATUS_STEPS.length - 1;

                        return (
                          <div key={step.key} className="tl-step">
                            {/* connector line */}
                            {!isLast && (
                              <div className="tl-line">
                                {isDone && <div className="tl-line-fill" style={{ animationDelay:`${i*0.15}s` }}/>}
                              </div>
                            )}

                            {/* circle */}
                            <div className={`tl-circle ${isDone?"done":isCurrent?"current":""}`}
                              style={isDone ? { animationDelay:`${i*0.12}s` } : {}}>
                              {isDone
                                ? <FaCheckCircle size={14} color="white"/>
                                : <span style={{ color:isCurrent?"#6366f1":"#cbd5e1" }}>{step.icon}</span>}
                            </div>

                            {/* label */}
                            <p className={`tl-label ${isDone?"done":isCurrent?"current":""}`}>
                              {step.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isCancelled && (
                  <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4">
                    <FaTimesCircle size={20} style={{ color:"#ef4444" }}/>
                    <div>
                      <p className="font-bold text-rose-700 text-sm">Order Cancelled</p>
                      <p className="text-xs text-rose-400">This order has been cancelled and will not be delivered.</p>
                    </div>
                  </div>
                )}

                {/* ── INFO GRID ── */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon:<FaUser size={12} style={{ color:"#6366f1" }}/>,    label:"Customer",  value:order.user },
                    { icon:<FaEnvelope size={12} style={{ color:"#2563eb" }}/>, label:"Email",     value:order.email },
                    { icon:<FaPhone size={12} style={{ color:"#10b981" }}/>,    label:"Phone",     value:order.phone },
                    { icon:<FaCreditCard size={12} style={{ color:"#8b5cf6" }}/>, label:"Payment",
                      value:`${order.paymentMethod} · ${order.paymentStatus}` },
                  ].map(({ icon,label,value }) => (
                    <div key={label} className="info-chip">
                      <div className="flex items-center gap-1.5 mb-1">{icon}<span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">{label}</span></div>
                      <p className="text-sm font-semibold text-slate-800 truncate">{value||"—"}</p>
                    </div>
                  ))}
                </div>

                {/* ── TOTAL ── */}
                <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl px-5 py-4 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage:"radial-gradient(circle,white 1px,transparent 1px)", backgroundSize:"14px 14px" }}/>
                  <div className="relative">
                    <p className="text-indigo-200 text-[10px] font-bold tracking-widest uppercase mb-0.5">Order Total</p>
                    <p className="text-white/60 text-xs">Incl. taxes & handling</p>
                  </div>
                  <p className="relative to-serif text-3xl font-extrabold text-white flex items-baseline gap-0.5">
                    <span style={{ fontSize:18, marginBottom:3 }}><FaRupeeSign /></span>{order.total?.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* ── DELIVERY ADDRESS ── */}
                {order.deliveryAddress && (
                  <div className="addr-box">
                    <div className="flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt size={13} style={{ color:"#6366f1" }}/>
                      <p className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">Delivery Address</p>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {order.deliveryAddress.street}<br/>
                      {order.deliveryAddress.state}{order.deliveryAddress.postcode ? ` - ${order.deliveryAddress.postcode}` : ""}<br/>
                      {order.deliveryAddress.country}
                    </p>
                  </div>
                )}

                {/* ── ORDER ITEMS ── */}
                {order.items?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase mb-3">
                      Items ({order.items.length})
                    </p>
                    <div className="bg-white/60 border border-indigo-100 rounded-2xl px-4 py-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="item-row">
                          <span className="flex items-center gap-2 text-slate-700 font-medium">
                            <span className="w-5 h-5 rounded-md bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-400 flex-shrink-0">{i+1}</span>
                            <span className="line-clamp-1">{item.title}</span>
                            <span className="text-slate-400 text-xs font-normal flex-shrink-0">×{item.quantity}</span>
                          </span>
                          <span className="flex items-center font-bold text-indigo-600 text-sm flex-shrink-0 ml-3">
                            <FaRupeeSign size={10}/>{(item.price*item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── CANCEL ── */}
                <div className="flex justify-center pt-2">
                  {canCancel ? (
                    <button className="cancel-btn" onClick={handleCancel} disabled={cancelLoading}>
                      {cancelLoading
                        ? <><div className="spinner"/> Cancelling…</>
                        : <><FaTimesCircle size={13}/> Cancel Order</>}
                    </button>
                  ) : !isCancelled ? (
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <FaClock size={10}/> Cancellation window has passed (7 days)
                    </p>
                  ) : null}
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TrackOrder;