import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Breadcrums from '../components/Breadcrums';
import Loading from '../assets/Loading4.webm';
import { useCart } from '../context/CartContext';

export default function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); 
  const {addToCart}=useCart();
  const getSingleProduct = async () => {
    try {
      const res = await axios.get(`https://dummyjson.com/products/${id}`);
      setProduct(res.data);
      setSelectedImage(res.data.thumbnail); // ⭐ Set initial image
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, [id]);

  return (
    <>
      {product ? (
        <div className="px-4 pb-10 md:px-0">
          <Breadcrums title={product.title} />

          <div className="max-w-6xl mx-auto py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Product Image */}
            <div className="w-full">
              <img
                src={selectedImage}
                alt={product.title}
                className="rounded-xl w-full h-auto object-cover shadow-md transition duration-300"
              />
              <div className="flex gap-2 mt-4 overflow-x-auto overflow-y-hidden">
                {product.images?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="thumbnail"
                    onClick={() => setSelectedImage(img)} // ⭐ On click, set main image
                    className={`w-20 h-20 rounded-md object-cover border cursor-pointer transition-transform hover:scale-105 ${
                      selectedImage === img ? 'shadow-2xl border-red-500' : 'ring-0'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {product.title}
              </h1>

              <div className="text-sm text-gray-600 uppercase tracking-wide">
                {product.brand} / {product.category}
              </div>

              <p className="text-gray-600">{product.description}</p>

              {/* Pricing */}
              <div className="text-xl font-semibold text-red-500">
                ₹{product.price}
                <span className="text-sm text-gray-500 line-through ml-2">
                  ₹{Math.round(product.price / (1 - product.discountPercentage / 100))}
                </span>
                <span className="ml-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                  {Math.round(product.discountPercentage)}% OFF
                </span>
              </div>

              {/* Rating */}
              <div className="text-sm text-yellow-500">
                ⭐ {product.rating} / 5
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <input
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="w-20 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-4">
                <button className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition"onClick={()=>addToCart(product)}>
                  Add to Cart
                </button>
                <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-md transition">
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <video muted autoPlay loop>
            <source src={Loading} type="video/webm" />
          </video>
        </div>
      )}
    </>
  );
}
