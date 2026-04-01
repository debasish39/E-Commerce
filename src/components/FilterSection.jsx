import React, { useState } from "react";
import { getData } from "../context/DataContext";
import {
  FaTimes,
  FaChevronDown,
  FaCheck,
  FaSortAmountDown,
  FaTags,
} from "react-icons/fa";

import { MdCategory, MdOutlineCurrencyRupee } from "react-icons/md";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";

export default function FilterSection({ open, setOpen }) {
  const {
    category,
    setCategory,
    brand,
    setBrand,
    priceRange,
    setPriceRange,
    categoryOnlyData,
    brandOnlyData, sort, setSort
  } = getData();
  const [openSort, setOpenSort] = useState(true);
  const [openCategory, setOpenCategory] = useState(true);
  const [openBrand, setOpenBrand] = useState(true);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-gray-900/30 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[92%] sm:w-[420px]
bg-white/95 backdrop-blur-xl text-gray-800
border-l border-blue-100
shadow-[0_0_80px_rgba(0,0,0,0.15)]
transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Decorative Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-[260px] h-[260px] bg-blue-400/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-100px] right-[-100px] w-[260px] h-[260px] bg-blue-300/30 blur-[120px] rounded-full" />
        </div>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-blue-100 bg-white/80 backdrop-blur-xl">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
            Filters
          </h2>

          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-blue-600 transition"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Body */}
        <div
          className="p-6 space-y-8 overflow-y-auto h-[calc(100%-140px)]
  [&::-webkit-scrollbar]:w-[6px]
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:bg-blue-300
  [&::-webkit-scrollbar-thumb]:rounded-full
  hover:[&::-webkit-scrollbar-thumb]:bg-blue-400 scroll-smooth"
        >
          {/* SORT */}
          <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">

            <button
              onClick={() => setOpenSort(!openSort)}
              className="group flex justify-between items-center w-full px-3 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 group-hover:text-blue-600">
                <FaSortAmountDown className="text-blue-500" />
                Sort By
              </span>

              <FaChevronDown
                className={`text-gray-400 transition-transform duration-300 ${openSort ? "rotate-180" : ""
                  }`}
              />
            </button>

            <div
              className={`mt-3 transition-all duration-300 ${openSort ? "max-h-[200px]" : "max-h-0 overflow-hidden"
                }`}
            >
              <ul className="space-y-2">
                {[
                  { label: "Default", value: "default" },
                  { label: "Price: Low → High", value: "low-high" },
                  { label: "Price: High → Low", value: "high-low" },
                  { label: "Rating", value: "rating" },
                ].map((item) => {
                  const active = sort === item.value;

                  return (
                    <li
                      key={item.value}
                      onClick={() => {
                        setSort(item.value);
                        setOpenSort(false); // auto close (nice UX)
                      }}
                      className={`flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer transition
            ${active
                          ? "bg-blue-100 border border-blue-300"
                          : "hover:bg-blue-50"
                        }`}
                    >
                      <span className="text-sm">{item.label}</span>

                      {active && (
                        <FaCheck className="text-blue-600 text-xs" />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {/* CATEGORY */}
          <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
            <button
              onClick={() => setOpenCategory(!openCategory)}
              className="group flex justify-between items-center w-full px-3 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 group-hover:text-blue-600">
                <MdCategory className="text-blue-500" />
                Category
              </span>

              <FaChevronDown
                className={`text-gray-400 transition-transform duration-300 ${openCategory ? "rotate-180" : ""
                  }`}
              />
            </button>

            <div
              className={`mt-3 transition-all duration-300 ${openCategory ? "max-h-[240px]" : "max-h-0 overflow-hidden"
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
                      ${active
                          ? "bg-blue-100 border border-blue-300"
                          : "hover:bg-blue-50"
                        }`}
                    >
                      <span className="text-sm">{cat}</span>

                      {active && (
                        <FaCheck className="text-blue-600 text-xs" />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* BRAND */}
          <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
            <button
              onClick={() => setOpenBrand(!openBrand)}
              className="group flex justify-between items-center w-full px-3 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 group-hover:text-blue-600">
                <FaTags className="text-blue-500" />
                Brand
              </span>

              <FaChevronDown
                className={`text-gray-400 transition-transform duration-300 ${openBrand ? "rotate-180" : ""
                  }`}
              />
            </button>

            <div
              className={`mt-3 transition-all duration-300 ${openBrand ? "max-h-[240px]" : "max-h-0 overflow-hidden"
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
                      ${active
                          ? "bg-blue-100 border border-blue-300"
                          : "hover:bg-blue-50"
                        }`}
                    >
                      <span className="text-sm">{b}</span>

                      {active && (
                        <FaCheck className="text-blue-600 text-xs" />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* PRICE */}
          <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-2">
                <RiMoneyRupeeCircleLine className="text-blue-500" />
                Price
              </span>
              <span className="text-blue-600 font-medium flex items-center">
                <MdOutlineCurrencyRupee />{priceRange[0]} — <MdOutlineCurrencyRupee />{priceRange[1]}
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
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0  backdrop-blur-xl bg-white/80 border-t border-blue-100 p-6 flex gap-3">
          <button
            onClick={() => {
              setCategory("All");
              setBrand("All");
              setPriceRange([0, 5000]);
            }}
            className="flex-1 border border-gray-300 hover:bg-blue-50 py-2 rounded-xl transition"
          >
            Reset
          </button>

          <button
            onClick={() => setOpen(false)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-500 py-2 rounded-xl hover:opacity-90 transition shadow-lg text-white font-medium cursor-pointer border border-blue-500"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}