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

console.log("========================================");
console.log("🔧 DATA CONTEXT INITIALIZED");
console.log("🔧 BACKEND_URL:", BACKEND_URL);
console.log("========================================");

/* =====================================================
   HELPERS
===================================================== */

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return String(value._id || "");
  }

  return String(value);
};

const normalizeText = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

/* =====================================================
   PRODUCT PRICE
===================================================== */

const getProductPrice = (product) => {
  if (!product) return 0;

  const variants = Array.isArray(product.variants)
    ? product.variants.filter(
        (variant) => variant?.isActive !== false
      )
    : [];

  if (variants.length === 0) {
    return 0;
  }

  const prices = variants
    .map((variant) => Number(variant?.price))
    .filter(
      (price) =>
        !Number.isNaN(price) &&
        price >= 0
    );

  if (prices.length === 0) {
    return 0;
  }

  return Math.min(...prices);
};

/* =====================================================
   ORIGINAL PRICE
===================================================== */

const getProductOriginalPrice = (product) => {
  if (!product?.variants?.length) {
    return 0;
  }

  const variants = product.variants.filter(
    (variant) => variant?.isActive !== false
  );

  const prices = variants
    .map((variant) =>
      Number(variant?.originalPrice)
    )
    .filter(
      (price) =>
        !Number.isNaN(price) &&
        price > 0
    );

  if (prices.length === 0) {
    return 0;
  }

  return Math.min(...prices);
};

/* =====================================================
   STOCK
===================================================== */

const getProductStock = (product) => {
  if (!product?.variants?.length) {
    return 0;
  }

  return product.variants
    .filter(
      (variant) => variant?.isActive !== false
    )
    .reduce(
      (total, variant) =>
        total + Number(variant?.stock || 0),
      0
    );
};

/* =====================================================
   IMAGE
===================================================== */

const getProductImage = (product) => {
  if (!product) {
    return "";
  }

  /* Main thumbnail */
  if (product?.media?.thumbnail) {
    return product.media.thumbnail;
  }

  /* Main gallery */
  if (
    Array.isArray(product?.media?.images) &&
    product.media.images.length > 0
  ) {
    return product.media.images[0];
  }

  /* Variant fallback */
  if (
    Array.isArray(product?.variants) &&
    product.variants.length > 0
  ) {
    const variantWithImage =
      product.variants.find(
        (variant) =>
          Array.isArray(variant?.images) &&
          variant.images.length > 0
      );

    if (variantWithImage) {
      return variantWithImage.images[0];
    }
  }

  return "";
};

