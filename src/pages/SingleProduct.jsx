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
  const [quantity, setQuantity] = useState(1);

  // ✅ Persist selected image per product
  const [selectedImage, setSelectedImage] = useState(() => {
    const saved = localStorage.getItem(`selectedImage_${id}`);
    return saved ? saved : null;
  });

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  /* ================= Fetch Product ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://dummyjson.com/products/${id}`
        );
        setProduct(res.data);

        const savedImage = localStorage.getItem(
          `selectedImage_${id}`
        );

        if (savedImage) {
          setSelectedImage(savedImage);
        } else {
          setSelectedImage(res.data.thumbnail);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  /* ================= Derived Wishlist State ================= */
  const isWishlisted = wishlist?.some(
    (item) => item.id === product?.id
  );

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
        description: "Select at least 1 item.",
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
    if (!product) return;

    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast("Removed from Wishlist 💔", {
        description: product.title,
      });
    } else {
      addToWishlist(product);
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
        toast.success("Link copied 🔗");
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
      else
        stars.push(
          <FaRegStar key={i} className="text-yellow-400" />
        );
    }

    return stars;
  };

  /* ================= Loading ================= */
  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <video muted autoPlay loop className="w-40 opacity-80">
          <source src={Loading} type="video/webm" />
        </video>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-10 text-white overflow-hidden">
      <Breadcrums title={product.title} />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 py-6">

        {/* LEFT COLUMN */}
        <div className="flex flex-col items-center">
          <div className="relative w-full shadow-2xl">

            {/* Action Bar */}
            <div className="absolute top-6 right-0 flex flex-col gap-3 z-20">

              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer text-xl ${
                  isWishlisted
                    ? "bg-white/20 text-red-500"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {isWishlisted ? <FaHeart /> : <FaRegHeart />}
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 cursor-pointertext-white text-xl hover:bg-white/30 transition cursor-pointer hover:scale-110"
              >
                <FaShareAlt />
              </button>
            </div>

            {/* Main Image */}
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full object-cover transition-transform duration-500 hover:scale-105"
            />

            {/* Discount Badge */}
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-pink-500 text-white px-3 py-1 text-xs rounded-full flex items-center gap-1 shadow-md">
              <FaTag /> {Math.round(product.discountPercentage)}% OFF
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 overflow-x-auto justify-center w-full px-2">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="thumbnail"
                onClick={() => {
                  setSelectedImage(img);
                  localStorage.setItem(
                    `selectedImage_${id}`,
                    img
                  );
                }}
                className={`w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border-2 cursor-pointer transition ${
                  selectedImage === img
                    ? "border-red-500 shadow-lg "
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
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
              className="w-20 border border-gray-400 rounded-md px-3 py-2 text-center bg-white/10 focus:ring-2 focus:ring-red-400"
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-black/90 border border-red-900 hover:from-red-600 hover:to-black-500 font-semibold rounded-xl shadow-lg  transition-all cursor-pointer"
          >
            <FaShoppingCart /> Add to Cart
          </button>

          <div className="mt-6 text-sm text-gray-300 space-y-2 border-t border-gray-600 pt-4">
            <p className="flex items-center gap-2">
              <FaTruck className="text-green-500" />
              Free Delivery above ₹500
            </p>
            <p className="flex items-center gap-2">
              <FaUndoAlt className="text-blue-500" />
              7-Day Replacement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
