import React, { useEffect, useState, useRef, useCallback } from "react";
import { getData } from "../context/DataContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
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

/* ── helpers ── */
const BADGES = [
  { label:"DEAL OF THE DAY", icon:"⚡", color:"#f59e0b" },
  { label:"TOP DEAL",        icon:"🔥", color:"#ef4444" },
  { label:"BEST SELLER",     icon:"🏆", color:"#6366f1" },
  { label:"LIMITED OFFER",   icon:"⏳", color:"#8b5cf6" },
  { label:"TRENDING NOW",    icon:"📈", color:"#10b981" },
];

/* accent colours per slide — used for glows, text accents, rings */
const ACCENTS = [
  { h:"#4f46e5", l:"rgba(99,102,241,.18)", ring:"rgba(99,102,241,.35)"  },
  { h:"#be185d", l:"rgba(236,72,153,.15)", ring:"rgba(236,72,153,.30)"  },
  { h:"#0891b2", l:"rgba(6,182,212,.15)",  ring:"rgba(6,182,212,.30)"   },
  { h:"#d97706", l:"rgba(245,158,11,.15)", ring:"rgba(245,158,11,.30)"  },
  { h:"#7c3aed", l:"rgba(124,58,237,.15)", ring:"rgba(124,58,237,.30)"  },
];

const getDiscount = (price, seed) => {
  const pcts = [10,15,20,25,30,35,40,45,50];
  const pct  = pcts[seed % pcts.length];
  return { pct, original: Math.round(price / (1 - pct/100)) };
};

const useCountdown = (h=8,m=32,s=14) => {
  const [t,setT] = useState({h,m,s});
  useEffect(()=>{
    const id = setInterval(()=>setT(p=>{
      if(p.s>0) return{...p,s:p.s-1};
      if(p.m>0) return{...p,m:p.m-1,s:59};
      if(p.h>0) return{h:p.h-1,m:59,s:59};
      return{h:8,m:32,s:14};
    }),1000);
    return ()=>clearInterval(id);
  },[]);
  return t;
};

const pad = n => String(n).padStart(2,"0");

/* ══════════════════════════════════
   STYLES
══════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

:root{
  --f-title: 'Bricolage Grotesque', sans-serif;
  --f-badge: 'Bebas Neue', cursive;
  --f-price: 'Space Grotesk', sans-serif;
  --f-body:  'Plus Jakarta Sans', sans-serif;
}

/* ── shared reset ── */
.cw-root*{box-sizing:border-box;}
.cw-root {font-family:var(--f-body); user-select:none;}

/* ══════════════════════════
   OFFER BAR
══════════════════════════ */
.cw-bar{
  background: linear-gradient(
    90deg,
    indigo,
    blue
     
  );
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.18);
  padding: 8px 20px;
  display: flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  // flex-wrap:wrap;
}
.cw-bar-brand{
  font-family:var(--f-badge);
  font-size:17px; letter-spacing:.16em;
  color:#fbbf24;
  display:flex; align-items:center; gap:7px;
}
.cw-bar-chip{
  display:flex; align-items:center;
  justify-content:center;
  gap:4px;
  background:rgba(255,255,255,0.12);
  border:1px solid rgba(255,255,255,0.20);
  border-radius:100px; padding:3px 10px;
  font-family:var(--f-body);
  font-size:11px; font-weight:600; color:rgba(255,255,255,.85);
  white-space:nowrap;
}
.cw-bar-countdown{display:flex;align-items:center;gap:5px;}
.cw-bar-sep{
  font-family:var(--f-price);
  font-weight:700; font-size:16px; color:#fbbf24; line-height:1;
}
.cw-cd-box{
  display:flex; flex-direction:column; align-items:center;
  background:rgba(255,255,255,0.10);
  border:1px solid rgba(255,255,255,0.15);
  border-radius:8px; padding:2px 8px; min-width:38px;
}
.cw-cd-num{
  font-family:var(--f-price);
  font-weight:700; font-size:18px; color:#fbbf24; line-height:1.1;
  animation:cwTick 1s ease-in-out infinite;
}
.cw-cd-lbl{font-family:var(--f-body);font-size:8px;color:yellow;letter-spacing:.05em;}
@keyframes cwTick{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}


