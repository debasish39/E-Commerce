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
  FaTag,
  FaTruck,
  FaUndoAlt,
  FaBoxOpen,
  FaIndustry,
  FaListAlt,
  FaRupeeSign,
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
        <div className="px-4 pb-16 md:px-8 bg-gradient-to-b from-orange-30 via-white to-orange-200 min-h-screen">
          <Breadcrums title={product.title} />

          <div
            className="max-w-6xl mx-auto py-10 grid grid-cols-1 md:grid-cols-2 gap-10 rounded-2xl p-6 md:p-10 shadow-lg "
            data-aos="zoom-in"
          >
            {/* Left Side - Image Gallery */}
            <div className="flex flex-col items-center" data-aos="fade-right">
              <div className="relative group w-full rounded-xl overflow-hidden shadow-md">
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Discount Tag */}
                <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs rounded-full flex items-center gap-1 shadow-md">
                  <FaTag /> {Math.round(product.discountPercentage)}% OFF
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-3 mt-4 overflow-x-auto justify-center">
                {product.images?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="thumbnail"
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-lg object-cover border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedImage === img
                        ? "border-red-500 shadow-xl"
                        : "border-gray-200"
                    }`}
                    
                  />
                ))}
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="flex flex-col justify-center gap-6" data-aos="fade-left">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                  {product.title}
                </h1>
                <div className="text-sm text-gray-500 uppercase tracking-wide flex items-center gap-2">
                  <FaIndustry className="text-gray-400" />
                  {product.brand} <span className="text-gray-400">/</span>{" "}
                  <FaListAlt className="text-gray-400" />
                  {product.category}
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{product.description}</p>

              {/* Price Section */}
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-red-600 flex items-center gap-1">
                  <FaRupeeSign /> {product.price}
                </h2>
                <span className="text-gray-400 line-through">
                  ₹{Math.round(product.price / (1 - product.discountPercentage / 100))}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {renderRatingStars()}
                <span className="ml-2 text-gray-600 text-sm">({product.rating})</span>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <input
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="w-20 border border-gray-300 rounded-md px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-4 mt-6 w-full"
                data-aos="fade-up"
                data-aos-delay="200"
              >
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

              {/* Delivery Info */}
              <div
                className="mt-6 text-sm text-gray-600 border-t pt-4 space-y-2"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <p className="flex items-center gap-2">
                  <FaTruck className="text-green-500" /> Free Delivery on orders above ₹500
                </p>
                <p className="flex items-center gap-2">
                  <FaUndoAlt className="text-blue-500" /> 7-Day Replacement Guarantee
                </p>
                <p className="flex items-center gap-2">
                  <FaTag className="text-orange-500" /> Inclusive of all taxes
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen ">
          <video muted autoPlay loop className="w-40 opacity-70">
            <source src={Loading} type="video/webm" />
          </video>
        </div>
      )}
    </>
  );
}
