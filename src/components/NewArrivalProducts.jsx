import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FaStar,
   FaMagic,
  FaEye,
} from "react-icons/fa";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL;

export default function NewArrivalProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     FETCH NEW ARRIVALS
  ===================================================== */

  const fetchNewArrivals = useCallback(async () => {
    console.log("");
    console.log("==========================================");
    console.log("✨ NEW ARRIVALS FETCH START");

    const url =
      `${BACKEND_URL}/api/products/new-arrivals`;

    console.log("✨ API URL:", url);

    try {
      setLoading(true);
      setError("");

      const response = await fetch(url, {
        method: "GET",

        headers: {
          Accept: "application/json",
        },
      });

      console.log(
        "🟢 New Arrivals status:",
        response.status
      );

      console.log(
        "🟢 New Arrivals OK:",
        response.ok
      );

      const data = await response.json();

      console.log(
        "🟢 New Arrivals response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `HTTP ${response.status}`
        );
      }

      const list = Array.isArray(data?.products)
        ? data.products
        : [];

      console.log(
        "✨ New Arrivals count:",
        list.length
      );

      console.log(
        "✨ New Arrivals products:",
        list
      );

      setProducts(list);
    } catch (error) {
      console.error(
        "🔴 NEW ARRIVALS ERROR:",
        error
      );

      setError(
        error?.message ||
          "Failed to load new arrivals"
      );

      setProducts([]);
    } finally {
      setLoading(false);

      console.log(
        "✨ NEW ARRIVALS FETCH END"
      );

      console.log(
        "=========================================="
      );
    }
  }, []);

  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    console.log(
      "🟣 NewArrivalProducts mounted"
    );

    fetchNewArrivals();

    return () => {
      console.log(
        "🟣 NewArrivalProducts unmounted"
      );
    };
  }, [fetchNewArrivals]);

  /* =====================================================
     IMAGE
  ===================================================== */

  const getImage = (product) => {
    return (
      product?.media?.thumbnail ||
      product?.media?.images?.[0] ||
      product?.variants?.[0]?.images?.[0] ||
      "https://via.placeholder.com/400x400?text=Product"
    );
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
    console.log(
      "🟣 New Arrival clicked:",
      product?._id
    );

    if (!product?._id) {
      console.error(
        "❌ Product ID missing"
      );

      return;
    }

    navigate(
      `/products/${product._id}`
    );
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-1.5 sm:px-4 py-8">

        <div className="
          flex
          items-center
          justify-between
          mb-6
        ">
          <h2 className="
            text-xl
            sm:text-3xl
            font-bold
            flex
            items-center
            gap-2
          ">
            <FaMagic className="text-indigo-500" />
            New Arrivals
          </h2>
        </div>

        <div className="
          grid
          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-4
          gap-1.5
          sm:gap-3
        ">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="
                h-72
                rounded-2xl
                bg-gray-100
                animate-pulse
              "
            />
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
      <section className="max-w-7xl mx-auto px-4 py-8">

        <div className="
          rounded-2xl
          border
          border-red-100
          bg-red-50
          p-8
          text-center
        ">

          <FaMagic
            className="mx-auto text-red-400 mb-3"
            size={30}
          />

          <h2 className="text-xl font-bold">
            New Arrivals
          </h2>

          <p className="text-red-500 mt-2">
            {error}
          </p>

          <button
            onClick={fetchNewArrivals}
            className="
              mt-5
              px-5
              py-2.5
              rounded-xl
              bg-indigo-600
              text-white
              font-semibold
            "
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
    console.log(
      "🟡 No new arrival products"
    );

    return null;
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <section className="
      max-w-7xl
      mx-auto
      px-1.5
      sm:px-4
      py-8
    ">

      {/* HEADER */}

      <div
        data-aos="fade-up"
        className="
          flex
          items-center
          justify-between
          mb-6
        "
      >

        <div>

          <h2 className="
            text-xl
            sm:text-3xl
            font-bold
            flex
            items-center
            gap-2
            text-gray-900
          ">
            <FaMagic className="text-indigo-500" />
            New Arrivals
          </h2>

          <p className="
            text-xs
            sm:text-sm
            text-gray-500
            mt-1
          ">
            Fresh products just added
          </p>

        </div>

        <button
          onClick={() =>
            navigate("/products")
          }
          className="
            text-sm
            font-semibold
            text-indigo-600
            hover:text-indigo-700
            transition
          "
        >
          View All →
        </button>

      </div>

      {/* GRID */}

      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="
          grid
          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-4
          gap-1.5
          sm:gap-3
        "
      >

        {products.map(
          (product, index) => {

            const price =
              getPrice(product);

            const originalPrice =
              getOriginalPrice(product);

            const rating =
              Number(
                product?.rating || 0
              );

            const reviews =
              Number(
                product?.numReviews || 0
              );

            const discount =
              originalPrice > price
                ? Math.round(
                    (
                      (originalPrice -
                        price) /
                      originalPrice
                    ) * 100
                  )
                : 0;

            return (
              <article
                key={product._id}
                data-aos="zoom-in"
                data-aos-delay={
                  index * 80
                }
                data-aos-once="true"
                onClick={() =>
                  openProduct(product)
                }
                className="
                  group
                  relative
                  bg-white
                  rounded-2xl
                  border
                  border-gray-100
                  overflow-hidden
                  cursor-pointer
                  transition-all
                  duration-300
                  hover:shadow-xl
                  hover:-translate-y-1
                  bg-gradient-to-br
                  from-white
                  via-indigo-50
                  to-purple-50
                "
              >

                {/* IMAGE */}

                <div className="
                  relative
                  flex
                  items-center
                  justify-center
                  h-[160px]
                  sm:h-[210px]
                  p-4
                ">

                  {/* GLOW */}

                  <div className="
                    absolute
                    w-28
                    h-28
                    bg-indigo-100
                    rounded-full
                    blur-3xl
                    opacity-0
                    group-hover:opacity-100
                    transition
                  " />

                  <img
                    src={getImage(product)}
                    alt={
                      product?.title ||
                      "Product"
                    }
                    className="
                      relative
                      z-10
                      max-h-[135px]
                      sm:max-h-[175px]
                      max-w-full
                      object-contain
                      transition-transform
                      duration-500
                      group-hover:scale-110
                    "
                  />

                  {/* NEW BADGE */}

                  <span className="
                    absolute
                    top-3
                    left-3
                    z-20
                    flex
                    items-center
                    gap-1
                    bg-gradient-to-r
                    from-indigo-600
                    to-purple-600
                    text-white
                    text-[9px]
                    sm:text-[10px]
                    font-bold
                    px-2
                    py-1
                    rounded-full
                    shadow
                  ">
                    <FaMagic size={9} />
                    NEW
                  </span>

                  {/* DISCOUNT */}

                  {discount > 0 && (
                    <span className="
                      absolute
                      right-3
                      bottom-3
                      z-20
                      bg-green-500
                      text-white
                      text-[9px]
                      sm:text-[10px]
                      font-bold
                      px-2
                      py-1
                      rounded
                    ">
                      {discount}% OFF
                    </span>
                  )}

                </div>

                {/* CONTENT */}

                <div className="p-3 sm:p-4">

                  {/* CATEGORY */}

                  <p className="
                    text-[9px]
                    sm:text-xs
                    uppercase
                    tracking-wide
                    text-indigo-500
                    font-medium
                    mb-1
                  ">
                    {product?.category?.name ||
                      "New Arrival"}
                  </p>

                  {/* TITLE */}

                  <h3 className="
                    text-sm
                    sm:text-base
                    font-semibold
                    text-gray-800
                    line-clamp-2
                    min-h-[40px]
                    group-hover:text-indigo-600
                    transition
                  ">
                    {product?.title ||
                      "Product"}
                  </h3>

                  {/* RATING */}

                  <div className="
                    flex
                    items-center
                    justify-between
                    mt-2
                  ">

                    <div className="
                      flex
                      items-center
                      gap-1
                    ">

                      <FaStar
                        className="text-yellow-400"
                        size={12}
                      />

                      <span className="
                        text-xs
                        font-semibold
                        text-gray-700
                      ">
                        {rating > 0
                          ? rating.toFixed(1)
                          : "New"}
                      </span>

                      <span className="
                        text-[10px]
                        text-gray-400
                      ">
                        ({reviews})
                      </span>

                    </div>

                    <div className="
                      flex
                      items-center
                      gap-1
                      text-[10px]
                      text-gray-400
                    ">
                      <FaEye size={10} />
                      New
                    </div>

                  </div>

                  {/* PRICE */}

                  <div className="
                    flex
                    items-center
                    gap-2
                    mt-3
                  ">

                    <span className="
                      text-base
                      sm:text-lg
                      font-bold
                      text-gray-900
                    ">
                      ₹
                      {price.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    {originalPrice > price && (
                      <del className="
                        text-[10px]
                        sm:text-xs
                        text-gray-400
                      ">
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
          }
        )}

      </div>

    </section>
  );
}