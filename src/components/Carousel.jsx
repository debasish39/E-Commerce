import React, {
  useEffect,
  useCallback,
  useState,
} from "react";

import { getData } from "../context/DataContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

import {
  FaRupeeSign,
  FaStar,
  FaShoppingCart,
  FaFire,
  FaTruck,
  FaShieldAlt,
} from "react-icons/fa";

import { AiOutlineArrowRight } from "react-icons/ai";

import { toast } from "sonner";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Autoplay,
  Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import "./carousel.css";


/* =====================================================
   BADGES
===================================================== */

const BADGES = [
  {
    text: "DEAL OF THE DAY",
    icon: "⚡",
  },
  {
    text: "TOP DEAL",
    icon: "🔥",
  },
  {
    text: "BEST SELLER",
    icon: "🏆",
  },
  {
    text: "LIMITED OFFER",
    icon: "⏳",
  },
  {
    text: "TRENDING",
    icon: "📈",
  },
];


/* =====================================================
   ACCENTS
===================================================== */

const ACCENTS = [
  {
    primary: "#4f46e5",
    secondary: "#818cf8",
    soft: "rgba(99,102,241,.12)",
  },
  {
    primary: "#db2777",
    secondary: "#f472b6",
    soft: "rgba(236,72,153,.12)",
  },
  {
    primary: "#0891b2",
    secondary: "#22d3ee",
    soft: "rgba(6,182,212,.12)",
  },
  {
    primary: "#d97706",
    secondary: "#fbbf24",
    soft: "rgba(245,158,11,.12)",
  },
  {
    primary: "#7c3aed",
    secondary: "#a78bfa",
    soft: "rgba(139,92,246,.12)",
  },
];


/* =====================================================
   HELPERS
===================================================== */

const getVariants = (item) =>
  Array.isArray(item?.variants)
    ? item.variants
    : [];


const getFirstVariant = (item) =>
  getVariants(item)[0] || null;


const getProductPrice = (item) => {
  const variant =
    getFirstVariant(item);

  return Number(
    item?.price ??
      variant?.price ??
      0
  );
};


const getOriginalPrice = (item) => {
  const variant =
    getFirstVariant(item);

  return Number(
    item?.originalPrice ??
      variant?.originalPrice ??
      getProductPrice(item)
  );
};


const getDiscount = (item) => {
  const variant =
    getFirstVariant(item);

  const price =
    getProductPrice(item);

  const original =
    getOriginalPrice(item);

  const storedDiscount =
    Number(
      item?.offer?.enabled
        ? item?.offer?.value
        : variant?.discountPercentage ??
            0
    );

  if (
    storedDiscount > 0
  ) {
    return {
      pct: Math.round(
        storedDiscount
      ),
      original,
    };
  }

  if (
    original > price &&
    original > 0
  ) {
    return {
      pct: Math.round(
        ((original - price) /
          original) *
          100
      ),
      original,
    };
  }

  return {
    pct: 0,
    original: price,
  };
};


const getProductImage = (
  item
) => {
  const thumbnail =
    item?.media?.thumbnail;

  const images =
    item?.media?.images;

  if (thumbnail) {
    return thumbnail;
  }

  if (
    Array.isArray(images) &&
    images.length
  ) {
    return images[0];
  }

  if (item?.thumbnail) {
    return item.thumbnail;
  }

  return "/placeholder-product.png";
};


/* =====================================================
   COMPONENT
===================================================== */

