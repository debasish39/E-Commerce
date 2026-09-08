import React, {
  useState,
  useEffect,
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
  FaShare
} from "react-icons/fa";

// import { FaShare } from "react-icons/ri";

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

  const [showProductModal, setShowProductModal] = useState(false);

  // Normal click opens the product page.
  // Holding the card for a moment opens the quick-view modal instead.
  const longPressTimer = useRef(null);
  const longPressTriggered = useRef(false);
  const pointerStart = useRef({ x: 0, y: 0 });

  const LONG_PRESS_MS = 650;


  /* ============================================================
     AUTH
     ============================================================ */

  const token =
    localStorage.getItem("token");

  const isSignedIn =
    Boolean(token);


  /* ============================================================
     CART / WISHLIST
     ============================================================ */

  const {
    addToCart,
    cartItem = [],
  } = useCart();

  const {
    wishlist = [],
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();


  /* ============================================================
     IMAGES
     ============================================================ */

  const allImages = useMemo(() => {

    const images = [];

    // Thumbnail
    if (
      product?.media?.thumbnail
    ) {
      images.push(
        product.media.thumbnail
      );
    }

    // Product images
    if (
      Array.isArray(
        product?.media?.images
      )
    ) {
      images.push(
        ...product.media.images
      );
    }

    // Variant images
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

    return [
      ...new Set(
        images.filter(Boolean)
      ),
    ];

  }, [product]);


  /* ============================================================
     PRICE
     ============================================================ */

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
          Number(
            variant?.price
          )
        )
        .filter(
          (price) =>
            !Number.isNaN(price) &&
            price >= 0
        );

    if (prices.length > 0) {
      return Math.min(...prices);
    }

    if (
      typeof product?.price ===
      "number"
    ) {
      return product.price;
    }

    return 0;

  }, [product]);


  /* ============================================================
     BRAND
     ============================================================ */

  const brandName =
    typeof product?.brand === "object"
      ? product.brand?.name
      : product?.brand;


  /* ============================================================
     RATING
     ============================================================ */

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


  /* ============================================================
     STATE
     ============================================================ */

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


  /* ============================================================
     AUTO IMAGE SCROLL
     ============================================================ */

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


  /* ============================================================
     IMAGE NAVIGATION
     ============================================================ */

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


  /* ============================================================
     CART STATUS
     ============================================================ */

  const isInCart =
    cartItem.some(
      (item) =>
        String(
          item.productId
        ) ===
        String(
          product._id
        )
    );


  /* ============================================================
     WISHLIST STATUS
     ============================================================ */

  const isLiked =
    wishlist.some(
      (item) =>
        String(
          item.productId
        ) ===
        String(
          product._id
        )
    );


  /* ============================================================
     ADD TO CART
     ============================================================ */

  const handleAddToCart = async (e) => {
    e?.stopPropagation();

      if (!isSignedIn) {

        toast.error(
          "Please login first"
        );

        navigate(
          "/sign-in"
        );

        return;
      }


      if (isInCart) {

        navigate(
          "/cart"
        );

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


  /* ============================================================
     WISHLIST
     ============================================================ */

  const handleToggleWishlist =
    async (e) => {

      e.stopPropagation();


      if (!isSignedIn) {

        toast.error(
          "Please login first"
        );

        navigate(
          "/sign-in"
        );

        return;
      }


      setHeartAnim(true);

      setTimeout(() => {
        setHeartAnim(false);
      }, 500);


      try {

        if (isLiked) {

          await removeFromWishlist(
            String(
              product._id
            )
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


  /* ============================================================
     PRODUCT DETAILS
     ============================================================ */

  const openProduct = () => {
    navigate(`/products/${product._id}`);
  };

  const handleShare = async (e) => {
    e?.stopPropagation();

    const shareUrl = `${window.location.origin}/products/${product?._id}`;
    const shareTitle = product?.title || "Product";
    const shareText = `Check out ${shareTitle} on Odikart`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Product link copied");
        return;
      }

      toast.info("Copy the product URL to share");
    } catch (error) {
      if (error?.name !== "AbortError") {
        toast.error("Unable to share product");
      }
    }
  };

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handlePointerDown = useCallback((e) => {
    // Only start a long press for the primary pointer.
    if (e.pointerType === "mouse" && e.button !== 0) return;

    clearLongPress();

    longPressTriggered.current = false;
    pointerStart.current = {
      x: e.clientX,
      y: e.clientY,
    };

    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      setShowProductModal(true);
    }, LONG_PRESS_MS);
  }, [clearLongPress]);

  const handlePointerMove = useCallback((e) => {
    const dx = Math.abs(e.clientX - pointerStart.current.x);
    const dy = Math.abs(e.clientY - pointerStart.current.y);

    // Moving means the user is scrolling/dragging, not long-pressing.
    if (dx > 10 || dy > 10) {
      clearLongPress();
    }
  }, [clearLongPress]);

  const handlePointerUp = useCallback(() => {
    clearLongPress();
  }, [clearLongPress]);

  const handlePointerCancel = useCallback(() => {
    clearLongPress();
  }, [clearLongPress]);

  const handleCardClick = useCallback(() => {
    // A long press has already opened the modal.
    // Do not navigate to the product page afterward.
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }

    openProduct();
  }, [product?._id]);

  const closeProductModal = () => {
    setShowProductModal(false);
  };


  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!showProductModal) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeProductModal();
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [showProductModal]);


  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <>

      <style>{`

        @import url(
          'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
        );


        /* =====================================================
           ROOT
           ===================================================== */

        .pc-root {
          font-family:
            'Plus Jakarta Sans',
            sans-serif;

          width: 100%;
        }


        /* =====================================================
           SMALL MODERN CARD
           ===================================================== */

        .pc-card {
          position: relative;

          width: 100%;

          overflow: hidden;

          cursor: pointer;

          background:
            #ffffff;

          border:
            1px solid
            rgba(99,102,241,.10);

          border-radius:
            16px;

          box-shadow:
            0 4px 16px
            rgba(15,23,42,.055);

          transition:
            transform .22s ease,
            box-shadow .22s ease,
            border-color .22s ease;
        }


        .pc-card:hover {
          transform:
            translateY(-3px);

          border-color:
            rgba(99,102,241,.18);

          box-shadow:
            0 10px 25px
            rgba(79,70,229,.10);
        }


        /* =====================================================
           IMAGE AREA
           ===================================================== */

        .pc-image-area {
          position: relative;

          height: 145px;

          overflow: hidden;

          background:
            radial-gradient(
              circle at 50% 25%,
              rgba(99,102,241,.08),
              transparent 60%
            ),
            #f8faff;
        }


        /* =====================================================
           IMAGE TRACK
           ===================================================== */

        .pc-img-track {
          display: flex;

          width: 100%;

          height: 100%;

          will-change:
            transform;

          transition:
            transform .42s
            cubic-bezier(
              .22,
              1,
              .36,
              1
            );
        }


        .pc-img-slide {
          flex:
            0 0 100%;

          width: 100%;

          height: 100%;

          display: flex;

          align-items:
            center;

          justify-content:
            center;
        }


        .pc-img {
          width: 100%;

          height: 100%;

          object-fit:
            contain;

          padding:
            8px;

          user-select:
            none;

          -webkit-user-drag:
            none;

          transition:
            transform .35s ease,
            opacity .25s ease;
        }


        .pc-card:hover
        .pc-img {
          transform:
            scale(1.045);
        }


        /* =====================================================
           IMAGE SKELETON
           ===================================================== */

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
          position:
            absolute;

          inset:
            0;

          background:
            linear-gradient(
              90deg,
              #f1f3ff 25%,
              #e5e7ff 50%,
              #f1f3ff 75%
            );

          background-size:
            200% 100%;

          animation:
            pcSkel
            1.4s
            ease-in-out
            infinite;
        }


        /* =====================================================
           FEATURED BADGE
           ===================================================== */

        .pc-badge {
          position:
            absolute;

          top:
            7px;

          left:
            7px;

          z-index:
            10;

          display:
            inline-flex;

          align-items:
            center;

          padding:
            3px 7px;

          border-radius:
            999px;

          background:
            rgba(255,255,255,.90);

          backdrop-filter:
            blur(8px);

          -webkit-backdrop-filter:
            blur(8px);

          border:
            1px solid
            rgba(99,102,241,.10);

          color:
            #4f46e5;

          font-size:
            7px;

          font-weight:
            800;

          letter-spacing:
            .04em;

          text-transform:
            uppercase;
        }


        /* =====================================================
           WISHLIST
           ===================================================== */

        .pc-heart {
          position:
            absolute;

          top:
            7px;

          right:
            7px;

          z-index:
            20;

          width:
            28px;

          height:
            28px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            50%;

          background:
            rgba(255,255,255,.92);

          backdrop-filter:
            blur(8px);

          -webkit-backdrop-filter:
            blur(8px);

          border:
            1px solid
            rgba(15,23,42,.06);

          box-shadow:
            0 3px 9px
            rgba(15,23,42,.09);

          cursor:
            pointer;

          transition:
            transform .18s ease,
            background .18s ease;
        }


        .pc-heart:hover {
          transform:
            scale(1.08);

          background:
            #ffffff;
        }


        .pc-heart.liked {
          background:
            #fff1f4;

          border-color:
            rgba(244,63,94,.15);
        }


        /* =====================================================
           HEART ANIMATION
           ===================================================== */

        @keyframes heartBeat {

          0% {
            transform:
              scale(1);
          }

          30% {
            transform:
              scale(1.35);
          }

          60% {
            transform:
              scale(.90);
          }

          100% {
            transform:
              scale(1);
          }

        }


        .heart-beat {
          animation:
            heartBeat
            .45s
            ease
            both;
        }


        /* =====================================================
           ARROWS
           ===================================================== */

     


        /* =====================================================
           IMAGE DOTS
           ===================================================== */

        .pc-dots {
          position:
            absolute;

          left:
            50%;

          bottom:
            7px;

          z-index:
            15;

          display:
            flex;

          align-items:
            center;

          gap:
            3px;

          transform:
            translateX(-50%);

          padding:
            3px 6px;

          border-radius:
            999px;

          background:
            rgba(15,23,42,.18);

          backdrop-filter:
            blur(7px);
        }


        .pc-dot {
          width:
            4px;

          height:
            4px;

          padding:
            0;

          border:
            0;

          border-radius:
            999px;

          background:
            rgba(255,255,255,.60);

          cursor:
            pointer;

          transition:
            width .22s ease,
            background .22s ease;
        }


        .pc-dot.active {
          width:
            12px;

          background:
            #ffffff;
        }


        /* =====================================================
           IMAGE COUNT
           ===================================================== */

        .pc-count-badge {
          position:
            absolute;

          right:
            7px;

          bottom:
            7px;

          z-index:
            15;

          padding:
            3px 6px;

          border-radius:
            7px;

          background:
            rgba(15,23,42,.42);

          backdrop-filter:
            blur(7px);

          color:
            #ffffff;

          font-size:
            7px;

          font-weight:
            700;
        }


        /* =====================================================
           QUICK VIEW
           ===================================================== */

        .pc-overlay {
          position:
            absolute;

          inset:
            0;

          z-index:
            8;

          display:
            flex;

          align-items:
            flex-end;

          justify-content:
            center;

          padding-bottom:
            11px;

          background:
            linear-gradient(
              to bottom,
              transparent 45%,
              rgba(15,23,42,.28)
            );

          opacity:
            0;

          transition:
            opacity .22s ease;

          pointer-events:
            none;
        }


        .pc-card:hover
        .pc-overlay {
          opacity:
            1;
        }


        .pc-quick-btn {
          display:
            inline-flex;

          align-items:
            center;

          justify-content:
            center;

          gap:
            5px;

          padding:
            5px 11px;

          border:
            0;

          border-radius:
            999px;

          background:
            rgba(255,255,255,.94);

          color:
            #312e81;

          font-size:
            9px;

          font-weight:
            700;

          box-shadow:
            0 5px 15px
            rgba(15,23,42,.14);

          transform:
            translateY(7px);

          opacity:
            0;

          cursor:
            pointer;

          transition:
            transform .22s ease,
            opacity .22s ease;
        }


        .pc-card:hover
        .pc-quick-btn {
          transform:
            translateY(0);

          opacity:
            1;

          pointer-events:
            auto;
        }


        /* =====================================================
           PRODUCT INFO
           ===================================================== */

        .pc-info {
          padding:
            9px 10px 10px;
        }


        /* =====================================================
           TITLE
           ===================================================== */

        .pc-title {
          margin:
            0;

          font-size:
            12px;

          line-height:
            1.35;

          font-weight:
            700;

          color:
            #1e1b4b;

          display:
            -webkit-box;

          -webkit-line-clamp:
            2;

          -webkit-box-orient:
            vertical;

          overflow:
            hidden;

          cursor:
            pointer;

          transition:
            color .18s ease;
        }


        .pc-title:hover {
          color:
            #4f46e5;
        }


        /* =====================================================
           BRAND
           ===================================================== */

        .pc-brand {
          margin-top:
            3px;

          margin-bottom:
            4px;

          font-size:
            8.5px;

          font-weight:
            600;

          color:
            #818cf8;
        }


        /* =====================================================
           RATING
           ===================================================== */

        .pc-rating {
          display:
            inline-flex;

          align-items:
            center;

          gap:
            3px;

          margin-bottom:
            5px;

          padding:
            2px 5px;

          border-radius:
            999px;

          background:
            #f8fafc;

          border:
            1px solid
            #eef2ff;
        }


        .pc-rating-stars {
          display:
            flex;

          align-items:
            center;

          gap:
            0;
        }


        .pc-rating-value {
          font-size:
            8px;

          font-weight:
            700;

          color:
            #64748b;
        }


        /* =====================================================
           PRICE
           ===================================================== */

        .pc-price-row {
          display:
            flex;

          align-items:
            baseline;

          gap:
            3px;

          margin-bottom:
            7px;
        }


        .pc-price-symbol {
          color:
            #4f46e5;

          font-size:
            10px;

          font-weight:
            800;
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

          font-size:
            15px;

          font-weight:
            800;

          line-height:
            1;
        }


        /* =====================================================
           CART BUTTON
           ===================================================== */

        .btn-cart {
          width:
            100%;

          min-height:
            32px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          gap:
            5px;

          padding:
            6px 8px;

          border:
            0;

          border-radius:
            9px;

          font-family:
            'Plus Jakarta Sans',
            sans-serif;

          font-size:
            9.5px;

          font-weight:
            800;

          cursor:
            pointer;

          transition:
            transform .18s ease,
            box-shadow .18s ease,
            background .18s ease;
        }


        .btn-cart.new {
          color:
            #ffffff;

          background:
            linear-gradient(
              135deg,
              #6366f1,
              #4f46e5
            );

          box-shadow:
            0 4px 12px
            rgba(79,70,229,.18);
        }


        .btn-cart.new:hover {
          transform:
            translateY(-1px);

          box-shadow:
            0 7px 16px
            rgba(79,70,229,.25);
        }


        .btn-cart.in-cart {
          color:
            #4f46e5;

          background:
            #f3f5ff;

          border:
            1px solid
            rgba(99,102,241,.13);
        }


        .btn-cart.in-cart:hover {
          background:
            #eef2ff;

          transform:
            translateY(-1px);
        }


        /* =====================================================
           MOBILE
           ===================================================== */

        @media (max-width: 640px) {

          .pc-card {
            border-radius:
              14px;
          }


          .pc-image-area {
            height:
              135px;
          }


          .pc-img {
            padding:
              7px;
          }


          .pc-heart {
            width:
              27px;

            height:
              27px;
          }


          .pc-arrow {
            opacity:
              1;

            width:
              23px;

            height:
              23px;
          }


          .pc-overlay {
            display:
              none;
          }


          .pc-info {
            padding:
              8px 9px 9px;
          }


          .pc-title {
            font-size:
              11.5px;
          }


          .pc-brand {
            font-size:
              8px;
          }


          .price-text {
            font-size:
              14px;
          }


          .btn-cart {
            min-height:
              31px;

            font-size:
              9px;
          }

        }


        /* =====================================================
           REDUCED MOTION
           ===================================================== */

        @media (
          prefers-reduced-motion: reduce
        ) {

          .pc-card,
          .pc-img,
          .pc-img-track,
          .pc-arrow,
          .pc-heart,
          .btn-cart {
            transition:
              none !important;
          }

        }

        /* =====================================================
           PRODUCT DETAILS MODAL
           Mobile-first / Play Store style
           ===================================================== */
        .pc-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(0, 0, 0, .72);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          animation: pc-modal-fade .18s ease;
        }
        .pc-modal-shell { display: flex; flex-direction: column; align-items: center; max-width: 100%; }

        .pc-modal {
          position: relative;
          width: min(920px, 100%);
          max-height: calc(100vh - 32px);
          overflow: hidden;
          border-radius: 28px;
          background: #fff;
          box-shadow: 0 25px 70px rgba(0,0,0,.32);
          animation: pc-modal-up .22s cubic-bezier(.22, 1, .36, 1);
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr);
        }
        .pc-modal-close {
          position: absolute; top: 12px; right: 12px; z-index: 20;
          width: 36px; height: 36px; display: grid; place-items: center;
          border: 0; border-radius: 50%; background: rgba(255,255,255,.94);
          color: #111827; font-size: 24px; line-height: 1; cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,.12);
        }
        .pc-modal-image-wrap {
          position: relative; min-width: 0; min-height: 420px;
          display: flex; align-items: center; justify-content: center;
          padding: 24px; background: #fff;
          overflow: visible;
        }
        .pc-modal-image {
          display: block; width: 100%; height: min(62vh, 520px);
          object-fit: contain; border-radius: 18px; user-select: none;
          -webkit-user-drag: none;
        }
        .pc-modal-no-image {
          width: 100%; height: 420px; display: grid; place-items: center;
          color: #94a3b8; font-size: 14px; background: #f8fafc; border-radius: 18px;
        }
        .pc-modal-thumbs {
          position: absolute; left: 24px; right: 24px; bottom: 14px;
          display: flex; justify-content: center; gap: 7px; overflow-x: auto;
          scrollbar-width: none;
        }
        .pc-modal-thumbs::-webkit-scrollbar { display: none; }
        .pc-modal-thumb {
          flex: 0 0 44px; width: 44px; height: 44px; padding: 2px;
          border: 2px solid #e5e7eb; border-radius: 9px; background: #fff;
          cursor: pointer; overflow: hidden;
        }
        .pc-modal-thumb.active { border-color: #ec4899; box-shadow: 0 0 0 2px rgba(236,72,153,.12); }
        .pc-modal-thumb img { width: 100%; height: 100%; object-fit: contain; display: block; }
        .pc-modal-content { min-width: 0; overflow-y: auto; padding: 44px 30px 30px; }
        .pc-modal-topline { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px; }
        .pc-modal-featured { display: inline-flex; padding: 5px 9px; border-radius: 999px; background: #fdf2f8; color: #db2777; font-size: 10px; font-weight: 800; }
        .pc-modal-rating { color: #64748b; font-size: 12px; font-weight: 700; }
        .pc-modal-title { margin: 0; color: #111827; font-size: clamp(21px, 3vw, 30px); line-height: 1.25; font-weight: 800; }
        .pc-modal-brand { margin: 8px 0 0; color: #64748b; font-size: 13px; }
        .pc-modal-price { display: flex; align-items: center; gap: 3px; margin-top: 18px; color: #111827; font-size: 23px; font-weight: 800; }
        .pc-modal-description { margin: 18px 0 0; color: #64748b; font-size: 13px; line-height: 1.65; white-space: pre-line; }
        .pc-modal-share-outside {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          margin-top: 12px;
          padding: 0;
          border: 0;
          background: transparent;
          color: white;
          cursor: pointer;
          transition: transform .18s ease, opacity .18s ease;
          filter: drop-shadow(0 5px 12px rgba(79,70,229,.22));
        }
        .pc-modal-share-outside svg {
          color: blue;
        }
        .pc-modal-share-outside:hover {
          transform: translateY(-2px) scale(1.06);
          opacity: .9;
        }
        .pc-modal-share-outside:active {
          transform: scale(.94);
        }
                .pc-modal-cart { width: 100%; margin-top: 24px; min-height: 46px; justify-content: center; }
        .pc-modal-title-only { padding-top: 46px; padding-bottom: 28px; }
        .pc-modal-title-only .pc-modal-title { text-align: center; }
        @keyframes pc-modal-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pc-modal-up { from { opacity: 0; transform: translateY(14px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media (max-width: 700px) {
          .pc-modal-backdrop { padding: 0; align-items: center; justify-content: center; background: rgba(0,0,0,.74); }
          .pc-modal { display: block; width: min(86vw, 580px); max-height: 82vh; overflow: visible; border-radius: 30px; background: #fff; }
          .pc-modal-close { top: 10px; right: 10px; width: 34px; height: 34px; font-size: 22px; }
          .pc-modal-image-wrap { display: block; min-height: 0; padding: 24px 24px 0; border-radius: 30px 30px 0 0; background: #fff; }
          .pc-modal-image { width: 100%; height: auto; aspect-ratio: 1 / 1; object-fit: cover; border-radius: 18px; }
          .pc-modal-no-image { height: auto; aspect-ratio: 1 / 1; border-radius: 18px; }
          .pc-modal-thumbs { position: static; margin: 10px 0 0; padding-bottom: 0; }
          .pc-modal-content { position: relative; overflow: visible; padding: 54px 26px 24px; border-radius: 0 0 30px 30px; background: #fff; }
          .pc-modal-title-only { padding: 52px 26px 26px; }
          .pc-modal-title-only .pc-modal-title { text-align: center; }
          .pc-modal-topline { margin: 0 0 10px; }
          .pc-modal-featured, .pc-modal-rating { display: none; }
          .pc-modal-share-outside { margin-top: 10px; width: 50px; height: 50px; }
          .pc-modal-title { text-align: left; font-size: clamp(18px, 5vw, 24px); line-height: 1.3; }
          .pc-modal-brand { font-size: 12px; }
          .pc-modal-price { margin-top: 10px; font-size: 19px; }
          .pc-modal-description { margin-top: 10px; font-size: 12px; line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
          .pc-modal-cart { margin-top: 16px; min-height: 42px; }
        }
      `}</style>


      {/* =====================================================
          CARD
          ===================================================== */}

      <div
        className="pc-root pc-card"

        onClick={handleCardClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerCancel}

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
          className="pc-image-area"

          onClick={handleCardClick}
        >


          {allImages.length > 0 ? (

            <div
              className="pc-img-track"

              style={{
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
                        `${product?.title || "Product"} ${
                          i + 1
                        }`
                      }

                      loading={i === 0 ? "eager" : "lazy"}
                      fetchPriority={i === 0 ? "high" : "auto"}
                      decoding="async"

                      draggable="false"

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
              className="
                w-full
                h-full
                flex
                items-center
                justify-center
                text-slate-400
                text-xs
              "
            >
              No Image
            </div>

          )}


          {/* =================================================
              QUICK VIEW
              ================================================= */}

          {/* <div
            className="pc-overlay"
          >

            <button
              type="button"

              className="pc-quick-btn"

              onClick={(e) => {

                e.stopPropagation();

                openProduct();

              }}
            >

              <AiOutlineEye
                size={12}
              />

              Quick View

            </button>

          </div> */}


          {/* =================================================
              ARROWS
              ================================================= */}

          {allImages.length > 1 && (
            <>

              <button
                type="button"

                className="
                  pc-arrow
                  pc-arrow-left
                "

                onClick={
                  prev
                }

                aria-label="
                  Previous image
                "
              >

                <FaChevronLeft
                  size={8}
                  color="#4f46e5"
                />

              </button>


              <button
                type="button"

                className="
                  pc-arrow
                  pc-arrow-right
                "

                onClick={
                  next
                }

                aria-label="
                  Next image
                "
              >

                <FaChevronRight
                  size={8}
                  color="#4f46e5"
                />

              </button>


              {/* IMAGE DOTS */}

              <div
                className="pc-dots"
              >

                {allImages.map(
                  (_, i) => (

                    <button
                      key={i}

                      type="button"

                      className={
                        `pc-dot ${
                          i === activeIdx
                            ? "active"
                            : ""
                        }`
                      }

                      aria-label={
                        `Show image ${
                          i + 1
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


              {/* IMAGE COUNT */}

              <div
                className="
                  pc-count-badge
                "
              >
                {activeIdx + 1}
                /
                {allImages.length}
              </div>

            </>
          )}


          {/* =================================================
              FEATURED
              ================================================= */}

          <span
            className="pc-badge"
          >
            ✨ Featured
          </span>


          {/* =================================================
              WISHLIST
              ================================================= */}

          <button
            type="button"

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
                size={12}

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
                size={12}

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
          className="pc-info"
        >


          {/* TITLE */}

          <h2
            className="pc-title"

            onClick={handleCardClick}
          >
            {product?.title}
          </h2>


          {/* BRAND */}

          {brandName && (

            <p
              className="pc-brand"
            >
              by {brandName}
            </p>

          )}


          {/* RATING */}

          {ratingValue > 0 && (

            <div
              className="pc-rating"
            >

              <div
                className="
                  pc-rating-stars
                "
              >

                {[
                  ...Array(5),
                ].map(
                  (_, i) => (

                    <svg
                      key={i}

                      width="8"
                      height="8"

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

                      <path
                        d="
                          M12 2
                          l3.09 6.26
                          L22 9.27
                          l-5 4.87
                          1.18 6.88
                          L12 17.77
                          l-6.18 3.25
                          L7 14.14
                          2 9.27
                          l6.91-1.01
                          L12 2z
                        "
                      />

                    </svg>

                  )
                )}

              </div>


              <span
                className="
                  pc-rating-value
                "
              >
                {Number(
                  ratingValue
                ).toFixed(1)}
              </span>

            </div>

          )}


          {/* PRICE */}

          <div
            className="
              pc-price-row
            "
          >

            <FaRupeeSign
              className="
                pc-price-symbol
              "

              size={10}
            />

            <span
              className="
                price-text
              "
            >
              {displayPrice.toLocaleString(
                "en-IN"
              )}
            </span>

          </div>


          {/* CART */}

          <button
            type="button"

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
              size={13}
            />

            <span>
              {isInCart
                ? "Go to Cart"
                : "Add to Cart"}
            </span>

          </button>

        </div>

      </div>

      {/* =====================================================
          PRODUCT DETAILS MODAL
          ===================================================== */}
      {showProductModal && (
        <div className="pc-modal-backdrop" role="dialog" aria-modal="true"
          aria-label={`${product?.title || "Product"} details`} onClick={closeProductModal}>
          <div className="pc-modal-shell" onClick={(e) => e.stopPropagation()}>
          <div className="pc-modal">
            <button type="button" className="pc-modal-close" onClick={closeProductModal} aria-label="Close product details">×</button>

            <div className="pc-modal-image-wrap">
              {allImages.length > 0 ? (
                <img src={allImages[activeIdx] || allImages[0]} alt={product?.title || "Product"}
                  className="pc-modal-image" draggable="false" />
              ) : <div className="pc-modal-no-image">No Image</div>}

              {allImages.length > 1 && (
                <div className="pc-modal-thumbs">
                  {allImages.map((src, i) => (
                    <button key={`${src}-modal-${i}`} type="button"
                      className={`pc-modal-thumb ${i === activeIdx ? "active" : ""}`}
                      onClick={() => setActiveIdx(i)} aria-label={`Show product image ${i + 1}`}>
                      <img src={src} alt="" draggable="false" />
                    </button>
                  ))}
                </div>
              )}

            </div>

            <div className="pc-modal-content pc-modal-title-only">
              <h2 className="pc-modal-title">{product?.title}</h2>

            </div>
          </div>
          <button
            type="button"
            className="pc-modal-share-outside"
            onClick={handleShare}
            aria-label="Share product"
          >
            <FaShare size={30} />
          </button>
          </div>
        </div>
      )}



    </>
  );
}
