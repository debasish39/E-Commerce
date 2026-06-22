import React, { useEffect, useState, useRef, useCallback } from "react";
import { getData } from "../context/DataContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  FaRupeeSign, FaStar, FaShoppingCart, FaBolt, FaFire,
  FaTag, FaArrowRight, FaHeart, FaTruck, FaShieldAlt
} from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { MdFlashOn } from "react-icons/md";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Loading from "../assets/Loading4.webm";
import "./carousel.css";
/* ── helpers ── */
const BADGES = [
  { label: "DEAL OF THE DAY", icon: "⚡", color: "#f59e0b" },
  { label: "TOP DEAL", icon: "🔥", color: "#ef4444" },
  { label: "BEST SELLER", icon: "🏆", color: "#6366f1" },
  { label: "LIMITED OFFER", icon: "⏳", color: "#8b5cf6" },
  { label: "TRENDING NOW", icon: "📈", color: "#10b981" },
];

/* accent colours per slide — used for glows, text accents, rings */
const ACCENTS = [
  { h: "#4f46e5", l: "rgba(99,102,241,.18)", ring: "rgba(99,102,241,.35)" },
  { h: "#be185d", l: "rgba(236,72,153,.15)", ring: "rgba(236,72,153,.30)" },
  { h: "#0891b2", l: "rgba(6,182,212,.15)", ring: "rgba(6,182,212,.30)" },
  { h: "#d97706", l: "rgba(245,158,11,.15)", ring: "rgba(245,158,11,.30)" },
  { h: "#7c3aed", l: "rgba(124,58,237,.15)", ring: "rgba(124,58,237,.30)" },
];

const getDiscount = (price, seed) => {
  const pcts = [10, 15, 20, 25, 30, 35, 40, 45, 50];
  const pct = pcts[seed % pcts.length];
  return { pct, original: Math.round(price / (1 - pct / 100)) };
};

