import React, { useState, useMemo, useEffect, useCallback } from "react";
import { getData } from "../context/DataContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import {
  FaRupeeSign, FaStar, FaShoppingCart, FaHeart, FaEye, FaBolt,
  FaTimes, FaSearch, FaChevronDown, FaChevronUp, FaThLarge,
  FaList, FaCheckSquare, FaSquare, FaFilter, FaTruck, FaUndo,
  FaSortAmountDown
} from "react-icons/fa";
import { MdOutlineTune, MdClose } from "react-icons/md";
import Loading from "../assets/Loading4.webm";

/* ── Static config ── */
const CATEGORIES = [
  { id:"all",          label:"All Products",  icon:"🛍️" },
  { id:"smartphones",  label:"Smartphones",   icon:"📱" },
  { id:"laptops",      label:"Laptops",       icon:"💻" },
  { id:"fragrances",   label:"Fragrances",    icon:"🌸" },
  { id:"skincare",     label:"Skincare",      icon:"✨" },
  { id:"groceries",    label:"Groceries",     icon:"🛒" },
  { id:"furniture",    label:"Furniture",     icon:"🪑" },
  { id:"tops",         label:"Tops",          icon:"👕" },
  { id:"womens-bags",  label:"Women's Bags",  icon:"👜" },
  { id:"sunglasses",   label:"Sunglasses",    icon:"🕶️" },
];
const PRICE_RANGES = [
  { id:"under-500",   label:"Under ₹500"       },
  { id:"500-2000",    label:"₹500 – ₹2,000"    },
  { id:"2000-10000",  label:"₹2,000 – ₹10,000" },
  { id:"above-10000", label:"Above ₹10,000"    },
];
const RATINGS = [4,3,2,1];
const SORT_OPTIONS = [
  { id:"featured",   label:"Featured"           },
  { id:"price-asc",  label:"Price: Low → High"  },
  { id:"price-desc", label:"Price: High → Low"  },
  { id:"rating",     label:"Top Rated"          },
  { id:"newest",     label:"Newest First"       },
];
const RIBBON_COLORS = [
  "linear-gradient(135deg,#ef4444,#f97316)",
  "linear-gradient(135deg,#8b5cf6,#6366f1)",
  "linear-gradient(135deg,#0891b2,#2563eb)",
  "linear-gradient(135deg,#16a34a,#059669)",
];
const getDiscount = i => [10,15,20,25,30,35,40,45,50][i%9];

/* ════════════════════
   STYLES — scoped to .cf-* 
   Background is transparent so the app's
   gradient+particles show through.
════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@600;700;800&display=swap');

/* ── page wrapper ── */
.cf-page {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: transparent;          /* lets app bg show through */
  min-height: 60vh;
  padding: 20px 16px 48px;
  max-width: 1400px;
  margin: 0 auto;
  color: #0f172a;
}

/* ── top control bar ── */
.cf-bar {
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(99,102,241,0.14);
  border-radius: 16px;
  padding: 10px 16px;
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 18px;
  box-shadow: 0 2px 16px rgba(79,70,229,0.08);
  flex-wrap: wrap;
}

