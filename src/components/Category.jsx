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
    <div className="relative py-16 overflow-hidden bg-transparent">
      {/* 🌌 Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f53347]/10 via-transparent to-white/5 blur-2xl animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,51,71,0.2),_transparent_60%)] animate-[float_12s_infinite_linear]" />
        <style>
          {`
          @keyframes float {
            0% { transform: translate(0, 0); }
            50% { transform: translate(20px, -20px); }
            100% { transform: translate(0, 0); }
          }
          `}
        </style>
      </div>

      {/* Title */}
      <h2
        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-10 text-[#f53347] drop-shadow-md"
        style={{ fontFamily: "'Pacifico', cursive" }}
      >
        🏷️ Shop by Category
      </h2>

      {/* Slider */}
      <div className="max-w-7xl mx-auto px-6">
        <Slider {...settings}>
          {categoryOnlyData.map((item, index) => (
            <div key={index} className="px-3 py-3">
              <div
                className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] 
                hover:shadow-[0_6px_40px_rgba(245,51,71,0.25)] 
                transition-all duration-500 hover:scale-[1.07] rounded-2xl group"
              >
                <button
                  className="relative w-full text-lg font-semibold text-white uppercase tracking-wide py-5 
                  bg-gradient-to-r from-[#f53347]/80 to-[#ff7a85]/80
                  group-hover:from-[#f53347] group-hover:to-[#ff5869]
                  rounded-2xl transition-all duration-500 
                  shadow-inner shadow-red-200 backdrop-blur-md"
                  onClick={() => navigate(`/category/${item}`)}
                >
                  <span className="drop-shadow-lg">{item}</span>

                  {/* Glow pulse ring */}
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#f53347]/20 to-[#ff5e6a]/20 opacity-0 group-hover:opacity-100 blur-lg transition-all duration-700" />
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Decorative Line */}
      <div className="mt-12 mx-auto w-48 h-[3px] bg-gradient-to-r from-[#f53347] to-pink-500 rounded-full opacity-80" />
    </div>
  );
}
