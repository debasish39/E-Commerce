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

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [activeIndexes, setActiveIndexes] =
    useState({});

  const [hoveredCard, setHoveredCard] =
    useState(null);


  /* =====================================================
     FETCH BEST SELLERS
  ===================================================== */

  const fetchBestSellers =
    useCallback(async () => {
      const url =
        `${BACKEND_URL}/api/products/best-sellers`;

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
              `HTTP ${response.status}`,
          );
        }

        const list =
          Array.isArray(
            data?.products,
          )
            ? data.products
            : [];

        setProducts(list);
      } catch (error) {
        setError(
          error?.message ||
            "Failed to load best sellers",
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

    return () => {};
  }, [fetchBestSellers]);


  /* =====================================================
     IMAGE
  ===================================================== */

  const getImages = (product) => {
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

    const uniqueImages =
      [...new Set(images)];

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
      !Array.isArray(
        product?.variants,
      ) ||
      product.variants.length === 0
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
  };


  /* =====================================================
     PRICE
  ===================================================== */

  const getPrice = (product) => {
    const variant =
      getVariant(product);

    return Number(
      variant?.price || 0,
    );
  };


  /* =====================================================
     ORIGINAL PRICE
  ===================================================== */

  const getOriginalPrice = (
    product,
  ) => {
    const variant =
      getVariant(product);

    return Number(
      variant?.originalPrice ||
        variant?.price ||
        0,
    );
  };


  /* =====================================================
     OPEN PRODUCT
  ===================================================== */

  const openProduct = (
    product,
  ) => {
    if (!product?._id) {
      return;
    }

    navigate(
      `/products/${product._id}`,
    );
  };


  /* =====================================================
     CHANGE IMAGE
  ===================================================== */

  const changeImage = (
    event,
    productId,
    imageCount,
    direction,
  ) => {
    event.stopPropagation();

    if (imageCount <= 1) {
      return;
    }

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


  /* =====================================================
     GO TO IMAGE
  ===================================================== */

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


  /* =====================================================
     AUTO SWIPE
  ===================================================== */

  const autoSwipe =
    useCallback(
      (
        productId,
        imageCount,
      ) => {
        if (imageCount <= 1) {
          return;
        }

        setActiveIndexes(
          (previous) => {
            const current =
              previous[
                productId
              ] || 0;

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


  /* =====================================================
     AUTO SWIPE TIMER
  ===================================================== */

  useEffect(() => {
    if (!hoveredCard) {
      return;
    }

    const product =
      products.find(
        (item) =>
          item._id ===
          hoveredCard,
      );

    if (!product) {
      return;
    }

    const images =
      getImages(product);

    if (images.length <= 1) {
      return;
    }

    const timer =
      setInterval(() => {
        autoSwipe(
          product._id,
          images.length,
        );
      }, 1400);

    return () =>
      clearInterval(timer);
  }, [
    hoveredCard,
    products,
    autoSwipe,
  ]);


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


        {/* HORIZONTAL LOADING CARDS */}

        <div className="bs-loading-scroll">

          {[1, 2, 3, 4, 5].map(
            (item) => (
              <div
                key={item}
                className="bs-loading-card overflow-hidden rounded-[22px] border border-slate-100 bg-white"
              >

                <div className="h-52 animate-pulse bg-slate-100" />

                <div className="space-y-3 p-4">

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
            onClick={
              fetchBestSellers
            }
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
     UI
  ===================================================== */

  return (
    <>
      <style>{`
        .bs-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .bs-products-scroll {
          display: flex;
          gap: 12px;
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 3px 3px 9px;
          scroll-behavior: smooth;
          scroll-snap-type: x proximity;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .bs-products-scroll::-webkit-scrollbar {
          display: none;
        }

        .bs-product-item {
          flex: 0 0 190px;
          width: 190px;
          min-width: 190px;
          scroll-snap-align: start;
        }

        .bs-card {
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: rgba(255,255,255,.97);
          border: 1px solid rgba(15,23,42,.07);
          border-radius: 20px;
          cursor: pointer;
          box-shadow: 0 7px 24px rgba(15,23,42,.06), 0 2px 8px rgba(79,70,229,.04);
          transition: transform .25s cubic-bezier(.34,1.2,.64,1), box-shadow .25s ease, border-color .2s ease;
        }

        .bs-card:hover {
          transform: translateY(-5px);
          border-color: rgba(99,102,241,.20);
          // box-shadow: 0 16px 34px rgba(15,23,42,.10), 0 5px 16px rgba(79,70,229,.08);
        }

        .bs-track {
          display: flex;
          width: 100%;
          height: 100%;
          will-change: transform;
          transition: transform .38s cubic-bezier(.22,1,.36,1);
          touch-action: pan-y;
        }

        .bs-slide {
          flex: 0 0 100%;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
          background: radial-gradient(circle at 50% 20%, rgba(99,102,241,.09), transparent 58%), #f8faff;
        }

        .bs-slide img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          user-select: none;
          -webkit-user-drag: none;
          transition: transform .4s cubic-bezier(.22,1,.36,1);
          filter: drop-shadow(0 7px 10px rgba(15,23,42,.06));
        }

        .bs-card:hover .bs-slide img {
          transform: scale(1.045);
        }

        .bs-arrow {
          position: absolute;
          top: 50%;
          z-index: 25;
          width: 28px;
          height: 28px;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,.9);
          border-radius: 50%;
          background: rgba(255,255,255,.90);
          color: #4f46e5;
          box-shadow: 0 4px 12px rgba(15,23,42,.13);
          cursor: pointer;
          opacity: 0;
          transition: opacity .2s ease, transform .2s ease;
        }

        .bs-card:hover .bs-arrow {
          opacity: 1;
        }

        .bs-arrow:hover {
          transform: translateY(-50%) scale(1.08);
        }

        .bs-left { left: 7px; }
        .bs-right { right: 7px; }

        .bs-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          z-index: 15;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 7px;
          border: 1px solid rgba(255,255,255,.28);
          border-radius: 999px;
          background: linear-gradient(135deg,#4f46e5,#7c3aed);
          color: white;
          font-size: 7.5px;
          font-weight: 800;
          letter-spacing: .03em;
          text-transform: uppercase;
          box-shadow: 0 4px 10px rgba(79,70,229,.25);
          backdrop-filter: blur(8px);
        }

        .bs-count {
          position: absolute;
          right: 8px;
          bottom: 8px;
          z-index: 15;
          padding: 3px 6px;
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 999px;
          background: rgba(15,23,42,.55);
          color: white;
          font-size: 8px;
          font-weight: 700;
          backdrop-filter: blur(7px);
        }

        .bs-dots {
          position: absolute;
          left: 50%;
          bottom: 8px;
          z-index: 20;
          display: flex;
          gap: 3px;
          align-items: center;
          transform: translateX(-50%);
          padding: 3px 5px;
          border-radius: 999px;
          background: rgba(15,23,42,.20);
          backdrop-filter: blur(6px);
        }

        .bs-dot {
          width: 4px;
          height: 4px;
          padding: 0;
          border: 0;
          border-radius: 999px;
          background: rgba(255,255,255,.65);
          cursor: pointer;
          transition: width .2s ease, background .2s ease;
        }

        .bs-dot.active {
          width: 12px;
          background: #6366f1;
        }

        .bs-progress {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 30;
          height: 2px;
          overflow: hidden;
          background: rgba(255,255,255,.28);
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

        .bs-info {
          padding: 8px 9px 9px;
        }

        .bs-category {
          margin-bottom: 3px;
          overflow: hidden;
          color: #6366f1;
          font-size: 7.5px;
          font-weight: 800;
          letter-spacing: .09em;
          text-transform: uppercase;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .bs-title {
          min-height: 31px;
          margin: 0;
          overflow: hidden;
          color: #0f172a;
          font-size: 11px;
          font-weight: 750;
          line-height: 1.4;
          letter-spacing: -.01em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          transition: color .18s ease;
        }

        .bs-title:hover {
          color: #4f46e5;
        }

        .bs-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 5px;
          margin-top: 4px;
          min-height: 15px;
        }

        .bs-meta .ml-1 {
          margin-left: 2px;
        }

        .bs-meta .text-slate-500 {
          color: #64748b;
          font-size: 8px;
          font-weight: 700;
        }

        .bs-meta .text-slate-400 {
          color: #94a3b8;
          font-size: 7.5px;
        }

        .bs-meta .text-amber-400 {
          color: #fbbf24;
        }

        .bs-meta .text-slate-200 {
          color: #e2e8f0;
        }

        .bs-price-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-top: 5px;
        }

        .bs-price-value {
          font-size: 14px;
          font-weight: 900;
          color: #4f46e5;
        }

        .bs-price {
          background: linear-gradient(135deg,#4f46e5,#2563eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .bs-original {
          color: #94a3b8;
          font-size: 7.5px;
          font-weight: 600;
        }

        .bs-orders {
          display: flex;
          align-items: center;
          gap: 3px;
          margin-top: 4px;
          color: #059669;
          font-size: 7.5px;
          font-weight: 700;
        }

        .bs-loading-scroll {
          display: flex;
          gap: 12px;
          overflow-x: hidden;
          padding-bottom: 9px;
        }

        .bs-loading-card {
          flex: 0 0 190px;
          width: 190px;
          min-width: 190px;
          overflow: hidden;
          border: 1px solid rgba(15,23,42,.06);
          border-radius: 20px;
          background: white;
          box-shadow: 0 6px 20px rgba(15,23,42,.05);
        }

        @media (max-width: 640px) {
          .bs-root {
            padding-top: 1.25rem;
            padding-bottom: 1.25rem;
          }

          .bs-products-scroll {
            gap: 9px;
            padding-bottom: 7px;
            scroll-padding-left: 3px;
          }

          .bs-product-item,
          .bs-loading-card {
            flex: 0 0 165px;
            width: 165px;
            min-width: 165px;
          }

          .bs-card {
            border-radius: 17px;
          }

          .bs-arrow {
            opacity: 1;
            width: 26px;
            height: 26px;
          }

          .bs-info {
            padding: 7px 8px 8px;
          }

          .bs-title {
            font-size: 10px;
            min-height: 28px;
          }

          .bs-price-value {
            font-size: 13px;
          }

          .bs-header .text-xl {
            font-size: 1.05rem;
          }

          .bs-header .text-2xl {
            font-size: 1.2rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bs-card,
          .bs-track,
          .bs-slide img,
          .bs-arrow,
          .bs-products-scroll {
            transition: none !important;
            scroll-behavior: auto !important;
          }

          .bs-progress::after {
            animation: none !important;
          }
        }
      `}</style>


      <section className="bs-root mx-auto w-full max-w-7xl px-3 py-8 sm:px-5 lg:px-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="bs-header mb-4 flex items-end justify-between gap-3">

          <div>

            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">

              <FaShoppingBag
                size={10}
              />

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
            onClick={() =>
              navigate(
                "/products",
              )
            }
            className="rounded-full border border-indigo-100 bg-white px-4 py-2 text-[11px] font-bold text-indigo-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-50"
          >
            View All
          </button>

        </div>


        {/* =====================================================
            HORIZONTAL PRODUCT SCROLLER
        ===================================================== */}

        <div className="bs-products-scroll">

          {products.map(
            (
              product,
              index,
            ) => {

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

              const sales =
                Number(
                  product?.analytics
                    ?.sales || 0,
                );

              const orders =
                Number(
                  product?.analytics
                    ?.orders || 0,
                );

              return (
                <article
                  key={
                    product._id
                  }

                  data-aos="zoom-in"

                  data-aos-delay={
                    index * 70
                  }

                  data-aos-once="true"

                  className="bs-card bs-product-item"

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

                  {/* =================================================
                      IMAGE CAROUSEL
                  ================================================= */}

                  <div
                    className="relative overflow-hidden"

                    style={{
                      height:
                        "clamp(125px,15vw,155px)",

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
                        ) > 45
                      ) {

                        changeImage(
                          event,
                          product._id,
                          images.length,
                          distance >
                            0
                            ? 1
                            : -1,
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

                    {/* IMAGE TRACK */}

                    <div
                      className="bs-track"

                      style={{
                        transform:
                          `translateX(-${
                            activeIdx * 100
                          }%)`,
                      }}
                    >

                      {images.map(
                        (
                          image,
                          imageIndex,
                        ) => (

                          <div
                            key={`${image}-${imageIndex}`}

                            className="bs-slide"

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
                                imageIndex +
                                1
                              }`}

                              loading="lazy"

                              draggable="false"
                            />

                          </div>

                        ),
                      )}

                    </div>


                    {/* BEST SELLER BADGE */}

                    <span className="bs-badge">

                      <MdVerified
                        size={12}
                        className="font-bold"
                      />

                      Best Seller

                    </span>


                    {/* AUTO PROGRESS */}

                    {hoveredCard ===
                      product._id &&
                      images.length >
                        1 && (

                      <div
                        className="bs-progress"
                        aria-hidden="true"
                      />

                    )}


                    {/* IMAGE DOTS */}

                    {images.length >
                      1 && (
                      <>

                        <div
                          className="bs-dots"
                          aria-label="Product images"
                        >

                          {images.map(
                            (
                              _,
                              imageIndex,
                            ) => (

                              <button
                                key={
                                  imageIndex
                                }

                                type="button"

                                aria-label={`Show image ${
                                  imageIndex +
                                  1
                                }`}

                                className={`bs-dot ${
                                  activeIdx ===
                                  imageIndex
                                    ? "active"
                                    : ""
                                }`}

                                onClick={(
                                  event,
                                ) =>
                                  goToImage(
                                    event,
                                    product._id,
                                    imageIndex,
                                  )
                                }
                              />

                            ),
                          )}

                        </div>


                        {/* IMAGE COUNT */}

                        <div className="bs-count">

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


                  {/* =================================================
                      CONTENT
                  ================================================= */}

                  <div className="bs-info">

                    <p className="bs-category">

                      {product
                        ?.category
                        ?.name ||
                        "Best Seller"}

                    </p>


                    <h3
                      onClick={() =>
                        openProduct(
                          product,
                        )
                      }

                      className="bs-title"
                    >

                      {product?.title ||
                        "Product"}

                    </h3>


                    {/* RATING */}

                    <div className="bs-meta">

                      <div className="flex items-center gap-1">

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
                                  starIndex,
                                ) => (

                                  <FaStar
                                    key={
                                      starIndex
                                    }

                                    size={
                                      9
                                    }

                                    className={
                                      starIndex <
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


                            <span className="ml-1 text-[10px] font-semibold text-slate-500">

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


                        <span className="text-[9px] text-slate-400">

                          (
                          {
                            product?.numReviews ||
                            0
                          }
                          )

                        </span>

                      </div>


                      {/* SALES */}

                      {sales > 0 && (
                        <span className="text-[9px] font-semibold text-slate-400">
                          {sales} sold
                        </span>
                      )}

                    </div>


                    {/* PRICE */}

                    <div className="bs-price-row">

                      <span className="bs-price-value">

                        <span className="mr-0.5 text-indigo-600">
                          ₹
                        </span>

                        <span className="bs-price">

                          {price.toLocaleString(
                            "en-IN",
                          )}

                        </span>

                      </span>


                      {originalPrice >
                        price && (

                        <del className="bs-original">

                          ₹
                          {originalPrice.toLocaleString(
                            "en-IN",
                          )}

                        </del>

                      )}

                    </div>


                    {/* ORDERS */}

                    {orders > 0 && (
                      <div className="bs-orders">

                        <FaEye
                          size={9}
                        />

                        {orders} orders

                      </div>
                    )}

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