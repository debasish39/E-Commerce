import React from "react";

import {
  FaArrowLeft,
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";
import {ShoppingCart} from "lucide-react"
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";


export default function SearchNavbar() {

  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | CART CONTEXT
  |--------------------------------------------------------------------------
  */

  const {
    cartCount = 0,
  } = useCart();


  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const openSearch = () => {
    navigate("/search");
  };


  /*
  |--------------------------------------------------------------------------
  | CART
  |--------------------------------------------------------------------------
  */

  const openCart = () => {
    navigate("/cart");
  };


  /*
  |--------------------------------------------------------------------------
  | BACK
  |--------------------------------------------------------------------------
  */

  const goBack = () => {

    if (
      window.history.length > 1
    ) {
      navigate(-1);
    } else {
      navigate("/");
    }

  };


  return (
    <header
      className="
        fixed
        left-0
        right-0
        top-0
        z-50
        animate-[slideDown_0.45s_ease-out]
        border-b
        border-slate-200/70
        bg-white/90
        shadow-[0_8px_30px_rgba(15,23,42,0.06)]
        backdrop-blur-2xl
      "
    >

      {/* =================================================
          TOP ACCENT
      ================================================= */}

      <div
        className="
          absolute
          left-0
          right-0
          top-0
          h-[2px]
          origin-left
          bg-gradient-to-r
          from-indigo-500
          via-violet-500
          to-indigo-400
          animate-[growLine_0.7s_ease-out]
        "
      />


      {/* =================================================
          NAVBAR CONTAINER
      ================================================= */}

      <div
        className="
          mx-auto
          flex
          h-14
          max-w-7xl
          items-center
          gap-2
          px-3
          sm:px-5
        "
      >


        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={goBack}
          className="
            group
            relative
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            text-slate-600
            transition-all
            duration-300
            hover:bg-slate-100
            hover:text-slate-950
            active:scale-90
          "
          aria-label="Go back"
        >

          {/* Hover glow */}

          <span
            className="
              absolute
              inset-0
              scale-0
              rounded-xl
              bg-indigo-50
              transition-transform
              duration-300
              group-hover:scale-100
            "
          />

          <FaArrowLeft
            size={13}
            className="
              relative
              z-10
              transition-transform
              duration-300
              group-hover:-translate-x-0.5
            "
          />

        </button>


        {/* =================================================
            SEARCH
        ================================================= */}

        <button
          type="button"
          onClick={openSearch}
          className="
            group
            relative
            flex
            h-10
            min-w-0
            flex-1
            items-center
            gap-2.5
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-slate-50/90
            px-3
            text-left
            transition-all
            duration-300
            hover:border-indigo-200
            hover:bg-white
            hover:shadow-[0_6px_20px_rgba(99,102,241,0.10)]
            active:scale-[0.985]
          "
          aria-label="Search products"
        >

          {/* Animated background */}

          <span
            className="
              pointer-events-none
              absolute
              -left-10
              top-1/2
              h-20
              w-20
              -translate-y-1/2
              rounded-full
              bg-indigo-100/40
              blur-2xl
              opacity-0
              transition-all
              duration-500
              group-hover:left-1/4
              group-hover:opacity-100
            "
          />


          {/* Search icon */}

          <span
            className="
              relative
              z-10
              flex
              h-6
              w-6
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-white
              text-slate-400
              shadow-sm
              transition-all
              duration-300
              group-hover:scale-105
              group-hover:text-indigo-500
              group-hover:shadow-md
            "
          >

            <FaSearch
              size={10}
              className="
                transition-transform
                duration-300
                group-hover:scale-110
              "
            />

          </span>


          {/* Search text */}

          <span
            className="
              relative
              z-10
              min-w-0
              flex-1
              truncate
              text-[10px]
              font-semibold
              text-slate-400
              transition-colors
              duration-300
              group-hover:text-slate-500
              sm:text-xs
            "
          >
            Search products, brands & categories
          </span>


          {/* Search keyboard hint */}

          <span
            className="
              hidden
              shrink-0
              rounded-md
              border
              border-slate-200
              bg-white
              px-1.5
              py-1
              text-[7px]
              font-bold
              text-slate-400
              shadow-sm
              md:block
            "
          >
            SEARCH
          </span>

        </button>


        {/* =================================================
            CART
        ================================================= */}

        <button
          type="button"
          onClick={openCart}
          className="
            group
            relative
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            text-transparent
            bg-transparent
            shadow-[0_6px_18px_rgba(79,70,229,0.22)]
            transition-all
            duration-300
            
            hover:shadow-[0_8px_24px_rgba(79,70,229,0.32)]
            active:scale-90
          "
          aria-label={
            cartCount > 0
              ? `Shopping cart, ${cartCount} items`
              : "Shopping cart"
          }
        >

          {/* Cart glow */}

          <span
            className="
              pointer-events-none
              absolute
              inset-0
              rounded-xl
              bg-white/20
              opacity-0
              transition-opacity
              duration-300
              group-hover:opacity-100
            "
          />


          {/* Cart icon */}

          <ShoppingCart
            size={15}
            className="
              relative
              z-10
              transition-transform
              duration-300
              group-hover:scale-110
              group-hover:-rotate-3 text-2xl text-indigo-900
            "
          />


          {/* =================================================
              CART COUNT
          ================================================= */}

          {Number(cartCount) > 0 && (

            <span
              key={cartCount}
              className="
                absolute
                -right-1
                -top-1
                z-20
                flex
                h-[18px]
                min-w-[18px]
                items-center
                justify-center
                rounded-full
                border-2
                border-white
                bg-indigo-600
                px-1
                text-[8px]
                font-black
                leading-none
                text-white
                shadow-md
                animate-[cartBadge_0.35s_ease-out]
              "
            >

              {Number(cartCount) > 99
                ? "99+"
                : cartCount}

            </span>

          )}

        </button>

      </div>

      {/* =================================================
          ANIMATIONS
      ================================================= */}

      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-12px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes growLine {
            from {
              transform: scaleX(0);
            }

            to {
              transform: scaleX(1);
            }
          }

          @keyframes cartBadge {
            0% {
              opacity: 0;
              transform: scale(0.4);
            }

            60% {
              transform: scale(1.15);
            }

            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>

    </header>
  );
}