import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Breadcrums from "../components/Breadcrums";
import Loading from "../assets/Loading4.webm";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/wishlistContext";
import { toast } from "sonner";
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
  FaShareAlt,
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
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist } = useWishlist();

  /* ================= Fetch Product ================= */
  const getSingleProduct = async () => {
    try {
      const res = await axios.get(
        `https://dummyjson.com/products/${id}`
      );
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
      once: true,
    });
  }, []);

  /* ================= Add to Cart ================= */
  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error("Out of Stock", {
        description: "This product is currently unavailable.",
      });
      return;
    }

    if (quantity < 1) {
      toast.warning("Invalid Quantity", {
        description: "Please select at least 1 item.",
      });
      return;
    }

    addToCart(product, quantity);

    toast.success("Added to Cart 🛒", {
      description: `${product.title} × ${quantity}`,
    });
  };

  /* ================= Wishlist ================= */
  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product);
      setIsWishlisted(false);
      toast("Removed from Wishlist 💔", {
        description: product.title,
      });
    } else {
      addToWishlist(product);
      setIsWishlisted(true);
      toast.success("Added to Wishlist ❤️", {
        description: product.title,
      });
    }
  };

  /* ================= Share ================= */
  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: product.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard 🔗");
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= Rating Stars ================= */
  const renderRatingStars = () => {
    const stars = [];
    const rating = product?.rating || 0;

    for (let i = 1; i <= 5; i++) {
      if (rating >= i)
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (rating >= i - 0.5)
        stars.push(
          <FaStarHalfAlt key={i} className="text-yellow-400" />
        );
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  return (
    <>
      {product ? (
        <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-10 text-white overflow-hidden">
          <Breadcrums title={product.title} />

          <div
            className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 py-6"
            data-aos="fade-up"
          >
            {/* ================= LEFT COLUMN ================= */}
            <div className="flex flex-col items-center">
              <div className="relative group w-full  overflow-hidden shadow-2xl">

                {/* ===== Flipkart Style Right Action Bar ===== */}
                <div className="
                  absolute top-6 right-4
                  flex flex-col gap-3
                   backdrop-blur-md

                  rounded-2xl
                  shadow-xl z-20
                ">

                  {/* Wishlist */}
                  <button
                    onClick={handleWishlist}
                    data-tooltip-id="wishlist-tooltip"
                    data-tooltip-content={
                      isWishlisted
                        ? "Remove from Wishlist"
                        : "Add to Wishlist"
                    }
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110"
                  >
                    {isWishlisted ? (
                      <FaHeart className="text-red-500 text-lg" />
                    ) : (
                      <FaRegHeart className="text-white text-lg" />
                    )}
                  </button>

                  {/* Share */}
                  <button
                    onClick={handleShare}
                    data-tooltip-id="share-tooltip"
                    data-tooltip-content="Share Product"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110"
                  >
                    <FaShareAlt className="text-white text-lg" />
                  </button>
                </div>

                {/* Main Image */}
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Discount Badge */}
                <div
                  className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-pink-500 text-white px-3 py-1 text-xs rounded-full flex items-center gap-1 shadow-md"
                >
                  <FaTag /> {Math.round(product.discountPercentage)}% OFF
                </div>

                <Tooltip id="wishlist-tooltip" place="left" />
                <Tooltip id="share-tooltip" place="left" />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 mt-4 overflow-x-auto justify-center w-full px-2">
                {product.images?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="thumbnail"
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border-2 cursor-pointer transition-all duration-300  ${
                      selectedImage === img
                        ? "border-red-500 shadow-lg"
                        : "border-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-3xl md:text-4xl font-extrabold">
                {product.title}
              </h1>

              <div className="flex items-center gap-2 text-sm text-gray-300">
                <FaIndustry /> {product.brand}
                <span>/</span>
                <FaListAlt /> {product.category}
              </div>

              <p className="text-gray-300">
                {product.description}
              </p>

              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-red-500 flex items-center gap-1">
                  <FaRupeeSign /> {product.price}
                </h2>

                <span className="text-gray-400 line-through">
                  ₹
                  {Math.round(
                    product.price /
                      (1 - product.discountPercentage / 100)
                  )}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {renderRatingStars()}
                <span className="ml-2 text-gray-400 text-sm">
                  ({product.rating})
                </span>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">
                  Quantity:
                </label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Number(e.target.value))
                  }
                  className="w-20 border border-gray-400 rounded-md px-3 py-2 text-center bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 px-2">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-300 space-y-2 border-t border-gray-600 pt-4">
                <p className="flex items-center gap-2">
                  <FaTruck className="text-green-500" /> Free Delivery above ₹500
                </p>
                <p className="flex items-center gap-2">
                  <FaUndoAlt className="text-blue-500" /> 7-Day Replacement
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
