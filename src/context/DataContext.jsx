import React, { createContext, useContext, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const calculatePrice = (price) => {
    let finalPrice;

    if (price <= 50) {
      finalPrice = price + 69;
    }
    else if (price <= 100) {
      finalPrice = price + 99;
    }
    else if (price <= 300) {
      finalPrice = price + 199;
    }
    else if (price <= 800) {
      finalPrice = price + 299;
    }
    else if (price <= 2000) {
      finalPrice = price + 499;
    }
    else {
      finalPrice = price + 599;
    }

    return Math.round(finalPrice / 10) * 10;
  };
  const fetchAllProducts = async () => {
    try {

      const res = await axios.get("https://dummyjson.com/products?limit=199");

      const productsData = res.data.products.map((product) => ({
        ...product,
        price: calculatePrice(product.price),
      }));

      setData(productsData);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    }
  };

  const getUniqueCategory = (data, property) => {
    if (!Array.isArray(data) || data.length === 0) return [];
    const values = data.map((item) => item[property]);
    return [...new Set(values)];
  };

  const categoryOnlyData = useMemo(() => getUniqueCategory(data, "category"), [data]);
  const brandOnlyData = useMemo(() => getUniqueCategory(data, "brand"), [data]);

  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleBrandChange = (e) => setBrand(e.target.value);
  const filteredData = useMemo(() => {
    let temp = [...data];

    // 🔍 SEARCH
    if (search.trim()) {
      temp = temp.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 📦 CATEGORY
    if (category !== "All") {
      temp = temp.filter((item) => item.category === category);
    }

    // 🏷 BRAND
    if (brand !== "All") {
      temp = temp.filter((item) => item.brand === brand);
    }

    // 💰 PRICE RANGE
    temp = temp.filter(
      (item) =>
        item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // 🔄 SORTING (IMPORTANT)
    if (sort === "low-high") {
      temp.sort((a, b) => a.price - b.price);
    }

    if (sort === "high-low") {
      temp.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      temp.sort((a, b) => b.rating - a.rating);
    }

    return temp;
  }, [data, search, category, brand, priceRange, sort]);
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
        sort, setSort, filteredData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const getData = () => useContext(DataContext);
