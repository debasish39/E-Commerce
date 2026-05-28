import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { AiOutlineArrowRight } from "react-icons/ai";
import { categoryOnlyData } from "./catagorydata";
import AOS from "aos";
import "aos/dist/aos.css";
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
const [loading, setLoading] = useState(true);
useEffect(() => {
  AOS.init({
    duration: 100,
    easing: "ease-in-out",
    once: true, // important (performance + clean UX)
  });

  AOS.refresh();
}, []);
useEffect(() => {


  // simulate loading (replace with real API later)
  const timer = setTimeout(() => {
    setLoading(false);
    
  }, 300);

  return () => clearTimeout(timer);
}, []);
if (loading) {
  return (
    <div className="w-full py-3 px-4 sm:px-6 animate-pulse">

      {/* Header skeleton */}
      <div className="text-center mb-4 space-y-2">
        <div className="h-6 w-40 mx-auto bg-indigo-200 rounded-full" />
        <div className="h-8 w-64 mx-auto bg-gray-300 rounded" />
        <div className="h-4 w-52 mx-auto bg-gray-200 rounded" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 bg-white border border-gray-100"
          >
            <div className="flex justify-center mb-4">
              <div className="w-[90px] h-[90px] bg-gray-200 rounded-lg" />
            </div>

            <div className="h-4 w-20 mx-auto bg-gray-300 rounded mb-2" />
            <div className="h-3 w-16 mx-auto bg-gray-200 rounded" />
          </div>
        ))}
      </div>

    </div>
  );
}
  return (
    <div className="w-full py-3">

      {/* HEADER */}
<div
  className="text-center mb-1 px-4"
  data-aos="fade-up"
  data-aos-duration="600"
>
        {/* Badge */}
        <div className="
          inline-flex items-center gap-2
          px-4 py-1.5 rounded-full
          text-xs font-semibold
          bg-indigo-50 text-indigo-600 border border-indigo-200
          mb-2">
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
        <p className="text-gray-500 text-sm sm:text-base mt-1">
          Discover trending collections curated just for you
        </p>

      </div>

      {/* SWIPER */}
      <div className="px-4 sm:px-6 sm:mx-auto">
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
    data-aos="zoom-in"
  data-aos-delay={idx * 80}
  data-aos-duration="500"
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
                      lazyload
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