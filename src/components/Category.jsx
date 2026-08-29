import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import {
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

import "swiper/css";

const ACCENTS = [
  { from: "#2874f0", to: "#60a5fa" },
  { from: "#f43f5e", to: "#fb7185" },
  { from: "#10b981", to: "#34d399" },
  { from: "#f59e0b", to: "#fbbf24" },
  { from: "#8b5cf6", to: "#a78bfa" },
  { from: "#06b6d4", to: "#22d3ee" },
];

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  "";

export default function Category() {
  const navigate = useNavigate();

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
     FETCH CATEGORIES
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${BACKEND_URL}/api/category`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to load categories"
          );
        }

        const received =
          Array.isArray(data?.categories)
            ? data.categories
            : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
            ? data
            : [];

        const parents =
          received
            .filter(
              (category) =>
                category?.isActive !== false &&
                (
                  category?.parentCategory === null ||
                  category?.parentCategory === undefined
                )
            )
            .sort(
              (a, b) =>
                (a?.displayOrder || 0) -
                (b?.displayOrder || 0)
            );

        if (mounted) {
          setCategories(parents);
        }
      } catch (err) {
        console.error(
          "CATEGORY FETCH ERROR:",
          err
        );

        if (mounted) {
          setError(
            err?.message ||
              "Unable to load categories"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, []);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <section className="w-full py-5">
        <div className="px-4">

          <div className="
            flex
            items-center
            justify-between
            mb-4
          ">
            <div className="space-y-2">
              <div className="
                h-2.5
                w-20
                rounded-full
                bg-gray-200
                animate-pulse
              " />

              <div className="
                h-6
                w-36
                rounded-md
                bg-gray-200
                animate-pulse
              " />
            </div>

            <div className="
              h-7
              w-14
              rounded-full
              bg-gray-100
              animate-pulse
            " />
          </div>

          <div className="
            flex
            gap-3
            overflow-hidden
          ">
            {[...Array(5)].map(
              (_, index) => (
                <div
                  key={index}
                  className="
                    min-w-[118px]
                    rounded-[18px]
                    border
                    border-gray-100
                    bg-white
                    p-2
                  "
                >
                  <div className="
                    aspect-square
                    rounded-[14px]
                    bg-gray-100
                    animate-pulse
                  " />

                  <div className="
                    mt-2.5
                    h-3
                    w-16
                    rounded
                    bg-gray-200
                    animate-pulse
                  " />

                  <div className="
                    mt-1.5
                    h-2
                    w-11
                    rounded
                    bg-gray-100
                    animate-pulse
                  " />
                </div>
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <section className="px-4 py-5">
        <div className="
          rounded-2xl
          border
          border-gray-100
          bg-white
          px-5
          py-6
          text-center
          shadow-sm
        ">
          <p className="
            text-sm
            font-semibold
            text-gray-800
          ">
            Categories unavailable
          </p>

          <p className="
            mt-1
            text-xs
            text-gray-500
          ">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="
              mt-4
              rounded-full
              bg-gray-900
              px-4
              py-2
              text-xs
              font-semibold
              text-white
            "
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (!categories.length) {
    return null;
  }

  /* =====================================================
     MAIN
  ===================================================== */

  return (
    <section className="
      w-full
      py-5
      sm:py-7
    ">

      <div className="
        px-4
        sm:px-6
        lg:px-8
      ">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="
          mb-3.5
          flex
          items-center
          justify-between
        ">

          <div>

            <div className="
              mb-1
              flex
              items-center
              gap-1.5
            ">
              <span className="
                h-1.5
                w-1.5
                rounded-full
                bg-indigo-500
              " />

              <span className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.15em]
                text-indigo-600
              ">
                Discover
              </span>
            </div>

            <h2 className="
              text-lg
              font-bold
              leading-tight
              tracking-tight
              text-gray-900
              sm:text-2xl
            ">
              Shop by category
            </h2>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/categories")
            }
            className="
              flex
              items-center
              gap-0.5
              rounded-full
              px-2.5
              py-1.5
              text-[11px]
              font-semibold
              text-indigo-600
              transition
              hover:bg-indigo-50
            "
          >
            View all
            <ChevronRight size={13} />
          </button>

        </div>


        {/* =================================================
            CATEGORY SWIPER
        ================================================= */}

        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          slidesPerView={2.75}
          speed={550}
          loop={categories.length > 5}
          grabCursor
          autoplay={{
            delay: 3200,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{

            /* Small phones */

            360: {
              slidesPerView: 2.7,
              spaceBetween: 9,
            },

            /* Normal phones */

            390: {
              slidesPerView: 2.9,
              spaceBetween: 10,
            },

            /* Large phones */

            480: {
              slidesPerView: 3.3,
              spaceBetween: 11,
            },

            /* Tablet */

            640: {
              slidesPerView: 4,
              spaceBetween: 12,
            },

            /* Small desktop */

            768: {
              slidesPerView: 5,
              spaceBetween: 14,
            },

            /* Desktop */

            1024: {
              slidesPerView: 6,
              spaceBetween: 14,
            },

            1280: {
              slidesPerView: 7,
              spaceBetween: 16,
            },
          }}
        >

          {categories.map(
            (item, index) => {

              const accent =
                ACCENTS[
                  index %
                    ACCENTS.length
                ];

              const name =
                item?.name
                  ?.replace(/-/g, " ")
                  ?.trim() ||
                "Category";

              const slug =
                item?.slug ||
                item?.name
                  ?.toLowerCase()
                  ?.trim()
                  ?.replace(
                    /\s+/g,
                    "-"
                  );

              return (
                <SwiperSlide
                  key={
                    item?._id ||
                    item?.slug ||
                    item?.name
                  }
                >

                  <button
                    type="button"
                    onClick={() => {
                      if (slug) {
                        navigate(
                          `/category/${slug}`
                        );
                      }
                    }}
                    className="
                      group
                      relative
                      w-full
                      overflow-hidden
                      rounded-[18px]
                      border
                      border-gray-100
                      bg-white
                      p-2
                      text-left
                      shadow-[0_2px_8px_rgba(0,0,0,0.035)]
                      transition-all
                      duration-200
                      active:scale-[0.96]
                      hover:-translate-y-0.5
                      hover:shadow-[0_7px_20px_rgba(0,0,0,0.08)]
                    "
                  >

                    {/* =================================================
                        IMAGE
                    ================================================= */}

                    <div
                      className="
                        relative
                        aspect-square
                        overflow-hidden
                        rounded-[14px]
                      "
                      style={{
                        background:
                          `linear-gradient(
                            145deg,
                            ${accent.from}0d,
                            ${accent.to}18
                          )`,
                      }}
                    >

                      {/* Glow */}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          -right-5
                          -top-5
                          h-14
                          w-14
                          rounded-full
                          blur-xl
                          opacity-50
                        "
                        style={{
                          background:
                            accent.to,
                        }}
                      />

                      {item?.image ? (
                        <img
                          src={item.image}
                          alt={name}
                          loading="lazy"
                          className="
                            relative
                            z-10
                            h-full
                            w-full
                            object-contain
                            p-2.5
                            transition-transform
                            duration-300
                            group-hover:scale-105
                          "
                        />
                      ) : (
                        <div className="
                          flex
                          h-full
                          items-center
                          justify-center
                          text-3xl
                        ">
                          🛍️
                        </div>
                      )}

                      {/* Desktop arrow */}

                      <span className="
                        absolute
                        right-1.5
                        top-1.5
                        z-20
                        hidden
                        h-5
                        w-5
                        items-center
                        justify-center
                        rounded-full
                        bg-white/90
                        text-gray-700
                        shadow-sm
                        sm:flex
                        sm:opacity-0
                        sm:transition-opacity
                        sm:group-hover:opacity-100
                      ">
                        <ArrowUpRight size={11} />
                      </span>

                    </div>


                    {/* =================================================
                        NAME
                    ================================================= */}

                    <div className="
                      px-0.5
                      pt-2
                      pb-0.5
                    ">

                      <h3 className="
                        truncate
                        text-[11px]
                        font-semibold
                        capitalize
                        leading-tight
                        text-gray-800
                        sm:text-xs
                      ">
                        {name}
                      </h3>

                      {typeof item?.productCount ===
                        "number" && (
                        <p className="
                          mt-1
                          truncate
                          text-[9px]
                          leading-none
                          text-gray-400
                        ">
                          {item.productCount}{" "}
                          {item.productCount ===
                          1
                            ? "product"
                            : "products"}
                        </p>
                      )}

                    </div>


                    {/* =================================================
                        ACCENT
                    ================================================= */}

                    <span
                      className="
                        absolute
                        bottom-0
                        left-3
                        right-3
                        h-[2px]
                        scale-x-0
                        rounded-full
                        transition-transform
                        duration-200
                        group-hover:scale-x-100
                      "
                      style={{
                        background:
                          `linear-gradient(
                            90deg,
                            ${accent.from},
                            ${accent.to}
                          )`,
                      }}
                    />

                  </button>

                </SwiperSlide>
              );
            }
          )}

        </Swiper>

      </div>
    </section>
  );
}

