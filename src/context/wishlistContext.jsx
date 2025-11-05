import React, { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useContext } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    const exists = wishlist.find((item) => item.id === product.id);
    if (exists) {
      toast("Already in Wishlist ❤️");
      return;
    }
    setWishlist([...wishlist, product]);
    toast.success("Added to Wishlist ❤️");
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
    toast("Removed from Wishlist 💔");
  };

  const clearWishlist = () => {
    setWishlist([]);
    toast("Wishlist Cleared 🧹");
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};


export const useWishlist = () => useContext(WishlistContext);