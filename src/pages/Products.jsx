import React, {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  FaAngleLeft,
  FaAngleRight,
  FaFilter,
  FaTimes,
  FaThLarge,
  FaList,
} from "react-icons/fa";

import {
  MdOutlineCategory,
  MdTune,
} from "react-icons/md";

import {
  getData,
} from "../context/DataContext";

import FilterSection from "../components/FilterSection";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

import Lottie from "lottie-react";
import notfound from "../assets/notfound.json";

export default function Products() {
  /* =====================================================
     URL
  ===================================================== */

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  /* =====================================================
     DATA CONTEXT
  ===================================================== */

  const {
    data,
    loading,
    error,

    filteredData,

    search,

    brand,
    category,
    subCategory,

    priceRange,

    sort,

    setSort,
    setCategory,
    setSubCategory,
    setBrand,
    setPriceRange,
  } = getData();

  /* =====================================================
     STATE
  ===================================================== */

  const [page, setPage] =
    useState(1);

  const [showFilters, setShowFilters] =
    useState(false);

  const [gridView, setGridView] =
    useState(true);

  /* =====================================================
     DEBUG URL
  ===================================================== */

  useEffect(() => {
    console.log("");
    console.log(
      "========================================"
    );

    console.log(
      "🌐 PRODUCTS PAGE URL DEBUG"
    );

    console.log(
      "🌐 Full URL:",
      window.location.href
    );

    console.log(
      "🌐 Search params:",
      Object.fromEntries(
        searchParams.entries()
      )
    );

    console.log(
      "🌐 category:",
      searchParams.get(
        "category"
      )
    );

    console.log(
      "🌐 subCategory:",
      searchParams.get(
        "subCategory"
      )
    );

    console.log(
      "🌐 brand:",
      searchParams.get(
        "brand"
      )
    );

    console.log(
      "========================================"
    );
  }, [searchParams]);

  /* =====================================================
     SYNC URL → CONTEXT
  ===================================================== */

  useEffect(() => {
    const urlCategory =
      searchParams.get(
        "category"
      );

    const urlSubCategory =
      searchParams.get(
        "subCategory"
      );

    const urlBrand =
      searchParams.get(
        "brand"
      );

    const nextCategory =
      urlCategory || "All";

    const nextSubCategory =
      urlSubCategory || "All";

    const nextBrand =
      urlBrand || "All";

    console.log("");
    console.log(
      "========================================"
    );

    console.log(
      "🔄 SYNCING URL FILTERS"
    );

    console.log(
      "➡️ URL category:",
      nextCategory
    );

    console.log(
      "➡️ URL subCategory:",
      nextSubCategory
    );

    console.log(
      "➡️ URL brand:",
      nextBrand
    );

    console.log(
      "========================================"
    );

    setCategory(
      nextCategory
    );

    setSubCategory(
      nextSubCategory
    );

    setBrand(
      nextBrand
    );
  }, [
    searchParams,
    setCategory,
    setSubCategory,
    setBrand,
  ]);

  /* =====================================================
     DEBUG CONTEXT FILTER VALUES
  ===================================================== */

  useEffect(() => {
    console.log("");
    console.log(
      "========================================"
    );

    console.log(
      "🎯 CURRENT PRODUCT FILTER STATE"
    );

    console.log(
      "category:",
      category
    );

    console.log(
      "subCategory:",
      subCategory
    );

    console.log(
      "brand:",
      brand
    );

    console.log(
      "search:",
      search
    );

    console.log(
      "priceRange:",
      priceRange
    );

    console.log(
      "sort:",
      sort
    );

    console.log(
      "all products:",
      data?.length
    );

    console.log(
      "filtered products:",
      filteredData?.length
    );

    console.log(
      "filtered products:",
      filteredData
    );

    console.log(
      "========================================"
    );
  }, [
    category,
    subCategory,
    brand,
    search,
    priceRange,
    sort,
    data,
    filteredData,
  ]);

  /* =====================================================
     DEBUG PRODUCT MATCHING
  ===================================================== */

  useEffect(() => {
    if (!Array.isArray(data)) {
      return;
    }

    console.log("");
    console.log(
      "========================================"
    );

    console.log(
      "🔍 PRODUCT MATCH DEBUG"
    );

    data.forEach(
      (product, index) => {
        const productCategory =
          typeof product?.category ===
          "object"
            ? product?.category?._id
            : product?.category;

        const productSubCategory =
          typeof product?.subCategory ===
          "object"
            ? product?.subCategory?._id
            : product?.subCategory;

        const productBrand =
          product?.brand;

        const categoryMatch =
          category === "All" ||
          String(
            productCategory
          ) ===
            String(category);

        const subCategoryMatch =
          subCategory === "All" ||
          String(
            productSubCategory
          ) ===
            String(subCategory);

        const brandMatch =
          brand === "All" ||
          String(
            productBrand || ""
          )
            .trim()
            .toLowerCase() ===
            String(brand || "")
              .trim()
              .toLowerCase();

        console.log(
          `PRODUCT ${index + 1}`,
          {
            title:
              product?.title,

            productBrand,

            selectedBrand:
              brand,

            productCategory,

            selectedCategory:
              category,

            productSubCategory,

            selectedSubCategory:
              subCategory,

            categoryMatch,

            subCategoryMatch,

            brandMatch,

            finalMatch:
              categoryMatch &&
              subCategoryMatch &&
              brandMatch,
          }
        );
      }
    );

    console.log(
      "========================================"
    );
  }, [
    data,
    category,
    subCategory,
    brand,
  ]);

  /* =====================================================
     RESET PAGE
  ===================================================== */

  useEffect(() => {
    setPage(1);
  }, [
    search,
    brand,
    category,
    subCategory,
    priceRange,
    sort,
  ]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const itemsPerPage =
    gridView ? 12 : 8;

  const totalPages =
    Math.ceil(
      filteredData.length /
        itemsPerPage
    );

  const startIndex =
    (page - 1) *
    itemsPerPage;

  const paginatedProducts =
    filteredData.slice(
      startIndex,
      startIndex +
        itemsPerPage
    );

  /* =====================================================
     ACTIVE FILTERS
  ===================================================== */

  const activeFiltersCount = [
    category !== "All",
    subCategory !== "All",
    brand !== "All",
    priceRange?.[0] !== 0 ||
      priceRange?.[1] !== 100000,
  ].filter(Boolean).length;

  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const clearAllFilters = () => {
    console.log(
      "🧹 CLEARING ALL FILTERS"
    );

    setCategory("All");
    setSubCategory("All");
    setBrand("All");

    setPriceRange([
      0,
      100000,
    ]);

    const nextParams =
      new URLSearchParams();

    if (search) {
      nextParams.set(
        "search",
        search
      );
    }

    setSearchParams(
      nextParams
    );

    setPage(1);
  };

  /* =====================================================
     REMOVE SINGLE URL FILTER
  ===================================================== */

  const removeFilter = (
    filterName
  ) => {
    const nextParams =
      new URLSearchParams(
        searchParams
      );

    nextParams.delete(
      filterName
    );

    console.log(
      "🗑️ REMOVING URL FILTER:",
      filterName
    );

    setSearchParams(
      nextParams
    );
  };

  /* =====================================================
     PAGINATION
  ===================================================== */

  const renderPagination =
    () => {
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

      return pages.map(
        (p, index) => {
          if (
            index > 0 &&
            p -
              pages[index - 1] >
              1
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
              type="button"
              onClick={() => {
                setPage(p);

                window.scrollTo({
                  top: 0,
                  behavior:
                    "smooth",
                });
              }}
              className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all ${
                page === p
                  ? "bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-400/30"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              {p}
            </button>
          );
        }
      );
    };

  /* =====================================================
     ERROR
  ===================================================== */

  if (
    error &&
    !loading
  ) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-100 shadow-xl p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl">
            !
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Unable to load products
          </h2>

          <p className="text-sm text-slate-500 mb-5">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      <style>{`
        .products-root {
          min-height: 100vh;
          background:
            linear-gradient(
              135deg,
              #f8fafc 0%,
              #eef2ff 45%,
              #eff6ff 100%
            );
        }

        .products-grid {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fill,
              minmax(160px, 1fr)
            );
          gap: 12px;
        }

        @media (min-width: 640px) {
          .products-grid {
            grid-template-columns:
              repeat(
                auto-fill,
                minmax(190px, 1fr)
              );
            gap: 16px;
          }
        }

        @media (min-width: 1024px) {
          .products-grid {
            grid-template-columns:
              repeat(
                auto-fill,
                minmax(220px, 1fr)
              );
            gap: 18px;
          }
        }

        .products-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .products-toolbar {
          background:
            rgba(255,255,255,0.86);
          backdrop-filter:
            blur(16px);
          border:
            1px solid
            rgba(99,102,241,0.1);
          box-shadow:
            0 10px 35px
            rgba(15,23,42,0.05);
        }

        .filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding:
            6px 10px;
          border-radius:
            999px;
          background:
            #eef2ff;
          color:
            #4f46e5;
          font-size:
            12px;
          font-weight:
            700;
        }

        .filter-chip button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background:
            rgba(79,70,229,0.12);
        }

        .floating-filter {
          position: fixed;
          right: 18px;
          bottom: 90px;
          z-index: 30;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #2563eb
            );
          color: white;
          box-shadow:
            0 12px 35px
            rgba(79,70,229,0.35);
          border:
            2px solid
            rgba(255,255,255,0.7);
        }
      `}</style>

      <div className="products-root py-6 sm:py-8 px-3 sm:px-5 lg:px-7">
        <div className="max-w-[1600px] mx-auto">

          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="text-center mb-7 sm:mb-9">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-indigo-100 shadow-sm mb-4">
              <MdOutlineCategory
                className="text-indigo-500"
                size={17}
              />

              <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-indigo-600">
                Product Catalog
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Explore Our{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                Collection
              </span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
              Discover products curated
              just for you.
            </p>

          </div>

          {/* =====================================================
              ACTIVE FILTER INFORMATION
          ===================================================== */}

          {!loading && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

              <div className="flex flex-wrap items-center gap-2">

                {category !== "All" && (
                  <div className="filter-chip">
                    Category
                    <button
                      type="button"
                      onClick={() =>
                        removeFilter(
                          "category"
                        )
                      }
                    >
                      <FaTimes size={8} />
                    </button>
                  </div>
                )}

                {subCategory !==
                  "All" && (
                  <div className="filter-chip">
                    Subcategory
                    <button
                      type="button"
                      onClick={() =>
                        removeFilter(
                          "subCategory"
                        )
                      }
                    >
                      <FaTimes size={8} />
                    </button>
                  </div>
                )}

                {brand !== "All" && (
                  <div className="filter-chip">
                    Brand: {brand}
                    <button
                      type="button"
                      onClick={() =>
                        removeFilter(
                          "brand"
                        )
                      }
                    >
                      <FaTimes size={8} />
                    </button>
                  </div>
                )}

                {activeFiltersCount >
                  0 && (
                  <button
                    type="button"
                    onClick={
                      clearAllFilters
                    }
                    className="text-xs font-bold text-red-500 hover:text-red-600 px-2"
                  >
                    Clear all
                  </button>
                )}

              </div>

              {!loading &&
                filteredData.length >
                  0 && (
                  <span className="text-xs sm:text-sm font-semibold text-slate-500">
                    {filteredData.length}{" "}
                    {filteredData.length ===
                    1
                      ? "product"
                      : "products"}
                  </span>
                )}

            </div>
          )}

          {/* =====================================================
              TOOLBAR
          ===================================================== */}

          {!loading &&
            filteredData.length >
              0 && (
              <div className="products-toolbar rounded-2xl px-3 sm:px-4 py-3 mb-5 flex items-center justify-between gap-3">

                <div className="flex items-center gap-2">

                  {activeFiltersCount >
                    0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowFilters(
                          true
                        )
                      }
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold"
                    >
                      <MdTune
                        size={15}
                      />

                      Filters

                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                        {
                          activeFiltersCount
                        }
                      </span>
                    </button>
                  )}

                </div>

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={() => {
                      setGridView(
                        true
                      );
                      setPage(1);
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                      gridView
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <FaThLarge
                      size={14}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGridView(
                        false
                      );
                      setPage(1);
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                      !gridView
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <FaList
                      size={14}
                    />
                  </button>

                </div>

              </div>
            )}

          {/* =====================================================
              LOADING
          ===================================================== */}

          {loading ? (
            <div className="products-grid">
              {Array.from({
                length: 12,
              }).map((_, index) => (
                <ProductCardSkeleton
                  key={index}
                />
              ))}
            </div>
          ) : filteredData.length ===
            0 ? (

            /* =====================================================
               EMPTY
            ===================================================== */

            <div className="min-h-[450px] flex items-center justify-center">
              <div className="text-center max-w-md">

                <Lottie
                  animationData={
                    notfound
                  }
                  className="w-56 sm:w-72 h-auto mx-auto"
                  loop
                />

                <h2 className="text-2xl font-black text-slate-900 mt-2">
                  No Products Found
                </h2>

                <p className="text-sm text-slate-500 mt-2 mb-5">
                  No products match the
                  selected category,
                  subcategory, and brand.
                </p>

                <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 text-left text-xs">

                  <div className="font-bold text-slate-700 mb-2">
                    Current filters
                  </div>

                  <div className="space-y-1 text-slate-500">
                    <div>
                      Category:{" "}
                      <b className="text-slate-700">
                        {category}
                      </b>
                    </div>

                    <div>
                      Subcategory:{" "}
                      <b className="text-slate-700">
                        {subCategory}
                      </b>
                    </div>

                    <div>
                      Brand:{" "}
                      <b className="text-slate-700">
                        {brand}
                      </b>
                    </div>

                    <div>
                      Total loaded products:{" "}
                      <b className="text-slate-700">
                        {data.length}
                      </b>
                    </div>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={
                    clearAllFilters
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-bold shadow-lg hover:shadow-xl transition"
                >
                  <FaTimes
                    size={11}
                  />

                  Clear Filters
                </button>

              </div>
            </div>

          ) : (

            /* =====================================================
               PRODUCTS
            ===================================================== */

            <>
              <div
                className={
                  gridView
                    ? "products-grid"
                    : "products-list"
                }
              >
                {paginatedProducts.map(
                  (product) => (
                    <div
                      key={
                        product?._id
                      }
                      className="min-w-0"
                    >
                      <ProductCard
                        product={
                          product
                        }
                      />
                    </div>
                  )
                )}
              </div>

              {/* =====================================================
                  PAGINATION
              ===================================================== */}

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">

                  <button
                    type="button"
                    disabled={
                      page === 1
                    }
                    onClick={() => {
                      setPage(
                        (prev) =>
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
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center disabled:opacity-40"
                  >
                    <FaAngleLeft
                      size={14}
                    />
                  </button>

                  <div className="flex gap-1.5 flex-wrap justify-center">
                    {renderPagination()}
                  </div>

                  <button
                    type="button"
                    disabled={
                      page ===
                      totalPages
                    }
                    onClick={() => {
                      setPage(
                        (prev) =>
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
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center disabled:opacity-40"
                  >
                    <FaAngleRight
                      size={14}
                    />
                  </button>

                </div>
              )}

              <div className="text-center mt-6 text-xs sm:text-sm text-slate-500">
                Showing{" "}
                <span className="font-bold text-indigo-600">
                  {startIndex + 1}
                  {" – "}
                  {Math.min(
                    startIndex +
                      itemsPerPage,
                    filteredData.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-bold text-indigo-600">
                  {
                    filteredData.length
                  }
                </span>{" "}
                products
              </div>
            </>
          )}
        </div>
      </div>

      {/* =====================================================
          FLOATING FILTER
      ===================================================== */}

      <button
        type="button"
        onClick={() =>
          setShowFilters(true)
        }
        className="floating-filter"
        aria-label="Open filters"
      >
        <FaFilter size={18} />

        {activeFiltersCount >
          0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
            {
              activeFiltersCount
            }
          </span>
        )}
      </button>

      {/* =====================================================
          FILTER DRAWER
      ===================================================== */}

      <FilterSection
        open={showFilters}
        setOpen={setShowFilters}
      />
    </>
  );
}

