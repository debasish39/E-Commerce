import React, { useEffect } from "react";
import { getData } from "../context/DataContext";

export default function ProductFilter() {
  const {
    data,
    fetchAllProducts,

    search,
    setSearch,

    category,
    setCategory,

    brand,
    setBrand,

    priceRange,
    setPriceRange,

    categoryOnlyData,
    brandOnlyData,

    filteredData,
  } = getData();

  /*
  |--------------------------------------------------------------------------
  | FETCH PRODUCTS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!data || data.length === 0) {
      fetchAllProducts();
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | GET PRODUCT PRICE
  |--------------------------------------------------------------------------
  |
  | Product price is now inside variants[].
  |
  | We use the lowest active variant price.
  |--------------------------------------------------------------------------
  */

  const getProductPrice = (product) => {
    const variants = Array.isArray(
      product?.variants
    )
      ? product.variants
      : [];

    const activeVariants =
      variants.filter(
        (variant) =>
          variant?.isActive !== false
      );

    const prices = activeVariants
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

    return 0;
  };

  /*
  |--------------------------------------------------------------------------
  | GET PRODUCT IMAGE
  |--------------------------------------------------------------------------
  */

  const getProductImage = (product) => {
    if (
      product?.media?.thumbnail
    ) {
      return product.media.thumbnail;
    }

    if (
      Array.isArray(
        product?.media?.images
      ) &&
      product.media.images.length > 0
    ) {
      return product.media.images[0];
    }

    /*
    | Fallback to variant image
    */

    if (
      Array.isArray(
        product?.variants
      )
    ) {
      const variantWithImage =
        product.variants.find(
          (variant) =>
            Array.isArray(
              variant?.images
            ) &&
            variant.images.length > 0
        );

      if (variantWithImage) {
        return variantWithImage
          .images[0];
      }
    }

    return "";
  };

  /*
  |--------------------------------------------------------------------------
  | GET CATEGORY NAME
  |--------------------------------------------------------------------------
  */

  const getCategoryName = (
    product
  ) => {
    if (
      typeof product?.category ===
      "object"
    ) {
      return (
        product.category?.name ||
        ""
      );
    }

    return product?.category || "";
  };

  /*
  |--------------------------------------------------------------------------
  | GET BRAND NAME
  |--------------------------------------------------------------------------
  */

  const getBrandName = (
    product
  ) => {
    if (
      typeof product?.brand ===
      "object"
    ) {
      return (
        product.brand?.name ||
        ""
      );
    }

    return product?.brand || "";
  };

  /*
  |--------------------------------------------------------------------------
  | PRICE RANGE LIMIT
  |--------------------------------------------------------------------------
  |
  | You can change 5000 to your maximum
  | product price if required.
  |--------------------------------------------------------------------------
  */

  const MAX_PRICE = 5000;

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="w-full">

      {/* =================================================
          TITLE
      ================================================= */}

      <h2
        className="
          text-2xl
          font-bold
          text-transparent
          bg-clip-text
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          mb-4
        "
      >
        🔍 Filter Products
      </h2>


      {/* =================================================
          FILTERS
      ================================================= */}

      <div
        className="
          flex
          flex-wrap
          justify-center
          gap-4
          mb-6
        "
      >

        {/* =================================================
            SEARCH
        ================================================= */}

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            px-4
            py-2
            rounded-xl
            border
            border-blue-200
            bg-white
            text-gray-700
            placeholder-gray-400
            focus:outline-none
            focus:border-indigo-500
            transition
            shadow-sm
          "
        />


        {/* =================================================
            CATEGORY
        ================================================= */}

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          className="
            px-4
            py-2
            rounded-xl
            border
            border-blue-200
            bg-white
            text-gray-700
            focus:outline-none
            focus:border-indigo-500
            transition
            shadow-sm
          "
        >

          <option value="All">
            All Categories
          </option>

          {categoryOnlyData.map(
            (cat) => (
              <option
                key={cat._id}
                value={cat._id}
              >
                {cat.name}
              </option>
            )
          )}

        </select>


        {/* =================================================
            BRAND
        ================================================= */}

        <select
          value={brand}
          onChange={(e) =>
            setBrand(
              e.target.value
            )
          }
          className="
            px-4
            py-2
            rounded-xl
            border
            border-blue-200
            bg-white
            text-gray-700
            focus:outline-none
            focus:border-indigo-500
            transition
            shadow-sm
          "
        >

          <option value="All">
            All Brands
          </option>

          {brandOnlyData.map(
            (b, i) => {

              const brandName =
                typeof b ===
                "object"
                  ? b?.name
                  : b;

              const brandId =
                typeof b ===
                "object"
                  ? b?._id
                  : b;

              return (
                <option
                  key={
                    brandId || i
                  }
                  value={
                    brandId
                  }
                >
                  {brandName}
                </option>
              );
            }
          )}

        </select>


        {/* =================================================
            PRICE RANGE
        ================================================= */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <label
            className="
              text-gray-600
              text-sm
              whitespace-nowrap
            "
          >
            ₹{priceRange[0]}
          </label>


          <input
            type="range"
            min="0"
            max={MAX_PRICE}
            step="100"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([
                priceRange[0],
                Number(
                  e.target.value
                ),
              ])
            }
            className="
              w-48
              accent-indigo-600
            "
          />


          <label
            className="
              text-gray-600
              text-sm
              whitespace-nowrap
            "
          >
            ₹{priceRange[1]}
          </label>

        </div>

      </div>


      {/* =================================================
          RESULTS
      ================================================= */}

      <div
        className="
          mb-4
          text-center
          text-sm
          text-gray-500
        "
      >
        Showing{" "}
        <span
          className="
            font-semibold
            text-indigo-600
          "
        >
          {filteredData.length}
        </span>{" "}
        products
      </div>


      {/* =================================================
          PRODUCTS GRID
      ================================================= */}

      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          gap-5
        "
      >

        {filteredData.length > 0 ? (

          filteredData.map(
            (product) => {

              const price =
                getProductPrice(
                  product
                );

              const image =
                getProductImage(
                  product
                );

              const categoryName =
                getCategoryName(
                  product
                );

              const brandName =
                getBrandName(
                  product
                );

              return (
                <div
                  key={product._id}
                  className="
                    border
                    border-blue-100
                    rounded-2xl
                    p-3
                    bg-white
                    hover:shadow-[0_8px_25px_rgba(99,102,241,0.2)]
                    transition
                  "
                >

                  {/* IMAGE */}

                  <div
                    className="
                      w-full
                      h-40
                      bg-gray-50
                      rounded-xl
                      overflow-hidden
                      mb-3
                    "
                  >

                    {image ? (

                      <img
                        src={image}
                        alt={
                          product.title
                        }
                        className="
                          w-full
                          h-full
                          object-contain
                        "
                      />

                    ) : (

                      <div
                        className="
                          w-full
                          h-full
                          flex
                          items-center
                          justify-center
                          text-gray-400
                          text-sm
                        "
                      >
                        No Image
                      </div>

                    )}

                  </div>


                  {/* TITLE */}

                  <h3
                    className="
                      text-sm
                      font-semibold
                      text-gray-800
                      truncate
                    "
                  >
                    {product.title}
                  </h3>


                  {/* CATEGORY */}

                  {categoryName && (

                    <p
                      className="
                        text-gray-500
                        text-xs
                        mb-1
                      "
                    >
                      {categoryName}
                    </p>

                  )}


                  {/* BRAND */}

                  {brandName && (

                    <p
                      className="
                        text-indigo-500
                        text-xs
                        mb-1
                      "
                    >
                      {brandName}
                    </p>

                  )}


                  {/* PRICE */}

                  <p
                    className="
                      text-indigo-600
                      font-bold
                      text-sm
                    "
                  >
                    ₹
                    {price.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>
              );
            }
          )

        ) : (

          <p
            className="
              text-gray-500
              text-sm
              col-span-full
              text-center
              py-10
            "
          >
            No products found.
          </p>

        )}

      </div>

    </div>
  );
}

