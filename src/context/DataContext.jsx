import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const DataContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/*
|--------------------------------------------------------------------------
| Get product price
|--------------------------------------------------------------------------
| Your Product schema stores price inside variants[].
|
| For listing pages:
| - simple product -> first active variant
| - variable product -> lowest active variant price
|--------------------------------------------------------------------------
*/
const getProductPrice = (product) => {
  if (!product) return 0;

  const variants = Array.isArray(product.variants)
    ? product.variants.filter((variant) => variant?.isActive !== false)
    : [];

  if (variants.length === 0) {
    return 0;
  }

  const prices = variants
    .map((variant) => Number(variant.price))
    .filter((price) => !Number.isNaN(price) && price >= 0);

  if (prices.length === 0) {
    return 0;
  }

  return Math.min(...prices);
};

/*
|--------------------------------------------------------------------------
| Get original price
|--------------------------------------------------------------------------
*/
const getProductOriginalPrice = (product) => {
  if (!product?.variants?.length) return 0;

  const variants = product.variants.filter(
    (variant) => variant?.isActive !== false
  );

  const prices = variants
    .map((variant) => Number(variant.originalPrice))
    .filter((price) => !Number.isNaN(price) && price > 0);

  if (prices.length === 0) return 0;

  return Math.min(...prices);
};

/*
|--------------------------------------------------------------------------
| Get product stock
|--------------------------------------------------------------------------
*/
const getProductStock = (product) => {
  if (!product?.variants?.length) return 0;

  return product.variants
    .filter((variant) => variant?.isActive !== false)
    .reduce((total, variant) => {
      return total + Number(variant.stock || 0);
    }, 0);
};

