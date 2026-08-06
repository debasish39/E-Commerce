
import React, {

  useState,

  createContext,

  useContext,

  useEffect,

} from "react";

import {

  toast,

} from "react-hot-toast";

const CartContext = createContext(null);

/* =====================================
   BACKEND URL
===================================== */

const BACKEND_URL =
  "https://eshop-backend-y0e7.onrender.com";


function CartProvider({
  children,
}) {
  /* =====================================
     STATE
  ===================================== */

  const [

    cartItem,

    setCartItem,

  ] = useState([]);

  /* =====================================
     TOKEN
  ===================================== */

  const [token, setToken] = useState(
  localStorage.getItem("token")
);
// console.log(token);
  /* =====================================
     LOAD CART
  ===================================== */

  useEffect(() => {

    if (!token)
      return;

    const fetchCart =
      async () => {

        try {

          const res =
            await fetch(

              `${BACKEND_URL}/api/cart`,

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`,

                },

              }

            );

          const data =
            await res.json();

          console.log(
            "FETCH CART:",
            data
          );

          if (

            data.success

          ) {

            setCartItem(

              data.items ||

              data.cart?.items ||

              []

            );

          }

        } catch (error) {

          console.error(

            "Cart fetch error:",

            error

          );

        }

      };

    fetchCart();

  }, [token]);

  /* =====================================
     ADD TO CART
  ===================================== */

const addToCart =
  async (product) => {

    console.log("====================================");
    console.log("ADD TO CART CLICKED");
    console.log("FULL PRODUCT:", product);
    console.log("PRODUCT ID:", product._id);
    console.log("TITLE:", product.title);
    console.log("PRICE:", product.price);
    console.log("====================================");

    if (!token) {

      toast.error(
        "Please login first"
      );

      return;

    }

    const exists =
      cartItem.some(

        (item) =>

          item.productId ===
          product._id

      );

    console.log(
      "ALREADY EXISTS:",
      exists
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

    try {

      const payload = {

        product: {

          productId:
            product._id,

          title:
            product.title,

          price:
            product.price,

          image:
            product.images?.[0],

        },

      };

      console.log("====================================");
      console.log("REQUEST PAYLOAD:");
      console.log(payload);
      console.log("====================================");

      const res =
        await fetch(

          `${BACKEND_URL}/api/cart/add`,

          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

            },

            body:
              JSON.stringify(
                payload
              ),

          }

        );

      const data =
        await res.json();

      console.log("====================================");
      console.log("ADD TO CART RESPONSE:");
      console.log(data);
      console.log("CART ITEMS:", data.cart.items);
      console.log("====================================");

      setCartItem(
        data.cart.items
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



  /* =====================================
     INCREASE QUANTITY
  ===================================== */

  const increaseQty = async (productId) => {

  try {

    const res = await fetch(
      `${BACKEND_URL}/api/cart/increase`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
        }),
      }
    );

    const data = await res.json();

    console.log("Increase Response:", data);

    if (!data.success) {

      toast.error(data.error);

      return;

    }

    setCartItem(data.cart.items);

  } catch (error) {

    console.error(error);

  }

};

  /* =====================================
     DECREASE QUANTITY
  ===================================== */

  const decreaseQty =
    async (

      productId

    ) => {

      try {

        const res =
          await fetch(

            `${BACKEND_URL}/api/cart/decrease`,

            {

              method: "PUT",

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

        setCartItem(

          data.cart.items

        );

      } catch (error) {

        console.error(
          error
        );

      }

    };

  /* =====================================
     REMOVE FROM CART
  ===================================== */

  const removeFromCart =
    async (

      productId

    ) => {

      try {

        const res =
          await fetch(

            `${BACKEND_URL}/api/cart/remove`,

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

        setCartItem(

          data.cart.items

        );

        toast.success(

          "Item removed"

        );

      } catch (error) {

        console.error(
          error
        );

      }

    };

  /* =====================================
     CLEAR CART
  ===================================== */

  const clearCart =
    async () => {

      try {

        await fetch(

          `${BACKEND_URL}/api/cart/clear`,

          {

            method: "DELETE",

            headers: {

              Authorization:
                `Bearer ${token}`,

            },

          }

        );

        setCartItem([]);

      } catch (error) {

        console.error(

          "Clear cart failed",

          error

        );

      }

    };

  /* =====================================
     PROVIDER
  ===================================== */

  return (

    <CartContext.Provider

      value={{

        cartItem,

        addToCart,

        removeFromCart,

        increaseQty,

        decreaseQty,

        clearCart,

      }}

    >

      {children}

    </CartContext.Provider>

  );

}

export default CartProvider;


export const useCart =() =>useContext(CartContext);
