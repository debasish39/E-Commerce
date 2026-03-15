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

    <div className="relative w-full py-12 sm:py-16 overflow-hidden">

      {/* HEADER */}


      

<div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        {loading ? (

          <div className="flex justify-center items-center min-h-[300px]">
            <video autoPlay loop muted className="w-40">
              <source src={Loading} type="video/webm"/>
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
              slideShadows: false,
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
                    className="grid lg:grid-cols-2 gap-8 items-center bg-gradient-to-r from-white/5 to-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-9 w-full"
                  >

                    {/* IMAGE */}
                    <div
                      className="flex justify-center"
                      data-swiper-parallax="-200"
                    >

                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        onClick={() => navigate(`/products/${item.id}`)}
                        className="h-[350px] object-contain transition hover:scale-110 cursor-pointer"
                      />

                    </div>


                    {/* INFO */}
                  <div
  className="text-white space-y-4 text-center lg:text-left flex flex-col items-center lg:items-start"
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
                      <div className="flex gap-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i}/>
                        ))}
                      </div>

                      <p className="text-3xl font-bold text-red-400">
                        ₹{item.price}
                      </p>


                      {/* BUTTONS */}
                      <div className="flex gap-4 pt-4 justify-center lg:justify-start flex-wrap">

                        <button
                          onClick={() =>
                            alreadyInCart
                              ? navigate("/cart")
                              : handleAddToCart(item)
                          }
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition hover:scale-105

                          ${
                            alreadyInCart
                              ? "bg-green-400/20 text-green-400"
                              : "bg-gradient-to-r from-red-600 to-red-500"
                          }`}
                        >

                          <FaShoppingCart/>

                          {alreadyInCart ? "View Cart" : "Add to Cart"}

                        </button>


                        <button
                          onClick={() => navigate(`/products/${item.id}`)}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20"
                        >
                          <AiOutlineEye/>
                          View Product
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