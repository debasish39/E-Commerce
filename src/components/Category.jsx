import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Search,
  Sparkles,
} from "lucide-react";


/* =====================================================
   BACKEND URL
===================================================== */

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  "";


/* =====================================================
   CATEGORY COMPONENT
===================================================== */

export default function Category() {

  const navigate = useNavigate();


  /* ===================================================
     CATEGORIES
  =================================================== */

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* ===================================================
     FILTER
  =================================================== */

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [filterStep, setFilterStep] =
    useState("subcategory");


  /* ===================================================
     SELECTED
  =================================================== */

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [selectedSubCategory, setSelectedSubCategory] =
    useState(null);

  const [selectedBrand, setSelectedBrand] =
    useState(null);


  /* ===================================================
     SUBCATEGORY
  =================================================== */

  const [subCategories, setSubCategories] =
    useState([]);

  const [subCategoryLoading, setSubCategoryLoading] =
    useState(false);


  /* ===================================================
     BRAND
  =================================================== */

  const [brands, setBrands] =
    useState([]);

  const [brandLoading, setBrandLoading] =
    useState(false);


  /* ===================================================
     SEARCH
  =================================================== */

  const [search, setSearch] =
    useState("");


  /* ===================================================
     LOCK BODY SCROLL
  =================================================== */

  useEffect(() => {

    if (filterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };

  }, [filterOpen]);


  /* ===================================================
     FETCH CATEGORIES
  =================================================== */

  useEffect(() => {

    let mounted = true;

    const fetchCategories = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await fetch(
          `${BACKEND_URL}/api/category`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
            "Failed to load categories"
          );
        }

        const received =
          Array.isArray(data?.categories)
            ? data.categories
            : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
            ? data
            : [];

        const parents =
          received
            .filter(
              (category) =>
                category?.isActive !== false &&
                (
                  category?.parentCategory === null ||
                  category?.parentCategory === undefined
                )
            )
            .sort(
              (a, b) =>
                (a?.displayOrder || 0) -
                (b?.displayOrder || 0)
            );

        if (mounted) {
          setCategories(parents);
        }

      } catch (err) {

        console.error(
          "CATEGORY ERROR:",
          err
        );

        if (mounted) {
          setError(
            err?.message ||
            "Unable to load categories"
          );
        }

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }

    };

    fetchCategories();

    return () => {
      mounted = false;
    };

  }, []);


  /* ===================================================
     CLOSE FILTER
  =================================================== */

  const closeFilter = () => {

    setFilterOpen(false);
    setSearch("");

  };


  /* ===================================================
     CLICK CATEGORY
     
     Category itself opens filter.
  =================================================== */

  const handleCategoryClick = async (
    category
  ) => {

    if (!category?._id) {
      return;
    }

    setSelectedCategory(category);

    setSelectedSubCategory(null);

    setSelectedBrand(null);

    setSubCategories([]);

    setBrands([]);

    setSearch("");

    setFilterStep("subcategory");

    setFilterOpen(true);


    try {

      setSubCategoryLoading(true);

      const response = await fetch(
        `${BACKEND_URL}/api/category/${category._id}/subcategories`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
          "Failed to load subcategories"
        );
      }

      const received =
        Array.isArray(data?.subCategories)
          ? data.subCategories
          : Array.isArray(data?.categories)
          ? data.categories
          : Array.isArray(data?.data)
          ? data.data
          : [];

      setSubCategories(
        received.filter(
          (item) =>
            item?.isActive !== false
        )
      );

    } catch (err) {

      console.error(
        "SUBCATEGORY ERROR:",
        err
      );

      setSubCategories([]);

    } finally {

      setSubCategoryLoading(false);

    }

  };


  /* ===================================================
     CLICK SUBCATEGORY
  =================================================== */

  const handleSubCategoryClick = async (
    subCategory
  ) => {

    if (!subCategory?._id) {
      return;
    }

    setSelectedSubCategory(
      subCategory
    );

    setSelectedBrand(null);

    setBrands([]);

    setSearch("");

    setFilterStep("brand");


    try {

      setBrandLoading(true);

      /*
        IMPORTANT

        Your router is:

        router.get(
          "/brands/subcategory/:subCategoryId",
          getBrandsBySubCategory
        )

        Since brandRoutes is mounted at /api,
        the correct URL is:

        /api/brands/subcategory/:id
      */

      const response = await fetch(
        `${BACKEND_URL}/api/brands/subcategory/${subCategory._id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
          "Failed to load brands"
        );
      }

      const received =
        Array.isArray(data?.brands)
          ? data.brands
          : Array.isArray(data?.data)
          ? data.data
          : [];

      setBrands(
        received.filter(
          (brand) =>
            brand?.isActive !== false
        )
      );

    } catch (err) {

      console.error(
        "BRAND ERROR:",
        err
      );

      setBrands([]);

    } finally {

      setBrandLoading(false);

    }

  };


  /* ===================================================
     CLICK BRAND
  =================================================== */

  const handleBrandClick = (
    brand
  ) => {

    if (!brand?._id) {
      return;
    }

    setSelectedBrand(brand);

    const categoryId =
      selectedCategory?._id;

    const subCategoryId =
      selectedSubCategory?._id;

    if (
      !categoryId ||
      !subCategoryId
    ) {
      return;
    }

    closeFilter();

    navigate(
      `/products?category=${encodeURIComponent(
        categoryId
      )}&subCategory=${encodeURIComponent(
        subCategoryId
      )}&brand=${encodeURIComponent(
        brand.name
      )}`
    );

  };


  /* ===================================================
     BACK
  =================================================== */

  const handleBack = () => {

    if (
      filterStep === "brand"
    ) {

      setFilterStep(
        "subcategory"
      );

      setSelectedBrand(null);

      setSearch("");

      return;

    }

    closeFilter();

  };


  /* ===================================================
     SEARCH FILTER
  =================================================== */

  const filteredItems =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();

      const items =
        filterStep === "subcategory"
          ? subCategories
          : brands;

      if (!query) {
        return items;
      }

      return items.filter(
        (item) =>
          item?.name
            ?.toLowerCase()
            .includes(query)
      );

    }, [
      search,
      filterStep,
      subCategories,
      brands,
    ]);


  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {

    return (
      <section className="w-full py-3">

        <div className="px-3">

          <div className="mb-2 h-4 w-28 animate-pulse rounded bg-gray-200" />

          <div className="flex gap-4 overflow-hidden">

            {[1, 2, 3, 4, 5, 6].map(
              (item) => (

                <div
                  key={item}
                  className="w-[58px] min-w-[58px]"
                >

                  <div
                    className="
                      h-12
                      w-12
                      animate-pulse
                      rounded-full
                      bg-gray-200
                    "
                  />

                  <div
                    className="
                      mt-1.5
                      h-2
                      w-12
                      animate-pulse
                      rounded
                      bg-gray-200
                    "
                  />

                </div>

              )
            )}

          </div>

        </div>

      </section>
    );

  }


  /* ===================================================
     ERROR
  =================================================== */

  if (error) {

    return (
      <section className="px-3 py-4">

        <div
          className="
            rounded-xl
            bg-gray-50
            p-4
            text-center
          "
        >

          <p className="text-xs font-bold text-gray-800">
            Categories unavailable
          </p>

          <p className="mt-1 text-[10px] text-gray-500">
            {error}
          </p>

        </div>

      </section>
    );

  }


  if (!categories.length) {
    return null;
  }


  /* ===================================================
     UI
  =================================================== */

  return (
    <>
      {/* =================================================
          SMALL CATEGORY NAVIGATION
          
          Modern ecommerce style
      ================================================= */}

      <section
        className="
          w-full
          border-b
          border-gray-100
          bg-white
          py-9
        "
      >

        <div className="px-3">

 


          {/* =================================================
              HORIZONTAL CATEGORY SCROLL
          ================================================= */}

          <div
            className="
              flex
              gap-4
              overflow-x-auto
              pb-1
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
            style={{
              WebkitOverflowScrolling:
                "touch",
            }}
          >

            {categories.map(
              (category) => {

                const name =
                  category?.name
                    ?.replace(/-/g, " ")
                    ?.trim() ||
                  "Category";

                const selected =
                  selectedCategory?._id ===
                  category?._id;


                return (

                  <button
                    key={
                      category?._id
                    }
                    type="button"
                    onClick={() =>
                      handleCategoryClick(
                        category
                      )
                    }
                    className="
                      group
                      flex
                      w-[58px]
                      min-w-[58px]
                      flex-col
                      items-center
                      gap-1
                      outline-none
                    "
                  >

                    {/* =================================
                        SMALL ICON
                    ================================= */}

                    <div
                      className={`
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-full
                        border
                        bg-gray-50
                        transition
                        duration-200
                        group-active:scale-90
                        ${
                          selected
                            ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
                            : "border-gray-100"
                        }
                      `}
                    >

                      {category?.image ? (

                        <img
                          src={
                            category.image
                          }
                          alt={name}
                          loading="lazy"
                          className="
                            h-full
                            w-full
                            object-contain
                            p-1.5
                          "
                        />

                      ) : (

                        <span
                          className="
                            text-lg
                          "
                        >
                          🛍️
                        </span>

                      )}

                    </div>


                    {/* =================================
                        SMALL LABEL
                    ================================= */}

                    <span
                      className={`
                        w-full
                        truncate
                        text-center
                        text-[9px]
                        font-semibold
                        capitalize
                        ${
                          selected
                            ? "text-indigo-600"
                            : "text-gray-600"
                        }
                      `}
                    >
                      {name}
                    </span>

                  </button>

                );

              }
            )}

          </div>

        </div>

      </section>


      {/* =================================================
          BACKDROP
      ================================================= */}

      <div
        onClick={closeFilter}
        className={`
          fixed
          inset-0
          z-[100]
          bg-black/40
          backdrop-blur-[2px]
          transition-opacity
          duration-300
          ${
            filterOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />


      {/* =================================================
          BOTTOM SHEET
      ================================================= */}

      <div
        role="dialog"
        aria-modal="true"
        className={`
          fixed
          inset-x-0
          bottom-0
          z-[101]
          mx-auto
          flex
          w-full
          max-w-lg
          flex-col
          overflow-hidden
          rounded-t-[26px]
          bg-white
          shadow-[0_-10px_50px_rgba(0,0,0,0.18)]
          transition-transform
          duration-300
          ${
            filterOpen
              ? "translate-y-0"
              : "pointer-events-none translate-y-full"
          }
        `}
        style={{
          maxHeight: "85dvh",
        }}
      >

        {/* HANDLE */}

        <div
          className="
            flex
            shrink-0
            justify-center
            pt-2
          "
        >

          <div
            className="
              h-1
              w-9
              rounded-full
              bg-gray-300
            "
          />

        </div>


        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            shrink-0
            border-b
            border-gray-100
            px-4
            pb-3
            pt-2
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div
              className="
                flex
                min-w-0
                items-center
                gap-2
              "
            >

              {/* BACK */}

              <button
                type="button"
                onClick={handleBack}
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-100
                  text-gray-700
                  active:scale-90
                "
              >

                <ChevronLeft
                  size={16}
                />

              </button>


              <div className="min-w-0">

                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-widest
                    text-indigo-600
                  "
                >
                  {filterStep ===
                  "subcategory"
                    ? "Step 1"
                    : "Step 2"}
                </p>

                <h3
                  className="
                    truncate
                    text-base
                    font-extrabold
                    text-gray-900
                  "
                >
                  {filterStep ===
                  "subcategory"
                    ? "Choose subcategory"
                    : "Choose brand"}
                </h3>

              </div>

            </div>


            {/* CLOSE */}

            <button
              type="button"
              onClick={closeFilter}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                bg-gray-100
                text-gray-600
                active:scale-90
              "
            >

              <X size={16} />

            </button>

          </div>


          {/* =================================================
              SELECTED CATEGORY
          ================================================= */}

          {selectedCategory && (

            <div
              className="
                mt-2
                flex
                items-center
                gap-2
              "
            >

              <div
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  bg-indigo-50
                "
              >

                {selectedCategory.image ? (

                  <img
                    src={
                      selectedCategory.image
                    }
                    alt=""
                    className="
                      h-full
                      w-full
                      object-contain
                      p-1
                    "
                  />

                ) : (

                  <span className="text-xs">
                    🛍️
                  </span>

                )}

              </div>


              <span
                className="
                  truncate
                  text-[10px]
                  font-bold
                  capitalize
                  text-gray-600
                "
              >
                {selectedCategory.name}
              </span>


              <Check
                size={12}
                className="
                  shrink-0
                  text-indigo-600
                "
              />

            </div>

          )}


          {/* SELECTED SUBCATEGORY */}

          {selectedSubCategory && (

            <div
              className="
                mt-1
                flex
                items-center
                gap-1
              "
            >

              <ChevronRight
                size={10}
                className="text-gray-300"
              />

              <span
                className="
                  truncate
                  text-[10px]
                  font-semibold
                  capitalize
                  text-gray-500
                "
              >
                {selectedSubCategory.name}
              </span>

            </div>

          )}


          {/* SEARCH */}

          <div
            className="
              relative
              mt-2.5
            "
          >

            <Search
              size={14}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              type="text"
              placeholder={
                filterStep ===
                "subcategory"
                  ? "Search subcategory..."
                  : "Search brand..."
              }
              className="
                h-9
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                pl-9
                pr-3
                text-xs
                outline-none
                focus:border-indigo-300
                focus:bg-white
                focus:ring-2
                focus:ring-indigo-50
              "
            />

          </div>

        </div>


        {/* =================================================
            SCROLLABLE LIST
        ================================================= */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            px-3
            py-2
            pb-4
          "
          style={{
            WebkitOverflowScrolling:
              "touch",
          }}
        >

          {/* =================================================
              SUBCATEGORY
          ================================================= */}

          {filterStep ===
          "subcategory" && (

            <>
              {subCategoryLoading ? (

                <LoadingItems />

              ) : filteredItems.length ? (

                <div className="space-y-1">

                  {filteredItems.map(
                    (item) => (

                      <button
                        key={
                          item?._id
                        }
                        type="button"
                        onClick={() =>
                          handleSubCategoryClick(
                            item
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          p-2
                          text-left
                          transition
                          hover:bg-gray-50
                          active:scale-[0.99]
                        "
                      >

                        {/* SMALL IMAGE */}

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-lg
                            bg-gray-50
                          "
                        >

                          {item?.image ? (

                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                              className="
                                h-full
                                w-full
                                object-contain
                                p-1.5
                              "
                            />

                          ) : (

                            <span className="text-base">
                              🛍️
                            </span>

                          )}

                        </div>


                        <div className="min-w-0 flex-1">

                          <p
                            className="
                              truncate
                              text-xs
                              font-bold
                              capitalize
                              text-gray-800
                            "
                          >
                            {item.name}
                          </p>

                          <p
                            className="
                              text-[9px]
                              text-gray-400
                            "
                          >
                            Select subcategory
                          </p>

                        </div>


                        <ChevronRight
                          size={15}
                          className="
                            shrink-0
                            text-gray-300
                          "
                        />

                      </button>

                    )
                  )}

                </div>

              ) : (

                <EmptyState text="No subcategories found" />

              )}

            </>

          )}


          {/* =================================================
              BRANDS
          ================================================= */}

          {filterStep ===
          "brand" && (

            <>
              {brandLoading ? (

                <LoadingItems />

              ) : filteredItems.length ? (

                <div className="space-y-1">

                  {filteredItems.map(
                    (brand) => (

                      <button
                        key={
                          brand?._id
                        }
                        type="button"
                        onClick={() =>
                          handleBrandClick(
                            brand
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          p-2
                          text-left
                          transition
                          hover:bg-gray-50
                          active:scale-[0.99]
                        "
                      >

                        {/* BRAND LOGO */}

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-lg
                            border
                            border-gray-100
                            bg-white
                          "
                        >

                          {brand?.logo ? (

                            <img
                              src={
                                brand.logo
                              }
                              alt={
                                brand.name
                              }
                              className="
                                h-full
                                w-full
                                object-contain
                                p-1.5
                              "
                            />

                          ) : (

                            <span
                              className="
                                text-sm
                                font-extrabold
                                text-gray-400
                              "
                            >
                              {brand?.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "B"}
                            </span>

                          )}

                        </div>


                        {/* BRAND */}

                        <div className="min-w-0 flex-1">

                          <p
                            className="
                              truncate
                              text-xs
                              font-bold
                              text-gray-800
                            "
                          >
                            {brand?.name}
                          </p>

                          <p
                            className="
                              text-[9px]
                              text-gray-400
                            "
                          >
                            View products
                          </p>

                        </div>


                        <ChevronRight
                          size={15}
                          className="
                            shrink-0
                            text-gray-300
                          "
                        />

                      </button>

                    )
                  )}

                </div>

              ) : (

                <EmptyState text="No brands found" />

              )}

            </>

          )}

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          className="
            shrink-0
            border-t
            border-gray-100
            px-3
            py-2.5
          "
        >

          <button
            type="button"
            onClick={handleBack}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-1.5
              rounded-xl
              bg-gray-100
              py-2.5
              text-[11px]
              font-bold
              text-gray-700
              active:scale-[0.98]
            "
          >

            <ChevronLeft
              size={13}
            />

            {filterStep ===
            "brand"
              ? "Back to subcategories"
              : "Close"}

          </button>

        </div>

      </div>

    </>
  );
}


/* =====================================================
   LOADING ITEMS
===================================================== */

function LoadingItems() {

  return (

    <div className="space-y-1">

      {[1, 2, 3, 4, 5].map(
        (item) => (

          <div
            key={item}
            className="
              flex
              items-center
              gap-3
              p-2
            "
          >

            <div
              className="
                h-10
                w-10
                shrink-0
                animate-pulse
                rounded-lg
                bg-gray-100
              "
            />

            <div
              className="
                flex-1
                space-y-1.5
              "
            >

              <div
                className="
                  h-2.5
                  w-28
                  animate-pulse
                  rounded
                  bg-gray-100
                "
              />

              <div
                className="
                  h-2
                  w-20
                  animate-pulse
                  rounded
                  bg-gray-100
                "
              />

            </div>

          </div>

        )
      )}

    </div>

  );
}


/* =====================================================
   EMPTY STATE
===================================================== */

function EmptyState({
  text,
}) {

  return (

    <div
      className="
        py-10
        text-center
      "
    >

      <div
        className="
          mx-auto
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-gray-100
        "
      >

        <Search
          size={15}
          className="text-gray-400"
        />

      </div>


      <p
        className="
          mt-2
          text-xs
          font-bold
          text-gray-600
        "
      >
        {text}
      </p>

    </div>

  );
}

