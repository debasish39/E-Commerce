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
    <section className="relative mx-auto w-full max-w-7xl overflow-hidden px-3 py-7 sm:px-5 lg:px-8">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-52 w-52 rounded-full bg-orange-400/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-90px] top-10 h-60 w-60 rounded-full bg-rose-400/10 blur-3xl"
      />

      {/* HEADER */}
      <div className="relative z-10 mb-5 flex items-end justify-between gap-3">
        <div className="min-w-0">
          {/* Hot picks badge */}
          <div className="trending-skeleton-shimmer mb-2 h-6 w-24 rounded-full" />

          {/* Title */}
          <div className="trending-skeleton-shimmer h-8 w-44 rounded-xl sm:h-9 sm:w-52" />

          {/* Description */}
          <div className="trending-skeleton-shimmer mt-2 h-3.5 w-64 rounded-md sm:w-80" />
        </div>

        {/* View All */}
        <div className="trending-skeleton-shimmer h-9 w-20 shrink-0 rounded-full" />
      </div>

      {/* HORIZONTAL PRODUCT SCROLLER */}
      <div className="relative z-10 flex w-full gap-3 overflow-hidden pb-2">
        {[1, 2, 3, 4, 5].map((item) => (
          <article
            key={item}
            className="
              trending-skeleton-card
              relative
              w-[165px]
              min-w-[165px]
              overflow-hidden
              rounded-[17px]
              border
              border-slate-200/70
              bg-white/90
              shadow-[0_8px_28px_rgba(15,23,42,0.055)]
              backdrop-blur-sm
              sm:w-[190px]
              sm:min-w-[190px]
              sm:rounded-[20px]
            "
          >
            {/* Card edge glow */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -inset-px
                rounded-[inherit]
                bg-gradient-to-r
                from-transparent
                via-orange-200/30
                to-transparent
                opacity-70
                blur-[1px]
              "
            />

            {/* IMAGE */}
            <div
              className="
                relative
                h-[150px]
                overflow-hidden
                bg-gradient-to-br
                from-orange-50/70
                via-slate-50
                to-slate-100
                sm:h-[175px]
              "
            >
              {/* Main shimmer */}
              <div className="trending-skeleton-shimmer absolute inset-0" />

              {/* Fake product image */}
              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  h-24
                  w-24
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-2xl
                  bg-white/60
                  shadow-[0_0_50px_rgba(249,115,22,0.12)]
                  backdrop-blur-sm
                  sm:h-28
                  sm:w-28
                "
              />

              {/* Fake HOT badge */}
              <div
                className="
                  trending-skeleton-shimmer
                  absolute
                  left-2.5
                  top-2.5
                  h-5
                  w-14
                  rounded-full
                "
              />

              {/* Fake discount badge */}
              <div
                className="
                  trending-skeleton-shimmer
                  absolute
                  bottom-2.5
                  right-2.5
                  h-5
                  w-14
                  rounded-md
                "
              />
            </div>

            {/* CONTENT */}
            <div className="relative p-2.5 sm:p-3">
              {/* Category */}
              <div className="trending-skeleton-shimmer mb-2 h-2.5 w-16 rounded-full" />

              {/* Product title */}
              <div className="min-h-[34px] space-y-1.5">
                <div className="trending-skeleton-shimmer h-3.5 w-full rounded-md" />
                <div className="trending-skeleton-shimmer h-3.5 w-3/4 rounded-md" />
              </div>

              {/* Rating + Views */}
              <div className="mt-2 flex min-h-[18px] items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1">
                  {/* Star */}
                  <div className="trending-skeleton-shimmer h-2.5 w-2.5 rounded-sm" />

                  {/* Rating */}
                  <div className="trending-skeleton-shimmer h-2.5 w-7 rounded-full" />

                  {/* Reviews */}
                  <div className="trending-skeleton-shimmer h-2.5 w-8 rounded-full" />
                </div>

                {/* Views */}
                <div className="trending-skeleton-shimmer h-2.5 w-10 rounded-full" />
              </div>

              {/* Price */}
              <div className="mt-2 flex items-baseline gap-1.5 border-t border-slate-100 pt-2">
                <div className="trending-skeleton-shimmer h-4 w-16 rounded-md" />
                <div className="trending-skeleton-shimmer h-2.5 w-12 rounded-md" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* SHIMMER + GLOW */}
      <style>{`
        .trending-skeleton-shimmer {
          position: relative;
          overflow: hidden;

          background: linear-gradient(
            110deg,
            #f1f5f9 8%,
            #f8fafc 18%,
            #ffedd5 30%,
            #f8fafc 42%,
            #eef2f7 58%
          );

          background-size: 250% 100%;

          animation:
            trendingSkeletonShimmer 1.8s ease-in-out infinite;

          box-shadow:
            inset 0 0 14px rgba(255, 255, 255, 0.55),
            0 0 14px rgba(249, 115, 22, 0.025);
        }

        .trending-skeleton-shimmer::after {
          content: "";

          position: absolute;
          inset: 0;

          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.25) 28%,
            rgba(255, 255, 255, 0.85) 50%,
            rgba(253, 186, 116, 0.22) 62%,
            transparent 100%
          );

          transform: translateX(-120%);

          animation:
            trendingSkeletonGlow 2.25s ease-in-out infinite;
        }

        @keyframes trendingSkeletonShimmer {
          0% {
            background-position: 100% 0;
          }

          50% {
            background-position: 0% 0;
          }

          100% {
            background-position: -100% 0;
          }
        }

        @keyframes trendingSkeletonGlow {
          0% {
            transform: translateX(-120%);
          }

          55%,
          100% {
            transform: translateX(120%);
          }
        }

        @media (max-width: 640px) {
          .trending-skeleton-shimmer {
            background-size: 200% 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .trending-skeleton-shimmer,
          .trending-skeleton-shimmer::after {
            animation: none !important;
          }
        }
      `}</style>
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
