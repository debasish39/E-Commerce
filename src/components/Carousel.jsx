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
import { AiOutlineEye } from "react-icons/ai";

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

  // Custom arrows
  const SamplePrevArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute top-1/2 left-3 sm:left-6 transform -translate-y-1/2 z-20 cursor-pointer hidden sm:block"
      aria-label="Previous Slide"
    >
      <AiOutlineArrowLeft className="text-white bg-[#f53347]/90 hover:bg-[#f53347] rounded-full p-2 sm:p-3 text-2xl sm:text-3xl md:text-4xl shadow-lg transition-all" />
    </div>
  );

  const SampleNextArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute top-1/2 right-3 sm:right-6 transform -translate-y-1/2 z-20 cursor-pointer hidden sm:block"
      aria-label="Next Slide"
    >
      <AiOutlineArrowRight className="text-white bg-[#f53347]/90 hover:bg-[#f53347] rounded-full p-2 sm:p-3 text-2xl sm:text-3xl md:text-4xl shadow-lg transition-all" />
    </div>
  );

  const initialSlideIndex = data ? data.findIndex(item => item.id === 30) : 0;

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
    initialSlide: initialSlideIndex >= 0 ? initialSlideIndex : 0,
    responsive: [
      { breakpoint: 1024, settings: { arrows: false } },
      { breakpoint: 640, settings: { arrows: false, dots: true } },
    ],
  };

  const orderedData = data || [];

  return (
    <div className="relative w-full py-12 sm:py-16 overflow-hidden bg-transparent">
      {/* Particle Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08)_0%,_transparent_70%)] animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
        <div className="absolute inset-0 animate-[float_20s_infinite_linear] bg-[radial-gradient(circle_at_10%_20%,_rgba(245,51,71,0.25)_0%,_transparent_60%)] blur-2xl" />
        <style>{`
          @keyframes float {
            0% { transform: translate(0, 0); }
            50% { transform: translate(-20px, 20px); }
            100% { transform: translate(0, 0); }
          }
        `}</style>
      </div>

      {/* Section Title + View All */}
      <div className="max-w-full mx-auto rounded-2xl flex px-3 sm:flex-row justify-between items-center mb-6  sm:px-8 gap-4 sm:gap-0">
        <h2
          className="text-[24px] sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text 
          bg-gradient-to-r from-red-400 to-orange-300 drop-shadow-lg text-center sm:text-left"
          style={{ fontFamily: "'Pacifico', cursive" }}
        >
          <span className="text-white">✨</span> Featured Products
        </h2>

        <span
          onClick={() => navigate('/products')}
          className="text-red-100 font-semibold text-base sm:text-lg cursor-pointer transition-transform duration-300 underline hover:scale-105 hover:text-[#ff6f61] active:scale-95 active:text-[#f53347]"
        >
          View All
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative px-4 sm:px-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px] py-10">
            <video autoPlay loop muted playsInline className="w-32 h-32 sm:w-48 sm:h-48 object-contain">
              <source src={Loading} type="video/webm" />
            </video>
          </div>
        ) : (
          <Slider {...settings}>
            {orderedData.map((item) => (
              <div key={item.id} className="px-2 sm:px-4 lg:px-10">
                <div
                  className="flex flex-col lg:flex-row items-center gap-6 sm:gap-10 p-4 sm:p-8 lg:p-10
                    rounded-3xl backdrop-blur-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/20
                    shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]
                    hover:shadow-[0_8px_40px_rgba(245,51,71,0.3)]
                    transition-all duration-700 hover:scale-[1.04]"
                >
                  {/* Image */}
                  <div className="w-full lg:w-1/2 relative flex justify-center">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-56 sm:h-64 md:h-72 lg:h-80 w-full object-contain rounded-xl drop-shadow-2xl cursor-pointer transition-transform hover:scale-[1.08] hover:rotate-1"
                      onClick={() => navigate(`/products/${item.id}`)}
                    />
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-[#f53347] to-[#ff6f61] text-white text-xs sm:text-sm md:text-base font-semibold px-3 py-1 rounded-full shadow-lg">
                     ✨Featured
                    </div>
                  </div>

                  {/* Info */}
                  <div className="w-full lg:w-1/2 text-center lg:text-left space-y-2 sm:space-y-3 text-white mt-4 lg:mt-0">
                    <h1
                      className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight line-clamp-1 drop-shadow-md cursor-pointer hover:text-[#ff6f61] transition-colors"
                      onClick={() => navigate(`/products/${item.id}`)}
                    >
                      {item.title}
                    </h1>

                    <div className="flex items-center justify-center lg:justify-start gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-sm sm:text-base drop-shadow-sm" />
                      ))}
                    </div>

                    <p className="text-gray-100/90 text-sm sm:text-base md:text-lg leading-relaxed line-clamp-2 opacity-90">
                      {item.description}
                    </p>

                    <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#ff5c6e] to-[#ff9a8b] drop-shadow-lg">
                      ₹{item.price}
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 mt-3 sm:mt-4">
                      <button
                        className="bg-gradient-to-r from-[#f53347] to-[#ff6f61] hover:from-[#d02b3b] hover:to-[#ff3a4c] text-white font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer text-center"
                        onClick={() => addToCart(item)}
                      >
                        <FaShoppingCart className="text-lg" /> Add to Cart
                      </button>


                      <button
                        className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer justify-center"
                        onClick={() => navigate(`/products/${item.id}`)}
                      >
                        <AiOutlineEye className="text-lg" /> View Product
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
