import React from "react";

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <input
      type="text"
      placeholder="Search products..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full sm:w-64 px-4 py-2 rounded-full border border-gray-300 
                 focus:outline-none focus:ring-2 focus:ring-[#f53347] 
                 dark:bg-gray-800 dark:text-white"
    />
  );
}
