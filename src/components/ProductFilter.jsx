import React, { useEffect } from "react";
import { getData } from "../context/DataContext";

export default function ProductFilter() {
  const {
    data,
    fetchAllProducts,
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

  // Fetch products on mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Apply filters
  const filteredProducts = data.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    const matchesBrand = brand === "All" || product.brand === brand;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 text-center">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f53347] to-pink-500 mb-4">
        🔍 Filter Products
      </h2>

      {/* 🔧 Filter Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-700 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-[#f53347] transition"
        />

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-700 bg-transparent text-white focus:outline-none focus:border-[#f53347] transition"
        >
          <option value="All">All Categories</option>
          {categoryOnlyData.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Brand */}
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-700 bg-transparent text-white focus:outline-none focus:border-[#f53347] transition"
        >
          <option value="All">All Brands</option>
          {brandOnlyData.map((b, i) => (
            <option key={i} value={b}>
              {b}
            </option>
          ))}
        </select>

        {/* Price Range */}
        <div className="flex items-center gap-2">
          <label className="text-gray-300 text-sm">₹{priceRange[0]}</label>
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
          <label className="text-gray-300 text-sm">₹{priceRange[1]}</label>
        </div>
      </div>

      {/* 🛍️ Filtered Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border border-gray-700 rounded-2xl p-3 hover:shadow-[0_0_15px_#f53347] transition"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-40 object-cover mb-3 rounded-xl"
              />
              <h3 className="text-sm font-semibold text-white truncate">
                {product.title}
              </h3>
              <p className="text-gray-400 text-xs mb-1">{product.category}</p>
              <p className="text-[#f53347] font-bold text-sm">₹{product.price}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm col-span-full">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
