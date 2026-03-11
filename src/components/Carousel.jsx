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
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
const Carousel = () => {
  const { data, fetchAllProducts } = getData();
const { addToCart, cartItem } = useCart();
  const { isSignedIn } = useUser();
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

  const initialSlideIndex = data ? data.findIndex(item => item.id === 83) : 0;
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

    appendDots: dots => (
      <div>
        <ul className="flex justify-center mt-6 gap-3">
          {dots.slice(0, Math.min(dots.length, 6))}
        </ul>
      </div>
    ),

    customPaging: () => (
      <div className="progress-dot"></div>
    ),

    responsive: [
      { breakpoint: 1024, settings: { arrows: false } },
      { breakpoint: 640, settings: { arrows: false, dots: true } },
    ],
  };
  // const calculatePrice = (price) => {

  //   let finalPrice;

  //   if (price <= 50) {
  //     finalPrice = price + 69;
  //   }
  //   else if (price <= 100) {
  //     finalPrice = price + 99;
  //   }
  //   else if (price <= 300) {
  //     finalPrice = price + 199;
  //   }
  //   else if (price <= 800) {
  //     finalPrice = price + 299;
  //   }
  //   else if (price <= 2000) {
  //     finalPrice = price + 499;
  //   }
  //   else {
  //     finalPrice = price + 599;
  //   }

  //   return Math.round(finalPrice / 10) * 10;
  // };
  const orderedData = data || [];
const handleAddToCart = (item) => {

  if (!isSignedIn) {
    toast.error("Please login first");
    navigate("/sign-in");
    return;
  }

  const alreadyInCart = cartItem.some(
    (cart) => String(cart.productId) === String(item.id)
  );

  if (alreadyInCart) {
    navigate("/cart");
    return;
  }

  addToCart(item);

};
  return (
    <div className="relative w-full py-12 sm:py-16 overflow-hidden bg-transparent">
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

      <div className="max-w-7xl mx-auto round flex px-6 sm:flex-row justify-between items-center mb-6 sm:px-3 gap-4 sm:gap-0">
        <h2
          className="text-[24px] sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-white/30 drop-shadow-lg text-center sm:text-left"
          style={{ fontFamily: "'Pacifico', cursive" }}
        >
          <span className="text-gray-100">✨</span> Featured Products
        </h2>
        <span
          onClick={() => navigate("/products")}
          className="inline-flex items-center gap-2 px-3 py-1
  rounded-xl
  bg-gradient-to-r from-red-500/30 via-black/10 to-black/10 
  text-gray-300 font-semibold text-sm sm:text-base
  cursor-pointer
  border border-white/20
  shadow-lg hover:shadow-2xl
  hover:scale-105 active:scale-95
  transition-all duration-300 "
        >
          Explore All →
        </span>
      </div>

      <div className="max-w-9xl  relative px-4 sm:px-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px] py-10">
            <video autoPlay loop muted playsInline className="w-32 h-32 sm:w-48 sm:h-48 object-contain">
              <source src={Loading} type="video/webm" />
            </video>
          </div>
        ) : (
         <Slider {...settings}>
  {orderedData.map((item) => {

    const alreadyInCart = cartItem.some(
      (cart) => String(cart.productId) === String(item.id)
    );

    return (
      <div key={item.id} className="px-2 sm:px-4 lg:px-10">
        <div className="grid lg:grid-cols-2 items-center gap-6 sm:gap-10 p-4 sm:p-10 lg:p-18 rounded-3xl backdrop-blur-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/20 transition-all duration-700">

          {/* PRODUCT IMAGE */}
          <div className="relative flex justify-center order-1 lg:order-2">
            <img
              src={item.thumbnail}
              alt={item.title}
              onClick={() => navigate(`/products/${item.id}`)}
              className="h-64 sm:h-72 md:h-80 lg:h-[380px] w-full object-contain rounded-xl drop-shadow-2xl transition-transform hover:scale-110"
            />

            <div className="absolute top-4 left-4 bg-gradient-to-r from-[#ec031a] to-[#6b0d04] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
              ✨ Featured
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="text-center lg:text-left space-y-4 text-white order-2 lg:order-1">

            <p className="lg:block text-sm font-semibold text-red-400 uppercase tracking-wider">
              Welcome to E-shop
            </p>

            <h1
              className="text-xl sm:text-4xl lg:text-5xl text-gray-100 font-extrabold leading-tight drop-shadow-lg cursor-pointer hover:text-gray-300 transition-colors"
              onClick={() => navigate(`/products/${item.id}`)}
            >
              {item.title}
            </h1>

            <p className="text-gray-300 text-sm hidden sm:block sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0">
              {item.description}
            </p>

            <div className="hidden sm:flex justify-center lg:justify-start gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-sm drop-shadow-sm" />
              ))}
            </div>

            <p className="hidden sm:block text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[#fae2e5] to-[#d88477] bg-clip-text text-transparent">
              ₹{item.price}
            </p>

            {/* BUTTONS */}
            <div className="grid grid-cols-2 sm:flex gap-3 sm:gap-4 justify-center lg:justify-start pt-2 w-full">

              {/* ADD TO CART */}
              <button
                onClick={() =>
                  alreadyInCart
                    ? navigate("/cart")
                    : handleAddToCart(item)
                }
                className={`flex items-center justify-center gap-2 
                text-gray-300 font-semibold text-sm sm:text-base 
                px-4 sm:px-6 py-2.5 rounded-xl shadow-md 
                transition-all transform hover:scale-105 cursor-pointer

                ${
                  alreadyInCart
                    ? "bg-green-300/20  text-green-300 hover:bg-green-500/30"
                    : "bg-gradient-to-r from-[#5a020b] to-[#ff1500] hover:from-[#ca0317] hover:to-[#a9010f]"
                }`}
              >
                <FaShoppingCart size={20} />

                <span className="hidden sm:inline">
                  {alreadyInCart ? "View Cart" : "Add to Cart"}
                </span>

                <span className="sm:hidden">
                  {alreadyInCart ? "Cart" : "Add"}
                </span>
              </button>

              {/* VIEW PRODUCT */}
              <button
                onClick={() => navigate(`/products/${item.id}`)}
                className="bg-white/10 hover:bg-white/20 text-gray-300 font-semibold text-sm sm:text-base px-4 sm:px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <AiOutlineEye size={20} />
                <span className="hidden sm:inline">View Product</span>
                <span className="sm:hidden">View</span>
              </button>

            </div>

          </div>
        </div>
      </div>
    );
  })}
</Slider>
        )}
      </div>
    </div>
  );
};

export default Carousel;
