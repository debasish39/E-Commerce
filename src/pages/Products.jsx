import React, { useEffect, useState } from "react";
import { getData } from "../context/DataContext";
import FilterSection from "../components/FilterSection";
import Loading from "../assets/Loading4.webm";
import ProductCard from "../components/ProductCard";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
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
  const itemsPerPage = 12;

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 600, easing: "ease-in-out", once: true });
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
    <div className="relative bg-gradient-to-b from-[#0f0f10] via-[#161618] to-[#0f0f10] min-h-screen py-12 px-4 sm:px-6 lg:px-10 text-white overflow-hidden">
      {/* Floating gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
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
      <div
        className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
        data-aos="fade-down"
      >
        <h2 className="text-xl sm:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-[#f53347] to-pink-500 text-transparent bg-clip-text drop-shadow-md">
          <span className="text-white">🛍️</span> Explore Our Collection
        </h2>
      </div>

      {/* 🧩 Filter Section (Top, Full Width) */}
      <div className="mb-10" data-aos="fade-up">
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

      {/* 🛒 Product Grid */}
      {data?.length > 0 ? (
        <>
          {filteredProducts.length === 0 ? (
            <div className="flex justify-center items-center min-h-[400px]" data-aos="fade-in">
              <Lottie animationData={notfound} className="w-3/4 max-w-md" />
            </div>
          ) : (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
              data-aos="fade-up"
            >
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_0_20px_rgba(255,0,80,0.3)] rounded-xl"
                  data-aos="zoom-in"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div
              className="mt-12 flex justify-center items-center flex-wrap gap-3"
              data-aos="fade-up"
            >
              {/* Prev Button */}
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`flex items-center gap-1 px-4 py-2 rounded-full border border-white/20 transition-all duration-300 ${
                  page === 1
                    ? "text-gray-500 cursor-not-allowed border-gray-700"
                    : "hover:bg-red-500/20 hover:border-red-400 hover:text-red-400"
                }`}
              >
                <FaAngleLeft /> Prev
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setPage(index + 1)}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                    page === index + 1
                      ? "bg-red-500/80 border-red-500 text-white shadow-md shadow-red-500/40"
                      : "border-white/20 hover:bg-white/10 hover:border-red-400 hover:text-red-400"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className={`flex items-center gap-1 px-4 py-2 rounded-full border border-white/20 transition-all duration-300 ${
                  page === totalPages
                    ? "text-gray-500 cursor-not-allowed border-gray-700"
                    : "hover:bg-red-500/20 hover:border-red-400 hover:text-red-400"
                }`}
              >
                Next <FaAngleRight />
              </button>
            </div>
          )}
        </>
      ) : (
        <div
          className="flex items-center justify-center h-[400px]"
          data-aos="fade-in"
        >
          <video
            muted
            autoPlay
            loop
            aria-hidden="true"
            className="rounded-3xl shadow-lg border border-white/10"
          >
            <source src={Loading} type="video/webm" />
          </video>
        </div>
      )}
    </div>
  );
}
