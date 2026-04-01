import React, { useEffect, useState } from "react";
import { getData } from "../context/DataContext";
import FilterSection from "../components/FilterSection";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { VscFilterFilled } from "react-icons/vsc";
import Lottie from "lottie-react";
import notfound from "../assets/notfound.json";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Products() {

const {
  filteredData,
  fetchAllProducts,
  search,
  brand,
  category,
  priceRange,
} = getData();
const filteredProducts=filteredData;
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 12;

  useEffect(() => {
    const loadProducts = async () => {
      await fetchAllProducts();
      setTimeout(() => setLoading(false), 1200);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, brand, category, priceRange]);

  // const filteredProducts = data
  //   .filter((product) =>
  //     product.title.toLowerCase().includes(search.toLowerCase())
  //   )
  //   .filter(
  //     (product) =>
  //       category === "ALL" || category === "All" || product.category === category
  //   )
  //   .filter(
  //     (product) =>
  //       brand === "ALL" || brand === "All" || product.brand === brand
  //   )
  //   .filter(
  //     (product) =>
  //       product.price >= priceRange[0] &&
  //       product.price <= priceRange[1]
  //   );

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

    return pages.map((p, idx) => {

      if (idx > 0 && p - pages[idx - 1] > 1) {
        return (
          <span key={p} className="px-2 text-gray-400">
            ...
          </span>
        );
      }

      return (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`px-3 py-1.5 rounded-md text-sm ${page === p
            ? "bg-indigo-600 text-white"
            : "border border-blue-200 hover:bg-blue-50"
            }`}
        >
          {p}
        </button>
      );
    });
  };

  return (
    <>

      <div className="min-h-screen py-6 px-2 text-gray-800">

        {/* Header */}
        <div
          data-aos="fade-down"
          className="flex justify-center mb-6"
        >
          <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600text-transparent bg-clip-text mt-6">
            <span className="text-white">🛍️</span> Explore Our Collection
          </h2>

        </div>

        {/* Products */}
        {loading ? (

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">

            {Array(12)
              .fill(0)
              .map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}

          </div>

        ) : (

          <>
            {filteredProducts.length === 0 ? (

              <div
                data-aos="zoom-in"
                className="flex justify-center items-center min-h-[350px] sm:mt-3"
              >
                <Lottie animationData={notfound} className="w-[800px] h-[500px]" />
              </div>

            ) : (

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">

                {paginatedProducts.map((product) => (

                  <div
                    key={product.id}
                    data-aos="zoom-in"
                    data-aos-delay={product.id * 30}
                  >
                    <ProductCard product={product} />
                  </div>

                ))}

              </div>

            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (

              <div
                data-aos="fade-up"
                className="mt-12 flex justify-center items-center gap-3 flex-wrap"
              >
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-2 rounded border border-blue-200 hover:bg-blue-50disabled:opacity-40"
                >
                  <FaAngleLeft />
                </button>

                {renderPagination()}

                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className="px-3 py-2 rounded border border-blue-200 hover:bg-blue-50 disabled:opacity-40"
                >
                  <FaAngleRight />
                </button>

              </div>

            )}

          </>
        )}

      </div>

      {/* Floating Filter Button */}
      <button
        data-aos="fade-right"
        data-aos-delay="3000"
        onClick={() => setShowFilters(true)}
        className="
  fixed right-6 bottom-36 sm:bottom-36 -translate-y-1/2 z-40
  bg-gradient-to-r from-blue-400 to-indigo-600
  text-white
  p-3 rounded-full
  shadow-lg hover:scale-110 transition-all duration-300
  border border-indigo-400
  cursor-pointer
  "
      >
        <VscFilterFilled size={30} />
      </button>

      {/* Filter Drawer */}
      <FilterSection open={showFilters} setOpen={setShowFilters} />

    </>
  );
}