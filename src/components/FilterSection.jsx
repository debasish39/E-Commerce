import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { getData } from "../context/DataContext";

import {
  FaTimes,
  FaCheck,
  FaSlidersH,
} from "react-icons/fa";

import { MdTune } from "react-icons/md";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  "";

export default function FilterSection({
  open,
  setOpen,
  initialSection = "category",
}) {
  // =========================================================
  // CONTEXT
  // =========================================================//
  const {
    category,
    setCategory,

    subCategory,
    setSubCategory,

    brand,
    setBrand,

    priceRange,
    setPriceRange,

    categoryOnlyData,
    brandOnlyData,

    sort,
    setSort,
  } = getData();

  // =========================================================
  // STATE
  // =========================================================

  const [activeFilter, setActiveFilter] =
    useState(
      initialSection === "all"
        ? "category"
        : initialSection
    );

  // Open the popup on the exact filter selected
  // from the Products toolbar.
  useEffect(() => {
    if (!open) return;

    const nextSection =
      initialSection === "all"
        ? "category"
        : initialSection;

    const validSections = [
      "category",
      "subcategory",
      "brand",
      "price",
      "sort",
    ];

    setActiveFilter(
      validSections.includes(nextSection)
        ? nextSection
        : "category"
    );
  }, [open, initialSection]);

  const [subCategories, setSubCategories] =
    useState([]);

  const [
    loadingSubCategories,
    setLoadingSubCategories,
  ] = useState(false);

  // =========================================================
  // PREVENT BACKGROUND SCROLL
  // =========================================================

  useEffect(() => {
    if (!open) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

// =========================================================
// LOAD SUBCATEGORIES
// =========================================================

useEffect(() => {
  let mounted = true;

  const loadSubCategories = async () => {
    if (!category) {
      setSubCategories([]);
      return;
    }

    try {
      setLoadingSubCategories(true);

      // =====================================================
      // ALL CATEGORIES
      // Load subcategories from every category
      // =====================================================
      if (category === "All") {
        const categories = Array.isArray(categoryOnlyData)
          ? categoryOnlyData
          : [];

        if (categories.length === 0) {
          if (mounted) {
            setSubCategories([]);
          }
          return;
        }

        const responses = await Promise.all(
          categories.map(async (categoryItem) => {
            try {
              const response = await fetch(
                `${BACKEND_URL}/api/category/${encodeURIComponent(
                  categoryItem?._id
                )}/subcategories`,
                {
                  method: "GET",
                  credentials: "include",
                  headers: {
                    Accept: "application/json",
                  },
                }
              );

              const result = await response.json();

              if (!response.ok) {
                return [];
              }

              const list = Array.isArray(
                result?.subCategories
              )
                ? result.subCategories
                : Array.isArray(
                    result?.subcategories
                  )
                ? result.subcategories
                : Array.isArray(
                    result?.data
                  )
                ? result.data
                : Array.isArray(result)
                ? result
                : [];

              return list.filter(
                (item) => item?.isActive !== false
              );
            } catch (error) {
              console.error(
                `SUBCATEGORY ERROR FOR CATEGORY ${categoryItem?._id}:`,
                error
              );

              return [];
            }
          })
        );

        // =====================================================
        // MERGE + REMOVE DUPLICATES
        // =====================================================

        const allSubCategories = responses.flat();

        const uniqueSubCategories = Array.from(
          new Map(
            allSubCategories
              .filter((item) => item?._id)
              .map((item) => [
                String(item._id),
                item,
              ])
          ).values()
        );

        if (mounted) {
          setSubCategories(
            uniqueSubCategories
          );
        }

        return;
      }

      // =====================================================
      // SELECTED CATEGORY
      // Load only that category's subcategories
      // =====================================================

      const response = await fetch(
        `${BACKEND_URL}/api/category/${encodeURIComponent(
          category
        )}/subcategories`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to load subcategories"
        );
      }

      const list = Array.isArray(
        result?.subCategories
      )
        ? result.subCategories
        : Array.isArray(
            result?.subcategories
          )
        ? result.subcategories
        : Array.isArray(
            result?.data
          )
        ? result.data
        : Array.isArray(result)
        ? result
        : [];

      if (mounted) {
        setSubCategories(
          list.filter(
            (item) =>
              item?.isActive !== false
          )
        );
      }
    } catch (error) {
      console.error(
        "SUBCATEGORY ERROR:",
        error
      );

      if (mounted) {
        setSubCategories([]);
      }
    } finally {
      if (mounted) {
        setLoadingSubCategories(false);
      }
    }
  };

  loadSubCategories();

  return () => {
    mounted = false;
  };
}, [category, categoryOnlyData]);
  // =========================================================
  // BRANDS
  // =========================================================

  const brands = useMemo(() => {
    if (
      !Array.isArray(
        brandOnlyData
      )
    ) {
      return [];
    }

    return brandOnlyData.filter(
      (item) =>
        item !== null &&
        item !== undefined &&
        String(item).trim() !== ""
    );
  }, [brandOnlyData]);

  // =========================================================
  // SAFE PRICE RANGE
  // =========================================================

  const safePriceRange =
    Array.isArray(priceRange) &&
    priceRange.length === 2
      ? priceRange
      : [0, 5000];

  const minPrice =
    Number(
      safePriceRange[0]
    ) || 0;

  const maxPrice =
    Number(
      safePriceRange[1]
    ) || 5000;

  // =========================================================
  // ACTIVE FILTER COUNTS
  // =========================================================

  const activeCount = {
    category:
      category &&
      category !== "All"
        ? 1
        : 0,

    subcategory:
      subCategory &&
      subCategory !== "All"
        ? 1
        : 0,

    brand:
      brand &&
      brand !== "All"
        ? 1
        : 0,

    price:
      minPrice !== 0 ||
      maxPrice !== 5000
        ? 1
        : 0,

    sort:
      sort &&
      sort !== "default"
        ? 1
        : 0,
  };

  const totalActive =
    Object.values(
      activeCount
    ).reduce(
      (total, value) =>
        total + value,
      0
    );

  // =========================================================
  // FILTER MENU
  // =========================================================

  const filterMenu = [
    {
      id: "category",
      title: "Category",
      description:
        "Choose category",
      count:
        activeCount.category,
    },

    {
      id: "subcategory",
      title: "Subcategory",
      description:
        "Refine category",
      count:
        activeCount.subcategory,
    },

    {
      id: "brand",
      title: "Brand",
      description:
        "Choose brand",
      count:
        activeCount.brand,
    },

    {
      id: "price",
      title: "Price Range",
      description:
        "Set your budget",
      count:
        activeCount.price,
    },

    {
      id: "sort",
      title: "Sort By",
      description:
        "Arrange products",
      count:
        activeCount.sort,
    },
  ];

  // =========================================================
  // CATEGORY HANDLER
  // =========================================================

  const handleCategory =
    (id) => {
      setCategory(id);

      setSubCategory(
        "All"
      );

      setBrand("All");

      setActiveFilter(
        "subcategory"
      );
    };

  // =========================================================
  // PRICE HANDLERS
  // =========================================================

  const updateMinPrice =
    (value) => {
      const next =
        Number(value);

      if (
        next < maxPrice
      ) {
        setPriceRange([
          next,
          maxPrice,
        ]);
      }
    };

  const updateMaxPrice =
    (value) => {
      const next =
        Number(value);

      if (
        next > minPrice
      ) {
        setPriceRange([
          minPrice,
          next,
        ]);
      }
    };

  // =========================================================
  // RESET
  // =========================================================

  const resetFilters = () => {
    setCategory("All");

    setSubCategory(
      "All"
    );

    setBrand("All");

    setPriceRange([
      0,
      5000,
    ]);

    setSort("default");

    setActiveFilter(
      "category"
    );
  };

  // =========================================================
  // CLOSE
  // =========================================================

  const closeFilter = () => {
    setOpen(false);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      {/* =====================================================
          BACKDROP
      ===================================================== */}

      <div
        onClick={closeFilter}
        className={`
          fixed inset-0 z-[90]
          bg-slate-950/50
          backdrop-blur-sm
          transition-all
          duration-300
          ${
            open
              ? "visible opacity-100"
              : "pointer-events-none invisible opacity-0"
          }
        `}
      />

      {/* =====================================================
          FILTER BOTTOM SHEET
      ===================================================== */}

      <div
        className={`
          fixed
          inset-x-0
          bottom-0
          z-[100]
          mx-auto
          flex
          h-[88dvh]
          max-h-[850px]
          w-full
          flex-col
          overflow-hidden
          rounded-t-[28px]
          bg-white
          shadow-[0_-25px_80px_rgba(15,23,42,0.28)]
          transition-transform
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]
          ${
            open
              ? "translate-y-0"
              : "translate-y-full"
          }
        `}
      >

        {/* ===================================================
            DRAG HANDLE
        =================================================== */}

        <div className="flex shrink-0 justify-center bg-white pt-3">

          <div className="h-1.5 w-12 rounded-full bg-slate-200" />

        </div>

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 py-3.5 sm:px-7 sm:py-4">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl  text-indigo-600  shadow-md shadow-indigo-600 sm:h-11 sm:w-11">

              <FaSlidersH
                size={15}
              />

            </div>

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <h2 className="text-base font-black text-slate-900 sm:text-xl">
                  Filters
                </h2>

                {totalActive >
                  0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[8px] font-black text-white">
                    {
                      totalActive
                    }
                  </span>
                )}

              </div>

              <p className="mt-0.5 truncate text-[9px] font-semibold text-slate-400 sm:text-xs">
                Refine your products
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={
              closeFilter
            }
            aria-label="Close filters"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 active:scale-90 sm:h-10 sm:w-10"
          >

            <FaTimes
              size={12}
            />

          </button>

        </header>

        {/* ===================================================
            MAIN DASHBOARD AREA
        =================================================== */}

        <div className="min-h-0 flex-1 overflow-hidden bg-slate-50">

          <div className="flex h-full">

            {/* =================================================
                LEFT FILTER MENU
            ================================================= */}

            <aside className="w-[132px] shrink-0 border-r border-slate-200 bg-white sm:w-[190px] md:w-[220px] lg:w-[240px]">

              <div className="h-full overflow-y-auto px-2 py-4 sm:px-3 sm:py-5">

                {/* Small heading */}

                <div className="mb-4 px-2 sm:px-3">

                  <p className="text-[8px] font-black uppercase tracking-[0.14em] text-slate-400 sm:text-[9px]">
                    Filter By
                  </p>

                </div>

                {/* Filter navigation */}

                <nav className="space-y-1">

                  {filterMenu.map(
                    (item) => {

                      const active =
                        activeFilter ===
                        item.id;

                      return (
                        <button
                          key={
                            item.id
                          }
                          type="button"
                          onClick={() =>
                            setActiveFilter(
                              item.id
                            )
                          }
                          className={`
                            relative
                            flex
                            min-h-[55px]
                            w-full
                            items-center
                            rounded-xl
                            px-3
                            py-2.5
                            text-left
                            transition-all
                            duration-200
                            sm:min-h-[62px]
                            sm:px-4
                            ${
                              active
                                ? "bg-indigo-50"
                                : "bg-transparent hover:bg-slate-50"
                            }
                          `}
                        >

                          {/* Active indicator */}

                          {active && (
                            <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-indigo-600" />
                          )}

                          {/* Text only */}

                          <span className="min-w-0 flex-1">

                            <span
                              className={`
                                block
                                whitespace-normal
                                break-words
                                text-[10px]
                                font-black
                                leading-4
                                sm:text-xs
                                ${
                                  active
                                    ? "text-indigo-700"
                                    : "text-slate-700"
                                }
                              `}
                            >
                              {
                                item.title
                              }
                            </span>

                            <span
                              className={`
                                mt-0.5
                                block
                                whitespace-normal
                                break-words
                                text-[7px]
                                font-semibold
                                leading-3
                                sm:text-[9px]
                                ${
                                  active
                                    ? "text-indigo-400"
                                    : "text-slate-400"
                                }
                              `}
                            >
                              {
                                item.description
                              }
                            </span>

                          </span>

                          {/* Count */}

                          {item.count >
                            0 && (
                            <span className="ml-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[8px] font-black text-white">
                              {
                                item.count
                              }
                            </span>
                          )}

                        </button>
                      );
                    }
                  )}

                </nav>

              </div>

            </aside>

            {/* =================================================
                RIGHT CONTENT
            ================================================= */}

            <main className="min-w-0 flex-1 overflow-y-auto bg-slate-50">

              <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 md:p-8">

                {/* =================================================
                    CATEGORY
                ================================================= */}

                {activeFilter ===
                  "category" && (
                  <ContentSection
                    title="Category"
                    description="Select the category you want to browse"
                  >

                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">

                      {/* All */}

                      <SelectionCard
                        label="All Categories"
                        active={
                          category ===
                          "All"
                        }
                        onClick={() =>
                          handleCategory(
                            "All"
                          )
                        }
                      />

                      {/* Categories */}

                      {(
                        categoryOnlyData ||
                        []
                      ).map(
                        (item) => (
                          <CategoryCard
                            key={
                              item?._id
                            }
                            item={
                              item
                            }
                            active={
                              category ===
                              item?._id
                            }
                            onClick={() =>
                              handleCategory(
                                item?._id
                              )
                            }
                          />
                        )
                      )}

                    </div>

                  </ContentSection>
                )}

                {/* =================================================
                    SUBCATEGORY
                ================================================= */}

              {activeFilter === "subcategory" && (
  <ContentSection
    title="Subcategory"
    description={
      category === "All"
        ? "Choose from all available subcategories"
        : "Choose a more specific product group"
    }
  >
    {loadingSubCategories ? (
      <LoadingGrid />
    ) : subCategories.length === 0 ? (
      <EmptyState>
        No subcategories available.
      </EmptyState>
    ) : (
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {/* All Subcategories */}
        <SelectionCard
          label="All Subcategories"
          active={subCategory === "All"}
          onClick={() => setSubCategory("All")}
        />

        {/* Subcategories */}
        {subCategories.map((item) => (
          <SubCategoryCard
            key={item?._id}
            item={item}
            active={subCategory === item?._id}
            onClick={() => setSubCategory(item?._id)}
          />
        ))}
      </div>
    )}
  </ContentSection>
)}

                {/* =================================================
                    BRAND
                ================================================= */}

                {activeFilter ===
                  "brand" && (
                  <ContentSection
                    title="Brand"
                    description="Choose your preferred brand"
                  >

                    {brands.length ===
                    0 ? (

                      <EmptyState>
                        No brands available.
                      </EmptyState>

                    ) : (

                      <div className="flex flex-wrap gap-2">

                        <BrandChip
                          label="All Brands"
                          active={
                            brand ===
                            "All"
                          }
                          onClick={() =>
                            setBrand(
                              "All"
                            )
                          }
                        />

                        {brands.map(
                          (item) => (
                            <BrandChip
                              key={
                                item
                              }
                              label={
                                item
                              }
                              active={
                                brand ===
                                item
                              }
                              onClick={() =>
                                setBrand(
                                  item
                                )
                              }
                            />
                          )
                        )}

                      </div>

                    )}

                  </ContentSection>
                )}

                {/* =================================================
                    PRICE
                ================================================= */}
                  {activeFilter === "price" && (
                    <ContentSection
                      title="Price Range"
                      description="Set your budget and find products within your range"
                    >
                      <div className="w-full max-w-3xl">
                        <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-6">
                          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-50 blur-2xl" />

                          <div className="relative">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                              <div>
                                <div className="mb-1 flex items-center gap-2">
                                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-sm font-black text-indigo-600">
                                    ₹
                                  </span>
                                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400 sm:text-[10px]">
                                    Your budget
                                  </p>
                                </div>

                                <h3 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                                  ₹{minPrice.toLocaleString("en-IN")}
                                  <span className="mx-2 text-slate-300">—</span>
                                  ₹{maxPrice.toLocaleString("en-IN")}
                                </h3>

                                <p className="mt-1.5 text-[9px] font-medium text-slate-400 sm:text-[10px]">
                                  Products between your selected prices
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <PriceBadge
                                  label="MIN"
                                  value={`₹${minPrice.toLocaleString("en-IN")}`}
                                />
                                <PriceBadge
                                  label="MAX"
                                  value={`₹${maxPrice.toLocaleString("en-IN")}`}
                                />
                              </div>
                            </div>

                            <div className="mt-7 rounded-2xl bg-slate-50 p-4 sm:mt-8 sm:p-5">
                              <div className="mb-4 flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 sm:text-[10px]">
                                  Price range
                                </span>

                                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[8px] font-bold text-slate-500 sm:text-[9px]">
                                  ₹0 — ₹5,000+
                                </span>
                              </div>

                              <div className="grid gap-4 sm:grid-cols-2">
                                <PriceInput
                                  label="Minimum"
                                  value={minPrice}
                                  onChange={updateMinPrice}
                                />

                                <PriceInput
                                  label="Maximum"
                                  value={maxPrice}
                                  onChange={updateMaxPrice}
                                />
                              </div>
                            </div>

                            <div className="mt-5">
                              <p className="mb-2.5 text-[9px] font-black uppercase tracking-wider text-slate-400 sm:text-[10px]">
                                Quick select
                              </p>

                              <div className="flex flex-wrap gap-2">
                                <PricePreset
                                  label="Under ₹500"
                                  active={minPrice === 0 && maxPrice === 500}
                                  onClick={() => setPriceRange([0, 500])}
                                />

                                <PricePreset
                                  label="₹500 – ₹1,000"
                                  active={minPrice === 500 && maxPrice === 1000}
                                  onClick={() => setPriceRange([500, 1000])}
                                />

                                <PricePreset
                                  label="₹1,000 – ₹2,500"
                                  active={minPrice === 1000 && maxPrice === 2500}
                                  onClick={() => setPriceRange([1000, 2500])}
                                />

                                <PricePreset
                                  label="₹2,500+"
                                  active={minPrice === 2500 && maxPrice === 5000}
                                  onClick={() => setPriceRange([2500, 5000])}
                                />

                                <PricePreset
                                  label="Any price"
                                  active={minPrice === 0 && maxPrice === 5000}
                                  onClick={() => setPriceRange([0, 5000])}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ContentSection>
                  )}

                {/* =================================================
                    SORT
                ================================================= */}

                {activeFilter ===
                  "sort" && (
                  <ContentSection
                    title="Sort Products"
                    description="Choose how you want products to appear"
                  >

                    <div className="grid max-w-3xl grid-cols-1 gap-2.5 sm:grid-cols-2">

                      <SortCard
                        title="Default"
                        description="Recommended products"
                        active={
                          sort ===
                          "default"
                        }
                        onClick={() =>
                          setSort(
                            "default"
                          )
                        }
                      />

                      <SortCard
                        title="Price: Low to High"
                        description="Cheapest products first"
                        active={
                          sort ===
                          "low-high"
                        }
                        onClick={() =>
                          setSort(
                            "low-high"
                          )
                        }
                      />

                      <SortCard
                        title="Price: High to Low"
                        description="Most expensive products first"
                        active={
                          sort ===
                          "high-low"
                        }
                        onClick={() =>
                          setSort(
                            "high-low"
                          )
                        }
                      />

                      <SortCard
                        title="Highest Rated"
                        description="Best rated products first"
                        active={
                          sort ===
                          "rating"
                        }
                        onClick={() =>
                          setSort(
                            "rating"
                          )
                        }
                      />

                    </div>

                  </ContentSection>
                )}

              </div>

            </main>

          </div>

        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="shrink-0 border-t border-slate-200 bg-white px-3 py-3.5 shadow-[0_-8px_25px_rgba(15,23,42,0.06)] sm:px-7 sm:py-4">

          <div className="mx-auto flex max-w-7xl items-center gap-2.5 sm:gap-3">

            {/* Desktop status */}

            <div className="hidden flex-1 sm:block">

              <p className="text-[10px] font-bold text-slate-400">

                {totalActive ===
                0
                  ? "No filters applied"
                  : `${totalActive} filter${
                      totalActive >
                      1
                        ? "s"
                        : ""
                    } applied`}

              </p>

            </div>

            {/* Buttons */}

            <div className="flex w-full gap-2.5 sm:w-auto sm:min-w-[330px]">

              <button
                type="button"
                onClick={
                  resetFilters
                }
                className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-[10px] font-black text-slate-600 transition hover:bg-slate-50 active:scale-[0.97] sm:h-12 sm:rounded-2xl sm:text-xs"
              >

                <MdTune
                  size={15}
                />

                Reset

              </button>

              <button
                type="button"
                onClick={
                  closeFilter
                }
                className="flex h-11 flex-[2] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-[10px] font-black text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 active:scale-[0.97] sm:h-12 sm:rounded-2xl sm:text-xs"
              >

                <FaCheck
                  size={9}
                />

                Show Products

                {totalActive >
                  0 && (
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[8px]">
                    {
                      totalActive
                    }
                  </span>
                )}

              </button>

            </div>

          </div>

        </footer>

      </div>
    </>
  );
}

