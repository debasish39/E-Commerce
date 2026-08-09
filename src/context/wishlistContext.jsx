import {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";

import toast from "react-hot-toast";

/*
|--------------------------------------------------------------------------
| CONTEXT
|--------------------------------------------------------------------------
*/

const WishlistContext = createContext(null);

/*
|--------------------------------------------------------------------------
| BACKEND URL
|--------------------------------------------------------------------------
*/

const BACKEND_URL = "https://eshop-backend-y0e7.onrender.com";

/*
|--------------------------------------------------------------------------
| GET PRODUCT PRICE
|--------------------------------------------------------------------------
|
| Wishlist is product-level, so for a variable product we
| use the lowest active variant price.
|--------------------------------------------------------------------------
*/

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
    .map((variant) => Number(variant.price))
    .filter(
      (price) =>
        !Number.isNaN(price) && price >= 0
    );

  if (prices.length === 0) {
    return 0;
  }

  return Math.min(...prices);
};

/*
|--------------------------------------------------------------------------
| GET PRODUCT IMAGE
|--------------------------------------------------------------------------
*/

const getProductImage = (product) => {
  if (!product) return "";

  /*
  |--------------------------------------------------------------------------
  | Product thumbnail
  |--------------------------------------------------------------------------
  */

  if (product.media?.thumbnail) {
    return product.media.thumbnail;
  }

  /*
  |--------------------------------------------------------------------------
  | Product media images
  |--------------------------------------------------------------------------
  */

  if (
    Array.isArray(product.media?.images) &&
    product.media.images.length > 0
  ) {
    return product.media.images[0];
  }

  /*
  |--------------------------------------------------------------------------
  | Variant images
  |--------------------------------------------------------------------------
  */

  if (Array.isArray(product.variants)) {
    const variantWithImage =
      product.variants.find(
        (variant) =>
          Array.isArray(variant.images) &&
          variant.images.length > 0
      );

    if (variantWithImage) {
      return variantWithImage.images[0];
    }
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| PROVIDER
|--------------------------------------------------------------------------
*/

export const WishlistProvider = ({
  children,
}) => {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [wishlist, setWishlist] = useState([]);

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  /*
  |--------------------------------------------------------------------------
  | TOKEN CHANGE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(
        localStorage.getItem("token")
      );
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LOAD USER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/auth/me`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (
          res.ok &&
          data.success
        ) {
          setUser(data.user);
        }
      } catch (error) {
        console.error(
          "USER ERROR:",
          error
        );
      }
    };

    fetchUser();
  }, [token]);

  /*
  |--------------------------------------------------------------------------
  | LOAD WISHLIST
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!token) {
      setWishlist([]);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/wishlist`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        console.log(
          "WISHLIST:",
          data
        );

        if (
          res.ok &&
          data.success
        ) {
          setWishlist(
            data.items ||
              data.wishlist?.items ||
              []
          );
        }
      } catch (error) {
        console.error(
          "Wishlist fetch error:",
          error
        );
      }
    };

    fetchWishlist();
  }, [token]);

  /*
  |--------------------------------------------------------------------------
  | ADD TO WISHLIST
  |--------------------------------------------------------------------------
  */

  const addToWishlist = async (
    product
  ) => {
    if (!token) {
      toast.error(
        "Please login first"
      );

      return;
    }

    if (!product?._id) {
      toast.error(
        "Invalid product"
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Check existing product
    |--------------------------------------------------------------------------
    */

    const exists = wishlist.some(
      (item) =>
        String(
          item.productId?._id ||
            item.productId
        ) ===
        String(product._id)
    );

    if (exists) {
      toast(
        "Already in Wishlist ❤️"
      );

      return;
    }

    try {
      /*
      |--------------------------------------------------------------------------
      | IMPORTANT
      |--------------------------------------------------------------------------
      | Only send productId.
      |
      | Backend gets title, price and image
      | directly from MongoDB.
      |--------------------------------------------------------------------------
      */

      const res = await fetch(
        `${BACKEND_URL}/api/wishlist/add`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            productId:
              product._id,
          }),
        }
      );

      const data = await res.json();

      console.log(
        "ADD WISHLIST RESPONSE:",
        data
      );

      if (
        !res.ok ||
        !data.success
      ) {
        toast.error(
          data.message ||
            data.error ||
            "Failed to add wishlist"
        );

        return;
      }

      setWishlist(
        data.wishlist?.items || []
      );

      toast.success(
        "Added to Wishlist ❤️"
      );
    } catch (error) {
      console.error(
        "Add wishlist error:",
        error
      );

      toast.error(
        "Failed to add wishlist"
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE FROM WISHLIST
  |--------------------------------------------------------------------------
  */

  const removeFromWishlist =
    async (productId) => {
      if (!token) {
        toast.error(
          "Please login first"
        );

        return;
      }

      try {
        const res = await fetch(
          `${BACKEND_URL}/api/wishlist/remove`,
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              productId,
            }),
          }
        );

        const data =
          await res.json();

        console.log(
          "REMOVE WISHLIST RESPONSE:",
          data
        );

        if (
          !res.ok ||
          !data.success
        ) {
          toast.error(
            data.message ||
              data.error ||
              "Failed to remove wishlist item"
          );

          return;
        }

        setWishlist(
          data.wishlist?.items || []
        );

        toast(
          "Removed from Wishlist 💔"
        );
      } catch (error) {
        console.error(
          "Remove wishlist error:",
          error
        );

        toast.error(
          "Failed to remove wishlist item"
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | CLEAR WISHLIST
  |--------------------------------------------------------------------------
  */

  const clearWishlist = async () => {
    if (!token) {
      setWishlist([]);
      return;
    }

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/wishlist/clear`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await res.json();

      if (
        !res.ok ||
        !data.success
      ) {
        toast.error(
          data.message ||
            data.error ||
            "Failed to clear wishlist"
        );

        return;
      }

      setWishlist([]);

      toast(
        "Wishlist Cleared 🧹"
      );
    } catch (error) {
      console.error(
        "Clear wishlist error:",
        error
      );

      toast.error(
        "Failed to clear wishlist"
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CHECK WISHLIST
  |--------------------------------------------------------------------------
  */

  const isInWishlist = (
    productId
  ) => {
    return wishlist.some(
      (item) =>
        String(
          item.productId?._id ||
            item.productId
        ) ===
        String(productId)
    );
  };

  /*
  |--------------------------------------------------------------------------
  | WISHLIST COUNT
  |--------------------------------------------------------------------------
  */

  const wishlistCount =
    wishlist.length;

  /*
  |--------------------------------------------------------------------------
  | PROVIDER
  |--------------------------------------------------------------------------
  */

  return (
    <WishlistContext.Provider
      value={{
        wishlist,

        user,

        addToWishlist,

        removeFromWishlist,

        clearWishlist,

        isInWishlist,

        wishlistCount,

        getProductPrice,

        getProductImage,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

/*
|--------------------------------------------------------------------------
| CUSTOM HOOK
|--------------------------------------------------------------------------
*/

export const useWishlist = () => {
  const context =
    useContext(
      WishlistContext
    );

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
};