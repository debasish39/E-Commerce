import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard"; 
import Loading from "../assets/Loading4.webm"; 

export default function CategoryProduct() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://dummyjson.com/products/category/${category}`
        );
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-32 h-32 sm:w-48 sm:h-48 object-contain"
        >
          <source src={Loading} type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <p className="text-[#f53347] text-lg font-semibold mt-4 capitalize">
          Loading {category} products...
        </p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-10 text-xl font-semibold text-gray-700">
        No products found in {category}.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 capitalize text-gray-800">
        {category} Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
