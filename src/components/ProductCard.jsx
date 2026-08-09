import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";

import {
  IoCartOutline,
} from "react-icons/io5";

import {
  FaHeart,
  FaRupeeSign,
  FaRegHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import {
  AiOutlineEye,
} from "react-icons/ai";

import {
  useNavigate,
} from "react-router-dom";

import {
  useCart,
} from "../context/CartContext";

import {
  useWishlist,
} from "../context/wishlistContext";

import {
  toast,
} from "sonner";


export default function ProductCard({
  product,
}) {

  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | AUTH
  |--------------------------------------------------------------------------
  */

  const token =
    localStorage.getItem("token");

  const isSignedIn =
    Boolean(token);


  /*
  |--------------------------------------------------------------------------
  | CART / WISHLIST
  |--------------------------------------------------------------------------
  */

  const {
    addToCart,
    cartItem = [],
  } = useCart();

  const {
    wishlist = [],
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();


  /*
  |--------------------------------------------------------------------------
  | NORMALIZE PRODUCT DATA
  |--------------------------------------------------------------------------
  |
  | Your new Product schema stores:
  |
  | media.thumbnail
  | media.images
  | variants[].price
  | rating.average
  |
  |--------------------------------------------------------------------------
  */


  /*
  |--------------------------------------------------------------------------
  | IMAGES
  |--------------------------------------------------------------------------
  */

  const allImages = useMemo(() => {

    const images = [];

    /*
    | Thumbnail
    */

    if (
      product?.media?.thumbnail
    ) {
      images.push(
        product.media.thumbnail
      );
    }

    /*
    | Product images
    */

    if (
      Array.isArray(
        product?.media?.images
      )
    ) {
      images.push(
        ...product.media.images
      );
    }

    /*
    | Variant images
    */

    if (
      Array.isArray(
        product?.variants
      )
    ) {

      product.variants.forEach(
        (variant) => {

          if (
            Array.isArray(
              variant?.images
            )
          ) {
            images.push(
              ...variant.images
            );
          }

        }
      );

    }

    /*
    | Remove duplicates / empty values
    */

    return [
      ...new Set(
        images.filter(Boolean)
      ),
    ];

  }, [product]);


  /*
  |--------------------------------------------------------------------------
  | PRICE
  |--------------------------------------------------------------------------
  |
  | For variable products we show the
  | lowest active variant price.
  |--------------------------------------------------------------------------
  */

  const displayPrice = useMemo(() => {

    const variants =
      Array.isArray(
        product?.variants
      )
        ? product.variants
        : [];

    const activeVariants =
      variants.filter(
        (variant) =>
          variant?.isActive !== false
      );

    const prices =
      activeVariants
        .map((variant) =>
          Number(variant?.price)
        )
        .filter(
          (price) =>
            !Number.isNaN(price) &&
            price >= 0
        );

    if (prices.length > 0) {
      return Math.min(...prices);
    }

    /*
    | Fallback for old products
    */

    if (
      typeof product?.price ===
      "number"
    ) {
      return product.price;
    }

    return 0;

  }, [product]);


  /*
  |--------------------------------------------------------------------------
  | BRAND
  |--------------------------------------------------------------------------
  */

  const brandName =
    typeof product?.brand === "object"
      ? product.brand?.name
      : product?.brand;


  /*
  |--------------------------------------------------------------------------
  | RATING
  |--------------------------------------------------------------------------
  */

  const ratingValue = useMemo(() => {

    if (
      typeof product?.rating ===
      "number"
    ) {
      return product.rating;
    }

    if (
      typeof product?.rating?.average ===
      "number"
    ) {
      return product.rating.average;
    }

    if (
      typeof product?.ratings?.average ===
      "number"
    ) {
      return product.ratings.average;
    }

    return 0;

  }, [product]);


  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [
    activeIdx,
    setActiveIdx,
  ] = useState(0);

  const [
    imgLoaded,
    setImgLoaded,
  ] = useState({});

  const [
    heartAnim,
    setHeartAnim,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | AUTO IMAGE SCROLL
  |--------------------------------------------------------------------------
  */

  const scrollTimer =
    useRef(null);


  const startAutoScroll =
    useCallback(() => {

      if (
        allImages.length <= 1
      ) {
        return;
      }

      clearInterval(
        scrollTimer.current
      );

      scrollTimer.current =
        setInterval(() => {

          setActiveIdx(
            (prev) =>
              (prev + 1) %
              allImages.length
          );

        }, 1400);

    }, [allImages.length]);


  const stopAutoScroll =
    useCallback(() => {

      clearInterval(
        scrollTimer.current
      );

    }, []);


  /*
  |--------------------------------------------------------------------------
  | IMAGE NAVIGATION
  |--------------------------------------------------------------------------
  */

  const prev = (e) => {

    e.stopPropagation();

    if (
      allImages.length === 0
    ) {
      return;
    }

    setActiveIdx(
      (prev) =>
        (prev - 1 +
          allImages.length) %
        allImages.length
    );

  };


  const next = (e) => {

    e.stopPropagation();

    if (
      allImages.length === 0
    ) {
      return;
    }

    setActiveIdx(
      (prev) =>
        (prev + 1) %
        allImages.length
    );

  };


  /*
  |--------------------------------------------------------------------------
  | CART STATUS
  |--------------------------------------------------------------------------
  */

  const isInCart =
    cartItem.some(
      (item) =>
        String(
          item.productId
        ) ===
        String(product._id)
    );


  /*
  |--------------------------------------------------------------------------
  | WISHLIST STATUS
  |--------------------------------------------------------------------------
  */

  const isLiked =
    wishlist.some(
      (item) =>
        String(
          item.productId
        ) ===
        String(product._id)
    );


  /*
  |--------------------------------------------------------------------------
  | ADD TO CART
  |--------------------------------------------------------------------------
  */

  const handleAddToCart =
    async () => {

      if (!isSignedIn) {

        toast.error(
          "Please login first"
        );

        navigate("/sign-in");

        return;
      }


      if (isInCart) {

        navigate("/cart");

        return;
      }


      try {

        await addToCart(
          product
        );

      } catch (error) {

        console.error(
          "Add cart error:",
          error
        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | WISHLIST
  |--------------------------------------------------------------------------
  */

  const handleToggleWishlist =
    async (e) => {

      e.stopPropagation();


      if (!isSignedIn) {

        toast.error(
          "Please login first"
        );

        navigate("/sign-in");

        return;
      }


      setHeartAnim(true);

      setTimeout(() => {
        setHeartAnim(false);
      }, 500);


      try {

        if (isLiked) {

          await removeFromWishlist(
            String(product._id)
          );

        } else {

          await addToWishlist(
            product
          );

        }

      } catch (error) {

        console.error(
          "Wishlist error:",
          error
        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | PRODUCT DETAILS
  |--------------------------------------------------------------------------
  */

  const openProduct = () => {

    navigate(
      `/products/${product._id}`
    );

  };


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <>

      <style>{`

        @import url(
          'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
        );

        .pc-root {
          font-family:
            'Plus Jakarta Sans',
            sans-serif;
        }

        .pc-card {
          position: relative;
          background:
            rgba(255,255,255,0.88);
          backdrop-filter: blur(16px);
          border:
            1px solid
            rgba(99,102,241,0.12);
          border-radius: 22px;
          overflow: hidden;
          transition:
            transform .32s
              cubic-bezier(.34,1.2,.64,1),
            box-shadow .28s ease,
            border-color .25s ease;
          cursor: pointer;
        }

        .pc-card:hover {
          transform:
            translateY(-7px)
            scale(1.012);

          box-shadow:
            0 22px 52px
            rgba(79,70,229,0.17),
            0 5px 18px
            rgba(0,0,0,0.05);

          border-color:
            rgba(99,102,241,0.28);
        }

        .pc-img-track {
          display: flex;
          will-change: transform;
          transition:
            transform .42s
            cubic-bezier(.22,1,.36,1);
        }

        .pc-img-slide {
          flex:
            0 0 100%;

          width: 100%;
          height: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #f8faff;
        }

        .pc-img {
          width: 100%;
          height: 100%;

          object-fit: contain;

          transition:
            transform .50s
              cubic-bezier(.22,1,.36,1),
            opacity .30s;
        }

        .pc-card:hover
        .pc-img {
          transform: scale(1.07);
        }

        @keyframes pcSkel {

          0% {
            background-position:
              -200% center;
          }

          100% {
            background-position:
              200% center;
          }

        }

        .pc-skel {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              90deg,
              #e0e7ff 25%,
              #c7d2fe 50%,
              #e0e7ff 75%
            );

          background-size: 200% 100%;

          animation:
            pcSkel 1.4s
            ease-in-out infinite;
        }

        .pc-overlay {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              to bottom,
              transparent 45%,
              rgba(20,16,60,0.52)
              100%
            );

          opacity: 0;

          transition:
            opacity .26s;

          display: flex;
          align-items: flex-end;
          justify-content: center;

          padding-bottom: 13px;

          z-index: 5;
        }

        .pc-card:hover
        .pc-overlay {
          opacity: 1;
        }

        .pc-quick-btn {
          display: flex;
          align-items: center;
          gap: 6px;

          background:
            rgba(255,255,255,0.92);

          color: #1e1b4b;

          font-size: 11.5px;
          font-weight: 700;

          padding: 6px 15px;

          border-radius: 999px;
          border: none;

          cursor: pointer;

          transform:
            translateY(9px);

          opacity: 0;

          transition:
            transform .26s .04s,
            opacity .26s .04s;

          pointer-events: none;
        }

        .pc-card:hover
        .pc-quick-btn {
          transform:
            translateY(0);

          opacity: 1;

          pointer-events: all;
        }

        .pc-arrow {
          position: absolute;

          top: 50%;

          transform:
            translateY(-50%);

          z-index: 8;

          width: 28px;
          height: 28px;

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            rgba(255,255,255,0.88);

          border:
            1px solid
            rgba(99,102,241,0.18);

          box-shadow:
            0 2px 10px
            rgba(0,0,0,0.10);

          cursor: pointer;

          opacity: 0;

          transition:
            opacity .22s,
            transform .22s;
        }

        .pc-arrow-left {
          left: 9px;
        }

        .pc-arrow-right {
          right: 9px;
        }

        .pc-card:hover
        .pc-arrow {
          opacity: 1;
        }

        .pc-heart {
          position: absolute;

          top: 11px;
          right: 11px;

          z-index: 10;

          width: 33px;
          height: 33px;

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            rgba(255,255,255,0.90);

          border:
            1px solid
            rgba(99,102,241,0.14);

          box-shadow:
            0 2px 8px
            rgba(0,0,0,0.07);

          cursor: pointer;
        }

        .pc-heart.liked {
          background:
            #fff0f3;

          border-color:
            rgba(244,63,94,0.25);
        }

        @keyframes heartBeat {

          0% {
            transform: scale(1);
          }

          30% {
            transform: scale(1.4);
          }

          60% {
            transform: scale(.88);
          }

          100% {
            transform: scale(1);
          }

        }

        .heart-beat {
          animation:
            heartBeat .45s ease both;
        }

        .pc-badge {
          position: absolute;

          top: 11px;
          left: 11px;

          z-index: 10;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #2563eb
            );

          color: white;

          font-size: 8.5px;
          font-weight: 700;

          padding: 3px 9px;

          border-radius: 999px;

          box-shadow:
            0 3px 10px
            rgba(79,70,229,0.35);

          letter-spacing:
            .04em;

          text-transform:
            uppercase;
        }

        .pc-count-badge {
          position: absolute;

          bottom: 10px;
          right: 10px;

          z-index: 7;

          font-size: 9px;
          font-weight: 700;

          color:
            rgba(255,255,255,.80);

          background:
            rgba(15,14,42,.45);

          border-radius: 6px;

          padding: 2px 7px;
        }

        .price-text {
          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #2563eb
            );

          -webkit-background-clip:
            text;

          -webkit-text-fill-color:
            transparent;

          background-clip:
            text;
        }

        .btn-cart {
          width: 100%;

          display: flex;

          align-items: center;
          justify-content: center;

          gap: 7px;

          padding: 10px 0;

          border-radius: 13px;

          font-size: 13px;
          font-weight: 700;

          font-family:
            'Plus Jakarta Sans',
            sans-serif;

          border: none;

          cursor: pointer;

          transition:
            transform .20s,
            box-shadow .20s;
        }

        .btn-cart.new {
          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #2563eb
            );

          color: white;
        }

        .btn-cart.new:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 10px 28px
            rgba(79,70,229,.38);
        }

        .btn-cart.in-cart {
          background:
            #f0f4ff;

          border:
            1.5px solid
            rgba(99,102,241,.22);

          color:
            #4f46e5;
        }

      `}</style>


      <div
        className="pc-root pc-card"

        onMouseEnter={
          startAutoScroll
        }

        onMouseLeave={
          stopAutoScroll
        }
      >

        {/* =================================================
            IMAGE
        ================================================= */}

        <div
          className="relative overflow-hidden"

          style={{
            height:
              "clamp(160px,18vw,220px)",

            background:
              "#f8faff",
          }}

          onClick={
            openProduct
          }
        >

          {allImages.length > 0 ? (

            <div
              className="pc-img-track"

              style={{
                height: "100%",

                transform:
                  `translateX(-${
                    activeIdx * 100
                  }%)`,
              }}
            >

              {allImages.map(
                (src, i) => (

                  <div
                    key={`${src}-${i}`}
                    className="pc-img-slide"
                  >

                    {!imgLoaded[i] && (
                      <div
                        className="pc-skel"
                      />
                    )}

                    <img
                      src={src}

                      alt={
                        `${product.title} ${
                          i + 1
                        }`
                      }

                      loading="lazy"

                      className="pc-img"

                      style={{
                        opacity:
                          imgLoaded[i]
                            ? 1
                            : 0,
                      }}

                      onLoad={() =>
                        setImgLoaded(
                          (prev) => ({
                            ...prev,
                            [i]: true,
                          })
                        )
                      }

                      onError={(e) => {

                        e.currentTarget.src =
                          "https://via.placeholder.com/300x200?text=No+Image";

                        setImgLoaded(
                          (prev) => ({
                            ...prev,
                            [i]: true,
                          })
                        );

                      }}
                    />

                  </div>

                )
              )}

            </div>

          ) : (

            <div
              className="w-full h-full flex items-center justify-center text-slate-400"
            >
              No Image
            </div>

          )}


          {/* Quick View */}

          <div
            className="pc-overlay"
          >

            <button
              className="pc-quick-btn"

              onClick={(e) => {

                e.stopPropagation();

                openProduct();

              }}
            >
              <AiOutlineEye
                size={13}
              />

              Quick View
            </button>

          </div>


          {/* Arrows */}

          {allImages.length > 1 && (
            <>

              <button
                className="pc-arrow pc-arrow-left"

                onClick={prev}

                aria-label="Previous image"
              >
                <FaChevronLeft
                  size={10}
                  color="#4f46e5"
                />
              </button>


              <button
                className="pc-arrow pc-arrow-right"

                onClick={next}

                aria-label="Next image"
              >
                <FaChevronRight
                  size={10}
                  color="#4f46e5"
                />
              </button>


              <div
                className="pc-dots"
              >

                {allImages.map(
                  (_, i) => (

                    <button
                      key={i}

                      className={
                        `pc-dot ${
                          i === activeIdx
                            ? "active"
                            : ""
                        }`
                      }

                      onClick={(e) => {

                        e.stopPropagation();

                        setActiveIdx(i);

                      }}
                    />

                  )
                )}

              </div>


              <div
                className="pc-count-badge"
              >
                {activeIdx + 1}
                /
                {allImages.length}
              </div>

            </>
          )}


          {/* Featured */}

          <span
            className="pc-badge"
          >
            ✨ Featured
          </span>


          {/* Wishlist */}

          <button
            className={
              `pc-heart ${
                isLiked
                  ? "liked"
                  : ""
              }`
            }

            onClick={
              handleToggleWishlist
            }

            aria-label={
              isLiked
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
          >

            {isLiked ? (

              <FaHeart
                size={14}

                className={
                  heartAnim
                    ? "heart-beat"
                    : ""
                }

                style={{
                  color:
                    "#f43f5e",
                }}
              />

            ) : (

              <FaRegHeart
                size={14}

                className={
                  heartAnim
                    ? "heart-beat"
                    : ""
                }

                style={{
                  color:
                    "#94a3b8",
                }}
              />

            )}

          </button>

        </div>


        {/* =================================================
            PRODUCT INFORMATION
        ================================================= */}

        <div
          style={{
            padding:
              "10px 14px 13px",
          }}
        >

          {/* Title */}

          <h2
            style={{
              fontSize:
                "clamp(12.5px,1.4vw,14.5px)",

              fontWeight: 600,

              color: "#1e1b4b",

              lineHeight: 1.35,

              display:
                "-webkit-box",

              WebkitLineClamp: 2,

              WebkitBoxOrient:
                "vertical",

              overflow: "hidden",

              cursor: "pointer",

              marginBottom: 2,
            }}

            onClick={
              openProduct
            }
          >
            {product.title}
          </h2>


          {/* Brand */}

          {brandName && (

            <p
              style={{
                fontSize: 10.5,
                color: "#4f46e5",
                marginBottom: 4,
                fontWeight: 500,
              }}
            >
              by {brandName}
            </p>

          )}


          {/* Rating */}

          {ratingValue > 0 && (

            <div
              style={{
                display: "flex",
                alignItems:
                  "center",

                gap: 5,

                marginBottom: 5,
              }}
            >

              {[
                ...Array(5),
              ].map(
                (_, i) => (

                  <svg
                    key={i}

                    width="9"
                    height="9"

                    viewBox="0 0 24 24"

                    fill={
                      i <
                      Math.round(
                        ratingValue
                      )
                        ? "#fbbf24"
                        : "#e5e7eb"
                    }
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>

                )
              )}

              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#94a3b8",
                }}
              >
                {Number(
                  ratingValue
                ).toFixed(1)}
              </span>

            </div>

          )}


          {/* Price */}

          <div
            style={{
              display: "flex",
              alignItems:
                "baseline",

              gap: 2,

              marginBottom: 8,
            }}
          >

            <FaRupeeSign
              size={12}
              style={{
                color:
                  "#4f46e5",
              }}
            />

            <span
              className="price-text"

              style={{
                fontSize:
                  "clamp(1.1rem,2vw,1.4rem)",

                fontWeight: 800,

                lineHeight: 1,
              }}
            >
              {displayPrice.toLocaleString(
                "en-IN"
              )}
            </span>

          </div>


          {/* Cart */}

          <button
            className={
              `btn-cart ${
                isInCart
                  ? "in-cart"
                  : "new"
              }`
            }

            onClick={
              handleAddToCart
            }
          >

            <IoCartOutline
              size={15}
            />

            <span>
              {isInCart
                ? "Go to Cart"
                : "Add to Cart"}
            </span>

          </button>

        </div>

      </div>

    </>
  );
}