/* ══════════════════════════════════════════
   DESKTOP CAROUSEL  ≥ 768 px
   Style: Asymmetric split — bold text left,
   floating product card right, number accent
══════════════════════════════════════════ */
.cw-desktop{display:block;}
.cw-mobile {display:none;}
@media(max-width:767px){
  .cw-desktop{display:none;}
  .cw-mobile {display:block;}
}

/* Swiper nav — desktop */
.cw-desk-swiper .swiper-button-next,
.cw-desk-swiper .swiper-button-prev{
  width:44px; height:44px; border-radius:50%;
  background:rgba(255,255,255,0.18);
  backdrop-filter:blur(12px);
  border:1px solid rgba(255,255,255,0.25);
  color:violet;
  top:50%; transform:translateY(-50%);
  transition:all .22s;
}
.cw-desk-swiper .swiper-button-next:hover,
.cw-desk-swiper .swiper-button-prev:hover{
  background:rgba(255,255,255,0.30);
  transform:translateY(-50%) scale(1.08);
}
.cw-desk-swiper .swiper-button-next::after,
.cw-desk-swiper .swiper-button-prev::after{font-size:13px;font-weight:900;}
.cw-desk-swiper .swiper-button-next{right:20px;}
.cw-desk-swiper .swiper-button-prev{left:20px;}
.cw-desk-swiper .swiper-pagination{bottom:16px;}
.cw-desk-swiper .swiper-pagination-bullet{
  background:rgba(255,255,255,.45); width:7px; height:7px; transition:all .3s;
}
.cw-desk-swiper .swiper-pagination-bullet-active{
  background:white; width:26px; border-radius:4px;
}

/* desktop slide */
.cw-ds{
  position:relative;
  min-height:440px;
  background:transparent;
  display:flex; align-items:stretch;
  overflow:hidden;
}

/* giant slide number */
.cw-ds-num{
  position:absolute;
  bottom:-30px; left:24px;
  font-family:var(--f-badge);
  font-size:clamp(120px,18vw,200px);
  line-height:1;
  color:rgba(255,255,255,0.06);
  pointer-events:none; z-index:0;
  letter-spacing:-.02em;
}

/* left text pane */
.cw-ds-left{
  flex:0 0 52%; max-width:52%;
  padding:44px 32px 44px 60px;
  display:flex; flex-direction:column; justify-content:center;
  gap:16px; position:relative; z-index:2;
  animation:cwSlideLeft .55s cubic-bezier(.22,1,.36,1) both;
}
@keyframes cwSlideLeft{from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:translateX(0)}}

/* accent line */
.cw-ds-accentline{
  width:48px; height:4px; border-radius:2px;
  margin-bottom:-4px;
}

/* badge pill */
.cw-ds-badge{
  display:inline-flex; align-items:center; gap:6px;
  border-radius:100px; padding:5px 14px;
  font-family:var(--f-badge);
  font-size:13px; letter-spacing:.12em;
  color:white; width:fit-content;
  animation:cwPulse 2.4s ease-in-out infinite;
}
@keyframes cwPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}

.cw-ds-title{
  font-family:var(--f-title);
  font-size:clamp(1.6rem,3.2vw,2.8rem);
  font-weight:800;
  line-height:1.08;
  letter-spacing:-.025em;

  background: linear-gradient(90deg, indigo, blue);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  cursor:pointer;
  transition:opacity .2s;
  text-shadow:0 2px 24px rgba(0,0,0,.18);
}
.cw-ds-title:hover{opacity:.85;}

.cw-ds-desc{
  font-family:var(--f-body);
  font-size:13.5px; font-weight:400;
  color:blue;
  line-height:1.6; max-width:360px;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
}

