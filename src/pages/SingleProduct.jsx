import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrums from "../components/Breadcrums";
import Loading from "../assets/Loading4.webm";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/wishlistContext";
import { toast } from "sonner";
import {
  FaShoppingCart, FaHeart, FaRegHeart,
  FaStar, FaStarHalfAlt, FaRegStar,
  FaTag, FaTruck, FaUndoAlt,
  FaIndustry, FaListAlt, FaRupeeSign,
  FaCheckCircle, FaShieldAlt,
  FaChevronLeft, FaChevronRight,
} from "react-icons/fa";
import { SlActionRedo } from "react-icons/sl";
import { AiOutlineZoomIn } from "react-icons/ai";
import ProductCard from "../components/ProductCard";
import { useUser } from "@clerk/clerk-react";

export default function SingleProduct() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { isSignedIn } = useUser();

  const [product,         setProduct]         = useState(null);
  const [quantity,        setQuantity]         = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage,   setSelectedImage]   = useState(() =>
    localStorage.getItem(`selectedImage_${id}`) || null
  );
  const [imgZoomed, setImgZoomed] = useState(false);

  // ── NEW: carousel state ──
  const [activeIdx, setActiveIdx] = useState(0);
  const autoTimer = useRef(null);

  const { addToCart, cartItem }               = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  /* ── fetch product ── */
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`https://dummyjson.com/products/${id}`);
        setProduct(res.data);
        const saved = localStorage.getItem(`selectedImage_${id}`);
        setSelectedImage(saved || res.data.thumbnail);
        setActiveIdx(0);
      } catch (e) { console.error(e); }
    };
    fetch();
  }, [id]);

  /* ── fetch related ── */
  useEffect(() => {
    if (!product?.category) return;
    const fetch = async () => {
      try {
        const res = await axios.get(`https://dummyjson.com/products/category/${product.category}`);
        setRelatedProducts(
          res.data.products
            .filter(i => i.id !== product.id)
            .slice(0, 6)
            .map(i => ({ ...i, price: calculatePrice(i.price) }))
        );
      } catch (e) { console.error(e); }
    };
    fetch();
  }, [product]);

  // ── keep selectedImage in sync with carousel index ──
  const allImages = product
    ? [
        ...(product.thumbnail ? [product.thumbnail] : []),
        ...(product.images    ? product.images.filter(i => i !== product.thumbnail) : []),
      ].filter(Boolean)
    : [];

  useEffect(() => {
    if (allImages[activeIdx]) {
      setSelectedImage(allImages[activeIdx]);
      localStorage.setItem(`selectedImage_${id}`, allImages[activeIdx]);
    }
  }, [activeIdx]);

  // ── auto-scroll on hover ──
  const startAuto = useCallback(() => {
    if (allImages.length <= 1) return;
    autoTimer.current = setInterval(() =>
      setActiveIdx(p => (p + 1) % allImages.length), 1800);
  }, [allImages.length]);
  const stopAuto = useCallback(() => clearInterval(autoTimer.current), []);

  const prevImg = e => { e.stopPropagation(); setActiveIdx(p => (p - 1 + allImages.length) % allImages.length); };
  const nextImg = e => { e.stopPropagation(); setActiveIdx(p => (p + 1) % allImages.length); };

  const calculatePrice = (price) => {
    let fp;
    if      (price <= 50)   fp = price + 69;
    else if (price <= 100)  fp = price + 99;
    else if (price <= 300)  fp = price + 199;
    else if (price <= 800)  fp = price + 299;
    else if (price <= 2000) fp = price + 499;
    else                    fp = price + 599;
    return Math.round(fp / 10) * 10;
  };

  const isWishlisted = wishlist.some(i => String(i.productId) === String(product?.id));
  const isInCart     = cartItem.some(i => String(i.productId) === String(product?.id));

  const handleAddToCart = () => {
    if (!product) return;
    if (!isSignedIn) { toast.error("Please login first"); navigate("/sign-in"); return; }
    if (isInCart)    { navigate("/cart"); return; }
    if (product.stock <= 0) { toast.error("Out of Stock"); return; }
    addToCart({ ...product, price: calculatePrice(product.price), quantity });
    toast.success("Added to cart 🛒");
  };

  const handleWishlist = () => {
    if (!product) return;
    if (!isSignedIn) { toast.error("Please login first"); navigate("/sign-in"); return; }
    if (isWishlisted) {
      removeFromWishlist(String(product.id));
      toast("Removed from wishlist 💔", { description: product.title });
    } else {
      addToWishlist({ ...product, price: calculatePrice(product.price) });
      toast.success("Added to wishlist ❤️", { description: product.title });
    }
  };

  const handleShare = async () => {
    const data = { title: product.title, text: product.description, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); toast.success("Link copied 🔗"); }
    } catch (e) { console.error(e); }
  };

  const renderStars = () => {
    const r = product?.rating || 0;
    return [1,2,3,4,5].map(i =>
      r >= i   ? <FaStar     key={i} size={14} style={{ color:"#fbbf24" }}/> :
      r >= i-.5? <FaStarHalfAlt key={i} size={14} style={{ color:"#fbbf24" }}/> :
                 <FaRegStar  key={i} size={14} style={{ color:"#e5e7eb" }}/>
    );
  };

  /* ── loading ── */
  if (!product) return (
    <div className="flex items-center justify-center h-screen"
      style={{ background:"linear-gradient(135deg,#eef2ff,#f0f4ff,#ffffff)" }}>
      <video muted autoPlay loop className="w-36 opacity-80">
        <source src={Loading} type="video/webm"/>
      </video>
    </div>
  );

  const finalPrice    = calculatePrice(product.price);
  const originalPrice = Math.round(finalPrice / (1 - product.discountPercentage / 100));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        :root {
          --ind:  #4f46e5;
          --blue: #2563eb;
          --lt:   #eef2ff;
        }

        .sp-root * { font-family:'DM Sans',sans-serif; }
        .sp-serif  { font-family:'Playfair Display',serif; }

        .sp-bg {
          background:linear-gradient(135deg,#eef2ff 0%,#f0f4ff 40%,#ffffff 100%);
          min-height:100vh; position:relative; overflow-x:hidden;
        }

        @keyframes blobDrift {
          0%,100%{transform:translate(0,0) scale(1);border-radius:60% 40% 55% 45%/50% 60% 40% 50%;}
          40%{transform:translate(20px,-16px) scale(1.05);}
          70%{transform:translate(-12px,12px) scale(0.96);}
        }
        .blob1{animation:blobDrift 10s ease-in-out infinite;}
        .blob2{animation:blobDrift 13s ease-in-out infinite reverse;}

        @keyframes fadeRight { from{opacity:0;transform:translateX(-24px);} to{opacity:1;transform:translateX(0);} }
        @keyframes fadeLeft  { from{opacity:0;transform:translateX(24px);}  to{opacity:1;transform:translateX(0);} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px);}  to{opacity:1;transform:translateY(0);} }
        @keyframes shimmer   { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
        @keyframes heartBeat { 0%,100%{transform:scale(1);} 30%{transform:scale(1.35);} 60%{transform:scale(0.88);} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.6;} 100%{transform:scale(1.6);opacity:0;} }

        .fade-right { animation:fadeRight 0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-left  { animation:fadeLeft  0.65s cubic-bezier(0.22,1,0.36,1) both 0.1s; }
        .fade-up    { animation:fadeUp    0.55s cubic-bezier(0.22,1,0.36,1) both; }

        /* ── image card (unchanged) ── */
        .img-main-wrap {
          background:rgba(255,255,255,0.88);
          backdrop-filter:blur(18px);
          border:1px solid rgba(99,102,241,0.14);
          border-radius:28px;
          overflow:hidden;
          box-shadow:0 20px 60px rgba(79,70,229,0.12);
          transition:box-shadow 0.3s;
          position:relative;
        }
        .img-main-wrap:hover { box-shadow:0 28px 80px rgba(79,70,229,0.2); }

        /* ── NEW: sliding track ── */
        .sp-track {
          display:flex;
          will-change:transform;
          transition:transform 0.42s cubic-bezier(0.22,1,0.36,1);
        }
        .sp-slide {
          flex:0 0 100%;
          min-height:360px;
          display:flex; align-items:center; justify-content:center;
          padding:32px;
        }

        /* image (was .img-main — kept identical) */
        .img-main {
          width:100%; max-height:440px; object-fit:contain;
          transition:transform 0.55s cubic-bezier(0.22,1,0.36,1);
          cursor:zoom-in;
        }
        .img-main:hover { transform:scale(1.07); }

        /* ── NEW: prev/next arrows ── */
        .sp-arrow {
          position:absolute; top:50%; transform:translateY(-50%);
          width:34px; height:34px; border-radius:50%; z-index:8;
          display:flex; align-items:center; justify-content:center;
          background:rgba(255,255,255,0.90);
          border:1px solid rgba(99,102,241,0.18);
          box-shadow:0 2px 10px rgba(79,70,229,0.12);
          cursor:pointer;
          opacity:0; transition:opacity .22s, transform .22s, box-shadow .18s;
        }
        .sp-arrow-l { left:12px; }
        .sp-arrow-r { right:12px; }
        .img-main-wrap:hover .sp-arrow { opacity:1; }
        .sp-arrow:hover {
          background:white;
          box-shadow:0 4px 18px rgba(79,70,229,0.24);
          transform:translateY(-50%) scale(1.10);
        }

        /* ── NEW: dot indicators ── */
        .sp-dots {
          position:absolute; bottom:12px; left:50%; transform:translateX(-50%);
          display:flex; gap:5px; z-index:9;
          opacity:0; transition:opacity .22s;
        }
        .img-main-wrap:hover .sp-dots { opacity:1; }
        .sp-dot {
          height:5px; border-radius:3px; border:none; padding:0; cursor:pointer;
          background:rgba(99,102,241,0.30);
          transition:width .24s, background .22s;
        }
        .sp-dot.active {
          background:#6366f1;
          box-shadow:0 0 7px rgba(99,102,241,0.50);
        }

        /* ── NEW: image count badge ── */
        .sp-count {
          position:absolute; bottom:13px; right:13px; z-index:7;
          font-size:9px; font-weight:700; letter-spacing:.05em;
          color:rgba(99,102,241,0.60);
          background:rgba(238,242,255,0.80); border-radius:7px;
          padding:2px 8px; transition:opacity .22s;
          border:1px solid rgba(99,102,241,0.12);
        }
        .img-main-wrap:hover .sp-count { opacity:0; }

        /* thumbnails (unchanged) */
        .thumb {
          width:68px; height:68px; border-radius:14px;
          overflow:hidden; cursor:pointer; flex-shrink:0;
          border:2px solid transparent;
          transition:all 0.22s;
          background:rgba(255,255,255,0.85);
        }
        .thumb:hover { border-color:rgba(99,102,241,0.4); transform:translateY(-2px); }
        .thumb.active { border-color:#6366f1; box-shadow:0 4px 16px rgba(99,102,241,0.3); }

        /* action icon buttons (unchanged) */
        .action-btn {
          width:40px; height:40px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          background:rgba(255,255,255,0.9);
          border:1px solid rgba(99,102,241,0.14);
          box-shadow:0 2px 10px rgba(0,0,0,0.07);
          cursor:pointer; transition:all 0.22s;
        }
        .action-btn:hover { transform:scale(1.1); box-shadow:0 6px 20px rgba(79,70,229,0.2); }

        .discount-badge {
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          color:white; font-size:11px; font-weight:700;
          padding:4px 12px; border-radius:999px;
          box-shadow:0 4px 14px rgba(79,70,229,0.38);
          display:inline-flex; align-items:center; gap:5px;
          letter-spacing:0.03em;
        }

        .stock-in  { background:#f0fdf4; border:1px solid #86efac; color:#16a34a; }
        .stock-out { background:#fff1f2; border:1px solid #fca5a5; color:#ef4444; }

        .price-main {
          font-family:'Playfair Display',serif;
          font-size:2.6rem; font-weight:800; line-height:1;
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }

        .btn-cart {
          width:100%; display:flex; align-items:center; justify-content:center; gap:9px;
          padding:14px 24px; border-radius:16px;
          font-size:15px; font-weight:700;
          position:relative; overflow:hidden;
          border:none; cursor:pointer;
          transition:transform 0.22s, box-shadow 0.22s;
        }
        .btn-cart.add {
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          background-size:200% 100%; color:white;
        }
        .btn-cart.add:hover { transform:translateY(-2px); box-shadow:0 14px 36px rgba(79,70,229,0.42); }
        .btn-cart.add::after {
          content:''; position:absolute; inset:0; border-radius:inherit;
          background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%);
          background-size:200% 100%; animation:shimmer 2.4s infinite;
        }
        .btn-cart.incart {
          background:#f0f4ff; border:1.5px solid rgba(99,102,241,0.25); color:#4f46e5;
        }
        .btn-cart.incart:hover { background:#e0e7ff; transform:translateY(-1px); }

        .btn-wish {
          width:52px; height:52px; border-radius:14px;
          display:flex; align-items:center; justify-content:center;
          background:#fff0f3; border:1.5px solid rgba(244,63,94,0.2);
          cursor:pointer; flex-shrink:0; transition:all 0.22s;
        }
        .btn-wish:hover { background:#ffe4e6; border-color:rgba(244,63,94,0.45); transform:scale(1.05); }
        .btn-wish.active { background:#ffe4e6; border-color:rgba(244,63,94,0.4); }

        .trust-chip {
          display:flex; align-items:center; gap:8px;
          background:rgba(255,255,255,0.7);
          border:1px solid rgba(99,102,241,0.1);
          border-radius:12px; padding:10px 14px;
          font-size:12px; font-weight:600; color:#374151;
          transition:border-color 0.2s, background 0.2s;
        }
        .trust-chip:hover { background:white; border-color:rgba(99,102,241,0.25); }

        .spec-row {
          display:flex; justify-content:space-between; align-items:center;
          padding:9px 0; border-bottom:1px solid rgba(99,102,241,0.08); font-size:13px;
        }
        .spec-row:last-child { border-bottom:none; }

        .related-heading {
          font-family:'Playfair Display',serif;
          font-size:1.8rem; font-weight:700; color:#1e1b4b;
        }

        .zoom-overlay {
          position:fixed; inset:0; z-index:9999;
          background:rgba(10,10,30,0.85); backdrop-filter:blur(12px);
          display:flex; align-items:center; justify-content:center; cursor:zoom-out;
        }
        .zoom-img { max-width:90vw; max-height:90vh; object-fit:contain; border-radius:16px; }
      `}</style>

      <div className="sp-root sp-bg">

        {/* blobs — unchanged */}
        <div className="blob1 pointer-events-none fixed -top-28 -left-28 w-96 h-96 opacity-25 blur-3xl"
          style={{ background:"radial-gradient(circle,#c7d2fe,transparent)" }}/>
        <div className="blob2 pointer-events-none fixed -bottom-24 -right-24 w-80 h-80 opacity-20 blur-3xl"
          style={{ background:"radial-gradient(circle,#bfdbfe,transparent)" }}/>
        <div className="pointer-events-none fixed inset-0 opacity-[0.025]"
          style={{ backgroundImage:"radial-gradient(circle,#4f46e5 1px,transparent 1px)", backgroundSize:"28px 28px" }}/>

        <div className="relative z-10 max-w-6xl mx-auto px-5 pt-6 pb-16">

          <Breadcrums title={product.title}/>

          {/* ══ MAIN GRID — unchanged layout ══ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">

            {/* ── LEFT: IMAGE ── */}
            <div className="fade-right flex flex-col gap-5">

              {/* main image card */}
              <div
                className="img-main-wrap"
                onMouseEnter={startAuto}
                onMouseLeave={stopAuto}
              >
                {/* discount badge — unchanged */}
                <div className="absolute top-5 left-5 z-10">
                  <span className="discount-badge">
                    <FaTag size={10}/> {Math.round(product.discountPercentage)}% OFF
                  </span>
                </div>

                {/* action buttons — unchanged */}
                <div className="absolute top-5 right-5 z-10 flex flex-col gap-2">
                  <button className="action-btn" onClick={handleWishlist}
                    style={{ color: isWishlisted ? "#f43f5e" : "#9ca3af" }}>
                    {isWishlisted ? <FaHeart size={15}/> : <FaRegHeart size={15}/>}
                  </button>
                  <button className="action-btn" onClick={handleShare} style={{ color:"#6366f1" }}>
                    <SlActionRedo size={15}/>
                  </button>
                  <button className="action-btn" onClick={() => setImgZoomed(true)} style={{ color:"#6366f1" }}>
                    <AiOutlineZoomIn size={16}/>
                  </button>
                </div>

                {/* ── ONLY NEW THING: sliding track replaces the static <img> ── */}
                <div style={{ overflow:"hidden" }}>
                  <div
                    className="sp-track"
                    style={{ transform:`translateX(-${activeIdx * 100}%)` }}
                  >
                    {allImages.map((src, i) => (
                      <div key={i} className="sp-slide">
                        <img
                          src={src}
                          alt={product.title}
                          loading="lazy"
                          className="img-main"
                          onClick={() => setImgZoomed(true)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* prev / next arrows */}
                {allImages.length > 1 && (
                  <>
                    <button className="sp-arrow sp-arrow-l" onClick={prevImg} aria-label="Previous">
                      <FaChevronLeft size={11} color="#6366f1"/>
                    </button>
                    <button className="sp-arrow sp-arrow-r" onClick={nextImg} aria-label="Next">
                      <FaChevronRight size={11} color="#6366f1"/>
                    </button>

                    {/* dot indicators */}
                    <div className="sp-dots">
                      {allImages.map((_, i) => (
                        <button
                          key={i}
                          className={`sp-dot${i === activeIdx ? " active" : ""}`}
                          style={{ width: i === activeIdx ? 18 : 5 }}
                          onClick={e => { e.stopPropagation(); setActiveIdx(i); }}
                          aria-label={`Image ${i + 1}`}
                        />
                      ))}
                    </div>

                    {/* count badge */}
                    <div className="sp-count">{activeIdx + 1}/{allImages.length}</div>
                  </>
                )}
              </div>

              {/* thumbnails — clicking also updates carousel index */}
              <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth:"none" }}>
                {allImages.map((img, i) => (
                  <div
                    key={i}
                    className={`thumb ${i === activeIdx ? "active" : ""}`}
                    onClick={() => setActiveIdx(i)}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover"/>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: INFO — 100% unchanged ── */}
            <div className="fade-left flex flex-col gap-5">

              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                  <FaListAlt size={10}/>{product.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                  <FaIndustry size={10}/>{product.brand}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${product.stock > 0 ? "stock-in":"stock-out"}`}>
                  {product.stock > 0 ? `✓ In Stock (${product.stock})` : "Out of Stock"}
                </span>
              </div>

              <h1 className="sp-serif text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-950 leading-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">{renderStars()}</div>
                <span className="text-sm font-semibold text-slate-600">{product.rating?.toFixed(1)}</span>
                <span className="text-xs text-slate-400">· {product.reviews?.length || 0} reviews</span>
              </div>

              <div className="flex items-end gap-4">
                <div className="flex items-baseline gap-1">
                  <FaRupeeSign size={18} style={{ color:"#4f46e5", marginBottom:4 }}/>
                  <span className="price-main">{finalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex flex-col pb-1">
                  <span className="text-slate-400 text-sm line-through leading-none">
                    ₹{originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-green-600 text-xs font-bold mt-0.5">
                    You save ₹{(originalPrice-finalPrice).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed">{product.description}</p>

              <div className="bg-white/70 backdrop-blur border border-indigo-100 rounded-2xl px-4 py-1">
                {[
                  { label:"SKU",          value: product.sku || "N/A" },
                  { label:"Availability", value: product.availabilityStatus || (product.stock>0?"In Stock":"Out of Stock") },
                  { label:"Minimum Order",value: `${product.minimumOrderQuantity || 1} unit(s)` },
                  { label:"Return Policy",value: product.returnPolicy || "7-Day Return" },
                ].map(({ label, value }) => (
                  <div key={label} className="spec-row">
                    <span className="text-slate-400 font-medium">{label}</span>
                    <span className="font-semibold text-slate-700 text-right max-w-[55%] truncate">{value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 items-stretch">
                <button className={`btn-cart ${isInCart?"incart":"add"} flex-1`} onClick={handleAddToCart}>
                  <FaShoppingCart size={16} className="relative z-10"/>
                  <span className="relative z-10">{isInCart ? "Go to Cart" : "Add to Cart"}</span>
                </button>
                <button className={`btn-wish ${isWishlisted?"active":""}`} onClick={handleWishlist}>
                  {isWishlisted
                    ? <FaHeart  size={18} style={{ color:"#f43f5e" }}/>
                    : <FaRegHeart size={18} style={{ color:"#f43f5e" }}/>}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon:<FaTruck    size={14} style={{ color:"#10b981" }}/>, text:"Free Delivery ₹500+" },
                  { icon:<FaUndoAlt  size={13} style={{ color:"#2563eb" }}/>, text:"7-Day Returns" },
                  { icon:<FaShieldAlt size={13} style={{ color:"#6366f1" }}/>, text:"Secure Payments" },
                  { icon:<FaCheckCircle size={13} style={{ color:"#f59e0b" }}/>, text:"Genuine Product" },
                ].map(({ icon, text }) => (
                  <div key={text} className="trust-chip">{icon}<span>{text}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* ══ RELATED PRODUCTS — unchanged ══ */}
          {relatedProducts.length > 0 && (
            <div className="mt-6 fade-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1" style={{ background:"linear-gradient(90deg,rgba(99,102,241,0.25),transparent)" }}/>
                <h2 className="related-heading">Related Products</h2>
                <div className="h-px flex-1" style={{ background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.25))" }}/>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
                {relatedProducts.map(item => (
                  <ProductCard key={item.id} product={item}/>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ══ ZOOM MODAL — now shows activeIdx image ══ */}
        {imgZoomed && (
          <div className="zoom-overlay" onClick={() => setImgZoomed(false)}>
            <img
              src={allImages[activeIdx] || selectedImage}
              alt={product.title}
              className="zoom-img"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </>
  );
}