import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FaStar,
  FaAward,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL;

export default function TopRatedProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndexes, setActiveIndexes] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  /* =====================================================
     FETCH TOP RATED
  ===================================================== */
  const fetchTopRated = useCallback(async () => {

    const url =
      `${BACKEND_URL}/api/products/top-rated`;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(url, {
        method: "GET",

        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `HTTP ${response.status}`
        );
      }

      const list = Array.isArray(data?.products)
        ? data.products
        : [];

      setProducts(list);
    } catch (error) {

      setError(
        error?.message ||
          "Failed to load top rated products"
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const changeImage = (
    event,
    productId,
    imageCount,
    direction
  ) => {
    event.stopPropagation();

    if (imageCount <= 1) return;

    setActiveIndexes((previous) => {
      const current = previous[productId] || 0;

      return {
        ...previous,
        [productId]:
          (current + direction + imageCount) %
          imageCount,
      };
    });
  };

  const goToImage = (
    event,
    productId,
    index
  ) => {
    event.stopPropagation();

    setActiveIndexes((previous) => ({
      ...previous,
      [productId]: index,
    }));
  };

  const autoSwipe = useCallback((productId, imageCount) => {
    if (imageCount <= 1) return;

    setActiveIndexes((previous) => {
      const current = previous[productId] || 0;

      return {
        ...previous,
        [productId]:
          (current + 1) % imageCount,
      };
    });
  }, []);

  useEffect(() => {
    if (!hoveredCard) return;

    const product = products.find(
      (item) => item._id === hoveredCard
    );

    if (!product) return;

    const images = getImages(product);

    if (images.length <= 1) return;

    const timer = setInterval(() => {
      autoSwipe(product._id, images.length);
    }, 1400);

    return () => clearInterval(timer);
  }, [hoveredCard, products, autoSwipe]);

  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {

    fetchTopRated();

    return () => {
    };
  }, [fetchTopRated]);

  /* =====================================================
     IMAGE
  ===================================================== */

  const getImages = (product) => {
    const images = [
      product?.media?.thumbnail,
      ...(Array.isArray(product?.media?.images)
        ? product.media.images
        : []),
      ...(Array.isArray(product?.variants)
        ? product.variants.flatMap((variant) =>
            Array.isArray(variant?.images)
              ? variant.images
              : []
          )
        : []),
    ].filter(Boolean);

    const uniqueImages = [...new Set(images)];

    return uniqueImages.length
      ? uniqueImages
      : [
          "https://via.placeholder.com/500x500?text=Product",
        ];
  };

  /* =====================================================
     ACTIVE VARIANT
  ===================================================== */

  const getVariant = (product) => {
    if (
      !Array.isArray(product?.variants) ||
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
    const variant = getVariant(product);

    return Number(
      variant?.price || 0
    );
  };

  /* =====================================================
     ORIGINAL PRICE
  ===================================================== */

  const getOriginalPrice = (product) => {
    const variant = getVariant(product);

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

        <div className="
          flex
          items-center
          justify-between
          mb-6
        ">
          <h2 className="
            text-xl
            sm:text-3xl
            font-bold
            flex
            items-center
            gap-2
          ">
            <FaAward className="text-indigo-500" />
            Top Rated
          </h2>
        </div>

        <div className="
          grid
          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-4
          gap-1.5
          sm:gap-3
        ">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="
                h-72
                rounded-2xl
                bg-gray-100
                animate-pulse
              "
            />
          ))}
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

          <FaAward
            className="mx-auto text-indigo-400 mb-3"
            size={30}
          />

          <h2 className="text-xl font-bold">
            Top Rated Products
          </h2>

          <p className="text-slate-500 mt-2">
            {error}
          </p>

          <button
            onClick={fetchTopRated}
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

  return (
    <>
      <style>{`
        .tr-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
        }

        .tr-glow {
          position: absolute;
          inset: 0 5% auto;
          height: 180px;
          border-radius: 999px;
          background: radial-gradient(
            ellipse,
            rgba(79,70,229,.07),
            transparent 68%
          );
          filter: blur(30px);
          pointer-events: none;
        }

        .tr-line {
          width: 42px;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg,#4f46e5,#6366f1);
        }

        .tr-card {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(79,70,229,.12);
          border-radius: 24px;
          background: rgba(255,255,255,.93);
          backdrop-filter: blur(16px);
          box-shadow: 0 8px 28px rgba(15,23,42,.045);
          transition:
            transform .32s cubic-bezier(.34,1.2,.64,1),
            box-shadow .28s ease,
            border-color .25s ease;
        }

        .tr-card::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 45;
          pointer-events: none;
          border-radius: inherit;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.8);
        }

        .tr-card:hover {
          transform: translateY(-7px) scale(1.012);
          border-color: rgba(79,70,229,.24);
          box-shadow:
            0 22px 52px rgba(79,70,229,.12),
            0 5px 18px rgba(0,0,0,.05);
        }

        .tr-track {
          display: flex;
          width: 100%;
          height: 100%;
          will-change: transform;
          transition: transform .42s cubic-bezier(.22,1,.36,1);
          touch-action: pan-y;
        }

        .tr-slide {
          flex: 0 0 100%;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(
              circle at 50% 15%,
              rgba(79,70,229,.08),
              transparent 52%
            ),
            linear-gradient(145deg,#f8faff,#eef2ff);
        }

        .tr-slide img {
          width: 100%;
          height: 100%;
          padding: 8px;
          object-fit: contain;
          user-select: none;
          -webkit-user-drag: none;
          transition: transform .5s cubic-bezier(.22,1,.36,1);
        }

        .tr-card:hover .tr-slide img {
          transform: scale(1.07);
        }

        .tr-badge {
          position: absolute;
          top: 11px;
          left: 11px;
          z-index: 20;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border: 1px solid rgba(255,255,255,.28);
          border-radius: 999px;
          background: linear-gradient(135deg,#4f46e5,#6366f1);
          color: white;
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: .05em;
          text-transform: uppercase;
          box-shadow: 0 5px 14px rgba(79,70,229,.24);
        }

        .tr-discount {
          position: absolute;
          top: 11px;
          right: 11px;
          z-index: 21;
          display: inline-flex;
          align-items: center;
          padding: 5px 9px;
          border: 1px solid rgba(255,255,255,.35);
          border-radius: 999px;
          background: #10b981;
          color: white;
          font-size: 9px;
          font-weight: 800;
          box-shadow: 0 6px 15px rgba(16,185,129,.25);
          transition: transform .2s ease;
        }

        .tr-card:hover .tr-discount {
          transform: scale(1.04) translateY(-1px);
        }

        .tr-arrow {
          position: absolute;
          top: 50%;
          z-index: 28;
          width: 31px;
          height: 31px;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(79,70,229,.16);
          border-radius: 50%;
          background: rgba(255,255,255,.94);
          color: #4338ca;
          box-shadow: 0 3px 12px rgba(0,0,0,.12);
          cursor: pointer;
          opacity: 0;
          transition: .2s;
        }

        .tr-card:hover .tr-arrow {
          opacity: 1;
        }

        .tr-arrow:hover {
          background: #fff;
          transform: translateY(-50%) scale(1.08);
        }

        .tr-left { left: 9px; }
        .tr-right { right: 9px; }

        .tr-dots {
          position: absolute;
          left: 50%;
          bottom: 10px;
          z-index: 28;
          display: flex;
          gap: 4px;
          transform: translateX(-50%);
          padding: 4px 7px;
          border-radius: 999px;
          background: rgba(255,255,255,.86);
          backdrop-filter: blur(8px);
        }

        .tr-dot {
          width: 5px;
          height: 5px;
          padding: 0;
          border: 0;
          border-radius: 999px;
          background: #cbd5e1;
          cursor: pointer;
          transition: .2s;
        }

        .tr-dot.active {
          width: 14px;
          background: #4f46e5;
        }

        .tr-count {
          position: absolute;
          right: 10px;
          bottom: 10px;
          z-index: 28;
          padding: 3px 7px;
          border-radius: 7px;
          background: rgba(15,14,42,.55);
          color: white;
          font-size: 9px;
          font-weight: 700;
          backdrop-filter: blur(7px);
        }

        .tr-overlay {
          position: absolute;
          inset: 0;
          z-index: 23;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 13px;
          background: linear-gradient(
            to bottom,
            transparent 45%,
            rgba(30,27,75,.52) 100%
          );
          opacity: 0;
          transition: opacity .26s ease;
          pointer-events: none;
        }

        .tr-card:hover .tr-overlay {
          opacity: 1;
        }

        .tr-quick {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 7px 16px;
          border: 0;
          border-radius: 999px;
          background: rgba(255,255,255,.95);
          color: #312e81;
          font-size: 11.5px;
          font-weight: 700;
          box-shadow: 0 5px 18px rgba(0,0,0,.14);
          transform: translateY(9px);
          opacity: 0;
          cursor: pointer;
          transition: transform .26s .04s, opacity .26s .04s;
          pointer-events: none;
        }

        .tr-card:hover .tr-quick {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .tr-quick:hover {
          color: #4338ca;
          box-shadow: 0 8px 24px rgba(79,70,229,.16);
        }

        .tr-progress {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 36;
          height: 2px;
          overflow: hidden;
          background: rgba(255,255,255,.3);
          pointer-events: none;
        }

        .tr-progress::after {
          content: "";
          display: block;
          width: 100%;
          height: 100%;
          background: rgba(255,255,255,.95);
          transform-origin: left;
          animation: trProgress 1.4s linear infinite;
        }

        @keyframes trProgress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        .tr-price {
          background: linear-gradient(135deg,#4338ca,#4f46e5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tr-view-all {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(79,70,229,.16);
          border-radius: 999px;
          background: rgba(255,255,255,.9);
          padding: 9px 14px;
          color: #4338ca;
          font-size: 11px;
          font-weight: 700;
          box-shadow: 0 3px 12px rgba(15,23,42,.05);
          transition: .2s;
        }

        .tr-view-all:hover {
          transform: translateY(-1px);
          background: #eef2ff;
          border-color: rgba(79,70,229,.24);
          box-shadow: 0 8px 20px rgba(79,70,229,.08);
        }

        .tr-quick:focus-visible,
        .tr-arrow:focus-visible,
        .tr-dot:focus-visible,
        .tr-view-all:focus-visible {
          outline: 2px solid rgba(79,70,229,.45);
          outline-offset: 2px;
        }

        @media (max-width: 640px) {
          .tr-card {
            border-radius: 20px;
          }

          .tr-arrow {
            opacity: 1;
          }

          .tr-overlay {
            opacity: 1;
            background: linear-gradient(
              to bottom,
              transparent 52%,
              rgba(30,27,75,.30) 100%
            );
          }

          .tr-quick {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
            padding: 6px 13px;
            font-size: 10px;
          }

          .tr-card:hover {
            transform: translateY(-3px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tr-card,
          .tr-track,
          .tr-slide img,
          .tr-arrow,
          .tr-quick {
            transition: none !important;
          }
        }
      `}</style>

      <section className="tr-root mx-auto w-full max-w-7xl px-3 py-8 sm:px-5 lg:px-8">
        <div className="tr-glow" />

        <div className="relative z-10 mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-100 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 shadow-sm backdrop-blur">
              <FaAward size={10} />
              Best reviewed
            </div>

            <div className="flex items-center gap-3">
              <div className="tr-line hidden sm:block" />

              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                Top Rated Products
              </h2>
            </div>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Top customer ratings, picked for your next purchase.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="tr-view-all group"
          >
            View All
            <span className="ml-1 transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => {
            const images = getImages(product);
            const activeIdx =
              activeIndexes[product._id] || 0;

            const price = getPrice(product);
            const originalPrice =
              getOriginalPrice(product);

            const rating = Number(
              product?.rating?.average ??
                product?.rating ??
                0
            );

            const reviews = Number(
              product?.numReviews || 0
            );

            const views = Number(
              product?.analytics?.views || 0
            );

            const discount =
              originalPrice > price
                ? Math.round(
                    ((originalPrice - price) /
                      originalPrice) *
                      100
                  )
                : 0;

            return (
              <article
                key={product._id}
                className="tr-card"
                onMouseEnter={() =>
                  setHoveredCard(product._id)
                }
                onMouseLeave={() =>
                  setHoveredCard((current) =>
                    current === product._id
                      ? null
                      : current
                  )
                }
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    height:
                      "clamp(185px,22vw,235px)",
                  }}
                  onTouchStart={(event) => {
                    event.currentTarget.dataset.touchX =
                      event.touches[0].clientX;

                    setHoveredCard(product._id);
                  }}
                  onTouchEnd={(event) => {
                    const start = Number(
                      event.currentTarget.dataset.touchX || 0
                    );

                    const end =
                      event.changedTouches[0].clientX;

                    const distance = start - end;

                    if (Math.abs(distance) > 45) {
                      changeImage(
                        event,
                        product._id,
                        images.length,
                        distance > 0 ? 1 : -1
                      );
                    }

                    setHoveredCard((current) =>
                      current === product._id
                        ? null
                        : current
                    );
                  }}
                  onTouchCancel={() =>
                    setHoveredCard((current) =>
                      current === product._id
                        ? null
                        : current
                    )
                  }
                >
                  <div
                    className="tr-track"
                    style={{
                      transform: `translateX(-${
                        activeIdx * 100
                      }%)`,
                    }}
                  >
                    {images.map((image, imageIndex) => (
                      <div
                        key={`${image}-${imageIndex}`}
                        className="tr-slide"
                        onClick={() =>
                          openProduct(product)
                        }
                      >
                        <img
                          src={image}
                          alt={`${product?.title || "Product"} image ${
                            imageIndex + 1
                          }`}
                          loading="lazy"
                          draggable="false"
                        />
                      </div>
                    ))}
                  </div>

                  <span className="tr-badge">
                    <FaAward size={9} />
                    Top Rated
                  </span>

                  {discount > 0 && (
                    <span className="tr-discount">
                      {discount}% OFF
                    </span>
                  )}

                  {hoveredCard === product._id &&
                    images.length > 1 && (
                      <div
                        className="tr-progress"
                        aria-hidden="true"
                      />
                    )}

                  <div className="tr-overlay">
                    <button
                      type="button"
                      className="tr-quick"
                      onClick={(event) => {
                        event.stopPropagation();
                        openProduct(product);
                      }}
                    >
                      <FaEye size={12} />
                      Quick View
                    </button>
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="tr-arrow tr-left"
                        onClick={(event) =>
                          changeImage(
                            event,
                            product._id,
                            images.length,
                            -1
                          )
                        }
                        aria-label="Previous image"
                      >
                        <FaChevronLeft size={10} />
                      </button>

                      <button
                        type="button"
                        className="tr-arrow tr-right"
                        onClick={(event) =>
                          changeImage(
                            event,
                            product._id,
                            images.length,
                            1
                          )
                        }
                        aria-label="Next image"
                      >
                        <FaChevronRight size={10} />
                      </button>

                      <div className="tr-dots">
                        {images.map((_, imageIndex) => (
                          <button
                            key={imageIndex}
                            type="button"
                            aria-label={`Show image ${
                              imageIndex + 1
                            }`}
                            className={`tr-dot ${
                              activeIdx === imageIndex
                                ? "active"
                                : ""
                            }`}
                            onClick={(event) =>
                              goToImage(
                                event,
                                product._id,
                                imageIndex
                              )
                            }
                          />
                        ))}
                      </div>

                      <div className="tr-count">
                        {activeIdx + 1}/{images.length}
                      </div>
                    </>
                  )}
                </div>

                <div className="p-3 sm:p-4">
                  <p className="mb-1 truncate text-[9px] font-bold uppercase tracking-[0.12em] text-amber-600">
                    {product?.category?.name ||
                      "Top Rated"}
                  </p>

                  <h3
                    onClick={() =>
                      openProduct(product)
                    }
                    className="min-h-[38px] cursor-pointer line-clamp-2 text-[12.5px] font-semibold leading-[1.35] text-slate-800 transition-colors hover:text-indigo-600 sm:text-sm"
                  >
                    {product?.title || "Product"}
                  </h3>

                  <div className="mt-2 flex min-h-[18px] items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {rating > 0 ? (
                        <>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map(
                              (_, starIndex) => (
                                <FaStar
                                  key={starIndex}
                                  size={10}
                                  className={
                                    starIndex <
                                    Math.round(rating)
                                      ? "text-amber-400"
                                      : "text-slate-200"
                                  }
                                />
                              )
                            )}
                          </div>

                          <span className="ml-1 text-[10px] font-bold text-slate-600">
                            {rating.toFixed(1)}
                          </span>
                        </>
                      ) : (
                        <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-400">
                          New
                        </span>
                      )}

                      <span className="text-[9px] text-slate-400">
                        ({reviews})
                      </span>
                    </div>

                    {views > 0 && (
                      <span className="flex items-center gap-1 text-[9px] font-semibold text-slate-400">
                        <FaEye size={9} />
                        {views}
                      </span>
                    )}
                  </div>
<div className="mt-3 flex items-baseline gap-1.5 border-t border-slate-100 pt-2.5">
                    <span className="text-sm font-extrabold sm:text-base">
                      <span className="mr-0.5 text-amber-600">
                        ₹
                      </span>

                      <span className="tr-price">
                        {price.toLocaleString("en-IN")}
                      </span>
                    </span>

                    {originalPrice > price && (
                      <del className="text-[9px] font-medium text-slate-400">
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
          })}
        </div>
      </section>
    </>
  );
}