/* stars */
.cw-ds-stars{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.cw-ds-rpill{
  font-family:var(--f-price); font-size:10.5px; font-weight:700;
  background:#16a34a; color:white; padding:2px 8px; border-radius:5px;
  display:flex;align-items:center;gap:3px;
}
.cw-ds-rcount{font-family:var(--f-body);font-size:11.5px;color:blue;}

/* price */
/* price */
.cw-ds-price-row{
  display:flex;
  align-items:baseline;
  gap:10px;
  flex-wrap:wrap;
}

.cw-ds-price{
  font-family:var(--f-price);
  font-weight:700;
  font-size:clamp(2rem,4vw,3.2rem);
  color:#6366f1; /* indigo-500 */
  line-height:1;
  display:flex;
  align-items:flex-start;
  gap:3px;
  text-shadow:0 2px 18px rgba(99,102,241,.25); /* indigo glow */
}

.cw-ds-price-sym{
  font-size:.52em;
  margin-top:.26em;
}

.cw-ds-orig{
  font-family:var(--f-price);
  font-size:.95rem;
  color:gray; /* indigo-200 muted */
  text-decoration:line-through;
}

.cw-ds-pct{
  font-family:var(--f-price);
  font-weight:700;
  font-size:.85rem;
  color:#60a5fa; /* blue-400 */
}
/* trust chips */
.cw-ds-chips{display:flex;flex-wrap:wrap;gap:7px;}
.cw-ds-chip{
  display:flex;align-items:center;gap:4px;
  background:lightgray;
  border:1px solid rgba(255,255,255,0.18);
  border-radius:100px; padding:4px 11px;
  font-family:var(--f-body);
  font-size:11px; font-weight:600; color:#6366f9;
  transition:background .18s;
}
.cw-ds-chip:hover{background:rgba(255,255,255,.18);}

/* EMI */
.cw-ds-emi{font-family:var(--f-body);font-size:12px;color:#6366f1;}
.cw-ds-emi b{font-family:var(--f-price);font-weight:600;color:#6366f1;}

/* CTAs */
.cw-ds-btns{display:flex;gap:10px;flex-wrap:wrap;}
.cw-ds-btn-p{
  display:flex;align-items:center;justify-content:center;gap:8px;
  padding:12px 24px; border:none; border-radius:14px;
  font-family:var(--f-body); font-size:14px; font-weight:700;
  color:white; cursor:pointer;
  transition:transform .18s,box-shadow .18s,filter .18s;
  position:relative;overflow:hidden;
  min-width:140px;
}
.cw-ds-btn-p::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.2) 50%,transparent 70%);
  background-size:200% 100%;
  animation:cwShim 2.6s ease-in-out infinite;
}
@keyframes cwShim{0%{background-position:-200% center}100%{background-position:200% center}}
.cw-ds-btn-p:hover{transform:translateY(-2px);filter:brightness(1.08);}
.cw-ds-btn-p:active{transform:scale(.97);}

