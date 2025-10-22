import React, { useEffect } from 'react';
import { IoCartOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, cartItem } = useCart();

  const isAlreadyInCart = cartItem.some((item) => item.id === product.id);

  useEffect(() => {
    AOS.init({
      duration: 300,
      easing: 'ease-in-out',
      once: false,
      offset: 50,
    });
  }, []);

  return (
    <div
      className="border relative border-red-300 rounded-2xl cursor-pointer hover:scale-105 active:scale-105 hover:shadow-2xl active:shadow-2xl transition-all p-2 h-max bg-transparent"
      data-aos="zoom-in-up"
      data-aos-delay="100"
      data-aos-offset="120"
    >
      <img
        src={product.thumbnail || product.images?.[0]}
        alt={product.title}
        className="bg-transparent aspect-square w-full h-full object-contain rounded-xl"
        onClick={() => navigate(`/products/${product.id}`)}
        onError={(e) => (e.target.src = 'https://via.placeholder.com/200?text=No+Image')}
        data-aos="fade-up"
        data-aos-delay="150"
      />

      <div data-aos="fade-up" data-aos-delay="200">
        <h1 className="line-clamp-2 p-1 font-semibold">{product.title}</h1>
        <p className="my-1 text-lg text-gray-800 font-bold">₹{product.price}</p>
      </div>

      <div data-aos="flip-up" data-aos-delay="300">
        <button
          className={`px-3 py-2 text-[13px] sm:text-lg rounded-md w-full flex gap-2 items-center justify-center font-semibold transition-all ${
            isAlreadyInCart
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
          disabled={isAlreadyInCart}
          onClick={() => addToCart(product)}
        >
          <IoCartOutline className="w-6 h-6" />
          {isAlreadyInCart ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
