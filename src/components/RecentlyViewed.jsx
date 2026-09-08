import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaHistory,
  FaEye,
} from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";

const API_URL =
  import.meta.env.VITE_BACKEND_URL +
  "/api/products";

export default function RecentlyViewed() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndexes, setActiveIndexes] =
    useState({});
  const [hoveredCard, setHoveredCard] =
    useState(null);

  // ============================================================
  // FETCH RECENTLY VIEWED PRODUCTS
  // ============================================================

  const fetchRecentlyViewed = useCallback(
    async () => {
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
          },
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              `HTTP ${response.status}`,
          );
        }

        setProducts(
          Array.isArray(data?.products)
            ? data.products
            : [],
        );
      } catch (err) {
        setError(
          err?.message ||
            "Failed to load recently viewed products",
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchRecentlyViewed();
  }, [fetchRecentlyViewed]);

  // ============================================================
  // GET PRODUCT IMAGES
  // ============================================================

  const getImages = useCallback(
    (product) => {
      const images = [
        product?.media?.thumbnail,

        ...(Array.isArray(
          product?.media?.images,
        )
          ? product.media.images
          : []),

        ...(Array.isArray(
          product?.variants,
        )
          ? product.variants.flatMap(
              (variant) =>
                Array.isArray(
                  variant?.images,
                )
                  ? variant.images
                  : [],
            )
          : []),
      ].filter(Boolean);

      const unique = [
        ...new Set(images),
      ];

      return unique.length
        ? unique
        : [
            "https://via.placeholder.com/500x500?text=Product",
          ];
    },
    [],
  );

  // ============================================================
  // GET ACTIVE VARIANT
  // ============================================================

  const getVariant = useCallback(
    (product) => {
      if (
        !Array.isArray(
          product?.variants,
        ) ||
        !product.variants.length
      ) {
        return null;
      }

      return (
        product.variants.find(
          (variant) =>
            variant?.isActive !== false,
        ) ||
        product.variants[0]
      );
    },
    [],
  );

  // ============================================================
  // GET PRICE
  // ============================================================

  const getPrice = useCallback(
    (product) =>
      Number(
        getVariant(product)?.price ||
          0,
      ),
    [getVariant],
  );

  // ============================================================
  // GET ORIGINAL PRICE
  // ============================================================

  const getOriginalPrice = useCallback(
    (product) =>
      Number(
        getVariant(product)
          ?.originalPrice ||
          getVariant(product)?.price ||
          0,
      ),
    [getVariant],
  );

  // ============================================================
  // OPEN PRODUCT
  // ============================================================

  const openProduct = (product) => {
    if (!product?._id) return;

    navigate(
      `/products/${product._id}`,
    );
  };

  // ============================================================
  // CHANGE IMAGE
  // ============================================================

  const changeImage = (
    event,
    productId,
    imageCount,
    direction,
  ) => {
    event.stopPropagation();

    if (imageCount <= 1) return;

    setActiveIndexes(
      (previous) => {
        const current =
          previous[productId] || 0;

        return {
          ...previous,

          [productId]:
            (current +
              direction +
              imageCount) %
            imageCount,
        };
      },
    );
  };

  // ============================================================
  // GO TO IMAGE
  // ============================================================

  const goToImage = (
    event,
    productId,
    index,
  ) => {
    event.stopPropagation();

    setActiveIndexes(
      (previous) => ({
        ...previous,
        [productId]: index,
      }),
    );
  };

  // ============================================================
  // AUTO IMAGE SWIPE
  // ============================================================

  const autoSwipe = useCallback(
    (productId, imageCount) => {
      if (imageCount <= 1) return;

      setActiveIndexes(
        (previous) => {
          const current =
            previous[productId] || 0;

          return {
            ...previous,

            [productId]:
              (current + 1) %
              imageCount,
          };
        },
      );
    },
    [],
  );

  // ============================================================
  // AUTO SWIPE TIMER
  // ============================================================

  useEffect(() => {
    if (!hoveredCard) return;

    const product =
      products.find(
        (item) =>
          item._id === hoveredCard,
      );

    if (!product) return;

    const images =
      getImages(product);

    if (images.length <= 1) return;

    const timer = setInterval(
      () => {
        autoSwipe(
          product._id,
          images.length,
        );
      },
      1400,
    );

    return () =>
      clearInterval(timer);
  }, [
    hoveredCard,
    products,
    getImages,
    autoSwipe,
  ]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-3 py-8 sm:px-5 lg:px-8">
        <div className="mb-4">
          <div className="mb-2 h-6 w-28 animate-pulse rounded-full bg-slate-200" />

          <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-100" />
        </div>

        {/* Horizontal loading cards */}
        <div className="rv-loading-scroll">
          {[1, 2, 3, 4, 5].map(
            (item) => (
              <div
                key={item}
                className="rv-loading-card overflow-hidden rounded-[22px] border border-slate-100 bg-white"
              >
                <div className="h-40 animate-pulse bg-slate-100" />

                <div className="space-y-2.5 p-3">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />

                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />

                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />

                  <div className="h-5 w-24 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ),
          )}
        </div>
      </section>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-[22px] border border-red-100 bg-red-50 p-8 text-center">
          <FaHistory
            className="mx-auto text-red-400"
            size={28}
          />

          <h2 className="mt-3 text-xl font-bold text-slate-900">
            Recently Viewed
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={
              fetchRecentlyViewed
            }
            className="mt-5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-600"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // ============================================================
  // NO PRODUCTS
  // ============================================================

  if (!products.length) {
    return null;
  }

  // ============================================================
  // MAIN
  // ============================================================

  return (
    <>
      <style>{`
        .rv-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .rv-products-scroll {
          display: flex;
          gap: 14px;
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 3px 3px 10px;
          scroll-behavior: smooth;
          scroll-snap-type: x proximity;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .rv-products-scroll::-webkit-scrollbar {
          display: none;
        }

        .rv-product-item {
          flex: 0 0 218px;
          width: 218px;
          min-width: 218px;
          scroll-snap-align: start;
        }

        .rv-card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 100%;
          overflow: hidden;
          background: rgba(255,255,255,.97);
          border: 1px solid rgba(15,23,42,.07);
          border-radius: 20px;
          box-shadow: 0 8px 28px rgba(15,23,42,.06), 0 2px 7px rgba(79,70,229,.04);
          transition: transform .28s cubic-bezier(.34,1.2,.64,1), box-shadow .28s ease, border-color .22s ease;
        }

        .rv-card:hover {
          transform: translateY(-6px);
          border-color: rgba(99,102,241,.20);
          box-shadow: 0 18px 42px rgba(15,23,42,.10), 0 6px 18px rgba(79,70,229,.09);
        }

        .rv-image-area {
          position: relative;
          height: 160px;
          overflow: hidden;
          background: radial-gradient(circle at 50% 18%, rgba(99,102,241,.10), transparent 58%), linear-gradient(145deg,#f8faff,#f4f6ff);
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
          padding: 6px;
        }

        .rv-slide img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          user-select: none;
          -webkit-user-drag: none;
          transition: transform .45s cubic-bezier(.22,1,.36,1);
          filter: drop-shadow(0 8px 12px rgba(15,23,42,.06));
        }

        .rv-card:hover .rv-slide img {
          transform: scale(1.045);
        }

        .rv-badge {
          position: absolute;
          top: 11px;
          left: 11px;
          z-index: 15;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 9px;
          border: 1px solid rgba(255,255,255,.28);
          border-radius: 999px;
          background: rgba(15,23,42,.68);
          color: white;
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: .04em;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
          box-shadow: 0 5px 15px rgba(15,23,42,.14);
        }

        .rv-discount {
          position: absolute;
          left: 11px;
          bottom: 11px;
          z-index: 15;
          padding: 5px 9px;
          border-radius: 999px;
          background: rgba(16,185,129,.94);
          color: white;
          font-size: 9px;
          font-weight: 800;
          box-shadow: 0 5px 14px rgba(16,185,129,.22);
        }

        .rv-count {
          position: absolute;
          right: 11px;
          bottom: 11px;
          z-index: 15;
          padding: 5px 8px;
          border: 1px solid rgba(255,255,255,.20);
          border-radius: 999px;
          background: rgba(15,23,42,.58);
          color: white;
          font-size: 9px;
          font-weight: 800;
          backdrop-filter: blur(8px);
        }

        .rv-arrow {
          position: absolute;
          top: 50%;
          z-index: 25;
          width: 32px;
          height: 32px;
          transform: translateY(-50%);
          border: 1px solid rgba(255,255,255,.80);
          border-radius: 50%;
          background: rgba(255,255,255,.90);
          color: #4f46e5;
          box-shadow: 0 5px 16px rgba(15,23,42,.13);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity .2s ease, transform .2s ease, background .2s ease;
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

        .rv-dots {
          position: absolute;
          left: 50%;
          bottom: 11px;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transform: translateX(-50%);
          padding: 4px 6px;
          border-radius: 999px;
          background: rgba(15,23,42,.20);
          backdrop-filter: blur(7px);
        }

        .rv-dot {
          width: 5px;
          height: 5px;
          padding: 0;
          border: 0;
          border-radius: 999px;
          background: rgba(255,255,255,.62);
          cursor: pointer;
          transition: width .22s ease, background .22s ease;
        }

        .rv-dot.active {
          width: 15px;
          background: #6366f1;
          box-shadow: 0 0 7px rgba(99,102,241,.35);
        }

        .rv-info {
          padding: 7px 9px 8px;
        }

        .rv-category {
          margin-bottom: 5px;
          color: #6366f1;
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .rv-title {
          min-height: 32px;
          margin: 0;
          color: #0f172a;
          font-size: 12px;
          font-weight: 750;
          line-height: 1.3;
          letter-spacing: -.01em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          cursor: pointer;
          transition: color .18s ease;
        }

        .rv-title:hover {
          color: #4f46e5;
        }

        .rv-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          min-height: 17px;
          margin-top: 5px;
        }

        .rv-rating-value {
          color: #64748b;
          font-size: 9px;
          font-weight: 700;
        }

        .rv-rating-count {
          color: #94a3b8;
          font-size: 9px;
        }

        .rv-price-row {
          display: flex;
          align-items: baseline;
          gap: 7px;
          margin-top: 6px;
        }

        .rv-price {
          font-size: 16px;
          font-weight: 900;
          background: linear-gradient(135deg,#4f46e5,#2563eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .rv-original {
          color: #94a3b8;
          font-size: 9px;
          font-weight: 600;
        }

        .rv-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-top: 7px;
          padding-top: 7px;
          border-top: 1px solid rgba(15,23,42,.06);
        }

        .rv-view-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 27px;
          padding: 5px 9px;
          border: 1px solid rgba(99,102,241,.12);
          border-radius: 10px;
          background: #f8faff;
          color: #4f46e5;
          font-size: 9px;
          font-weight: 800;
          cursor: pointer;
          transition: transform .18s ease, background .18s ease, color .18s ease;
        }

        .rv-view-btn:hover {
          transform: translateY(-1px);
          background: linear-gradient(135deg,#4f46e5,#2563eb);
          color: white;
        }

        .rv-loading-scroll {
          display: flex;
          gap: 14px;
          overflow-x: hidden;
          padding: 3px 3px 10px;
        }

        .rv-loading-card {
          flex: 0 0 218px;
          width: 218px;
          min-width: 218px;
          overflow: hidden;
          border: 1px solid rgba(15,23,42,.06);
          border-radius: 24px;
          background: white;
          box-shadow: 0 7px 24px rgba(15,23,42,.05);
        }

        @media (max-width: 640px) {
          .rv-product-item,
          .rv-loading-card {
            flex: 0 0 172px;
            width: 172px;
            min-width: 172px;
          }

          .rv-image-area {
            height: 120px;
          }

          .rv-info {
            padding: 8px 9px 9px;
          }

          .rv-title {
            font-size: 11px;
          }

          .rv-price {
            font-size: 14px;
          }

          .rv-card:hover {
            transform: translateY(-3px);
          }

          .rv-arrow {
            opacity: 1;
          }

          .rv-products-scroll {
            gap: 10px;
            padding-bottom: 10px;
            scroll-padding-left: 3px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rv-card,
          .rv-track,
          .rv-slide img,
          .rv-arrow,
          .rv-products-scroll {
            transition: none !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <section className="rv-root mx-auto w-full max-w-7xl px-3 py-5 sm:px-5 lg:px-8">

        {/* ======================================================
            HEADER
        ====================================================== */}

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


        {/* ======================================================
            HORIZONTAL PRODUCT LIST
        ====================================================== */}

        <div className="rv-products-scroll">

          {products.map(
            (product) => {
              const images =
                getImages(product);

              const activeIdx =
                activeIndexes[
                  product._id
                ] || 0;

              const price =
                getPrice(product);

              const originalPrice =
                getOriginalPrice(
                  product,
                );

              const rating =
                Number(
                  product?.rating
                    ?.average ??
                    product?.rating ??
                    0,
                );

              const discount =
                originalPrice >
                price
                  ? Math.round(
                      ((originalPrice -
                        price) /
                        originalPrice) *
                        100,
                    )
                  : 0;

              return (
                <article
                  key={product._id}
                  className="rv-card rv-product-item"

                  onMouseEnter={() =>
                    setHoveredCard(
                      product._id,
                    )
                  }

                  onMouseLeave={() =>
                    setHoveredCard(
                      (current) =>
                        current ===
                        product._id
                          ? null
                          : current,
                    )
                  }
                >

                  {/* ==================================================
                      IMAGE AREA
                  ================================================== */}

                  <div
                    className="rv-image-area"
                    style={{
                      height:
                        "clamp(130px,16vw,165px)",

                      background:
                        "radial-gradient(circle at 50% 20%, rgba(99,102,241,.08), transparent 55%), #f8faff",
                    }}

                    onTouchStart={(
                      event,
                    ) => {
                      event.currentTarget.dataset.touchX =
                        event.touches[0].clientX;

                      setHoveredCard(
                        product._id,
                      );
                    }}

                    onTouchEnd={(
                      event,
                    ) => {
                      const start =
                        Number(
                          event
                            .currentTarget
                            .dataset
                            .touchX ||
                            0,
                        );

                      const end =
                        event
                          .changedTouches[0]
                          .clientX;

                      const distance =
                        start - end;

                      if (
                        Math.abs(
                          distance,
                        ) < 45
                      ) {
                        return;
                      }

                      if (
                        distance > 0
                      ) {
                        changeImage(
                          event,
                          product._id,
                          images.length,
                          1,
                        );
                      } else {
                        changeImage(
                          event,
                          product._id,
                          images.length,
                          -1,
                        );
                      }

                      setHoveredCard(
                        (current) =>
                          current ===
                          product._id
                            ? null
                            : current,
                      );
                    }}

                    onTouchCancel={() =>
                      setHoveredCard(
                        (current) =>
                          current ===
                          product._id
                            ? null
                            : current,
                      )
                    }
                  >

                    {/* ==================================================
                        IMAGE TRACK
                    ================================================== */}

                    <div
                      className="rv-track"

                      style={{
                        transform:
                          `translateX(-${activeIdx * 100}%)`,
                      }}
                    >

                      {images.map(
                        (
                          image,
                          index,
                        ) => (
                          <div
                            key={`${image}-${index}`}
                            className="rv-slide"

                            onClick={() =>
                              openProduct(
                                product,
                              )
                            }
                          >

                            <img
                              src={image}
                              alt={`${
                                product?.title ||
                                "Product"
                              } image ${
                                index + 1
                              }`}
                              loading="lazy"
                              draggable="false"
                            />

                          </div>
                        ),
                      )}

                    </div>


                    {/* ==================================================
                        AUTO PROGRESS
                    ================================================== */}

                    {hoveredCard ===
                      product._id &&
                      images.length >
                        1 && (
                        <div
                          className="rv-auto-progress"
                          aria-hidden="true"
                        />
                      )}


                    {/* ==================================================
                        VIEWED BADGE
                    ================================================== */}

                    <span className="rv-badge">
                      <FaEye size={8} />
                      Viewed
                    </span>


                    {/* ==================================================
                        DISCOUNT
                    ================================================== */}

                    {discount > 0 && (
                      <span className="rv-discount">
                        {discount}% OFF
                      </span>
                    )}


                    {/* ==================================================
                        QUICK VIEW
                    ================================================== */}

                    {/*
                    <div className="rv-overlay">
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
                    </div>
                    */}


                    {/* ==================================================
                        IMAGE DOTS
                    ================================================== */}

                    {images.length >
                      1 && (
                      <>
                        <div
                          className="rv-dots"
                          aria-label="Product images"
                        >

                          {images.map(
                            (
                              _,
                              index,
                            ) => (
                              <button
                                key={
                                  index
                                }
                                type="button"

                                aria-label={`Show image ${
                                  index + 1
                                }`}

                                aria-current={
                                  activeIdx ===
                                  index
                                    ? "true"
                                    : "false"
                                }

                                className={`rv-dot ${
                                  activeIdx ===
                                  index
                                    ? "active"
                                    : ""
                                }`}

                                onClick={(
                                  event,
                                ) =>
                                  goToImage(
                                    event,
                                    product._id,
                                    index,
                                  )
                                }
                              />
                            ),
                          )}

                        </div>


                        {/* IMAGE COUNT */}

                        <div className="rv-count">
                          {activeIdx +
                            1}
                          /
                          {
                            images.length
                          }
                        </div>
                      </>
                    )}

                  </div>


                  {/* ==================================================
                      PRODUCT INFORMATION
                  ================================================== */}

                  <div className="rv-info">

                    <p className="rv-category">
                      {product?.category
                        ?.name ||
                        "Product"}
                    </p>


                    <h3
                      onClick={() =>
                        openProduct(
                          product,
                        )
                      }

                      className="rv-title"
                    >
                      {product.title}
                    </h3>


                    {/* ==================================================
                        RATING
                    ================================================== */}

                    <div className="rv-rating">

                      {rating > 0 ? (
                        <>
                          <div className="flex items-center gap-0.5">

                            {[
                              ...Array(
                                5,
                              ),
                            ].map(
                              (
                                _,
                                index,
                              ) => (
                                <FaStar
                                  key={
                                    index
                                  }
                                  size={
                                    9
                                  }

                                  className={
                                    index <
                                    Math.round(
                                      rating,
                                    )
                                      ? "text-amber-400"
                                      : "text-slate-200"
                                  }
                                />
                              ),
                            )}

                          </div>


                          <span className="rv-rating-value">
                            {rating.toFixed(
                              1,
                            )}
                          </span>
                        </>
                      ) : (
                        <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-400">
                          New
                        </span>
                      )}


                      <span className="rv-rating-count">
                        (
                        {
                          product?.numReviews ||
                          0
                        }
                        )
                      </span>

                    </div>


                    {/* ==================================================
                        PRICE
                    ================================================== */}

                    <div className="rv-price-row">

                      <span className="rv-price">

                        <span className="mr-0.5 text-indigo-600">
                          ₹
                        </span>

                        <span className="rv-price-number">
                          {price.toLocaleString(
                            "en-IN",
                          )}
                        </span>

                      </span>


                      {originalPrice >
                        price && (
                        <del className="rv-original">
                          ₹
                          {originalPrice.toLocaleString(
                            "en-IN",
                          )}
                        </del>
                      )}

                    </div>

                    <div className="rv-footer">
                      <span className="text-[9px] font-semibold text-slate-400">
                        Recently viewed
                      </span>

                      <button
                        type="button"
                        className="rv-view-btn"
                        onClick={() => openProduct(product)}
                        aria-label={`View ${product?.title || "product"}`}
                      >
                        View product
                      </button>
                    </div>

                  </div>

                </article>
              );
            },
          )}

        </div>

      </section>
    </>
  );
}