.cw-ds-btn-s{
  display:flex;align-items:center;justify-content:center;gap:7px;
  padding:12px 20px; border-radius:14px;
  font-family:var(--f-body); font-size:14px; font-weight:600;
  background:lightgray;
  border:1.5px solid rgba(255,255,255,0.25);
  color:#6366f9; cursor:pointer;
  backdrop-filter:blur(8px);
  transition:background .18s,transform .18s;
}
.cw-ds-btn-s:hover{color:#6366f3;transform:translateY(-1px);}

/* right image pane */
.cw-ds-right{
  flex:0 0 48%; max-width:48%;
  display:flex; align-items:center; justify-content:center;
  position:relative; z-index:2; padding:30px 48px 30px 0;
  animation:cwImgIn .58s cubic-bezier(.22,1,.36,1) both;
}
@keyframes cwImgIn{from{opacity:0;transform:scale(.84)}to{opacity:1;transform:scale(1)}}

/* floating card behind image */
.cw-ds-float{
  position:absolute; inset:20px;
  border-radius:28px;
  background:rgba(255,255,255,0.07);
  backdrop-filter:blur(8px);
  border:1px solid rgba(255,255,255,0.15);
  z-index:0;
}

/* product image */
.cw-ds-img{
  position:relative; z-index:1;
  width:clamp(200px,28vw,320px); height:clamp(200px,28vw,320px);
  object-fit:contain;
  filter:drop-shadow(0 20px 48px rgba(0,0,0,.22));
  transition:transform .44s cubic-bezier(.34,1.2,.64,1);
  cursor:pointer;
}
.cw-ds-img:hover{transform:scale(1.1) translateY(-10px);}

/* ribbon */
.cw-ds-ribbon{
  position:absolute; top:16px; right:16px; z-index:3;
  font-family:var(--f-badge); font-size:12px; letter-spacing:.08em;
  background:linear-gradient(135deg,#f97316,#ef4444);
  color:white; padding:5px 12px 5px 10px;
  border-radius:8px 0 0 8px;
  display:flex;align-items:center;gap:4px;
  box-shadow:0 3px 12px rgba(239,68,68,.35);
}

/* stats strip */
.cw-ds-strip{
  background:rgba(255,255,255,0.08);
  backdrop-filter:blur(14px);
  border-top:1px solid rgba(255,255,255,0.10);
  padding:9px 60px;
  display:flex;align-items:center;gap:24px;
  overflow-x:auto; scrollbar-width:none;
}
.cw-ds-strip::-webkit-scrollbar{display:none;}
.cw-ds-strip-item{
  display:flex;align-items:center;gap:6px;
  font-family:var(--f-body); font-size:12px; font-weight:500;
  color:rgba(255,255,255,.6); flex-shrink:0;
  transition:color .18s; cursor:default;
}
.cw-ds-strip-item:hover{color:rgba(255,255,255,.9);}
.cw-ds-strip-dot{width:3px;height:3px;border-radius:50%;background:rgba(255,255,255,.25);flex-shrink:0;}


/* ══════════════════════════════════════════════
   MOBILE CAROUSEL  < 768 px
   Style: Stacked card — product image top (large),
   info below, swipe-friendly, thumb-reachable CTA
══════════════════════════════════════════════ */
.cw-mob-swiper .swiper-pagination{bottom:12px;}
.cw-mob-swiper .swiper-pagination-bullet{
  background:rgba(255,255,255,.50); width:6px; height:6px; transition:all .3s;
}
.cw-mob-swiper .swiper-pagination-bullet-active{
  background:white; width:20px; border-radius:4px;
}

/* mobile slide card */
.cw-ms{
  margin:0 4px;
  background:rgba(255,255,255,0.11);
  backdrop-filter:blur(18px);
  border:1px solid rgba(255,255,255,0.20);
  border-radius:24px;
  overflow:hidden;
  position:relative;
  animation:cwMobIn .42s ease both;
}
@keyframes cwMobIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

/* mobile image zone */
.cw-ms-img-zone{
  position:relative;
  height:260px;
  background:transparent;
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;
}
.cw-ms-img-zone::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(circle at 50% 60%,rgba(255,255,255,.12) 0%,transparent 70%);
}
.cw-ms-img{
  width:300px; height:300px; object-fit:contain;
  position:relative; z-index:1;
  filter:drop-shadow(0 12px 28px rgba(0,0,0,.18));
  transition:transform .38s cubic-bezier(.34,1.2,.64,1);
}
.cw-ms:hover .cw-ms-img{transform:scale(1.07) translateY(-4px);}

/* mobile badge top-left */
.cw-ms-badge{
  position:absolute; top:12px; left:12px; z-index:3;
  font-family:var(--f-badge); font-size:11px; letter-spacing:.10em;
  padding:4px 11px; border-radius:100px; color:white;
  display:flex;align-items:center;gap:4px;
  box-shadow:0 2px 10px rgba(0,0,0,.20);
}
/* mobile discount top-right */
.cw-ms-disc{
  position:absolute; top:12px; right:12px; z-index:3;
  font-family:var(--f-badge); font-size:12px; letter-spacing:.06em;
  background:linear-gradient(135deg,#f97316,#ef4444);
  color:white; padding:4px 10px; border-radius:100px;
  display:flex;align-items:center;gap:3px;
  box-shadow:0 2px 10px rgba(239,68,68,.35);
}

/* mobile body */
.cw-ms-body{padding:14px 16px 18px;}

/* brand */
.cw-ms-brand{
  font-family:var(--f-body);
  font-size:10px;
  font-weight:800;
  color:#6366f9; /* indigo-200 */
  text-transform:uppercase;
  letter-spacing:.08em;
  margin-bottom:5px;
}

/* title with gradient text */
.cw-ms-title{
  font-family:var(--f-title);
  font-weight:800;
  font-size:1.15rem;
  line-height:1.15;
  letter-spacing:-.02em;

  background:linear-gradient(90deg,#6366f1,#3b82f6); /* indigo → blue */
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;

  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
  overflow:hidden;

  margin-bottom:8px;
  cursor:pointer;
  transition:all .25s ease;
}

/* hover effect */
.cw-ms-title:hover{
  background:linear-gradient(90deg,#818cf8,#60a5fa); /* brighter gradient */
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

/* mobile stars + price row */
.cw-ms-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;}
.cw-ms-stars{display:flex;align-items:center;gap:4px;}
.cw-ms-rpill{
  font-family:var(--f-price);font-size:10px;font-weight:700;
  background:#16a34a;color:white;padding:1px 6px;border-radius:4px;
  display:flex;align-items:center;gap:2px;
}

/* price block */
.cw-ms-price-block{
  display:flex;
  flex-direction:column;
  align-items:flex-end;
}

/* main price with gradient */
.cw-ms-price{
  font-family:var(--f-price);
  font-weight:700;
  font-size:1.4rem;
  line-height:1;
  display:flex;
  align-items:flex-start;
  gap:2px;

  background:linear-gradient(90deg,#6366f1,#3b82f6); /* indigo → blue */
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

/* currency symbol */
.cw-ms-price-sym{
  font-size:.56em;
  margin-top:.22em;
}

/* sub text */
.cw-ms-price-sub{
  font-family:var(--f-price);
  font-size:11px;
  color:rgba(165,180,252,.6); /* indigo muted */
  display:flex;
  align-items:center;
  gap:5px;
}

/* original price */
.cw-ms-orig{
  text-decoration:line-through;
}

/* discount */
.cw-ms-off{
  color:#60a5fa; /* blue-400 instead of green */
  font-weight:700;
}

/* mobile trust */
/* trust container */
.cw-ms-trust{
  display:flex;
  gap:7px;
  flex-wrap:wrap;
  margin-bottom:12px;
}

/* trust item */
.cw-ms-trust-item{
  display:flex;
  align-items:center;
  gap:3px;

  background:rgba(99,102,241,0.12); /* indigo glass */
  border:1px solid rgba(99,102,241,0.25);
  border-radius:100px;
  padding:3px 9px;

  font-family:var(--f-body);
  font-size:10px;
  font-weight:600;
  color:#6366f9; /* indigo-200 */

  backdrop-filter:blur(6px);
  transition:all .2s ease;
}

/* hover effect */
.cw-ms-trust-item:hover{
  background:rgba(99,102,241,0.2);
  border-color:rgba(99,102,241,0.4);
  color:#6366f9; /* indigo-200 */
}

/* mobile CTA */
.cw-ms-btns{display:flex;gap:8px;}
.cw-ms-btn-p{
  flex:1;display:flex;align-items:center;justify-content:center;gap:7px;
  padding:11px 0; border:none; border-radius:13px;
  font-family:var(--f-body);font-size:13.5px;font-weight:700;
  color:white; cursor:pointer;
  position:relative;overflow:hidden;
  transition:transform .18s,box-shadow .18s,filter .18s;
}
.cw-ms-btn-p::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.18) 50%,transparent 70%);
  background-size:200% 100%;
  animation:cwShim 2.6s ease-in-out infinite;
}
.cw-ms-btn-p:hover{filter:brightness(1.09);transform:translateY(-1px);}
.cw-ms-btn-p:active{transform:scale(.96);}
/* small button */
.cw-ms-btn-s{
  display:flex;
  align-items:center;
  justify-content:center;
  width:50px;
  border-radius:13px;
  flex-shrink:0;

  background:rgba(99,102,241,0.15); /* indigo glass */
  border:1.5px solid rgba(99,102,241,0.35);

  color:#6366f9; /* indigo-200 */
  cursor:pointer;

  backdrop-filter:blur(6px);
  transition:all .2s ease;
}

/* hover */
.cw-ms-btn-s:hover{
  background:linear-gradient(135deg,#6366f1,#3b82f6); /* indigo → blue */
  border-color:transparent;
  color:white;
  transform:scale(1.06);
  box-shadow:0 6px 20px rgba(99,102,241,.35);
}
/* ── loading ── */
.cw-loading{display:flex;justify-content:center;align-items:center;min-height:320px;}
`;

/* ══════════════════════════════════
   COMPONENT
══════════════════════════════════ */
export default function Carousel() {
  const { data, fetchAllProducts } = getData();
  const { addToCart, cartItem }     = useCart();
  const { isSignedIn }              = useUser();
  const navigate                    = useNavigate();
  // const [loading, setLoading]       = useState(true);
  const countdown                   = useCountdown();
useEffect(()=>{
  const id = "cw-styles";

  if(!document.getElementById(id)){
    const el = document.createElement("style");
    el.id = id;
    el.textContent = CSS;
    document.head.appendChild(el);
  }

  if(!data || data.length === 0){
    fetchAllProducts();
  }
},[]);
  // useEffect(()=>{
  //   const id = "cw-styles";
  //   if(!document.getElementById(id)){
  //     const el = document.createElement("style"); el.id=id; el.textContent=CSS;
  //     document.head.appendChild(el);
  //   }
  //   if(!data||data.length===0) fetchAllProducts().finally(()=>setLoading(false));
  //   else setLoading(false);
  // },[]);

  const orderedData  = data||[];
  const initialSlide = Math.max(0,orderedData.findIndex(d=>d.id===83));

  const handleCart = useCallback((item,e)=>{
    e?.stopPropagation();
    if(!isSignedIn){ toast.error("Please login first"); setTimeout(()=>navigate("/sign-in"),800); return; }
    if(cartItem.some(c=>String(c.productId)===String(item.id))){
      toast.info("Already in cart 🛒"); setTimeout(()=>navigate("/cart"),300); return;
    }
    addToCart(item); toast.success("Added to cart 🛒");
  },[isSignedIn,cartItem,addToCart,navigate]);

  const inCart = item => cartItem.some(c=>String(c.productId)===String(item.id));

  const SWIPER_COMMON = {
    initialSlide,
    slidesPerView:1,
    loop:true,
    autoplay:{delay:3800,disableOnInteraction:true},
    pagination:{clickable:true},
    onTouchStart:sw=>sw.autoplay.stop(),
    onTouchEnd:sw=>setTimeout(()=>sw.autoplay.start(),3000),
  };

  return (
    <div className="cw-root">

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
          <div className="flex items-center gap-3 flex-no-wrap">
            <span className="fk-display text-yellow-300 text-sm sm:text-lg font-black tracking-widest flex items-center gap-2">
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


      {/* ══════════════════════════════════════
          DESKTOP CAROUSEL
      ══════════════════════════════════════ */}
      <div className="cw-desktop">
        <Swiper
          {...SWIPER_COMMON}
          modules={[Pagination,Autoplay]}
          navigation
          className="cw-desk-swiper"
        >
          {orderedData.map((item,idx)=>{
            const badge   = BADGES[idx%BADGES.length];
            const accent  = ACCENTS[idx%ACCENTS.length];
            const {pct,original} = getDiscount(item.price,idx);
            const stars   = Math.min(5,Math.max(3,Math.round(item.rating||4)));
            const rCount  = (1200+idx*379).toLocaleString();
            const emi     = Math.round(item.price/6).toLocaleString("en-IN");
            const added   = inCart(item);

            return (
              <SwiperSlide key={item.id}>
                <div className="cw-ds">
                  {/* giant bg number */}
                  <div className="cw-ds-num">{String(idx+1).padStart(2,"0")}</div>

                  {/* accent glow blob */}
                  <div style={{
                    position:"absolute",top:-80,right:-60,
                    width:420,height:420,borderRadius:"50%",
                    background:accent.l,filter:"blur(80px)",
                    pointerEvents:"none",zIndex:1,
                  }}/>

                  {/* ── LEFT ── */}
                  <div className="cw-ds-left">
                    <div className="cw-ds-accentline" style={{background:accent.h}}/>

                    <div className="cw-ds-badge" style={{background:accent.h}}>
                      <span style={{fontSize:14}}>{badge.icon}</span>
                      <span className="cw-badge-label" style={{fontFamily:"var(--f-badge)",fontSize:13,letterSpacing:".12em"}}>{badge.label}</span>
                    </div>

                    <h2 className="cw-ds-title " onClick={()=>navigate(`/products/${item.id}`)}>
                      {item.title}
                    </h2>

                    <p className="cw-ds-desc">{item.description}</p>

                    <div className="cw-ds-stars">
                      {[...Array(5)].map((_,i)=>(
                        <FaStar key={i} size={12} color={i<stars?"orange":"lightgray"}/>
                      ))}
                      <span className="cw-ds-rpill">{item.rating?.toFixed(1)||"4.2"} <FaStar size={8}/></span>
                      <span className="cw-ds-rcount">({rCount})</span>
                    </div>

                    <div className="cw-ds-price-row">
                      <span className="cw-ds-price">
                        <span className="cw-ds-price-sym"><FaRupeeSign/></span>
                        {item.price?.toLocaleString("en-IN")}
                      </span>
                      <span className="cw-ds-orig">₹{original.toLocaleString("en-IN")}</span>
                      <span className="cw-ds-pct">{pct}% off</span>
                    </div>

                    <div className="cw-ds-chips">
                      {[
                        {icon:<FaTruck size={9}/>,  t:"Free Delivery"},
                        {icon:<FaShieldAlt size={9}/>,t:"Secure Pay"},
                        {icon:"🔄",                 t:"10-Day Return"},
                      ].map(({icon,t})=>(
                        <span key={t} className="cw-ds-chip">{icon} {t}</span>
                      ))}
                    </div>

                    <p className="cw-ds-emi">No Cost EMI from <b>₹{emi}/mo</b></p>

                    <div className="cw-ds-btns">
                      <button
                        className="cw-ds-btn-p"
                        style={{background:`linear-gradient(135deg,${accent.h},#2563eb)`,boxShadow:`0 4px 22px ${accent.ring}`}}
                        onClick={e=>added?navigate("/cart"):handleCart(item,e)}
                      >
                        <FaShoppingCart size={14}/>
                        {added?"Go to Cart":"Add to Cart"}
                      </button>
                      <button className="cw-ds-btn-s" onClick={()=>navigate(`/products/${item.id}`)}>
                        <AiOutlineEye size={16}/> Details
                      </button>
                    </div>
                  </div>

                  {/* ── RIGHT ── */}
                  <div className="cw-ds-right">
                    <div className="cw-ds-float"/>
                    {/* glow ring */}
                    <div style={{
                      position:"absolute",
                      width:280,height:280,borderRadius:"50%",
                      background:accent.l,filter:"blur(36px)",
                      zIndex:0,pointerEvents:"none",
                    }}/>
                    <div className="cw-ds-ribbon">
                      <FaFire size={9}/> {pct}% OFF
                    </div>
                    <img
                      src={item.thumbnail} alt={item.title}
                      className="cw-ds-img"
                      onClick={()=>navigate(`/products/${item.id}`)}
                    />
                  </div>
                </div>

                {/* stats strip */}
                <div className="cw-ds-strip">
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
                </div>

              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* ══════════════════════════════════════
          MOBILE CAROUSEL — completely different
          Full-bleed card, image top, info bottom
      ══════════════════════════════════════ */}
      <div className="cw-mobile" style={{padding:"14px 8px 20px"}}>
        <Swiper
          {...SWIPER_COMMON}
          modules={[Autoplay]}
          className="cw-mob-swiper"
          style={{paddingBottom:36}}
        >
          {orderedData.map((item,idx)=>{
            const badge  = BADGES[idx%BADGES.length];
            const accent = ACCENTS[idx%ACCENTS.length];
            const {pct,original} = getDiscount(item.price,idx);
            const stars  = Math.min(5,Math.max(3,Math.round(item.rating||4)));
            const added  = inCart(item);

            return (
              <SwiperSlide key={item.id}>
                <div className="cw-ms" style={{animationDelay:`${idx*.03}s`}}>
                  {/* accent glow inside card */}
                  <div style={{
                    position:"absolute",top:-40,right:-40,
                    width:200,height:200,borderRadius:"50%",
                    background:accent.l,filter:"blur(50px)",
                    pointerEvents:"none",zIndex:0,
                  }}/>

                  {/* image zone */}
                  <div className="cw-ms-img-zone">
                    <div className="cw-ms-badge" style={{background:accent.h}}>
                      {badge.icon} <span style={{fontFamily:"var(--f-badge)",fontSize:11,letterSpacing:".10em"}}>{badge.label}</span>
                    </div>
                    <div className="cw-ms-disc">
                      <FaFire size={9}/> {pct}% OFF
                    </div>
                    <img
                      src={item.thumbnail} alt={item.title}
                      className="cw-ms-img"
                      onClick={()=>navigate(`/products/${item.id}`)}
                    />
                  </div>

                  {/* body */}
                  <div className="cw-ms-body" style={{position:"relative",zIndex:1}}>
                    <div className="cw-ms-brand">{item.brand||item.category||"Brand"}</div>
                    <div className="cw-ms-title" onClick={()=>navigate(`/products/${item.id}`)}>
                      {item.title}
                    </div>

                    <div className="cw-ms-meta">
                      {/* stars left */}
                      <div className="cw-ms-stars">
                        {[...Array(5)].map((_,i)=>(
                          <FaStar key={i} size={11} color={i<stars?"#fbbf24":"lightgray"}/>
                        ))}
                        <span className="cw-ms-rpill" style={{marginLeft:4}}>
                          {item.rating?.toFixed(1)||"4.2"} <FaStar size={8}/>
                        </span>
                      </div>
                      {/* price right */}
                      <div className="cw-ms-price-block">
                        <span className="cw-ms-price">
                          <span className="cw-ms-price-sym"><FaRupeeSign/></span>
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
                        {icon:<FaTruck size={9}/>,t:"Free Delivery"},
                        {icon:<FaShieldAlt size={9}/>,t:"Secure Pay"},
                        {icon:"🔄",t:"10-Day Return"},
                      ].map(({icon,t})=>(
                        <span key={t} className="cw-ms-trust-item">{icon} {t}</span>
                      ))}
                    </div>

                    <div className="cw-ms-btns">
                      <button
                        className="cw-ms-btn-p"
                        style={{
                          background:`linear-gradient(135deg,${accent.h},#2563eb)`,
                          boxShadow:`0 4px 18px ${accent.ring}`,
                        }}
                        onClick={e=>added?navigate("/cart"):handleCart(item,e)}
                      >
                        <FaShoppingCart size={13}/>
                        {added?"Go to Cart":"Add to Cart"}
                      </button>
                      <button
                        className="cw-ms-btn-s"
                        onClick={()=>navigate(`/products/${item.id}`)}
                      >
                        <AiOutlineEye size={16}/>
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