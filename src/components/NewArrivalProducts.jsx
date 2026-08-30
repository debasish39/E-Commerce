import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FaStar,
   FaMagic,
  FaEye,
} from "react-icons/fa";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL;

export default function NewArrivalProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndexes, setActiveIndexes] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  /* =====================================================
     FETCH NEW ARRIVALS
  ===================================================== */

  const fetchNewArrivals = useCallback(async () => {

    const url =
      `${BACKEND_URL}/api/products/new-arrivals`;

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
          "Failed to load new arrivals"
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

    fetchNewArrivals();

    return () => {
    };
  }, [fetchNewArrivals]);

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
            <FaMagic className="text-indigo-500" />
            New Arrivals
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

          <FaMagic
            className="mx-auto text-red-400 mb-3"
            size={30}
          />

          <h2 className="text-xl font-bold">
            New Arrivals
          </h2>

          <p className="text-red-500 mt-2">
            {error}
          </p>

          <button
            onClick={fetchNewArrivals}
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
     UI — MODERN NEW ARRIVAL PRODUCT CARD
  ===================================================== */

  return (
    <>
      <style>{`
        .na-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
        }

        .na-glow {
          position: absolute;
          inset: 0 5% auto;
          height: 180px;
          border-radius: 999px;
          background: radial-gradient(
            ellipse,
            rgba(99,102,241,.10),
            transparent 68%
          );
          filter: blur(30px);
          pointer-events: none;
        }

        .na-line {
          width: 42px;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg,#4f46e5,#7c3aed);
        }

        .na-card {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(99,102,241,.12);
          border-radius: 24px;
          background: rgba(255,255,255,.92);
          backdrop-filter: blur(16px);
          box-shadow: 0 8px 28px rgba(15,23,42,.045);
          transition:
            transform .32s cubic-bezier(.34,1.2,.64,1),
            box-shadow .28s ease,
            border-color .25s ease;
        }

        .na-card::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 45;
          pointer-events: none;
          border-radius: inherit;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.78);
        }

        .na-card:hover {
          transform: translateY(-7px) scale(1.012);
          border-color: rgba(99,102,241,.28);
          box-shadow:
            0 22px 52px rgba(79,70,229,.17),
            0 5px 18px rgba(0,0,0,.05);
        }

        .na-track {
          display: flex;
          width: 100%;
          height: 100%;
          will-change: transform;
          transition: transform .42s cubic-bezier(.22,1,.36,1);
          touch-action: pan-y;
        }

        .na-slide {
          flex: 0 0 100%;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(
              circle at 50% 15%,
              rgba(99,102,241,.10),
              transparent 52%
            ),
            linear-gradient(145deg,#f8faff,#f4f6ff);
        }

        .na-slide img {
          width: 100%;
          height: 100%;
          padding: 8px;
          object-fit: contain;
          user-select: none;
          -webkit-user-drag: none;
          transition: transform .5s cubic-bezier(.22,1,.36,1);
        }

        .na-card:hover .na-slide img {
          transform: scale(1.07);
        }

        .na-badge {
          position: absolute;
          top: 11px;
          left: 11px;
          z-index: 20;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border: 1px solid rgba(255,255,255,.25);
          border-radius: 999px;
          background: linear-gradient(135deg,#4f46e5,#7c3aed);
          color: white;
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: .05em;
          text-transform: uppercase;
          box-shadow: 0 5px 14px rgba(79,70,229,.28);
        }

        .na-discount {
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
          letter-spacing: .02em;
          box-shadow: 0 6px 15px rgba(16,185,129,.25);
          transition: transform .2s ease;
        }

        .na-card:hover .na-discount {
          transform: scale(1.04) translateY(-1px);
        }

        .na-arrow {
          position: absolute;
          top: 50%;
          z-index: 27;
          width: 31px;
          height: 31px;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(99,102,241,.18);
          border-radius: 50%;
          background: rgba(255,255,255,.93);
          color: #4f46e5;
          box-shadow: 0 3px 12px rgba(0,0,0,.12);
          cursor: pointer;
          opacity: 0;
          transition: .2s;
        }

        .na-card:hover .na-arrow {
          opacity: 1;
        }

        .na-arrow:hover {
          background: white;
          transform: translateY(-50%) scale(1.08);
        }

        .na-left { left: 9px; }
        .na-right { right: 9px; }

        .na-dots {
          position: absolute;
          left: 50%;
          bottom: 10px;
          z-index: 27;
          display: flex;
          gap: 4px;
          transform: translateX(-50%);
          padding: 4px 7px;
          border-radius: 999px;
          background: rgba(255,255,255,.86);
          backdrop-filter: blur(8px);
        }

        .na-dot {
          width: 5px;
          height: 5px;
          padding: 0;
          border: 0;
          border-radius: 999px;
          background: #cbd5e1;
          cursor: pointer;
          transition: .2s;
        }

        .na-dot.active {
          width: 14px;
          background: #4f46e5;
        }

        .na-count {
          position: absolute;
          right: 10px;
          bottom: 10px;
          z-index: 27;
          padding: 3px 7px;
          border-radius: 7px;
          background: rgba(15,14,42,.55);
          color: white;
          font-size: 9px;
          font-weight: 700;
          backdrop-filter: blur(7px);
        }

        .na-overlay {
          position: absolute;
          inset: 0;
          z-index: 22;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 13px;
          background: linear-gradient(
            to bottom,
            transparent 45%,
            rgba(20,16,60,.52) 100%
          );
          opacity: 0;
          transition: opacity .26s ease;
          pointer-events: none;
        }

        .na-card:hover .na-overlay {
          opacity: 1;
        }

        .na-quick {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 7px 16px;
          border: 0;
          border-radius: 999px;
          background: rgba(255,255,255,.95);
          color: #1e1b4b;
          font-size: 11.5px;
          font-weight: 700;
          box-shadow: 0 5px 18px rgba(0,0,0,.14);
          transform: translateY(9px);
          opacity: 0;
          cursor: pointer;
          transition: transform .26s .04s, opacity .26s .04s;
          pointer-events: none;
        }

        .na-card:hover .na-quick {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .na-quick:hover {
          color: #4f46e5;
          box-shadow: 0 8px 24px rgba(79,70,229,.18);
        }

        .na-progress {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 35;
          height: 2px;
          overflow: hidden;
          background: rgba(255,255,255,.3);
          pointer-events: none;
        }

        .na-progress::after {
          content: "";
          display: block;
          width: 100%;
          height: 100%;
          background: rgba(255,255,255,.95);
          transform-origin: left;
          animation: naProgress 1.4s linear infinite;
        }

        @keyframes naProgress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        .na-price {
          background: linear-gradient(135deg,#4f46e5,#2563eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .na-view-all {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(99,102,241,.14);
          border-radius: 999px;
          background: rgba(255,255,255,.9);
          padding: 9px 14px;
          color: #4f46e5;
          font-size: 11px;
          font-weight: 700;
          box-shadow: 0 3px 12px rgba(15,23,42,.05);
          transition: .2s;
        }

        .na-view-all:hover {
          transform: translateY(-1px);
          background: #eef2ff;
          border-color: rgba(99,102,241,.25);
          box-shadow: 0 8px 20px rgba(79,70,229,.10);
        }

        .na-quick:focus-visible,
        .na-arrow:focus-visible,
        .na-dot:focus-visible,
        .na-view-all:focus-visible {
          outline: 2px solid rgba(79,70,229,.45);
          outline-offset: 2px;
        }

        @media (max-width: 640px) {
          .na-card {
            border-radius: 20px;
          }

          .na-arrow {
            opacity: 1;
          }

          .na-overlay {
            opacity: 1;
            background: linear-gradient(
              to bottom,
              transparent 52%,
              rgba(20,16,60,.32) 100%
            );
          }

          .na-quick {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
            padding: 6px 13px;
            font-size: 10px;
          }

          .na-card:hover {
            transform: translateY(-3px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .na-card,
          .na-track,
          .na-slide img,
          .na-arrow,
          .na-quick {
            transition: none !important;
          }
        }
      `}</style>

      <section className="na-root mx-auto w-full max-w-7xl px-3 py-8 sm:px-5 lg:px-8">
        <div className="na-glow" />

        <div
          className="relative z-10 mb-6 flex items-end justify-between gap-4"
        >
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 shadow-sm backdrop-blur">
              <FaMagic size={10} />
              Fresh collection
            </div>

            <div className="flex items-center gap-3">
              <div className="na-line hidden sm:block" />

              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                New Arrivals
              </h2>
            </div>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Fresh products just added to the collection.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="na-view-all group"
          >
            View All
            <span className="ml-1 transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product, index) => {
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
                className="na-card"
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
                {/* IMAGE CAROUSEL */}
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
                    className="na-track"
                    style={{
                      transform: `translateX(-${
                        activeIdx * 100
                      }%)`,
                    }}
                  >
                    {images.map((image, imageIndex) => (
                      <div
                        key={`${image}-${imageIndex}`}
                        className="na-slide"
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

                  <span className="na-badge">
                    <FaMagic size={8} />
                    New
                  </span>

                  {discount > 0 && (
                    <span className="na-discount">
                      {discount}% OFF
                    </span>
                  )}

                  {hoveredCard === product._id &&
                    images.length > 1 && (
                      <div
                        className="na-progress"
                        aria-hidden="true"
                      />
                    )}

                  <div className="na-overlay">
                    <button
                      type="button"
                      className="na-quick"
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
                        className="na-arrow na-left"
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
                        ‹
                      </button>

                      <button
                        type="button"
                        className="na-arrow na-right"
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
                        ›
                      </button>

                      <div className="na-dots">
                        {images.map((_, imageIndex) => (
                          <button
                            key={imageIndex}
                            type="button"
                            aria-label={`Show image ${
                              imageIndex + 1
                            }`}
                            className={`na-dot ${
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

                      <div className="na-count">
                        {activeIdx + 1}/{images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-3 sm:p-4">
                  <p className="mb-1 truncate text-[9px] font-bold uppercase tracking-[0.12em] text-indigo-500">
                    {product?.category?.name ||
                      "New Arrival"}
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

                          <span className="ml-1 text-[10px] font-semibold text-slate-500">
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

                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-semibold text-indigo-500">
                      Just In
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline gap-1.5 border-t border-slate-100 pt-2.5">
                    <span className="text-sm font-extrabold sm:text-base">
                      <span className="mr-0.5 text-indigo-600">
                        ₹
                      </span>

                      <span className="na-price">
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