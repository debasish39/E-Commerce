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
          .slice(0, 6)
          .map((item) => ({
            ...item,
            price: calculatePrice(item.price),
          }));

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
      price: calculatePrice(product.price),
      quantity,
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
        price: calculatePrice(product.price),
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
      <div className="relative min-h-screen py-9 sm:py-3 px-4 sm:px-6 lg:px-10 text-gray-600 overflow-hidden">
        <Breadcrums title={product.title} />

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 py-6">

          {/* LEFT COLUMN */}
          <div data-aos="fade-right" className="flex flex-col items-center">

            <div className="
  relative w-full max-w-xl
  bg-white/5 backdrop-blur-2xl
  border border-indigo-400/20
  rounded-3xl
  p-8
  shadow-[0_20px_60px_rgba(79,70,229,0.25)]
  overflow-hidden
  ">

              {/* Gradient Glow Background */}
              <div className="
    absolute inset-0
    bg-gradient-to-br
    from-indigo-500/10
    via-blue-500/5
    to-purple-500/10
    pointer-events-none
    " />

              {/* Action Buttons */}
              <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">

                <button
                  onClick={handleWishlist}
                  className={`
        w-11 h-11
        rounded-full
        flex items-center justify-center
        backdrop-blur-xl
        bg-black/5
        border border-black/5
        shadow-lg
        transition-all duration-300
        hover:scale-110
        hover:bg-indigo-500/20
        cursor-pointer
        ${isWishlisted ? "text-pink-500" : "text-black/50"}
        `}
                >
                  {isWishlisted ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
                </button>

                <button
                  onClick={handleShare}
                  className="
       w-11 h-11
        rounded-full
        flex items-center justify-center
        backdrop-blur-xl
        bg-black/5
        border border-black/5
        shadow-lg
        transition-all duration-300
        hover:scale-110
        hover:bg-indigo-500/20
        cursor-pointer
        "
                >
                  <SlActionRedo size={18} />
                </button>

              </div>

              {/* Discount Badge */}
              <div className="
    absolute top-6 left-6
    bg-gradient-to-r from-indigo-600 to-purple-600
    text-white
    text-xs
    font-semibold
    px-4 py-1.5
    rounded-full
    shadow-lg
    flex items-center gap-1
    ">
                <FaTag />
                {Math.round(product.discountPercentage)}% OFF
              </div>

              {/* Main Image */}
              <img
                src={selectedImage}
                alt={product.title}
                loading="lazy"
                className="
      w-full max-h-[420px]
      object-contain
      mx-auto
      transition-transform duration-700
      hover:scale-110
      "
              />

            </div>

            {/* Thumbnails */}
            <div className="
  flex gap-4 mt-8
  overflow-x-auto
  scrollbar-hide
  ">

              {product.images?.map((img, idx) => (

                <div
                  key={idx}
                  onClick={() => {
                    setSelectedImage(img);
                    localStorage.setItem(`selectedImage_${id}`, img);
                  }}
                  className={`
        relative
        w-20 h-20
        rounded-2xl
        overflow-hidden
        cursor-pointer
        transition-all duration-300
        flex-shrink-0
border-1
        ${selectedImage === img
                      ? "ring-1 ring-indigo-500  shadow-lg shadow-indigo-500/30 "
                      : "opacity-70 hover:opacity-100 "
                    }
        `}
                >

                  <img
                    src={img}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                  />

                </div>

              ))}

            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold">
              {product.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaIndustry /> {product.brand}
              <span>/</span>
              <FaListAlt /> {product.category}
            </div>

            <p className="text-gray-500">
              {product.description}
            </p>

            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-indigo-500 flex items-center gap-1">
                <FaRupeeSign />{calculatePrice(product.price)}
              </h2>

              <span className="text-gray-400 line-through">
                ₹
                {Math.round(
                  calculatePrice(product.price) / (1 - product.discountPercentage / 100)
                )}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {renderRatingStars()}
              <span className="ml-2 text-gray-400 text-sm">
                ({product.rating})
              </span>
            </div>

            {/* QUANTITY SELECTOR */}
            {/* <div className="flex items-center gap-4">

      <span className="text-sm font-medium text-gray-700">
        Quantity
      </span>

      <div className="
      flex items-center
      border border-indigo-400/30
      rounded-xl
      overflow-hidden
      ">

        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="
          px-3 py-2
          bg-white/5
          hover:bg-indigo-500/20
          transition
          "
        >
          -
        </button>

        <span className="px-4">{quantity}</span>

        <button
          onClick={() => setQuantity(quantity + 1)}
          className="
          px-3 py-2
          bg-white/5
          hover:bg-indigo-500/20
          transition
          "
        >
          +
        </button>

      </div>
      </div> */}
            <button
              onClick={handleAddToCart}
              className={`
  group relative overflow-hidden
cursor-pointer
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

  focus:outline-none

  shadow-md hover:shadow-xl active:shadow-xl

  ${cartItem.some((item) => String(item.productId) === String(product.id))
                  ? "bg-green-400/10 border-green-400/40 text-green-400 hover:bg-green-500/20 active:bg-green-500/20"
                  : "bg-indigo-900/10 border-indigo-400/40 text-white hover:bg-indigo-500/20 active:bg-indigo-500/20"
                }
`}
            >

              {/* Gradient Border */}
              <span
                className="
  absolute inset-0 rounded-xl sm:rounded-2xl
  border border-transparent
  bg-gradient-to-r from-blue-500/40 via-indigo-500/40 to-purple-500/40
  opacity-0 
  group-hover:opacity-100 
  group-active:opacity-100   /* ✅ MOBILE */
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
  group-active:translate-x-[150%]  /* ✅ MOBILE */

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
  group-active:-translate-y-1 group-active:scale-110  /* ✅ MOBILE */
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

  opacity-0 
  group-hover:opacity-100 
  group-active:opacity-100   /* ✅ MOBILE */

  blur-xl transition duration-300

  ${cartItem.some((item) => String(item.productId) === String(product.id))
                    ? "bg-green-600"
                    : "bg-indigo-900"
                  }
`}
              />

            </button>
            <div className="mt-6 text-sm text-gray-500 space-y-2 border-t border-gray-600 pt-4">
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
