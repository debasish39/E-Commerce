import React, { useState, createContext, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const CartContext = createContext(null);

export default function CartProvider({ children }) {
  const [cartItem, setCartItem] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Save cart to localStorage whenever cartItem changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItem));
  }, [cartItem]);

  // ✅ Updated: addToCart now accepts quantity
  const addToCart = (product, quantity = 1) => {
    const itemInCart = cartItem.find((item) => item.id === product.id);
    if (itemInCart) {
      const updatedCart = cartItem.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCartItem(updatedCart);
      toast.success(`Increased product quantity by ${quantity}`);
    } else {
      setCartItem([...cartItem, { ...product, quantity }]);
      toast.success(`${product.title} added to cart`);
    }
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItem.filter((item) => item.id !== id);
    setCartItem(updatedCart);
    toast.success('Removed from cart');
  };

  const increaseQty = (id) => {
    const updatedCart = cartItem.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItem(updatedCart);
    toast.success('Increased quantity');
  };

  const decreaseQty = (id) => {
    const updatedCart = cartItem
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    setCartItem(updatedCart);
    toast.success('Decreased quantity');
  };

  const clearCart = () => {
    setCartItem([]);
    localStorage.removeItem('cart');
    toast.success('Cart cleared');
  };

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

export const useCart = () => useContext(CartContext);
