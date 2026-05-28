import React, {useEffect,useMemo } from "react";
import { getData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRupeeSign, FaTag } from "react-icons/fa";
import { MdTrendingDown } from "react-icons/md";
import { HiArrowRight } from "react-icons/hi";
import AOS from "aos";
import "aos/dist/aos.css";
export default function RandomProducts() {
  const { data } = getData();
  const navigate = useNavigate();
useEffect(() => {
  AOS.init({
    duration: 600,
    easing: "ease-out-cubic",
    once: false,
    offset: 60,
  });
}, []);
  const randomItems = useMemo(() => {
    if (!data || data.length === 0) return [];
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  }, [data]);

  if (!randomItems.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 py-3">

      {/* HEADER */}
      <div
        data-aos="fade-up"
        className="flex items-center justify-between mb-6"
      >
        <h2 className="
          text-xl sm:text-3xl font-bold
          bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500
          bg-clip-text text-transparent
        ">
          Recommended for you
        </h2>

        <button
          onClick={() => navigate("/products")}
          className="
            flex items-center gap-1
            text-sm font-semibold 
            text-indigo-600 hover:text-blue-600 
            transition group
          "
        >
          View All
          <HiArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>

      {/* GRID */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3"
      >

        {randomItems.map((item, index) => {
          const originalPrice = Math.round(item.price * 1.2);
          const discount = Math.round(
            ((originalPrice - item.price) / originalPrice) * 100
          );

          return (
            <div
              key={item.id}
              data-aos="zoom-in"
              data-aos-delay={index * 80}
              data-aos-once="true"
              onClick={() => navigate(`/products/${item.id}`)}
              className="
                group relative
                rounded-2xl
                p-3
                cursor-pointer
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-xl
                border border-blue-100
                bg-gradient-to-br from-white via-blue-50 to-indigo-50
              "
            >

              {/* WATER GLOW */}
              <div className="
                absolute inset-0 rounded-2xl
                bg-gradient-to-br from-blue-400/10 via-indigo-400/10 to-cyan-300/10
                opacity-0 group-hover:opacity-100
                transition duration-300
              " />

              {/* IMAGE */}
              <div className="relative flex justify-center mb-2">

                <div className="
                  absolute w-24 h-24
                  bg-gradient-to-r from-blue-300 to-indigo-300
                  rounded-full blur-2xl opacity-0
                  group-hover:opacity-100 transition
                " />

                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="
                    relative z-10
                    h-[110px] sm:h-[140px]
                    object-contain
                    transition-transform duration-300
                    group-hover:scale-105
                  "
                />
              </div>

              {/* TITLE */}
              <h3 className="
                text-sm font-semibold text-gray-800
                line-clamp-2 mb-1
                group-hover:text-indigo-600 transition
              ">
                {item.title}
              </h3>

              {/* RATING */}
              <div className="flex items-center gap-1 text-xs mb-1">
                <FaStar className="text-yellow-400" size={12} />
                <span className="text-gray-700 font-medium">
                  {item.rating?.toFixed(1) || "4.2"}
                </span>
              </div>

              {/* PRICE SECTION */}
              <div className="flex flex-col gap-1">

                {/* Current Price */}
                <div className="flex items-center gap-1">
                  <FaRupeeSign size={12} className="text-indigo-600" />
                  <span className="text-base font-bold text-gray-900">
                    {item.price?.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Old Price + Discount */}
                <div className="flex items-center gap-2 text-[11px]">

                  <span className="line-through text-gray-400">
                    ₹{originalPrice.toLocaleString("en-IN")}
                  </span>

                  <span className="
                    flex items-center gap-1
                    text-green-600 font-semibold
                    bg-green-50 px-2 py-0.5 rounded
                  ">
                    <FaTag size={10} />
                    {discount}% off
                  </span>

                </div>

                {/* Deal Tag */}
                <div className="
                  flex items-center gap-1 text-[11px]
                  text-blue-600 font-medium
                ">
                  <MdTrendingDown size={12} />
                  <span>Best Deal</span>
                </div>

              </div>

            </div>
          );
        })}

      </div>
    </section>
  );
}