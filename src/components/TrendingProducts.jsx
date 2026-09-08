import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FaStar,
  FaFire,
  FaEye,
} from "react-icons/fa";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL;

export default function TrendingProducts() {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
     FETCH TRENDING PRODUCTS
  ===================================================== */

  const fetchTrendingProducts =
    useCallback(async () => {


const url =
        `${BACKEND_URL}/api/products/trending`;
try {
        setLoading(true);
        setError("");

        const response =
          await fetch(url, {
            method: "GET",

            headers: {
              Accept:
                "application/json",
            },
          });

const data =
          await response.json();
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

setProducts(list);

      } catch (error) {
setError(
          error?.message ||
            "Failed to load trending products"
        );

        setProducts([]);

      } finally {
        setLoading(false);

}
    }, []);

  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
fetchTrendingProducts();

    return () => {
};
  }, [fetchTrendingProducts]);

  /* =====================================================
     IMAGE
  ===================================================== */

  const getImage = (product) => {
    return (
      product?.media?.thumbnail ||
      product?.media?.images?.[0] ||
      product?.variants?.[0]
        ?.images?.[0] ||
      "https://via.placeholder.com/400x400?text=Product"
    );
  };

  /* =====================================================
     ACTIVE VARIANT
  ===================================================== */

  const getVariant = (product) => {
    if (
      !Array.isArray(
        product?.variants
      ) ||
      product.variants.length === 0
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

  const getPrice = (product) => {
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

  const openProduct = (product) => {
if (!product?._id) {
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
      <section className="max-w-7xl mx-auto px-1.5 sm:px-4 py-8">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-xl sm:text-3xl font-bold flex items-center gap-2">
            <FaFire className="text-orange-500" />
            Trending Now
          </h2>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3">

          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="
                  h-72
                  rounded-2xl
                  bg-gray-100
                  animate-pulse
                "
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

        <div className="
          rounded-2xl
          border
          border-red-100
          bg-red-50
          p-8
          text-center
        ">

          <FaFire
            className="mx-auto text-red-400 mb-3"
            size={30}
          />

          <h2 className="text-xl font-bold">
            Trending Products
          </h2>

          <p className="text-red-500 mt-2">
            {error}
          </p>

          <button
            onClick={
              fetchTrendingProducts
            }
            className="
              mt-5
              px-5
              py-2.5
              rounded-xl
              bg-indigo-600
              text-white
              font-semibold
            "
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
    <>
      <style>{`
        .tp-root {
          position: relative;
          width: 100%;
        }

        .tp-scroll {
          display: flex;
          gap: 12px;
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 4px 3px 10px;
          scroll-snap-type: x proximity;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .tp-scroll::-webkit-scrollbar {
          display: none;
        }

        .tp-item {
          flex: 0 0 190px;
          width: 190px;
          min-width: 190px;
          scroll-snap-align: start;
        }

        .tp-card {
          position: relative;
          overflow: hidden;
          height: 100%;
          border: 1px solid rgba(15, 23, 42, .08);
          border-radius: 20px;
          background: rgba(255, 255, 255, .96);
          box-shadow: 0 7px 24px rgba(15, 23, 42, .055);
          cursor: pointer;
          transition:
            transform .28s cubic-bezier(.34,1.2,.64,1),
            box-shadow .28s ease,
            border-color .2s ease;
        }

        .tp-card:hover {
          transform: translateY(-5px);
          border-color: rgba(249, 115, 22, .2);
          box-shadow: 0 16px 36px rgba(15, 23, 42, .10);
        }

        .tp-image-wrap {
          position: relative;
          height: clamp(135px, 16vw, 175px);
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 15%, rgba(249, 115, 22, .08), transparent 52%),
            linear-gradient(145deg, #fffaf5, #f8fafc);
        }

        .tp-image {
          width: 100%;
          height: 100%;
          padding: 9px;
          object-fit: contain;
          user-select: none;
          -webkit-user-drag: none;
          transition: transform .45s cubic-bezier(.22,1,.36,1);
        }

        .tp-card:hover .tp-image {
          transform: scale(1.06);
        }

        .tp-hot {
          position: absolute;
          top: 9px;
          left: 9px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 8px;
          border: 1px solid rgba(255,255,255,.35);
          border-radius: 999px;
          background: linear-gradient(135deg, #f97316, #ef4444);
          color: #fff;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .05em;
          box-shadow: 0 5px 14px rgba(239, 68, 68, .2);
        }

        .tp-discount {
          position: absolute;
          right: 9px;
          bottom: 9px;
          z-index: 2;
          padding: 4px 7px;
          border-radius: 7px;
          background: rgba(22, 163, 74, .92);
          color: #fff;
          font-size: 8px;
          font-weight: 800;
          backdrop-filter: blur(7px);
        }

        .tp-content {
          padding: 11px 12px 12px;
        }

        .tp-category {
          margin-bottom: 4px;
          overflow: hidden;
          color: #ea580c;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .tp-title {
          min-height: 34px;
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          color: #1e293b;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.4;
          transition: color .2s ease;
        }

        .tp-card:hover .tp-title {
          color: #ea580c;
        }

        .tp-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          min-height: 18px;
          margin-top: 7px;
        }

        .tp-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          min-width: 0;
        }

        .tp-rating-text {
          color: #475569;
          font-size: 9px;
          font-weight: 800;
        }

        .tp-reviews {
          color: #94a3b8;
          font-size: 8px;
        }

        .tp-views {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #94a3b8;
          font-size: 8px;
          font-weight: 700;
          white-space: nowrap;
        }

        .tp-price-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #f1f5f9;
        }

        .tp-price {
          font-size: 14px;
          font-weight: 900;
          color: #ea580c;
        }

        .tp-original {
          color: #94a3b8;
          font-size: 8px;
          font-weight: 600;
        }

        .tp-view-all {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          border: 1px solid rgba(249,115,22,.14);
          border-radius: 999px;
          padding: 8px 12px;
          background: rgba(255,255,255,.9);
          color: #ea580c;
          font-size: 10px;
          font-weight: 800;
          box-shadow: 0 3px 12px rgba(15,23,42,.045);
          transition: .2s ease;
        }

        .tp-view-all:hover {
          transform: translateY(-1px);
          background: #fff7ed;
          border-color: rgba(249,115,22,.24);
        }

        @media (max-width: 640px) {
          .tp-item {
            flex-basis: 165px;
            width: 165px;
            min-width: 165px;
          }

          .tp-card {
            border-radius: 17px;
          }

          .tp-content {
            padding: 10px;
          }

          .tp-card:hover {
            transform: translateY(-2px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tp-card,
          .tp-image {
            transition: none !important;
          }

          .tp-scroll {
            scroll-behavior: auto;
          }
        }
      `}</style>

      <section className="tp-root mx-auto w-full max-w-7xl px-3 py-7 sm:px-5 lg:px-8">
        <div className="relative z-10 mb-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50/80 px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-wider text-orange-600">
              <FaFire size={9} />
              Hot picks
            </div>

            <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-500 sm:h-9 sm:w-9">
                <FaFire size={15} />
              </span>
              Trending Now
            </h2>

            <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
              Popular products shoppers are checking out right now.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="tp-view-all shrink-0"
          >
            View All
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="tp-scroll">
          {products.map((product) => {
            const price = getPrice(product);
            const originalPrice = getOriginalPrice(product);

            const rating = Number(
              product?.rating?.average ??
                product?.rating ??
                0
            );

            const views = Number(
              product?.analytics?.views || 0
            );

            const discount =
              originalPrice > price && originalPrice > 0
                ? Math.round(
                    ((originalPrice - price) / originalPrice) * 100
                  )
                : 0;

            return (
              <article
                key={product._id}
                className="tp-item"
              >
                <div
                  className="tp-card"
                  onClick={() => openProduct(product)}
                >
                  <div className="tp-image-wrap">
                    <img
                      src={getImage(product)}
                      alt={product?.title || "Product"}
                      className="tp-image"
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                    />

                    <span className="tp-hot">
                      <FaFire size={8} />
                      HOT
                    </span>

                    {discount > 0 && (
                      <span className="tp-discount">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="tp-content">
                    <p className="tp-category">
                      {product?.category?.name || "Trending"}
                    </p>

                    <h3 className="tp-title">
                      {product?.title || "Product"}
                    </h3>

                    <div className="tp-meta">
                      <div className="tp-rating">
                        <FaStar className="text-amber-400" size={9} />

                        <span className="tp-rating-text">
                          {rating > 0 ? rating.toFixed(1) : "New"}
                        </span>

                        <span className="tp-reviews">
                          ({product?.numReviews || 0})
                        </span>
                      </div>

                      {views > 0 && (
                        <span
                          className="tp-views"
                          title={`${views.toLocaleString("en-IN")} views`}
                        >
                          <FaEye size={9} />
                          {views.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    <div className="tp-price-row">
                      <span className="tp-price">
                        ₹{price.toLocaleString("en-IN")}
                      </span>

                      {originalPrice > price && (
                        <del className="tp-original">
                          ₹{originalPrice.toLocaleString("en-IN")}
                        </del>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
