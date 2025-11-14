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
import Particles from "./components/Particles";
import WishlistPage from "./pages/WishlistPage";
import ScrollProgressBar from "./components/ScrollProgressBar";
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/OrderHistory";

const AppWrapper = () => {
  const [locationData, setLocationData] = useState();
  const location = useLocation();

  const getLocation = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      console.log(pos.coords);
      const { latitude, longitude } = pos.coords;
      console.log(latitude);
      console.log(longitude);
      const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
      console.log(apiKey);
      const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`;
      console.log(url);
      try {
        const response = await axios.get(url);
        console.log(response);
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
  // ✅ Tawk.to Script Embed
  var Tawk_API = Tawk_API || {};
  var Tawk_LoadStart = new Date();

  const s1 = document.createElement("script");
  const s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = "https://embed.tawk.to/69084ab76435f2194e4f2aa9/1j9467o9s"; // your new widget link
  s1.charset = "UTF-8";
  s1.setAttribute("crossorigin", "*");
  s0.parentNode.insertBefore(s1, s0);

  // ✅ Clean up on unmount
  return () => {
    if (s1 && s1.parentNode) {
      s1.parentNode.removeChild(s1);
    }
  };
}, []);


  const hideFooter =
    location.pathname === "/contact" ||
    location.pathname === "/cart" ||
    location.pathname === "/wishlist";
return (
  <>
    {/* ✅ Toaster placed OUTSIDE so it stays fixed on viewport */}
    <Toaster
      position="top-right"
      containerStyle={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
      }}
      reverseOrder={false}
      toastOptions={{
        duration: 900,
        style: {
          background: "linear-gradient(to right, #ff9a3c, #ffb347, #ffd56f)",
          color: "#1f2937",
          borderRadius: "10px",
          padding: "12px 18px",
          fontWeight: "500",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        },
        success: {
          style: {
            background: "linear-gradient(to right, #22c55e, #16a34e, #15803d)",
            color: "#fff",
          },
        },
        error: {
          style: {
            background: "linear-gradient(to right, #ef4444, #dc2626, #991b1b)",
            color: "#fff",
          },
        },
        loading: {
          style: {
            background: "linear-gradient(to right, #f59e0b, #fbbf24, #fde68a)",
            color: "#000",
          },
        },
      }}
    />
   {/* --- Scroll Progress Bar --- */}
  <ScrollProgressBar />
    {/* ✅ Your app layout starts here */}
   <div className="relative min-h-screen w-full overflow-x-hidden bg-gray-950 bg-opacity-70 backdrop-blur-sm text-gray-100">
  {/* --- Background Particles Layer --- */}
  <div className="absolute inset-0 -z-10">
    <Particles
      particleColors={['#ffffff', 'red', '#f53347', '#ff6a00', '#ffff00']}
      particleCount={300}
      particleSpread={18}
      speed={1}
      particleBaseSize={300}
      moveParticlesOnHover={true}
      alphaParticles={true}
      disableRotation={true}
    />
  </div>

   
      <Navbar location={locationData} />
      <div className="pt-9" />
      <div className="w-full max-w-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/order-history" element={<OrderHistory />} />
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
          <Route path="/order-success" element={<OrderSuccess />} />
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
  </>
);

}

export default function App() {
  return (
    <BrowserRouter>
        <ScrollToTop />
        <AppWrapper />
    </BrowserRouter>
  );
}