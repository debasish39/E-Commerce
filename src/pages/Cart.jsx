import React from 'react';
import { useCart } from '../context/CartContext';
import { FaRegTrashAlt } from 'react-icons/fa';
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

  const totalPrice = cartItem.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className='mt-10 max-w-6xl md:m-5 lg:mx-auto mb-5 px-4 md:px-0'>
      {cartItem.length > 0 ? (
        <div>
          <h1 className='font-bold text-2xl'>My Cart ({cartItem.length})</h1>

          {/* Cart Items */}
          <div className='mt-10'>
            {cartItem.map((item, index) => (
              <div key={index} className='shadow-2xl p-5 rounded-md flex items-center justify-between mt-3 w-full'>
                <div className='flex items-center gap-4'>
                  <img src={item.images[0]} alt={item.title} className='w-20 h-20 rounded-md' />
                  <div>
                    <h1 className='md:w-[300px] line-clamp-2'>{item.title}</h1>
                    <p className='text-red-500 font-semibold text-lg'>₹{item.price}</p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className='bg-red-500 text-white flex gap-4 p-2 rounded-md font-bold text-xl'>
                  <button
                    data-tooltip-id={`decrease-tooltip-${index}`}
                    data-tooltip-content="Decrease quantity"
                    onClick={() => decreaseQty(item.id)}
                    className='cursor-pointer'
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    data-tooltip-id={`increase-tooltip-${index}`}
                    data-tooltip-content="Increase quantity"
                    onClick={() => increaseQty(item.id)}
                    className='cursor-pointer'
                  >
                    +
                  </button>
                  <Tooltip id={`decrease-tooltip-${index}`} place="top" />
                  <Tooltip id={`increase-tooltip-${index}`} place="top" />
                </div>

                {/* Delete Button */}
                <span
                  className='hover:bg-white/60 transition-all rounded-full p-3 hover:shadow-2xl'
                  data-tooltip-id={`delete-tooltip-${index}`}
                  data-tooltip-content="Remove item from cart"
                >
                  <FaRegTrashAlt
                    className='text-red-500 text-2xl cursor-pointer'
                    onClick={() => {
                      if (window.confirm("Are you sure you want to remove this item from the cart?")) {
                        removeFromCart(item.id);
                      }
                    }}
                  />
                  <Tooltip id={`delete-tooltip-${index}`} place="top" />
                </span>
              </div>
            ))}
          </div>

          {/* Delivery Info and Bill Details */}
          <div className='grid grid-cols-1 md:grid-cols-2 md:gap-20 mt-10'>
            {/* Delivery Info */}
            <div className='shadow-2xl rounded-md p-7 mt-4 space-y-2'>
              <h1 className='text-gray-800 font-bold text-xl'>Delivery Info</h1>

              <div className='flex flex-col space-y-1'>
                <label>Full Name</label>
                <input
                  type='text'
                  className='p-2 rounded-md border border-gray-300 cursor-pointer focus:outline-none focus:border-red-400'
                  value={user?.fullName || ''}
                  readOnly
                />
              </div>

              <div className='flex flex-col space-y-1'>
                <label>Address</label>
                <input
                  type='text'
                  className='p-2 rounded-md border border-gray-300 cursor-pointer focus:outline-none focus:border-red-400'
                  value={location?.county || ''}
                  readOnly
                />
              </div>

              <div className='flex w-full gap-5'>
                <div className='flex flex-col space-y-1 w-full'>
                  <label>State</label>
                  <input
                    type='text'
                    className='p-2 rounded-md border border-gray-300 cursor-pointer focus:outline-none focus:border-red-400 w-full'
                    value={location?.state || ''}
                    readOnly
                  />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <label>PostCode</label>
                  <input
                    type='text'
                    className='p-2 rounded-md border border-gray-300 cursor-pointer focus:outline-none focus:border-red-400 w-full'
                    value={location?.postcode || ''}
                    readOnly
                  />
                </div>
              </div>

              <div className='flex w-full gap-5'>
                <div className='flex flex-col space-y-1 w-full'>
                  <label>Country</label>
                  <input
                    type='text'
                    className='p-2 rounded-md border border-gray-300 cursor-pointer focus:outline-none focus:border-red-400 w-full'
                    value={location?.country || ''}
                    readOnly
                  />
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <label>Phone No</label>
                  <input
                    type='text'
                    placeholder='Enter your Number'
                    className='p-2 rounded-md border border-gray-300 cursor-pointer focus:outline-none focus:border-red-400 w-full'
                  />
                </div>
              </div>

              <button
                className='bg-red-500 text-white px-3 py-1 rounded-md mt-3 cursor-pointer'
                data-tooltip-id="submit-tooltip"
                data-tooltip-content="Submit your delivery details"
              >
                Submit
              </button>
              <Tooltip id="submit-tooltip" place="top" />

              <div className='flex justify-center text-gray-700'>---------OR-----------</div>

              <div className='flex justify-center'>
                <button
                  onClick={getLocation}
                  className='bg-red-500 text-white px-3 py-2 rounded-md cursor-pointer'
                  data-tooltip-id="detect-tooltip"
                  data-tooltip-content="Automatically detect your location"
                >
                  Detect Location
                </button>
                <Tooltip id="detect-tooltip" place="top" />
              </div>
            </div>

            {/* Bill Details */}
            <div className='shadow-md border border-gray-100 rounded-md p-7 mt-4 space-y-2 h-max'>
              <h1 className='text-gray-800 font-bold text-xl'>Bill details</h1>

              <div className='flex justify-between items-center'>
                <h1 className='flex gap-1 items-center text-gray-700'><LuNotebookText /> Items total</h1>
                <p>₹{totalPrice}</p>
              </div>

              <div className='flex justify-between items-center'>
                <h1 className='flex gap-1 items-center text-gray-700'><MdDeliveryDining /> Delivery Charge</h1>
                <p className='text-red-500 font-semibold'><span className='line-through text-gray-600'>₹25</span> FREE</p>
              </div>

              <div className='flex justify-between items-center'>
                <h1 className='flex gap-1 items-center text-gray-700'><GiShoppingBag /> Handling Charge</h1>
                <p className='text-red-500 font-semibold'>₹5</p>
              </div>

              <hr className='text-gray-200 mt-2' />

              <div className='flex justify-between items-center font-semibold text-lg'>
                <h1>Grand total</h1>
                <p>₹{totalPrice + 5}</p>
              </div>

              <div>
                <h1 className='font-semibold text-gray-700 mb-3 mt-7'>Apply Promo Code</h1>
                <div className='flex gap-3'>
                  <input
                    type='text'
                    placeholder='Enter code'
                    className='p-2 rounded-md border border-gray-300 cursor-pointer focus:outline-none focus:border-red-400 w-full'
                  />
                  <button
                    className='bg-white text-black border border-gray-200 px-4 cursor-pointer py-1 rounded-md'
                    data-tooltip-id="promo-tooltip"
                    data-tooltip-content="Apply discount code"
                  >
                    Apply
                  </button>
                  <Tooltip id="promo-tooltip" place="top" />
                </div>
              </div>

              <button
                className='bg-red-500 text-white px-3 py-2 rounded-md w-full cursor-pointer mt-3'
                data-tooltip-id="checkout-tooltip"
                data-tooltip-content="Proceed to checkout and payment"
              >
                Proceed to Checkout
              </button>
              <Tooltip id="checkout-tooltip" place="top" />
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-3 justify-center items-center h-[600px]'>
          <h1 className='text-2xl text-red-500/80 font-bold md:text-5xl'>Oh no! Your cart is empty</h1>
          <img src={emptyCart} alt="Empty Cart" className='w-[400px]' />
          <button
            onClick={() => navigate('/products')}
            className='bg-red-500 text-white px-3 py-2 rounded-md cursor-pointer'
            data-tooltip-id="continue-tooltip"
            data-tooltip-content="Browse products and add to cart"
          >
            Continue Shopping
          </button>
          <Tooltip id="continue-tooltip" place="top" />
        </div>
      )}
    </div>
  );
};

export default Cart;
