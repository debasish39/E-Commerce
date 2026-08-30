import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrums from "../components/Breadcrums";
import Loading from "../assets/Loading4.webm";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/wishlistContext";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure, ModalFooter, Button
} from "@heroui/react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaImages,
  FaExpand,
} from "react-icons/fa";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import {
  FaShoppingCart, FaHeart, FaRegHeart,
  FaStar, FaStarHalfAlt, FaRegStar,
  FaTag, FaTruck, FaUndoAlt, FaLock,
  FaIndustry, FaListAlt, FaRupeeSign,
  FaCheckCircle, FaShieldAlt,
  FaUser, FaPaperPlane, FaThumbsUp, FaThumbsDown, FaTrash,
  FaBoxOpen, FaLayerGroup, FaInfoCircle, FaCog, FaComments,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { SlActionRedo } from "react-icons/sl";
import { AiOutlineZoomIn } from "react-icons/ai";
import { MdVerified } from "react-icons/md";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
/* ─── colour map ─── */
const COLOR_MAP = {
  Blue: "#3b82f6", Black: "#1f2937", White: "#e5e7eb", Red: "#ef4444",
  Green: "#22c55e", Grey: "#9ca3af", Yellow: "#fbbf24", Brown: "#92400e",
  Pink: "#f472b6", Purple: "#a855f7", Orange: "#f97316", Navy: "#1e3a5f",
};

/* ─── Stars ─── */
const Stars = ({ rating = 0, size = 13, interactive = false, onRate, hover = 0, setHover }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map(i => {
      const lit = interactive ? i <= (hover || rating) : i <= rating;
      const half = !lit && !interactive && rating >= i - .5;
      const Icon = lit ? FaStar : half ? FaStarHalfAlt : FaRegStar;
      return interactive ? (
        <button key={i} type="button"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: lit ? "#fbbf24" : "#d1d5db", transition: "transform .15s,color .15s" }}
          onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}
          onClick={() => onRate(i)}>
          <Icon size={size} />
        </button>
      ) : <Icon key={i} size={size} color={(lit || half) ? "#fbbf24" : "#d1d5db"} />;
    })}
  </div>
);

/* ─── CSS (no :root changes) ─── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=JetBrains+Mono:wght@600;700&display=swap');

/* ══ ALL NEW CLASSES — NO :root TOUCH ══ */

