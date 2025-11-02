import React, { useEffect } from 'react';
import { getData } from '../context/DataContext';
import AOS from 'aos';
import 'aos/dist/aos.css';

const FilterSection = ({
  search,
  setSearch,
  brand,
  setBrand,
  priceRange,
  setPriceRange,
  category,
  setCategory,
  handleBrandChange,
  handleCategoryChange,
}) => {
  const { categoryOnlyData, brandOnlyData } = getData();

  useEffect(() => {
    AOS.init({
      duration: 300,
      easing: 'ease-out-cubic',
      once: false,
      offset: 50,
    });
  }, []);

  return (
    <div
      className="mt-10 p-4 rounded-md h-max w-full md:w-64 block shadow-md bg-transparent border border-gray-200"
      data-aos="fade-right"
      data-aos-duration="800"
    >
      {/* Search */}
      <div data-aos="zoom-in" data-aos-delay="100">
        <input
          type="text"
          placeholder="🔍 Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/60 p-2 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
        />
      </div>

      {/* Category Filter */}
      <div data-aos="fade-left" data-aos-delay="200">
        <h1 className="mt-6 font-semibold text-xl border-b pb-1 border-gray-200">Category</h1>
        <div className="flex flex-col gap-2 mt-3">
          {categoryOnlyData?.map(
            (item, index) =>
              item && (
                <label
                  key={index}
                  className="flex items-center gap-2 hover:bg-red-50 transition rounded-md px-2 py-1 text-white hover:text-red-500"
                  data-aos="fade-up"
                  data-aos-delay={250 + index * 80}
                >
                  <input
                    type="radio"
                    name="category"
                    checked={category === item}
                    value={item}
                    onChange={handleCategoryChange}
                    className="accent-red-500"
                  />
                  <span className="uppercase cursor-pointer text-white hover:text-red-500">{item}</span>
                </label>
              )
          )}
        </div>
      </div>

      {/* Brand Filter */}
      <div data-aos="fade-right" data-aos-delay="400">
        <h1 className="mt-6 font-semibold text-xl border-b pb-1 border-gray-200">Brand</h1>
        <select
          className="bg-gray-50 w-full p-2 border border-gray-300 rounded-md mt-3 focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
          value={brand}
          onChange={handleBrandChange}
          data-aos="zoom-in"
          data-aos-delay="450"
        >
          {brandOnlyData?.map(
            (item, index) =>
              item && (
                <option key={index} value={item}>
                  {item.toUpperCase()}
                </option>
              )
          )}
        </select>
      </div>

      {/* Price Range Filter */}
      <div data-aos="fade-left" data-aos-delay="600">
        <h1 className="mt-6 font-semibold text-xl border-b pb-1 border-gray-200">Price Range</h1>
        <div className="flex flex-col gap-2 mt-3">
          <label className="text-white font-medium">
            ₹{priceRange[0]} - ₹{priceRange[1]}
          </label>
          <input
            type="range"
            min="0"
            max="5000"
            className="accent-red-500 cursor-pointer"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            data-aos="zoom-in"
            data-aos-delay="650"
          />
        </div>
      </div>

      {/* Reset Button */}
      <div data-aos="flip-up" data-aos-delay="800">
        <button
          className="bg-red-500 text-white rounded-md px-3 py-2 mt-6 w-full hover:bg-red-600 transition-all"
          onClick={() => {
            setSearch('');
            setCategory('All');
            setBrand('All');
            setPriceRange([0, 5000]);
          }}
        >
           Reset Filters
        </button>
      </div>

      <hr className="border-gray-300 mt-6" data-aos="fade-in" data-aos-delay="900" />
    </div>
  );
};

export default FilterSection;
