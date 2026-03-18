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
    speed: 9000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "ease-in",

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
      <h2 className="text-3xl sm:text-4xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">

        <span className="text-white">🏷️</span> Shop by Category

      </h2>

      <p className="text-gray-600 mb-6 text-sm sm:text-base">
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
border border-blue-100
hover:border-blue-400
shadow-md hover:shadow-[0_10px_30px_rgba(59,130,246,0.35)]
transition-all duration-300
flex flex-col items-center
p-4
text-center
bg-white
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
drop-shadow-[0_10px_25px_rgba(59,130,246,0.25)]
border-blue-100 border
rounded-lg
shadow-blue-100
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
  bg-gradient-to-r from-blue-600 to-blue-400
  bg-clip-text text-transparent
  group-hover:from-blue-700 group-hover:to-blue-500
  transition-all duration-300
  drop-shadow-[0_2px_6px_rgba(59,130,246,0.35)]
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