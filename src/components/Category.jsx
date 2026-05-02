import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { AiOutlineArrowRight } from "react-icons/ai";
import { categoryOnlyData } from "./catagorydata";

const ACCENTS = [
  { from: "#2874f0", to: "#60a5fa" },
  { from: "#f43f5e", to: "#fb7185" },
  { from: "#10b981", to: "#34d399" },
  { from: "#f59e0b", to: "#fbbf24" },
  { from: "#8b5cf6", to: "#a78bfa" },
  { from: "#06b6d4", to: "#22d3ee" },
];

export default function Category() {
  const navigate = useNavigate();

  return (
    <div className="w-full py-12">

      {/* HEADER */}
      <div className="text-center mb-10 px-4">

        {/* Badge */}
        <div className="
          inline-flex items-center gap-2
          px-4 py-1.5 rounded-full
          text-xs font-semibold
          bg-indigo-50 text-indigo-600 border border-indigo-200
          mb-4
        ">
          🔥 Trending Categories
        </div>

        {/* Title */}
        <h2 className="
          text-xl sm:text-5xl font-bold
          bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500
          bg-clip-text text-transparent
        ">
          Explore What’s Hot
        </h2>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm sm:text-base mt-3">
          Discover trending collections curated just for you
        </p>

      </div>

      {/* SWIPER */}
      <div className="px-4 sm:px-6">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={2}
          loop
          speed={600}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
        >
          {categoryOnlyData.map((item, idx) => {
            const accent = ACCENTS[idx % ACCENTS.length];
            const name = item.name.replace(/-/g, " ");

            return (
              <SwiperSlide key={item.name}>
                <div
                  onClick={() => navigate(`/category/${item.name}`)}
                  className="
      group relative overflow-hidden
      rounded-2xl p-5
      cursor-pointer
      transition-all duration-500
      hover:-translate-y-2 hover:shadow-xl
      bg-white/69 backdrop-blur-lg
      border border-gray-100
    "
                >

                  {/* Subtle hover gradient overlay */}
                  <div
                    className="
        absolute inset-0 rounded-2xl
        opacity-0 group-hover:opacity-100
        transition duration-500
      "
                    style={{
                      background: `linear-gradient(135deg, ${accent.from}12, ${accent.to}12)`
                    }}
                  />

                  {/* IMAGE */}
                  <div className="relative flex justify-center mb-4">

                    {/* controlled glow */}
                    <div
                      className="
          absolute w-16 h-16 rounded-full blur-xl
          opacity-40 group-hover:opacity-70 transition
        "
                      style={{
                        background: `radial-gradient(circle, ${accent.from}50, transparent)`
                      }}
                    />

                    <img
                      src={item.image}
                      alt={name}
                      className="
          relative z-10
          h-[90px] sm:h-[110px]
          object-contain
          transition-all duration-500
          group-hover:scale-101 rounded-lg
        "
                    />
                  </div>

                  {/* CATEGORY NAME */}
                  <p className="
      text-xs font-semibold uppercase tracking-wide
      text-gray-700 text-center
      group-hover:text-indigo-600
      transition
    ">
                    {name}
                  </p>

                  {/* CTA */}
                  <div className="
      mt-2 flex items-center justify-center gap-1
      text-[11px] font-medium
      text-indigo-500
      opacity-0 group-hover:opacity-100
      transition duration-300
    ">
                    Shop Now
                    <span className="transform group-hover:translate-x-1 transition">
                      <AiOutlineArrowRight size={12} />
                    </span>
                  </div>

                  {/* Bottom Accent Line (clean highlight) */}
                  <div
                    className="
        absolute bottom-0 left-0 right-0 h-[3px]
        opacity-40 group-hover:opacity-100
        transition
      "
                    style={{
                      background: `linear-gradient(90deg, transparent, ${accent.from}, ${accent.to}, transparent)`
                    }}
                  />

                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}