// =============================================================
// CONTENT SECTION
// =============================================================

function ContentSection({
  title,
  description,
  children,
}) {
  return (
    <section>

      <div className="mb-5 sm:mb-7">

        <h2 className="text-lg font-black tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h2>

        <p className="mt-1 text-[9px] font-semibold leading-4 text-slate-400 sm:text-xs">
          {description}
        </p>

      </div>

      {children}

    </section>
  );
}

// =============================================================
// SELECTION CARD
// =============================================================

function SelectionCard({
  label,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative
        flex
        min-h-[48px]
        w-full
        items-center
        justify-between
        rounded-xl
        border
        px-3
        py-2.5
        text-left
        transition-all
        duration-200
        active:scale-[0.97]
        sm:min-h-[55px]
        sm:rounded-2xl
        sm:px-4
        ${
          active
            ? "border-indigo-300 bg-indigo-50 text-indigo-700 shadow-sm"
            : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:shadow-sm"
        }
      `}
    >

      <span className="pr-7 text-[10px] font-extrabold leading-4 sm:text-[11px]">
        {label}
      </span>

      {active && (
        <span className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-indigo-600 text-white">
          <FaCheck
            size={8}
          />
        </span>
      )}

    </button>
  );
}

// =============================================================
// CATEGORY CARD
// =============================================================

function CategoryCard({
  item,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative
        flex
        min-h-[58px]
        w-full
        items-center
        gap-2.5
        rounded-xl
        border
        p-2
        text-left
        transition-all
        duration-200
        active:scale-[0.97]
        sm:min-h-[68px]
        sm:rounded-2xl
        sm:p-2.5
        ${
          active
            ? "border-indigo-300 bg-indigo-50 shadow-sm"
            : "border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm"
        }
      `}
    >

      {/* Category icon */}
      {item?.icon ? (
        typeof item.icon === "string" &&
        (item.icon.startsWith("http://") ||
          item.icon.startsWith("https://")) ? (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-1 sm:h-11 sm:w-11">
            <img
              src={item.icon}
              alt={item?.name || "Category"}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg sm:h-11 sm:w-11 sm:text-xl">
            {item.icon}
          </div>
        )
      ) : item?.image ? (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-1 sm:h-11 sm:w-11">
          <img
            src={item.image}
            alt={item?.name || "Category"}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 sm:h-11 sm:w-11">
          <span className="text-sm sm:text-base">📦</span>
        </div>
      )}

      {/* Name */}

      <span className="min-w-0 flex-1 break-words pr-5 text-[9px] font-extrabold leading-4 text-slate-700 sm:text-[11px]">
        {item?.name ||
          "Category"}
      </span>

      {/* Check */}

      {active && (
        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
          <FaCheck
            size={8}
          />
        </span>
      )}

    </button>
  );
}
// =============================================================
// SUBCATEGORY CARD
// =============================================================

