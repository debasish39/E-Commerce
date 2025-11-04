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
  FaIndustry,
  FaListAlt,
  FaRupeeSign,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

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
      if (rating >= i)
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (rating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  return (
    <>
      {product ? (
        <div className="min-h-screen px-4 md:px-8 py-3">
          <Breadcrums title={product.title} />

          <div
            className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 border border-white/30 shadow-2xl rounded-2xl p-6 md:p-10"
            data-aos="fade-up"
          >
            {/* ===== LEFT COLUMN ===== */}
            <div className="flex flex-col items-center">
              {/* --- Main Image --- */}
              <div className="relative group w-full rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-pink-500 text-white px-3 py-1 text-xs rounded-full flex items-center gap-1 shadow-md"
                  data-tooltip-id="discount-tooltip"
                  data-tooltip-content="Discount applied on MRP"
                >
                  <FaTag /> {Math.round(product.discountPercentage)}% OFF
                </div>
                <Tooltip id="discount-tooltip" place="top" />
              </div>

              {/* --- Thumbnails --- */}
              <div className="flex gap-3 mt-4 overflow-x-auto justify-center w-full px-2 scrollbar-hide">
                {product.images?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="thumbnail"
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedImage === img
                        ? "border-red-500 shadow-lg"
                        : "border-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* --- Highlights Section --- */}
              <div className="mt-8 w-full" data-aos="fade-up">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                  Highlights
                </h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                  <li>Discount: {Math.round(product.discountPercentage)}% OFF</li>
                  <li>High-quality build by {product.brand}</li>
                  <li>Category: {product.category}</li>
                  <li>Free Delivery above ₹500</li>
                  <li>7-Day Replacement Guarantee</li>
                </ul>
              </div>

              {/* --- Product Specifications Below Highlights --- */}
              <div
                className="mt-8 border-t border-gray-300 dark:border-gray-600 pt-6 w-full"
                data-aos="fade-up"
              >
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <FaListAlt className="text-red-500" /> Product Specifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex justify-between border-b border-gray-300 dark:border-gray-600 py-2">
                    <span className="font-semibold">Brand</span>
                    <span>{product.brand || "Not specified"}</span>
                  </div>

                  <div className="flex justify-between border-b border-gray-300 dark:border-gray-600 py-2">
                    <span className="font-semibold">Category</span>
                    <span>{product.category || "N/A"}</span>
                  </div>

                  <div className="flex justify-between border-b border-gray-300 dark:border-gray-600 py-2">
                    <span className="font-semibold">Stock</span>
                    <span>
                      {product.stock > 0 ? `${product.stock} Units` : "Out of Stock"}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-gray-300 dark:border-gray-600 py-2">
                    <span className="font-semibold">Warranty</span>
                    <span>{product.warranty || "1 Year Manufacturer Warranty"}</span>
                  </div>

                  <div className="flex justify-between border-b border-gray-300 dark:border-gray-600 py-2">
                    <span className="font-semibold">Discount</span>
                    <span>{Math.round(product.discountPercentage)}%</span>
                  </div>

                  <div className="flex justify-between border-b border-gray-300 dark:border-gray-600 py-2">
                    <span className="font-semibold">Rating</span>
                    <span>{product.rating} ★</span>
                  </div>

                  <div className="flex justify-between border-b border-gray-300 dark:border-gray-600 py-2">
                    <span className="font-semibold">Return Policy</span>
                    <span>7 Days Replacement</span>
                  </div>

                  <div className="flex justify-between border-b border-gray-300 dark:border-gray-600 py-2">
                    <span className="font-semibold">Seller</span>
                    <span>{product.seller || "E-Shop Official"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== RIGHT COLUMN ===== */}
            <div className="flex flex-col justify-center space-y-6">
              {/* Title & Brand */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white flex flex-wrap items-center gap-2">
                  {product.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <FaIndustry /> {product.brand}
                  <span>/</span>
                  <FaListAlt /> {product.category}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>

              {/* Price */}
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-red-600 flex items-center gap-1">
                  <FaRupeeSign /> {product.price}
                </h2>
                <span className="text-gray-400 line-through">
                  ₹
                  {Math.round(
                    product.price / (1 - product.discountPercentage / 100)
                  )}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {renderRatingStars()}
                <span className="ml-2 text-gray-600 text-sm">
                  ({product.rating})
                </span>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Quantity:
                </label>
                <input
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="w-20 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-center bg-white/30 dark:bg-gray-800/40 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white text-base font-semibold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                  onClick={() => addToCart(product)}
                >
                  <FaShoppingCart /> Add to Cart
                </button>

                <button
                  onClick={handleWishlist}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-base font-semibold shadow-lg transition-all duration-200 ${
                    isWishlisted
                      ? "bg-white/30 text-gray-900 dark:text-gray-100 hover:bg-white/40"
                      : "bg-gradient-to-r from-pink-500 to-red-500 text-white hover:scale-105"
                  }`}
                >
                  {isWishlisted ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-white" />
                  )}
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </button>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 text-sm text-gray-700 dark:text-gray-400 space-y-2 border-t border-gray-300 dark:border-gray-600 pt-4">
                <p className="flex items-center gap-2">
                  <FaTruck className="text-green-500" /> Free Delivery on orders
                  above ₹500
                </p>
                <p className="flex items-center gap-2">
                  <FaUndoAlt className="text-blue-500" /> 7-Day Replacement
                  Guarantee
                </p>
                <p className="flex items-center gap-2">
                  <FaTag className="text-orange-500" /> Inclusive of all taxes
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <video muted autoPlay loop className="w-40 opacity-80">
            <source src={Loading} type="video/webm" />
          </video>
        </div>
      )}
    </>
  );
}
