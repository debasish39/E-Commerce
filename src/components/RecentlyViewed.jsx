import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaHistory,
  FaEye,
} from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";

const API_URL =
  import.meta.env.VITE_BACKEND_URL + "/api/products";

export default function RecentlyViewed() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndexes, setActiveIndexes] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  const fetchRecentlyViewed = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/recently-viewed`,
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
          data?.message || `HTTP ${response.status}`
        );
      }

      setProducts(
        Array.isArray(data?.products)
          ? data.products
          : []
      );
    } catch (err) {
      setError(
        err?.message ||
        "Failed to load recently viewed products"
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentlyViewed();
  }, [fetchRecentlyViewed]);

  const getImages = useCallback((product) => {
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

    const unique = [...new Set(images)];

    return unique.length
      ? unique
      : [
        "https://via.placeholder.com/500x500?text=Product",
      ];
  }, []);

  const getVariant = useCallback((product) => {
    if (
      !Array.isArray(product?.variants) ||
      !product.variants.length
    ) {
      return null;
    }

    return (
      product.variants.find(
        (variant) => variant?.isActive !== false
      ) || product.variants[0]
    );
  }, []);

  const getPrice = useCallback(
    (product) =>
      Number(getVariant(product)?.price || 0),
    [getVariant]
  );

  const getOriginalPrice = useCallback(
    (product) =>
      Number(
        getVariant(product)?.originalPrice ||
        getVariant(product)?.price ||
        0
      ),
    [getVariant]
  );

  const openProduct = (product) => {
    if (!product?._id) return;
    navigate(`/products/${product._id}`);
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
  }, [
    hoveredCard,
    products,
    getImages,
    autoSwipe,
  ]);

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-3 py-8 sm:px-5 lg:px-8">
        <div className="mb-6">
          <div className="mb-2 h-6 w-28 animate-pulse rounded-full bg-slate-200" />
          <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-100" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-[22px] border border-slate-100 bg-white"
            >
              <div className="h-52 animate-pulse bg-slate-100" />
              <div className="space-y-3 p-4">
                <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                <div className="h-5 w-24 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-[22px] border border-red-100 bg-red-50 p-8 text-center">
          <FaHistory className="mx-auto text-red-400" size={28} />
          <h2 className="mt-3 text-xl font-bold text-slate-900">
            Recently Viewed
          </h2>
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
          <button
            type="button"
            onClick={fetchRecentlyViewed}
            className="mt-5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-600"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <>
      <style>{`
        .rv-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .rv-card {
          position: relative;
          background: rgba(255,255,255,.90);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(99,102,241,.12);
          border-radius: 22px;
          overflow: hidden;
          transition:
            transform .32s cubic-bezier(.34,1.2,.64,1),
            box-shadow .28s ease,
            border-color .25s ease;
        }

        .rv-card:hover {
          transform: translateY(-7px) scale(1.012);
          box-shadow:
            0 22px 52px rgba(79,70,229,.17),
            0 5px 18px rgba(0,0,0,.05);
          border-color: rgba(99,102,241,.28);
        }

        .rv-track {
          display: flex;
          width: 100%;
          height: 100%;
          will-change: transform;
          transition: transform .42s cubic-bezier(.22,1,.36,1);
          touch-action: pan-y;
        }

        .rv-slide {
          flex: 0 0 100%;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8faff;
        }

        .rv-slide img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          user-select: none;
          -webkit-user-drag: none;
          transition: transform .5s cubic-bezier(.22,1,.36,1);
        }

        .rv-card:hover .rv-slide img {
          transform: scale(1.07);
        }

        .rv-overlay {
          position: absolute;
          inset: 0;
          z-index: 18;
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

        .rv-card:hover .rv-overlay {
          opacity: 1;
        }

        .rv-quick-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: 0;
          border-radius: 999px;
          padding: 7px 16px;
          background: rgba(255,255,255,.94);
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

        .rv-card:hover .rv-quick-btn {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .rv-quick-btn:hover {
          background: #fff;
          color: #4f46e5;
        }

        .rv-auto-progress {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 28;
          height: 2px;
          overflow: hidden;
          background: rgba(255,255,255,.30);
          pointer-events: none;
        }

        .rv-auto-progress::after {
          content: "";
          display: block;
          width: 100%;
          height: 100%;
          transform-origin: left;
          background: rgba(255,255,255,.92);
          animation: rvProgress 1.4s linear infinite;
        }

        @keyframes rvProgress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        .rv-arrow {
          position: absolute;
          top: 50%;
          z-index: 25;
          width: 31px;
          height: 31px;
          transform: translateY(-50%);
          border: 1px solid rgba(99,102,241,.18);
          border-radius: 50%;
          background: rgba(255,255,255,.92);
          color: #4f46e5;
          box-shadow: 0 3px 12px rgba(0,0,0,.12);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: .2s;
        }

        .rv-card:hover .rv-arrow {
          opacity: 1;
        }

        .rv-arrow:hover {
          background: #fff;
          transform: translateY(-50%) scale(1.08);
        }

        .rv-left { left: 9px; }
        .rv-right { right: 9px; }

  
/* =========================================
   SIMPLE MODERN IMAGE DOTS
========================================= */

.rv-dots {
  position: absolute;
  left: 50%;
  bottom: 14px;
  z-index: 20;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  transform: translateX(-50%);
}

.rv-dot {
  width: 5px;
  height: 5px;

  padding: 0;
  border: 0;
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.55);

  cursor: pointer;

  transition:
    width 0.22s ease,
    background 0.22s ease,
    transform 0.22s ease;
}

.rv-dot.active {
  width: 20px;
  height: 2px;

  border-radius: 3px;

  background: #5046e4;

  box-shadow: 0 0 7px rgba(80, 70, 228, 0.35);
}

.rv-dot:hover {
  background: rgba(80, 70, 228, 0.75);
}

.rv-dot:focus-visible {
  outline: 2px solid #5046e4;
  outline-offset: 3px;
}

/* Mobile */

@media (max-width: 640px) {
  .rv-dots {
    bottom: 10px;
    gap: 4px;
  }

  .rv-dot {
    width: 5px;
    height: 5px;
  }

  .rv-dot.active {
    width: 16px;
    height: 5px;
  }
}

        .rv-badge {
          position: absolute;
          top: 11px;
          left: 11px;
          z-index: 15;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 9px;
          border-radius: 999px;
          background: linear-gradient(135deg,#4f46e5,#2563eb);
          color: white;
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: .04em;
          text-transform: uppercase;
          box-shadow: 0 3px 10px rgba(79,70,229,.35);
        }

        .rv-count {
          position: absolute;
          right: 10px;
          bottom: 10px;
          z-index: 15;
          padding: 3px 7px;
          border-radius: 7px;
          background: rgba(15,14,42,.55);
          color: white;
          font-size: 9px;
          font-weight: 700;
          backdrop-filter: blur(7px);
        }

        .rv-price {
          background: linear-gradient(135deg,#4f46e5,#2563eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @media (max-width: 640px) {
          .rv-arrow {
            opacity: 1;
          }

          .rv-overlay {
            opacity: 1;
            background: linear-gradient(
              to bottom,
              transparent 50%,
              rgba(20,16,60,.34) 100%
            );
          }

          .rv-quick-btn {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
            padding: 6px 13px;
            font-size: 10px;
          }

          .rv-card:hover {
            transform: translateY(-3px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rv-card,
          .rv-track,
          .rv-slide img,
          .rv-arrow {
            transition: none !important;
          }
        }
      `}</style>

      <section className="rv-root mx-auto w-full max-w-7xl px-3 py-8 sm:px-5 lg:px-8">
        <div className="mb-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            <FaHistory size={10} />
            Your activity
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Recently Viewed
          </h2>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Continue exploring products you viewed recently.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
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
                className="rv-card"
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
                {/* CAROUSEL IMAGE AREA */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    height:
                      "clamp(175px,21vw,225px)",
                    background:
                      "radial-gradient(circle at 50% 20%, rgba(99,102,241,.08), transparent 55%), #f8faff",
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

                    if (Math.abs(distance) < 45) return;

                    if (distance > 0) {
                      changeImage(
                        event,
                        product._id,
                        images.length,
                        1
                      );
                    } else {
                      changeImage(
                        event,
                        product._id,
                        images.length,
                        -1
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
                    className="rv-track"
                    style={{
                      transform: `translateX(-${activeIdx * 100
                        }%)`,
                    }}
                  >
                    {images.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="rv-slide"
                        onClick={() =>
                          openProduct(product)
                        }
                      >
                        <img
                          src={image}
                          alt={`${product?.title || "Product"} image ${index + 1
                            }`}
                          loading="lazy"
                          draggable="false"
                        />
                      </div>
                    ))}
                  </div>

                  {hoveredCard === product._id &&
                    images.length > 1 && (
                      <div
                        className="rv-auto-progress"
                        aria-hidden="true"
                      />
                    )}

                  <span className="rv-badge">
                    <FaEye size={8} />
                    Viewed
                  </span>

                  {discount > 0 && (
                    <span className="absolute bottom-3 left-3 z-15 rounded-full bg-emerald-500 px-2.5 py-1 text-[9px] font-extrabold text-white shadow-md">
                      {discount}% OFF
                    </span>
                  )}

                  {/* QUICK VIEW — same interaction style as ProductCard */}
                  {/* <div className="rv-overlay">
                    <button
                      type="button"
                      className="rv-quick-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        openProduct(product);
                      }}
                    >
                      <AiOutlineEye size={14} />
                      Quick View
                    </button>
                  </div> */}



                  {images.length > 1 && (
                    <>
                      {/* IMAGE PROGRESS */}
                      <div className="rv-dots" aria-label="Product images">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            aria-label={`Show image ${index + 1}`}
                            aria-current={activeIdx === index ? "true" : "false"}
                            className={`rv-dot ${activeIdx === index ? "active" : ""
                              }`}
                            onClick={(event) =>
                              goToImage(
                                event,
                                product._id,
                                index
                              )
                            }
                          />
                        ))}
                      </div>

                      {/* IMAGE COUNT */}
                      <div className="rv-count">
                        {activeIdx + 1}/{images.length}
                      </div>
                    </>
                  )}



                </div>

                {/* PRODUCT INFORMATION */}
                <div className="p-3 sm:p-4">
                  <p className="mb-1 truncate text-[9px] font-bold uppercase tracking-[0.12em] text-indigo-500">
                    {product?.category?.name ||
                      "Product"}
                  </p>

                  <h3
                    onClick={() =>
                      openProduct(product)
                    }
                    className="min-h-[38px] cursor-pointer line-clamp-2 text-[12.5px] font-semibold leading-[1.35] text-slate-800 transition-colors hover:text-indigo-600 sm:text-sm"
                  >
                    {product.title}
                  </h3>

                  <div className="mt-2 flex min-h-[18px] items-center gap-1">
                    {rating > 0 ? (
                      <>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map(
                            (_, index) => (
                              <FaStar
                                key={index}
                                size={9}
                                className={
                                  index <
                                    Math.round(
                                      rating
                                    )
                                    ? "text-amber-400"
                                    : "text-slate-200"
                                }
                              />
                            )
                          )}
                        </div>

                        <span className="ml-1 text-[10px] font-semibold text-slate-400">
                          {rating.toFixed(1)}
                        </span>
                      </>
                    ) : (
                      <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-400">
                        New
                      </span>
                    )}

                    <span className="text-[9px] text-slate-400">
                      ({product?.numReviews || 0})
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className="text-sm font-extrabold sm:text-base">
                      <span className="mr-0.5 text-indigo-600">
                        ₹
                      </span>

                      <span className="rv-price">
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