export default function Carousel() {

  const {
    data,
    fetchAllProducts,
  } = getData();

  const {
    addToCart,
    cartItem,
  } = useCart();

  const navigate =
    useNavigate();


  /* =====================================================
     AUTH
  ===================================================== */

  const token =
    localStorage.getItem(
      "token"
    );

  const isSignedIn =
    Boolean(token);


  /* =====================================================
     LOAD PRODUCTS
  ===================================================== */

  useEffect(() => {

    if (
      !data ||
      data.length === 0
    ) {
      fetchAllProducts();
    }

  }, [data, fetchAllProducts]);


  const products =
    Array.isArray(data)
      ? data
      : [];


  /* =====================================================
     CART
  ===================================================== */

  const isInCart = useCallback(
    (item) =>
      cartItem.some(
        (cart) =>
          String(
            cart.productId
          ) ===
          String(item._id)
      ),
    [cartItem]
  );


  const handleCart =
    useCallback(
      (item, event) => {

        event?.stopPropagation();

        if (!isSignedIn) {

          toast.error(
            "Please login first"
          );

          setTimeout(() => {
            navigate("/sign-in");
          }, 300);

          return;
        }

        if (
          isInCart(item)
        ) {

          toast.info(
            "Already in cart 🛒"
          );

          setTimeout(() => {
            navigate("/cart");
          }, 150);

          return;
        }

        addToCart(item);

        toast.success(
          "Added to cart 🛒"
        );
      },
      [
        isSignedIn,
        isInCart,
        addToCart,
        navigate,
      ]
    );


  /* =====================================================
     EMPTY
  ===================================================== */

  if (!products.length) {
    return (
      <section className="
        flex
        min-h-[180px]
        items-center
        justify-center
        px-4
      ">
        <p className="
          text-sm
          text-gray-500
        ">
          No products available.
        </p>
      </section>
    );
  }


  /* =====================================================
     MAIN
  ===================================================== */

  return (
    <section className="
      relative
      w-full
      overflow-hidden
      bg-white
      py-3
      sm:py-5
    ">

      {/* =================================================
          OFFER HEADER
      ================================================= */}

      <div className="
        mx-3
        mb-3
        overflow-hidden
        rounded-2xl
        bg-gradient-to-r
        from-indigo-600
        via-blue-600
        to-violet-600
        px-3
        py-2.5
        shadow-[0_5px_20px_rgba(79,70,229,.16)]
        sm:mx-5
        sm:px-5
        sm:py-3
      ">

        <div className="
          flex
          items-center
          justify-between
          gap-2
        ">

          <div className="
            flex
            min-w-0
            items-center
            gap-2
          ">

            <span className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white/15
              text-sm
            ">
              ⚡
            </span>

            <div className="min-w-0">

              <p className="
                truncate
                text-[11px]
                font-extrabold
                uppercase
                tracking-wide
                text-white
                sm:text-sm
              ">
                Big Deals
              </p>

              <p className="
                truncate
                text-[9px]
                text-white/70
                sm:text-[11px]
              ">
                Great products. Better prices.
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
            className="
              flex
              shrink-0
              items-center
              gap-1
              rounded-full
              bg-white
              px-3
              py-1.5
              text-[10px]
              font-bold
              text-indigo-600
              shadow-sm
              transition
              active:scale-95
              sm:px-4
              sm:py-2
              sm:text-xs
            "
          >
            Shop now
            <AiOutlineArrowRight
              size={12}
            />
          </button>

        </div>

      </div>


      {/* =================================================
          PRODUCT CAROUSEL
      ================================================= */}

      <div className="
        px-3
        sm:px-5
      ">

        <Swiper
          modules={[
            Autoplay,
            Pagination,
          ]}
          slidesPerView={1.08}
          spaceBetween={10}
          loop={
            products.length > 2
          }
          speed={550}
          grabCursor
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{

            /* Small phone */

            360: {
              slidesPerView: 1.08,
              spaceBetween: 10,
            },

            /* Large phone */

            480: {
              slidesPerView: 1.2,
              spaceBetween: 12,
            },

            /* Tablet */

            640: {
              slidesPerView: 2,
              spaceBetween: 14,
            },

            /* Small desktop */

            768: {
              slidesPerView: 2,
              spaceBetween: 16,
            },

            /* Desktop */

            1024: {
              slidesPerView: 2.2,
              spaceBetween: 18,
            },

            1280: {
              slidesPerView: 2.5,
              spaceBetween: 20,
            },
          }}
          className="
            modern-product-swiper
            !pb-7
          "
        >

          {products.map(
            (item, index) => {

              const accent =
                ACCENTS[
                  index %
                    ACCENTS.length
                ];

              const badge =
                BADGES[
                  index %
                    BADGES.length
                ];

              const price =
                getProductPrice(
                  item
                );

              const {
                pct,
                original,
              } =
                getDiscount(item);

              const rating =
                Math.min(
                  5,
                  Math.max(
                    0,
                    Number(
                      item?.rating || 0
                    )
                  )
                );

              const added =
                isInCart(item);

              return (
                <SwiperSlide
                  key={item._id}
                >

                  <article
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-[22px]
                      border
                      border-gray-100
                      bg-white
                      shadow-[0_4px_18px_rgba(0,0,0,.055)]
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:shadow-[0_10px_30px_rgba(0,0,0,.09)]
                    "
                  >

                    {/* =================================================
                        BACKGROUND GLOW
                    ================================================= */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        -right-16
                        -top-16
                        h-44
                        w-44
                        rounded-full
                        blur-3xl
                      "
                      style={{
                        background:
                          accent.soft,
                      }}
                    />


                    {/* =================================================
                        PRODUCT IMAGE
                    ================================================= */}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/products/${item._id}`
                        )
                      }
                      className="
                        relative
                        block
                        w-full
                        focus:outline-none
                      "
                    >

                      <div
                        className="
                          relative
                          mx-2
                          mt-2
                          flex
                          h-[205px]
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-[18px]
                          sm:h-[250px]
                          md:h-[270px]
                        "
                        style={{
                          background:
                            `linear-gradient(
                              145deg,
                              ${accent.soft},
                              rgba(249,250,251,.85)
                            )`,
                        }}
                      >

                        {/* Badge */}

                        <div
                          className="
                            absolute
                            left-2.5
                            top-2.5
                            z-20
                            rounded-full
                            px-2.5
                            py-1
                            text-[8px]
                            font-extrabold
                            tracking-wide
                            text-white
                            shadow-sm
                            sm:text-[9px]
                          "
                          style={{
                            background:
                              accent.primary,
                          }}
                        >
                          {badge.icon}{" "}
                          {badge.text}
                        </div>


                        {/* Discount */}

                        {pct > 0 && (
                          <div className="
                            absolute
                            right-2.5
                            top-2.5
                            z-20
                            flex
                            items-center
                            gap-1
                            rounded-full
                            bg-white
                            px-2
                            py-1
                            text-[9px]
                            font-bold
                            text-rose-600
                            shadow-sm
                          ">
                            <FaFire
                              size={9}
                            />
                            {pct}% OFF
                          </div>
                        )}


                        {/* Product image */}

                        <img
                          src={getProductImage(
                            item
                          )}
                          alt={
                            item?.title ||
                            "Product"
                          }
                          loading={
                            index < 2
                              ? "eager"
                              : "lazy"
                          }
                          className="
                            relative
                            z-10
                            h-full
                            w-full
                            object-contain
                            p-7
                            transition-transform
                            duration-500
                            ease-out
                            group-hover:scale-105
                          "
                        />


                        {/* View */}

                        <span className="
                          absolute
                          bottom-2.5
                          right-2.5
                          z-20
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-full
                          bg-white/95
                          text-gray-700
                          opacity-0
                          shadow-md
                          transition
                          group-hover:opacity-100
                        ">
                          <AiOutlineArrowRight
                            size={13}
                          />
                        </span>

                      </div>

                    </button>


                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="
                      relative
                      z-10
                      p-3
                      sm:p-4
                    ">

                      {/* Brand */}

                      <p className="
                        truncate
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-gray-400
                        sm:text-[10px]
                      ">
                        {item?.brand ||
                          item?.category ||
                          "Featured"}
                      </p>


                      {/* Title */}

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/products/${item._id}`
                          )
                        }
                        className="
                          mt-1
                          block
                          w-full
                          truncate
                          text-left
                          text-sm
                          font-bold
                          leading-5
                          text-gray-900
                          transition-colors
                          hover:text-indigo-600
                          sm:text-base
                        "
                      >
                        {item?.title}
                      </button>


                      {/* Rating */}

                      <div className="
                        mt-1.5
                        flex
                        items-center
                        gap-1.5
                      ">

                        <div className="
                          flex
                          items-center
                          gap-0.5
                        ">
                          {[...Array(5)].map(
                            (_, star) => (
                              <FaStar
                                key={star}
                                size={10}
                                className={
                                  star <
                                  Math.round(
                                    rating
                                  )
                                    ? "text-amber-400"
                                    : "text-gray-200"
                                }
                              />
                            )
                          )}
                        </div>

                        <span className="
                          rounded-full
                          bg-emerald-50
                          px-1.5
                          py-0.5
                          text-[9px]
                          font-bold
                          text-emerald-600
                        ">
                          {rating.toFixed(1)}
                        </span>

                      </div>


                      {/* Price */}

                      <div className="
                        mt-2
                        flex
                        items-end
                        gap-2
                      ">

                        <span className="
                          flex
                          items-center
                          text-lg
                          font-extrabold
                          leading-none
                          text-gray-900
                          sm:text-xl
                        ">
                          <FaRupeeSign
                            size={12}
                            className="mr-0.5"
                          />

                          {price.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        {original >
                          price && (
                          <span className="
                            text-[10px]
                            text-gray-400
                            line-through
                          ">
                            ₹
                            {original.toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        )}

                        {pct > 0 && (
                          <span className="
                            text-[10px]
                            font-bold
                            text-emerald-600
                          ">
                            {pct}% off
                          </span>
                        )}

                      </div>


                      {/* Trust */}

                      <div className="
                        mt-2
                        flex
                        items-center
                        gap-2
                        overflow-hidden
                      ">

                        <span className="
                          flex
                          shrink-0
                          items-center
                          gap-1
                          text-[8px]
                          font-medium
                          text-gray-500
                          sm:text-[9px]
                        ">
                          <FaTruck
                            size={9}
                            className="text-emerald-500"
                          />
                          {item?.shipping
                            ?.freeShipping
                            ? "Free Delivery"
                            : "Delivery Available"}
                        </span>

                        <span className="
                          flex
                          shrink-0
                          items-center
                          gap-1
                          text-[8px]
                          font-medium
                          text-gray-500
                          sm:text-[9px]
                        ">
                          <FaShieldAlt
                            size={9}
                            className="text-indigo-500"
                          />
                          Secure
                        </span>

                      </div>


                      {/* CTA */}

                      <button
                        type="button"
                        onClick={(e) =>
                          added
                            ? navigate(
                                "/cart"
                              )
                            : handleCart(
                                item,
                                e
                              )
                        }
                        className="
                          mt-3
                          flex
                          h-10
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          text-xs
                          font-bold
                          text-white
                          shadow-sm
                          transition-all
                          duration-200
                          active:scale-[0.97]
                          sm:h-11
                          sm:text-sm
                        "
                        style={{
                          background:
                            `linear-gradient(
                              135deg,
                              ${accent.primary},
                              ${accent.secondary}
                            )`,
                        }}
                      >

                        <FaShoppingCart
                          size={13}
                        />

                        {added
                          ? "Go to Cart"
                          : "Add to Cart"}

                      </button>

                    </div>

                  </article>

                </SwiperSlide>
              );
            }
          )}

        </Swiper>

      </div>

    </section>
  );
}