/* search */
.cf-search-wrap { flex:1; min-width:180px; position:relative; }
.cf-search {
  width: 100%; padding: 9px 36px 9px 36px;
  background: rgba(255,255,255,0.85);
  border: 1.5px solid rgba(226,232,240,1);
  border-radius: 100px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13.5px; color: #0f172a; outline: none;
  transition: border-color .2s, box-shadow .2s;
  box-sizing: border-box;
}
.cf-search:focus {
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
}
.cf-search::placeholder { color: #94a3b8; }
.cf-search-icon {
  position:absolute; left:13px; top:50%; transform:translateY(-50%);
  color:#94a3b8; font-size:13px; pointer-events:none;
}
.cf-search-clr {
  position:absolute; right:13px; top:50%; transform:translateY(-50%);
  background:none; border:none; cursor:pointer;
  color:#94a3b8; font-size:11px; display:flex; align-items:center;
  transition:color .18s;
}
.cf-search-clr:hover { color:#334155; }

/* sort */
.cf-sort-wrap { position:relative; flex-shrink:0; }
.cf-sort {
  padding: 8px 30px 8px 30px;
  background: rgba(255,255,255,0.85);
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12.5px; color: #334155;
  outline: none; cursor: pointer; appearance: none;
  transition: border-color .18s;
}
.cf-sort:focus { border-color: #6366f1; }
.cf-sort-icon-l {
  position:absolute; left:9px; top:50%; transform:translateY(-50%);
  color:#94a3b8; font-size:11px; pointer-events:none;
}
.cf-sort-icon-r {
  position:absolute; right:9px; top:50%; transform:translateY(-50%);
  color:#94a3b8; font-size:10px; pointer-events:none;
}

/* view toggles */
.cf-view-btn {
  width:33px; height:33px; border-radius:9px;
  border: 1.5px solid #e2e8f0;
  background: rgba(255,255,255,0.85);
  display:flex; align-items:center; justify-content:center;
  color:#94a3b8; cursor:pointer; flex-shrink:0;
  transition: all .18s;
}
.cf-view-btn.on {
  background: #eef2ff; border-color: #c7d2fe; color: #4f46e5;
}
.cf-view-btn:hover:not(.on) { border-color: #c7d2fe; color: #334155; }

/* filter FAB — mobile only */
.cf-filter-fab {
  display: none;
  align-items: center; gap: 6px;
  padding: 8px 14px;
  background: linear-gradient(135deg,#4f46e5,#2563eb);
  color: white; border: none; border-radius: 100px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 12.5px; font-weight: 700; cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 3px 14px rgba(79,70,229,0.30);
  transition: filter .18s, transform .18s;
}
.cf-filter-fab:hover { filter:brightness(1.1); transform:scale(1.03); }
.cf-filter-fab-badge {
  background: #ea580c; width:18px; height:18px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  font-size:10px; font-weight:800;
}
@media(max-width:768px){
  .cf-filter-fab { display:flex; }
  .cf-view-btns  { display:none; }
  .cf-sort-wrap  { display:none; }
}

/* ── category pill row ── */
.cf-pills {
  display:flex; gap:8px; overflow-x:auto;
  padding-bottom:4px; margin-bottom:16px;
  scrollbar-width:none;
}
.cf-pills::-webkit-scrollbar { display:none; }
.cf-pill {
  display:flex; align-items:center; gap:5px;
  padding: 7px 15px;
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(226,232,240,0.8);
  border-radius: 100px;
  font-size: 12.5px; font-weight: 600; color: #475569;
  cursor:pointer; white-space:nowrap; flex-shrink:0;
  transition: all .18s;
  box-shadow: 0 1px 4px rgba(79,70,229,0.05);
}
.cf-pill:hover {
  border-color:#c7d2fe; color:#4f46e5;
  background: rgba(238,242,255,0.9);
}
.cf-pill.on {
  background: linear-gradient(135deg,#4f46e5,#2563eb);
  border-color: #4f46e5; color: white;
  box-shadow: 0 3px 12px rgba(79,70,229,0.30);
}

/* ── active chip strip ── */
.cf-chips { display:flex; align-items:center; gap:7px; flex-wrap:wrap; margin-bottom:14px; }
.cf-chip {
  display:flex; align-items:center; gap:5px;
  background: rgba(238,242,255,0.9);
  border: 1px solid #c7d2fe; border-radius:100px;
  padding: 4px 11px;
  font-size: 11.5px; font-weight: 600; color: #4f46e5;
  backdrop-filter: blur(8px);
}
.cf-chip-x {
  background:none; border:none; cursor:pointer;
  color:#4f46e5; font-size:10px; display:flex; align-items:center;
  transition:color .15s;
}
.cf-chip-x:hover { color:#ef4444; }

/* ── layout: sidebar + main ── */
.cf-layout { display:flex; gap:18px; align-items:flex-start; }

/* ── sidebar ── */
.cf-sidebar {
  width: 248px; flex-shrink:0;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(99,102,241,0.12);
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(79,70,229,0.08);
  position: sticky; top: 80px;
  overflow: hidden;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}
.cf-sidebar::-webkit-scrollbar { width:4px; }
.cf-sidebar::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:4px; }

@media(max-width:768px){
  .cf-sidebar {
    position: fixed; top:0; left:0;
    width:280px; height:100vh; max-height:100vh;
    border-radius:0 18px 18px 0;
    z-index:400;
    transform:translateX(-100%);
    transition: transform .3s cubic-bezier(.4,0,.2,1);
  }
  .cf-sidebar.open { transform:translateX(0); }
  .cf-main { width:100% !important; }
}

.cf-sb-head {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(226,232,240,0.7);
  display:flex; align-items:center; justify-content:space-between;
  position:sticky; top:0;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(20px);
  z-index:1;
}
.cf-sb-title {
  font-family:'Syne',sans-serif;
  font-size:14px; font-weight:800; color:#0f172a;
  display:flex; align-items:center; gap:7px;
}
.cf-sb-title svg { color:#4f46e5; }
.cf-filter-count {
  background:#4f46e5; color:white;
  font-size:10px; font-weight:800;
  padding:1px 7px; border-radius:100px;
}
.cf-sb-actions { display:flex; align-items:center; gap:8px; }
.cf-clear-btn {
  font-size:11.5px; font-weight:700; color:#4f46e5;
  background:none; border:none; cursor:pointer;
  padding:3px 8px; border-radius:7px; transition:background .18s;
}
.cf-clear-btn:hover { background:#eef2ff; }
.cf-sb-close {
  background:none; border:none; cursor:pointer;
  color:#94a3b8; font-size:17px;
  display:none; align-items:center; transition:color .18s;
}
.cf-sb-close:hover { color:#0f172a; }
@media(max-width:768px){ .cf-sb-close { display:flex; } }

/* filter sections */
.cf-sec { border-bottom:1px solid rgba(226,232,240,0.6); }
.cf-sec-btn {
  width:100%; display:flex; align-items:center; justify-content:space-between;
  padding:12px 16px; background:none; border:none; cursor:pointer;
  transition:background .15s;
}
.cf-sec-btn:hover { background:rgba(238,242,255,0.5); }
.cf-sec-label {
  font-size:11.5px; font-weight:800; color:#475569;
  letter-spacing:.07em; text-transform:uppercase;
}
.cf-sec-body { padding: 2px 16px 12px; }

/* category rows */
.cf-cat-row {
  display:flex; align-items:center; justify-content:space-between;
  padding: 8px 10px; border-radius:10px; cursor:pointer;
  transition:background .15s, transform .15s; gap:8px;
}
.cf-cat-row:hover { background:rgba(238,242,255,0.7); transform:translateX(2px); }
.cf-cat-row.on {
  background: linear-gradient(135deg,rgba(238,242,255,0.9),rgba(219,234,254,0.9));
  border:1px solid #c7d2fe;
}
.cf-cat-left { display:flex; align-items:center; gap:8px; }
.cf-cat-emoji { font-size:15px; }
.cf-cat-name { font-size:13px; font-weight:500; color:#334155; transition:color .15s; }
.cf-cat-row.on .cf-cat-name { color:#4f46e5; font-weight:700; }

/* checkbox rows */
.cf-chk-row {
  display:flex; align-items:center; gap:9px;
  padding:7px 4px; cursor:pointer; border-radius:7px;
  transition:background .15s;
}
.cf-chk-row:hover { background:rgba(238,242,255,0.5); }
.cf-chk-icon { font-size:14px; color:#cbd5e1; transition:color .15s; }
.cf-chk-row.on .cf-chk-icon { color:#4f46e5; }
.cf-chk-label { font-size:13px; color:#475569; transition:color .15s; }
.cf-chk-row.on .cf-chk-label { color:#4f46e5; font-weight:600; }

.cf-star-row {
  display:flex; align-items:center; gap:7px;
  padding:7px 4px; cursor:pointer; border-radius:7px;
  transition:background .15s;
}
.cf-star-row:hover { background:rgba(238,242,255,0.5); }
.cf-star-icons { display:flex; gap:2px; }
.cf-star-label { font-size:12.5px; color:#64748b; }
.cf-star-row.on .cf-star-label { color:#4f46e5; font-weight:600; }

/* ── main content ── */
.cf-main { flex:1; min-width:0; }

.cf-results-bar {
  display:flex; align-items:center; justify-content:space-between;
  margin-bottom:14px; flex-wrap:wrap; gap:8px;
}
.cf-results-txt { font-size:13px; color:#64748b; }
.cf-results-txt b { color:#0f172a; }
.cf-results-txt em { font-style:normal; color:#4f46e5; font-weight:700; }

/* mobile sort inline */
.cf-mobile-sort {
  display:none;
  padding: 7px 12px;
  background: rgba(255,255,255,0.8);
  border: 1.5px solid #e2e8f0;
  border-radius:10px;
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:12px; color:#334155;
  outline:none; cursor:pointer; appearance:none;
  backdrop-filter:blur(10px);
}
@media(max-width:768px){ .cf-mobile-sort { display:block; } }

/* ── product grid ── */
.cf-grid {
  display:grid;
  grid-template-columns: repeat(4,1fr);
  gap:14px;
}
@media(max-width:1200px){ .cf-grid { grid-template-columns:repeat(3,1fr); } }
@media(max-width:900px)  { .cf-grid { grid-template-columns:repeat(2,1fr); gap:10px; } }
@media(max-width:420px)  { .cf-grid { grid-template-columns:repeat(2,1fr); gap:8px; } }
.cf-grid.lv { grid-template-columns:1fr; }

/* ── product card ── */
.cf-card {
  background: rgba(255,255,255,0.78);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(226,232,240,0.8);
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  display:flex; flex-direction:column;
  box-shadow: 0 2px 12px rgba(79,70,229,0.07);
  transition: transform .24s cubic-bezier(.34,1.2,.64,1), box-shadow .22s, border-color .22s;
  animation: cfCardIn .38s ease both;
}
@keyframes cfCardIn {
  from { opacity:0; transform:translateY(18px) scale(.97); }
  to   { opacity:1; transform:translateY(0) scale(1); }
}
.cf-card:hover {
  transform: translateY(-7px) scale(1.015);
  box-shadow: 0 18px 52px rgba(79,70,229,0.18);
  border-color: rgba(199,210,254,0.9);
}

/* list mode */
.cf-grid.lv .cf-card { flex-direction:row; align-items:stretch; max-height:195px; }
@media(max-width:500px){ .cf-grid.lv .cf-card { flex-direction:column; max-height:none; } }

/* ribbon */
.cf-ribbon {
  position:absolute; top:0; left:0; z-index:3;
  padding:4px 10px 4px 8px;
  border-radius:0 0 12px 0;
  font-size:10px; font-weight:800; color:white;
  display:flex; align-items:center; gap:3px;
}

/* hover actions */
.cf-card-acts {
  position:absolute; top:8px; right:8px; z-index:4;
  display:flex; flex-direction:column; gap:5px;
  opacity:0; transform:translateX(8px);
  transition:opacity .2s, transform .2s;
}
.cf-card:hover .cf-card-acts { opacity:1; transform:translateX(0); }
@media(max-width:768px){ .cf-card-acts { opacity:1; transform:none; } }
.cf-act-btn {
  width:30px; height:30px; border-radius:50%;
  background:rgba(255,255,255,0.9);
  backdrop-filter:blur(8px);
  border:1px solid rgba(226,232,240,0.8);
  display:flex; align-items:center; justify-content:center;
  font-size:12px; color:#94a3b8; cursor:pointer;
  box-shadow:0 2px 8px rgba(0,0,0,0.08);
  transition:all .18s;
}
.cf-act-btn:hover { background:#4f46e5; color:white; border-color:#4f46e5; transform:scale(1.12); }
.cf-act-btn.w:hover { background:#ef4444; border-color:#ef4444; }
.cf-act-btn.wl { background:#fef2f2; color:#ef4444; border-color:#fecaca; }

/* image zone */
.cf-img-zone {
  background: linear-gradient(145deg,#f0f4ff,#eef2ff);
  height:175px; display:flex; align-items:center; justify-content:center;
  position:relative; overflow:hidden; flex-shrink:0;
}
@media(max-width:420px){ .cf-img-zone { height:145px; } }
.cf-grid.lv .cf-img-zone { width:180px; height:195px; border-radius:0; }
@media(max-width:500px){ .cf-grid.lv .cf-img-zone { width:100%; height:155px; } }
.cf-img-zone::before {
  content:''; position:absolute; inset:0;
  background:radial-gradient(circle at 50% 60%,rgba(99,102,241,0.08) 0%,transparent 70%);
}
.cf-img {
  width:125px; height:125px; object-fit:contain;
  position:relative; z-index:1;
  filter:drop-shadow(0 8px 18px rgba(0,0,0,0.10));
  transition:transform .4s cubic-bezier(.34,1.2,.64,1);
}
@media(max-width:420px){ .cf-img { width:100px; height:100px; } }
.cf-card:hover .cf-img { transform:scale(1.13) translateY(-6px); }

/* card body */
.cf-body {
  padding:12px 13px 13px;
  display:flex; flex-direction:column; gap:6px; flex:1;
}
@media(max-width:420px){ .cf-body { padding:9px; gap:5px; } }

.cf-card-top { display:flex; align-items:flex-start; justify-content:space-between; gap:5px; }
.cf-brand { font-size:10px; font-weight:800; color:#6366f1; text-transform:uppercase; letter-spacing:.07em; }
.cf-stock {
  font-size:9.5px; font-weight:700; color:#16a34a;
  background:#dcfce7; padding:2px 6px; border-radius:5px; white-space:nowrap; flex-shrink:0;
}
.cf-stock.out { color:#ef4444; background:#fef2f2; }

.cf-title {
  font-size:13px; font-weight:600; color:#1e293b; line-height:1.35;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
}
@media(max-width:420px){ .cf-title { font-size:12px; } }

.cf-stars-row { display:flex; align-items:center; gap:5px; }
.cf-rating-chip {
  display:flex; align-items:center; gap:3px;
  background:#16a34a; color:white;
  font-size:10.5px; font-weight:800;
  padding:2px 7px; border-radius:5px;
}
.cf-rcount { font-size:11px; color:#94a3b8; }

.cf-price-row { display:flex; align-items:baseline; gap:6px; flex-wrap:wrap; }
.cf-price {
  font-family:'Syne',sans-serif;
  font-size:17px; font-weight:800; color:#0f172a;
  display:flex; align-items:flex-start; line-height:1;
}
@media(max-width:420px){ .cf-price { font-size:15px; } }
.cf-price-sym { font-size:.58em; margin-top:.22em; }
.cf-orig { font-size:11.5px; color:#94a3b8; text-decoration:line-through; }
.cf-off  { font-size:11.5px; font-weight:800; color:#16a34a; }

.cf-trust { display:flex; gap:8px; flex-wrap:wrap; }
.cf-trust-item {
  display:flex; align-items:center; gap:3px;
  font-size:10px; font-weight:600; color:#64748b;
}
.cf-trust-item svg { color:#6366f1; font-size:9px; }

/* CTA */
.cf-cta { margin-top:auto; }
.cf-add-btn {
  width:100%; padding:9px 12px; border:none; border-radius:11px;
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:12.5px; font-weight:700; cursor:pointer;
  display:flex; align-items:center; justify-content:center; gap:7px;
  transition:transform .18s, box-shadow .18s, filter .18s;
  position:relative; overflow:hidden;
}
@media(max-width:420px){ .cf-add-btn { font-size:11.5px; padding:8px; } }
.cf-add-btn::before {
  content:''; position:absolute; inset:0;
  background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.18) 50%,transparent 70%);
  background-size:200% 100%;
  animation:cfShim 2.8s ease-in-out infinite;
}
@keyframes cfShim { 0%{background-position:-200% center} 100%{background-position:200% center} }
.cf-add-btn.add {
  background:linear-gradient(135deg,#4f46e5,#2563eb);
  color:white; box-shadow:0 3px 14px rgba(79,70,229,0.25);
}
.cf-add-btn.add:hover { filter:brightness(1.09); transform:translateY(-1px); box-shadow:0 6px 22px rgba(79,70,229,0.38); }
.cf-add-btn.incart {
  background:linear-gradient(135deg,#059669,#10b981);
  color:white; box-shadow:0 3px 14px rgba(16,185,129,0.2);
}
.cf-add-btn.incart:hover { filter:brightness(1.08); transform:translateY(-1px); }
.cf-add-btn:active { transform:scale(.97) !important; }

/* empty state */
.cf-empty {
  grid-column:1/-1;
  display:flex; flex-direction:column; align-items:center;
  padding:70px 24px; gap:12px; text-align:center;
}
.cf-empty-em { font-size:48px; }
.cf-empty-h {
  font-family:'Syne',sans-serif; font-size:1.15rem; font-weight:800; color:#334155;
}
.cf-empty-p { font-size:.9rem; color:#94a3b8; max-width:280px; }
.cf-empty-btn {
  margin-top:6px; padding:10px 24px;
  background:linear-gradient(135deg,#4f46e5,#2563eb);
  color:white; border:none; border-radius:100px;
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:13px; font-weight:700; cursor:pointer;
  box-shadow:0 3px 14px rgba(79,70,229,0.28);
  transition:filter .18s,transform .18s;
}
.cf-empty-btn:hover { filter:brightness(1.1); transform:scale(1.03); }

/* overlay — mobile only */
.cf-overlay {
  display:none;
  position:fixed; inset:0;
  background:rgba(0,0,0,0.42);
  z-index:380;
}
@media(max-width:768px){ .cf-overlay.show { display:block; } }

/* loading */
.cf-loading { display:flex; justify-content:center; padding:80px 0; }
`;

/* ══════════════════════════════════════
   COMPONENT
══════════════════════════════════════ */
export default function CategoryFilter() {
  const { data, fetchAllProducts } = getData();
  const { addToCart, cartItem }     = useCart();
  const { isSignedIn }              = useUser();
  const navigate                    = useNavigate();

  const [loading,        setLoading]        = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePrices,   setActivePrices]   = useState([]);
  const [activeRating,   setActiveRating]   = useState(null);
  const [sortBy,         setSortBy]         = useState("featured");
  const [search,         setSearch]         = useState("");
  const [viewMode,       setViewMode]       = useState("grid");
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [openSec,        setOpenSec]        = useState({ cat:true, price:true, rating:true });
  const [wishlist,       setWishlist]       = useState([]);

  useEffect(() => {
    const id = "cf-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style"); el.id = id; el.textContent = CSS;
      document.head.appendChild(el);
    }
    if (!data || data.length === 0) fetchAllProducts().finally(() => setLoading(false));
    else setLoading(false);
  }, []);

  const toggleSec   = k  => setOpenSec(p => ({ ...p, [k]:!p[k] }));
  const togglePrice = id => setActivePrices(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  const inCart      = item => cartItem.some(c => String(c.productId) === String(item.id));
  const isWished    = id => wishlist.includes(id);
  const toggleWish  = (id, e) => {
    e.stopPropagation();
    setWishlist(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
    toast.success(wishlist.includes(id) ? "Removed from wishlist" : "Wishlisted! ❤️");
  };
  const handleCart = useCallback((item, e) => {
    e.stopPropagation();
    if (!isSignedIn) { toast.error("Please login first"); navigate("/sign-in"); return; }
    if (inCart(item)) { navigate("/cart"); return; }
    addToCart(item); toast.success("Added to cart 🛒");
  }, [isSignedIn, cartItem, addToCart, navigate]);

  const clearAll = () => {
    setActiveCategory("all"); setActivePrices([]);
    setActiveRating(null); setSearch("");
  };

  /* filtered products */
  const products = useMemo(() => {
    if (!data) return [];
    let out = [...data];
    if (activeCategory !== "all")
      out = out.filter(p => p.category?.toLowerCase().includes(activeCategory));
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }
    if (activePrices.length) {
      out = out.filter(p => {
        const pr = p.price||0;
        return activePrices.some(r => {
          if (r==="under-500")   return pr<500;
          if (r==="500-2000")    return pr>=500  && pr<2000;
          if (r==="2000-10000")  return pr>=2000 && pr<10000;
          if (r==="above-10000") return pr>=10000;
          return true;
        });
      });
    }
    if (activeRating) out = out.filter(p => (p.rating||0) >= activeRating);
    if (sortBy==="price-asc")  out.sort((a,b) => (a.price||0)-(b.price||0));
    if (sortBy==="price-desc") out.sort((a,b) => (b.price||0)-(a.price||0));
    if (sortBy==="rating")     out.sort((a,b) => (b.rating||0)-(a.rating||0));
    if (sortBy==="newest")     out.reverse();
    return out;
  }, [data, activeCategory, search, activePrices, activeRating, sortBy]);

  const filterCount = [
    activeCategory !== "all",
    activePrices.length > 0,
    activeRating !== null,
  ].filter(Boolean).length;

  return (
    <div className="cf-page">
      {/* mobile sidebar overlay */}
      <div
        className={`cf-overlay${sidebarOpen?" show":""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── CONTROL BAR ── */}
      <div className="cf-bar">
        {/* Search */}
        <div className="cf-search-wrap">
          <FaSearch className="cf-search-icon"/>
          <input
            className="cf-search"
            placeholder="Search products, brands, categories…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="cf-search-clr" onClick={() => setSearch("")}>
              <FaTimes/>
            </button>
          )}
        </div>

        {/* Sort — desktop */}
        <div className="cf-sort-wrap cf-view-btns">
          <FaSortAmountDown className="cf-sort-icon-l"/>
          <select className="cf-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
          <FaChevronDown className="cf-sort-icon-r"/>
        </div>

        {/* View toggles — desktop */}
        <div style={{display:"flex",gap:6}} className="cf-view-btns">
          <button className={`cf-view-btn${viewMode==="grid"?" on":""}`} onClick={() => setViewMode("grid")}>
            <FaThLarge size={12}/>
          </button>
          <button className={`cf-view-btn${viewMode==="list"?" on":""}`} onClick={() => setViewMode("list")}>
            <FaList size={12}/>
          </button>
        </div>

        {/* Mobile filter FAB */}
        <button className="cf-filter-fab" onClick={() => setSidebarOpen(true)}>
          <FaFilter size={11}/> Filters
          {filterCount > 0 && <span className="cf-filter-fab-badge">{filterCount}</span>}
        </button>
      </div>

      {/* ── CATEGORY PILLS ── */}
      <div className="cf-pills">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            className={`cf-pill${activeCategory===c.id?" on":""}`}
            onClick={() => setActiveCategory(c.id)}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* ── ACTIVE FILTER CHIPS ── */}
      {filterCount > 0 && (
        <div className="cf-chips">
          <span style={{fontSize:11.5,fontWeight:700,color:"#64748b"}}>Active:</span>
          {activeCategory !== "all" && (
            <div className="cf-chip">
              {CATEGORIES.find(c=>c.id===activeCategory)?.icon}{" "}
              {CATEGORIES.find(c=>c.id===activeCategory)?.label}
              <button className="cf-chip-x" onClick={() => setActiveCategory("all")}><FaTimes/></button>
            </div>
          )}
          {activePrices.map(pr => (
            <div key={pr} className="cf-chip">
              {PRICE_RANGES.find(p=>p.id===pr)?.label}
              <button className="cf-chip-x" onClick={() => togglePrice(pr)}><FaTimes/></button>
            </div>
          ))}
          {activeRating && (
            <div className="cf-chip">
              {activeRating}★ & above
              <button className="cf-chip-x" onClick={() => setActiveRating(null)}><FaTimes/></button>
            </div>
          )}
          <button onClick={clearAll}
            style={{fontSize:11.5,fontWeight:700,color:"#ef4444",background:"none",border:"none",cursor:"pointer",padding:"2px 6px"}}>
            Clear all
          </button>
        </div>
      )}

      {/* ── SIDEBAR + MAIN LAYOUT ── */}
      <div className="cf-layout">

        {/* ── SIDEBAR ── */}
        <aside className={`cf-sidebar${sidebarOpen?" open":""}`}>
          <div className="cf-sb-head">
            <div className="cf-sb-title">
              <MdOutlineTune size={15}/> Filters
              {filterCount > 0 && <span className="cf-filter-count">{filterCount}</span>}
            </div>
            <div className="cf-sb-actions">
              {filterCount > 0 && <button className="cf-clear-btn" onClick={clearAll}>Clear All</button>}
              <button className="cf-sb-close" onClick={() => setSidebarOpen(false)}><MdClose/></button>
            </div>
          </div>

          {/* Categories */}
          <div className="cf-sec">
            <button className="cf-sec-btn" onClick={() => toggleSec("cat")}>
              <span className="cf-sec-label">Category</span>
              {openSec.cat ? <FaChevronUp size={10}/> : <FaChevronDown size={10}/>}
            </button>
            {openSec.cat && (
              <div className="cf-sec-body" style={{paddingTop:4}}>
                {CATEGORIES.map(c => (
                  <div key={c.id}
                    className={`cf-cat-row${activeCategory===c.id?" on":""}`}
                    onClick={() => { setActiveCategory(c.id); setSidebarOpen(false); }}
                  >
                    <div className="cf-cat-left">
                      <span className="cf-cat-emoji">{c.icon}</span>
                      <span className="cf-cat-name">{c.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="cf-sec">
            <button className="cf-sec-btn" onClick={() => toggleSec("price")}>
              <span className="cf-sec-label">Price Range</span>
              {openSec.price ? <FaChevronUp size={10}/> : <FaChevronDown size={10}/>}
            </button>
            {openSec.price && (
              <div className="cf-sec-body">
                {PRICE_RANGES.map(pr => (
                  <div key={pr.id}
                    className={`cf-chk-row${activePrices.includes(pr.id)?" on":""}`}
                    onClick={() => togglePrice(pr.id)}
                  >
                    {activePrices.includes(pr.id)
                      ? <FaCheckSquare className="cf-chk-icon" style={{color:"#4f46e5"}}/>
                      : <FaSquare className="cf-chk-icon"/>
                    }
                    <span className="cf-chk-label">{pr.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="cf-sec">
            <button className="cf-sec-btn" onClick={() => toggleSec("rating")}>
              <span className="cf-sec-label">Customer Rating</span>
              {openSec.rating ? <FaChevronUp size={10}/> : <FaChevronDown size={10}/>}
            </button>
            {openSec.rating && (
              <div className="cf-sec-body">
                {RATINGS.map(r => (
                  <div key={r}
                    className={`cf-star-row${activeRating===r?" on":""}`}
                    onClick={() => setActiveRating(activeRating===r?null:r)}
                  >
                    {activeRating===r
                      ? <FaCheckSquare style={{color:"#4f46e5",fontSize:13,flexShrink:0}}/>
                      : <FaSquare style={{color:"#cbd5e1",fontSize:13,flexShrink:0}}/>
                    }
                    <div className="cf-star-icons">
                      {[...Array(5)].map((_,i)=>(
                        <FaStar key={i} size={11} color={i<r?"#eab308":"#e2e8f0"}/>
                      ))}
                    </div>
                    <span className="cf-star-label">{r}★ & above</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="cf-main">
          {/* Results bar */}
          <div className="cf-results-bar">
            <p className="cf-results-txt">
              Showing <b>{products.length}</b> results
              {activeCategory!=="all" && <> in <em>{CATEGORIES.find(c=>c.id===activeCategory)?.label}</em></>}
              {search && <> for "<b style={{color:"#0f172a"}}>{search}</b>"</>}
            </p>
            <select className="cf-mobile-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="cf-loading">
              <video autoPlay loop muted style={{width:130}}>
                <source src={Loading} type="video/webm"/>
              </video>
            </div>
          ) : (
            <div className={`cf-grid${viewMode==="list"?" lv":""}`}>
              {products.length === 0 ? (
                <div className="cf-empty">
                  <div className="cf-empty-em">🔍</div>
                  <div className="cf-empty-h">No products found</div>
                  <p className="cf-empty-p">Try adjusting your filters or search for something else.</p>
                  <button className="cf-empty-btn" onClick={clearAll}>Reset Filters</button>
                </div>
              ) : products.map((item, idx) => {
                const disc  = getDiscount(idx);
                const orig  = Math.round((item.price||0) / (1-disc/100));
                const stars = Math.min(5, Math.max(3, Math.round(item.rating||4)));
                const added = inCart(item);
                const wished= isWished(item.id);

                return (
                  <div
                    key={item.id}
                    className="cf-card"
                    style={{ animationDelay:`${Math.min(idx*0.04,0.5)}s` }}
                    onClick={() => navigate(`/products/${item.id}`)}
                  >
                    {/* Ribbon */}
                    <div className="cf-ribbon" style={{background:RIBBON_COLORS[idx%4]}}>
                      <FaBolt size={8}/> {disc}% OFF
                    </div>

                    {/* Hover actions */}
                    <div className="cf-card-acts">
                      <button
                        className={`cf-act-btn w${wished?" wl":""}`}
                        onClick={e => toggleWish(item.id, e)}
                      >
                        <FaHeart/>
                      </button>
                      <button
                        className="cf-act-btn"
                        onClick={e => { e.stopPropagation(); navigate(`/products/${item.id}`); }}
                      >
                        <FaEye/>
                      </button>
                    </div>

                    {/* Image */}
                    <div className="cf-img-zone">
                      <img src={item.thumbnail} alt={item.title} className="cf-img"/>
                    </div>

                    {/* Body */}
                    <div className="cf-body">
                      <div className="cf-card-top">
                        <div className="cf-brand">{item.brand || item.category || "Brand"}</div>
                        <span className={`cf-stock${item.stock===0?" out":""}`}>
                          {item.stock===0 ? "Out of Stock" : "In Stock"}
                        </span>
                      </div>
                      <div className="cf-title">{item.title}</div>
                      <div className="cf-stars-row">
                        <span className="cf-rating-chip">
                          {item.rating?.toFixed(1)||"4.2"} <FaStar size={9}/>
                        </span>
                        <span className="cf-rcount">({(800+idx*173).toLocaleString()})</span>
                      </div>
                      <div className="cf-price-row">
                        <span className="cf-price">
                          <span className="cf-price-sym"><FaRupeeSign/></span>
                          {(item.price||0).toLocaleString("en-IN")}
                        </span>
                        <span className="cf-orig">₹{orig.toLocaleString("en-IN")}</span>
                        <span className="cf-off">{disc}% off</span>
                      </div>
                      <div className="cf-trust">
                        <span className="cf-trust-item"><FaTruck/> Free Delivery</span>
                        <span className="cf-trust-item"><FaUndo/> 10-Day Return</span>
                      </div>
                      <div className="cf-cta">
                        <button
                          className={`cf-add-btn${added?" incart":" add"}`}
                          onClick={e => handleCart(item, e)}
                        >
                          <FaShoppingCart size={12}/>
                          {added ? "Go to Cart" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}