/*
|--------------------------------------------------------------------------
| Get product image
|--------------------------------------------------------------------------
*/
const getProductImage = (product) => {
  if (!product) return "";

  if (product.media?.thumbnail) {
    return product.media.thumbnail;
  }

  if (
    Array.isArray(product.media?.images) &&
    product.media.images.length > 0
  ) {
    return product.media.images[0];
  }

  if (
    Array.isArray(product.variants) &&
    product.variants.length > 0
  ) {
    const variantWithImage = product.variants.find(
      (variant) =>
        Array.isArray(variant.images) && variant.images.length > 0
    );

    if (variantWithImage) {
      return variantWithImage.images[0];
    }
  }

  return "";
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);

  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");

  const [priceRange, setPriceRange] =
  useState([0, 100000]);

  /*
  |--------------------------------------------------------------------------
  | Fetch all products
  |--------------------------------------------------------------------------
  */
  const fetchAllProducts = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/products`);

      const productsData = Array.isArray(res.data?.products)
        ? res.data.products.map((product) => ({
            ...product,

            // Frontend-friendly calculated values
            displayPrice: getProductPrice(product),
            originalPrice: getProductOriginalPrice(product),
            totalStock: getProductStock(product),
            image: getProductImage(product),
          }))
        : [];

      setData(productsData);

      console.log("Fetched products successfully");
      console.log(productsData);
    } catch (error) {
      console.error("Failed to fetch products:", error);

      toast.error("Failed to fetch products");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Fetch products on mount
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    fetchAllProducts();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Unique categories
  |--------------------------------------------------------------------------
  |
  | Your schema has:
  |
  | category: ObjectId -> Category
  |
  | So this assumes your backend uses:
  |
  | .populate("category")
  |
  |--------------------------------------------------------------------------
  */
  const categoryOnlyData = useMemo(() => {
    const categoryMap = new Map();

    data.forEach((item) => {
      if (!item?.category) return;

      /*
      |--------------------------------------------------------------------------
      | Populated category
      |--------------------------------------------------------------------------
      | {
      |   _id: "...",
      |   name: "Electronics"
      | }
      |--------------------------------------------------------------------------
      */
      if (typeof item.category === "object") {
        const categoryId = item.category._id;

        if (!categoryId) return;

        categoryMap.set(String(categoryId), {
          _id: categoryId,
          name: item.category.name || "Unnamed Category",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Unpopulated category
      |--------------------------------------------------------------------------
      */
      else {
        categoryMap.set(String(item.category), {
          _id: item.category,
          name: String(item.category),
        });
      }
    });

    return [...categoryMap.values()];
  }, [data]);

  /*
  |--------------------------------------------------------------------------
  | Unique brands
  |--------------------------------------------------------------------------
  */
  const brandOnlyData = useMemo(() => {
    const brands = data
      .map((item) => item?.brand)
      .filter(
        (brandName) =>
          typeof brandName === "string" &&
          brandName.trim() !== ""
      );

    return [...new Set(brands)].sort();
  }, [data]);

  /*
  |--------------------------------------------------------------------------
  | Category change
  |--------------------------------------------------------------------------
  */
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  /*
  |--------------------------------------------------------------------------
  | Brand change
  |--------------------------------------------------------------------------
  */
  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  /*
  |--------------------------------------------------------------------------
  | Filtered products
  |--------------------------------------------------------------------------
  */
  const filteredData = useMemo(() => {
    let temp = [...data];

    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */
    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();

      temp = temp.filter((item) => {
        const title = item?.title?.toLowerCase() || "";
        const description =
          item?.description?.toLowerCase() || "";
        const shortDescription =
          item?.shortDescription?.toLowerCase() || "";
        const brandName =
          item?.brand?.toLowerCase() || "";

        const tags = Array.isArray(item?.tags)
          ? item.tags.join(" ").toLowerCase()
          : "";

        return (
          title.includes(searchValue) ||
          description.includes(searchValue) ||
          shortDescription.includes(searchValue) ||
          brandName.includes(searchValue) ||
          tags.includes(searchValue)
        );
      });
    }

    /*
    |--------------------------------------------------------------------------
    | CATEGORY
    |--------------------------------------------------------------------------
    */
    if (category !== "All") {
      temp = temp.filter((item) => {
        if (!item?.category) return false;

        if (typeof item.category === "object") {
          return (
            String(item.category._id) === String(category)
          );
        }

        return String(item.category) === String(category);
      });
    }

    /*
    |--------------------------------------------------------------------------
    | BRAND
    |--------------------------------------------------------------------------
    */
    if (brand !== "All") {
      temp = temp.filter(
        (item) => item?.brand === brand
      );
    }

    /*
    |--------------------------------------------------------------------------
    | PRICE RANGE
    |--------------------------------------------------------------------------
    */
    temp = temp.filter((item) => {
      const price = Number(item?.displayPrice || 0);

      return (
        price >= Number(priceRange[0]) &&
        price <= Number(priceRange[1])
      );
    });

    /*
    |--------------------------------------------------------------------------
    | SORTING
    |--------------------------------------------------------------------------
    */
    if (sort === "low-high") {
      temp.sort(
        (a, b) =>
          Number(a.displayPrice || 0) -
          Number(b.displayPrice || 0)
      );
    }

    if (sort === "high-low") {
      temp.sort(
        (a, b) =>
          Number(b.displayPrice || 0) -
          Number(a.displayPrice || 0)
      );
    }

    if (sort === "rating") {
      temp.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    }

    if (sort === "newest") {
      temp.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    if (sort === "best-selling") {
      temp.sort(
        (a, b) =>
          Number(b.analytics?.sales || 0) -
          Number(a.analytics?.sales || 0)
      );
    }

    return temp;
  }, [
    data,
    search,
    category,
    brand,
    priceRange,
    sort,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Context value
  |--------------------------------------------------------------------------
  */
  const value = {
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

    sort,
    setSort,

    handleCategoryChange,
    handleBrandChange,

    categoryOnlyData,
    brandOnlyData,

    filteredData,

    // Helper functions
    getProductPrice,
    getProductOriginalPrice,
    getProductStock,
    getProductImage,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const getData = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error(
      "getData must be used inside DataProvider"
    );
  }

  return context;
};