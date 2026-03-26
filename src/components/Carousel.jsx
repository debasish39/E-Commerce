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
    toast.success("Add to cart success 🛒");
  };

  return (

    <div className="relative w-full py-1 overflow-hidden">

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

            modules={[Navigation, Pagination, Autoplay]}

            effect="coverflow"
            
slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}

            // coverflowEffect={{
            //   // rotate: 10,
            //   stretch: 0,
            //   // depth: 250,
            //   modifier: 1.5,
            //   // slideShadows: true,
            // }}

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
                    className="
relative
grid lg:grid-cols-2 gap-3 items-center
px-6 sm:p-6 sm:py-9
w-full h-full
    bg-transparent
overflow-hidden
"
                  >
                    {/* Glow background */}
                    {/* <div className="absolute -top-20 -left-20 w-[260px] h-[260px] bg-blue-400/30 blur-[120px] rounded-full"></div> */}

                    {/* <div className="absolute bottom-[-80px] right-[-80px] w-[260px] h-[260px] bg-indigo-400/30 blur-[120px] rounded-full"></div> */}
                    {/* IMAGE */}
                    <div
                      className="flex justify-center"
                      data-swiper-parallax="-600"
                    >

                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        onClick={() => navigate(`/products/${item.id}`)}
                        className="w-[300px] h-[250px] sm:w-[350px] sm:h-[350px] object-contain transition hover:scale-110 hover:drop-shadow-[0_10px_25px_rgba(59,130,246,0.35)] cursor-pointer"
                      />

                    </div>


                    {/* INFO */}
                    <div
                      className="text-white space-y-1 text-center lg:text-left flex flex-col items-center lg:items-start"
                      data-swiper-parallax="-100"
                    >
                      <h1
                        className="sm:text-3xl lg:text-5xl font-extrabold cursor-pointer bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 text-transparent bg-clip-text"
                      >
                        {item.title}
                      </h1>

                      <p className="hidden sm:block text-gray-600 max-w-xl">
                        {item.description}
                      </p>
                      <div className="sm:flex gap-1 text-yellow-400 hidden">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>

                      <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                        ₹{item.price}
                      </p>


                      <div className="flex flex-row flex-wrap gap-4 pt-4 justify-center items-center lg:justify-start mb-6">

                        {/* Add to Cart */}
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
    shadow-md
    cursor-pointer
    ${alreadyInCart
                              ? "bg-green-500/20 text-green-600 border border-green-400/40 hover:bg-green-500/30"
                              : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/30"
                            }
    `}
                        >
                          <FaShoppingCart size={18} />

                          {/* Mobile */}
                          <span className="sm:hidden text-sm">
                            {alreadyInCart ? "Cart" : "Add"}
                          </span>

                          {/* Desktop */}
                          <span className="hidden sm:inline">
                            {alreadyInCart ? "View Cart" : "Add to Cart"}
                          </span>
                        </button>


                        {/* View Product */}
                        <button
                          onClick={() => navigate(`/products/${item.id}`)}
                          className="
    flex items-center gap-2
    px-6 py-3
    rounded-xl
    font-semibold
    bg-white/90
    border border-indigo-200
    text-gray-700
 cursor-pointer
    hover:bg-indigo-50
    hover:scale-105
    active:scale-95

    transition-all duration-300
    shadow-sm
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
