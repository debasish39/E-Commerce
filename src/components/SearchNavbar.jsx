import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaSearch,
} from "react-icons/fa";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { getData } from "../context/DataContext";

export default function SearchNavbar() {
  const navigate = useNavigate();

  const { cartCount = 0 } = useCart();

  const {
    search,
    setSearch,
  } = getData();

  // Navbar show / hide state
  const [showNavbar, setShowNavbar] = useState(true);

  // --------------------------------------------------
  // HIDE NAVBAR ON SCROLL DOWN
  // SHOW NAVBAR ON SCROLL UP
  // --------------------------------------------------
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navbar at the top
      if (currentScrollY <= 10) {
        setShowNavbar(true);
        lastScrollY = currentScrollY;
        return;
      }

      // Scrolling down
      if (
        currentScrollY > lastScrollY &&
        currentScrollY > 60
      ) {
        setShowNavbar(false);
      }

      // Scrolling up
      if (currentScrollY < lastScrollY) {
        setShowNavbar(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------
  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);

    navigate(
      value.trim()
        ? `/search?search=${encodeURIComponent(
            value.trim()
          )}`
        : "/search"
    );
  };

  // --------------------------------------------------
  // BACK
  // --------------------------------------------------
  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  // --------------------------------------------------
  // CART
  // --------------------------------------------------
  const openCart = () => {
    navigate("/cart");
  };

  return (
    <header
      className={`
        fixed
        left-0
        right-0
        top-0
        z-50
        border-b
        border-slate-200/70
        bg-white/80
        shadow-sm
        backdrop-blur-xl
        transition-transform
        duration-300
        ease-in-out
        ${
          showNavbar
            ? "translate-y-0"
            : "-translate-y-full"
        }
      `}
    >
      <div
        className="
          mx-auto
          flex
          h-16
          max-w-7xl
          items-center
          gap-2
          px-3
          sm:gap-3
          sm:px-5
          lg:px-6
        "
      >

        {/* ==========================================
            BACK BUTTON
        ========================================== */}
        <button
          type="button"
          onClick={goBack}
          aria-label="Go back"
          className="
            group
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-transparent
            text-slate-600
            transition-all
            duration-200
            hover:border-slate-200
            hover:bg-slate-100
            hover:text-indigo-700
            active:scale-95
          "
        >
          <FaArrowLeft
            size={13}
            className="
              transition-transform
              duration-200
              group-hover:-translate-x-0.5
            "
          />
        </button>

        {/* ==========================================
            SEARCH BAR
        ========================================== */}
        <div
          className="
            group
            flex
            h-11
            min-w-0
            flex-1
            items-center
            gap-2.5
            rounded-2xl
            border
            border-slate-200
            bg-slate-50/80
            px-3.5
            shadow-sm
            transition-all
            duration-200
            focus-within:border-indigo-300
            focus-within:bg-white
            focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.08)]
            sm:px-4
          "
        >
          {/* SEARCH ICON */}
          <FaSearch
            size={13}
            className="
              shrink-0
              text-slate-400
              transition-colors
              duration-200
              group-focus-within:text-indigo-500
            "
          />

          {/* SEARCH INPUT */}
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search products, brands & categories"
            className="
              min-w-0
              w-full
              bg-transparent
              text-sm
              font-medium
              text-slate-800
              placeholder:text-slate-400
              outline-none
              sm:text-[15px]
            "
          />

          {/* SEARCH LABEL */}
          <span
            className="
              hidden
              shrink-0
              items-center
              rounded-lg
              border
              border-slate-200
              bg-white
              px-2
              py-1
              text-[10px]
              font-semibold
              text-slate-400
              shadow-sm
              md:flex
            "
          >
            Search
          </span>
        </div>

        {/* ==========================================
            CART BUTTON
        ========================================== */}
        <button
          type="button"
          onClick={openCart}
          aria-label="Shopping cart"
          className="
            group
            relative
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-transparent
            text-indigo-900
            transition-all
            duration-200
            hover:border-indigo-100
            hover:bg-indigo-50
            active:scale-95
          "
        >
          {/* CART ICON */}
          <ShoppingCart
            size={19}
            strokeWidth={2}
            className="
              transition-transform
              duration-200
              group-hover:scale-105
            "
          />

          {/* CART COUNT */}
          {Number(cartCount) > 0 && (
            <span
              className="
                absolute
                -right-1
                -top-1
                flex
                h-[19px]
                min-w-[19px]
                items-center
                justify-center
                rounded-full
                bg-indigo-600
                px-1
                text-[9px]
                font-bold
                text-white
                shadow-md
                ring-2
                ring-white
              "
            >
              {Number(cartCount) > 99
                ? "99+"
                : cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}