import React, { useState } from "react";
import { useWishlist } from "../context/wishlistContext";
import { FaTrash, FaEye, FaHeart, FaRegHeart, FaRupeeSign } from "react-icons/fa";
import { Link } from "react-router-dom";
import { HiSparkles } from "react-icons/hi";
import { MdFavoriteBorder } from "react-icons/md";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const [modalType, setModalType]     = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [hoveredId, setHoveredId]     = useState(null);

  const handleRemoveItem = (id) => { setSelectedItemId(id); setModalType("remove"); };
  const confirmRemoveItem = () => { removeFromWishlist(selectedItemId); setModalType(null); setSelectedItemId(null); };
  const confirmClearWishlist = () => { clearWishlist(); setModalType(null); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        :root {
          --w-ind:  #4f46e5;
          --w-blue: #2563eb;
          --w-lt:   #eef2ff;
          --w-bdr:  rgba(99,102,241,0.14);
        }

        .wl-root * { font-family:'DM Sans',sans-serif; }
        .wl-serif  { font-family:'Playfair Display',serif; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes cardIn {
          from { opacity:0; transform:translateY(16px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes blobDrift {
          0%,100% { transform:translate(0,0) scale(1); border-radius:60% 40% 55% 45%/50% 60% 40% 50%; }
          40%      { transform:translate(20px,-18px) scale(1.05); }
          70%      { transform:translate(-12px,12px) scale(0.96); }
        }
        @keyframes heartBeat {
          0%,100% { transform:scale(1); }
          30%     { transform:scale(1.3); }
          60%     { transform:scale(0.9); }
        }
        @keyframes shimmer {
          0%   { background-position:-200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes overlayIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes modalPop {
          from { opacity:0; transform:scale(0.92) translateY(12px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }

        .page-enter { animation:fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .card-enter  { animation:cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .card-enter:nth-child(1){animation-delay:0.04s}
        .card-enter:nth-child(2){animation-delay:0.09s}
        .card-enter:nth-child(3){animation-delay:0.14s}
        .card-enter:nth-child(4){animation-delay:0.19s}
        .card-enter:nth-child(5){animation-delay:0.24s}
        .card-enter:nth-child(6){animation-delay:0.29s}
        .card-enter:nth-child(7){animation-delay:0.34s}
        .card-enter:nth-child(8){animation-delay:0.39s}

        .blob1 { animation:blobDrift 10s ease-in-out infinite; }
        .blob2 { animation:blobDrift 13s ease-in-out infinite reverse; }
        .heart-beat { animation:heartBeat 0.6s ease both; }

        /* wishlist card */
        .wl-card {
          background:rgba(255,255,255,0.85);
          backdrop-filter:blur(16px);
          border:1px solid rgba(99,102,241,0.12);
          border-radius:22px;
          overflow:hidden;
          transition:transform 0.3s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.3s ease, border-color 0.25s;
          cursor:pointer;
        }
        .wl-card:hover {
          transform:translateY(-7px) scale(1.015);
          box-shadow:0 24px 56px rgba(79,70,229,0.18), 0 6px 20px rgba(0,0,0,0.06);
          border-color:rgba(99,102,241,0.3);
        }
        .wl-card:hover .wl-img { transform:scale(1.08); }
        .wl-card:hover .wl-overlay { opacity:1; }
        .wl-card:hover .wl-action-btns { transform:translateY(0); opacity:1; }

        .wl-img {
          width:100%; height:100%; object-fit:cover;
          transition:transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .wl-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to bottom, rgba(79,70,229,0.1) 0%, rgba(10,10,30,0.65) 100%);
          opacity:0;
          transition:opacity 0.3s ease;
          display:flex; flex-direction:column;
          align-items:center; justify-content:flex-end;
          padding:16px;
        }
        .wl-action-btns {
          display:flex; gap:8px;
          transform:translateY(10px);
          opacity:0;
          transition:transform 0.3s ease 0.05s, opacity 0.3s ease 0.05s;
          width:100%;
        }

        .wl-btn-view {
          flex:1; display:flex; align-items:center; justify-content:center; gap:6px;
          padding:9px 0; border-radius:12px;
          background:rgba(255,255,255,0.9); color:#1e1b4b;
          font-size:13px; font-weight:700;
          border:none; cursor:pointer;
          transition:background 0.2s, transform 0.18s;
        }
        .wl-btn-view:hover { background:white; transform:scale(1.04); }

        .wl-btn-remove {
          flex:1; display:flex; align-items:center; justify-content:center; gap:6px;
          padding:9px 0; border-radius:12px;
          background:linear-gradient(135deg,#ef4444,#f43f5e); color:white;
          font-size:13px; font-weight:700;
          border:none; cursor:pointer;
          transition:filter 0.2s, transform 0.18s;
        }
        .wl-btn-remove:hover { filter:brightness(1.1); transform:scale(1.04); }

        /* price badge */
        .price-badge {
          position:absolute; top:12px; left:12px;
          background:linear-gradient(135deg,var(--w-ind),var(--w-blue));
          color:white; font-weight:700; font-size:13px;
          padding:4px 12px; border-radius:999px;
          box-shadow:0 4px 14px rgba(79,70,229,0.4);
        }

        /* heart badge */
        .heart-badge {
          position:absolute; top:12px; right:12px;
          width:32px; height:32px; border-radius:50%;
          background:rgba(255,255,255,0.85);
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 2px 8px rgba(0,0,0,0.1);
        }

        /* primary btn */
        .btn-primary {
          background:linear-gradient(135deg,var(--w-ind),var(--w-blue));
          color:white; font-weight:700;
          border-radius:14px;
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          position:relative; overflow:hidden;
          transition:transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(79,70,229,0.38); }
        .btn-primary::after {
          content:''; position:absolute; inset:0; border-radius:inherit;
          background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%);
          background-size:200% 100%;
          animation:shimmer 2.4s infinite;
        }

        /* clear btn */
        .btn-clear {
          background:rgba(239,68,68,0.07);
          border:1px solid rgba(239,68,68,0.2);
          color:#ef4444; font-weight:600;
          border-radius:12px;
          display:inline-flex; align-items:center; gap:6px;
          transition:all 0.2s;
        }
        .btn-clear:hover { background:rgba(239,68,68,0.12); border-color:rgba(239,68,68,0.35); transform:translateY(-1px); }

        /* modal */
        .modal-overlay { animation:overlayIn 0.25s ease both; }
        .modal-card { animation:modalPop 0.35s cubic-bezier(0.22,1,0.36,1) both; }

        .modal-btn-cancel {
          flex:1; padding:10px 0; border-radius:12px; font-weight:600; font-size:13px;
          background:#f0f4ff; border:1px solid rgba(99,102,241,0.2); color:var(--w-ind);
          transition:all 0.2s; cursor:pointer;
        }
        .modal-btn-cancel:hover { background:#e0e7ff; }

        .modal-btn-danger {
          flex:1; padding:10px 0; border-radius:12px; font-weight:700; font-size:13px;
          background:linear-gradient(135deg,#ef4444,#f43f5e); color:white;
          border:none; cursor:pointer;
          transition:filter 0.2s, transform 0.18s;
        }
        .modal-btn-danger:hover { filter:brightness(1.08); transform:translateY(-1px); }

        /* count badge */
        .count-badge {
          background:rgba(99,102,241,0.1);
          border:1px solid rgba(99,102,241,0.2);
          color:var(--w-ind);
          font-size:11px; font-weight:700;
          padding:2px 10px; border-radius:999px;
        }

        /* empty state */
        .empty-icon {
          width:80px; height:80px; border-radius:50%;
          background:linear-gradient(135deg,#eef2ff,#e0e7ff);
          border:2px solid rgba(99,102,241,0.15);
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 8px 24px rgba(99,102,241,0.15);
        }
      `}</style>

      <div className="wl-root min-h-screen relative overflow-x-hidden"
        style={{ background:"linear-gradient(135deg,#eef2ff 0%,#f0f4ff 40%,#ffffff 100%)" }}>

        {/* Blobs */}
        <div className="blob1 pointer-events-none fixed -top-32 -left-32 w-96 h-96 opacity-25 blur-3xl"
          style={{ background:"radial-gradient(circle,#c7d2fe,transparent)" }}/>
        <div className="blob2 pointer-events-none fixed -bottom-24 -right-24 w-80 h-80 opacity-20 blur-3xl"
          style={{ background:"radial-gradient(circle,#bfdbfe,transparent)" }}/>
        <div className="pointer-events-none fixed inset-0 opacity-[0.025]"
          style={{ backgroundImage:"radial-gradient(circle,#4f46e5 1px,transparent 1px)", backgroundSize:"28px 28px" }}/>

        <div className="relative z-10 max-w-7xl mx-auto px-5 py-12">

          {/* ── EMPTY STATE ── */}
          {!wishlist.length ? (
            <div className="page-enter flex flex-col items-center justify-center min-h-[70vh] text-center">
              <div className="empty-icon mb-6">
                <FaRegHeart size={32} style={{ color:"#6366f1" }}/>
              </div>
              <h2 className="wl-serif text-3xl sm:text-4xl font-bold text-indigo-950 mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-slate-500 mb-7 max-w-sm text-sm leading-relaxed">
                Save products you love and revisit them any time. Start exploring!
              </p>
              <Link to="/products" className="btn-primary px-8 py-3 text-sm">
                <HiSparkles size={15}/><span className="relative z-10">Browse Products</span>
              </Link>
              <p className="text-xs text-slate-400 mt-4">🛡️ Your wishlist is saved securely</p>
            </div>
          ) : (

            <>
              {/* ── HEADER ── */}
              <div className="page-enter flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-indigo-100 rounded-full px-3 py-1 text-xs font-semibold text-indigo-500 tracking-widest uppercase mb-3 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block"/>
                    My Wishlist
                  </div>
                  <h1 className="wl-serif text-4xl sm:text-5xl font-bold text-indigo-950 leading-tight flex items-center gap-3">
                    Saved Items
                    <span className="count-badge">{wishlist.length}</span>
                  </h1>
                  <p className="text-slate-400 text-sm mt-1 font-normal">
                    Products you've saved for later
                  </p>
                </div>

                <button onClick={() => setModalType("clear")} className="btn-clear px-5 py-2.5 text-sm self-start sm:self-auto">
                  <FaTrash size={12}/> Clear All
                </button>
              </div>

              {/* ── GRID ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((item) => (
                  <div key={item.productId} className="card-enter wl-card"
                    onMouseEnter={() => setHoveredId(item.productId)}
                    onMouseLeave={() => setHoveredId(null)}>

                    {/* Image */}
                    <div className="relative h-56 overflow-hidden bg-indigo-50">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="wl-img"
                        onError={e => e.target.src="https://via.placeholder.com/300"}
                      />

                      {/* hover overlay */}
                      {/* <div className="wl-overlay">
                        <div className="wl-action-btns">
                          <Link to={`/products/${item.productId}`}
                            onClick={e => e.stopPropagation()}
                            className="wl-btn-view">
                            <FaEye size={13}/> View
                          </Link>
                          <button className="wl-btn-remove"
                            onClick={e => { e.stopPropagation(); handleRemoveItem(item.productId); }}>
                            <FaTrash size={12}/> Remove
                          </button>
                        </div>
                      </div> */}

                      {/* Price badge */}
                      <div className="price-badge flex items-center"><FaRupeeSign />{item.price}</div>

                      {/* Heart badge */}
                      <div className="heart-badge">
                        <FaHeart size={13} style={{ color:"#f43f5e", filter:"drop-shadow(0 1px 3px rgba(244,63,94,0.4))" }}
                          className={hoveredId === item.productId ? "heart-beat" : ""}/>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <Link to={`/products/${item.productId}`}
                        className="block font-bold text-sm text-indigo-950 line-clamp-2 leading-snug hover:text-indigo-600 transition-colors mb-1.5">
                        {item.title}
                      </Link>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {item.description?.slice(0, 72) || "No description available"}…
                      </p>

                      {/* bottom row */}
                      <div className="flex items-center justify-between gap-2">
                        <Link to={`/products/${item.productId}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors">
                          <FaEye size={11}/> View
                        </Link>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-colors">
                          <FaTrash size={11}/> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ══ REMOVE MODAL ══ */}
        {modalType === "remove" && (
          <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background:"rgba(30,27,75,0.45)", backdropFilter:"blur(10px)" }}
            onClick={() => setModalType(null)}>
            <div className="modal-card bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="h-1 bg-gradient-to-r from-rose-400 to-red-500"/>
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-3">
                  <FaTrash size={16} style={{ color:"#ef4444" }}/>
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Remove from Wishlist?</h3>
                <p className="text-slate-400 text-xs mb-5">This product will be removed permanently from your wishlist.</p>
                <div className="flex gap-2">
                  <button className="modal-btn-cancel" onClick={() => setModalType(null)}>Cancel</button>
                  <button className="modal-btn-danger" onClick={confirmRemoveItem}>Remove</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ CLEAR MODAL ══ */}
        {modalType === "clear" && (
          <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background:"rgba(30,27,75,0.45)", backdropFilter:"blur(10px)" }}
            onClick={() => setModalType(null)}>
            <div className="modal-card bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="h-1 bg-gradient-to-r from-red-400 to-rose-500"/>
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-3">
                  <FaHeart size={16} style={{ color:"#ef4444" }}/>
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Clear Entire Wishlist?</h3>
                <p className="text-slate-400 text-xs mb-2">All <span className="font-semibold text-slate-600">{wishlist.length} saved item{wishlist.length!==1?"s":""}</span> will be removed permanently.</p>
                <p className="text-xs text-rose-400 mb-5">This action cannot be undone.</p>
                <div className="flex gap-2">
                  <button className="modal-btn-cancel" onClick={() => setModalType(null)}>Cancel</button>
                  <button className="modal-btn-danger" onClick={confirmClearWishlist}>Clear All</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}