function SubCategoryCard({
  item,
  active,
  onClick,
}) {
  const icon = item?.icon?.trim?.() || "";
  const image = item?.image?.trim?.() || "";

  const isIconUrl =
    icon.startsWith("http://") ||
    icon.startsWith("https://");

  const isImageUrl =
    image.startsWith("http://") ||
    image.startsWith("https://");

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative
        flex
        min-h-[58px]
        w-full
        items-center
        gap-2.5
        rounded-xl
        border
        p-2
        text-left
        transition-all
        duration-200
        active:scale-[0.97]
        sm:min-h-[68px]
        sm:rounded-2xl
        sm:p-2.5
        ${
          active
            ? "border-indigo-300 bg-indigo-50 shadow-sm"
            : "border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm"
        }
      `}
    >
      {/* =====================================================
          SUBCATEGORY ICON
      ===================================================== */}

      {icon ? (
        isIconUrl ? (
          // Icon is an image URL
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-1 sm:h-11 sm:w-11">
            <img
              src={icon}
              alt={item?.name || "Subcategory"}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
        ) : (
          // Icon is emoji/text, e.g. 💄
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg sm:h-11 sm:w-11 sm:text-xl">
            {icon}
          </div>
        )
      ) : isImageUrl ? (
        // No icon, use image instead
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-1 sm:h-11 sm:w-11">
          <img
            src={image}
            alt={item?.name || "Subcategory"}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>
      ) : (
        // Final fallback
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 sm:h-11 sm:w-11">
          <span className="text-sm sm:text-base">
            📦
          </span>
        </div>
      )}

      {/* =====================================================
          NAME
      ===================================================== */}

      <span className="min-w-0 flex-1 break-words pr-5 text-[9px] font-extrabold leading-4 text-slate-700 sm:text-[11px]">
        {item?.name || "Subcategory"}
      </span>

      {/* =====================================================
          CHECK
      ===================================================== */}

      {active && (
        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
          <FaCheck size={8} />
        </span>
      )}
    </button>
  );
}
// =============================================================
// BRAND CHIP
// =============================================================

function BrandChip({
  label,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-full
        border
        px-3.5
        py-2.5
        text-[9px]
        font-extrabold
        transition-all
        active:scale-95
        sm:px-4
        sm:text-[10px]
        ${
          active
            ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-100"
            : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
        }
      `}
    >
      {label}
    </button>
  );
}

