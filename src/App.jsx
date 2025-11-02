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

    {/* ✅ Your app layout starts here */}
    <div className="relative flex flex-col items-center overflow-x-hidden justify-center min-h-screen bg-gray-950 bg-opacity-70 backdrop-blur-sm text-gray-100">

      {/* --- Background Particles Layer --- */}
      <div className="absolute inset-0 -z-10">
        <Particles
          particleColors={['#ffffff', '#ffb347']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={90}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* --- End Background --- */}
      <ScrollProgressBar />
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