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

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const filteredProducts = data.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    const matchesBrand =
      brand === "All" || product.brand === brand;

    const matchesPrice =
      product.price >= priceRange[0] &&
      product.price <= priceRange[1];

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesPrice
    );
  });

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 text-center">

      {/* Title */}
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
        🔍 Filter Products
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border border-blue-200 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition shadow-sm"
        />

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 rounded-xl border border-blue-200 bg-white text-gray-700 focus:outline-none focus:border-indigo-500 transition shadow-sm"
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
          className="px-4 py-2 rounded-xl border border-blue-200 bg-white text-gray-700 focus:outline-none focus:border-indigo-500 transition shadow-sm"
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

          <label className="text-gray-600 text-sm">
            ₹{priceRange[0]}
          </label>

          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-48 accent-indigo-600"
          />

          <label className="text-gray-600 text-sm">
            ₹{priceRange[1]}
          </label>

        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">

        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border border-blue-100 rounded-2xl p-3 bg-white hover:shadow-[0_8px_25px_rgba(99,102,241,0.2)] transition"
            >

              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-40 object-cover mb-3 rounded-xl"
              />

              <h3 className="text-sm font-semibold text-gray-800 truncate">
                {product.title}
              </h3>

              <p className="text-gray-500 text-xs mb-1">
                {product.category}
              </p>

              <p className="text-indigo-600 font-bold text-sm">
                ₹{product.price}
              </p>

            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm col-span-full">
            No products found.
          </p>
        )}

      </div>
    </div>
  );
}