// =============================================================
// SORT CARD
// =============================================================

function SortCard({
  title,
  description,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        min-h-[65px]
        w-full
        items-center
        justify-between
        rounded-xl
        border
        p-3
        text-left
        transition-all
        active:scale-[0.98]
        sm:min-h-[80px]
        sm:rounded-2xl
        sm:p-4
        ${
          active
            ? "border-indigo-300 bg-indigo-50"
            : "border-slate-200 bg-white hover:border-indigo-200"
        }
      `}
    >

      <div className="min-w-0">

        <p
          className={`
            text-[10px]
            font-black
            sm:text-xs
            ${
              active
                ? "text-indigo-700"
                : "text-slate-700"
            }
          `}
        >
          {title}
        </p>

        <p className="mt-1 text-[8px] font-semibold leading-4 text-slate-400 sm:text-[10px]">
          {description}
        </p>

      </div>

      <span
        className={`
          ml-3
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          rounded-full
          ${
            active
              ? "bg-indigo-600 text-white"
              : "border border-slate-200"
          }
        `}
      >
        {active && (
          <FaCheck
            size={8}
          />
        )}
      </span>

    </button>
  );
}

// =============================================================
// PRICE BADGE
// =============================================================

function PriceBadge({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:rounded-2xl sm:px-4 sm:py-2.5">
      <p className="text-[7px] font-black tracking-wider text-slate-400 sm:text-[8px]">
        {label}
      </p>
      <p className="mt-0.5 text-[9px] font-black text-slate-800 sm:text-[10px]">
        {value}
      </p>
    </div>
  );
}

// =============================================================
// PRICE PRESET
// =============================================================

function PricePreset({
  label,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-full
        border
        px-3
        py-2
        text-[8px]
        font-extrabold
        transition-all
        duration-200
        active:scale-95
        sm:px-3.5
        sm:py-2.5
        sm:text-[9px]
        ${
          active
            ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-100"
            : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
        }
      `}
    >
      {label}
    </button>
  );
}

