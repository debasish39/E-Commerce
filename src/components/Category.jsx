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
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto">
       
          <Slider {...settings}>
            {categoryOnlyData.map((item, index) => (
              <div key={index} className="px-2">
                <button
                  className="w-full text-base sm:text-lg bg-white text-[#f53347]
                  hover:bg-[#f53347] hover:text-white border border-white
                  transition-all duration-300 font-semibold px-6 py-2
                  rounded-full shadow"
                  onClick={() => navigate(`/category/${item}`)}
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
