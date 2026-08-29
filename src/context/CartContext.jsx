import React, {
  useState,
  createContext,
  useContext,
  useEffect,
} from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/*
|--------------------------------------------------------------------------
| Get product image
|--------------------------------------------------------------------------
*/
const getProductImage = (product, variant = null) => {
  // Selected variant image
  if (
    variant?.images &&
    Array.isArray(variant.images) &&
    variant.images.length > 0
  ) {
    return variant.images[0];
  }

  // Product thumbnail
  if (product?.media?.thumbnail) {
    return product.media.thumbnail;
  }

  // Product images
  if (
    product?.media?.images &&
    Array.isArray(product.media.images) &&
    product.media.images.length > 0
  ) {
    return product.media.images[0];
  }

  // Fallback to any variant image
  if (Array.isArray(product?.variants)) {
    const variantWithImage = product.variants.find(
      (item) =>
        Array.isArray(item.images) &&
        item.images.length > 0
    );

    if (variantWithImage) {
      return variantWithImage.images[0];
    }
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| Get default variant
|--------------------------------------------------------------------------
*/
const getDefaultVariant = (product) => {
  if (
    !product?.variants ||
    !Array.isArray(product.variants) ||
    product.variants.length === 0
  ) {
    return null;
  }

  return (
    product.variants.find(
      (variant) => variant.isActive !== false
    ) || null
  );
};

function CartProvider({ children }) {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [cartItem, setCartItem] = useState([]);

  /*
  |--------------------------------------------------------------------------
  | TOKEN
  |--------------------------------------------------------------------------
  */

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  /*
  |--------------------------------------------------------------------------
  | Listen for login/logout token changes
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
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
  | LOAD CART
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!token) {
      setCartItem([]);
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/cart`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        console.log("FETCH CART:", data);

        if (!res.ok || !data.success) {
          console.error(
            data.message || data.error
          );

          return;
        }

        setCartItem(
          data.items ||
          data.cart?.items ||
          []
        );
      } catch (error) {
        console.error(
          "Cart fetch error:",
          error
        );
      }
    };

    fetchCart();
  }, [token]);

  /*
  |--------------------------------------------------------------------------
  | ADD TO CART
  |--------------------------------------------------------------------------
  |
  | Usage:
  |
  | addToCart(product)
  |
  | OR
  |
  | addToCart(product, variant)
  |
  |--------------------------------------------------------------------------
  */

  const addToCart = async (
    product,
    selectedVariant = null,
    quantity = 1
  ) => {
    console.log(
      "===================================="
    );

    console.log(
      "ADD TO CART CLICKED"
    );

    console.log(
      "FULL PRODUCT:",
      product
    );

    console.log(
      "SELECTED VARIANT:",
      selectedVariant
    );

    console.log(
      "===================================="
    );

    /*
    |--------------------------------------------------------------------------
    | LOGIN CHECK
    |--------------------------------------------------------------------------
    */

    if (!token) {
      toast.error(
        "Please login first"
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | PRODUCT CHECK
    |--------------------------------------------------------------------------
    */

    if (!product?._id) {
      toast.error(
        "Invalid product"
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | SELECT VARIANT
    |--------------------------------------------------------------------------
    */

    let variant = selectedVariant;

    /*
    |--------------------------------------------------------------------------
    | If no variant selected, use first active variant
    |--------------------------------------------------------------------------
    */

    if (!variant) {
      variant =
        getDefaultVariant(product);
    }

    /*
    |--------------------------------------------------------------------------
    | Variable product requires variant
    |--------------------------------------------------------------------------
    */

    if (
      product.productType === "variable" &&
      !variant
    ) {
      toast.error(
        "Please select a product variant"
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Variant SKU
    |--------------------------------------------------------------------------
    */

    const variantSku =
      variant?.sku || "";

    /*
    |--------------------------------------------------------------------------
    | Check existing cart item
    |--------------------------------------------------------------------------
    */

    const exists = cartItem.some(
      (item) =>
        String(item.productId) ===
        String(product._id) &&
        item.variantSku ===
        variantSku
    );

    if (exists) {
      toast(
        "Product already in cart",
        {
          icon: "🛒",
        }
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | STOCK CHECK
    |--------------------------------------------------------------------------
    */

    if (
      variant &&
      Number(quantity) >
      Number(variant.stock || 0)
    ) {
      toast.error(
        `Only ${variant.stock} item(s) available`
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | REQUEST PAYLOAD
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | Backend expects these fields directly.
    |
    | NOT:
    | {
    |   product: {...}
    | }
    |--------------------------------------------------------------------------
    */

    const productImage = getProductImage(product, variant);

    const payload = {
      productId: product._id,
      variantSku,
      quantity: Number(quantity),
      image: productImage,
    };
    console.log(
      "REQUEST PAYLOAD:",
      payload
    );

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/cart/add`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      const data = await res.json();

      console.log(
        "ADD TO CART RESPONSE:",
        data
      );

      /*
      |--------------------------------------------------------------------------
      | Handle backend error
      |--------------------------------------------------------------------------
      */

      if (
        !res.ok ||
        !data.success
      ) {
        toast.error(
          data.message ||
          data.error ||
          "Failed to add item"
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Update cart
      |--------------------------------------------------------------------------
      */

      setCartItem(
        data.cart?.items || []
      );

      toast.success(
        "Added to cart 🛒"
      );
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error
      );

      toast.error(
        "Failed to add item"
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | INCREASE QUANTITY
  |--------------------------------------------------------------------------
  */

  const increaseQty = async (
    productId,
    variantSku = ""
  ) => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      console.log("INCREASE REQUEST:", {
        productId,
        variantSku,
      });

      const res = await fetch(
        `${BACKEND_URL}/api/cart/increase`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            productId: String(productId),
            variantSku: variantSku || "",
          }),
        }
      );

      const data = await res.json();

      console.log(
        "INCREASE STATUS:",
        res.status
      );

      console.log(
        "INCREASE RESPONSE:",
        data
      );

      if (!res.ok || !data.success) {
        toast.error(
          data.message ||
          data.error ||
          "Failed to increase quantity"
        );

        return;
      }

      setCartItem(
        data.cart?.items || []
      );

    } catch (error) {
      console.error(
        "INCREASE ERROR:",
        error
      );

      toast.error(
        "Failed to increase quantity"
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DECREASE QUANTITY
  |--------------------------------------------------------------------------
  */
  const decreaseQty = async (
    productId,
    variantSku = ""
  ) => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      console.log("DECREASE REQUEST:", {
        productId,
        variantSku,
      });

      const res = await fetch(
        `${BACKEND_URL}/api/cart/decrease`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            productId: String(productId),
            variantSku: variantSku || "",
          }),
        }
      );

      const data = await res.json();

      console.log(
        "DECREASE STATUS:",
        res.status
      );

      console.log(
        "DECREASE RESPONSE:",
        data
      );

      if (!res.ok || !data.success) {
        toast.error(
          data.message ||
          data.error ||
          "Failed to decrease quantity"
        );

        return;
      }

      setCartItem(
        data.cart?.items || []
      );

    } catch (error) {
      console.error(
        "DECREASE ERROR:",
        error
      );

      toast.error(
        "Failed to decrease quantity"
      );
    }
  };
  /*
  |--------------------------------------------------------------------------
  | REMOVE FROM CART
  |--------------------------------------------------------------------------
  */

  const removeFromCart = async (
    productId,
    variantSku = ""
  ) => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      console.log("REMOVE REQUEST:", {
        productId,
        variantSku,
      });

      const res = await fetch(
        `${BACKEND_URL}/api/cart/remove`,
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            productId: String(productId),
            variantSku: variantSku || "",
          }),
        }
      );

      const data = await res.json();

      console.log(
        "REMOVE STATUS:",
        res.status
      );

      console.log(
        "REMOVE RESPONSE:",
        data
      );

      if (!res.ok || !data.success) {
        toast.error(
          data.message ||
          data.error ||
          "Failed to remove item"
        );

        return false;
      }

      setCartItem(
        data.cart?.items || []
      );

      toast.success(
        "Item removed 🗑️"
      );

      return true;

    } catch (error) {
      console.error(
        "REMOVE CART ERROR:",
        error
      );

      toast.error(
        "Failed to remove item"
      );

      return false;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CLEAR CART
  |--------------------------------------------------------------------------
  */

  const clearCart = async () => {
    if (!token) {
      setCartItem([]);
      return;
    }

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/cart/clear`,
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
          "Failed to clear cart"
        );

        return;
      }

      setCartItem([]);

      toast.success(
        "Cart cleared"
      );
    } catch (error) {
      console.error(
        "Clear cart failed:",
        error
      );

      toast.error(
        "Failed to clear cart"
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CART TOTAL
  |--------------------------------------------------------------------------
  */

  const cartTotal = cartItem.reduce(
    (total, item) => {
      return (
        total +
        Number(item.price || 0) *
        Number(item.quantity || 0)
      );
    },
    0
  );

  /*
  |--------------------------------------------------------------------------
  | CART ITEM COUNT
  |--------------------------------------------------------------------------
  */

  const cartCount = cartItem.reduce(
    (total, item) => {
      return (
        total +
        Number(item.quantity || 0)
      );
    },
    0
  );

  /*
  |--------------------------------------------------------------------------
  | PROVIDER
  |--------------------------------------------------------------------------
  */

  return (
    <CartContext.Provider
      value={{
        cartItem,

        addToCart,

        removeFromCart,

        increaseQty,

        decreaseQty,

        clearCart,

        cartTotal,

        cartCount,

        token,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;

export const useCart = () => {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};