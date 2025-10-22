import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Products from "./pages/Products";
import Navbar from "./components/Navbar";
import axios from "axios";
import Footer from "./components/Footer";
import SingleProduct from "./pages/SingleProduct";
import CategoryProduct from "./pages/CategoryProduct";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/scrollToTop";
import AOS from "aos";
import "aos/dist/aos.css";
import NotFound from "./components/NotFound";
import ClickSpark from "./components/ClickSpark";
import WishlistPage from "./pages/WishlistPage";

const AppWrapper = () => {
  const [locationData, setLocationData] = useState();
  const location = useLocation();

  const getLocation = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
      const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`;
      try {
        const response = await axios.get(url);
        const exactLocation = response.data.features[0].properties;
        setLocationData(exactLocation);
      } catch (error) {
        console.error("Failed to fetch location:", error);
      }
    });
  };

  useEffect(() => {
    getLocation();
    AOS.init({ duration: 200, once: false, });
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/68f50d067d479d194d3b7f14/1j7ujlpa6";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const hideFooter =
    location.pathname === "/contact" ||
    location.pathname === "/cart" ||
    location.pathname === "/wishlist";

  return (
    <div className="flex flex-col items-center overflow-x-hidden justify-center min-h-screen bg-gradient-to-b from-gray-100 via-orange-300 to-orange-300">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar location={locationData} />
      <div className="pt-16" />
      <div className="w-full max-w-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<SingleProduct />} />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route path="/category/:category" element={<CategoryProduct />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart location={locationData} getLocation={getLocation} />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {!hideFooter && <Footer />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ClickSpark>
        <ScrollToTop />
        <AppWrapper />
      </ClickSpark>
    </BrowserRouter>
  );
}
