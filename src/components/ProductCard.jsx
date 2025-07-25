import React from 'react'
import { IoCartOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, cartItem } = useCart();

  // Check if product already in cart
  const isAlreadyInCart = cartItem.some((item) => item.id === product.id);

  return (
    <div className='border relative border-red-300 rounded-2xl cursor-pointer hover:scale-105 active:scale-105 hover:shadow-2xl active:shadow-2xl transition-all p-2 h-max'>
      <img
        src={product.images}
        alt={product.title}
        className='bg-transparent aspect-square center w-[100%] h-[100%]'
        onClick={() => navigate(`/products/${product.id}`)}
      />
      <h1 className='line-clamp-2 p-1 font-semibold'>{product.title}</h1>
      <p className='my-1 text-lg text-gray-800 font-bold'>₹{product.price}</p>
      <button
        className={`px-3 py-2 text-[13px] sm:text-lg rounded-md w-full cursor-pointer flex gap-2 items-center justify-center font-semibold ${
          isAlreadyInCart
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-red-500 text-white'
        }`}
        disabled={isAlreadyInCart}
        onClick={() => addToCart(product)}
      >
        <IoCartOutline className='w-6 h-6' />
        {isAlreadyInCart ? 'Added' : 'Add to Cart'}
      </button>
    </div>
  );
}
