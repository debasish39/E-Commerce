import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Breadcrums from "../components/Breadcrums";
import Loading from "../assets/Loading4.webm";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../hooks/useWishlist";
import {
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

export default function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist } = useWishlist();

  const getSingleProduct = async () => {
    try {
      const res = await axios.get(`https://dummyjson.com/products/${id}`);
      setProduct(res.data);
      setSelectedImage(res.data.thumbnail);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, [id]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });
  }, []);

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product);
      setIsWishlisted(false);
    } else {
      addToWishlist(product);
      setIsWishlisted(true);
    }
  };

  const renderRatingStars = () => {
    const stars = [];
    const rating = product?.rating || 0;
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (rating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  return (
    <>
      {product ? (
        <div className="px-4 pb-16 md:px-8" data-aos="fade-up">
          <Breadcrums title={product.title} />

          <div
            className="max-w-6xl mx-auto py-8 grid grid-cols-1 md:grid-cols-2 gap-10 rounded-2xl p-6 md:p-10"
            data-aos="zoom-in"
          >
            {/* Left Side - Image Gallery */}
            <div className="flex flex-col items-center" data-aos="fade-right">
              <div className="relative group w-full">
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="rounded-xl w-full h-auto object-cover shadow-md transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex gap-3 mt-4 overflow-x-auto">
                {product.images?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="thumbnail"
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-lg object-cover border-2 cursor-pointer transition-all ${
                      selectedImage === img
                        ? "border-red-500 shadow-xl"
                        : "border-gray-200"
                    }`}
                    data-aos="fade-up"
                    data-aos-delay={idx * 100}
                  />
                ))}
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="flex flex-col justify-center gap-6" data-aos="fade-left">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {product.title}
                </h1>
                <div className="text-sm text-gray-500 uppercase tracking-wide">
                  {product.brand} / {product.category}
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{product.description}</p>

              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold text-red-500">₹{product.price}</h2>
                <span className="text-gray-400 line-through">
                  ₹{Math.round(product.price / (1 - product.discountPercentage / 100))}
                </span>
                <span className="ml-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                  {Math.round(product.discountPercentage)}% OFF
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">{renderRatingStars()}</div>

              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <input
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="w-20 border border-gray-300 rounded-md px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* Add to Cart & Wishlist Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full" data-aos="fade-up" data-aos-delay="200">
                <button
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-medium rounded-lg shadow-md transition-all cursor-pointer"
                  onClick={() => addToCart(product)}
                >
                  <FaShoppingCart className="text-lg" />
                  Add to Cart
                </button>

                <button
                  onClick={handleWishlist}
                  className={`flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-lg text-sm sm:text-base font-medium shadow-md transition-all cursor-pointer ${
                    isWishlisted
                      ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {isWishlisted ? (
                    <FaHeart className="text-red-500 text-lg" />
                  ) : (
                    <FaRegHeart className="text-white text-lg" />
                  )}
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-500 border-t pt-4" data-aos="fade-up" data-aos-delay="300">
                <p>🚚 Free Delivery on orders above ₹500</p>
                <p>🔁 7-Day Replacement Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <video muted autoPlay loop className="w-40 opacity-70">
            <source src={Loading} type="video/webm" />
          </video>
        </div>
      )}
    </>
  );
}
