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

export default function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(
        `https://dummyjson.com/products/${id}`
      );
      setProduct(res.data);
      setSelectedImage(res.data.thumbnail);
    };
    fetchProduct();
  }, [id]);

  // 🔥 Derived state (correct method)
  const isWishlisted = wishlist?.some(
    (item) => item.id === product?.id
  );

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

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error("Out of Stock");
      return;
    }

    addToCart(product, quantity);
    toast.success("Added to Cart 🛒");
  };

  const renderRatingStars = () => {
    const rating = product?.rating || 0;
    const stars = [];

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

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <video muted autoPlay loop className="w-40 opacity-80">
          <source src={Loading} type="video/webm" />
        </video>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-12 px-6 text-white">
      <Breadcrums title={product.title} />

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 py-6">
        {/* LEFT */}
        <div className="relative">
          <img
            src={selectedImage}
            alt={product.title}
            className="w-full rounded-xl shadow-xl"
          />

          {/* ❤️ Wishlist + Share */}
          <div className="absolute top-6 right-4 flex flex-col gap-3">
            <button
              onClick={handleWishlist}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 cursor-pointer ${
                isWishlisted
                  ? "bg-white/20 text-red-600 text-xl"
                  : "bg-white/20 text-white"
              }`}
            >
              {isWishlisted ? (
                <FaHeart />
              ) : (
                <FaRegHeart />
              )}
            </button>

            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white hover:scale-110 transition cursor-pointer">
              <FaShareAlt />
            </button>
          </div>

          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
            <FaTag /> {Math.round(product.discountPercentage)}% OFF
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">
            {product.title}
          </h1>

          <div className="flex gap-1">
            {renderRatingStars()}
          </div>

          <p className="text-gray-300">
            {product.description}
          </p>

          <h2 className="text-2xl font-bold text-red-400 flex items-center gap-1">
            <FaRupeeSign /> {product.price}
          </h2>

          <div className="flex gap-4 items-center">
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) =>
                setQuantity(Number(e.target.value))
              }
              className="w-20 px-3 py-2 bg-white/10 border border-gray-600 rounded"
            />

            <button
              onClick={handleAddToCart}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-500 rounded-lg flex items-center gap-2"
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>

          <div className="text-sm text-gray-400 space-y-2 pt-4 border-t border-gray-700">
            <p className="flex items-center gap-2">
              <FaTruck /> Free Delivery above ₹500
            </p>
            <p className="flex items-center gap-2">
              <FaUndoAlt /> 7-Day Replacement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
