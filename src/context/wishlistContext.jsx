import { createContext, useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";

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
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);

      if (exists) {
        toast("Already in Wishlist ❤️");
        return prev;
      }

      toast.success("Added to Wishlist ❤️");
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
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