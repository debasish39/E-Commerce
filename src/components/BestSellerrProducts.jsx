import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FaStar,
  FaShoppingBag,
  FaEye,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL;

export default function BestSellerProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndexes, setActiveIndexes] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  /* =====================================================
     FETCH BEST SELLERS
  ===================================================== */

  const fetchBestSellers = useCallback(async () => {

    const url =
      `${BACKEND_URL}/api/products/best-sellers`;

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
          "Failed to load best sellers"
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

    fetchBestSellers();

    return () => {
    };
  }, [fetchBestSellers]);

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
      <section className="mx-auto w-full max-w-7xl px-3 py-8 sm:px-5 lg:px-8">
        <div className="mb-6">
          <div className="mb-2 h-6 w-28 animate-pulse rounded-full bg-slate-200" />
          <div className="h-8 w-52 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-2 h-4 w-60 animate-pulse rounded bg-slate-100" />
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

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-[22px] border border-red-100 bg-red-50 p-8 text-center">
          <FaShoppingBag
            className="mx-auto text-red-400"
            size={28}
          />

          <h2 className="mt-3 text-xl font-bold text-slate-900">
            Best Sellers
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchBestSellers}
            className="mt-5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-600"
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
     UI — MODERN PRODUCT CARD
  ===================================================== */

  return (
    <>
      <style>{`
        .bs-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .bs-card {
          position: relative;
          background: rgba(255,255,255,.90);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(99,102,241,.12);
          border-radius: 22px;
          overflow: hidden;
          cursor: pointer;
          transition:
            transform .32s cubic-bezier(.34,1.2,.64,1),
            box-shadow .28s ease,
            border-color .25s ease;
        }

        .bs-card:hover {
          transform: translateY(-7px) scale(1.012);
          box-shadow:
            0 22px 52px rgba(79,70,229,.17),
            0 5px 18px rgba(0,0,0,.05);
          border-color: rgba(99,102,241,.28);
        }

        .bs-track {
          display: flex;
          width: 100%;
          height: 100%;
          will-change: transform;
          transition: transform .42s cubic-bezier(.22,1,.36,1);
          touch-action: pan-y;
        }

        .bs-slide {
          flex: 0 0 100%;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8faff;
        }

        .bs-slide img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          user-select: none;
          -webkit-user-drag: none;
          transition: transform .5s cubic-bezier(.22,1,.36,1);
        }

        .bs-card:hover .bs-slide img {
          transform: scale(1.07);
        }

        .bs-arrow {
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

        .bs-card:hover .bs-arrow {
          opacity: 1;
        }

        .bs-arrow:hover {
          background: #fff;
          transform: translateY(-50%) scale(1.08);
        }

        .bs-left { left: 9px; }
        .bs-right { right: 9px; }

        

        .bs-badge {
          position: absolute;
          top: 11px;
          left: 11px;
          z-index: 15;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 9px;
          border-radius: 999px;
          background: linear-gradient(135deg,#4f46e5,#7c3aed);
          color: white;
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: .04em;
          text-transform: uppercase;
          box-shadow: 0 3px 10px rgba(79,70,229,.35);
        }

        .bs-card:hover .bs-discount {
          transform: translateY(-1px) scale(1.03);
        }

        .bs-discount {
          transition: transform .2s ease;
        }

        .bs-count {
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

        .bs-overlay {
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

        .bs-card:hover .bs-overlay {
          opacity: 1;
        }

        .bs-quick {
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

        .bs-card:hover .bs-quick {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .bs-quick:hover {
          background: #fff;
          color: #4f46e5;
        }

        .bs-price {
          background: linear-gradient(135deg,#4f46e5,#2563eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .bs-progress {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 30;
          height: 2px;
          overflow: hidden;
          background: rgba(255,255,255,.3);
          pointer-events: none;
        }

        .bs-progress::after {
          content: "";
          display: block;
          width: 100%;
          height: 100%;
          background: rgba(255,255,255,.95);
          transform-origin: left;
          animation: bsProgress 1.4s linear infinite;
        }

        @keyframes bsProgress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        @media (max-width: 640px) {
          .bs-arrow {
            opacity: 1;
          }

          .bs-overlay {
            opacity: 1;
            background: linear-gradient(
              to bottom,
              transparent 50%,
              rgba(20,16,60,.34) 100%
            );
          }

          .bs-quick {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
            padding: 6px 13px;
            font-size: 10px;
          }

          .bs-card:hover {
            transform: translateY(-3px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bs-card,
          .bs-track,
          .bs-slide img,
          .bs-arrow {
            transition: none !important;
          }
        }
      `}</style>

      <section className="bs-root mx-auto w-full max-w-7xl px-3 py-8 sm:px-5 lg:px-8">
        <div
      
          className="mb-6 flex items-end justify-between gap-4"
        >
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              <FaShoppingBag size={10} />
              Popular right now
            </div>

            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Best Sellers
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Products customers are loving right now.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="rounded-full border border-indigo-100 bg-white px-4 py-2 text-[11px] font-bold text-indigo-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-50"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
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

            const sales = Number(
              product?.analytics?.sales || 0
            );

            const orders = Number(
              product?.analytics?.orders || 0
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
                data-aos="zoom-in"
                data-aos-delay={index * 70}
                data-aos-once="true"
                className="bs-card"
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
                    className="bs-track"
                    style={{
                      transform: `translateX(-${
                        activeIdx * 100
                      }%)`,
                    }}
                  >
                    {images.map((image, imageIndex) => (
                      <div
                        key={`${image}-${imageIndex}`}
                        className="bs-slide"
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

                  <span className="bs-badge">
                    <MdVerified size={12} className="font-bold" />
                    Best Seller
                  </span>

                  {discount > 0 && (
                    <span className="bs-discount absolute right-3 top-3 z-20 inline-flex items-center rounded-full border border-emerald-100 bg-emerald-500 px-2.5 py-1 text-[9px] font-extrabold tracking-wide text-white shadow-lg shadow-emerald-500/20">
                      {discount}% OFF
                    </span>
                  )}

                  {hoveredCard === product._id &&
                    images.length > 1 && (
                      <div
                        className="bs-progress"
                        aria-hidden="true"
                      />
                    )}

                  

                  {images.length > 1 && (
                    <>
                    

                      <div className="bs-dots">
                        {images.map((_, imageIndex) => (
                          <button
                            key={imageIndex}
                            type="button"
                            aria-label={`Show image ${
                              imageIndex + 1
                            }`}
                            className={`bs-dot ${
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

                      <div className="bs-count">
                        {activeIdx + 1}/{images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-3 sm:p-4">
                  <p className="mb-1 truncate text-[9px] font-bold uppercase tracking-[0.12em] text-indigo-500">
                    {product?.category?.name ||
                      "Best Seller"}
                  </p>

                  <h3
                    onClick={() =>
                      openProduct(product)
                    }
                    className="min-h-[38px] cursor-pointer line-clamp-2 text-[12.5px] font-semibold leading-[1.35] text-slate-800 transition-colors hover:text-indigo-600 sm:text-sm"
                  >
                    {product?.title || "Product"}
                  </h3>

                  <div className="mt-1 flex min-h-[1px] items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {rating > 0 ? (
                        <>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map(
                              (_, starIndex) => (
                                <FaStar
                                  key={starIndex}
                                  size={9}
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
                        ({product?.numReviews || 0})
                      </span>
                    </div>

                    {sales > 0 && (
                      <span className="text-[9px] font-semibold text-slate-400">
                        {sales} sold
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className="text-sm font-extrabold sm:text-base">
                      <span className="mr-0.5 text-indigo-600">
                        ₹
                      </span>

                      <span className="bs-price">
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

                  {orders > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-[9px] font-semibold text-emerald-600">
                      <FaEye size={9} />
                      {orders} orders
                    </div>
                  )}

                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}