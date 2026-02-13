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
    brand,
    category,
    priceRange,
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
      (product) =>
        brand === "ALL" || brand === "All" || product.brand === brand
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

  const renderPagination = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - 1 && i <= page + 1)
      ) {
        pages.push(i);
      }
    }

    const buttons = [];

    pages.forEach((p, idx) => {
      if (idx > 0 && p - pages[idx - 1] > 1) {
        buttons.push(
          <span key={`dots-${p}`} className="px-1 text-gray-400">
            ...
          </span>
        );
      }

      buttons.push(
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-full border transition-all duration-300 ${
            page === p
              ? "bg-red-500/80 border-red-500 text-white shadow-md shadow-red-500/40"
              : "border-white/20 hover:bg-white/10 hover:border-red-400 hover:text-red-400"
          }`}
        >
          {p}
        </button>
      );
    });

    return buttons;
  };

  return (
    <div className="relative min-h-screen py-8 sm:py-12 px-3 sm:px-6 lg:px-10 text-white overflow-hidden">

      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-red-500/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-pink-500/20 blur-[150px] rounded-full animate-[float_8s_infinite_linear]" />
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-25px); }
          }
        `}</style>
      </div>

      {/* Header */}
      <div
        className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-3 sm:gap-4"
        data-aos="fade-down"
      >
        <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-wide text-center sm:text-left bg-gradient-to-r from-red-500 to-red-200 text-transparent bg-clip-text drop-shadow-md">
          <span className="text-white">🛍️</span> Explore Our Collection
        </h2>
      </div>

      {/* Filters */}
      <div className="mb-8 sm:mb-10" data-aos="fade-up">
        <FilterSection />
      </div>

      {/* Products */}
      {data?.length > 0 ? (
        <>
          {filteredProducts.length === 0 ? (
            <div className="flex justify-center items-center min-h-[350px]" data-aos="fade-in">
              <Lottie animationData={notfound} className="w-3/4 max-w-sm" />
            </div>
          ) : (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 w-full"
              data-aos="fade-up"
            >
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="transition-all duration-300 sm:hover:scale-[1.05] sm:hover:shadow-[0_0_20px_rgba(255,0,80,0.3)] rounded-xl"
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
              className="mt-10 sm:mt-12 flex justify-center items-center flex-wrap gap-2 sm:gap-3 px-2"
              data-aos="fade-up"
            >
              {/* Prev */}
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-full border transition-all duration-300 ${
                  page === 1
                    ? "text-gray-500 cursor-not-allowed border-gray-700"
                    : "hover:bg-red-500/20 hover:border-red-400 hover:text-red-400"
                }`}
              >
                <FaAngleLeft /> Prev
              </button>

              {renderPagination()}

              {/* Next */}
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className={`flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-full border transition-all duration-300 ${
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
          className="flex items-center justify-center h-[350px]"
          data-aos="fade-in"
        >
          <video
            muted
            autoPlay
            loop
            aria-hidden="true"
            className="w-40 sm:w-56 md:w-64 rounded-3xl shadow-lg border border-white/10"
          >
            <source src={Loading} type="video/webm" />
          </video>
        </div>
      )}
    </div>
  );
}
