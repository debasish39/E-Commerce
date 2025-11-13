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

  // ✅ Realistic images for each category
  const categoryImages = {
    smartphones:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200",
    laptops:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200",
    fragrances:
      "https://images.unsplash.com/photo-1585386959984-a41552231693?q=80&w=1200",
    skincare:
      "https://images.unsplash.com/photo-1600180758890-6b94519a8ba2?q=80&w=1200",
    groceries:
      "https://images.unsplash.com/photo-1605478371319-1c872a181a36?q=80&w=1200",
    "home-decoration":
      "https://images.unsplash.com/photo-1616628188506-3bdb44f2e09c?q=80&w=1200",
    furniture:
      "https://images.unsplash.com/photo-1616627573711-5b03b6d3c379?q=80&w=1200",
    tops:
      "https://images.unsplash.com/photo-1520975918319-5f146eafc3f4?q=80&w=1200",
    "womens-dresses":
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200",
    "mens-shoes":
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200",
    "womens-shoes":
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=1200",
    "mens-watches":
      "https://images.unsplash.com/photo-1511389026070-a14ae610a1be?q=80&w=1200",
    "womens-watches":
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04b1?q=80&w=1200",
    sunglasses:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200",
    automotive:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200",
    motorcycle:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1200",
  };

  const getImage = (category) =>
    categoryImages[category?.toLowerCase()] ||
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1200"; // fallback

  return (
    <div className="py-16 text-white text-center">
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
              <div
                onClick={() => navigate(`/category/${item}`)}
                className="group relative overflow-hidden rounded-2xl cursor-pointer border border-[#f53347]/30 hover:border-[#f53347]/70 transition-all duration-300"
              >
                {/* Category Image */}
                <img
                  src={getImage(item)}
                  alt={item}
                  className="w-full h-48 sm:h-56 object-cover rounded-2xl transform group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end justify-center pb-5">
                  <span className="text-lg sm:text-xl font-semibold uppercase tracking-wide text-white drop-shadow-md">
                    {item.replace("-", " ")}
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
