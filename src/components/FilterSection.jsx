import React, { useState } from "react";
import { getData } from "../context/DataContext";
import { FaTimes, FaChevronDown, FaCheck } from "react-icons/fa";

export default function FilterSection({ open, setOpen }) {
  const {
    category,
    setCategory,
    brand,
    setBrand,
    priceRange,
    setPriceRange,
    categoryOnlyData,
    brandOnlyData,
  } = getData();

  const [openCategory, setOpenCategory] = useState(true);
  const [openBrand, setOpenBrand] = useState(true);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[92%] sm:w-[420px]
        bg-[#0f0f10]/95 backdrop-blur-xl text-white
        border-l border-white/10
        shadow-[0_0_80px_rgba(0,0,0,0.8)]
        transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Decorative Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-[260px] h-[260px] bg-red-500/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-100px] right-[-100px] w-[260px] h-[260px] bg-pink-500/20 blur-[120px] rounded-full" />
        </div>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-white/10 bg-black/30 backdrop-blur-xl">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-red-500 to-pink-400 text-transparent bg-clip-text">
            Filters
          </h2>

          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-white transition"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Body */}
        <div
          className="p-6 space-y-8 overflow-y-auto h-[calc(100%-140px)]
          [&::-webkit-scrollbar]:w-[6px]
          [&::-webkit-scrollbar-thumb]:bg-gray-700
          [&::-webkit-scrollbar-thumb]:rounded"
        >
          {/* CATEGORY */}
          <div className="bg-[#141414]/70 rounded-2xl p-4 border border-white/5 shadow-md">
            <button
              onClick={() => setOpenCategory(!openCategory)}
              className="group flex justify-between items-center w-full px-3 py-2 rounded-lg hover:bg-[#1c1c1c] transition"
            >
              <span className="text-sm font-semibold text-gray-300 group-hover:text-white">
                Category
              </span>

              <FaChevronDown
                className={`text-gray-400 transition-transform duration-300 ${
                  openCategory ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`mt-3 transition-all duration-300 ${
                openCategory ? "max-h-[240px]" : "max-h-0 overflow-hidden"
              }`}
            >
              <ul className="space-y-2 overflow-y-auto max-h-[200px]">
                {["All", ...categoryOnlyData].map((cat) => {
                  const active = category === cat;

                  return (
                    <li
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        setOpenCategory(false);
                      }}
                      className={`flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer transition
                      ${
                        active
                          ? "bg-red-500/20 border border-red-500/40"
                          : "hover:bg-[#1d1d1d]"
                      }`}
                    >
                      <span className="text-sm">{cat}</span>

                      {active && (
                        <FaCheck className="text-red-400 text-xs" />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* BRAND */}
          <div className="bg-[#141414]/70 rounded-2xl p-4 border border-white/5 shadow-md">
            <button
              onClick={() => setOpenBrand(!openBrand)}
              className="group flex justify-between items-center w-full px-3 py-2 rounded-lg hover:bg-[#1c1c1c] transition"
            >
              <span className="text-sm font-semibold text-gray-300 group-hover:text-white">
                Brand
              </span>

              <FaChevronDown
                className={`text-gray-400 transition-transform duration-300 ${
                  openBrand ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`mt-3 transition-all duration-300 ${
                openBrand ? "max-h-[240px]" : "max-h-0 overflow-hidden"
              }`}
            >
              <ul className="space-y-2 overflow-y-auto max-h-[200px]">
                {["All", ...brandOnlyData].map((b) => {
                  const active = brand === b;

                  return (
                    <li
                      key={b}
                      onClick={() => {
                        setBrand(b);
                        setOpenBrand(false);
                      }}
                      className={`flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer transition
                      ${
                        active
                          ? "bg-red-500/20 border border-red-500/40"
                          : "hover:bg-[#1d1d1d]"
                      }`}
                    >
                      <span className="text-sm">{b}</span>

                      {active && (
                        <FaCheck className="text-red-400 text-xs" />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* PRICE */}
          <div className="bg-[#141414]/70 rounded-2xl p-4 border border-white/5 shadow-md">
            <div className="flex justify-between text-sm text-gray-400 mb-4">
              <span>Price</span>

              <span className="text-red-400 font-medium">
                ₹{priceRange[0]} — ₹{priceRange[1]}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="w-full accent-red-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-black/40 backdrop-blur-xl border-t border-white/10 p-6 flex gap-3">
          <button
            onClick={() => {
              setCategory("All");
              setBrand("All");
              setPriceRange([0, 5000]);
            }}
            className="flex-1 border border-gray-700 py-2 rounded-xl hover:bg-[#1a1a1a] transition"
          >
            Reset
          </button>

          <button
            onClick={() => setOpen(false)}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-800 py-2 rounded-xl hover:opacity-90 transition shadow-lg"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}