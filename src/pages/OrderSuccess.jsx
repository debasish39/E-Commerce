import React from 'react';
import { useNavigate } from 'react-router-dom';
import successImg from '../assets/midbanner.png'; // optional success image

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center space-y-5">
      {successImg && (
        <img
          src={successImg}
          alt="Order Success"
          className="w-40 h-40 animate-bounce"
        />
      )}
      <h1 className="text-3xl font-bold text-green-600">
        🎉 Order Placed Successfully!
      </h1>
      <p className="text-gray-700 text-lg">
        Your order will be delivered within <span className="font-semibold text-red-500">7 days</span>.
      </p>
      <button
        onClick={() => navigate('/products')}
        className="bg-red-500 text-white px-5 py-2 rounded-md cursor-pointer hover:bg-red-600"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderSuccess;