/* =====================================================
   DATA PROVIDER
===================================================== */

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [sort, setSort] = useState("default");

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [subCategory, setSubCategory] =
    useState("All");

  const [brand, setBrand] = useState("All");

  const [priceRange, setPriceRange] =
    useState([0, 100000]);

  /* =====================================================
     FETCH PRODUCTS
  ===================================================== */

 const fetchAllProducts = async (searchValue = "") => {
  setLoading(true);
  setError(null);

  try {
    const params = new URLSearchParams();

    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    }

    const url = `${BACKEND_URL}/api/products${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const res = await axios.get(url);

    const rawProducts = Array.isArray(res.data?.products)
      ? res.data.products
      : [];

    const productsData = rawProducts.map((product) => ({
      ...product,
      displayPrice: getProductPrice(product),
      originalPrice: getProductOriginalPrice(product),
      totalStock: getProductStock(product),
      image: getProductImage(product),
    }));

    setData(productsData);
  } catch (err) {
    console.error("FETCH PRODUCTS ERROR:", err);
    setError(err?.message || "Failed to fetch products");
    setData([]);
    toast.error("Failed to fetch products");
  } finally {
    setLoading(false);
  }
};
  /* =====================================================
     FETCH ON MOUNT
  ===================================================== */

  useEffect(() => {
    fetchAllProducts(search);
  }, [search]);

  /* =====================================================
     FETCH CATEGORIES
  ===================================================== */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

        const res = await axios.get(
          `${BACKEND_URL}/api/category`
        );

        const categoryData = Array.isArray(
          res.data?.categories
        )
          ? res.data.categories
          : [];

        setCategories(categoryData);
      } catch (err) {
        console.error(
          "FETCH CATEGORIES ERROR:",
          err
        );
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /* =====================================================
     CATEGORIES
  ===================================================== */

  const categoryOnlyData = useMemo(() => {
    return Array.isArray(categories)
      ? categories
      : [];
  }, [categories]);

  /* =====================================================
     UNIQUE SUBCATEGORIES
  ===================================================== */

  const subCategoryOnlyData =
    useMemo(() => {
      const subCategoryMap =
        new Map();

      data.forEach((item) => {
        if (!item?.subCategory) return;

        const id =
          getId(item.subCategory);

        if (!id) return;

        const name =
          typeof item.subCategory ===
          "object"
            ? item.subCategory?.name
            : String(item.subCategory);

        subCategoryMap.set(id, {
          _id: id,
          name:
            name ||
            "Unnamed Subcategory",
        });
      });

      return [
        ...subCategoryMap.values(),
      ];
    }, [data]);

  /* =====================================================
     UNIQUE BRANDS
  ===================================================== */

  const brandOnlyData = useMemo(() => {
    const brands = data
      .map((item) => item?.brand)
      .filter(
        (brandName) =>
          typeof brandName ===
            "string" &&
          brandName.trim() !== ""
      );

    return [
      ...new Set(brands),
    ].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [data]);

  /* =====================================================
     FILTERED PRODUCTS
  ===================================================== */

  const filteredData = useMemo(() => {
    let temp = [...data];

    console.log("");
    console.log(
      "========================================"
    );

    console.log(
      "🔎 FILTER START"
    );

    console.log(
      "🔎 Total products:",
      temp.length
    );

    console.log(
      "🔎 Search:",
      search
    );

    console.log(
      "🔎 Category:",
      category
    );

    console.log(
      "🔎 SubCategory:",
      subCategory
    );

    console.log(
      "🔎 Brand:",
      brand
    );

    console.log(
      "🔎 Price range:",
      priceRange
    );

    /* =====================================================
       SEARCH
    ===================================================== */

    // if (search.trim()) {
    //   const searchValue =
    //     normalizeText(search);

    //   temp = temp.filter((item) => {
    //     const title =
    //       normalizeText(item?.title);

    //     const description =
    //       normalizeText(
    //         item?.description
    //       );

    //     const shortDescription =
    //       normalizeText(
    //         item?.shortDescription
    //       );

    //     const brandName =
    //       normalizeText(
    //         item?.brand
    //       );

    //     const tags =
    //       Array.isArray(item?.tags)
    //         ? normalizeText(
    //             item.tags.join(" ")
    //           )
    //         : "";

    //     return (
    //       title.includes(searchValue) ||
    //       description.includes(searchValue) ||
    //       shortDescription.includes(
    //         searchValue
    //       ) ||
    //       brandName.includes(
    //         searchValue
    //       ) ||
    //       tags.includes(searchValue)
    //     );
    //   });

    //   console.log(
    //     "🔎 After SEARCH:",
    //     temp.length
    //   );
    // }

    /* =====================================================
       CATEGORY
    ===================================================== */

    if (
      category &&
      category !== "All"
    ) {
      const selectedCategory =
        String(category);

      console.log(
        "🏷️ Applying category:",
        selectedCategory
      );

      temp = temp.filter((item) => {
        const productCategory =
          getId(item?.category);

        const matched =
          productCategory ===
          selectedCategory;

        console.log(
          "🏷️ CATEGORY CHECK:",
          {
            title: item?.title,
            productCategory,
            selectedCategory,
            matched,
          }
        );

        return matched;
      });

      console.log(
        "🔎 After CATEGORY:",
        temp.length
      );
    }

    /* =====================================================
       SUBCATEGORY
    ===================================================== */

    if (
      subCategory &&
      subCategory !== "All"
    ) {
      const selectedSubCategory =
        String(subCategory);

      console.log(
        "📂 Applying subcategory:",
        selectedSubCategory
      );

      temp = temp.filter((item) => {
        const productSubCategory =
          getId(item?.subCategory);

        const matched =
          productSubCategory ===
          selectedSubCategory;

        console.log(
          "📂 SUBCATEGORY CHECK:",
          {
            title: item?.title,
            productSubCategory,
            selectedSubCategory,
            matched,
          }
        );

        return matched;
      });

      console.log(
        "🔎 After SUBCATEGORY:",
        temp.length
      );
    }

    /* =====================================================
       BRAND
    ===================================================== */

    if (
      brand &&
      brand !== "All"
    ) {
      const selectedBrand =
        normalizeText(brand);

      console.log(
        "🏢 Applying brand:",
        selectedBrand
      );

      temp = temp.filter((item) => {
        const productBrand =
          normalizeText(
            item?.brand
          );

        const matched =
          productBrand ===
          selectedBrand;

        console.log(
          "🏢 BRAND CHECK:",
          {
            title: item?.title,
            productBrand,
            selectedBrand,
            matched,
          }
        );

        return matched;
      });

      console.log(
        "🔎 After BRAND:",
        temp.length
      );
    }

    /* =====================================================
       PRICE
    ===================================================== */

    temp = temp.filter((item) => {
      const price =
        Number(
          item?.displayPrice || 0
        );

      return (
        price >=
          Number(priceRange?.[0] || 0) &&
        price <=
          Number(priceRange?.[1] || 100000)
      );
    });

    console.log(
      "🔎 After PRICE:",
      temp.length
    );

    /* =====================================================
       SORT
    ===================================================== */

    if (sort === "low-high") {
      temp.sort(
        (a, b) =>
          Number(
            a.displayPrice || 0
          ) -
          Number(
            b.displayPrice || 0
          )
      );
    }

    if (sort === "high-low") {
      temp.sort(
        (a, b) =>
          Number(
            b.displayPrice || 0
          ) -
          Number(
            a.displayPrice || 0
          )
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
          new Date(
            b.createdAt || 0
          ) -
          new Date(
            a.createdAt || 0
          )
      );
    }

    if (sort === "best-selling") {
      temp.sort(
        (a, b) =>
          Number(
            b.analytics?.sales || 0
          ) -
          Number(
            a.analytics?.sales || 0
          )
      );
    }

    console.log(
      "✅ FINAL FILTERED PRODUCTS:",
      temp.length
    );

    console.log(
      "✅ FINAL PRODUCTS:",
      temp
    );

    console.log(
      "========================================"
    );

    return temp;
  }, [
    data,
    search,
    category,
    subCategory,
    brand,
    priceRange,
    sort,
  ]);

  /* =====================================================
     EVENT HANDLERS
  ===================================================== */

  const handleCategoryChange = (
    e
  ) => {
    const value = e.target.value;

    console.log(
      "🏷️ CATEGORY CHANGED:",
      value
    );

    setCategory(value);
  };

  const handleSubCategoryChange = (
    e
  ) => {
    const value = e.target.value;

    console.log(
      "📂 SUBCATEGORY CHANGED:",
      value
    );

    setSubCategory(value);
  };

  const handleBrandChange = (
    e
  ) => {
    const value = e.target.value;

    console.log(
      "🏢 BRAND CHANGED:",
      value
    );

    setBrand(value);
  };

  /* =====================================================
     CONTEXT VALUE
  ===================================================== */

  const value = {
    data,

    loading,

    error,

    fetchAllProducts,

    search,
    setSearch,

    category,
    setCategory,

    subCategory,
    setSubCategory,

    brand,
    setBrand,

    priceRange,
    setPriceRange,

    sort,
    setSort,

    handleCategoryChange,
    handleSubCategoryChange,
    handleBrandChange,

    categoryOnlyData,
    categories,
    categoriesLoading,
    subCategoryOnlyData,
    brandOnlyData,

    filteredData,

    getProductPrice,
    getProductOriginalPrice,
    getProductStock,
    getProductImage,
  };

  return (
    <DataContext.Provider
      value={value}
    >
      {children}
    </DataContext.Provider>
  );
};

/* =====================================================
   HOOK
===================================================== */

export const getData = () => {
  const context =
    useContext(DataContext);

  if (!context) {
    throw new Error(
      "getData must be used inside DataProvider"
    );
  }

  return context;
};

