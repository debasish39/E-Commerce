import React, { useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { FaHeart, FaRupeeSign, FaRegHeart } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/wishlistContext";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, cartItem }             = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isSignedIn }                      = useUser();
  const [imgLoading, setImgLoading]         = useState(true);
  const [heartAnim,  setHeartAnim]          = useState(false);

  const isInCart = cartItem.some(i => String(i.productId) === String(product.id));
  const isLiked  = wishlist.some(i => String(i.productId) === String(product.id));

  const handleAddToCart = () => {
    if (!isSignedIn) { toast.error("Please login first"); navigate("/sign-in"); return; }
    if (isInCart) { navigate("/cart"); return; }
    addToCart(product);
    toast.success("Added to cart 🛒");
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    if (!isSignedIn) { toast.error("Please login first"); navigate("/sign-in"); return; }
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 500);
    if (isLiked) { removeFromWishlist(String(product.id)); toast("Removed from wishlist 💔"); }
    else { addToWishlist(product); toast.success("Added to wishlist ❤️"); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .pc-root { font-family:'Plus Jakarta Sans',sans-serif; }

        .pc-card {
          position:relative;
          background:rgba(255,255,255,0.88);
          backdrop-filter:blur(16px);
          border:1px solid rgba(99,102,241,0.12);
          border-radius:22px;
          overflow:hidden;
          transition:transform 0.32s cubic-bezier(0.34,1.2,0.64,1),
                     box-shadow 0.28s ease,
                     border-color 0.25s ease;
          cursor:pointer;
        }
        .pc-card:hover {
          transform:translateY(-8px) scale(1.015);
          box-shadow:0 24px 56px rgba(79,70,229,0.18), 0 6px 20px rgba(0,0,0,0.06);
          border-color:rgba(99,102,241,0.28);
        }

        /* image */
        .pc-img {
          width:100%; height:100%; object-fit:contain;
          transition:transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .pc-card:hover .pc-img { transform:scale(1.08); }

        /* overlay */
        .pc-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to bottom, transparent 40%, rgba(30,27,75,0.55) 100%);
          opacity:0;
          transition:opacity 0.28s ease;
          display:flex; align-items:flex-end; justify-content:center;
          padding-bottom:14px;
        }
        .pc-card:hover .pc-overlay { opacity:1; }

        .pc-quick-view {
          display:flex; align-items:center; gap:6px;
          background:rgba(255,255,255,0.92);
          color:#1e1b4b; font-size:12px; font-weight:700;
          padding:7px 16px; border-radius:999px;
          border:none; cursor:pointer;
          transform:translateY(10px); opacity:0;
          transition:transform 0.28s ease 0.05s, opacity 0.28s ease 0.05s, background 0.18s;
        }
        .pc-card:hover .pc-quick-view { transform:translateY(0); opacity:1; }
        .pc-quick-view:hover { background:white; }

        /* wishlist btn */
        .pc-heart {
          position:absolute; top:12px; right:12px; z-index:10;
          width:34px; height:34px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          background:rgba(255,255,255,0.9);
          border:1px solid rgba(99,102,241,0.14);
          box-shadow:0 2px 8px rgba(0,0,0,0.08);
          transition:all 0.22s;
          cursor:pointer;
        }
        .pc-heart:hover { transform:scale(1.12); box-shadow:0 4px 16px rgba(244,63,94,0.22); }
        .pc-heart.liked { background:#fff0f3; border-color:rgba(244,63,94,0.25); }

        @keyframes heartBeat {
          0%  { transform:scale(1); }
          30% { transform:scale(1.4); }
          60% { transform:scale(0.88); }
          100%{ transform:scale(1); }
        }
        .heart-beat { animation:heartBeat 0.45s ease both; }

        /* shimmer skeleton */
        @keyframes skeleton {
          0%  { background-position:-200% center; }
          100%{ background-position: 200% center; }
        }
        .img-skeleton {
          background:linear-gradient(90deg,#e0e7ff 25%,#c7d2fe 50%,#e0e7ff 75%);
          background-size:200% 100%;
          animation:skeleton 1.4s ease-in-out infinite;
        }

        /* price gradient text */
        .price-text {
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
        }

        /* primary btn */
        .btn-cart {
          width:100%; display:flex; align-items:center; justify-content:center; gap:7px;
          padding:10px 0; border-radius:13px;
          font-size:13px; font-weight:700;
          border:none; cursor:pointer;
          position:relative; overflow:hidden;
          transition:transform 0.2s, box-shadow 0.2s;
        }
        .btn-cart.new {
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          color:white;
        }
        .btn-cart.new:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(79,70,229,0.38); }
        .btn-cart.new:active { transform:scale(0.96); }

        @keyframes shimmer { 0%{background-position:-200% center;}100%{background-position:200% center;} }
        .btn-cart.new::after {
          content:''; position:absolute; inset:0; border-radius:inherit;
          background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%);
          background-size:200% 100%;
          animation:shimmer 2.4s infinite;
        }

        .btn-cart.in-cart {
          background:#f0f4ff;
          border:1.5px solid rgba(99,102,241,0.22);
          color:#4f46e5;
        }
        .btn-cart.in-cart:hover { background:#e0e7ff; transform:translateY(-1px); }

        /* featured badge */
        .featured-badge {
          position:absolute; top:12px; left:12px; z-index:10;
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          color:white; font-size:9px; font-weight:700;
          padding:3px 9px; border-radius:999px;
          box-shadow:0 3px 10px rgba(79,70,229,0.35);
          letter-spacing:0.04em;
          text-transform:uppercase;
        }
      `}</style>

      <div className="pc-root pc-card" data-aos="zoom-in-up">

        {/* ── IMAGE ── */}
        <div className="relative h-35 sm:h-52 overflow-hidden"
          style={{ background:"#f8faff" }}
          onClick={() => navigate(`/products/${product.id}`)}>

          {/* skeleton */}
          {imgLoading && (
            <div className="img-skeleton absolute inset-0 flex items-center justify-center">
              <svg className="w-12 h-12 opacity-30" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
          )}

          <img
            src={product.thumbnail || product.images?.[0]}
            alt={product.title}
            loading="lazy"
            onLoad={() => setImgLoading(false)}
            onError={e => e.target.src="https://via.placeholder.com/300x200?text=No+Image"}
            className={`pc-img transition-opacity duration-400 ${imgLoading?"opacity-0":"opacity-100"}`}
          />

          {/* hover overlay */}
          <div className="pc-overlay">
            <button className="pc-quick-view" onClick={e => { e.stopPropagation(); navigate(`/products/${product.id}`); }}>
              <AiOutlineEye size={13}/> Quick View
            </button>
          </div>

          {/* featured badge */}
          <span className="featured-badge">✨ Featured</span>

          {/* wishlist btn */}
          <button
            className={`pc-heart ${isLiked?"liked":""}`}
            onClick={handleToggleWishlist}
            aria-label="Toggle wishlist">
            {isLiked
              ? <FaHeart  size={14} className={heartAnim?"heart-beat":""} style={{ color:"#f43f5e" }}/>
              : <FaRegHeart size={14} className={heartAnim?"heart-beat":""} style={{ color:"#94a3b8" }}/>}
          </button>
        </div>

        {/* ── INFO ── */}
        <div className="px-4 pt-3 pb-4">

          <h2
            className="text-sm sm:text-base font-semibold text-indigo-950 hover:text-indigo-600 transition-colors line-clamp-2 leading-snug cursor-pointer mb-0.5"
            onClick={() => navigate(`/products/${product.id}`)}>
            {product.title}
          </h2>

          {product.brand && (
            <p className="text-[11px] text-slate-400 mb-1 font-medium">by {product.brand}</p>
          )}

          {/* rating strip */}
          {product.rating && (
            <div className="flex items-center gap-1.5 mb-1">
              <div className="flex">
                {[...Array(5)].map((_,i) => (
                  <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i < Math.round(product.rating) ? "#fbbf24":"#e5e7eb"}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="text-[10px] font-semibold text-slate-500">{product.rating.toFixed(1)}</span>
            </div>
          )}

          {/* price */}
          <div className="flex items-baseline gap-0.5 mb-1">
            <FaRupeeSign size={13} className="mt[-2px] flex-shrink-0" style={{ color:"#4f46e5" }}/>
            <span className="price-text text-xl sm:text-2xl font-extrabold leading-none">
              {product.price}
            </span>
          </div>

          {/* CTA */}
          <button
            className={`btn-cart ${isInCart ? "in-cart" : "new"}`}
            onClick={handleAddToCart}>
            <IoCartOutline size={16} className="relative z-10"/>
            <span className="relative z-10">{isInCart ? "Go to Cart" : "Add to Cart"}</span>
          </button>
        </div>
      </div>
    </>
  );
}