import React, { useState } from "react";
import { getData } from "../context/DataContext";

import { MdCategory, MdOutlineCurrencyRupee } from "react-icons/md";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import {
  FaTimes,
  FaChevronDown,
  FaCheck,
  FaSortAmountDown,
  FaTags,
} from "react-icons/fa";

import { FaSliders } from "react-icons/fa6";
export default function FilterSection({ open, setOpen }) {
  const {
    category, setCategory,
    brand, setBrand,
    priceRange, setPriceRange,
    categoryOnlyData, brandOnlyData, sort, setSort
  } = getData();
  const [openSort, setOpenSort] = useState(true);
  const [openCategory, setOpenCategory] = useState(true);
  const [openBrand, setOpenBrand] = useState(true);
console.log("FilterSection Rendered");
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .fs-root * { font-family:'Plus Jakarta Sans',sans-serif; }
        .fs-serif { font-family:'Playfair Display',serif; }

        @keyframes fsSlideIn {
          from { opacity:0; transform:translateX(100px); }
          to { opacity:1; transform:translateX(0); }
        }
        @keyframes fsBackdropIn {
          from { opacity:0; }
          to { opacity:1; }
        }
        @keyframes fsExpandOpen {
          from { max-height:0; opacity:0; }
          to { max-height:1000px; opacity:1; }
        }
        @keyframes fsExpandClose {
          from { max-height:1000px; opacity:1; }
          to { max-height:0; opacity:0; }
        }

        .fs-backdrop {
          animation: fsBackdropIn 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .fs-drawer {
          animation: fsSlideIn 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .fs-expand-open { animation: fsExpandOpen 0.3s cubic-bezier(0.22,1,0.36,1) forwards; }
        .fs-expand-close { animation: fsExpandClose 0.3s cubic-bezier(0.22,1,0.36,1) forwards; }

        /* scrollbar */
        .fs-scrollable::-webkit-scrollbar { width:6px; }
        .fs-scrollable::-webkit-scrollbar-track { background:transparent; }
        .fs-scrollable::-webkit-scrollbar-thumb {
          background:linear-gradient(180deg,#6366f1,#3b82f6);
          border-radius:3px;
          transition:background 0.2s;
        }
        .fs-scrollable::-webkit-scrollbar-thumb:hover {
          background:linear-gradient(180deg,#4f46e5,#2563eb);
        }

        /* filter section card */
        .fs-section {
          background:rgba(255,255,255,0.85);
          backdrop-filter:blur(14px);
          border:1px solid rgba(99,102,241,0.12);
          border-radius:16px;
          padding:16px;
          transition:all 0.2s;
        }
        .fs-section:hover {
          background:rgba(255,255,255,0.92);
          border-color:rgba(99,102,241,0.2);
          box-shadow:0 4px 16px rgba(99,102,241,0.08);
        }

        /* section header */
        .fs-section-header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          width:100%;
          padding:8px 12px;
          border-radius:12px;
          cursor:pointer;
          transition:all 0.2s;
        }
        .fs-section-header:hover {
          background:rgba(99,102,241,0.05);
        }

        .fs-section-title {
          display:flex;
          align-items:center;
          gap:10px;
          font-size:14px;
          font-weight:700;
          color:#1e1b4b;
          letter-spacing:0.02em;
        }

        .fs-section-icon {
          color:#6366f1;
          font-size:14px;
        }

        .fs-chevron {
          color:#a5b4fc;
          transition:transform 0.3s cubic-bezier(0.22,1,0.36,1);
          font-size:12px;
        }
        .fs-chevron.open { transform:rotate(180deg); }

        /* list items */
        .fs-list {
          display:flex;
          flex-direction:column;
          gap:8px;
          margin-top:12px;
          max-height:200px;
          overflow-y:auto;
        }

        .fs-item {
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:10px 12px;
          border-radius:11px;
          cursor:pointer;
          transition:all 0.2s;
          font-size:13px;
          color:#4b5563;
          border:1px solid transparent;
          background:transparent;
        }

        .fs-item:hover {
          background:rgba(99,102,241,0.06);
          border-color:rgba(99,102,241,0.12);
          color:#4f46e5;
        }

        .fs-item.active {
          background:linear-gradient(135deg,rgba(99,102,241,0.14),rgba(37,99,235,0.08));
          border-color:rgba(99,102,241,0.25);
          color:#4f46e5;
          font-weight:600;
          box-shadow:inset 0 2px 6px rgba(99,102,241,0.08);
        }

        .fs-checkmark {
          width:16px;
          height:16px;
          border-radius:4px;
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-size:10px;
          flex-shrink:0;
          animation:scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes scaleIn { from { transform:scale(0.6); opacity:0; } to { transform:scale(1); opacity:1; } }

        /* price section */
        .fs-price-header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:16px;
        }

        .fs-price-label {
          display:flex;
          align-items:center;
          gap:8px;
          font-size:13px;
          font-weight:700;
          color:#4b5563;
        }

        .fs-price-value {
          display:flex;
          align-items:center;
          gap:4px;
          font-weight:700;
          color:#4f46e5;
          font-size:13px;
          letter-spacing:0.02em;
        }

        /* range slider */
        .fs-range-wrapper {
          position:relative;
          width:100%;
        }

        .fs-range-input {
          width:100%;
          height:6px;
          border-radius:3px;
          background:linear-gradient(90deg,#e0e7ff 0%,#bfdbfe 100%);
          outline:none;
          -webkit-appearance:none;
          appearance:none;
          cursor:pointer;
        }

        .fs-range-input::-webkit-slider-thumb {
          -webkit-appearance:none;
          appearance:none;
          width:20px;
          height:20px;
          border-radius:50%;
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          cursor:pointer;
          box-shadow:0 2px 8px rgba(79,70,229,0.35),inset 0 1px 2px rgba(255,255,255,0.4);
          border:2px solid white;
          transition:all 0.2s;
        }

        .fs-range-input::-webkit-slider-thumb:hover {
          transform:scale(1.15);
          box-shadow:0 4px 14px rgba(79,70,229,0.45),inset 0 1px 2px rgba(255,255,255,0.4);
        }

        .fs-range-input::-moz-range-thumb {
          width:20px;
          height:20px;
          border-radius:50%;
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          cursor:pointer;
          box-shadow:0 2px 8px rgba(79,70,229,0.35),inset 0 1px 2px rgba(255,255,255,0.4);
          border:2px solid white;
          transition:all 0.2s;
        }

        .fs-range-input::-moz-range-thumb:hover {
          transform:scale(1.15);
          box-shadow:0 4px 14px rgba(79,70,229,0.45),inset 0 1px 2px rgba(255,255,255,0.4);
        }

        /* footer buttons */
        .fs-footer {
          display:flex;
          gap:10px;
        }

        .fs-btn {
          flex:1;
          padding:13px 0;
          border-radius:12px;
          font-size:14px;
          font-weight:700;
          cursor:pointer;
          transition:all 0.2s;
          letter-spacing:0.02em;
          border:none;
          position:relative;
          overflow:hidden;
        }

        .fs-btn-reset {
          background:rgba(255,255,255,0.8);
          border:1.5px solid rgba(99,102,241,0.2);
          color:#4f46e5;
          backdrop-filter:blur(8px);
        }
        .fs-btn-reset:hover {
          background:rgba(99,102,241,0.08);
          border-color:rgba(99,102,241,0.3);
          transform:translateY(-2px);
          box-shadow:0 4px 12px rgba(99,102,241,0.15);
        }
        .fs-btn-reset:active { transform:scale(0.97); }

        .fs-btn-apply {
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          color:white;
          box-shadow:0 4px 18px rgba(79,70,229,0.35);
        }
        .fs-btn-apply:hover {
          transform:translateY(-2px);
          box-shadow:0 6px 24px rgba(79,70,229,0.45);
        }
        .fs-btn-apply::before {
          content:'';
          position:absolute;
          inset:0;
          background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.2) 50%,transparent 70%);
          background-size:200% 100%;
          animation:fsShimmer 2.6s ease-in-out infinite;
        }
        @keyframes fsShimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        .fs-btn-apply:active { transform:scale(0.96); }

        /* header close button */
        .fs-close-btn {
          width:32px;
          height:32px;
          border-radius:10px;
          background:rgba(99,102,241,0.08);
          border:none;
          color:#6366f1;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          transition:all 0.2s;
          font-size:16px;
        }
        .fs-close-btn:hover {
          background:rgba(99,102,241,0.15);
          color:#4f46e5;
        }
        .fs-close-btn:active { transform:scale(0.92); }

        /* header */
        .fs-header {
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:16px 24px;
          border-bottom:1px solid rgba(99,102,241,0.12);
          background:rgba(255,255,255,0.9);
          backdrop-filter:blur(12px);
        }

        .fs-header-title {
          font-family:'Playfair Display',serif;
          font-size:22px;
          font-weight:800;
          background:linear-gradient(90deg,#4f46e5,#2563eb);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          letter-spacing:-0.02em;
        }

        /* decorative glows */
        .fs-glow {
          position:absolute;
          pointer-events:none;
          border-radius:50%;
          filter:blur(100px);
        }
        .fs-glow-1 {
          width:300px;
          height:300px;
          background:rgba(99,102,241,0.15);
          top:-100px;
          left:-100px;
        }
        .fs-glow-2 {
          width:300px;
          height:300px;
          background:rgba(37,99,235,0.12);
          bottom:-120px;
          right:-120px;
        }
      `}</style>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fs-backdrop fixed inset-0 z-40 bg-black/25 backdrop-blur-md"
        />
      )}

      {/* Drawer */}
      <div
        className={`fs-drawer fixed top-0 right-0 z-50 h-full w-[92%] sm:w-[420px] transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "linear-gradient(135deg,rgba(255,255,255,0.97),rgba(248,250,255,0.95))",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="fs-glow fs-glow-1" />
          <div className="fs-glow fs-glow-2" />
        </div>

        {/* Header */}
        <div className="fs-header sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white"
              style={{ fontSize: "16px" }}
            >
              <FaSliders />
            </div>
            <h2 className="fs-header-title">Filters</h2>
          </div>
          <button onClick={() => setOpen(false)} className="fs-close-btn">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="fs-scrollable p-6 space-y-5 overflow-y-auto h-[calc(100%-140px)]">

          {/* SORT */}
          <div className="fs-section">
            <button
              onClick={() => setOpenSort(!openSort)}
              className="fs-section-header"
            >
              <span className="fs-section-title">
                <FaSortAmountDown className="fs-section-icon" />
                Sort By
              </span>
              <FaChevronDown
                className={`fs-chevron transition-transform duration-300 ${openSort ? "open rotate-180" : ""}`}
              />
            </button>

            <div style={{
              maxHeight: openSort ? "500px" : "0",
              overflow: "hidden",
              transition: "max-height 0.3s cubic-bezier(0.22,1,0.36,1)",
              marginTop: openSort ? "12px" : "0"
            }}>
              <div className="fs-list">
                {[
                  { label: "Default", value: "default" },
                  { label: "Price: Low → High", value: "low-high" },
                  { label: "Price: High → Low", value: "high-low" },
                  { label: "Rating", value: "rating" },
                ].map((item) => {
                  const active = sort === item.value;
                  return (
                    <div
                      key={item.value}
                      onClick={() => {
                        setSort(item.value);
                        setOpenSort(false);
                      }}
                      className={`fs-item ${active ? "active" : ""}`}
                    >
                      <span>{item.label}</span>
                      {active && (
                        <div className="fs-checkmark">
                          <FaCheck style={{ fontSize: "8px" }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CATEGORY */}
          <div className="fs-section">
            <button
              onClick={() => setOpenCategory(!openCategory)}
              className="fs-section-header"
            >
              <span className="fs-section-title">
                <MdCategory className="fs-section-icon" style={{ fontSize: "16px" }} />
                Category
              </span>
              <FaChevronDown
                className={`fs-chevron transition-transform duration-300 ${openCategory ? "open rotate-180" : ""}`}
              />
            </button>

            <div style={{
              maxHeight: openCategory ? "500px" : "0",
              overflow: "hidden",
              transition: "max-height 0.3s cubic-bezier(0.22,1,0.36,1)",
              marginTop: openCategory ? "12px" : "0"
            }}>
              <div className="fs-list">
               <div className="fs-list">

  <div
    className={`fs-item ${category === "All" ? "active" : ""}`}
    onClick={() => setCategory("All")}
  >
    <span>All</span>
  </div>

  {categoryOnlyData.map((cat) => (

    <div
      key={cat._id}
      onClick={() => {
        setCategory(cat._id);
        setOpenCategory(false);
      }}
      className={`fs-item ${
        category === cat._id ? "active" : ""
      }`}
    >
      <span>{cat.name}</span>

      {category === cat._id && (
        <div className="fs-checkmark">
          <FaCheck size={8} />
        </div>
      )}

    </div>

  ))}

</div>
              </div>
            </div>
          </div>

          {/* BRAND */}
          <div className="fs-section">
            <button
              onClick={() => setOpenBrand(!openBrand)}
              className="fs-section-header"
            >
              <span className="fs-section-title">
                <FaTags className="fs-section-icon" />
                Brand
              </span>
              <FaChevronDown
                className={`fs-chevron transition-transform duration-300 ${openBrand ? "open rotate-180" : ""}`}
              />
            </button>

            <div style={{
              maxHeight: openBrand ? "500px" : "0",
              overflow: "hidden",
              transition: "max-height 0.3s cubic-bezier(0.22,1,0.36,1)",
              marginTop: openBrand ? "12px" : "0"
            }}>
              <div className="fs-list">
                {["All", ...brandOnlyData].map((b) => {
                  const active = brand === b;
                  return (
                    <div
                      key={b}
                      onClick={() => {
                        setBrand(b);
                        setOpenBrand(false);
                      }}
                      className={`fs-item ${active ? "active" : ""}`}
                    >
                      <span>{b}</span>
                      {active && (
                        <div className="fs-checkmark">
                          <FaCheck style={{ fontSize: "8px" }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* PRICE */}
          <div className="fs-section">
            <div className="fs-price-header">
              <span className="fs-price-label">
                <RiMoneyRupeeCircleLine style={{ fontSize: "16px", color: "#6366f1" }} />
                Price Range
              </span>
              <span className="fs-price-value">
                ₹{priceRange[0]} – ₹{priceRange[1]}
              </span>
            </div>

            <div className="fs-range-wrapper">
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="fs-range-input"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 fs-footer p-6 bg-white/80 backdrop-blur-xl border-t border-indigo-100">
          <button
            onClick={() => {
              setCategory("All");
              setBrand("All");
              setPriceRange([0, 5000]);
            }}
            className="fs-btn fs-btn-reset"
          >
            Reset Filters
          </button>

          <button
            onClick={() => setOpen(false)}
            className="fs-btn fs-btn-apply relative z-10"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}