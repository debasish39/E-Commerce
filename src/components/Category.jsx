import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { getData } from '../context/DataContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

export default function Category() {
  const {categoryOnlyData}=getData();
const navigate=useNavigate();
console.log(categoryOnlyData);
 

  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 4, // Adjust based on screen size
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    // arrows: true,
    
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <div className=" py-10">
      <div className="max-w-7xl mx-auto ">
        {categoryOnlyData.length > 0 ? (
          <Slider {...settings}>
            {categoryOnlyData.map((item, index) => (
              <div key={index} className="px-2">
                <button
                  className="w-full text-xl bg-white text-[#f53347] hover:bg-[#f53347] hover:text-white border border-white hover:border-white transition-all duration-300 font-semibold cursor-pointer active:bg-[#f53347] active:text-white px-6 py-2 rounded-full shadow text-center"
                  onClick={()=>navigate(`/catagory/${item}`)}
                >
                  {item}
                </button>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-white text-lg font-semibold text-center"></p>
        )}
      </div>
    </div>
  );
}