/* base */
.sp { font-family:var(--fb); }
.sp-bg {
  min-height:100vh; overflow-x:hidden;
  background:linear-gradient(160deg,#f0effd 0%,#eaf0ff 45%,#f8f9ff 100%);
  position:relative;
}

/* ambient orbs */
.sp-orb { position:fixed; border-radius:50%; filter:blur(90px); pointer-events:none; z-index:0; }
.sp-o1 { width:500px;height:500px;top:-160px;left:-110px;background:radial-gradient(circle,rgba(80,70,228,.15) 0%,transparent 65%);animation:spO 13s ease-in-out infinite alternate; }
.sp-o2 { width:420px;height:420px;bottom:-130px;right:-90px;background:radial-gradient(circle,rgba(59,130,246,.12) 0%,transparent 65%);animation:spO 16s ease-in-out infinite alternate reverse; }
.sp-o3 { width:300px;height:300px;top:40%;left:60%;background:radial-gradient(circle,rgba(124,58,237,.07) 0%,transparent 65%);animation:spO 18s ease-in-out infinite alternate; }
@keyframes spO { from{transform:translate(0,0)} to{transform:translate(18px,14px)} }
.sp-grid { position:fixed;inset:0;z-index:0;pointer-events:none;background-image:radial-gradient(circle,rgba(80,70,228,.045) 1px,transparent 1px);background-size:32px 32px; }

/* animations */
@keyframes spFU  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
@keyframes spFR  { from{opacity:0;transform:translateX(-22px)} to{opacity:1;transform:translateX(0)} }
@keyframes spFL  { from{opacity:0;transform:translateX(22px)} to{opacity:1;transform:translateX(0)} }
@keyframes spSh  { 0%{background-position:-200% center} 100%{background-position:200% center} }
@keyframes spSpin{ to{transform:rotate(360deg)} }
@keyframes spPop { 0%{opacity:0;transform:scale(.90)} 100%{opacity:1;transform:scale(1)} }
@keyframes spPulse{ 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }

.sp-fu { animation:spFU .50s cubic-bezier(.22,1,.36,1) both; }
.sp-fr { animation:spFR .55s cubic-bezier(.22,1,.36,1) both; }
.sp-fl { animation:spFL .55s cubic-bezier(.22,1,.36,1) .09s both; }

/* ══ MAIN LAYOUT — 2-col sticky ══ */
.spx-wrap {
  position:relative; z-index:1;
  max-width:1280px; margin:0 auto;
  padding:24px 22px 88px;
  display:grid;
  grid-template-columns:minmax(0,460px) minmax(0,1fr);
  gap:40px; align-items:start;
}
@media(max-width:900px){ .spx-wrap{ grid-template-columns:1fr; gap:22px; } }

.spx-left { position:sticky; top:72px; display:flex; flex-direction:column; gap:14px; }
@media(max-width:900px){ .spx-left{ position:static; } }
.spx-right { display:flex; flex-direction:column; gap:16px; }

.rv-toggle-wrap {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px;
  background: rgba(255,255,255,.90); border: 1px solid rgba(80,70,228,.11);
  border-radius: 18px; cursor: pointer;
  transition: all .22s cubic-bezier(.22,1,.36,1);
  user-select: none;
}
.rv-toggle-wrap:hover { background: white; border-color: rgba(80,70,228,.22); box-shadow: 0 4px 16px rgba(80,70,228,.09); }
.rv-toggle-left { display: flex; align-items: center; gap: 12px; }
.rv-toggle-icon {
  width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.rv-toggle-chevron {
  width: 28px; height: 28px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(80,70,228,.07); color: #5046e4;
  transition: transform .28s cubic-bezier(.22,1,.36,1), background .18s;
}
.rv-toggle-chevron.open { transform: rotate(180deg); background: rgba(80,70,228,.13); }
 
.rv-form-panel {
  overflow: hidden;
  transition: max-height .40s cubic-bezier(.22,1,.36,1), opacity .30s ease;
}
.rv-form-panel.closed { max-height: 0; opacity: 0; pointer-events: none; }
.rv-form-panel.open   { max-height: 1200px; opacity: 1; }
 
.rv-upload-zone {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 120px; border: 1.5px dashed rgba(80,70,228,.25); border-radius: 14px;
  cursor: pointer; background: rgba(80,70,228,.03);
  transition: all .20s cubic-bezier(.22,1,.36,1);
  position: relative; overflow: hidden;
}
.rv-upload-zone:hover {
  border-color: rgba(80,70,228,.50); background: rgba(80,70,228,.06);
  transform: translateY(-1px); box-shadow: 0 4px 16px rgba(80,70,228,.10);
}
.rv-upload-zone input[type=file] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
.rv-upload-icon {
  width: 40px; height: 40px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(80,70,228,.09); margin-bottom: 8px;
  transition: transform .18s;
}
.rv-upload-zone:hover .rv-upload-icon { transform: scale(1.10); }
 
.rv-thumb-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.rv-thumb-item { position: relative; width: 76px; height: 76px; border-radius: 11px; overflow: visible; flex-shrink: 0; }
.rv-thumb-item img { width: 76px; height: 76px; object-fit: cover; border-radius: 11px; border: 1.5px solid rgba(80,70,228,.12); display: block; }
.rv-thumb-del {
  position: absolute; top: -6px; right: -6px; z-index: 2;
  width: 22px; height: 22px; border-radius: 50%;
  background: #ef4444; border: 2px solid white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; box-shadow: 0 2px 6px rgba(239,68,68,.30);
  transition: transform .15s;
}
.rv-thumb-del:hover { transform: scale(1.15); }
 
.rv-vid-item { position: relative; border-radius: 12px; overflow: visible; }
.rv-vid-item video { width: 100%; border-radius: 12px; border: 1.5px solid rgba(80,70,228,.12); display: block; background: #0f0e1a; }
.rv-vid-del {
  position: absolute; top: -8px; right: -8px; z-index: 2;
  width: 24px; height: 24px; border-radius: 50%;
  background: #ef4444; border: 2px solid white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; box-shadow: 0 2px 8px rgba(239,68,68,.30);
  transition: transform .15s;
}
.rv-vid-del:hover { transform: scale(1.15); }
 
.rv-star-label {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 13px 4px 8px; border-radius: 40px;
  background: rgba(80,70,228,.08); border: 1px solid rgba(80,70,228,.18);
  font-size: 12px; font-weight: 800; color: #5046e4;
  animation: spFU .18s ease both;
}
 
@keyframes rvSlide { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
.rv-anim { animation: rvSlide .28s cubic-bezier(.22,1,.36,1) both; }

/* ══ GLASS CARD ══ */
.spx-card {
  background:rgba(255,255,255,.88);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  border:1px solid rgba(255,255,255,.80);
  border-radius:22px;
  box-shadow:0 4px 24px rgba(80,70,228,.08), 0 1px 3px rgba(0,0,0,.04);
  transition:box-shadow .25s;
}
.spx-card:hover { box-shadow:0 8px 36px rgba(80,70,228,.13), 0 2px 6px rgba(0,0,0,.05); }

/* ══ IMAGE GALLERY ══ */
.spx-gallery {
  position:relative; overflow:hidden; border-radius:24px;
  background:linear-gradient(145deg,#fafbff,#f3f2fd);
  border:1px solid rgba(255,255,255,.80);
  box-shadow:0 12px 48px rgba(80,70,228,.10), 0 2px 8px rgba(0,0,0,.04);
  transition:box-shadow .28s;
}
.spx-gallery:hover { box-shadow:0 20px 64px rgba(80,70,228,.16), 0 4px 16px rgba(0,0,0,.06); }

.spx-track { display:flex; will-change:transform; transition:transform .42s cubic-bezier(.22,1,.36,1); }
.spx-slide {
  flex:0 0 100%; min-height:340px;
  display:flex; align-items:center; justify-content:center; padding:36px 32px;
  background:linear-gradient(155deg,#fafbff 0%,#f4f3fe 100%);
}
.spx-img {
  width:100%; max-height:380px; object-fit:contain; cursor:zoom-in;
  transition:transform .50s cubic-bezier(.22,1,.36,1),filter .30s;
  filter:drop-shadow(0 10px 26px rgba(80,70,228,.11));
}
.spx-gallery:hover .spx-img { transform:scale(1.045); filter:drop-shadow(0 16px 38px rgba(80,70,228,.18)); }

/* discount badge */
.spx-disc {
  position:absolute; top:16px; left:16px; z-index:10;
  background:linear-gradient(135deg,#5046e4,#7c3aed 55%,#3b82f6);
  color:white; font-size:10.5px; font-weight:800; letter-spacing:.03em;
  padding:5px 13px; border-radius:40px;
  box-shadow:0 4px 16px rgba(80,70,228,.40);
  border:1px solid rgba(255,255,255,.22);
  display:inline-flex; align-items:center; gap:4px;
}

/* gallery action buttons */
.spx-acts { position:absolute; top:14px; right:14px; z-index:10; display:flex; flex-direction:column; gap:8px; }
.spx-act {
  width:38px; height:38px; border-radius:11px;
  display:flex; align-items:center; justify-content:center;
  background:rgba(255,255,255,.90); backdrop-filter:blur(10px);
  border:1px solid rgba(255,255,255,.80);
  box-shadow:0 3px 10px rgba(0,0,0,.07);
  cursor:pointer; color:#8893a8;
  transition:all .20s cubic-bezier(.22,1,.36,1);
}
.spx-act:hover { background:white; color:#5046e4; transform:scale(1.08); box-shadow:0 5px 18px rgba(80,70,228,.20); }
.spx-act.wl { color:#f43f5e; background:#fff0f3; border-color:rgba(244,63,94,.20); }

/* nav arrows */
.spx-arr {
  position:absolute; top:50%; transform:translateY(-50%); z-index:9;
  width:38px; height:38px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  background:rgba(255,255,255,.94); backdrop-filter:blur(8px);
  border:1px solid rgba(255,255,255,.80);
  box-shadow:0 4px 14px rgba(80,70,228,.14);
  cursor:pointer; opacity:0;
  transition:opacity .20s,transform .20s,box-shadow .20s;
}
.spx-arr-l { left:12px; } .spx-arr-r { right:12px; }
.spx-gallery:hover .spx-arr { opacity:1; }
.spx-arr:hover { box-shadow:0 6px 22px rgba(80,70,228,.26); transform:translateY(-50%) scale(1.10); background:white; }

/* dots */
.spx-dots { position:absolute; bottom:14px; left:50%; transform:translateX(-50%); display:flex; gap:5px; z-index:9; opacity:0; transition:opacity .20s; }
.spx-gallery:hover .spx-dots { opacity:1; }
.spx-dot { height:5px; border-radius:3px; border:none; padding:0; cursor:pointer; background:rgba(80,70,228,.22); transition:width .22s,background .22s; }
.spx-dot.on { background:#5046e4; box-shadow:0 0 7px rgba(80,70,228,.50); }

/* counter */
.spx-cnt {
  position:absolute; bottom:14px; right:14px; z-index:7;
  font-family:var(--fm); font-size:9.5px; font-weight:700; letter-spacing:.08em;
  color:rgba(80,70,228,.55); background:rgba(240,240,253,.90);
  border:1px solid rgba(80,70,228,.11); border-radius:8px; padding:3px 9px;
  transition:opacity .20s;
}
.spx-gallery:hover .spx-cnt { opacity:0; }

/* thumbnails */
.spx-thumbs { display:flex; gap:9px; overflow-x:auto; scrollbar-width:none; padding:2px 1px; }
.spx-thumbs::-webkit-scrollbar { display:none; }
.spx-thumb {
  flex-shrink:0; width:66px; height:66px; border-radius:14px; overflow:hidden;
  cursor:pointer; border:2px solid transparent; background:white;
  box-shadow:0 2px 8px rgba(80,70,228,.06);
  transition:all .22s cubic-bezier(.22,1,.36,1);
}
.spx-thumb:hover { border-color:rgba(80,70,228,.35); transform:translateY(-3px); box-shadow:0 6px 18px rgba(80,70,228,.14); }
.spx-thumb.on { border-color:#5046e4; box-shadow:0 4px 16px rgba(80,70,228,.28); transform:translateY(-3px); }
.spx-thumb img { width:100%; height:100%; object-fit:contain; }

/* seller */
.spx-seller {
  display:flex; align-items:center; gap:12px; padding:14px 16px;
  background:rgba(255,255,255,.88); backdrop-filter:blur(14px);
  border:1px solid rgba(255,255,255,.80); border-radius:18px;
  box-shadow:0 3px 12px rgba(80,70,228,.06);
}
.spx-sel-av { width:44px; height:44px; border-radius:13px; object-fit:cover; border:2px solid rgba(80,70,228,.15); flex-shrink:0; }

/* ══ PILLS ══ */
.spx-pill { display:inline-flex; align-items:center; gap:5px; padding:4px 12px; border-radius:40px; font-size:11px; font-weight:800; letter-spacing:.01em; }
.pp  { background:rgba(80,70,228,.09); border:1px solid rgba(80,70,228,.20); color:#5046e4; }
.pg  { background:rgba(148,163,184,.09); border:1px solid rgba(148,163,184,.22); color:#64748b; }
.pgn { background:rgba(16,185,129,.09); border:1px solid rgba(16,185,129,.22); color:#059669; }
.prd { background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.20); color:#dc2626; }
.pam { background:rgba(245,158,11,.09); border:1px solid rgba(245,158,11,.22); color:#d97706; }

/* ══ TITLE / PRICE ══ */
.spx-title {
  font-family:var(--fh);
  font-size:clamp(1.35rem,2.6vw,2.05rem);
  font-weight:900; line-height:1.14; letter-spacing:-.028em; color:#1a1535;
}
.spx-price {
  font-family:var(--fm); font-weight:700;
  font-size:clamp(1.75rem,3vw,2.45rem);
  line-height:1;
  background:linear-gradient(135deg,#5046e4,#3b82f6);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}

/* ══ SIZE BUTTONS ══ */
.spx-size {
  padding:8px 16px; border-radius:10px;
  border:1.5px solid rgba(80,70,228,.18); font-size:13px; font-weight:700;
  cursor:pointer; background:white; color:#6b7280; font-family:var(--fb);
  transition:all .18s cubic-bezier(.22,1,.36,1);
}
.spx-size:hover { border-color:#5046e4; color:#5046e4; transform:translateY(-1px); }
.spx-size.on {
  background:linear-gradient(135deg,#5046e4,#7c3aed 55%,#3b82f6);
  color:white; border-color:transparent;
  box-shadow:0 5px 18px rgba(80,70,228,.32);
}
.spx-size:disabled { opacity:.30; cursor:not-allowed; transform:none; }

/* ══ COLOR DOTS ══ */
.spx-cd { width:28px; height:28px; border-radius:50%; cursor:pointer; transition:all .18s; border:2.5px solid transparent; }
.spx-cd:hover { transform:scale(1.18); }
.spx-cd.on { box-shadow:0 0 0 3px white, 0 0 0 5.5px #5046e4; }

/* ══ QUANTITY ══ */
.spx-qty { display:flex; align-items:center; background:#f5f5fb; border-radius:12px; border:1.5px solid rgba(80,70,228,.11); overflow:hidden; }
.spx-qb { width:40px; height:40px; border:none; background:none; cursor:pointer; font-size:18px; color:#5046e4; font-weight:700; transition:background .18s; }
.spx-qb:hover { background:rgba(80,70,228,.09); }
.spx-qn { width:38px; text-align:center; font-size:14px; font-weight:800; color:#1a1535; font-family:var(--fm); }

/* ══ CTA BUTTONS ══ */
.spx-btn {
  flex:1; display:flex; align-items:center; justify-content:center; gap:9px;
  padding:15px 0; border-radius:15px;
  font-family:var(--fb); font-size:14.5px; font-weight:800;
  border:none; cursor:pointer; position:relative; overflow:hidden;
  transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s;
  letter-spacing:.01em;
}
.spx-add {
  background:linear-gradient(135deg,#5046e4,#7c3aed 55%,#3b82f6);
  color:white; box-shadow:0 7px 28px rgba(80,70,228,.36);
}
.spx-add:hover { transform:translateY(-2px); box-shadow:0 12px 38px rgba(80,70,228,.48); }
.spx-add::after {
  content:''; position:absolute; inset:0; border-radius:inherit;
  background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.22) 50%,transparent 65%);
  background-size:200% 100%; animation:spSh 2.8s infinite;
}
.spx-btn span,.spx-btn svg { position:relative; z-index:1; }
.spx-ic { background:#f0f0fb; border:1.5px solid rgba(80,70,228,.22); color:#5046e4; }
.spx-ic:hover { background:#e8e7ff; transform:translateY(-1px); }
.spx-wb {
  width:54px; height:54px; border-radius:15px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  background:#fff0f3; border:1.5px solid rgba(244,63,94,.18); cursor:pointer;
  transition:all .22s cubic-bezier(.22,1,.36,1);
}
.spx-wb:hover { background:#ffe4e6; border-color:rgba(244,63,94,.40); transform:scale(1.06); }
.spx-wb.on { background:#ffe4e6; border-color:rgba(244,63,94,.38); }

/* ══ TRUST BADGES ══ */
.spx-tr {
  display:flex; align-items:center; gap:9px;
  background:rgba(255,255,255,.80); border:1px solid rgba(255,255,255,.80);
  border-radius:14px; padding:11px 14px;
  font-size:12px; font-weight:600; color:#374151;
  box-shadow:0 2px 8px rgba(80,70,228,.05);
  transition:all .20s;
}
.spx-tr:hover { background:white; border-color:rgba(80,70,228,.18); transform:translateY(-1px); box-shadow:0 5px 16px rgba(80,70,228,.10); }

/* ══ EMI CHIP ══ */
.spx-emi {
  display:inline-flex; align-items:center; gap:8px;
  padding:7px 14px; border-radius:40px;
  background:rgba(80,70,228,.07); border:1px solid rgba(80,70,228,.14);
  font-size:12px; color:#5a6278;
}

/* ══ TOGGLER TABS (pill switcher) ══ */
.spx-toggler {
  display:flex; gap:3px; padding:4px;
  background:rgba(80,70,228,.07); border-radius:16px;
  border:1px solid rgba(80,70,228,.10);
  overflow-x:auto; scrollbar-width:none; margin-bottom:24px;
}
.spx-toggler::-webkit-scrollbar { display:none; }
.spx-tgl {
  flex:1; display:flex; align-items:center; justify-content:center; gap:6px;
  padding:10px 14px; border-radius:12px;
  font-size:12.5px; font-weight:800; color:#9896b8;
  cursor:pointer; border:none; background:none; font-family:var(--fb);
  white-space:nowrap; min-width:max-content;
  transition:all .22s cubic-bezier(.22,1,.36,1);
}
.spx-tgl:hover { color:#5046e4; background:rgba(80,70,228,.06); }
.spx-tgl.on {
  background:white; color:#5046e4;
  box-shadow:0 2px 14px rgba(80,70,228,.14), 0 1px 3px rgba(0,0,0,.05);
}

/* ══ SPECS TABLE — modern ══ */
.spx-spec-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:14px; }
.spx-spec-group {
  background:rgba(255,255,255,.80); border:1px solid rgba(80,70,228,.09);
  border-radius:16px; overflow:hidden;
}
.spx-spec-head {
  padding:10px 15px; font-size:10.5px; font-weight:900; letter-spacing:.10em;
  text-transform:uppercase; color:white;
  background:linear-gradient(135deg,#5046e4,#7c3aed 55%,#3b82f6);
}
.spx-spec-row {
  display:flex; justify-content:space-between; align-items:center;
  padding:10px 15px; border-bottom:1px solid rgba(80,70,228,.05);
  font-size:12.5px; transition:background .15s;
}
.spx-spec-row:hover { background:rgba(80,70,228,.04); }
.spx-spec-row:last-child { border-bottom:none; }
.spx-spec-key { color:#8893a8; font-weight:500; }
.spx-spec-val { font-weight:800; color:#1a1535; font-family:var(--fm); font-size:12px; text-align:right; max-width:55%; overflow:hidden; text-overflow:ellipsis; }

/* ══ REVIEW SUMMARY ══ */
.spx-rev-summary {
  display:flex; align-items:center; gap:22px; padding:18px 20px;
  background:linear-gradient(135deg,rgba(80,70,228,.07),rgba(59,130,246,.04));
  border-radius:18px; border:1px solid rgba(80,70,228,.11);
}
.spx-rev-big { font-family:var(--fm); font-size:2.8rem; font-weight:700; color:#5046e4; line-height:1; }
.spx-rb-w { flex:1; height:6px; border-radius:4px; background:#f0f0fb; overflow:hidden; }
.spx-rb-f { height:100%; border-radius:4px; background:linear-gradient(90deg,#fbbf24,#f59e0b); transition:width .55s cubic-bezier(.22,1,.36,1); }

/* ══ REVIEW CARD ══ */
.spx-rv {
  background:rgba(255,255,255,.90); border:1px solid rgba(80,70,228,.09);
  border-radius:18px; padding:18px;
  transition:box-shadow .22s,transform .22s;
}
.spx-rv:hover { box-shadow:0 6px 26px rgba(80,70,228,.10); transform:translateY(-1px); }

/* ══ INPUTS ══ */
.spx-in {
  width:100%; padding:12px 15px;
  background:#f7f8ff; border:1.5px solid rgba(80,70,228,.11);
  border-radius:13px; font-size:13.5px; font-family:var(--fb); color:#1a1535;
  outline:none; resize:vertical; transition:all .22s;
}
.spx-in::placeholder { color:#c4cce0; }
.spx-in:focus { background:white; border-color:#5046e4; box-shadow:0 0 0 3px rgba(80,70,228,.09); }

/* ══ GATE ══ */
.spx-gate {
  display:flex; flex-direction:column; align-items:center; gap:14px;
  padding:28px; border-radius:20px; text-align:center;
  background:linear-gradient(135deg,rgba(80,70,228,.05),rgba(59,130,246,.03));
  border:1.5px dashed rgba(80,70,228,.22);
  animation:spPop .35s ease both;
}

/* ══ LIKE / DISLIKE ══ */
.spx-lb {
  display:flex; align-items:center; gap:5px; border:none; background:none;
  cursor:pointer; font-size:12px; font-weight:700; font-family:var(--fb);
  padding:6px 12px; border-radius:9px; color:#8893a8; transition:all .18s;
}
.spx-lb:hover { background:rgba(80,70,228,.08); color:#5046e4; }
.spx-lb.liked { color:#ef4444; background:rgba(239,68,68,.07); }

/* ══ SPINNER ══ */
.spx-spin { width:16px; height:16px; border-radius:50%; border:2.5px solid rgba(255,255,255,.30); border-top-color:white; animation:spSpin .70s linear infinite; position:relative; z-index:1; }

/* ══ RELATED HEADING ══ */
.spx-rel-h { font-family:var(--fh); font-size:clamp(1.4rem,2.3vw,1.85rem); font-weight:900; color:#1a1535; letter-spacing:-.025em; }

/* ══ ZOOM ══ */
.spx-zoom { position:fixed; inset:0; z-index:9999; background:rgba(8,7,24,.92); backdrop-filter:blur(20px); display:flex; align-items:center; justify-content:center; cursor:zoom-out; animation:spFU .18s ease; }
.spx-zoom-img { max-width:90vw; max-height:88vh; object-fit:contain; border-radius:20px; border:1px solid rgba(255,255,255,.08); box-shadow:0 40px 100px rgba(0,0,0,.50); cursor:default; }
.spx-zoom-x { position:absolute; top:18px; right:18px; width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,.10); border:1px solid rgba(255,255,255,.18); color:white; font-size:17px; cursor:pointer; transition:background .18s; }
.spx-zoom-x:hover { background:rgba(239,68,68,.30); }

/* ══ LOADING ══ */
.spx-loading { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:18px; background:linear-gradient(160deg,#f0effd,#eaf0ff); }

/* ══ DETAIL TAG ══ */
.spx-tag { font-size:11px; font-weight:700; padding:4px 11px; border-radius:40px; background:rgba(80,70,228,.08); border:1px solid rgba(80,70,228,.14); color:#5046e4; }

/* ══ SECTION LABEL ══ */
.spx-label { font-size:10.5px; font-weight:900; letter-spacing:.10em; text-transform:uppercase; color:#8893a8; margin-bottom:10px; }

/* ══ DIVIDER ══ */
.spx-div { height:1px; background:linear-gradient(90deg,transparent,rgba(80,70,228,.14) 20%,rgba(80,70,228,.14) 80%,transparent); }

/* responsive */
@media(max-width:600px){
  .spx-wrap { padding:16px 14px 72px; }
  .spx-card { border-radius:18px; }
  .spx-gallery { border-radius:20px; }
}
`;

export default function SingleProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgZoom, setImgZoom] = useState(false);
  const [selSize, setSelSize] = useState(null);
  const [selColor, setSelColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("details");
  const [reviews, setReviews] = useState([]);
  const [revRating, setRevRating] = useState(0);
  const [revHover, setRevHover] = useState(0);
  const [revText, setRevText] = useState("");
  const [revImgs, setRevImgs] = useState([]);
  const [revVideos, setRevVideos] = useState([]);
  const [revLoad, setRevLoad] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const autoRef = useRef(null);

  const { addToCart, cartItem } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const token = localStorage.getItem("token");
  const isSignedIn = !!token;
  const { isOpen, onOpen, onOpenChange } =
    useDisclosure();

  const [selectedImage, setSelectedImage] =
    useState("");
  const galleryRef = useRef(null);

  const [isDragging, setIsDragging] =
    useState(false);

  const [startX, setStartX] =
    useState(0);

  const [scrollLeft, setScrollLeft] =
    useState(0);
  const [galleryImages, setGalleryImages] =
    useState([]);
  const [visibleReviews, setVisibleReviews] = useState(1);
  const [currentIndex, setCurrentIndex] =
    useState(0);

  /* ── Schema-compatible variant/media helpers ── */
  const variants = product?.variants || [];

  const getVariantAttr = (variant, key) => {
    const attrs = variant?.attributes;
    if (!attrs) return "";
    if (typeof attrs.get === "function") {
      return attrs.get(key) || attrs.get(key.toLowerCase()) || "";
    }
    return attrs[key] || attrs[key.toLowerCase()] || "";
  };

  const variantSize = (variant) =>
    getVariantAttr(variant, "Size");

  const variantColor = (variant) =>
    getVariantAttr(variant, "Color");

  const sizeOptions = [...new Set(variants.map(variantSize).filter(Boolean))];
  const colorOptions = [...new Set(variants.map(variantColor).filter(Boolean))];

  const selectedVariant = variants.find((variant) => {
    const sizeMatches =
      !selSize || !sizeOptions.length || variantSize(variant) === selSize;
    const colorMatches =
      !selColor || !colorOptions.length || variantColor(variant) === selColor;
    return sizeMatches && colorMatches && variant.isActive !== false;
  }) || variants.find((variant) => variant.isActive !== false) || variants[0];

  const productStock = selectedVariant?.stock ?? 0;
  const productPrice = selectedVariant?.price ?? 0;
  const productOriginalPrice = selectedVariant?.originalPrice ?? 0;
  const productDiscount = selectedVariant?.discountPercentage || 0;
  const productShippingCharge = product?.shipping?.shippingCharge ?? 0;
  const productMinQty = product?.minimumOrderQuantity || 1;
  const productMaxQty = product?.maximumOrderQuantity || 10;
  const productImages = [
    product?.media?.thumbnail,
    ...(product?.media?.images || []),
  ].filter(Boolean);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const {
    isOpen: isReviewModalOpen,
    onOpen: openReviewModal,
    onOpenChange: onReviewModalChange,
  } = useDisclosure();
  const displayedReviews = reviews.slice(0, visibleReviews);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setVisibleReviews(1);
  }, [product?._id]);

  const handleLoadMore = () => {
    setLoadingMore(true);

    setTimeout(() => {
      setVisibleReviews((prev) =>
        Math.min(prev + 3, reviews.length)
      );

      setLoadingMore(false);
    }, 800);
  };
  const showPrevImage = () => {

    const newIndex =
      currentIndex === 0
        ? galleryImages.length - 1
        : currentIndex - 1;

    setCurrentIndex(newIndex);

    setSelectedImage(
      galleryImages[newIndex]
    );

  };

  const showNextImage = () => {

    const newIndex =
      currentIndex ===
        galleryImages.length - 1
        ? 0
        : currentIndex + 1;

    setCurrentIndex(newIndex);

    setSelectedImage(
      galleryImages[newIndex]
    );

  };
  const handleMouseDown = (e) => {

    setIsDragging(true);

    setStartX(
      e.pageX -
      galleryRef.current.offsetLeft
    );

    setScrollLeft(
      galleryRef.current.scrollLeft
    );

  };

  const handleMouseLeave = () => {

    setIsDragging(false);

  };

  const handleMouseUp = () => {

    setIsDragging(false);

  };

  const handleMouseMove = (e) => {

    if (!isDragging) return;

    e.preventDefault();

    const x =
      e.pageX -
      galleryRef.current.offsetLeft;

    const walk =
      (x - startX) * 1.5;

    galleryRef.current.scrollLeft =
      scrollLeft - walk;

  };
  /* fetch product */
  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/products/${id}`
        );
        const p = res.data.product;
        setProduct(p);
        setReviews(p.reviews || []);
        const firstVariant =
          p.variants?.find((v) => v.isActive !== false) || p.variants?.[0];
        const attrs = firstVariant?.attributes || {};
        const readAttr = (key) => {
          if (typeof attrs.get === "function") {
            return attrs.get(key) || attrs.get(key.toLowerCase()) || "";
          }
          return attrs[key] || attrs[key.toLowerCase()] || "";
        };
        setSelSize(readAttr("Size"));
        setSelColor(readAttr("Color"));
      } catch (e) { console.error(e); }
    })();
  }, [id]);
/* =====================================================
   RECENTLY VIEWED
   NO AUTHENTICATION REQUIRED
   COOKIE BASED
===================================================== */

useEffect(() => {
  if (!id) {
    console.log(
      "🟡 RECENTLY VIEWED: Product ID missing"
    );
    return;
  }

  const saveRecentlyViewed = async () => {
    console.log("");
    console.log(
      "=========================================="
    );
    console.log(
      "🟣 SAVE RECENTLY VIEWED START"
    );
    console.log(
      "🟣 Product ID:",
      id
    );
    console.log(
      "🟣 API:",
      `${BACKEND_URL}/api/products/recently-viewed/${id}`
    );

    try {
      const url =
        `${BACKEND_URL}/api/products/recently-viewed/${id}`;

      console.log(
        "🟣 Sending POST request..."
      );

      console.log(
        "🟣 credentials: include"
      );

      const response =
        await fetch(url, {
          method: "POST",

          credentials: "include",

          headers: {
            Accept:
              "application/json",
          },
        });

      console.log(
        "🟢 Recently Viewed POST status:",
        response.status
      );

      console.log(
        "🟢 Recently Viewed POST ok:",
        response.ok
      );

      const contentType =
        response.headers.get(
          "content-type"
        );

      console.log(
        "🟢 Content-Type:",
        contentType
      );

      const data =
        await response.json();

      console.log(
        "🟢 Recently Viewed response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Request failed with status ${response.status}`
        );
      }

      console.log(
        "✅ RECENTLY VIEWED SAVED SUCCESSFULLY"
      );

    } catch (error) {
      console.error(
        "🔴 RECENTLY VIEWED SAVE ERROR:",
        error
      );

      console.error(
        "🔴 Error message:",
        error?.message
      );

    } finally {
      console.log(
        "🟣 SAVE RECENTLY VIEWED END"
      );

      console.log(
        "=========================================="
      );
    }
  };

  saveRecentlyViewed();

}, [id, BACKEND_URL]);
  /* fetch related */
  useEffect(() => {
    if (!product?.category) return;
    (async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/products`,
          {
            params: {
              category: product.category?.name,
              limit: 6,
            },
          }
        );
        setRelated(res.data.products.filter(p => p._id !== product._id));
      } catch (e) { console.error(e); }
    })();
  }, [product?.category, product?._id]);

  const allImgs = productImages.filter(
    (img, index, arr) => arr.indexOf(img) === index
  );

  const startAuto = useCallback(() => {
    if (allImgs.length <= 1) return;
    autoRef.current = setInterval(() => setActiveIdx(p => (p + 1) % allImgs.length), 2200);
  }, [allImgs.length]);
  const stopAuto = useCallback(() => clearInterval(autoRef.current), []);
  const prevImg = e => { e.stopPropagation(); setActiveIdx(p => (p - 1 + allImgs.length) % allImgs.length); };
  const nextImg = e => { e.stopPropagation(); setActiveIdx(p => (p + 1) % allImgs.length); };

  const isInCart = cartItem.some(c => String(c.productId) === String(product?._id));
  const isWishlisted = wishlist.some(w => String(w.productId) === String(product?._id));

  const finalPrice = productPrice;
  const origPrice = productOriginalPrice || (
    productDiscount > 0
      ? Math.round(finalPrice / (1 - productDiscount / 100))
      : finalPrice
  );

 const handleCart = () => {
  if (!isSignedIn) {
    toast.error("Please login first");
    navigate("/sign-in");
    return;
  }

  if (isInCart) {
    navigate("/cart");
    return;
  }

  if (!selectedVariant) {
    toast.error("Please select a product variant");
    return;
  }

  if (!productStock) {
    toast.error("Out of Stock");
    return;
  }

  addToCart(product, selectedVariant, qty);
};
  const handleWish = () => {
    if (!isSignedIn) { toast.error("Please login first"); navigate("/sign-in"); return; }
    if (isWishlisted) { removeFromWishlist(String(product._id)); toast("Removed ❌"); }
    else { addToWishlist({ ...product, productId: product._id }); toast.success("Wishlisted ❤️"); }
  };
  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: product.title, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); toast.success("Link copied 🔗"); }
    } catch (err) { toast.error(err?.response?.data?.message || "Failed"); }
  };

  const submitReview = async e => {
    e.preventDefault();
    if (!token) { toast.error("Please login first"); navigate("/sign-in"); return; }
    if (!revRating) { toast.error("Please select a rating"); return; }
    if (!revText.trim()) { toast.error("Please write something"); return; }
    try {
      setRevLoad(true);
      const fd = new FormData();
      fd.append("rating", revRating);
      fd.append("comment", revText);
      revImgs.forEach(f => fd.append("images", f));
      revVideos.forEach(f => fd.append("videos", f));
      const res = await axios.post(
        `${BACKEND_URL}/api/products/${product._id}/review`, fd,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      if (res.data.success) {
        setReviews(res.data.reviews);
        setRevText(""); setRevRating(0); setRevHover(0); setRevImgs([]); setRevVideos([]);
        onReviewModalChange(false);
        toast.success("Review submitted ✨");
      }
    } catch (err) { toast.error(err?.response?.data?.message || "Failed"); }
    finally { setRevLoad(false); }
  };

  const toggleLike = async (rid, type = "like") => {
    if (!token) { toast.error("Please login first"); return; }
    try {
      const endpoint = type === "like" ? "like" : "dislike";
      const res = await axios.put(
        `${BACKEND_URL}/api/products/${product._id}/review/${rid}/${endpoint}`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(prev => prev.map(r => r._id === rid
        ? { ...r, likesCount: res.data.likes, dislikesCount: res.data.dislikes } : r));
    } catch (err) { toast.error(err?.response?.data?.message || "Failed"); }
  };

  const deleteReview = async rid => {
    if (!token) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/products/${product._id}/review/${rid}`,
        { headers: { Authorization: `Bearer ${token}` } });
      setReviews(prev => prev.filter(r => r._id !== rid));
      toast.success("Review deleted");
    } catch (err) { toast.error(err?.response?.data?.message || "Failed"); }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : (product?.rating || 0).toFixed(1);

  /* ── Loading ── */
  if (!product) return (
    <div className="spx-loading sp">
      <Spinner />
    </div>
  );

  const disc = Math.round(productDiscount || 0);

  /* tab definitions */
  const TABS = [
    { key: "details", label: "Details", Icon: FaInfoCircle },
    { key: "specs", label: "Specs", Icon: FaCog },
    { key: "reviews", label: `Reviews (${reviews.length})`, Icon: FaComments },
  ];

  /* spec rows */
  const specsA = [
    { l: "SKU", v: selectedVariant?.sku || "—" },
    { l: "Barcode", v: selectedVariant?.barcode || "—" },
    { l: "Material", v: product.material },
    { l: "Weight", v: selectedVariant?.weight ? `${selectedVariant.weight}g` : null },
    { l: "Currency", v: product.currency },
  ].filter(r => r.v);

  const specsB = [
    { l: "Dimensions", v: selectedVariant?.dimensions ? `${selectedVariant.dimensions.width || 0}×${selectedVariant.dimensions.height || 0}×${selectedVariant.dimensions.depth || 0} cm` : null },
    { l: "Tax", v: selectedVariant?.tax ? `${selectedVariant.tax}%` : null },
    { l: "Shipping", v: productShippingCharge ? `₹${productShippingCharge}` : "Free" },
    { l: "Min Order", v: `${productMinQty} unit` },
    { l: "Max Order", v: `${productMaxQty} units` },
    { l: "Warranty", v: product.warrantyInformation },
  ].filter(r => r.v);

  /* ════════════════════════════ JSX ════════════════════════════ */
  return (
    <>
      <style>{CSS}</style>
      <div className="sp sp-bg">
        {/* ambient */}
        <div className="sp-orb sp-o1" />
        <div className="sp-orb sp-o2" />
        <div className="sp-orb sp-o3" />
        <div className="sp-grid" />

        {/* breadcrumb */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "9px auto", padding: "20px 22px 0" ,}}>
          <Breadcrums title={product.title} />
        </div>

        {/* ══ MAIN ══ */}
        <div className="spx-wrap">

          {/* ── LEFT: sticky gallery ── */}
          <div className="spx-left sp-fr">

            {/* Gallery */}
            <div className="spx-gallery" onMouseEnter={startAuto} onMouseLeave={stopAuto}>
              {disc > 0 && (
                <div className="spx-disc">
                  <FaTag size={9} /> {disc}% OFF
                </div>
              )}

              <div className="spx-acts">
                <button className={`spx-act${isWishlisted ? " wl" : ""}`} onClick={handleWish} title="Wishlist">
                  {isWishlisted ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                </button>
                <button className="spx-act" onClick={handleShare} title="Share">
                  <SlActionRedo size={13} />
                </button>
                <button className="spx-act" onClick={() => setImgZoom(true)} title="Zoom">
                  <AiOutlineZoomIn size={15} />
                </button>
              </div>

              <div style={{ overflow: "hidden" }}>
                <div className="spx-track" style={{ transform: `translateX(-${activeIdx * 100}%)` }}>
                  {allImgs.map((src, i) => (
                    <div key={i} className="spx-slide">
                      <img src={src} alt={product.title} loading="lazy" className="spx-img" onClick={() => setImgZoom(true)} />
                    </div>
                  ))}
                </div>
              </div>

              {allImgs.length > 1 && <>
                <button className="spx-arr spx-arr-l" onClick={prevImg}><FaChevronLeft size={11} color="#5046e4" /></button>
                <button className="spx-arr spx-arr-r" onClick={nextImg}><FaChevronRight size={11} color="#5046e4" /></button>
                <div className="spx-dots">
                  {allImgs.map((_, i) => (
                    <button key={i} className={`spx-dot${i === activeIdx ? " on" : ""}`}
                      style={{ width: i === activeIdx ? 20 : 5 }}
                      onClick={e => { e.stopPropagation(); setActiveIdx(i); }} />
                  ))}
                </div>
                <div className="spx-cnt">{activeIdx + 1} / {allImgs.length}</div>
              </>}
            </div>

            {/* thumbs */}
            <div className="spx-thumbs">
              {allImgs.map((src, i) => (
                <div key={i} className={`spx-thumb${i === activeIdx ? " on" : ""}`} onClick={() => setActiveIdx(i)}>
                  <img src={src} alt="" />
                </div>
              ))}
            </div>

            {/* seller */}
            {product.seller && (
              <div className="spx-seller sp-fu">
                <img src={product.seller.image} alt="seller" className="spx-sel-av"
                  onError={e => e.target.src = "https://via.placeholder.com/44"} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#1a1535" }}>{product.seller.firstName} {product.seller.lastName}</div>
                  <div style={{ fontSize: 10.5, color: "#8893a8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.seller.email}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 800, color: "#5046e4", background: "rgba(80,70,228,.08)", padding: "4px 10px", borderRadius: 40, flexShrink: 0 }}>
                  <MdVerified size={13} /> Verified
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT ── */}
          <div className="spx-right sp-fl">

            {/* ── Title card ── */}
            <div className="spx-card" style={{ padding: "22px 24px" }}>
              {/* badges row */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 14 }}>
                <span className="spx-pill pp"><FaListAlt size={9} />{<span>{product.category?.name}</span>}</span>
                {product.subCategory && <span className="spx-pill pg">{product.subCategory?.name}</span>}
                <span className="spx-pill pg"><FaIndustry size={9} />{product.brand}</span>
                <span className={`spx-pill ${productStock > 0 ? "pgn" : "prd"}`}>
                  {productStock > 0 ? `✓ In Stock (${productStock})` : "Out of Stock"}
                </span>
                {product.bestSeller && <span className="spx-pill pam">🏆 Best Seller</span>}
                {product.trending && <span className="spx-pill pp">🔥 Trending</span>}
                {product.isNewArrival && <span className="spx-pill pgn">✨ New</span>}
              </div>

              <h1 className="spx-title">{product.title}</h1>
              {product.shortDescription && (
                <p style={{ fontSize: 13.5, color: "#5a6278", marginTop: 10, lineHeight: 1.70 }}>{product.shortDescription}</p>
              )}

              {/* rating row */}
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(80,70,228,.07)", flexWrap: "wrap" }}>
                <Stars rating={parseFloat(avgRating)} />
                <span style={{ fontSize: 13.5, fontWeight: 800, color: "#1a1535", fontFamily: "var(--fm)" }}>{avgRating}</span>
                <span style={{ fontSize: 12, color: "#a0aec0" }}>({reviews.length} reviews)</span>
                <span style={{ fontSize: 10.5, color: "#c4cce0", marginLeft: "auto", fontFamily: "var(--fm)" }}>SKU: {selectedVariant?.sku || "—"}</span>
              </div>
            </div>

            {/* ── Price card ── */}
            <div className="spx-card" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <FaRupeeSign size={15} style={{ color: "#5046e4", marginBottom: 8 }} />
                  <span className="spx-price">{finalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ paddingBottom: 4 }}>
                  <div style={{ fontSize: 13, color: "#a0aec0", textDecoration: "line-through" }}>₹{origPrice.toLocaleString("en-IN")}</div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: "#10b981" }}>Save ₹{(origPrice - finalPrice).toLocaleString("en-IN")}</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 11, color: "#a0aec0", fontWeight: 600 }}>+₹{productShippingCharge} shipping</div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div className="spx-emi">
                  <FaTag size={10} color="#5046e4" />
                  <span style={{ fontWeight: 600 }}>No-cost EMI from</span>
                  <span style={{ fontWeight: 800, color: "#5046e4", fontFamily: "var(--fm)" }}>₹{Math.round(finalPrice / 6).toLocaleString("en-IN")}/mo</span>
                </div>
              </div>
            </div>

            {/* ── Size + Color + Qty card ── */}
            <div className="spx-card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

              {sizeOptions.length > 0 && (
                <div>
                  <div className="spx-label">
                    Size — <span style={{ color: "#5046e4", textTransform: "none", letterSpacing: 0, fontFamily: "var(--fb)" }}>{selSize}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {sizeOptions.map((size) => {
                      const sizeVariant = variants.find(
                        (v) => variantSize(v) === size && v.isActive !== false
                      );
                      return (
                        <button key={size}
                          className={`spx-size${selSize === size ? " on" : ""}`}
                          disabled={!sizeVariant || sizeVariant.stock === 0}
                          onClick={() => setSelSize(size)}>
                          {size}
                          {sizeVariant?.price != null && sizeVariant.price !== productPrice && (
                            <span style={{ fontSize: 10, opacity: .7, marginLeft: 4 }}>₹{sizeVariant.price}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {colorOptions.length > 0 && (
                <div>
                  <div className="spx-label">
                    Color — <span style={{ color: "#5046e4", textTransform: "none", letterSpacing: 0, fontFamily: "var(--fb)" }}>{selColor}</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    {colorOptions.map((c) => (
                      <button key={c}
                        className={`spx-cd${selColor === c ? " on" : ""}`}
                        style={{ background: COLOR_MAP[c] || "#9ca3af", outline: c === "White" ? "1.5px solid #e2e8f0" : "none" }}
                        onClick={() => setSelColor(c)} title={c} />
                    ))}
                  </div>
                </div>
              )}

              {/* qty */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div className="spx-label" style={{ marginBottom: 0 }}>Quantity</div>
                <div className="spx-qty">
                  <button className="spx-qb" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="spx-qn">{qty}</span>
                  <button className="spx-qb" onClick={() => setQty(q => Math.min(productMaxQty, q + 1))}>+</button>
                </div>
                <span style={{ fontSize: 11, color: "#c4cce0" }}>Max {productMaxQty}</span>
              </div>
            </div>

            {/* ── CTA row ── */}
            <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
              <button className={`spx-btn ${isInCart ? "spx-ic" : "spx-add"}`} onClick={handleCart}>
                <FaShoppingCart size={15} />
                <span>{isInCart ? "Go to Cart" : "Add to Cart"}</span>
              </button>
              <button className={`spx-wb${isWishlisted ? " on" : ""}`} onClick={handleWish}>
                {isWishlisted
                  ? <FaHeart size={18} style={{ color: "#f43f5e" }} />
                  : <FaRegHeart size={18} style={{ color: "#f43f5e" }} />}
              </button>
            </div>

            {/* ── Trust badges ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { icon: <FaTruck size={13} style={{ color: "#10b981" }} />, text: product.shipping?.freeShipping ? "Free Delivery" : (product.shippingInformation || "Delivery available") },
                { icon: <FaUndoAlt size={12} style={{ color: "#3b82f6" }} />, text: product.returnPolicy || "Easy Returns" },
                { icon: <FaShieldAlt size={12} style={{ color: "#5046e4" }} />, text: "Secure Payment" },
                { icon: <FaCheckCircle size={12} style={{ color: "#f59e0b" }} />, text: product.warrantyInformation || "Genuine" },
              ].map(({ icon, text }) => (
                <div key={text} className="spx-tr">{icon}<span>{text}</span></div>
              ))}
            </div>

            {/* ══ TOGGLER + TABBED CONTENT ══ */}
            <div className="spx-card" style={{ padding: "22px 24px" }}>

              {/* pill toggler */}
              <div className="spx-toggler">
                {TABS.map(({ key, label, Icon }) => (
                  <button key={key}
                    className={`spx-tgl${tab === key ? " on" : ""}`}
                    onClick={() => setTab(key)}>
                    <Icon size={12} />
                    {label}
                  </button>
                ))}
              </div>

              {/* ── DETAILS tab ── */}
              {tab === "details" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "spFU .30s ease both" }}>
                  <p style={{ fontSize: 14, color: "#5a6278", lineHeight: 1.76, margin: 0 }}>{product.description}</p>

                  {/* highlights grid */}
                  {(product.shippingInformation || product.returnPolicy || product.warrantyInformation) && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10 }}>
                      {[
                        { label: "Shipping", val: product.shippingInformation, color: "#10b981" },
                        { label: "Returns", val: product.returnPolicy, color: "#3b82f6" },
                        { label: "Warranty", val: product.warrantyInformation, color: "#f59e0b" },
                      ].filter(x => x.val).map(x => (
                        <div key={x.label} style={{ padding: "12px 14px", borderRadius: 14, background: `${x.color}0d`, border: `1px solid ${x.color}22` }}>
                          <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: ".08em", textTransform: "uppercase", color: x.color, marginBottom: 4 }}>{x.label}</div>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>{x.val}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {product.tags?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {product.tags.map(t => <span key={t} className="spx-tag">#{t}</span>)}
                    </div>
                  )}
                </div>
              )}

              {/* ── SPECS tab — modern two-column table ── */}
              {tab === "specs" && (
                <div className="spx-spec-grid" style={{ animation: "spFU .30s ease both" }}>
                  {/* group A */}
                  {specsA.length > 0 && (
                    <div className="spx-spec-group">
                      <div className="spx-spec-head">Product Identity</div>
                      {specsA.map(r => (
                        <div key={r.l} className="spx-spec-row">
                          <span className="spx-spec-key">{r.l}</span>
                          <span className="spx-spec-val">{r.v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* group B */}
                  {specsB.length > 0 && (
                    <div className="spx-spec-group">
                      <div className="spx-spec-head">Shipping &amp; Ordering</div>
                      {specsB.map(r => (
                        <div key={r.l} className="spx-spec-row">
                          <span className="spx-spec-key">{r.l}</span>
                          <span className="spx-spec-val">{r.v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── REVIEWS tab ── */}
              {tab === "reviews" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "spFU .30s ease both" }}>

                  {/* summary */}
                  <div className="spx-rev-summary">
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <div className="spx-rev-big">{avgRating}</div>
                      <Stars rating={parseFloat(avgRating)} size={13} />
                      <div style={{ fontSize: 10.5, color: "#a0aec0", marginTop: 4 }}>{reviews.length} reviews</div>
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                      {[5, 4, 3, 2, 1].map(s => {
                        const cnt = reviews.filter(r => Math.round(r.rating || 0) === s).length;
                        const pct = reviews.length ? Math.round((cnt / reviews.length) * 100) : 0;
                        return (
                          <div key={s} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: "#8893a8", width: 8, flexShrink: 0 }}>{s}</span>
                            <FaStar size={9} color="#fbbf24" style={{ flexShrink: 0 }} />
                            <div className="spx-rb-w"><div className="spx-rb-f" style={{ width: `${pct}%` }} /></div>
                            <span style={{ fontSize: 10.5, color: "#c4cce0", width: 20, textAlign: "right", flexShrink: 0 }}>{cnt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* form / gate */}
                  {!isSignedIn ? (
                    <div className="spx-gate">
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#5046e4,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(80,70,228,.32)" }}>
                        <FaLock size={18} color="white" />
                      </div>
                      <div style={{ fontFamily: "var(--fh)", fontSize: "1.05rem", fontWeight: 900, color: "#1a1535" }}>Sign in to review</div>
                      <p style={{ fontSize: 12.5, color: "#8893a8", maxWidth: 280, lineHeight: 1.55 }}>You need to be logged in to leave a review.</p>
                      <button onClick={() => navigate("/sign-in")}
                        style={{ padding: "11px 26px", borderRadius: 13, background: "linear-gradient(135deg,#5046e4,#3b82f6)", color: "white", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 800, fontFamily: "var(--fb)", boxShadow: "0 5px 18px rgba(80,70,228,.30)" }}>
                        Sign In
                      </button>
                    </div>
                  ) : (
                    <div>

                      <button
                        onClick={openReviewModal}
                        style={{
                          width: "100%",
                          border: "none",
                          cursor: "pointer",
                          background: "white",
                          borderRadius: "18px",
                          padding: "18px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          boxShadow:
                            "0 4px 20px rgba(0,0,0,.05)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "12px",
                              background:
                                "linear-gradient(135deg,#10b981,#059669)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FaComments color="white" />
                          </div>

                          <div>
                            <div
                              style={{
                                fontWeight: 800,
                                color: "#1a1535",
                              }}
                            >
                              Write Review
                            </div>

                            <div
                              style={{
                                fontSize: 12,
                                color: "#8893a8",
                              }}
                            >
                              Upload photos & videos
                            </div>
                          </div>
                        </div>

                        ✍️
                      </button>

                      <div
                        className={`rv-form-panel ${showReviewForm ? "open" : "closed"
                          }`}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <FaCheckCircle size={14} color="white" />
                          </div>
                          <div>
                            <div style={{ fontFamily: "var(--fh)", fontSize: "1rem", fontWeight: 900, color: "#1a1535" }}>Write a Review</div>
                            <div style={{ fontSize: 10.5, color: "#10b981", fontWeight: 700 }}>Verified Purchase</div>
                          </div>
                        </div>

                        <form onSubmit={submitReview} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                          <div>
                            <div className="spx-label">Your Rating</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <Stars rating={revRating} size={26} interactive onRate={r => { setRevRating(r); setRevHover(0); }} hover={revHover} setHover={setRevHover} />
                              {(revHover || revRating) > 0 && (
                                <span style={{ fontSize: 12.5, color: "#5046e4", fontWeight: 800 }}>
                                  {["", "Poor", "Fair", "Good", "Great", "Excellent"][revHover || revRating]}
                                </span>
                              )}
                            </div>
                          </div>

                          <textarea
                            placeholder="Share your experience with this product…"
                            value={revText}
                            onChange={e => setRevText(e.target.value)}
                            rows={3}
                            className="spx-in"
                          />
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "24px",
                              marginTop: "20px",
                            }}
                          >
                            {/* IMAGE SECTION */}
                            <div
                              style={{
                                border: "1px solid #E5E7EB",
                                borderRadius: "16px",
                                padding: "20px",
                                background: "#fff",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginBottom: "12px",
                                }}
                              >
                                <h4 style={{ margin: 0 }}>🖼️ Review Images</h4>

                                {revImgs.length > 0 && (
                                  <span
                                    style={{
                                      background: "#EEF2FF",
                                      color: "#4338CA",
                                      padding: "4px 10px",
                                      borderRadius: "20px",
                                      fontSize: "12px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {revImgs.length} Selected
                                  </span>
                                )}
                              </div>

                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  height: "140px",
                                  border: "2px dashed #D1D5DB",
                                  borderRadius: "12px",
                                  cursor: "pointer",
                                  background: "#FAFAFA",
                                }}
                              >
                                <span style={{ fontSize: "30px" }}>📸</span>
                                <p style={{ marginTop: 8, color: "#6B7280" }}>
                                  Click to upload images
                                </p>

                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  hidden
                                  onChange={(e) =>
                                    setRevImgs(Array.from(e.target.files))
                                  }
                                />
                              </label>

                              {revImgs.length > 0 && (
                                <div
                                  style={{
                                    marginTop: "16px",
                                    display: "grid",
                                    gridTemplateColumns:
                                      "repeat(auto-fill,minmax(90px,1fr))",
                                    gap: "10px",
                                  }}
                                >
                                  {revImgs.map((file, i) => (
                                    <div
                                      key={i}
                                      style={{
                                        position: "relative",
                                      }}
                                    >
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setRevImgs((prev) =>
                                            prev.filter((_, index) => index !== i)
                                          )
                                        }
                                        style={{
                                          position: "absolute",
                                          top: "-6px",
                                          right: "-6px",
                                          width: "22px",
                                          height: "22px",
                                          border: "none",
                                          borderRadius: "50%",
                                          background: "#EF4444",
                                          color: "#fff",
                                          cursor: "pointer",
                                          fontSize: "12px",
                                          fontWeight: 700,
                                          zIndex: 1,
                                          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                        }}
                                      >
                                        <IoClose size={14} />
                                      </button>

                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt=""
                                        style={{
                                          width: "100%",
                                          height: "90px",
                                          objectFit: "cover",
                                          borderRadius: "10px",
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* VIDEO SECTION */}
                            <div
                              style={{
                                border: "1px solid #E5E7EB",
                                borderRadius: "16px",
                                padding: "20px",
                                background: "#fff",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginBottom: "12px",
                                }}
                              >
                                <h4 style={{ margin: 0 }}>🎥 Review Videos</h4>

                                {revVideos.length > 0 && (
                                  <div
                                    style={{
                                      marginTop: "16px",
                                      display: "grid",
                                      gridTemplateColumns:
                                        "repeat(auto-fill,minmax(180px,1fr))",
                                      gap: "12px",
                                    }}
                                  >
                                    {revVideos.map((file, i) => (
                                      <div
                                        key={i}
                                        style={{
                                          position: "relative",
                                        }}
                                      >
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setRevVideos((prev) =>
                                              prev.filter((_, index) => index !== i)
                                            )
                                          }
                                          style={{
                                            position: "absolute",
                                            top: "-8px",
                                            right: "-8px",
                                            width: "24px",
                                            height: "24px",
                                            border: "none",
                                            borderRadius: "50%",
                                            background: "#EF4444",
                                            color: "#fff",
                                            cursor: "pointer",
                                            fontSize: "12px",
                                            fontWeight: 700,
                                            zIndex: 1,
                                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                          }}
                                        >
                                          <IoClose size={14} />
                                        </button>

                                        <video
                                          controls
                                          src={URL.createObjectURL(file)}
                                          style={{
                                            width: "100%",
                                            borderRadius: "12px",
                                            background: "#000",
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  height: "140px",
                                  border: "2px dashed #D1D5DB",
                                  borderRadius: "12px",
                                  cursor: "pointer",
                                  background: "#FAFAFA",
                                }}
                              >
                                <span style={{ fontSize: "30px" }}>🎬</span>

                                <p style={{ marginTop: 8, color: "#6B7280" }}>
                                  Click to upload videos
                                </p>

                                <input
                                  type="file"
                                  multiple
                                  accept="video/*"
                                  hidden
                                  onChange={(e) =>
                                    setRevVideos(
                                      Array.from(e.target.files)
                                    )
                                  }
                                />
                              </label>

                              {revVideos.length > 0 && (
                                <div
                                  style={{
                                    marginTop: "16px",
                                    display: "grid",
                                    gridTemplateColumns:
                                      "repeat(auto-fill,minmax(180px,1fr))",
                                    gap: "12px",
                                  }}
                                >
                                  {revVideos.map((file, i) => (
                                    <video
                                      key={i}
                                      controls
                                      src={URL.createObjectURL(file)}
                                      style={{
                                        width: "100%",
                                        borderRadius: "12px",
                                        background: "#000",
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <button type="submit" disabled={revLoad}
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px 0", borderRadius: 13, background: "linear-gradient(135deg,#5046e4,#7c3aed 50%,#3b82f6)", color: "white", border: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 800, fontFamily: "var(--fb)", boxShadow: "0 5px 20px rgba(80,70,228,.30)", opacity: revLoad ? .7 : 1, transition: "opacity .18s" }}>
                            {revLoad ? <><div className="spx-spin" /> Submitting…</> : <><FaPaperPlane size={12} /> Submit Review</>}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}


                  {/* review list */}
                  {reviews.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "32px 0",
                        color: "#c4cce0",
                        fontSize: 13.5,
                      }}
                    >
                      No reviews yet — be the first! 🌟
                    </div>
                  ) : (
                    <>
                      {displayedReviews.map((r, i) => (
                        <div key={r._id || i} className="spx-rv">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                              marginBottom: 12,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 11,
                              }}
                            >
                              <div
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 12,
                                  background:
                                    "linear-gradient(135deg,#5046e4,#3b82f6)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <FaUser size={14} color="white" />
                              </div>

                              <div>
                                <div
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 800,
                                    color: "#1a1535",
                                  }}
                                >
                                  {r.reviewerName || "Anonymous"}
                                </div>

                                <div
                                  style={{
                                    fontSize: 10.5,
                                    color: "#c4cce0",
                                  }}
                                >
                                  {r.createdAt
                                    ? new Date(
                                      r.createdAt
                                    ).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })
                                    : ""}
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <Stars rating={r.rating || 0} size={12} />

                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: "#1a1535",
                                }}
                              >
                                {r.rating?.toFixed(1)}
                              </span>
                            </div>
                          </div>

                          {r.comment && (
                            <p
                              style={{
                                fontSize: 13.5,
                                color: "#5a6278",
                                lineHeight: 1.68,
                                margin: "0 0 12px",
                              }}
                            >
                              {r.comment}
                            </p>
                          )}

                          {r.images?.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                marginBottom: 12,
                                flexWrap: "wrap",
                              }}
                            >
                              {r.images.map((img, j) => (
                                <img
                                  key={j}
                                  src={img}
                                  alt=""
                                  style={{
                                    width: 76,
                                    height: 76,
                                    objectFit: "cover",
                                    borderRadius: 11,
                                    cursor: "pointer",
                                    border:
                                      "1px solid rgba(80,70,228,.09)",
                                  }}
                                  onClick={() => {
                                    setSelectedReview(r);
                                    setGalleryImages(r.images);
                                    setCurrentIndex(j);
                                    setSelectedImage(img);
                                    onOpen();
                                  }}
                                />
                              ))}
                            </div>
                          )}

                          {r.videos?.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                marginBottom: 12,
                                flexWrap: "wrap",
                              }}
                            >
                              {r.videos.map((video, j) => (
                                <video
                                  key={j}
                                  src={video}
                                  controls
                                  style={{
                                    width: 220,
                                    borderRadius: 12,
                                  }}
                                />
                              ))}
                            </div>
                          )}

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              paddingTop: 11,
                              borderTop:
                                "1px solid rgba(80,70,228,.06)",
                            }}
                          >
                            <button
                              className="spx-lb"
                              onClick={() =>
                                toggleLike(r._id, "like")
                              }
                            >
                              <FaThumbsUp size={11} />{" "}
                              {r.likesCount || 0} Helpful
                            </button>

                            <button
                              className="spx-lb"
                              onClick={() =>
                                toggleLike(r._id, "dislike")
                              }
                            >
                              <FaThumbsDown size={11} />{" "}
                              {r.dislikesCount || 0}
                            </button>

                            {/* <button
            onClick={() => deleteReview(r._id)}
            style={{
              marginLeft: "auto",
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "#c4cce0",
            }}
          >
            <FaTrash size={10} /> Delete
          </button> */}
                          </div>
                        </div>
                      ))}

                      {/* LOAD MORE */}
                      {visibleReviews < reviews.length && (
                        <div className="flex justify-center mt-8">
                          <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="
        flex items-center gap-3
        px-7 py-3.5
        rounded-2xl
        bg-gradient-to-r
        from-indigo-600
        via-violet-600
        to-blue-500
        text-white
        font-semibold
        shadow-lg shadow-indigo-500/25
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-2xl
        disabled:hover:translate-y-0
      "
                          >
                            {loadingMore ? (
                              <>
                                <div className="w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
                                Loading...
                              </>
                            ) : (
                              <>
                                <ChevronDown size={18} />
                                Load More Reviews

                                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-white/20">
                                  {reviews.length - visibleReviews}
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

          </div>{/* end right */}
        </div>{/* end main */}

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div className="sp-fu" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 22px 88px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 26 }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(80,70,228,.18),transparent)" }} />
              <h2 className="spx-rel-h">Related Products</h2>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,transparent,rgba(80,70,228,.18))" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(186px,1fr))", gap: 13 }}>
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}

        {/* ── Zoom overlay ── */}
        {imgZoom && (
          <div className="spx-zoom" onClick={() => setImgZoom(false)}>
            <button className="spx-zoom-x" onClick={() => setImgZoom(false)}><IoClose size={14} /></button>
            <img src={allImgs[activeIdx]} alt={product.title} className="spx-zoom-img" onClick={e => e.stopPropagation()} />
          </div>
        )}

      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        backdrop="blur"
        placement="center"
        scrollBehavior="inside"
      >
        <ModalContent
          className="overflow-hidden"
          style={{
            borderRadius: "24px",
            maxHeight: "95vh",
          }}
        >
          {(onClose) => (

            <ModalBody
              className="p-0"
              style={{
                background: "#0f172a",
              }}
            >

              {/* Close Button */}

              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-50
          w-10 h-10 lg:w-11 lg:h-11
          rounded-full bg-black/50 hover:bg-black/70
          text-white backdrop-blur"
              >
                ✕
              </button>

              <div
                className="
          flex flex-col
          lg:grid lg:grid-cols-[1fr_380px]
          "
              >

                {/* LEFT IMAGE */}

                <div
                  className="
            relative
            flex items-center justify-center
            bg-black/60
            h-[45vh]
            sm:h-[55vh]
            lg:h-[80vh]
            "
                >

                  <img
                    src={selectedImage}
                    alt=""
                    className="
              w-full
              h-full
              object-contain
              "
                  />
                  {/* Previous */}

                  {galleryImages.length > 1 && (
                    <button
                      onClick={showPrevImage}
                      className="
    absolute left-3
    sm:left-5
    top-1/2
    -translate-y-1/2
    z-30
    w-10 h-10
    sm:w-12 sm:h-12
    rounded-full
    bg-black/50
    hover:bg-indigo-600
    text-white
    backdrop-blur-md
    transition-all
    duration-300
    flex items-center justify-center
    shadow-lg
    "
                    >
                      ❮
                    </button>
                  )}

                  {/* Next */}

                  {galleryImages.length > 1 && (
                    <button
                      onClick={showNextImage}
                      className="
    absolute right-3
    sm:right-5
    top-1/2
    -translate-y-1/2
    z-30
    w-10 h-10
    sm:w-12 sm:h-12
    rounded-full
    bg-black/50
    hover:bg-indigo-600
    text-white
    backdrop-blur-md
    transition-all
    duration-300
    flex items-center justify-center
    shadow-lg
    "
                    >
                      ❯
                    </button>
                  )}
                  {/* Counter */}

                  <div
                    className="
              absolute bottom-3 left-3
              px-3 py-1 rounded-full
              text-white text-xs sm:text-sm
              "
                    style={{
                      background: "rgba(0,0,0,.6)",
                    }}
                  >
                    {currentIndex + 1} / {galleryImages.length}
                  </div>

                </div>

                {/* RIGHT PANEL */}

                <div
                  className="
            bg-white
            overflow-y-auto
            h-auto
            lg:h-[80vh]
            "
                >

                  <div className="p-4 sm:p-6">

                    {/* User */}

                    <div className="flex items-center gap-3 mb-4">

                      <div
                        className="
                  w-10 h-10
                  sm:w-12 sm:h-12
                  rounded-xl
                  flex items-center justify-center
                  "
                        style={{
                          background:
                            "linear-gradient(135deg,#4f46e5,#3b82f6)",
                        }}
                      >
                        <FaUser color="white" />
                      </div>

                      <div>

                        <h3 className="font-bold text-base sm:text-lg">
                          {selectedReview?.reviewerName}
                        </h3>

                        <div className="text-xs sm:text-sm text-slate-500">
                          {new Date(
                            selectedReview?.createdAt
                          ).toLocaleDateString()}
                        </div>

                      </div>

                    </div>
                    {/* Gallery */}

                    <div className="mt-3">
                      <div className="flex gap-3 overflow-x-auto pb-2">

                        <div
                          ref={galleryRef}
                          className="
  flex gap-3
  overflow-x-auto
  pb-2
  cursor-grab
  active:cursor-grabbing
  select-none
  "
                          onMouseDown={handleMouseDown}
                          onMouseLeave={handleMouseLeave}
                          onMouseUp={handleMouseUp}
                          onMouseMove={handleMouseMove}
                        >

                          {galleryImages.map((img, index) => (

                            <img
                              key={index}
                              src={img}
                              alt=""
                              draggable={false}
                              onClick={() => {

                                setCurrentIndex(index);
                                setSelectedImage(img);

                              }}
                              className={`
      cursor-pointer
      rounded-xl
      border-2
      flex-shrink-0
      transition-all
      duration-300
      ${selectedImage === img
                                  ? "border-indigo-500 scale-105"
                                  : "border-transparent"
                                }
      `}
                              style={{
                                width: 90,
                                height: 90,
                                objectFit: "cover",
                              }}
                            />

                          ))}

                        </div>

                      </div>

                    </div>
                    {/* Verified */}

                    <div
                      className="
                inline-flex items-center gap-2
                px-3 py-1 rounded-full
                text-xs sm:text-sm
                mb-4
                "
                      style={{
                        background:
                          "rgba(16,185,129,.1)",
                        color: "#059669",
                      }}
                    >
                      <FaCheckCircle />
                      {selectedReview?.verifiedPurchase ? "Verified Purchase" : "Customer Review"}
                    </div>

                    {/* Rating */}

                    <div className="mb-4">
                      <Stars
                        rating={selectedReview?.rating}
                        size={18}
                      />
                    </div>

                    {/* Comment */}

                    <div
                      className="text-sm sm:text-base"
                      style={{
                        lineHeight: 1.8,
                        color: "#475569",
                      }}
                    >
                      {selectedReview?.comment}
                    </div>

                    {/* Like Dislike */}

                    {/* <div className="flex gap-3 mt-6">

                <button
  onClick={() =>
    toggleLike(
      selectedReview._id,
      "like"
    )
  }
  className="
  px-4 py-2 rounded-xl
  bg-slate-100
  hover:bg-indigo-50
  hover:text-indigo-600
  flex items-center gap-2
  transition-all
  "
>
  <FaThumbsUp />
</button>

               <button
  onClick={() =>
    toggleLike(
      selectedReview._id,
      "dislike"
    )
  }
  className="
  px-4 py-2 rounded-xl
  bg-slate-100
  hover:bg-red-50
  hover:text-red-600
  flex items-center gap-2
  transition-all
  "
>
  <FaThumbsDown />
  {selectedReview?.dislikesCount || 0}
</button>

              </div> */}
                  </div>

                </div>

              </div>

            </ModalBody>

          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isReviewModalOpen}
        onOpenChange={onReviewModalChange}
        size="4xl"
        scrollBehavior="inside"
        backdrop="blur"
        hideCloseButton={true}

      >

        <ModalContent
          style={{
            borderRadius: "28px",
            overflow: "hidden",
            background: "#fff",
            maxHeight: "92vh",
            boxShadow: "0 30px 80px rgba(15,23,42,.25)",
          }}

        >


          {(onClose) => (



            <>
              {/* HEADER */}
              <ModalHeader
                style={{
                  background:
                    "linear-gradient(135deg,#4F46E5,#7C3AED,#3B82F6)",
                  color: "#fff",
                  padding: "22px 26px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                    }}
                  >
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "16px",
                        background: "rgba(255,255,255,.15)",
                        backdropFilter: "blur(12px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaComments size={22} />
                    </div>

                    <div>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "22px",
                          fontWeight: 800,
                        }}
                      >
                        Write a Review
                      </h2>

                      <p
                        style={{
                          margin: "4px 0 0",
                          opacity: 0.9,
                          fontSize: "13px",
                        }}
                      >
                        Share your experience with buyers
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "14px",
                      border: "1px solid rgba(255,255,255,.2)",
                      background: "rgba(255,255,255,.12)",
                      backdropFilter: "blur(10px)",
                      color: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IoClose size={20} />
                  </button>
                </div>
              </ModalHeader>

              {/* BODY */}
              <ModalBody
                style={{
                  background:
                    "linear-gradient(to bottom,#F8FAFC,#FFFFFF)",
                  padding: "24px",
                }}
              >
                <form
                  id="reviewForm"
                  onSubmit={submitReview}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {/* RATING CARD */}
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "22px",
                      padding: "22px",
                      border: "1px solid #E5E7EB",
                      boxShadow:
                        "0 8px 24px rgba(15,23,42,.04)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#111827",
                        marginBottom: "12px",
                      }}
                    >
                      Overall Rating
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        flexWrap: "wrap",
                      }}
                    >
                      <Stars
                        rating={revRating}
                        size={30}
                        interactive
                        onRate={(r) => {
                          setRevRating(r);
                          setRevHover(0);
                        }}
                        hover={revHover}
                        setHover={setRevHover}
                      />

                      {(revHover || revRating) > 0 && (
                        <span
                          style={{
                            background: "#EEF2FF",
                            color: "#4338CA",
                            padding: "6px 14px",
                            borderRadius: "999px",
                            fontSize: "13px",
                            fontWeight: 700,
                          }}
                        >
                          {
                            [
                              "",
                              "Poor",
                              "Fair",
                              "Good",
                              "Great",
                              "Excellent",
                            ][revHover || revRating]
                          }
                        </span>
                      )}
                    </div>
                  </div>

                  {/* REVIEW TEXT */}
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "22px",
                      border: "1px solid #E5E7EB",
                      padding: "20px",
                      boxShadow:
                        "0 8px 24px rgba(15,23,42,.04)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        marginBottom: "12px",
                      }}
                    >
                      Your Review
                    </div>

                    <textarea
                      rows={5}
                      value={revText}
                      onChange={(e) =>
                        setRevText(e.target.value)
                      }
                      placeholder="Tell others about product quality, delivery, packaging and your overall experience..."
                      style={{
                        width: "100%",
                        border: "none",
                        outline: "none",
                        resize: "none",
                        fontSize: "15px",
                        lineHeight: "1.7",
                        background: "transparent",
                        color: "#111827",
                      }}
                    />

                    <div
                      style={{
                        textAlign: "right",
                        fontSize: "12px",
                        color: "#94A3B8",
                        marginTop: "10px",
                      }}
                    >
                      {revText.length}/500
                    </div>
                  </div>

                  {/* IMAGE UPLOAD */}
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "22px",
                      padding: "20px",
                      border: "1px solid #E5E7EB",
                      boxShadow:
                        "0 8px 24px rgba(15,23,42,.04)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "#111827",
                          }}
                        >
                          Review Photos
                        </div>

                        <div
                          style={{
                            fontSize: "13px",
                            color: "#6B7280",
                            marginTop: "4px",
                          }}
                        >
                          Add photos to help other buyers
                        </div>
                      </div>

                      {revImgs.length > 0 && (
                        <div
                          style={{
                            background: "#EEF2FF",
                            color: "#4338CA",
                            padding: "8px 12px",
                            borderRadius: "999px",
                            fontWeight: 700,
                            fontSize: "12px",
                          }}
                        >
                          {revImgs.length} Selected
                        </div>
                      )}
                    </div>

                    <label
                      style={{
                        border: "2px dashed #C7D2FE",
                        borderRadius: "18px",
                        padding: "24px",
                        background:
                          "linear-gradient(180deg,#F8FAFF,#EEF4FF)",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg,#4F46E5,#6366F1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "26px",
                        }}
                      >
                        📷
                      </div>

                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "#111827",
                          }}
                        >
                          Upload Images
                        </div>

                        <div
                          style={{
                            fontSize: "13px",
                            color: "#6B7280",
                            marginTop: "4px",
                          }}
                        >
                          JPG, PNG, WEBP • Multiple files supported
                        </div>
                      </div>

                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        hidden
                        onChange={(e) =>
                          setRevImgs(
                            Array.from(e.target.files || [])
                          )
                        }
                      />
                    </label>

                    {revImgs.length > 0 && (
                      <div
                        style={{
                          marginTop: "18px",
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill,minmax(110px,1fr))",
                          gap: "12px",
                        }}
                      >
                        {revImgs.map((file, i) => (
                          <div
                            key={i}
                            style={{
                              position: "relative",
                              borderRadius: "16px",
                              overflow: "hidden",
                              background: "#fff",
                              boxShadow:
                                "0 8px 20px rgba(0,0,0,.08)",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setRevImgs((prev) =>
                                  prev.filter(
                                    (_, index) =>
                                      index !== i
                                  )
                                )
                              }
                              style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                border: "none",
                                background:
                                  "rgba(17,24,39,.8)",
                                color: "#fff",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 2,
                              }}
                            >
                              <IoClose size={14} />
                            </button>

                            <img
                              src={URL.createObjectURL(file)}
                              alt=""
                              style={{
                                width: "100%",
                                height: "110px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </form>
              </ModalBody>

              {/* FOOTER */}
              <ModalFooter
                style={{
                  borderTop: "1px solid #E5E7EB",
                  padding: "18px 24px",
                  background: "#fff",
                }}
              >
                <Button
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>

                <button
                  form="reviewForm"
                  type="submit"
                  disabled={revLoad}
                  style={{
                    minWidth: "180px",
                    height: "52px",
                    border: "none",
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg,#4F46E5,#7C3AED,#3B82F6)",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow:
                      "0 12px 30px rgba(79,70,229,.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {revLoad ? (
                    <>
                      <div className="spx-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane size={14} />
                      Submit Review
                    </>
                  )}
                </button>
              </ModalFooter>
            </>
          )}


        </ModalContent>
      </Modal>

    </>
  );
}