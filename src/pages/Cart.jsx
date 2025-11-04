import React from 'react';
import { useCart } from '../context/CartContext';
import { FaRegTrashAlt, FaQrcode } from 'react-icons/fa';
import { LuNotebookText } from 'react-icons/lu';
import { MdDeliveryDining } from 'react-icons/md';
import { GiShoppingBag } from 'react-icons/gi';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import emptyCart from "../assets/empty-cart.png";
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const Cart = ({ location, getLocation }) => {
  const { cartItem, removeFromCart, increaseQty, decreaseQty } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  const totalPrice = cartItem.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // ✅ Your UPI ID
  const UPI_ID = "6372031949-2@ybl";

  // 🔄 Generate QR Code with amount and note
  const upiPaymentLink = `upi://pay?pa=${UPI_ID}&pn=Your%20Store&am=${
    totalPrice + 5
  }&cu=INR&tn=Payment%20for%20Order`;

  const upiQrCodeUrl =
    cartItem.length > 0 &&
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      upiPaymentLink
    )}`;

  const handleCheckout = () => {
    if (cartItem.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (window.confirm("Have you completed the UPI payment?")) {
      cartItem.forEach(item => removeFromCart(item.id));
      navigate('/order-success');
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 flex justify-center items-start text-white">
      {cartItem.length > 0 ? (
        <div className="max-w-6xl w-full space-y-8">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-center md:text-left drop-shadow-lg">
            🛒 My Cart <span className="text-red-400">({cartItem.length})</span>
          </h1>

          {/* Cart Items */}
          <div className="space-y-5">
            {cartItem.map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-24 h-24 rounded-xl border border-white/20 object-cover mx-auto sm:mx-0"
                  />
                  <div className="text-center sm:text-left">
                    <h1 className="text-base sm:text-lg font-semibold text-white/90 line-clamp-2">
                      {item.title}
                    </h1>
                    <p className="text-red-400 font-bold text-lg mt-1">
                      ₹{item.price}
                    </p>
                  </div>
                </div>

                {/* Quantity + Delete Controls */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  <div className="bg-red-500/90 text-white flex items-center gap-4 p-2 rounded-full font-bold text-lg sm:text-xl shadow-md mx-auto sm:mx-0">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="cursor-pointer hover:scale-125 transition-transform"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="cursor-pointer hover:scale-125 transition-transform"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm("Remove this item from cart?"))
                        removeFromCart(item.id);
                    }}
                    className="bg-white/10 hover:bg-red-500/90 transition-all rounded-full p-3 hover:text-white shadow-md mx-auto sm:mx-0"
                  >
                    <FaRegTrashAlt className="text-red-400 text-lg sm:text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery & Bill Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            {/* Delivery Info */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-xl text-white/90 space-y-4">
              <h1 className="text-xl sm:text-2xl font-bold text-red-300 text-center sm:text-left">
                Delivery Information
              </h1>

              <div className="flex flex-col space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 text-white text-sm sm:text-base focus:outline-none focus:border-red-400"
                  defaultValue={user?.fullName || ''}
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 text-white text-sm sm:text-base focus:outline-none focus:border-red-400"
                  defaultValue={location?.county || ''}
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="State"
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 text-white text-sm sm:text-base focus:outline-none focus:border-red-400"
                    defaultValue={location?.state || ''}
                  />
                  <input
                    type="text"
                    placeholder="PostCode"
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 text-white text-sm sm:text-base focus:outline-none focus:border-red-400"
                    defaultValue={location?.postcode || ''}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Country"
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 text-white text-sm sm:text-base focus:outline-none focus:border-red-400"
                    defaultValue={location?.country || ''}
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 text-white text-sm sm:text-base focus:outline-none focus:border-red-400"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-2 rounded-lg text-sm sm:text-base hover:scale-105 transition-all">
                    Submit
                  </button>
                  <button
                    onClick={getLocation}
                    className="flex-1 border border-red-400 text-red-300 font-semibold py-2 rounded-lg text-sm sm:text-base hover:bg-red-500/90 hover:text-white transition-all"
                  >
                    Detect Location
                  </button>
                </div>
              </div>
            </div>

            {/* Bill Details + UPI Payment */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-xl text-white/90 space-y-3">
              <h1 className="text-xl sm:text-2xl font-bold text-red-300 text-center sm:text-left">
                Bill Summary
              </h1>

              <div className="space-y-2 text-sm sm:text-base">
                <div className="flex justify-between items-center">
                  <h1 className="flex items-center gap-2">
                    <LuNotebookText /> Items Total
                  </h1>
                  <p>₹{totalPrice}</p>
                </div>
                <div className="flex justify-between items-center">
                  <h1 className="flex items-center gap-2">
                    <MdDeliveryDining /> Delivery
                  </h1>
                  <p className="text-red-300">
                    <span className="line-through text-gray-400">₹25</span> FREE
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <h1 className="flex items-center gap-2">
                    <GiShoppingBag /> Handling
                  </h1>
                  <p>₹5</p>
                </div>

                <hr className="border-white/30 my-3" />

                <div className="flex justify-between font-bold text-lg">
                  <h1>Grand Total</h1>
                  <p>₹{totalPrice + 5}</p>
                </div>
              </div>

              {/* 💳 UPI Payment QR Section */}
              {cartItem.length > 0 && (
                <div className="mt-6 text-center space-y-2 border-t border-white/30 pt-4">
                  <h2 className="font-semibold text-base flex items-center justify-center gap-2">
                    <FaQrcode /> Pay via UPI
                  </h2>
                  <p className="text-xs text-gray-300">
                    Scan the QR below or tap to pay with your UPI app.
                  </p>

                  {/* 🔗 QR Code + Pay Now Button */}
                  <div className="text-center">
                    <a href={upiPaymentLink} target="_blank" rel="noreferrer">
                      <img
                        src={upiQrCodeUrl}
                        alt="UPI QR Code"
                        className="w-40 h-40 mx-auto rounded-lg border border-white/20 shadow-md hover:scale-105 transition-transform"
                      />
                    </a>

                    {/* 💰 Pay Now Button */}
                    <a
                      href={upiPaymentLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
                    >
                      Pay Now
                    </a>
                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    UPI ID: <span className="font-medium">{UPI_ID}</span>
                  </p>

                  {/* ✅ Confirmation Button */}
                  <button
                    onClick={handleCheckout}
                    className="mt-4 bg-green-500/90 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all"
                  >
                    I have completed payment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Empty Cart
        <div className="flex flex-col justify-center items-center text-center min-h-[80vh] px-4 space-y-6 text-white">
          <img
            src={emptyCart}
            alt="Empty Cart"
            className="w-52 sm:w-64 md:w-80 opacity-90 drop-shadow-lg"
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-red-300">
            Your Cart is Empty
          </h1>
          <p className="text-white/70 text-sm sm:text-base">
            Browse products and add something to your cart!
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all text-sm sm:text-base"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
