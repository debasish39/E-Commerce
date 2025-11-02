import React from "react";
import Slider from "react-slick";
import { getData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Category() {
  const { categoryOnlyData } = getData();
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    cssEase: "ease-in-out",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="py-16 bg-gradient-to-b from-[#0f0f10] via-[#141416] to-[#0f0f10] text-white text-center">
      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#f53347] to-pink-500">
        🏷️ Shop by Category
      </h2>
      <p className="text-gray-400 mb-10 text-sm sm:text-base">
        Discover categories that match your vibe.
      </p>

      {/* Slider */}
      <div className="max-w-6xl mx-auto px-4">
        <Slider {...settings}>
          {categoryOnlyData.map((item, index) => (
            <div key={index} className="px-3">
              <button
                onClick={() => navigate(`/category/${item}`)}
                className="w-full py-5 rounded-2xl font-semibold uppercase text-sm sm:text-lg
                border border-[#f53347] text-[#f53347]
                bg-transparent backdrop-blur-sm
                hover:bg-[#f53347]/20 hover:text-white hover:shadow-[0_0_15px_#f53347]
                active:scale-95 transition-all duration-300"
              >
                {item}
              </button>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