// =============================================================
// PRICE INPUT
// =============================================================
// =============================================================

function PriceInput({
  label,
  value,
  onChange,
}) {
  const numericValue = Number(value) || 0;
  const percentage = Math.min(
    100,
    Math.max(0, (numericValue / 5000) * 100)
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 sm:rounded-2xl sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 sm:text-[10px]">
          {label}
        </span>

        <span className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-[9px] font-black text-indigo-700 sm:text-[10px]">
          ₹{numericValue.toLocaleString("en-IN")}
        </span>
      </div>

      <div className="relative pt-1">
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <input
          type="range"
          min="0"
          max="5000"
          step="100"
          value={numericValue}
          onChange={(event) => onChange(event.target.value)}
          aria-label={label}
          className="absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent accent-indigo-600"
        />
      </div>

      <div className="mt-2 flex justify-between text-[7px] font-bold text-slate-400 sm:text-[8px]">
        <span>₹0</span>
        <span>₹5,000+</span>
      </div>
    </div>
  );
}

// =============================================================
// LOADING
// =============================================================

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">

      {[1, 2, 3, 4, 5, 6].map(
        (item) => (
          <div
            key={item}
            className="h-12 animate-pulse rounded-xl bg-white sm:h-14 sm:rounded-2xl"
          />
        )
      )}

    </div>
  );
}

// =============================================================
// EMPTY STATE
// =============================================================

function EmptyState({
  children,
}) {
  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-2xl bg-white px-5 sm:rounded-3xl">

      <div className="max-w-xs text-center">

        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400 sm:h-12 sm:w-12">

          <MdTune
            size={19}
          />

        </div>

        <p className="mt-3 text-[9px] font-bold leading-5 text-slate-400 sm:text-[10px]">
          {children}
        </p>

      </div>

    </div>
  );
}

