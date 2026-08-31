import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaSearch,
  FaTimes,
  FaChevronRight,
  FaChevronDown,
  FaClock,
  FaFire,
  FaStar,
  FaShoppingBag,
} from "react-icons/fa";

import { getData } from "../context/DataContext";


/* =========================================================
   SEARCH PAGE
========================================================= */

export default function SearchPage() {
  const navigate = useNavigate();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const {
    products = [],
    categoryOnlyData = [],
    brandOnlyData = [],
  } = getData();


  /* =======================================================
     STATE
  ======================================================= */

  const initialQuery =
    searchParams.get("q") || "";

  const [
    query,
    setQuery,
  ] = useState(initialQuery);

  const [
    searchInput,
    setSearchInput,
  ] = useState(initialQuery);

  const [
    sort,
    setSort,
  ] = useState("default");

  const [
    recentSearches,
    setRecentSearches,
  ] = useState([]);


  /* =======================================================
     LOAD RECENT SEARCHES
  ======================================================= */

  useEffect(() => {
    try {
      const saved =
        JSON.parse(
          localStorage.getItem(
            "recentSearches"
          ) || "[]"
        );

      if (Array.isArray(saved)) {
        setRecentSearches(saved);
      }
    } catch {
      setRecentSearches([]);
    }
  }, []);


  /* =======================================================
     SEARCH QUERY FROM URL
  ======================================================= */

  useEffect(() => {
    const urlQuery =
      searchParams.get("q") || "";

    setQuery(urlQuery);
    setSearchInput(urlQuery);
  }, [searchParams]);


  /* =======================================================
     NORMALIZE VALUE
  ======================================================= */

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();


  /* =======================================================
     GET PRODUCT NAME
  ======================================================= */

  const getProductName = (product) =>
    product?.name ||
    product?.title ||
    product?.productName ||
    product?.product_title ||
    "";


  /* =======================================================
     GET CATEGORY
  ======================================================= */

  const getProductCategory = (
    product
  ) =>
    product?.category ||
    product?.categoryName ||
    product?.category_name ||
    "";


  /* =======================================================
     GET BRAND
  ======================================================= */

  const getProductBrand = (
    product
  ) =>
    product?.brand ||
    product?.brandName ||
    product?.brand_name ||
    "";


  /* =======================================================
     GET PRICE
  ======================================================= */

  const getProductPrice = (
    product
  ) =>
    Number(
      product?.price ??
        product?.sellingPrice ??
        product?.selling_price ??
        0
    );


  /* =======================================================
     GET RATING
  ======================================================= */

  const getProductRating = (
    product
  ) =>
    Number(
      product?.rating ??
        product?.ratings ??
        product?.averageRating ??
        0
    );


  /* =======================================================
     GET IMAGE
  ======================================================= */

  const getProductImage = (
    product
  ) =>
    product?.image ||
    product?.imageUrl ||
    product?.image_url ||
    product?.thumbnail ||
    product?.images?.[0] ||
    "";


  /* =======================================================
     SEARCH PRODUCTS
  ======================================================= */

  const searchResults =
    useMemo(() => {

      const search =
        normalize(query);

      if (!search) {
        return [];
      }

      const words =
        search.split(/\s+/);

      return products.filter(
        (product) => {

          const searchableText =
            [
              getProductName(product),
              getProductCategory(product),
              getProductBrand(product),
              product?.description,
              product?.subCategory,
              product?.subcategory,
              product?.tags,
            ]
              .flat()
              .map(normalize)
              .join(" ");

          return words.every(
            (word) =>
              searchableText.includes(
                word
              )
          );
        }
      );

    }, [
      products,
      query,
    ]);


  /* =======================================================
     SORT RESULTS
  ======================================================= */

  const sortedResults =
    useMemo(() => {

      const result = [
        ...searchResults,
      ];

      if (
        sort === "low-high"
      ) {
        result.sort(
          (a, b) =>
            getProductPrice(a) -
            getProductPrice(b)
        );
      }

      if (
        sort === "high-low"
      ) {
        result.sort(
          (a, b) =>
            getProductPrice(b) -
            getProductPrice(a)
        );
      }

      if (
        sort === "rating"
      ) {
        result.sort(
          (a, b) =>
            getProductRating(b) -
            getProductRating(a)
        );
      }

      return result;

    }, [
      searchResults,
      sort,
    ]);


  /* =======================================================
     CATEGORY MATCHES
  ======================================================= */

  const categoryResults =
    useMemo(() => {

      const search =
        normalize(query);

      if (!search) {
        return [];
      }

      return categoryOnlyData
        .filter((item) => {

          const name =
            typeof item === "string"
              ? item
              : item?.name ||
                item?.category ||
                "";

          return normalize(
            name
          ).includes(search);

        })
        .slice(0, 6);

    }, [
      categoryOnlyData,
      query,
    ]);


  /* =======================================================
     BRAND MATCHES
  ======================================================= */

  const brandResults =
    useMemo(() => {

      const search =
        normalize(query);

      if (!search) {
        return [];
      }

      return brandOnlyData
        .filter((item) => {

          const name =
            typeof item === "string"
              ? item
              : item?.name ||
                item?.brand ||
                "";

          return normalize(
            name
          ).includes(search);

        })
        .slice(0, 6);

    }, [
      brandOnlyData,
      query,
    ]);


  /* =======================================================
     SUGGESTIONS
  ======================================================= */

  const suggestions =
    useMemo(() => {

      const search =
        normalize(searchInput);

      if (!search) {
        return [];
      }

      const values = [
        ...products.map(
          getProductName
        ),
        ...products.map(
          getProductCategory
        ),
        ...products.map(
          getProductBrand
        ),
      ];

      return [
        ...new Set(
          values.filter(
            (value) =>
              value &&
              normalize(
                value
              ).includes(search)
          )
        ),
      ].slice(0, 8);

    }, [
      products,
      searchInput,
    ]);


  /* =======================================================
     SAVE RECENT SEARCH
  ======================================================= */

  const saveRecentSearch = (
    value
  ) => {

    const cleaned =
      String(value || "")
        .trim();

    if (!cleaned) {
      return;
    }

    const updated = [
      cleaned,
      ...recentSearches.filter(
        (item) =>
          normalize(item) !==
          normalize(cleaned)
      ),
    ].slice(0, 8);

    setRecentSearches(
      updated
    );

    localStorage.setItem(
      "recentSearches",
      JSON.stringify(updated)
    );

  };


  /* =======================================================
     EXECUTE SEARCH
  ======================================================= */

  const executeSearch = (
    value = searchInput
  ) => {

    const cleaned =
      String(value || "")
        .trim();

    if (!cleaned) {
      setQuery("");
      setSearchParams({});
      return;
    }

    saveRecentSearch(
      cleaned
    );

    setQuery(cleaned);

    setSearchParams({
      q: cleaned,
    });

  };


  /* =======================================================
     CLEAR SEARCH
  ======================================================= */

  const clearSearch = () => {

    setSearchInput("");
    setQuery("");
    setSearchParams({});

  };


  /* =======================================================
     POPULAR SEARCHES
  ======================================================= */

  const popularSearches = [
    "Shoes",
    "T-Shirts",
    "Watches",
    "Bags",
    "Headphones",
    "Mobiles",
  ];


  /* =======================================================
     FORMAT PRICE
  ======================================================= */

  const formatPrice = (
    value
  ) =>
    `₹${Number(
      value || 0
    ).toLocaleString(
      "en-IN"
    )}`;


  /* =======================================================
     PRODUCT CARD
  ======================================================= */

  const ProductCard = ({
    product,
  }) => {

    const name =
      getProductName(product);

    const price =
      getProductPrice(product);

    const rating =
      getProductRating(product);

    const image =
      getProductImage(product);

    const productId =
      product?.id ??
      product?._id ??
      product?.productId;

    return (
      <button
        type="button"
        onClick={() =>
          productId
            ? navigate(
                `/products/${productId}`
              )
            : undefined
        }
        className="
          group
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          text-left
          shadow-sm
          transition-all
          duration-200
          hover:-translate-y-1
          hover:border-indigo-200
          hover:shadow-lg
          active:scale-[0.98]
        "
      >

        {/* IMAGE */}

        <div
          className="
            relative
            aspect-square
            overflow-hidden
            bg-slate-50
          "
        >

          {image ? (
            <img
              src={image}
              alt={name}
              className="
                h-full
                w-full
                object-contain
                p-3
                transition-transform
                duration-500
                group-hover:scale-105
              "
              loading="lazy"
            />
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                text-slate-300
              "
            >
              <FaShoppingBag
                size={30}
              />
            </div>
          )}

        </div>


        {/* CONTENT */}

        <div className="p-3">

          <p
            className="
              line-clamp-2
              min-h-[30px]
              text-[10px]
              font-bold
              leading-4
              text-slate-800
            "
          >
            {name}
          </p>

          <div
            className="
              mt-2
              flex
              items-center
              justify-between
              gap-2
            "
          >

            <span
              className="
                text-sm
                font-black
                text-slate-950
              "
            >
              {formatPrice(
                price
              )}
            </span>

            {rating > 0 && (
              <span
                className="
                  flex
                  items-center
                  gap-1
                  rounded-md
                  bg-emerald-50
                  px-1.5
                  py-1
                  text-[8px]
                  font-black
                  text-emerald-700
                "
              >
                {rating.toFixed(
                  1
                )}

                <FaStar
                  size={7}
                />
              </span>
            )}

          </div>

        </div>

      </button>
    );
  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-slate-50
        pb-10
      "
    >

      {/* ===================================================
          SEARCH HEADER
      =================================================== */}

      <div
        className="
          sticky
          top-0
          z-40
          border-b
          border-slate-200/70
          bg-white/95
          backdrop-blur-xl
        "
      >

        <div
          className="
            mx-auto
            flex
            h-16
            max-w-7xl
            items-center
            gap-2
            px-3
            sm:px-5
          "
        >

          {/* BACK */}

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-slate-600
              transition
              hover:bg-slate-100
              active:scale-95
            "
            aria-label="Go back"
          >
            <FaArrowLeft
              size={13}
            />
          </button>


          {/* SEARCH INPUT */}

          <div
            className="
              relative
              flex-1
            "
          >

            <div
              className="
                flex
                h-11
                items-center
                gap-2.5
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-3
                transition
                focus-within:border-indigo-300
                focus-within:bg-white
                focus-within:ring-2
                focus-within:ring-indigo-100
              "
            >

              <FaSearch
                size={12}
                className="shrink-0 text-slate-400"
              />

              <input
                type="search"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {

                  if (
                    event.key ===
                    "Enter"
                  ) {
                    executeSearch();
                  }

                  if (
                    event.key ===
                    "Escape"
                  ) {
                    clearSearch();
                  }

                }}
                placeholder="
                  Search products, brands & categories
                "
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-xs
                  font-semibold
                  text-slate-800
                  outline-none
                  placeholder:text-slate-400
                "
                autoFocus
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={
                    clearSearch
                  }
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    text-slate-400
                    transition
                    hover:bg-slate-200
                    hover:text-slate-700
                  "
                  aria-label="Clear search"
                >
                  <FaTimes
                    size={10}
                  />
                </button>
              )}

            </div>


            {/* =================================================
                SEARCH SUGGESTIONS
            ================================================= */}

            {searchInput &&
              suggestions.length >
                0 &&
              searchInput !==
                query && (

                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-[calc(100%+8px)]
                    z-50
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-2
                    shadow-xl
                  "
                >

                  {suggestions.map(
                    (
                      suggestion,
                      index
                    ) => (

                      <button
                        key={`${suggestion}-${index}`}
                        type="button"
                        onClick={() =>
                          executeSearch(
                            suggestion
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-3
                          text-left
                          transition
                          hover:bg-slate-50
                        "
                      >

                        <FaSearch
                          size={10}
                          className="text-slate-400"
                        />

                        <span
                          className="
                            flex-1
                            truncate
                            text-[11px]
                            font-bold
                            text-slate-700
                          "
                        >
                          {suggestion}
                        </span>

                        <FaChevronRight
                          size={8}
                          className="text-slate-300"
                        />

                      </button>

                    )
                  )}

                </div>

              )}

          </div>

        </div>

      </div>


      {/* ===================================================
          CONTENT
      =================================================== */}

      <div
        className="
          mx-auto
          max-w-7xl
          px-3
          pt-5
          sm:px-5
        "
      >

        {/* =================================================
            NO QUERY
        ================================================= */}

        {!query ? (

          <>

            {/* TITLE */}

            <div className="mb-6">

              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.2em]
                  text-indigo-500
                "
              >
                Discover
              </p>

              <h1
                className="
                  mt-1
                  text-2xl
                  font-black
                  tracking-tight
                  text-slate-900
                  sm:text-3xl
                "
              >
                Find what you need
              </h1>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-medium
                  text-slate-400
                  sm:text-xs
                "
              >
                Search products, brands
                and categories.
              </p>

            </div>


            {/* POPULAR SEARCHES */}

            <section className="mb-8">

              <div
                className="
                  mb-3
                  flex
                  items-center
                  gap-2
                "
              >

                <FaFire
                  size={12}
                  className="text-orange-500"
                />

                <h2
                  className="
                    text-xs
                    font-black
                    text-slate-900
                  "
                >
                  Popular Searches
                </h2>

              </div>


              <div
                className="
                  flex
                  flex-wrap
                  gap-2
                "
              >

                {popularSearches.map(
                  (item) => (

                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        executeSearch(
                          item
                        )
                      }
                      className="
                        rounded-full
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-2.5
                        text-[10px]
                        font-bold
                        text-slate-600
                        shadow-sm
                        transition
                        hover:border-indigo-200
                        hover:bg-indigo-50
                        hover:text-indigo-600
                        active:scale-95
                      "
                    >
                      {item}
                    </button>

                  )
                )}

              </div>

            </section>


            {/* RECENT SEARCHES */}

            {recentSearches.length >
              0 && (

              <section>

                <div
                  className="
                    mb-3
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <FaClock
                      size={11}
                      className="text-slate-400"
                    />

                    <h2
                      className="
                        text-xs
                        font-black
                        text-slate-900
                      "
                    >
                      Recent Searches
                    </h2>

                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setRecentSearches(
                        []
                      );

                      localStorage.removeItem(
                        "recentSearches"
                      );
                    }}
                    className="
                      text-[9px]
                      font-bold
                      text-slate-400
                      hover:text-red-500
                    "
                  >
                    Clear
                  </button>

                </div>


                <div className="space-y-1">

                  {recentSearches.map(
                    (item) => (

                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          executeSearch(
                            item
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          bg-white
                          px-4
                          py-3
                          text-left
                          shadow-sm
                          transition
                          hover:bg-slate-50
                        "
                      >

                        <FaClock
                          size={10}
                          className="text-slate-300"
                        />

                        <span
                          className="
                            flex-1
                            text-[10px]
                            font-bold
                            text-slate-600
                          "
                        >
                          {item}
                        </span>

                        <FaChevronRight
                          size={8}
                          className="text-slate-300"
                        />

                      </button>

                    )
                  )}

                </div>

              </section>

            )}

          </>

        ) : (

          /* =================================================
             SEARCH RESULTS
          ================================================= */

          <>

            {/* RESULTS HEADER */}

            <div
              className="
                mb-5
                flex
                flex-wrap
                items-end
                justify-between
                gap-3
              "
            >

              <div>

                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    text-indigo-500
                  "
                >
                  Search Results
                </p>

                <h1
                  className="
                    mt-1
                    max-w-[280px]
                    truncate
                    text-xl
                    font-black
                    text-slate-900
                    sm:max-w-lg
                    sm:text-2xl
                  "
                >
                  "{query}"
                </h1>

                <p
                  className="
                    mt-1
                    text-[10px]
                    font-medium
                    text-slate-400
                  "
                >
                  {sortedResults.length} products found
                </p>

              </div>


              {/* SORT */}

              <div className="relative">

                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(
                      event.target.value
                    )
                  }
                  className="
                    h-10
                    appearance-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    pl-3
                    pr-8
                    text-[9px]
                    font-black
                    text-slate-700
                    outline-none
                    shadow-sm
                    focus:border-indigo-300
                    focus:ring-2
                    focus:ring-indigo-100
                  "
                >

                  <option value="default">
                    Sort: Relevance
                  </option>

                  <option value="low-high">
                    Price: Low → High
                  </option>

                  <option value="high-low">
                    Price: High → Low
                  </option>

                  <option value="rating">
                    Highest Rated
                  </option>

                </select>

                <FaChevronDown
                  size={8}
                  className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

              </div>

            </div>


            {/* CATEGORY / BRAND MATCHES */}

            {(categoryResults.length >
              0 ||
              brandResults.length >
                0) && (

              <div
                className="
                  mb-6
                  grid
                  gap-3
                  sm:grid-cols-2
                "
              >

                {/* CATEGORY */}

                {categoryResults.length >
                  0 && (

                  <div
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-4
                    "
                  >

                    <h2
                      className="
                        mb-3
                        text-[10px]
                        font-black
                        uppercase
                        tracking-wider
                        text-slate-400
                      "
                    >
                      Categories
                    </h2>

                    <div className="space-y-1">

                      {categoryResults.map(
                        (item, index) => {

                          const name =
                            typeof item ===
                            "string"
                              ? item
                              : item?.name ||
                                item?.category;

                          return (
                            <button
                              key={`${name}-${index}`}
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/category/${encodeURIComponent(
                                    name
                                  )}`
                                )
                              }
                              className="
                                flex
                                w-full
                                items-center
                                justify-between
                                rounded-lg
                                px-2
                                py-2
                                text-left
                                text-[10px]
                                font-bold
                                text-slate-700
                                hover:bg-slate-50
                              "
                            >
                              {name}

                              <FaChevronRight
                                size={7}
                                className="text-slate-300"
                              />
                            </button>
                          );
                        }
                      )}

                    </div>

                  </div>

                )}


                {/* BRAND */}

                {brandResults.length >
                  0 && (

                  <div
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-4
                    "
                  >

                    <h2
                      className="
                        mb-3
                        text-[10px]
                        font-black
                        uppercase
                        tracking-wider
                        text-slate-400
                      "
                    >
                      Brands
                    </h2>

                    <div className="space-y-1">

                      {brandResults.map(
                        (item, index) => {

                          const name =
                            typeof item ===
                            "string"
                              ? item
                              : item?.name ||
                                item?.brand;

                          return (
                            <button
                              key={`${name}-${index}`}
                              type="button"
                              onClick={() =>
                                executeSearch(
                                  name
                                )
                              }
                              className="
                                flex
                                w-full
                                items-center
                                justify-between
                                rounded-lg
                                px-2
                                py-2
                                text-left
                                text-[10px]
                                font-bold
                                text-slate-700
                                hover:bg-slate-50
                              "
                            >
                              {name}

                              <FaChevronRight
                                size={7}
                                className="text-slate-300"
                              />
                            </button>
                          );
                        }
                      )}

                    </div>

                  </div>

                )}

              </div>

            )}


            {/* PRODUCTS */}

            {sortedResults.length >
            0 ? (

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                  sm:grid-cols-3
                  lg:grid-cols-4
                  xl:grid-cols-5
                "
              >

                {sortedResults.map(
                  (product, index) => (

                    <ProductCard
                      key={
                        product?.id ??
                        product?._id ??
                        product?.productId ??
                        index
                      }
                      product={
                        product
                      }
                    />

                  )
                )}

              </div>

            ) : (

              /* =================================================
                 NO RESULTS
              ================================================= */

              <div
                className="
                  flex
                  min-h-[420px]
                  flex-col
                  items-center
                  justify-center
                  rounded-3xl
                  border
                  border-slate-200
                  bg-white
                  px-6
                  text-center
                "
              >

                <div
                  className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-slate-100
                    text-slate-300
                  "
                >
                  <FaSearch
                    size={22}
                  />
                </div>

                <h2
                  className="
                    mt-5
                    text-lg
                    font-black
                    text-slate-900
                  "
                >
                  No products found
                </h2>

                <p
                  className="
                    mt-2
                    max-w-sm
                    text-[10px]
                    leading-5
                    text-slate-400
                  "
                >
                  We couldn't find
                  anything matching
                  "{query}". Try another
                  product, brand or
                  category.
                </p>

                <div
                  className="
                    mt-5
                    flex
                    flex-wrap
                    justify-center
                    gap-2
                  "
                >

                  {popularSearches
                    .slice(0, 4)
                    .map(
                      (item) => (

                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            executeSearch(
                              item
                            )
                          }
                          className="
                            rounded-full
                            bg-slate-100
                            px-3
                            py-2
                            text-[9px]
                            font-bold
                            text-slate-600
                            transition
                            hover:bg-indigo-50
                            hover:text-indigo-600
                          "
                        >
                          {item}
                        </button>

                      )
                    )}

                </div>

              </div>

            )}

          </>

        )}

      </div>

    </main>
  );
}