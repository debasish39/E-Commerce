import React, { useEffect, useState } from "react";
import { getData } from "../context/DataContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Loading from "../assets/Loading4.webm";

const Carousel = () => {
  const { data, fetchAllProducts } = getData();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!data || data.length === 0) {
      fetchAllProducts().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const SamplePrevArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute top-1/2 left-6 transform -translate-y-1/2 z-20 cursor-pointer hidden sm:block"
    >
      <AiOutlineArrowLeft className="text-white bg-[#f53347]/90 hover:bg-[#f53347] rounded-full p-3 text-3xl md:text-4xl shadow-lg transition-all" />
    </div>
  );

  const SampleNextArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute top-1/2 right-6 transform -translate-y-1/2 z-20 cursor-pointer hidden sm:block"
    >
      <AiOutlineArrowRight className="text-white bg-[#f53347]/90 hover:bg-[#f53347] rounded-full p-3 text-3xl md:text-4xl shadow-lg transition-all" />
    </div>
  );

  const settings = {
    dots: true,
    autoplay: true,
    autoplaySpeed: 4500,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="relative w-full py-16 overflow-hidden bg-transparent">
      {/* 🌌 Particle Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08)_0%,_transparent_70%)] animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
        <div className="absolute inset-0 animate-[float_20s_infinite_linear] bg-[radial-gradient(circle_at_10%_20%,_rgba(245,51,71,0.25)_0%,_transparent_60%)] blur-2xl" />
        <style>
          {`
          @keyframes float {
            0% { transform: translate(0, 0); }
            50% { transform: translate(-20px, 20px); }
            100% { transform: translate(0, 0); }
          }
          `}
        </style>
      </div>

      {/* Section Title */}
      <h2
        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-12 text-[#f53347] drop-shadow-lg"
        style={{ fontFamily: "'Pacifico', cursive" }}
      >
        ✨ Featured Products
      </h2>

      <div className="max-w-7xl mx-auto relative px-4 sm:px-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px] py-10">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-32 h-32 sm:w-48 sm:h-48 object-contain"
            >
              <source src={Loading} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <Slider {...settings}>
            {data.map((item, index) => (
              <div key={index} className="px-4 sm:px-6 lg:px-10">
                <div
                  className="flex flex-col lg:flex-row items-center gap-8 p-8 md:p-10
                  rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20
                  shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]
                  hover:shadow-[0_8px_40px_rgba(245,51,71,0.25)]
                  transition-all duration-700 hover:scale-[1.02]"
                >
                  {/* Image */}
                  <div className="w-full lg:w-1/2 relative flex justify-center">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-64 sm:h-72 md:h-80 w-full object-contain rounded-lg drop-shadow-xl cursor-pointer transition-transform hover:scale-[1.05]"
                      onClick={() => navigate(`/products/${item.id}`)}
                    />
                    <span className="absolute top-4 left-4 bg-[#f53347] text-white text-xs sm:text-sm md:text-base font-semibold px-3 py-1 rounded-full shadow-md">
                      Featured
                    </span>
                  </div>

                  {/* Info */}
                  <div className="w-full lg:w-1/2 text-center lg:text-left space-y-3 text-white">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight line-clamp-1 drop-shadow-sm cursor-pointer"  onClick={() => navigate(`/products/${item.id}`)}>
                      {item.title}
                    </h1>
                    <div className="flex items-center justify-center lg:justify-start gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-sm sm:text-base" />
                      ))}
                    </div>
                    <p className="text-gray-100/90 text-sm sm:text-base md:text-lg opacity-90 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-2xl font-bold text-[#ff5c6e] drop-shadow-md">
                      ₹{item.price}
                    </p>

                    {/* Button */}
                    <div className="flex justify-center lg:justify-start">
                      <button
                        className="mt-4 bg-[#f53347]/90 hover:bg-[#d02b3b] text-white text-base sm:text-lg px-6 py-2.5 rounded-full shadow-md hover:shadow-lg flex items-center gap-2 transition-all"
                        onClick={() => addToCart(item)}
                      >
                        <FaShoppingCart className="text-lg" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default Carousel;
