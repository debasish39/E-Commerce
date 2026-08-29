import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import ProductCard from "../components/ProductCard";

import Loading from "../assets/Loading4.webm";

import AOS from "aos";
import "aos/dist/aos.css";

/* =====================================
   BACKEND URL
===================================== */

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL;

export default function CategoryProduct() {

  /* =====================================
     PARAMS
  ===================================== */

  const { category } =
    useParams();

  /* =====================================
     STATES
  ===================================== */

  const [

    products,

    setProducts,

  ] = useState([]);

  const [

    loading,

    setLoading,

  ] = useState(true);

  /* =====================================
     FETCH CATEGORY PRODUCTS
  ===================================== */

  useEffect(() => {

    AOS.init({

      duration: 800,

      easing: "ease-in-out",

      once: false,

    });

    const fetchCategoryProducts =
      async () => {

        try {

          setLoading(true);

          const res =
            await fetch(

              `${BACKEND_URL}/api/products?category=${category}`

            );

          const data =
            await res.json();

          console.log(
            "CATEGORY PRODUCTS:",
            data
          );

          if (data.success) {

            setProducts(
              data.products || []
            );

          }

        } catch (error) {

          console.error(

            "Category Product Error:",

            error

          );

        } finally {

          setLoading(false);

        }

      };

    fetchCategoryProducts();

  }, [category]);

  /* =====================================
     LOADING
  ===================================== */

  if (loading) {

    return (

      <div
        className="
        flex flex-col
        items-center
        justify-center
        text-center
        py-10
      "
      >

        <video
          autoPlay
          loop
          muted
          playsInline
          className="
          w-32 h-32
          sm:w-48 sm:h-48
          object-contain
        "
        >

          <source
            src={Loading}
            type="video/webm"
          />

        </video>

        <p
          className="
          text-indigo-600
          text-lg
          font-semibold
          mt-4
          capitalize
        "
        >
          Loading {category} products...
        </p>

      </div>

    );

  }

  /* =====================================
     NO PRODUCTS
  ===================================== */

  if (!products.length) {

    return (

      <div
        className="
        text-center
        py-10
        text-xl
        font-semibold
        text-gray-700
      "
      >

        No products found in {category}.

      </div>

    );

  }

  /* =====================================
     UI
  ===================================== */

  return (

    <div
      className="
      max-w-7xl
      mx-auto
      py-10
      px-4
    "
    >

      <h1
        className="
        text-3xl
        font-bold
        text-center
        mb-8
        capitalize
        text-indigo-700
      "
        data-aos="fade-down"
      >

        {category} Products

      </h1>

      <div
        className="
        grid
        grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        gap-2
      "
      >

        {products.map(

          (product, index) => (

            <div
              key={product._id}
              data-aos="zoom-in"
              data-aos-delay={index * 50}
            >

              <ProductCard
                product={product}
              />

            </div>

          )

        )}

      </div>

    </div>

  );

}
