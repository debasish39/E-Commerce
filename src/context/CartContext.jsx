import React, { useState, createContext, useContext, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
export const CartContext = createContext(null);

const BACKEND_URL = "https://eshop-backend-y0e7.onrender.com";

export default function CartProvider({ children }) {

const { user, isSignedIn } = useUser();
  const [cartItem, setCartItem] = useState([]);
// const calculatePrice = (price) => {
//   let finalPrice;

//   if (price <= 50) {
//     finalPrice = price + 69;
//   } 
//   else if (price <= 100) {
//     finalPrice = price + 99;
//   } 
//   else if (price <= 300) {
//     finalPrice = price + 199;
//   } 
//   else if (price <= 800) {
//     finalPrice = price + 299;
//   } 
//   else if (price <= 2000) {
//     finalPrice = price + 499;
//   } 
//   else {
//     finalPrice = price + 599;
//   }

//   return Math.round(finalPrice / 10) * 10;
// };
  /* ==========================
     LOAD CART FROM DATABASE
  ========================== */

  useEffect(() => {

    if (!user) return;

    const fetchCart = async () => {
      try {

        const res = await fetch(`${BACKEND_URL}/api/cart/${user.id}`);
        const data = await res.json();

        if (data?.items) {
          setCartItem(data.items);
        }

      } catch (error) {

        console.error("Cart fetch error:", error);

      }
    };

    fetchCart();

  }, [user]);

  /* ==========================
     ADD TO CART
  ========================== */

  const addToCart = async (product) => {

  if (!isSignedIn) {

    toast.error("Please login first");
    navigate("/sign-in");

    return;
  }

  const exists = cartItem.some(
    (item) => item.productId === product.id
  );

  if (exists) {

    toast("Product already in cart", {
      icon: "🛒",
    });

    return;
  }

  try {

    const res = await fetch(`${BACKEND_URL}/api/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user.id,
        product: {
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.images?.[0]
        }
      })
    });

    const data = await res.json();

    setCartItem(data.cart.items);

    toast.success(`${product.title} added to cart`);

  } catch (error) {

    toast.error("Failed to add item");

  }

};

  /* ==========================
     INCREASE QUANTITY
  ========================== */

  const increaseQty = async (productId) => {

    const res = await fetch(`${BACKEND_URL}/api/cart/increase`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user.id,
        productId
      })
    });

    const data = await res.json();

    setCartItem(data.cart.items);

  };

  /* ==========================
     DECREASE QUANTITY
  ========================== */

  const decreaseQty = async (productId) => {

    const res = await fetch(`${BACKEND_URL}/api/cart/decrease`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user.id,
        productId
      })
    });

    const data = await res.json();

    setCartItem(data.cart.items);

  };

  /* ==========================
     REMOVE FROM CART
  ========================== */

  const removeFromCart = async (productId) => {

    const res = await fetch(`${BACKEND_URL}/api/cart/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user.id,
        productId
      })
    });

    const data = await res.json();

    setCartItem(data.cart.items);

    toast.success("Item removed");

  };
const clearCart = async () => {

  if (!user?.id) return;

  try {

    await fetch(`${BACKEND_URL}/api/cart/clear/${user.id}`, {
      method: "DELETE",
    });

    setCartItem([]);

  } catch (error) {

    console.error("Clear cart failed", error);

  }

};
  return (
    <CartContext.Provider
      value={{
        cartItem,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);