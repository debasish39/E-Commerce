import React, { createContext, useContext, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; 

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get("https://dummyjson.com/products?limit=300")

      const productsData = res.data.products;
      setData(productsData);
      console.log(productsData);
    } catch (error) {
      console.error(error);
      // toast.error("Failed to fetch products "); 
    }
  };

  const getUniqueCategory = (data, property) => {
    if (!Array.isArray(data) || data.length === 0) return [];
    const values = data.map((item) => item[property]);
    return [ ...new Set(values)];
  };

  const categoryOnlyData = useMemo(() => getUniqueCategory(data, "category"), [data]);
  const brandOnlyData = useMemo(() => getUniqueCategory(data, "brand"), [data]);

  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleBrandChange = (e) => setBrand(e.target.value);

  return (
    <DataContext.Provider
      value={{
        data,
        fetchAllProducts,
        search,
        setSearch,
        category,
        setCategory,
        brand,
        setBrand,
        priceRange,
        setPriceRange,
        handleCategoryChange,
        handleBrandChange,
        categoryOnlyData,
        brandOnlyData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const getData = () => useContext(DataContext);
