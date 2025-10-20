import { useContext } from "react";
import { WishlistContext } from "../context/wishlistContext";

export const useWishlist = () => useContext(WishlistContext);
