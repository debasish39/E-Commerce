import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  "";

export default function Category() {
  const navigate = useNavigate();

  // =====================================================
  // CATEGORIES
  // =====================================================

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

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

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load categories"
          );
        }

        const received = Array.isArray(data?.categories)
          ? data.categories
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        // Only parent categories
        const parents = received
          .filter(
            (category) =>
              category?.isActive !== false &&
              (category?.parentCategory === null ||
                category?.parentCategory === undefined)
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
        console.error("CATEGORY ERROR:", err);

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

  // =====================================================
  // CATEGORY CLICK
  // =====================================================

  const handleCategoryClick = (category) => {
    if (!category?._id) {
      return;
    }

    /*
      IMPORTANT:

      Clicking a category now directly opens the
      products page.

      Example:

      /products?category=65abc123

      The Products page should read this category ID
      and fetch all products belonging to this category.
    */

    navigate(
      `/products?category=${encodeURIComponent(
        category._id
      )}`
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="w-full bg-white py-3">
        <div className="mx-auto max-w-7xl px-3">

          <div className="mb-2 h-4 w-28 animate-pulse rounded bg-gray-200" />

          <div className="flex gap-4 overflow-hidden">

            {[1, 2, 3, 4, 5, 6].map((item) => (
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
            ))}

          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

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

  // =====================================================
  // NO CATEGORIES
  // =====================================================

  if (!categories.length) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <section
      className="
        mx-auto
        w-full
        max-w-7xl
        border-b
        border-gray-100
        bg-white
        py-9
      "
    >
      <div className="px-3">

        {/* =================================================
            CATEGORY TITLE
        ================================================= */}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-gray-900">
            Shop by Category
          </h2>
        </div>

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
            WebkitOverflowScrolling: "touch",
          }}
        >

          {categories.map((category) => {
            const name =
              category?.name
                ?.replace(/-/g, " ")
                ?.trim() ||
              "Category";

            return (
              <button
                key={category?._id}
                type="button"
                onClick={() =>
                  handleCategoryClick(category)
                }
                aria-label={`View ${name} products`}
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

                {/* =================================================
                    CATEGORY IMAGE
                ================================================= */}

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-full
                    border
                    border-gray-100
                    bg-gray-50
                    transition
                    duration-200
                    group-hover:border-indigo-300
                    group-hover:bg-indigo-50
                    group-active:scale-90
                  "
                >
                  {category?.image ? (
                    <img
                      src={category.image}
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
                    <span className="text-lg">
                      🛍️
                    </span>
                  )}
                </div>

                {/* =================================================
                    CATEGORY NAME
                ================================================= */}

                <span
                  className="
                    w-full
                    truncate
                    text-center
                    text-[9px]
                    font-semibold
                    capitalize
                    text-gray-600
                    transition
                    group-hover:text-indigo-600
                  "
                >
                  {name}
                </span>

              </button>
            );
          })}

        </div>
      </div>
    </section>
  );
}

