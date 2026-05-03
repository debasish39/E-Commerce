import React, { useEffect, useState, useRef, useCallback } from "react";
import { getData } from "../context/DataContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { FaRupeeSign, FaStar, FaShoppingCart, FaBolt, FaTag, FaFire } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Loading from "../assets/Loading4.webm";

// ── Offer badge configs ──
const OFFER_BADGES = [
  { label: "DEAL OF THE DAY", icon: "⚡", bg: "from-amber-500 to-orange-500" },
  { label: "TOP DEAL", icon: "🔥", bg: "from-rose-500 to-pink-600" },
  { label: "BEST SELLER", icon: "🏆", bg: "from-indigo-600 to-blue-500" },
  { label: "LIMITED OFFER", icon: "⏳", bg: "from-purple-600 to-violet-500" },
  { label: "TRENDING NOW", icon: "📈", bg: "from-teal-500 to-emerald-500" },
];

// Slide background gradients — defined as inline style strings to avoid CSS class issues
const SLIDE_BG_STYLES = [
  "linear-gradient(135deg,#dbeafe 0%,#eff6ff 45%,#e0e7ff 100%)",
  "linear-gradient(135deg,#fce7f3 0%,#fdf2f8 45%,#ede9fe 100%)",
  "linear-gradient(135deg,#d1fae5 0%,#ecfdf5 45%,#dbeafe 100%)",
  "linear-gradient(135deg,#fef3c7 0%,#fffbeb 45%,#fce7f3 100%)",
  "linear-gradient(135deg,#ede9fe 0%,#f5f3ff 45%,#dbeafe 100%)",
];

// ── Simulate discount ──
const getDiscount = (price, seed) => {
  const pcts = [10, 15, 20, 25, 30, 35, 40, 45, 50];
  const pct = pcts[seed % pcts.length];
  const original = Math.round(price / (1 - pct / 100));
  return { pct, original };
};

// ── Countdown timer hook ──
const useCountdown = (hours = 11, minutes = 47, seconds = 23) => {
  const [time, setTime] = useState({ h: hours, m: minutes, s: seconds });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 11, m: 47, s: 23 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
};

