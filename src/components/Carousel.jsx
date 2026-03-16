import React, { useEffect, useState } from "react";
import { getData } from "../context/DataContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import { toast } from "sonner";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";

import Loading from "../assets/Loading4.webm";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
  Parallax,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

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
  const orderedData = data || [];

  const initialSlideIndex = orderedData.findIndex(
    (item) => item.id === 83
  );
  const handleAddToCart = (item) => {

    if (!isSignedIn) {
      toast.error("Please login first");
      setTimeout(() => navigate("/sign-in"), 800);
      return;
    }

    const alreadyInCart = cartItem.some(
      (cart) => String(cart.productId) === String(item.id)
    );

    if (alreadyInCart) {
      toast.info("Product already in cart 🛒");
      setTimeout(() => navigate("/cart"), 800);
      return;
    }

    addToCart(item);
    toast.success(`${item.title} added to cart 🛒`);
  };

  return (

    <div className="relative w-full py-12 overflow-hidden">

      {/* HEADER */}




      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        {loading ? (

          <div className="flex justify-center items-center min-h-[300px]">
            <video autoPlay loop muted className="w-40">
              <source src={Loading} type="video/webm" />
            </video>
          </div>

        ) : (

          <Swiper
            initialSlide={initialSlideIndex >= 0 ? initialSlideIndex : 0}

            modules={[Navigation, Pagination, Autoplay, EffectCoverflow, Parallax]}

            effect="coverflow"
            centeredSlides
            slidesPerView={1.2}

            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}

            coverflowEffect={{
              rotate: 10,
              stretch: 0,
              depth: 250,
              modifier: 1.5,
              slideShadows: true,
            }}

            parallax={true}

            // navigation
            // pagination={{ clickable: true }}

            loop

          // className="py-10"

          >

            {orderedData.map((item) => {

              const alreadyInCart = cartItem.some(
                (cart) => String(cart.productId) === String(item.id)
              );

              return (

                <SwiperSlide key={item.id}>

                  <div
                    className="grid lg:grid-cols-2 gap-3 items-center bg-gradient-to-r from-white/5 to-white/10 border border-white/20 backdrop-blur-xl rounded-3xl px-6 sm:p-6 sm:py-9 w-full h-full"
                  >

                    {/* IMAGE */}
                    <div
                      className="flex justify-center"
                      data-swiper-parallax="-600"
                    >

                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        onClick={() => navigate(`/products/${item.id}`)}
                        className="w-[300px] h-[250px] sm:w-[350px] sm:h-[350px] object-contain transition hover:scale-110 cursor-pointer"
                      />

                    </div>


                    {/* INFO */}
                    <div
                      className="text-white space-y-1 text-center lg:text-left flex flex-col items-center lg:items-start"
                      data-swiper-parallax="-100"
                    >
                      <h1
                        className="text-xl sm:text-3xl lg:text-5xl font-extrabold cursor-pointer hover:text-gray-300"
                        onClick={() => navigate(`/products/${item.id}`)}
                      >
                        {item.title}
                      </h1>

                      <p className="hidden sm:block text-gray-300 max-w-xl">
                        {item.description}
                      </p>
                      <div className="sm:flex gap-1 text-yellow-400 hidden">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>

                      <p className="text-2xl sm:text-3xl font-bold text-red-400">
                        ₹{item.price}
                      </p>


                      <div className="flex flex-row gap-9 sm:gap-6 pt-2 justify-center items-center lg:justify-start mb-6">

                        <button
                          onClick={() =>
                            alreadyInCart
                              ? navigate("/cart")
                              : handleAddToCart(item)
                          }
                          className={`
  relative flex items-center gap-3 justify-center
  px-6 py-3
  rounded-xl
  font-semibold
  overflow-hidden
  transition-all duration-300
  active:scale-95
  hover:scale-105
  shadow-lg

  ${alreadyInCart
                              ? "bg-green-500/20 text-green-400 border border-green-400/40 hover:bg-green-500/30"
                              : "bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-[0_10px_35px_rgba(239,68,68,0.45)]"
                            }
  `}
                        >
                          <FaShoppingCart size={18} />

                          {/* Mobile text */}
                          <span className="sm:hidden text-sm">
                            {alreadyInCart ? "Cart" : "Add"}
                          </span>

                          {/* Desktop text */}
                          <span className="hidden sm:inline">
                            {alreadyInCart ? "View Cart" : "Add to Cart"}
                          </span>

                        </button>
                        <button
                          onClick={() => navigate(`/products/${item.id}`)}
                          className="
  flex items-center gap-2
  px-6 py-3
  rounded-xl
  font-semibold
  bg-white/10
  border border-white/20
  backdrop-blur-md
  text-white
  hover:bg-white/20
  hover:scale-105
  active:scale-95
  transition-all duration-300
  shadow-md
"
                        >
                          <AiOutlineEye size={18} />

                          {/* Mobile */}
                          <span className="sm:hidden">View</span>

                          {/* Desktop */}
                          <span className="hidden sm:inline">View Product</span>

                        </button>
                      </div>

                    </div>

                  </div>

                </SwiperSlide>

              );

            })}

          </Swiper>

        )}

      </div>

    </div>

  );
};

export default Carousel;