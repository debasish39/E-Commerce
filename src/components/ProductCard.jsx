import React, { useState, useRef, useCallback } from "react";
import { IoCartOutline } from "react-icons/io5";
import { FaHeart, FaRupeeSign, FaRegHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/wishlistContext";
import { toast } from "sonner";

export default function ProductCard({ product }) {
  const navigate  = useNavigate();

/* =====================================
   JWT TOKEN
===================================== */

const token =
  localStorage.getItem(
    "token"
  );

/* =====================================
   AUTH STATE
===================================== */

const isSignedIn =
  !!token;

  const { addToCart, cartItem }                          = useCart();
  const { wishlist, addToWishlist, removeFromWishlist }  = useWishlist();
 

  // all images for this product (thumbnail + images array, deduped)
  const allImages = [
    ...(product.thumbnail ? [product.thumbnail] : []),
    ...(product.images    ? product.images.filter(img => img !== product.thumbnail) : []),
  ].filter(Boolean);

  const [activeIdx,  setActiveIdx]  = useState(0);
  const [imgLoaded,  setImgLoaded]  = useState({});   // track per-index
  const [heartAnim,  setHeartAnim]  = useState(false);
  const [hovered,    setHovered]    = useState(false);
  const scrollTimer = useRef(null);

  const isInCart = cartItem.some(i => String(i.productId) === String(product._id));
  const isLiked  = wishlist.some(i => String(i.productId) === String(product._id));

  // ── Auto-advance on hover ────────────────────────
  const startAutoScroll = useCallback(() => {
    if (allImages.length <= 1) return;
    scrollTimer.current = setInterval(() => {
      setActiveIdx(p => (p + 1) % allImages.length);
    }, 1400);
  }, [allImages.length]);

  const stopAutoScroll = useCallback(() => {
    clearInterval(scrollTimer.current);
  }, []);

  const prev = e => {
    e.stopPropagation();
    setActiveIdx(p => (p - 1 + allImages.length) % allImages.length);
  };
  const next = e => {
    e.stopPropagation();
    setActiveIdx(p => (p + 1) % allImages.length);
  };

  // ── Cart / Wishlist ──────────────────────────────
  const handleAddToCart = () => {
    if (!isSignedIn) { toast.error("Please login first"); navigate("/sign-in"); return; }
    if (isInCart)    { navigate("/cart"); return; }
    addToCart(product);
    toast.success("Added to cart 🛒");
  };

  const handleToggleWishlist = e => {
    e.stopPropagation();
    if (!isSignedIn) { toast.error("Please login first"); navigate("/sign-in"); return; }
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 500);
    if (isLiked) { removeFromWishlist(String(product._id)); toast("Removed from wishlist 💔"); }
    else         { addToWishlist(product); toast.success("Added to wishlist ❤️"); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .pc-root { font-family:'Plus Jakarta Sans',sans-serif; }

        /* ── card shell ── */
        .pc-card {
          position:relative;
          background:rgba(255,255,255,0.88);
          backdrop-filter:blur(16px);
          border:1px solid rgba(99,102,241,0.12);
          border-radius:22px; overflow:hidden;
          transition:transform .32s cubic-bezier(.34,1.2,.64,1),
                     box-shadow .28s ease, border-color .25s ease;
          cursor:pointer;
        }
        .pc-card:hover {
          transform:translateY(-7px) scale(1.012);
          box-shadow:0 22px 52px rgba(79,70,229,0.17), 0 5px 18px rgba(0,0,0,0.05);
          border-color:rgba(99,102,241,0.28);
        }

        /* ── image strip (scrolls horizontally, no scrollbar) ── */
        .pc-img-track {
          display:flex;
          will-change:transform;
          transition:transform .42s cubic-bezier(.22,1,.36,1);
        }
        .pc-img-slide {
          flex:0 0 100%; width:100%; height:100%;
          display:flex; align-items:center; justify-content:center;
          background:#f8faff;
        }
        .pc-img {
          width:100%; height:100%; object-fit:contain;
          transition:transform .50s cubic-bezier(.22,1,.36,1), opacity .30s;
        }
        .pc-card:hover .pc-img { transform:scale(1.07); }

        /* ── skeleton ── */
        @keyframes pcSkel { 0%{background-position:-200% center}100%{background-position:200% center} }
        .pc-skel {
          position:absolute; inset:0;
          background:linear-gradient(90deg,#e0e7ff 25%,#c7d2fe 50%,#e0e7ff 75%);
          background-size:200% 100%;
          animation:pcSkel 1.4s ease-in-out infinite;
        }

        /* ── hover overlay ── */
        .pc-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to bottom, transparent 45%, rgba(20,16,60,0.52) 100%);
          opacity:0; transition:opacity .26s;
          display:flex; align-items:flex-end; justify-content:center;
          padding-bottom:13px; z-index:5;
        }
        .pc-card:hover .pc-overlay { opacity:1; }

        .pc-quick-btn {
          display:flex; align-items:center; gap:6px;
          background:rgba(255,255,255,0.92);
          color:#1e1b4b; font-size:11.5px; font-weight:700;
          padding:6px 15px; border-radius:999px;
          border:none; cursor:pointer;
          transform:translateY(9px); opacity:0;
          transition:transform .26s .04s, opacity .26s .04s, background .16s;
          pointer-events:none;
        }
        .pc-card:hover .pc-quick-btn { transform:translateY(0); opacity:1; pointer-events:all; }
        .pc-quick-btn:hover { background:white; }

        /* ── prev / next arrows ── */
        .pc-arrow {
          position:absolute; top:50%; transform:translateY(-50%);
          z-index:8;
          width:28px; height:28px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          background:rgba(255,255,255,0.88);
          border:1px solid rgba(99,102,241,0.18);
          box-shadow:0 2px 10px rgba(0,0,0,0.10);
          cursor:pointer;
          opacity:0; transition:opacity .22s, transform .22s;
        }
        .pc-arrow-left  { left:9px;  }
        .pc-arrow-right { right:9px; }
        .pc-card:hover .pc-arrow { opacity:1; }
        .pc-arrow:hover {
          background:white;
          box-shadow:0 4px 16px rgba(79,70,229,0.22);
          transform:translateY(-50%) scale(1.10);
        }
        .pc-arrow:active { transform:translateY(-50%) scale(0.94); }

        /* ── dot indicators ── */
        .pc-dots {
          position:absolute; bottom:9px; left:50%; transform:translateX(-50%);
          display:flex; gap:5px; z-index:9;
          opacity:0; transition:opacity .22s;
        }
        .pc-card:hover .pc-dots { opacity:1; }
        .pc-dot {
          width:5px; height:5px; border-radius:50%;
          background:rgba(255,255,255,0.50);
          border:none; padding:0; cursor:pointer;
          transition:background .22s, transform .22s, width .22s;
        }
        .pc-dot.active {
          background:white; width:14px; border-radius:3px;
          box-shadow:0 0 7px rgba(255,255,255,0.60);
        }

        /* ── wishlist btn ── */
        .pc-heart {
          position:absolute; top:11px; right:11px; z-index:10;
          width:33px; height:33px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          background:rgba(255,255,255,0.90);
          border:1px solid rgba(99,102,241,0.14);
          box-shadow:0 2px 8px rgba(0,0,0,0.07);
          transition:all .22s; cursor:pointer;
        }
        .pc-heart:hover { transform:scale(1.12); box-shadow:0 4px 16px rgba(244,63,94,0.22); }
        .pc-heart.liked { background:#fff0f3; border-color:rgba(244,63,94,0.25); }
        @keyframes heartBeat {
          0%{transform:scale(1)} 30%{transform:scale(1.4)} 60%{transform:scale(.88)} 100%{transform:scale(1)}
        }
        .heart-beat { animation:heartBeat .45s ease both; }

        /* ── featured badge ── */
        .pc-badge {
          position:absolute; top:11px; left:11px; z-index:10;
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          color:white; font-size:8.5px; font-weight:700;
          padding:3px 9px; border-radius:999px;
          box-shadow:0 3px 10px rgba(79,70,229,0.35);
          letter-spacing:.04em; text-transform:uppercase;
        }

        /* ── image count badge (top-right when not hovered) ── */
        .pc-count-badge {
          position:absolute; bottom:10px; right:10px; z-index:7;
          font-size:9px; font-weight:700; color:rgba(255,255,255,.80);
          background:rgba(15,14,42,.45); border-radius:6px;
          padding:2px 7px; letter-spacing:.04em;
          transition:opacity .22s;
        }
        .pc-card:hover .pc-count-badge { opacity:0; }

        /* ── info section ── */
        .price-text {
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }

        .btn-cart {
          width:100%; display:flex; align-items:center; justify-content:center; gap:7px;
          padding:10px 0; border-radius:13px;
          font-size:13px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif;
          border:none; cursor:pointer; position:relative; overflow:hidden;
          transition:transform .20s, box-shadow .20s;
        }
        .btn-cart.new {
          background:linear-gradient(135deg,#4f46e5,#2563eb); color:white;
        }
        .btn-cart.new:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(79,70,229,.38); }
        .btn-cart.new:active { transform:scale(.96); }
        @keyframes pcShim { 0%{background-position:-200% center}100%{background-position:200% center} }
        .btn-cart.new::after {
          content:''; position:absolute; inset:0; border-radius:inherit;
          background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.18) 50%,transparent 65%);
          background-size:200% 100%; animation:pcShim 2.4s infinite;
        }
        .btn-cart.in-cart {
          background:#f0f4ff; border:1.5px solid rgba(99,102,241,.22); color:#4f46e5;
        }
        .btn-cart.in-cart:hover { background:#e0e7ff; transform:translateY(-1px); }
      `}</style>

      <div
        className="pc-root pc-card"
        data-aos="zoom-in-up"
        onMouseEnter={() => { setHovered(true);  startAutoScroll(); }}
        onMouseLeave={() => { setHovered(false); stopAutoScroll();  }}
      >

        {/* ══ IMAGE ZONE ══ */}
        <div
          className="relative overflow-hidden"
          style={{ height: "clamp(160px,18vw,220px)", background:"#f8faff" }}
          onClick={() => navigate(`/products/${product._id}`)}
        >
          {/* sliding track */}
          <div
            className="pc-img-track"
            style={{
              height:"100%",
              transform:`translateX(-${activeIdx * 100}%)`,
            }}
          >
            {allImages.map((src, i) => (
              <div key={i} className="pc-img-slide">
                {/* skeleton per slide */}
                {!imgLoaded[i] && <div className="pc-skel"/>}
                <img
                  src={src}
                  alt={`${product.title} ${i + 1}`}
                  loading="lazy"
                  className="pc-img"
                  style={{ opacity: imgLoaded[i] ? 1 : 0 }}
                  onLoad={()  => setImgLoaded(p => ({ ...p, [i]: true }))}
                  onError={e  => { e.target.src="https://via.placeholder.com/300x200?text=No+Image"; setImgLoaded(p=>({...p,[i]:true})); }}
                />
              </div>
            ))}
          </div>

          {/* overlay + quick-view */}
          <div className="pc-overlay">
            <button
              className="pc-quick-btn"
              onClick={e => { e.stopPropagation(); navigate(`/products/${product._id}`); }}
            >
              <AiOutlineEye size={13}/> Quick View
            </button>
          </div>

          {/* prev / next (only when >1 image) */}
          {allImages.length > 1 && (
            <>
              <button className="pc-arrow pc-arrow-left"  onClick={prev} aria-label="Previous image">
                <FaChevronLeft  size={10} color="#4f46e5"/>
              </button>
              <button className="pc-arrow pc-arrow-right" onClick={next} aria-label="Next image">
                <FaChevronRight size={10} color="#4f46e5"/>
              </button>

              {/* dot indicators */}
              <div className="pc-dots">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    className={`pc-dot${i === activeIdx ? " active" : ""}`}
                    onClick={e => { e.stopPropagation(); setActiveIdx(i); }}
                    aria-label={`Image ${i+1}`}
                  />
                ))}
              </div>

              {/* static count badge (visible when not hovered) */}
              <div className="pc-count-badge">
                {activeIdx + 1}/{allImages.length}
              </div>
            </>
          )}

          {/* featured badge */}
          <span className="pc-badge">✨ Featured</span>

          {/* wishlist btn */}
          <button
            className={`pc-heart${isLiked ? " liked" : ""}`}
            onClick={handleToggleWishlist}
            aria-label="Toggle wishlist"
          >
            {isLiked
              ? <FaHeart    size={14} className={heartAnim ? "heart-beat" : ""} style={{ color:"#f43f5e" }}/>
              : <FaRegHeart size={14} className={heartAnim ? "heart-beat" : ""} style={{ color:"#94a3b8" }}/>
            }
          </button>
        </div>

        {/* ══ INFO ══ */}
        <div style={{ padding:"10px 14px 13px" }}>

          <h2
            style={{
              fontSize:"clamp(12.5px,1.4vw,14.5px)", fontWeight:600,
              color:"#1e1b4b", lineHeight:1.35,
              display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical",
              overflow:"hidden", cursor:"pointer", marginBottom:2,
              transition:"color .18s",
            }}
            onClick={() => navigate(`/products/${product._id}`)}
            onMouseEnter={e => e.target.style.color="#4f46e5"}
            onMouseLeave={e => e.target.style.color="#1e1b4b"}
          >
            {product.title}
          </h2>

          {product.brand && (
            <p style={{ fontSize:10.5, color:"#4f46e5", marginBottom:4, fontWeight:500 }}>
              by {product.brand}
            </p>
          )}

          {/* rating */}
          {product.rating && (
            <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:5 }}>
              {[...Array(5)].map((_,i)=>(
                <svg key={i} width="9" height="9" viewBox="0 0 24 24"
                  fill={i < Math.round(product.rating) ? "#fbbf24" : "#e5e7eb"}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
              <span style={{ fontSize:10, fontWeight:600, color:"#94a3b8" }}>
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}

          {/* price */}
          <div style={{ display:"flex", alignItems:"baseline", gap:2, marginBottom:8 }}>
            <FaRupeeSign size={12} style={{ color:"#4f46e5", flexShrink:0, marginTop:1 }}/>
            <span className="price-text" style={{ fontSize:"clamp(1.1rem,2vw,1.4rem)", fontWeight:800, lineHeight:1 }}>
              {product.price}
            </span>
          </div>

          {/* CTA */}
          <button
            className={`btn-cart ${isInCart ? "in-cart" : "new"}`}
            onClick={handleAddToCart}
          >
            <IoCartOutline size={15} style={{ position:"relative", zIndex:1 }}/>
            <span style={{ position:"relative", zIndex:1 }}>
              {isInCart ? "Go to Cart" : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}