// src/components/Category.jsx
import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { categoryOnlyData } from "./catagorydata"; // adjust path if needed

export default function Category() {
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2800,
    cssEase: "ease-in-out",
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div className="py-16 text-white text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#f53347] to-pink-500">
        <span className="text-white">🏷️</span> Shop by Category
      </h2>
      <p className="text-gray-400 mb-10 text-sm sm:text-base">
        Discover categories that match your vibe.
      </p>

      <div className="max-w-6xl mx-auto px-4">
        <Slider {...settings}>
          {categoryOnlyData.map((item) => (
            <div key={item.name} className="px-3">
              <div
                onClick={() => navigate(`/category/${encodeURIComponent(item.name)}`)}
                className="group relative overflow-hidden rounded-2xl cursor-pointer border border-[#f53347]/30 hover:border-[#f53347]/70 transition-all duration-300"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-18  object-cover rounded-2xl transform group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end justify-center pb-5">
                  <span className="text-[12px] text-xl sm:text-xl font-semibold uppercase tracking-wide text-white drop-shadow-md">
                    {item.name.replace(/-/g, " ")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
