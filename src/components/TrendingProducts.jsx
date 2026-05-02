import React, { useMemo } from "react";
import { getData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import { FaStar, FaFire } from "react-icons/fa";

export default function TrendingProducts() {
  const { data } = getData();
  const navigate = useNavigate();

  const trending = useMemo(() => {
    if (!data || data.length === 0) return [];

    return [...data]
      .map((item, idx) => {
        const rating = item.rating || 4;
        const popularity = (idx * 37) % 1000;
        const score = (rating * 40) + popularity;

        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [data]);

  if (!trending.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-1.5 sm:px-6 py-8">

      {/* HEADER */}
      <div
        data-aos="fade-up"
        className="flex items-center justify-between mb-6"
      >
        <h2 className="text-xl sm:text-3xl font-bold flex items-center gap-2 text-gray-900">
          <FaFire className="text-orange-500" />
          Trending Now
        </h2>

        <button
          onClick={() => navigate("/products")}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
        >
          View All →
        </button>
      </div>

      {/* GRID */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3"
      >

        {trending.map((item, index) => (
          <div
            key={item.id}
            data-aos="zoom-in"
            data-aos-delay={index * 80}
            data-aos-once="true"
            onClick={() => navigate(`/products/${item.id}`)}
            className="
              group
              bg-white/30
              rounded-2xl
              border border-gray-100
              p-4
              cursor-pointer
              transition-all duration-300
              hover:shadow-lg
              hover:-translate-y-1
              bg-gradient-to-br from-white via-blue-50 to-indigo-50
            "
          >

            {/* IMAGE */}
            <div className="relative flex justify-center mb-4">

              {/* Glow */}
              <div className="absolute w-24 h-24 bg-indigo-100 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition" />

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

              {/* Badge */}
              <span className="
                absolute top-2 left-2
                bg-gradient-to-r from-orange-500 to-red-500
                text-white text-[10px]
                px-2 py-0.5
                rounded-full
                shadow
              ">
                Hot
              </span>
            </div>

            {/* TITLE */}
            <h3 className="
              text-sm font-semibold text-gray-800
              line-clamp-2 mb-2
              group-hover:text-indigo-600 transition
            ">
              {item.title}
            </h3>

            {/* RATING */}
            <div className="flex items-center gap-1 text-xs mb-2">
              <FaStar className="text-yellow-400" size={12} />
              <span className="font-medium text-gray-700">
                {item.rating?.toFixed(1) || "4.2"}
              </span>
            </div>

            {/* PRICE */}
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-gray-900">
                ₹{item.price?.toLocaleString("en-IN")}
              </p>

              <span className="
                text-xs font-medium
                text-green-600
                bg-green-50
                px-2 py-0.5
                rounded
              ">
                Best
              </span>
            </div>

          </div>
        ))}

      </div>
    </section>
  );
}