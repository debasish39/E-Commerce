import { createContext, useState, useEffect, useContext } from "react";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

export const WishlistContext = createContext();

const BACKEND_URL = "https://eshop-backend-y0e7.onrender.com";

export const WishlistProvider = ({ children }) => {

  const { user } = useUser();
  const [wishlist, setWishlist] = useState([]);

  /* ==========================
     LOAD WISHLIST FROM DB
  ========================== */

  useEffect(() => {

    if (!user?.id) return;

    const fetchWishlist = async () => {

      try {

        const res = await fetch(`${BACKEND_URL}/api/wishlist/${user.id}`);
        const data = await res.json();

        setWishlist(data?.items || []);

      } catch (error) {

        console.error("Wishlist fetch error:", error);

      }

    };

    fetchWishlist();

  }, [user?.id]);

const addToWishlist = async (product) => {

  if (!user?.id) {
    toast.error("Please login first");
    return;
  }

  const productId = product.productId || product.id;

  const exists = wishlist.some(
    (item) => String(item.productId) === String(productId)
  );

  if (exists) {
    toast("Already in Wishlist ❤️");
    return;
  }

  try {

    const updated = [
      ...wishlist,
      {
        productId: productId,
        title: product.title,
        price: product.price,
        image: product.image || product.images?.[0] || product.thumbnail
      }
    ];

    const res = await fetch(`${BACKEND_URL}/api/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user.id,
        items: updated
      })
    });

    const data = await res.json();

    setWishlist(data.wishlist.items);

    toast.success("Added to Wishlist ❤️");

  } catch (error) {

    toast.error("Failed to add wishlist");

  }

};
  /* ==========================
     REMOVE FROM WISHLIST
  ========================== */

  const removeFromWishlist = async (productId) => {

    try {

      const res = await fetch(`${BACKEND_URL}/api/wishlist/remove`, {
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

      setWishlist(data.wishlist.items);

      toast("Removed from Wishlist 💔");

    } catch (error) {

      toast.error("Failed to remove wishlist item");

    }

  };

  /* ==========================
     CLEAR WISHLIST
  ========================== */

  const clearWishlist = async () => {

    try {

      await fetch(`${BACKEND_URL}/api/wishlist/clear/${user.id}`, {
        method: "DELETE"
      });

      setWishlist([]);

      toast("Wishlist Cleared 🧹");

    } catch (error) {

      toast.error("Failed to clear wishlist");

    }

  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);