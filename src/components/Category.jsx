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
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",

    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (

    <div className="py-6 text-center w-full">

      {/* TITLE */}
      <h2 className="text-3xl sm:text-4xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">

        <span className="text-white">🏷️</span> Shop by Category

      </h2>

      <p className="text-gray-400 mb-6 text-sm sm:text-base">
        Discover categories that match your vibe.
      </p>


      {/* FULL WIDTH SLIDER */}
      <div className="w-full px-2 sm:px-6">

        <Slider {...settings}>

          {categoryOnlyData.map((item) => (

            <div key={item.name} className="px-2">

              <div
                onClick={() =>
                  navigate(`/category/${encodeURIComponent(item.name)}`)
                }
                className="
                group cursor-pointer
                rounded-2xl
                border border-[#f53347]/40
                hover:border-[#f53347]
                shadow-lg hover:shadow-[#f53347]/30
                transition-all duration-300
                flex flex-col items-center
                p-4
                text-center
                "
              >

                {/* IMAGE */}
                <div className="relative w-full h-24 sm:h-28 flex items-center justify-center overflow-hidden">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="
                    h-full object-contain
                    transform group-hover:scale-110
                    transition-transform duration-500
                    drop-shadow-[0_10px_25px_rgba(245,51,71,0.25)]
                    border-red-900 border-2
                    rounded-lg
                    shadow-red-900/20
                    "
                  />

                </div>


                {/* CATEGORY NAME */}
                <p
                  className="
                  mt-4
                  text-xs sm:text-sm
                  font-semibold
                  uppercase
                  tracking-wider
                  bg-gradient-to-r from-[#f53347] to-red-400
                  bg-clip-text text-transparent
                  group-hover:from-white group-hover:to-white
                  transition-all duration-300
                  drop-shadow-[0_2px_6px_rgba(245,51,71,0.35)]
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