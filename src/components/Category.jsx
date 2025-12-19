import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { categoryOnlyData } from "./catagorydata";

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
    <div className="py-16 text-center">
      {/* Section Title */}
      <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#f53347] to-pink-500">
        <span className="text-white">🏷️</span> Shop by Category
      </h2>

      <p className="text-gray-400 mb-10 text-sm sm:text-base">
        Discover categories that match your vibe.
      </p>

      {/* Slider */}
      <div className="max-w-6xl mx-auto px-4">
        <Slider {...settings}>
          {categoryOnlyData.map((item) => (
            <div key={item.name} className="px-3">
              <div
                onClick={() =>
                  navigate(`/category/${encodeURIComponent(item.name)}`)
                }
                className="
                  group cursor-pointer rounded-2xl
                  bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]
                  border border-[#f53347]/40
                  hover:border-[#f53347]
                  shadow-lg hover:shadow-[#f53347]/30
                  hover:-translate-y-2
                  transition-all duration-300
                  flex flex-col items-center
                  p-4
                "
              >
                {/* Image */}
                <div className="relative w-full h-28 sm:h-32 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="
                      h-full object-contain
                      transform group-hover:scale-110
                      transition-transform duration-500
                      drop-shadow-[0_10px_25px_rgba(245,51,71,0.25)]
                    "
                  />

                  {/* Glow Effect */}
                  <div className="
                    absolute inset-0
                    bg-[#f53347]/10 blur-xl
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300
                  " />
                </div>

                {/* Category Name */}
                <p
                  className="
                    mt-4 text-sm sm:text-base font-semibold
                    uppercase tracking-wide
                    text-[#f53347]
                    group-hover:text-white
                    transition-colors duration-300
                    text-center
                  "
                >
                  {item.name.replace(/-/g, " ")}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