const Carousel = () => {
  const { data, fetchAllProducts } = getData();
  const { addToCart, cartItem } = useCart();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const swiperRef = useRef(null);
  const countdown = useCountdown();

  useEffect(() => {
    if (!data || data.length === 0) {
      fetchAllProducts().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const orderedData = data || [];
  const initialSlide = Math.max(0, orderedData.findIndex(d => d.id === 83));

  const handleAddToCart = useCallback((item) => {
    if (!isSignedIn) {
      toast.error("Please login first");
      setTimeout(() => navigate("/sign-in"), 800);
      return;
    }
    const inCart = cartItem.some(c => String(c.productId) === String(item.id));
    if (inCart) {
      toast.info("Already in cart 🛒");
      setTimeout(() => navigate("/cart"), 800);
      return;
    }
    addToCart(item);
    toast.success("Added to cart 🛒");
  }, [isSignedIn, cartItem, addToCart, navigate]);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        :root {
          --fk-blue:   #2874f0;
          --fk-orange: #fb641b;
          --fk-yellow: #ffe500;
          --fk-green:  #388e3c;
          --fk-dark:   #212121;
          --fk-grey:   #878787;
        }

        .fk-carousel * { font-family: 'DM Sans', sans-serif; }
        .fk-display    { font-family: 'Barlow Condensed', sans-serif; }

        .fk-swiper .swiper-button-next,
        .fk-swiper .swiper-button-prev {
          width: 38px; height: 38px; border-radius: 50%;
          background: white;
          box-shadow: 0 2px 14px rgba(0,0,0,0.16);
          color: var(--fk-blue);
          top: 50%; transform: translateY(-50%);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .fk-swiper .swiper-button-next:hover,
        .fk-swiper .swiper-button-prev:hover {
          box-shadow: 0 4px 20px rgba(40,116,240,0.3);
          transform: translateY(-50%) scale(1.08);
        }
        .fk-swiper .swiper-button-next::after,
        .fk-swiper .swiper-button-prev::after { font-size: 12px; font-weight: 900; }
        .fk-swiper .swiper-button-next { right: 10px; }
        .fk-swiper .swiper-button-prev { left: 10px; }
        .fk-swiper .swiper-pagination-bullet {
          background: white; opacity: 0.45; width: 6px; height: 6px;
          transition: all 0.3s ease;
        }
        .fk-swiper .swiper-pagination-bullet-active {
          background: white; opacity: 1; width: 22px; border-radius: 4px;
        }
        .fk-swiper .swiper-pagination { bottom: 10px; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes imgPop {
          from { opacity: 0; transform: scale(0.86); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.06); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes timerTick {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.1); }
        }

        .slide-info  { animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .slide-img   { animation: imgPop  0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .badge-pulse { animation: badgePulse 2.2s ease-in-out infinite; }
        .timer-digit { display: inline-block; animation: timerTick 1s ease-in-out infinite; }

        .add-btn {
          background: var(--fk-orange);
          color: white;
          position: relative; overflow: hidden;
          transition: filter 0.2s, transform 0.18s, box-shadow 0.2s;
        }
        .add-btn:hover {
          filter: brightness(1.08);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(251,100,27,0.45);
        }
        .add-btn:active { transform: scale(0.96); }
        .add-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%);
          background-size: 200% 100%;
          animation: shimmer 2.2s infinite;
        }

        .view-btn {
          background: var(--fk-blue);
          color: white;
          transition: filter 0.2s, transform 0.18s, box-shadow 0.2s;
        }
        .view-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(40,116,240,0.45);
        }
        .view-btn:active { transform: scale(0.96); }

        .incart-btn {
          background: var(--fk-green);
          color: white;
          transition: filter 0.2s, transform 0.18s;
        }
        .incart-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }

        .product-img {
          transition: transform 0.4s cubic-bezier(0.34,1.2,0.64,1), filter 0.3s ease;
        }
        .product-img:hover {
          transform: scale(1.1) translateY(-6px);
          filter: drop-shadow(0 22px 40px rgba(40,116,240,0.28));
        }

        .offer-chip {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .offer-chip:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .discount-ribbon {
          background: linear-gradient(135deg, #fb641b, #f43f5e);
          clip-path: polygon(0 0, 100% 0, 84% 100%, 0 100%);
          padding-right: 18px;
        }

        .rating-pill {
          background: #388e3c;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 3px;
        }

        .category-btn {
          transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
        }
        .category-btn:hover {
          background: #dbeafe;
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(40,116,240,0.15);
        }

        .stat-strip-item { transition: color 0.2s; }
        .stat-strip-item:hover { color: var(--fk-blue); }
      `}</style>

      <div className=" w-full select-none">

        {/* ── OFFER BAR ── */}
        <div
          className="w-full  px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap  bg-gradient-to-br 
  from-indigo-600 
  via-blue-600
  to-purple-600
  backdrop-blur-xl 
  border border-indigo-400/30
  shadow-[0_8px_32px_rgba(79,70,229,0.15)] mt-1
 "

        >
          <div className="flex items-center gap-3 flex-wrap">
            <span className="fk-display text-yellow-300 text-lg font-black tracking-widest flex items-center gap-2">
              <FaBolt /> BIG BILLION DEALS
            </span>
            <div className="hidden sm:flex items-center gap-2 text-white text-xs">
              {[
                { icon: <FaTag size={9} />, text: "Up to 80% Off" },
                { icon: "🚚", text: "Free Delivery ₹499+" },
                { icon: "💳", text: "10% Bank Cashback" },
              ].map(({ icon, text }) => (
                <span key={text}
                  className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-full px-2.5 py-0.5 font-medium">
                  {icon} {text}
                </span>
              ))}
            </div>
          </div>

          {/* Live countdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-white/60 text-xs font-medium hidden sm:block mr-1">Ends in</span>
            {[
              { val: pad(countdown.h), label: "hrs" },
              { val: pad(countdown.m), label: "min" },
              { val: pad(countdown.s), label: "sec" },
            ].map((t, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-yellow-300 font-black text-base leading-none">:</span>}
                <div className="flex flex-col items-center w-8">
                  <span className="timer-digit fk-display text-xl font-black text-yellow-300 leading-none"
                    style={{ animationDelay: `${i * 0.35}s` }}>
                    {t.val}
                  </span>
                  <span className="text-white/45 text-[9px] leading-tight">{t.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── MAIN SWIPER ── */}
        <div className="relative w-full overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center min-h-[320px] ">
              <video autoPlay loop muted className="w-36">
                <source src={Loading} type="video/webm" />
              </video>
            </div>
          ) : (
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Pagination, Autoplay]}
              initialSlide={initialSlide}
              slidesPerView={1}
              loop
              autoplay={{
                delay: 3800,
                disableOnInteraction: true
              }}
              onSlideChange={(s) => setActiveIdx(s.realIndex)}
              className="fk-swiper"
               onTouchStart={(swiper) => swiper.autoplay.stop()}
  onTouchEnd={(swiper) => {
    setTimeout(() => swiper.autoplay.start(), 3000);
  }}
            >
              {orderedData.map((item, idx) => {
                const inCart = cartItem.some(c => String(c.productId) === String(item.id));
                const badge = OFFER_BADGES[idx % OFFER_BADGES.length];
                const { pct, original } = getDiscount(item.price, idx);
                const slideBg = SLIDE_BG_STYLES[idx % SLIDE_BG_STYLES.length];
                const stars = Math.min(5, Math.max(3, Math.round(item.rating || 4)));
                const ratingCount = (1200 + idx * 379).toLocaleString();
                const emiMonthly = Math.round(item.price / 6).toLocaleString("en-IN");

                return (
                  <SwiperSlide key={item.id}>
                    <div className="relative w-full min-h-[15px] sm:min-h-[400px] overflow-hidden"
                     >

                      {/* Decorative blur circles */}
                      <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/20 blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-14 -left-14 w-56 h-56 rounded-full bg-white/15 blur-2xl pointer-events-none" />

                      {/* Diagonal accent panel */}
                      <div className="absolute top-0 right-0 w-2/5 h-full bg-white/10 pointer-events-none"
                        style={{ clipPath: "polygon(28% 0, 100% 0, 100% 100%, 0 100%)" }} />

                      <div className="relative z-10 grid lg:grid-cols-2 gap-6 items-center px-6 sm:px-14 py-8 sm:py-11 max-w-7xl mx-auto">

                        {/* ── INFO PANEL ── */}
                        <div className="slide-info space-y-2 text-justify lg:text-left order-2 lg:order-1">

                          {/* Offer badge */}
                          <div className={`badge-pulse inline-flex items-center gap-1.5 bg-gradient-to-r ${badge.bg} text-white text-[11px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-lg`}>
                            <span className="text-base leading-none">{badge.icon}</span>
                            {badge.label}
                          </div>

                          {/* Title */}
                          <h2
                            className="fk-display text-xl sm:text-4xl  leading-tight cursor-pointer transition-colors duration-200 text-violet-700"

                            onClick={() => navigate(`/products/${item.id}`)}
                            onMouseEnter={e => e.target.style.color = "var(--fk-blue)"}
                            onMouseLeave={e => e.target.style.color = "var(--fk-dark)"}
                          >
                            {item.title}
                          </h2>

                          {/* Description */}
                          <p className="hidden sm:block text-gray-500 text-sm leading-relaxed max-w-sm line-clamp-2">
                            {item.description}
                          </p>

                          {/* Stars + rating chip */}
                          <div className="hidden sm:flex items-center gap-2 justify-center lg:justify-start flex-wrap">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} size={12}
                                  style={{ color: i < stars ? "#ffe500" : "#d1d5db" }} />
                              ))}
                            </div>
                            <span className="rating-pill">{item.rating?.toFixed(1) || "4.2"}</span>
                            <span className="text-gray-400 text-xs">{ratingCount} ratings</span>
                          </div>

                          {/* Price block */}
                          <div className="flex flex-row justify-start items-center flex-wrap">
                            <span className="fk-display text-2xl sm:text-5xl font-black leading-none flex justify-center  text-violet-700">
                              <FaRupeeSign size={31} style={{ marginTop: 9 }} className="hidden sm:flex" />
                              <FaRupeeSign size={18} style={{ marginTop: 3 }} className="flex sm:hidden" />
                              {item.price?.toLocaleString("en-IN")}
                            </span>
                            <div className="flex flex-row  items-center gap-2 sm:gap-0 ml-4">
                              <span className="text-xl line-through leading-none"
                                style={{ color: "var(--fk-grey)" }}>
                                (₹{original.toLocaleString("en-IN")}
                              </span>/
                              <span className="text-green-600 text-sm font-bold leading-none mt-0.5">
                                {pct}% off
                              </span>)
                            </div>
                          </div>

                          {/* Offer chips */}
                          <div className="flex-wrap gap-2 justify-center lg:justify-start hidden sm:flex">
                            {[
                              { border: "border-blue-200", text: "text-blue-700", label: "💳 5% Axis Bank Cashback" },
                              { border: "border-green-200", text: "text-green-700", label: "🚚 Free Delivery" },
                              { border: "border-orange-200", text: "text-orange-700", label: "🔄 10 Day Return" },
                            ].map(({ border, text, label }) => (
                              <div key={label}
                                className={`offer-chip flex items-center gap-1 bg-white/80 border ${border} ${text} text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm`}>
                                {label}
                              </div>
                            ))}
                          </div>

                          {/* EMI */}
                          <p className="text-gray-500 text-xs">
                            No Cost EMI from{" "}
                            <span className="font-semibold" style={{ color: "var(--fk-blue)" }}>
                              ₹{emiMonthly}/mo
                            </span>
                          </p>

                        {/* CTA buttons */}
<div className="flex gap-3 pt-2 w-full">
  
  <button
    onClick={() => (inCart ? navigate("/cart") : handleAddToCart(item))}
    className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm 
    transition-all duration-300 
    ${
      inCart
        ? "bg-blue-600 hover:bg-blue-700"
        : "bg-indigo-600 hover:bg-indigo-700"
    }
    text-white
    shadow-[0_10px_25px_rgba(37,99,235,0.4)]
    hover:shadow-[0_15px_40px_rgba(37,99,235,0.7)]
    hover:-translate-y-1
    active:scale-95
    focus:ring-2 focus:ring-blue-400 focus:outline-none
    relative overflow-hidden`}
  >
    <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition duration-300 blur-md"></span>

    <FaShoppingCart size={16} />
    <span className="sm:hidden">{inCart ? "Cart" : "Add"}</span>
    <span className="hidden sm:inline">
      {inCart ? "Go to Cart" : "Add to Cart"}
    </span>
  </button>

  <button
    onClick={() => navigate(`/products/${item.id}`)}
    className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm 
    bg-white text-indigo-700 border border-indigo-200
    transition-all duration-300
    shadow-[0_10px_25px_rgba(99,102,241,0.25)]
    hover:shadow-[0_15px_40px_rgba(99,102,241,0.6)]
    hover:bg-indigo-600 hover:text-white
    hover:-translate-y-1
    active:scale-95
    focus:ring-2 focus:ring-indigo-300 focus:outline-none
    relative overflow-hidden"
  >
    <span className="absolute inset-0 bg-indigo-500/10 opacity-0 hover:opacity-100 transition duration-300 blur-md"></span>

    <AiOutlineEye size={16} />
    <span className="sm:hidden">View</span>
    <span className="hidden sm:inline">View Details</span>
  </button>

</div>
                        </div>

                        {/* ── IMAGE PANEL ── */}
                        <div className="slide-img flex justify-center items-center order-1 lg:order-2 relative">
                          {/* Discount ribbon */}
                          <div className="absolute top-0 right-0 z-10">
                            <div className="discount-ribbon text-white text-xs font-black px-3 py-1.5 flex items-center gap-1.5">
                              <FaFire size={10} /> {pct}% OFF
                            </div>
                          </div>
                          {/* Glow ring */}
                          <div className="absolute w-69 h-69 sm:w-72 sm:h-69 rounded-full bg-white/55 blur-2xl pointer-events-none" />
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            onClick={() => navigate(`/products/${item.id}`)}
                            className="product-img relative z-10 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] object-contain cursor-pointer"
                            style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.12))" }}
                          />
                        </div>

                      </div>

                      {/* ── STATS STRIP ── */}
                      <div className="hidden sm:flex relative z-10 border-t border-white/40 bg-white/35 backdrop-blur-sm px-6 sm:px-14 py-2.5 w-full max-w-7xl mx-auto items-center gap-6 overflow-x-auto"
                        style={{ scrollbarWidth: "none" }}>
                        {[
                          { icon: "⭐", text: `${item.rating?.toFixed(1) || "4.2"} Rating` },
                          { icon: "🏪", text: `${item.brand || "Official"} Store` },
                          { icon: "📦", text: "In Stock" },
                          { icon: "🔒", text: "Secure Checkout" },
                          { icon: "↩️", text: "Easy Returns" },
                        ].map(({ icon, text }) => (
                          <div key={text}
                            className="stat-strip-item flex items-center gap-1.5 text-gray-600 text-xs font-medium flex-shrink-0 cursor-default">
                            <span>{icon}</span>
                            <span>{text}</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>



      </div>
    </>
  );
};

export default Carousel;