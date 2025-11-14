import React, { useState } from "react";
import { getData } from "../context/DataContext";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";

export default function FilterSection() {
  const {
    search,
    setSearch,
    category,
    setCategory,
    brand,
    setBrand,
    priceRange,
    setPriceRange,
    categoryOnlyData,
    brandOnlyData,
  } = getData();

  // 👇 Local state for mobile filter visibility
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div
      className="w-full max-w-7xl mx-auto mb-3 px-4 py-6 rounded-2xl 
                  transition-all duration-300"
    >
      {/* Title & Toggle for Mobile */}
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2 sm:hidden">
          <h2 className="text-lg sm:hidden sm:text-xl font-bold bg-gradient-to-r from-red-500 to-red-100 text-transparent bg-clip-text">
            Filter Products
          </h2>
        </div>

        {/* 🧭 Mobile Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden flex items-center gap-2 text-[#f53347] border border-[#f53347]/40 px-3 py-1.5 rounded-lg text-sm hover:bg-[#f53347]/10 transition"
        >
          {showFilters ? <FaTimes /> : <FaFilter />}
          {showFilters ? "Close" : "Filters"}
        </button>
      </div>

      {/* Filter Controls */}
      <div
        className={`flex flex-wrap justify-center items-center gap-4 overflow-hidden transition-all duration-500 ${
          showFilters
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 sm:max-h-none sm:opacity-100"
        } sm:flex sm:flex-wrap sm:opacity-100 sm:max-h-none`}
      >
        {/* 🔎 Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-700 bg-[#0f0f10]/60 
                     text-white placeholder-gray-400 focus:outline-none 
                     focus:border-[#f53347] transition w-[220px] sm:w-[240px]"
        />

        {/* 🏷️ Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-700 bg-[#0f0f10]/60 
                     text-white focus:outline-none focus:border-[#f53347] 
                     transition w-[180px]"
        >
          <option value="All">All Categories</option>
          {categoryOnlyData.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* 🏭 Brand */}
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-700 bg-[#0f0f10]/60 
                     text-white focus:outline-none focus:border-[#f53347] 
                     transition w-[180px]"
        >
          <option value="All">All Brands</option>
          {brandOnlyData.map((b, i) => (
            <option key={i} value={b}>
              {b}
            </option>
          ))}
        </select>

        {/* 💰 Price Range */}
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <span>₹{priceRange[0]}</span>
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-48 accent-[#f53347]"
          />
          <span>₹{priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
}
