import React, { useEffect, useState } from 'react';
import { getData } from '../context/DataContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Loading from '../assets/Loading4.webm';

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
      className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 cursor-pointer hidden sm:block"
    >
      <AiOutlineArrowLeft className="text-white bg-[#f53347] rounded-full p-2 text-3xl md:text-4xl shadow-md" />
    </div>
  );

  const SampleNextArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 cursor-pointer hidden sm:block"
    >
      <AiOutlineArrowRight className="text-white bg-[#f53347] rounded-full p-2 text-3xl md:text-4xl shadow-md" />
    </div>
  );

  const settings = {
    dots: false,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="w-full py-3">
      <div className="max-w-screen mx-auto relative">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-800">
          🛍️ Featured Products
        </h2>

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
                <div className="flex flex-col lg:flex-row items-center gap-8 rounded-2xl p-6 md:p-10 transition-all duration-300 hover:scale-[1.01] active:scale-[1.01]">

                  {/* Image */}
                  <div className="w-full lg:w-1/2 relative flex justify-center">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-64 sm:h-72 md:h-80 w-full object-contain cursor-pointer"
                      onClick={() => navigate(`/products/${item.id}`)}
                    />
                    <span className="absolute top-4 left-4 bg-[#f53347] text-white text-[12px] sm:text-sm md:text-base font-semibold px-3 py-1 rounded-full shadow-sm">
                      Featured
                    </span>
                  </div>

                  {/* Info */}
                  <div className="w-full lg:w-1/2 text-center lg:text-left space-y-3">
                    <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 line-clamp-1">
                      {item.title}
                    </h1>
                    <div className="flex items-center justify-center lg:justify-start gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-sm sm:text-base" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#f53347]">
                      ₹{item.price}
                    </p>
                    <button
                      className="mt-4 bg-[#f53347] hover:bg-[#d02b3b] text-white text-xl sm:text-base px-6 py-2 rounded-full shadow-md transition duration-300 cursor-pointer"
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
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
