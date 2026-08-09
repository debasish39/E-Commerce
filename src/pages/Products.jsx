
import React, {
  useEffect,
  useState,
} from "react";

import { getData } from "../context/DataContext";

import FilterSection from "../components/FilterSection";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

import {
  FaAngleLeft,
  FaAngleRight,
  FaFilter,
  FaTimes,
  FaThLarge,
  FaList,
  FaStar,
  FaFire,
  FaClock,
  FaSortAmountDown,
} from "react-icons/fa";

import { MdOutlineCategory, MdTune } from "react-icons/md";

import Lottie from "lottie-react";
import notfound from "../assets/notfound.json";

import AOS from "aos";
import "aos/dist/aos.css";

export default function Products() {
  const {
    data,
    filteredData,
    search,
    brand,
    category,
    priceRange,
    sort,
    setSort,
    setCategory,
    setBrand,
    setPriceRange,
  } = getData();

  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [gridView, setGridView] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  |
  | DataContext fetches products.
  | We wait until data has arrived.
  |--------------------------------------------------------------------------
  */

  const loading =
    !Array.isArray(data) ||
    data.length === 0;

  /*
  |--------------------------------------------------------------------------
  | ITEMS PER PAGE
  |--------------------------------------------------------------------------
  */

  const itemsPerPage = gridView ? 12 : 8;

  /*
  |--------------------------------------------------------------------------
  | RESET PAGE WHEN FILTER CHANGES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setPage(1);
  }, [
    search,
    brand,
    category,
    priceRange,
    sort,
  ]);

  /*
  |--------------------------------------------------------------------------
  | AOS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
    });
  }, []);

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const totalPages = Math.ceil(
    filteredData.length / itemsPerPage
  );

  const startIndex =
    (page - 1) * itemsPerPage;

  const paginatedProducts =
    filteredData.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  /*
  |--------------------------------------------------------------------------
  | ACTIVE FILTER COUNT
  |--------------------------------------------------------------------------
  */

  const activeFiltersCount = [
    category !== "All",
    brand !== "All",
    priceRange[0] !== 0 ||
      priceRange[1] !== 5000,
  ].filter(Boolean).length;

  /*
  |--------------------------------------------------------------------------
  | CLEAR FILTERS
  |--------------------------------------------------------------------------
  */

  const clearAllFilters = () => {
    setCategory("All");
    setBrand("All");
    setPriceRange([
      0,
      5000,
    ]);
  };

  /*
  |--------------------------------------------------------------------------
  | SORT OPTIONS
  |--------------------------------------------------------------------------
  */

  // const sortOptions = [
  //   {
  //     label: "Relevance",
  //     value: "default",
  //     icon: null,
  //   },
  //   {
  //     label: "Price: Low to High",
  //     value: "low-high",
  //     icon: <FaSortAmountDown />,
  //   },
  //   {
  //     label: "Price: High to Low",
  //     value: "high-low",
  //     icon: <FaSortAmountDown />,
  //   },
  //   {
  //     label: "Highest Rated",
  //     value: "rating",
  //     icon: <FaStar />,
  //   },
  //   {
  //     label: "Newest",
  //     value: "newest",
  //     icon: <FaClock />,
  //   },
  //   {
  //     label: "Best Selling",
  //     value: "best-selling",
  //     icon: <FaFire />,
  //   },
  // ];

  // const currentSort =
  //   sortOptions.find(
  //     (item) => item.value === sort
  //   ) || sortOptions[0];

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const renderPagination = () => {
    const pages = [];

    for (
      let i = 1;
      i <= totalPages;
      i++
    ) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - 1 &&
          i <= page + 1)
      ) {
        pages.push(i);
      }
    }

    return pages.map((p, idx) => {
      if (
        idx > 0 &&
        p - pages[idx - 1] > 1
      ) {
        return (
          <span
            key={`ellipsis-${p}`}
            className="px-2 text-slate-300"
          >
            ···
          </span>
        );
      }

      return (
        <button
          key={p}
          onClick={() => {
            setPage(p);

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all ${
            page === p
              ? "bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-400/40"
              : "bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
          }`}
        >
          {p}
        </button>
      );
    });
  };

  /*
  |--------------------------------------------------------------------------
  | CURRENT SORT
  |--------------------------------------------------------------------------
  */

  const handleSort = (value) => {
    setSort(value);
    setSortOpen(false);
    setPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .prod-root * {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .prod-serif {
          font-family: 'Playfair Display', serif;
        }

        @keyframes prodFadeDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes prodSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes prodBounce {
          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.08);
          }
        }

        @keyframes prodSlideInLeft {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .prod-header {
          animation: prodFadeDown 0.6s
            cubic-bezier(0.22, 1, 0.36, 1);
        }

        .prod-pagination {
          animation: prodSlideUp 0.5s
            cubic-bezier(0.22, 1, 0.36, 1);
        }

        .prod-float-btn {
          animation: prodBounce 2s
            ease-in-out infinite;
        }

        .prod-float-btn:hover {
          animation: none;
          transform: scale(1.12);
        }

        .prod-toolbar {
          animation: prodSlideInLeft 0.4s
            cubic-bezier(0.22, 1, 0.36, 1);
        }

        .prod-empty {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          animation: prodFadeDown 0.5s
            cubic-bezier(0.22, 1, 0.36, 1);
        }

        .prod-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;

          animation: prodFadeDown 0.4s
            cubic-bezier(0.22, 1, 0.36, 1)
            0.1s backwards;
        }

        @media (min-width: 640px) {
          .prod-grid {
            grid-template-columns:
              repeat(auto-fill, minmax(180px, 1fr));
            gap: 14px;
          }
        }

        @media (min-width: 1024px) {
          .prod-grid {
            grid-template-columns:
              repeat(auto-fill, minmax(220px, 1fr));
            gap: 16px;
          }
        }

        .prod-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .prod-float-btn {
          position: fixed;
          right: 24px;
          bottom: 160px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #2563eb
            );
          color: white;
          border:
            2px solid
            rgba(255,255,255,0.3);
          box-shadow:
            0 8px 32px
            rgba(79,70,229,0.35);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 35;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        .prod-float-btn:hover {
          box-shadow:
            0 12px 48px
            rgba(79,70,229,0.45);
          border-color:
            rgba(255,255,255,0.5);
        }

        .prod-float-btn:active {
          transform: scale(0.95);
        }

        .prod-skeleton-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
        }

        @media (min-width: 640px) {
          .prod-skeleton-grid {
            grid-template-columns:
              repeat(auto-fill, minmax(180px, 1fr));
            gap: 14px;
          }
        }

        @media (min-width: 1024px) {
          .prod-skeleton-grid {
            grid-template-columns:
              repeat(auto-fill, minmax(220px, 1fr));
            gap: 16px;
          }
        }

        .prod-pagination-wrap {
          margin-top: 48px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          padding: 0 16px;
        }

        .prod-page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .toolbar-card {
          background:
            rgba(255,255,255,0.9);
          backdrop-filter: blur(12px);
          border:
            1px solid
            rgba(99,102,241,0.12);
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          flex-wrap: wrap;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .filter-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background:
            linear-gradient(
              135deg,
              rgba(99,102,241,0.12),
              rgba(37,99,235,0.08)
            );
          border:
            1px solid
            rgba(99,102,241,0.2);
          color: #4f46e5;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-badge:hover {
          background:
            linear-gradient(
              135deg,
              rgba(99,102,241,0.18),
              rgba(37,99,235,0.12)
            );
        }

        .sort-dropdown {
          position: relative;
        }

        .sort-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8faff;
          border:
            1.5px solid
            rgba(99,102,241,0.15);
          color: #4f46e5;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sort-btn:hover {
          background: #eef2ff;
          border-color:
            rgba(99,102,241,0.25);
        }

        .sort-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border:
            1px solid
            rgba(99,102,241,0.15);
          border-radius: 10px;
          margin-top: 6px;
          min-width: 210px;
          box-shadow:
            0 6px 20px
            rgba(99,102,241,0.15);
          z-index: 100;
          overflow: hidden;
        }

        .sort-item {
          padding: 10px 14px;
          cursor: pointer;
          font-size: 13px;
          color: #4b5563;
          transition: all 0.15s;
          border-bottom:
            1px solid
            rgba(99,102,241,0.08);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sort-item:last-child {
          border-bottom: none;
        }

        .sort-item:hover {
          background: #f8faff;
          color: #4f46e5;
        }

        .sort-item.active {
          background:
            linear-gradient(
              135deg,
              rgba(99,102,241,0.1),
              rgba(37,99,235,0.08)
            );
          color: #4f46e5;
          font-weight: 700;
        }

        .view-toggle {
          display: flex;
          gap: 4px;
          background: #f8faff;
          border:
            1.5px solid
            rgba(99,102,241,0.15);
          border-radius: 10px;
          padding: 4px;
        }

        .view-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #a5b4fc;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .view-btn.active {
          background: white;
          color: #4f46e5;
          box-shadow:
            0 2px 6px
            rgba(99,102,241,0.15);
        }

        .clear-filters-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fff1f2;
          border: 1px solid #fca5a5;
          color: #b91c1c;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-filters-btn:hover {
          background: #ffe4e6;
        }

        .results-summary {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
          white-space: nowrap;
        }
      `}</style>

      <div className="prod-root min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-blue-50/30 py-8 px-3 sm:px-4 lg:px-6">

        {/* Decorative blobs */}

        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-300/10 blur-3xl rounded-full animate-pulse" />

          <div
            className="absolute top-1/3 -right-32 w-72 h-72 bg-blue-300/10 blur-3xl rounded-full animate-pulse"
            style={{
              animationDelay: "1s",
            }}
          />

          <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-indigo-200/8 blur-3xl rounded-full" />
        </div>

        <div className="relative z-10">

          {/* Header */}

          <div
            data-aos="fade-down"
            className="prod-header mb-8 text-center"
          >
            <div className="inline-flex items-center gap-3 mb-4 px-5 py-2 rounded-full bg-white/70 backdrop-blur border border-indigo-100 shadow-sm">
              <MdOutlineCategory
                className="text-indigo-500"
                size={18}
              />

              <span className="text-xs font-bold tracking-widest text-indigo-500 uppercase">
                Product Catalog
              </span>
            </div>

            <h1 className="prod-serif text-xl sm:text-5xl font-bold mb-3 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                🛍️ Explore Our Collection
              </span>
            </h1>

            <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
              Discover premium products curated just for you.
              Filter by category, brand, and price to find
              exactly what you need.
            </p>
          </div>

          {/* Toolbar */}

          {!loading &&
            filteredData.length > 0 && (
              <div
                data-aos="fade-up"
                className="prod-toolbar toolbar-card"
              >
                <div className="toolbar-left">

                  <span className="results-summary">
                    {filteredData.length} results
                  </span>

                  {activeFiltersCount > 0 && (
                    <>
                      <div
                        style={{
                          width: "1px",
                          height: "20px",
                          background:
                            "rgba(99,102,241,0.2)",
                        }}
                      />

                      <button
                        onClick={() =>
                          setShowFilters(true)
                        }
                        className="filter-badge"
                      >
                        <MdTune size={13} />

                        {activeFiltersCount} filter
                        {activeFiltersCount > 1
                          ? "s"
                          : ""}{" "}
                        applied
                      </button>

                      <button
                        onClick={
                          clearAllFilters
                        }
                        className="clear-filters-btn"
                      >
                        <FaTimes size={10} />

                        Clear all
                      </button>
                    </>
                  )}
                </div>

                <div className="toolbar-right">

                  {/* Sort */}

                  {/* <div className="sort-dropdown">

                    <button
                      className="sort-btn"
                      onClick={() =>
                        setSortOpen(
                          (prev) => !prev
                        )
                      }
                    >
                      <FaSortAmountDown
                        size={12}
                      />

                      {currentSort.label}
                    </button>

                    {sortOpen && (
                      <div className="sort-menu">

                        {sortOptions.map(
                          (item) => (
                            <button
                              key={item.value}
                              type="button"
                              onClick={() =>
                                handleSort(
                                  item.value
                                )
                              }
                              className={`sort-item w-full text-left ${
                                sort ===
                                item.value
                                  ? "active"
                                  : ""
                              }`}
                            >
                              {item.icon}

                              {sort ===
                                item.value &&
                                "✓"}

                              <span>
                                {item.label}
                              </span>
                            </button>
                          )
                        )}

                      </div>
                    )}

                  </div> */}

                  {/* View Toggle */}

                  <div className="view-toggle">

                    <button
                      className={`view-btn ${
                        gridView
                          ? "active"
                          : ""
                      }`}
                      onClick={() => {
                        setGridView(true);
                        setPage(1);
                      }}
                      title="Grid view"
                    >
                      <FaThLarge
                        size={14}
                      />
                    </button>

                    <button
                      className={`view-btn ${
                        !gridView
                          ? "active"
                          : ""
                      }`}
                      onClick={() => {
                        setGridView(false);
                        setPage(1);
                      }}
                      title="List view"
                    >
                      <FaList size={14} />
                    </button>

                  </div>

                </div>
              </div>
            )}

          {/* Products */}

          {loading ? (
            <div className="prod-skeleton-grid">

              {Array(12)
                .fill(0)
                .map((_, i) => (
                  <ProductCardSkeleton
                    key={i}
                  />
                ))}

            </div>
          ) : filteredData.length === 0 ? (

            <div
              data-aos="zoom-in"
              className="prod-empty"
            >
              <div className="text-center">

                <Lottie
                  animationData={notfound}
                  className="w-full max-w-md h-auto mx-auto mb-4"
                  loop
                />

                <h3 className="prod-serif text-2xl font-bold text-indigo-950 mb-2">
                  No Products Found
                </h3>

                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                  Try adjusting your filters or
                  search criteria to find what
                  you're looking for.
                </p>

                <button
                  onClick={
                    clearAllFilters
                  }
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  <FaTimes size={12} />

                  Clear Filters
                </button>

              </div>
            </div>

          ) : (

            <>
              {/* Product Grid/List */}

              <div
                className={
                  gridView
                    ? "prod-grid mb-3"
                    : "prod-list mb-3"
                }
              >
                {paginatedProducts.map(
                  (product, idx) => (
                    <div
                      key={product._id}
                      data-aos="zoom-in"
                      data-aos-delay={
                        idx * 25
                      }
                    >
                      <ProductCard
                        product={product}
                      />
                    </div>
                  )
                )}
              </div>

              {/* Pagination */}

              {totalPages > 1 && (
                <div
                  data-aos="fade-up"
                  className="prod-pagination prod-pagination-wrap"
                >

                  <button
                    onClick={() => {
                      setPage((prev) =>
                        Math.max(
                          prev - 1,
                          1
                        )
                      );

                      window.scrollTo({
                        top: 0,
                        behavior:
                          "smooth",
                      });
                    }}
                    disabled={page === 1}
                    className="prod-page-btn w-10 h-10 rounded-lg border border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 flex items-center justify-center transition-all font-semibold"
                    aria-label="Previous page"
                  >
                    <FaAngleLeft
                      size={14}
                    />
                  </button>

                  <div className="flex gap-2 flex-wrap justify-center">
                    {renderPagination()}
                  </div>

                  <button
                    onClick={() => {
                      setPage((prev) =>
                        Math.min(
                          prev + 1,
                          totalPages
                        )
                      );

                      window.scrollTo({
                        top: 0,
                        behavior:
                          "smooth",
                      });
                    }}
                    disabled={
                      page === totalPages
                    }
                    className="prod-page-btn w-10 h-10 rounded-lg border border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 flex items-center justify-center transition-all font-semibold"
                    aria-label="Next page"
                  >
                    <FaAngleRight
                      size={14}
                    />
                  </button>

                </div>
              )}

              {/* Results Info */}

              <div
                data-aos="fade-up"
                className="text-center mt-8 text-sm text-slate-500"
              >
                Showing{" "}

                <span className="font-semibold text-indigo-600">
                  {filteredData.length === 0
                    ? 0
                    : startIndex + 1}{" "}
                  –{" "}
                  {Math.min(
                    startIndex +
                      itemsPerPage,
                    filteredData.length
                  )}
                </span>{" "}

                of{" "}

                <span className="font-semibold text-indigo-600">
                  {filteredData.length}
                </span>{" "}

                products
              </div>
            </>
          )}

        </div>
      </div>

      {/* Floating Filter Button */}

      <button
        data-aos="fade-right"
        data-aos-delay="800"
        onClick={() =>
          setShowFilters(true)
        }
        className="prod-float-btn"
        aria-label="Open filters"
        title="Open filters"
      >
        <FaFilter size={20} />

        {activeFiltersCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: "#ef4444",
              color: "white",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
              fontSize: "11px",
              fontWeight: "bold",
            }}
          >
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Drawer */}

      <FilterSection
        open={showFilters}
        setOpen={setShowFilters}
      />
    </>
  );
}

