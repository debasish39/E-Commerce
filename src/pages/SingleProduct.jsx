import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Breadcrums from "../components/Breadcrums";
import Loading from "../assets/Loading4.webm";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/wishlistContext";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fa";
import { SlActionRedo } from "react-icons/sl";
import AOS from "aos";
import "aos/dist/aos.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import ProductCard from "../components/ProductCard";
import { useUser } from "@clerk/clerk-react";
export default function SingleProduct() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  // ✅ Persist selected image per product
  const [selectedImage, setSelectedImage] = useState(() => {
    const saved = localStorage.getItem(`selectedImage_${id}`);
    return saved ? saved : null;
  });

  const { addToCart, cartItem } = useCart();
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
    const fetchRelated = async () => {
      if (!product?.category) return;

      try {
        const res = await axios.get(
          `https://dummyjson.com/products/category/${product.category}`
        );

        const filtered = res.data.products
          .filter((item) => item.id !== product.id)
          .slice(0, 6);

        setRelatedProducts(filtered);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRelated();
  }, [product]);
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });
  }, []);
  const calculatePrice = (price) => {
    let finalPrice;

    if (price <= 50) {
      finalPrice = price + 69;
    }
    else if (price <= 100) {
      finalPrice = price + 99;
    }
    else if (price <= 300) {
      finalPrice = price + 199;
    }
    else if (price <= 800) {
      finalPrice = price + 299;
    }
    else if (price <= 2000) {
      finalPrice = price + 499;
    }
    else {
      finalPrice = price + 599;
    }

    return Math.round(finalPrice / 10) * 10;
  };
  const isWishlisted = wishlist.some(
    (item) => String(item.productId) === String(product?.id)
  );
 const handleAddToCart = () => {

  if (!product) return;

  if (!isSignedIn) {
    toast.error("Please login first");
    navigate("/sign-in");
    return;
  }

  const alreadyInCart = cartItem.some(
    (item) => String(item.productId) === String(product.id)
  );

  if (alreadyInCart) {
    navigate("/cart");
    return;
  }

  if (product.stock <= 0) {
    toast.error("Out of Stock");
    return;
  }

  addToCart({
    ...product,
    price: calculatePrice(product.price)
  });

};
  /* ================= Wishlist ================= */
 const handleWishlist = () => {

  if (!product) return;

  if (!isSignedIn) {
    toast.error("Please login first");
    navigate("/sign-in");
    return;
  }

  if (isWishlisted) {

    removeFromWishlist(String(product.id));

    toast("Removed from Wishlist 💔", {
      description: product.title,
    });

  } else {

    addToWishlist({
      ...product,
      price: calculatePrice(product.price)
    });

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
    <>
      <div className="relative min-h-screen py-9 sm:py-3 px-4 sm:px-6 lg:px-10 text-white overflow-hidden">
        <Breadcrums title={product.title} />

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 py-6">

          {/* LEFT COLUMN */}
          <div data-aos="fade-right" className="flex flex-col items-center">
            <div className="relative w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

              {/* Action Buttons */}
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <button
                  onClick={handleWishlist}
                  className={`w-12 h-12 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white/20 text-xl cursor-pointer ${isWishlisted ? "text-red-500" : "text-white"
                    }`}
                >
                  {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                </button>

                <button
                  onClick={handleShare}
                  className="w-12 h-12 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white/20 text-xl cursor-pointer"
                >
                  <SlActionRedo />
                </button>
              </div>

              {/* Discount */}
              <div className="absolute top-6 left-6 bg-red-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <FaTag />
                {Math.round(product.discountPercentage)}% OFF
              </div>

              {/* Main Image */}
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full max-h-[420px] object-contain mx-auto transition-all duration-700 hover:scale-110"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 mt-8 overflow-x-auto">
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
                  className={`w-20 h-20 rounded-2xl object-cover cursor-pointer transition-all duration-300 flex-shrink-0 ${selectedImage === img
                    ? "border border-red-500  shadow-xl"
                    : "opacity-70 border hover:opacity-100"
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
                <FaRupeeSign /> {calculatePrice(Number(product.price))}
              </h2>

              <span className="text-gray-400 line-through">
                ₹
                {Math.round(
                  calculatePrice(product.price) /
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
                onChange={(e) => {
                  const value = Math.max(1, Number(e.target.value));
                  setQuantity(value);
                }}
                className="w-20 border border-gray-400 rounded-md px-3 py-2 text-center bg-white/10 focus:ring-2 focus:ring-red-400"
              />
            </div>

        <button
  onClick={handleAddToCart}
  className={`
  group relative overflow-hidden

  w-full sm:w-auto
  flex items-center justify-center gap-2

  px-4 sm:px-7
  py-2.5 sm:py-3.5

  text-sm sm:text-base font-semibold

  rounded-xl sm:rounded-2xl

  backdrop-blur-xl border

  transition-all duration-300 ease-out

  active:scale-95
  hover:scale-[1.05]

  shadow-md hover:shadow-xl

  ${
    cartItem.some((item) => String(item.productId) === String(product.id))
      ? "bg-green-500/10 border-green-400/40 text-green-400 hover:bg-green-500/20"
      : "bg-red-500/10 border-red-400/40 text-white hover:bg-red-500/20"
  }
`}
>

{/* Animated Gradient Border */}
<span
  className="
  absolute inset-0 rounded-xl sm:rounded-2xl
  border border-transparent
  bg-gradient-to-r from-red-500/40 via-pink-500/40 to-red-500/40
  opacity-0 group-hover:opacity-100
  blur-md
  transition duration-500
"
/>

{/* Shine Sweep */}
<span
  className="
  absolute inset-0
  bg-gradient-to-r
  from-transparent via-white/25 to-transparent
  translate-x-[-150%]
  group-hover:translate-x-[150%]
  transition-transform duration-700
"
/>

{/* Icon */}
<FaShoppingCart
  className="
  relative z-10
  text-sm sm:text-base
  transition-transform duration-300
  group-hover:-translate-y-1 group-hover:scale-110
"
/>

{/* Text */}
<span className="relative z-10 whitespace-nowrap">

{cartItem.some((item) => String(item.productId) === String(product.id))
  ? "Buy Now"
  : "Add to Cart"}

</span>

{/* Glow */}
<span
  className={`
  absolute inset-0
  rounded-xl sm:rounded-2xl
  opacity-0 group-hover:opacity-100
  blur-xl transition duration-300

  ${
    cartItem.some((item) => String(item.productId) === String(product.id))
      ? "bg-green-500/20"
      : "bg-red-500/20"
  }
`}
/>

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
        <div className="max-w-6xl mx-auto mt-9" data-aos="fade-up">

          <h2 className="text-2xl font-bold mb-3">
            Related Products
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

            {relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
              />
            ))}

          </div>

        </div>
      </div>

    </>
  );
}
