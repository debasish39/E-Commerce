import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const ACCENTS = [
  { from: "#2874f0", to: "#60a5fa" },
  { from: "#f43f5e", to: "#fb7185" },
  { from: "#10b981", to: "#34d399" },
  { from: "#f59e0b", to: "#fbbf24" },
  { from: "#8b5cf6", to: "#a78bfa" },
  { from: "#06b6d4", to: "#22d3ee" },
];

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  "";

export default function Category() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     FETCH CATEGORIES
  ===================================================== */

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

        const received =
          Array.isArray(data?.categories)
            ? data.categories
            : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
            ? data
            : [];

        const parents = received
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
        console.error("CATEGORY FETCH ERROR:", err);

        if (mounted) {
          setError(
            err?.message || "Unable to load categories"
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

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <section className="w-full py-4">
        <div className="px-3 sm:px-6 lg:px-8">

          {/* Header skeleton */}
          <div className="mb-3 flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="h-2 w-16 rounded-full bg-gray-200 animate-pulse" />

              <div className="h-5 w-32 rounded-md bg-gray-200 animate-pulse" />
            </div>

            <div className="h-6 w-12 rounded-full bg-gray-100 animate-pulse" />
          </div>

          {/* Category skeleton */}
          <div className="flex gap-2 overflow-hidden">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="
                  min-w-[105px]
                  rounded-xl
                  border
                  border-gray-100
                  bg-white
                  p-1.5
                "
              >
                <div
                  className="
                    aspect-square
                    rounded-lg
                    bg-gray-100
                    animate-pulse
                  "
                />

                <div
                  className="
                    mt-2
                    h-2.5
                    w-14
                    rounded
                    bg-gray-200
                    animate-pulse
                  "
                />

                <div
                  className="
                    mt-1
                    h-2
                    w-10
                    rounded
                    bg-gray-100
                    animate-pulse
                  "
                />
              </div>
            ))}
          </div>

        </div>
      </section>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <section className="px-3 py-4">
        <div
          className="
            rounded-xl
            border
            border-gray-100
            bg-white
            px-4
            py-5
            text-center
            shadow-sm
          "
        >
          <p className="text-sm font-semibold text-gray-800">
            Categories unavailable
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="
              mt-3
              rounded-full
              bg-gray-900
              px-4
              py-2
              text-xs
              font-semibold
              text-white
            "
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (!categories.length) {
    return null;
  }

  /* =====================================================
     MAIN
  ===================================================== */

  return (
    <section className="w-full py-4 sm:py-6">

      <div className="px-3 sm:px-6 lg:px-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-3 flex items-center justify-between">

          <div>
            <div className="mb-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

              <span
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-indigo-600
                "
              >
                Discover
              </span>
            </div>

            <h2
              className="
                text-base
                font-bold
                leading-tight
                tracking-tight
                text-gray-900
                sm:text-2xl
              "
            >
              Shop by category
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate("/categories")}
            className="
              flex
              items-center
              gap-0.5
              rounded-full
              px-2
              py-1
              text-[10px]
              font-semibold
              text-indigo-600
              transition
              hover:bg-indigo-50
            "
          >
            View all
            <ChevronRight size={12} />
          </button>

        </div>

        {/* =================================================
            HORIZONTAL CATEGORY SCROLL
        ================================================= */}

        <div
          className="
            flex
            gap-2
            overflow-x-auto
            overscroll-x-contain
            pb-1
            snap-x
            snap-mandatory
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
          style={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          {categories.map((item, index) => {

            const accent =
              ACCENTS[index % ACCENTS.length];

            const name =
              item?.name
                ?.replace(/-/g, " ")
                ?.trim() ||
              "Category";

            const slug =
              item?.slug ||
              item?.name
                ?.toLowerCase()
                ?.trim()
                ?.replace(/\s+/g, "-");

            return (
              <div
                key={
                  item?._id ||
                  item?.slug ||
                  item?.name
                }
                className="
                  w-[105px]
                  min-w-[105px]
                  snap-start
                  sm:w-[120px]
                  sm:min-w-[120px]
                "
              >
                <button
                  type="button"
                  onClick={() => {
                    if (slug) {
                      navigate(`/category/${slug}`);
                    }
                  }}
                  className="
                    group
                    relative
                    w-full
                    overflow-hidden
                    rounded-xl
                    border
                    border-gray-100
                    bg-white
                    p-1.5
                    text-left
                    shadow-sm
                    transition
                    active:scale-95
                    sm:hover:-translate-y-0.5
                    sm:hover:shadow-md
                  "
                >

                  {/* IMAGE */}

                  <div
                    className="
                      relative
                      aspect-square
                      overflow-hidden
                      rounded-lg
                    "
                    style={{
                      background: `linear-gradient(
                        145deg,
                        ${accent.from}0d,
                        ${accent.to}18
                      )`,
                    }}
                  >
                    {item?.image ? (
                      <img
                        src={item.image}
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
                      <div
                        className="
                          flex
                          h-full
                          items-center
                          justify-center
                          text-xl
                        "
                      >
                        🛍️
                      </div>
                    )}
                  </div>

                  {/* NAME */}

                  <div className="px-0.5 pt-1.5 pb-0.5">

                    <h3
                      className="
                        truncate
                        text-[10px]
                        font-semibold
                        capitalize
                        leading-tight
                        text-gray-800
                      "
                    >
                      {name}
                    </h3>

                    {typeof item?.productCount === "number" && (
                      <p
                        className="
                          mt-0.5
                          truncate
                          text-[8px]
                          leading-none
                          text-gray-400
                        "
                      >
                        {item.productCount}{" "}
                        {item.productCount === 1
                          ? "product"
                          : "products"}
                      </p>
                    )}

                  </div>

                  {/* ACCENT */}

                  <span
                    className="
                      absolute
                      bottom-0
                      left-2
                      right-2
                      h-[2px]
                      rounded-full
                    "
                    style={{
                      background: `linear-gradient(
                        90deg,
                        ${accent.from},
                        ${accent.to}
                      )`,
                    }}
                  />

                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

