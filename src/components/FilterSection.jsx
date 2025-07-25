import React from 'react';
import { getData } from '../context/DataContext';

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

  console.log("Filter Props:", {
    search,
    brand,
    category,
    priceRange,
  });
  console.log("Context Data:", {
    categoryOnlyData,
    brandOnlyData,
  });

  return (
    <div className=" mt-10 p-4 rounded-md h-max w-full md:w-64 block">
      {/* Search */}
      <input
        type="text"
        placeholder="Search.."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-white p-2 rounded-md border-gray-400 border-2 w-full"
      />

      {/* Category Filter */}
      <h1 className="mt-5 font-semibold text-xl">Category</h1>
      <div className="flex flex-col gap-2 mt-3">
        {categoryOnlyData?.map((item, index) => (
          item && (
            <label key={index} className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                checked={category === item}
                value={item}
                onChange={handleCategoryChange}
              />
              <span className="uppercase cursor-pointer">{item}</span>
            </label>
          )
        ))}
      </div>

      {/* Brand Filter */}
      <h1 className="mt-5 font-semibold text-xl mb-3">Brand</h1>
      <select
        className="bg-gray-100 w-full p-2 border-gray-200 border-2 rounded-md"
        value={brand}
        onChange={handleBrandChange}
      >
        {brandOnlyData?.map((item, index) => (
          item && (
            <option key={index} value={item}>
              {item.toUpperCase()}
            </option>
          )
        ))}
      </select>

      {/* Price Range Filter */}
      <h1 className="mt-5 font-semibold text-xl mb-3">Price Range</h1>
      <div className="flex flex-col gap-2">
        <label>Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</label>
        <input
          type="range"
          min="0"
          max="5000" className='bg-red-600'
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], Number(e.target.value)])
          }
        />
      </div>

      {/* Reset Button */}
      <button
        className="bg-red-500 text-white rounded-md px-3 py-1 mt-5 w-full"
        onClick={() => {
          setSearch('');
          setCategory('All');
          setBrand('All');
          setPriceRange([0, 5000]);
        }}
      >
        Reset Filters
      </button>
      <hr className='border-gray-300' />
    </div>
  );
};

export default FilterSection;
