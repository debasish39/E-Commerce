import React, { useEffect, useState } from 'react';
import { getData } from '../context/DataContext';
import FilterSection from '../components/FilterSection';
import Loading from '../assets/Loading4.webm';
import ProductCard from '../components/ProductCard';
import { FaFilter, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import Lottie from 'lottie-react';
import notfound from '../assets/notfound.json';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
    AOS.init({
      duration: 300,
      easing: 'ease-in',
      once: false,
    });
  }, []);

  useEffect(() => {
    // Reset pagination when filters change
    setPage(1);
  }, [search, brand, category, priceRange]);

  const filteredProducts = data
    .filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter(
      (product) =>
        category === 'ALL' || category === 'All' || product.category === category
    )
    .filter(
      (product) => brand === 'ALL' || brand === 'All' || product.brand === brand
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      {data?.length > 0 ? (
        <>
          <div className="lg:hidden flex justify-end mb-4" data-aos="fade-down">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 border rounded-md text-sm bg-white text-gray-700 hover:bg-red-100 border-gray-300 cursor-pointer"
            >
              <FaFilter />
              Filters
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {(showFilters || window.innerWidth >= 1024) && (
              <div
                className={`w-full lg:w-1/4 ${showFilters ? 'block' : 'hidden'} lg:block`}
                data-aos="fade-right"
              >
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
            )}

            <div
              className="w-full sm:mt-18  grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3"
              data-aos="fade-up"
            >
              {filteredProducts.length === 0 ? (
                <div className="col-span-full flex justify-center items-center min-h-[400px]" data-aos="zoom-in">
                  <Lottie animationData={notfound} className="w-3/4 max-w-md" />
                </div>
              ) : (
                paginatedProducts.map((product) => (
                  <div key={product.id} data-aos="zoom-in">
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>
          </div>

          {filteredProducts.length > 0 && (
            <div className="overflow-x-auto mt-10" data-aos="fade-up">
              <div className="flex flex-wrap justify-center gap-x-2 gap-y-3 items-center px-2">
                {/* Previous Button */}
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`min-w-[36px] px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-md border transition ${
                    page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                      : 'bg-white text-gray-700 hover:bg-red-100 border-gray-300'
                  }`}
                >
                  <FaAngleLeft className="text-sm sm:text-base" />
                </button>

                {/* Dynamic Pagination */}
                {(() => {
                  const pageButtons = [];

                  if (totalPages <= 5) {
                    for (let i = 1; i <= totalPages; i++) pageButtons.push(i);
                  } else {
                    if (page <= 3) {
                      pageButtons.push(1, 2, 3, '...', totalPages);
                    } else if (page >= totalPages - 2) {
                      pageButtons.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
                    } else {
                      pageButtons.push(1, '...', page - 1, page, page + 1, '...', totalPages);
                    }
                  }

                  return pageButtons.map((btn, idx) =>
                    btn === '...' ? (
                      <span key={`ellipsis-${idx}`} className="text-gray-500 px-2">
                        ...
                      </span>
                    ) : (
                      <button
                        key={btn}
                        onClick={() => setPage(btn)}
                        className={`min-w-[36px] px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-md border transition ${
                          page === btn
                            ? 'bg-red-500 text-white border-red-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-red-100'
                        }`}
                      >
                        {btn}
                      </button>
                    )
                  );
                })()}

                {/* Next Button */}
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`min-w-[36px] px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-md border transition ${
                    page === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                      : 'bg-white text-gray-700 hover:bg-red-100 border-gray-300'
                  }`}
                >
                  <FaAngleRight className="text-sm sm:text-base" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-[400px]" data-aos="fade-in">
          <video muted autoPlay loop aria-hidden="true">
            <source src={Loading} type="video/webm" />
          </video>
        </div>
      )}
    </div>
  );
}
