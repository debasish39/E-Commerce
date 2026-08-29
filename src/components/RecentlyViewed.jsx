import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FaStar,
  FaHistory,
  FaTimes,
  FaTrash,
  FaEye,
} from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_BACKEND_URL + "/api/products";

export default function RecentlyViewed() {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
     GET RECENTLY VIEWED
  ===================================================== */

  const fetchRecentlyViewed =
    useCallback(async () => {
      console.log("");
      console.log(
        "=========================================="
      );
      console.log(
        "🔵 GET RECENTLY VIEWED"
      );

      try {
        const url =
          `${API_URL}/recently-viewed`;

        console.log(
          "🔵 URL:",
          url
        );

        console.log(
          "🔵 credentials: include"
        );

        setLoading(true);
        setError("");

        const response =
          await fetch(url, {
            method: "GET",
            credentials: "include",

            headers: {
              Accept:
                "application/json",
            },
          });

        console.log(
          "🟢 HTTP STATUS:",
          response.status
        );

        console.log(
          "🟢 RESPONSE OK:",
          response.ok
        );

        const data =
          await response.json();

        console.log(
          "🟢 API RESPONSE:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data?.message ||
              `HTTP ${response.status}`
          );
        }

        const list =
          Array.isArray(
            data?.products
          )
            ? data.products
            : [];

        console.log(
          "🟢 RECENT PRODUCTS:",
          list.length
        );

        setProducts(list);

      } catch (error) {
        console.error(
          "🔴 GET RECENTLY VIEWED ERROR:",
          error
        );

        setError(
          error?.message ||
            "Failed to load recently viewed products"
        );

        setProducts([]);

      } finally {
        setLoading(false);

        console.log(
          "=========================================="
        );
      }
    }, []);

  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    console.log(
      "🟣 RecentlyViewed mounted"
    );

    fetchRecentlyViewed();

    return () => {
      console.log(
        "🟣 RecentlyViewed unmounted"
      );
    };
  }, [fetchRecentlyViewed]);

  /* =====================================================
     REMOVE ONE
  ===================================================== */

  const removeProduct = async (
    event,
    productId
  ) => {
    event.stopPropagation();

    console.log(
      "🟠 REMOVE PRODUCT:",
      productId
    );

    try {
      const response =
        await fetch(
          `${API_URL}/recently-viewed/${productId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

      console.log(
        "🟠 DELETE STATUS:",
        response.status
      );

      const data =
        await response.json();

      console.log(
        "🟠 DELETE RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to remove product"
        );
      }

      setProducts(
        (previous) =>
          previous.filter(
            (item) =>
              item._id !== productId
          )
      );

    } catch (error) {
      console.error(
        "🔴 REMOVE ERROR:",
        error
      );
    }
  };

  /* =====================================================
     CLEAR ALL
  ===================================================== */

  const clearAll = async () => {
    console.log(
      "🔴 CLEAR ALL RECENTLY VIEWED"
    );

    try {
      const response =
        await fetch(
          `${API_URL}/recently-viewed`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

      console.log(
        "🔴 CLEAR STATUS:",
        response.status
      );

      const data =
        await response.json();

      console.log(
        "🔴 CLEAR RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to clear recently viewed"
        );
      }

      setProducts([]);

    } catch (error) {
      console.error(
        "🔴 CLEAR ERROR:",
        error
      );
    }
  };

  /* =====================================================
     IMAGE
  ===================================================== */

  const getImage = (
    product
  ) => {
    return (
      product?.media?.thumbnail ||
      product?.media?.images?.[0] ||
      product?.variants?.[0]
        ?.images?.[0] ||
      "https://via.placeholder.com/400x400?text=Product"
    );
  };

  /* =====================================================
     VARIANT
  ===================================================== */

  const getVariant = (
    product
  ) => {
    if (
      !Array.isArray(
        product?.variants
      ) ||
      !product.variants.length
    ) {
      return null;
    }

    return (
      product.variants.find(
        (variant) =>
          variant?.isActive !== false
      ) ||
      product.variants[0]
    );
  };

  /* =====================================================
     PRICE
  ===================================================== */

  const getPrice = (
    product
  ) => {
    const variant =
      getVariant(product);

    return Number(
      variant?.price || 0
    );
  };

  /* =====================================================
     ORIGINAL PRICE
  ===================================================== */

  const getOriginalPrice = (
    product
  ) => {
    const variant =
      getVariant(product);

    return Number(
      variant?.originalPrice ||
        variant?.price ||
        0
    );
  };

  /* =====================================================
     OPEN PRODUCT
  ===================================================== */

  const openProduct = (
    product
  ) => {
    console.log(
      "🟣 OPEN RECENT PRODUCT:",
      product?._id
    );

    if (!product?._id) {
      console.error(
        "❌ Product ID missing"
      );

      return;
    }

    navigate(
      `/products/${product._id}`
    );
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-2 sm:px-4 py-8">

        <h2 className="text-xl sm:text-3xl font-bold flex items-center gap-2 mb-6">
          <FaHistory className="text-indigo-500" />
          Recently Viewed
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-72 rounded-2xl bg-gray-100 animate-pulse"
              />
            )
          )}
        </div>

      </section>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8">

        <div className="rounded-2xl bg-red-50 border border-red-100 p-8 text-center">

          <FaHistory
            className="mx-auto text-red-400 mb-3"
            size={30}
          />

          <h2 className="text-xl font-bold">
            Recently Viewed
          </h2>

          <p className="text-red-500 mt-2">
            {error}
          </p>

          <button
            onClick={
              fetchRecentlyViewed
            }
            className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold"
          >
            Try Again
          </button>

        </div>

      </section>
    );
  }

  /* =====================================================
     EMPTY
  ===================================================== */

  if (!products.length) {
    return null;
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <section className="max-w-7xl mx-auto px-1.5 sm:px-4 py-8">

      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-xl sm:text-3xl font-bold flex items-center gap-2">
            <FaHistory className="text-indigo-500" />
            Recently Viewed
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Products you recently viewed
          </p>
        </div>

        <button
          onClick={clearAll}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-red-500"
        >
          <FaTrash size={11} />
          Clear All
        </button>

      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3">

        {products.map(
          (product) => {
            const price =
              getPrice(product);

            const originalPrice =
              getOriginalPrice(
                product
              );

            const rating =
              Number(
                product?.rating || 0
              );

            return (
              <article
                key={product._id}
                onClick={() =>
                  openProduct(
                    product
                  )
                }
                className="
                  group
                  relative
                  bg-white
                  rounded-2xl
                  border
                  border-gray-100
                  overflow-hidden
                  cursor-pointer
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                  bg-gradient-to-br
                  from-white
                  via-blue-50
                  to-indigo-50
                "
              >

                {/* REMOVE */}

                <button
                  type="button"
                  onClick={(event) =>
                    removeProduct(
                      event,
                      product._id
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-3
                    z-30
                    w-7
                    h-7
                    rounded-full
                    bg-white
                    shadow-md
                    flex
                    items-center
                    justify-center
                    text-gray-400
                    hover:text-red-500
                  "
                >
                  <FaTimes size={11} />
                </button>

                {/* IMAGE */}

                <div className="
                  relative
                  h-[160px]
                  sm:h-[200px]
                  flex
                  items-center
                  justify-center
                  p-4
                ">

                  <img
                    src={getImage(
                      product
                    )}
                    alt={
                      product.title
                    }
                    className="
                      max-h-[140px]
                      sm:max-h-[170px]
                      max-w-full
                      object-contain
                      transition-transform
                      duration-500
                      group-hover:scale-110
                    "
                  />

                  <span className="
                    absolute
                    left-3
                    top-3
                    flex
                    items-center
                    gap-1
                    bg-indigo-600
                    text-white
                    text-[9px]
                    sm:text-[10px]
                    font-bold
                    px-2
                    py-1
                    rounded-full
                  ">
                    <FaEye size={9} />
                    Viewed
                  </span>

                </div>

                {/* CONTENT */}

                <div className="p-3 sm:p-4">

                  <p className="
                    text-[9px]
                    sm:text-xs
                    uppercase
                    tracking-wide
                    font-medium
                    text-indigo-500
                    mb-1
                  ">
                    {product?.category
                      ?.name ||
                      "Product"}
                  </p>

                  <h3 className="
                    text-sm
                    sm:text-base
                    font-semibold
                    text-gray-800
                    line-clamp-2
                    min-h-[40px]
                    group-hover:text-indigo-600
                  ">
                    {product.title}
                  </h3>

                  <div className="flex items-center gap-1 mt-2">

                    <FaStar
                      className="text-yellow-400"
                      size={12}
                    />

                    <span className="text-xs font-semibold">
                      {rating > 0
                        ? rating.toFixed(1)
                        : "New"}
                    </span>

                    <span className="text-[10px] text-gray-400">
                      (
                      {product?.numReviews ||
                        0}
                      )
                    </span>

                  </div>

                  <div className="flex items-center gap-2 mt-3">

                    <span className="text-base sm:text-lg font-bold">
                      ₹
                      {price.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    {originalPrice >
                      price && (
                      <del className="text-[10px] sm:text-xs text-gray-400">
                        ₹
                        {originalPrice.toLocaleString(
                          "en-IN"
                        )}
                      </del>
                    )}

                  </div>

                </div>

              </article>
            );
          }
        )}

      </div>
    </section>
  );
}