const useCountdown = (h = 8, m = 32, s = 14) => {
  const [t, setT] = useState({ h, m, s });
  useEffect(() => {
    const id = setInterval(() => setT(p => {
      if (p.s > 0) return { ...p, s: p.s - 1 };
      if (p.m > 0) return { ...p, m: p.m - 1, s: 59 };
      if (p.h > 0) return { h: p.h - 1, m: 59, s: 59 };
      return { h: 8, m: 32, s: 14 };
    }), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
};

const pad = n => String(n).padStart(2, "0");


/* ══════════════════════════════════
   COMPONENT
══════════════════════════════════ */
export default function Carousel() {
  const { data, fetchAllProducts } = getData();
  const { addToCart, cartItem } = useCart();
  const navigate = useNavigate();
  // const [loading, setLoading]       = useState(true);
  const countdown = useCountdown();
 
/* =====================================
   JWT TOKEN
===================================== */

const token =
  localStorage.getItem(
    "token"
  );

const isSignedIn =
  !!token;


  // console.log("Carousel data:", data);
  useEffect(() => {
    if (!data || data.length === 0) {
      fetchAllProducts();
    }
  }, []);
  // useEffect(()=>{
  //   const id = "cw-styles";
  //   if(!document.getElementById(id)){
  //     const el = document.createElement("style"); el.id=id; el.textContent=CSS;
  //     document.head.appendChild(el);
  //   }
  //   if(!data||data.length===0) fetchAllProducts().finally(()=>setLoading(false));
  //   else setLoading(false);
  // },[]);

  const orderedData = data || [];

  /*
    Move product id=83 to first position
  */

  const product83Index = orderedData.findIndex(
    (item) => item._id === 83
  );

  let reorderedData = [...orderedData];

  if (product83Index !== -1) {
    const [product83] = reorderedData.splice(product83Index, 1);

    reorderedData.unshift(product83);
  }
  const handleCart = useCallback((item, e) => {
    e?.stopPropagation();
    if (!isSignedIn) { toast.error("Please login first"); setTimeout(() => navigate("/sign-in"), 300); return; }
    if (cartItem.some(c => String(c.productId) === String(item._id))) {
      toast.info("Already in cart 🛒"); setTimeout(() => navigate("/cart"), 100); return;
    }
    addToCart(item); toast.success("Added to cart 🛒");
  }, [isSignedIn, cartItem, addToCart, navigate]);

  const inCart = item => cartItem.some(c => String(c.productId) === String(item._id));

  const SWIPER_COMMON = {

    slidesPerView: 1,
    loop: true,
    autoplay: { disableOnInteraction: true },
    pagination: { clickable: true },
    onTouchStart: sw => sw.autoplay.stop(),
    onTouchEnd: sw => setTimeout(() => sw.autoplay.start(), 3900),
  };
  // if (!data || data.length === 0) {
  //   return (
  //     <div className="w-full h-[420px] px-4 py-4 animate-pulse">

  //       {/* Offer bar skeleton */}
  //       <div className="h-12 w-full rounded-lg bg-indigo-200 mb-4" />

  //       <div className="grid md:grid-cols-2 gap-6 items-center h-full">

  //         {/* LEFT SIDE */}
  //         <div className="space-y-4">
  //           <div className="h-5 w-40 bg-indigo-200 rounded" />
  //           <div className="h-8 w-3/4 bg-gray-300 rounded" />
  //           <div className="h-4 w-full bg-gray-200 rounded" />
  //           <div className="h-4 w-5/6 bg-gray-200 rounded" />

  //           <div className="flex gap-2">
  //             <div className="h-6 w-16 bg-gray-300 rounded" />
  //             <div className="h-6 w-20 bg-gray-200 rounded" />
  //           </div>

  //           <div className="flex gap-3 mt-3">
  //             <div className="h-10 w-36 bg-indigo-300 rounded-lg" />
  //             <div className="h-10 w-24 bg-gray-200 rounded-lg" />
  //           </div>
  //         </div>

  //         {/* RIGHT SIDE IMAGE */}
  //         <div className="flex justify-center">
  //           <div className="w-[260px] h-[260px] bg-gray-200 rounded-xl" />
  //         </div>

  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div className="cw-root">

      {/* ── OFFER BAR ── */}
      {/* ── OFFER BAR ── */}
      <div
        className="w-full px-4 sm:px-18 py-2.5 flex items-center justify-between gap-4 flex-wrap bg-gradient-to-br 
  from-indigo-600 via-blue-600 to-purple-600
  backdrop-blur-xl border border-indigo-400/30
  shadow-[0_8px_32px_rgba(79,70,229,0.15)] mt-1"
      >
        <div className="flex items-center gap-3 flex-no-wrap">

          <span className="fk-display text-yellow-300 text-sm sm:text-lg font-black tracking-widest flex items-center gap-2">
            ⚡ BIG BILLION DEALS
          </span>

          <div className="hidden sm:flex items-center gap-2 text-white text-xs">
            {[
              { icon: "🏷️", text: "Up to 80% Off" },
              { icon: "🚚", text: "Free Delivery ₹499+" },
              { icon: "💳", text: "10% Bank Cashback" },
            ].map(({ icon, text }) => (
              <span
                key={text}
                className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-full px-2.5 py-0.5 font-medium"
              >
                {icon} {text}
              </span>
            ))}
          </div>
        </div>

        {/* Live countdown */}
        <div className="flex items-center gap-1.5">

          <span className="text-white/60 text-xs font-medium hidden sm:block mr-1">
            ⏳ Ends in
          </span>

          {[
            { val: pad(countdown.h), label: "hrs" },
            { val: pad(countdown.m), label: "min" },
            { val: pad(countdown.s), label: "sec" },
          ].map((t, i) => (
            <React.Fragment key={i}>

              {i > 0 && (
                <span className="text-yellow-300 font-black text-base leading-none">
                  :
                </span>
              )}

              <div className="flex flex-col items-center w-8">
                <span
                  className="timer-digit fk-display text-xl font-black text-yellow-300 leading-none"
                  style={{ animationDelay: `${i * 0.35}s` }}
                >
                  {t.val}
                </span>

                <span className="text-white/45 text-[9px] leading-tight">
                  {t.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>


      {/* ══════════════════════════════════════
          DESKTOP CAROUSEL
      ══════════════════════════════════════ */}
      <div className="cw-desktop">
        <Swiper
          {...SWIPER_COMMON}
          modules={[Autoplay]}
          navigation
          className="cw-desk-swiper"
        >
          {reorderedData.map((item, idx) => {
            const badge = BADGES[idx % BADGES.length];
            const accent = ACCENTS[idx % ACCENTS.length];
            const { pct, original } = getDiscount(item.price, idx);
            const stars = Math.min(5, Math.max(3, Math.round(item.rating || 4)));
            const rCount = (1200 + idx * 379).toLocaleString();
            const emi = Math.round(item.price / 6).toLocaleString("en-IN");
            const added = inCart(item);

            return (
              <SwiperSlide key={item._id}>
                <div className="cw-ds">
                  {/* giant bg number */}
                  <div className="cw-ds-num">{String(idx + 1).padStart(2, "0")}</div>

                  {/* accent glow blob */}
                  <div style={{
                    position: "absolute", top: -80, right: -60,
                    width: 420, height: 420, borderRadius: "50%",
                    background: accent.l, filter: "blur(80px)",
                    pointerEvents: "none", zIndex: 1,
                  }} />

                  {/* ── LEFT ── */}
                  <div className="cw-ds-left">

                    <div
                      className="cw-ds-accentline"
                      style={{ background: accent.h }}
                    />

                    <div
                      className="cw-ds-badge"
                      style={{ background: accent.h }}
                    >
                      <span style={{ fontSize: 14 }}>
                        {badge.icon}
                      </span>

                      <span
                        className="cw-badge-label"
                        style={{
                          fontFamily: "var(--f-badge)",
                          fontSize: 13,
                          letterSpacing: ".12em"
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <h2
                      className="cw-ds-title"
                      onClick={() => navigate(`/products/${item._id}`)}
                    >
                      {item.title}
                    </h2>

                    <p className="cw-ds-desc">
                      {item.description}
                    </p>

                    {/* ⭐ Ratings */}
                    <div className="cw-ds-stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < stars ? "⭐" : "☆"}
                        </span>
                      ))}

                      <span className="cw-ds-rpill">
                        {item.rating?.toFixed(1) || "4.2"} ⭐
                      </span>

                      <span className="cw-ds-rcount">
                        ({rCount})
                      </span>
                    </div>

                    {/* 💰 Price */}
                    <div className="cw-ds-price-row">

                      <span className="cw-ds-price">
                        <span className="cw-ds-price-sym">
                          ₹
                        </span>

                        {item.price?.toLocaleString("en-IN")}
                      </span>

                      <span className="cw-ds-orig">
                        ₹{original.toLocaleString("en-IN")}
                      </span>

                      <span className="cw-ds-pct">
                        {pct}% off
                      </span>
                    </div>

                    {/* 🚚 Features */}
                    <div className="cw-ds-chips">
                      {[
                        { icon: "🚚", t: "Free Delivery" },
                        { icon: "🛡️", t: "Secure Pay" },
                        { icon: "🔄", t: "10-Day Return" },
                      ].map(({ icon, t }) => (
                        <span key={t} className="cw-ds-chip">
                          {icon} {t}
                        </span>
                      ))}
                    </div>

                    {/* 💳 EMI */}
                    <p className="cw-ds-emi">
                      No Cost EMI from <b>₹{emi}/mo</b>
                    </p>

                    {/* 🛒 Buttons */}
                    <div className="cw-ds-btns">

                      <button
                        className="cw-ds-btn-p"
                        style={{
                          background: `linear-gradient(135deg,${accent.h},#2563eb)`,
                          boxShadow: `0 4px 22px ${accent.ring}`
                        }}
                        onClick={e =>
                          added
                            ? navigate("/cart")
                            : handleCart(item, e)
                        }
                      >
                        🛒 {added ? "Go to Cart" : "Add to Cart"}
                      </button>

                      <button
                        className="cw-ds-btn-s"
                        onClick={() => navigate(`/products/${item._id}`)}
                      >
                        👁️ Details
                      </button>

                    </div>
                  </div>

                  {/* ── RIGHT ── */}
                  <div className="cw-ds-right">
                    <div className="cw-ds-float" />
                    {/* glow ring */}
                    <div style={{
                      position: "absolute",
                      width: 280, height: 280, borderRadius: "50%",
                      background: accent.l, filter: "blur(36px)",
                      zIndex: 0, pointerEvents: "none",
                    }} />
                    <div className="cw-ds-ribbon sm:mr-12 rounded-2xl">
                      <FaFire size={12} /> {pct}% OFF
                    </div>
                    <img
                      src={item.thumbnail} alt={item.title}
                      className="cw-ds-img"
                      onClick={() => navigate(`/products/${item._id}`)}
                    />
                  </div>
                </div>

                {/* stats strip */}
                {/* <div className="cw-ds-strip">
                  {[
                    {icon:"⭐",t:`${item.rating?.toFixed(1)||"4.2"} Rating`},
                    {icon:"🏪",t:`${item.brand||"Official"} Store`},
                    {icon:"📦",t:"In Stock"},
                    {icon:"🔒",t:"Secure Checkout"},
                    {icon:"↩️",t:"Easy Returns"},
                  ].map(({icon,t},i,arr)=>(
                    <React.Fragment key={t}>
                      <div className="cw-ds-strip-item"><span>{icon}</span><span>{t}</span></div>
                      {i<arr.length-1 && <div className="cw-ds-strip-dot"/>}
                    </React.Fragment>
                  ))}
                </div> */}

              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* ══════════════════════════════════════
          MOBILE CAROUSEL — completely different
          Full-bleed card, image top, info bottom
      ══════════════════════════════════════ */}
      <div className="cw-mobile" style={{ padding: "14px 8px 20px" }}>
        <Swiper
          {...SWIPER_COMMON}
          modules={[Autoplay]}
          className="cw-mob-swiper"
          style={{ paddingBottom: 36 }}
        >
          {reorderedData.map((item, idx) => {
            const badge = BADGES[idx % BADGES.length];
            const accent = ACCENTS[idx % ACCENTS.length];
            const { pct, original } = getDiscount(item.price, idx);
            const stars = Math.min(5, Math.max(3, Math.round(item.rating || 4)));
            const added = inCart(item);

            return (
              <SwiperSlide key={item._id}>
                <div className="cw-ms" style={{ animationDelay: `${idx * .03}s` }}>
                  {/* accent glow inside card */}
                  <div style={{
                    position: "absolute", top: -40, right: -40,
                    width: 200, height: 200, borderRadius: "50%",
                    background: accent.l, filter: "blur(50px)",
                    pointerEvents: "none", zIndex: 0,
                  }} />

                  {/* image zone */}
                  <div className="cw-ms-img-zone">
                    <div className="cw-ms-badge" style={{ background: accent.h }}>
                      {badge.icon} <span style={{ fontFamily: "var(--f-badge)", fontSize: 11, letterSpacing: ".10em" }}>{badge.label}</span>
                    </div>
                    <div className="cw-ms-disc">
                      <FaFire size={9} /> {pct}% OFF
                    </div>
                    <img
                      src={item.thumbnail} alt={item.title}
                      className="cw-ms-img"
                      onClick={() => navigate(`/products/${item._id}`)}
                    />
                  </div>

                  {/* body */}
                  <div className="cw-ms-body" style={{ position: "relative", zIndex: 1 }}>
                    <div className="cw-ms-brand">{item.brand || item.category || "Brand"}</div>
                    <div className="cw-ms-title" onClick={() => navigate(`/products/${item._id}`)}>
                      {item.title}
                    </div>

                    <div className="cw-ms-meta">
                      {/* stars left */}
                      <div className="cw-ms-stars">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} size={11} color={i < stars ? "#fbbf24" : "lightgray"} />
                        ))}
                        <span className="cw-ms-rpill" style={{ marginLeft: 4 }}>
                          {item.rating?.toFixed(1) || "4.2"} <FaStar size={8} />
                        </span>
                      </div>
                      {/* price right */}
                      <div className="cw-ms-price-block">
                        <span className="cw-ms-price">
                          <span className="cw-ms-price-sym"><FaRupeeSign /></span>
                          {item.price?.toLocaleString("en-IN")}
                        </span>
                        <div className="cw-ms-price-sub">
                          <span className="cw-ms-orig">₹{original.toLocaleString("en-IN")}</span>
                          <span className="cw-ms-off">{pct}% off</span>
                        </div>
                      </div>
                    </div>

                    <div className="cw-ms-trust">
                      {[
                        { icon: <FaTruck size={9} />, t: "Free Delivery" },
                        { icon: <FaShieldAlt size={9} />, t: "Secure Pay" },
                        { icon: "🔄", t: "10-Day Return" },
                      ].map(({ icon, t }) => (
                        <span key={t} className="cw-ms-trust-item">{icon} {t}</span>
                      ))}
                    </div>

                    <div className="cw-ms-btns">
                      <button
                        className="cw-ms-btn-p"
                        style={{
                          background: `linear-gradient(135deg,${accent.h},#2563eb)`,
                          boxShadow: `0 4px 18px ${accent.ring}`,
                        }}
                        onClick={e => added ? navigate("/cart") : handleCart(item, e)}
                      >
                        <FaShoppingCart size={13} />
                        {added ? "Go to Cart" : "Add to Cart"}
                      </button>
                      <button
                        className="cw-ms-btn-s"
                        onClick={() => navigate(`/products/${item._id}`)}
                      >
                        <AiOutlineEye size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

    </div>
  );
}