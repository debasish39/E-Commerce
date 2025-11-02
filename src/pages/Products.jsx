import React, { useEffect, useState } from "react";
import { getData } from "../context/DataContext";
import FilterSection from "../components/FilterSection";
import Loading from "../assets/Loading4.webm";
import ProductCard from "../components/ProductCard";
import { FaFilter, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Lottie from "lottie-react";
import notfound from "../assets/notfound.json";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Products() {
  const {
    data,
    fetchAllProducts,
    search,
    setSearch,
    brand,
    setBrand,
    category,
    setCategory,
    priceRange,
    setPriceRange,
    handleBrandChange,
    handleCategoryChange,
  } = getData();

  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 500, easing: "ease-in-out", once: true });
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, brand, category, priceRange]);

  const filteredProducts = data
    .filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter(
      (product) =>
        category === "ALL" || category === "All" || product.category === category
    )
    .filter(
      (product) => brand === "ALL" || brand === "All" || product.brand === brand
    )
    .filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="relative bg-gradient-to-b from-[#0f0f10] via-[#161618] to-[#0f0f10] min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-white">
      {/* Floating gradients for ambience */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-red-500/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-500/20 blur-[150px] rounded-full animate-[float_8s_infinite_linear]" />
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-25px); }
          }
        `}</style>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4" data-aos="fade-down">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-wide bg-gradient-to-r from-[#f53347] to-pink-500 text-transparent bg-clip-text">
          🛍️ Explore Products
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-gray-200 hover:text-white hover:border-red-400 transition-all duration-300 lg:hidden"
        >
          <FaFilter /> Filters
        </button>
      </div>

      {data?.length > 0 ? (
        <>
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Filter */}
            {(showFilters || window.innerWidth >= 1024) && (
              <div
                className={`w-full lg:w-1/4 ${
                  showFilters ? "block" : "hidden"
                } lg:block`}
                data-aos="fade-right"
              >
                <div className="p-5 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
                  <FilterSection
                    data={data}
                    search={search}
                    setSearch={setSearch}
                    brand={brand}
                    setBrand={setBrand}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    category={category}
                    setCategory={setCategory}
                    handleCategoryChange={handleCategoryChange}
                    handleBrandChange={handleBrandChange}
                  />
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className="w-full h-[] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-5" data-aos="fade-up">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full flex justify-center items-center min-h-[400px]">
                  <Lottie animationData={notfound} className="w-3/4 max-w-md" />
                </div>
              ) : (
                paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="transition-all duration-500 hover:scale-[1.03]"
                    data-aos="zoom-in"
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="mt-10 flex justify-center items-center flex-wrap gap-3" data-aos="fade-up">
              {/* Prev */}
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-full border text-sm transition-all ${
                  page === 1
                    ? "bg-white/10 text-gray-400 border-gray-700 cursor-not-allowed"
                    : "bg-white/10 border-white/20 text-white hover:border-red-400 hover:text-red-400"
                }`}
              >
                <FaAngleLeft />
              </button>

              {/* Dynamic Pagination */}
              {(() => {
                const pageButtons = [];
                if (totalPages <= 5) {
                  for (let i = 1; i <= totalPages; i++) pageButtons.push(i);
                } else {
                  if (page <= 3) {
                    pageButtons.push(1, 2, 3, "...", totalPages);
                  } else if (page >= totalPages - 2) {
                    pageButtons.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
                  } else {
                    pageButtons.push(1, "...", page - 1, page, page + 1, "...", totalPages);
                  }
                }

                return pageButtons.map((btn, idx) =>
                  btn === "..." ? (
                    <span key={idx} className="text-gray-500 px-2">
                      ...
                    </span>
                  ) : (
                    <button
                      key={btn}
                      onClick={() => setPage(btn)}
                      className={`px-4 py-2 rounded-full text-sm border transition-all ${
                        page === btn
                          ? "bg-gradient-to-r from-[#f53347] to-pink-500 text-white border-none"
                          : "bg-white/10 text-gray-200 border-white/20 hover:text-red-400 hover:border-red-400"
                      }`}
                    >
                      {btn}
                    </button>
                  )
                );
              })()}

              {/* Next */}
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-full border text-sm transition-all ${
                  page === totalPages
                    ? "bg-white/10 text-gray-400 border-gray-700 cursor-not-allowed"
                    : "bg-white/10 border-white/20 text-white hover:border-red-400 hover:text-red-400"
                }`}
              >
                <FaAngleRight />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-[400px]" data-aos="fade-in">
          <video muted autoPlay loop aria-hidden="true" className="rounded-3xl shadow-lg">
            <source src={Loading} type="video/webm" />
          </video>
        </div>
      )}
    </div>
  );
}
