
import {

  createContext,

  useState,

  useEffect,

  useContext,

} from "react";

import toast
from "react-hot-toast";

/* =====================================
   CONTEXT
===================================== */

const WishlistContext =
  createContext();

/* =====================================
   BACKEND URL
===================================== */

const BACKEND_URL ="https://eshop-backend-y0e7.onrender.com";

/* =====================================
   PROVIDER
===================================== */

export const WishlistProvider = ({

  children,

}) => {

  /* =====================================
     STATE
  ===================================== */

  const [

    wishlist,

    setWishlist,

  ] = useState([]);

  /* =====================================
     TOKEN
  ===================================== */

  const token =
    localStorage.getItem(
      "token"
    );

  /* =====================================
     USER
  ===================================== */

  const [

    user,

    setUser,

  ] = useState(null);

  /* =====================================
     LOAD USER
  ===================================== */

  useEffect(() => {

    if (!token)
      return;

    const fetchUser =
      async () => {

        try {

          const res =
            await fetch(

              `${BACKEND_URL}/api/auth/me`,

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`,

                },

              }

            );

          const data =
            await res.json();

          if (data.success) {

            setUser(
              data.user
            );

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

  /* =====================================
     LOAD WISHLIST
  ===================================== */

  useEffect(() => {

    if (!token)
      return;

    const fetchWishlist =
      async () => {

        try {

          const res =
            await fetch(

              `${BACKEND_URL}/api/wishlist`,

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
            "WISHLIST:",
            data
          );

          if (data.success) {

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

  /* =====================================
     ADD TO WISHLIST
  ===================================== */

  const addToWishlist =
    async (product) => {

      if (!token) {

        toast.error(
          "Please login first"
        );

        return;

      }

      const productId =

        product.productId ||

        product._id;

      const exists =
        wishlist.some(

          (item) =>

            String(
              item.productId
            ) ===

            String(productId)

        );

      if (exists) {

        toast(
          "Already in Wishlist ❤️"
        );

        return;

      }

      try {

        const updated = [

          ...wishlist,

          {

            productId,

            title:
              product.title,

            price:
              product.price,

            image:

              product.image ||

              product.images?.[0] ||

              product.thumbnail,

          },

        ];

        const res =
          await fetch(

            `${BACKEND_URL}/api/wishlist`,

            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,

              },

              body: JSON.stringify({

                items: updated,

              }),

            }

          );

        const data =
          await res.json();

        setWishlist(
          data.wishlist.items
        );

        toast.success(
          "Added to Wishlist ❤️"
        );

      } catch (error) {

        toast.error(
          "Failed to add wishlist"
        );

      }

    };

  /* =====================================
     REMOVE WISHLIST ITEM
  ===================================== */

  const removeFromWishlist =
    async (productId) => {

      try {

        const res =
          await fetch(

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

        setWishlist(
          data.wishlist.items
        );

        toast(
          "Removed from Wishlist 💔"
        );

      } catch (error) {

        toast.error(

          "Failed to remove wishlist item"

        );

      }

    };

  /* =====================================
     CLEAR WISHLIST
  ===================================== */

  const clearWishlist =
    async () => {

      try {

        await fetch(

          `${BACKEND_URL}/api/wishlist/clear`,

          {

            method: "DELETE",

            headers: {

              Authorization:
                `Bearer ${token}`,

            },

          }

        );

        setWishlist([]);

        toast(
          "Wishlist Cleared 🧹"
        );

      } catch (error) {

        toast.error(

          "Failed to clear wishlist"

        );

      }

    };

  /* =====================================
     PROVIDER
  ===================================== */

  return (

    <WishlistContext.Provider

      value={{

        wishlist,

        addToWishlist,

        removeFromWishlist,

        clearWishlist,

        user,

      }}

    >

      {children}

    </WishlistContext.Provider>

  );

};

/* =====================================
   CUSTOM HOOK
===================================== */

export const useWishlist =
() => useContext(
  WishlistContext
);