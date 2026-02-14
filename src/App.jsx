import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import { Toaster } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";
import Spinner from "./components/Spinner";

/* ===========================
   Lazy Loaded Pages
=========================== */
const Home = lazy(() => import("./pages/Home"));
const Contact = lazy(() => import("./pages/Contact"));
const Cart = lazy(() => import("./pages/Cart"));
const Products = lazy(() => import("./pages/Products"));
const SingleProduct = lazy(() => import("./pages/SingleProduct"));
const CategoryProduct = lazy(() => import("./pages/CategoryProduct"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));

/* ===========================
   Lazy Loaded Components
=========================== */
const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const NotFound = lazy(() => import("./components/NotFound"));
const ScrollToTop = lazy(() => import("./components/scrollToTop"));
const Particles = lazy(() => import("./components/Particles"));
const ScrollProgressBar = lazy(() =>
  import("./components/ScrollProgressBar")
);

/* ===========================
   App Wrapper
=========================== */
const AppWrapper = () => {
  const [locationData, setLocationData] = useState(null);
  const location = useLocation();

  /* ================= Tawk Chat ================= */
  useEffect(() => {
    if (window.Tawk_API) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://embed.tawk.to/698ef4a1b449001c39035ca4/1jhb6n6eu";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  /* ================= Get User Location ================= */
  const getLocation = async () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

        const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`;
        const response = await axios.get(url);

        setLocationData(response.data.features[0]?.properties || null);
      } catch (error) {
        console.error("Location fetch failed", error);
      }
    });
  };

  /* ================= Initial Effects ================= */
  useEffect(() => {
    getLocation();

    AOS.init({
      duration: 300,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  /* ================= Hide Footer Logic ================= */
  const hideFooter =
    location.pathname === "/contact" ||
    location.pathname === "/cart" ||
    location.pathname === "/wishlist";

  return (
    <>
      {/* ================= Toast System ================= */}
      <Toaster
        theme="dark"
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(12px)",
            color: "#fff",
            border: "1px solid rgba(255,0,0,0.4)",
            borderRadius: "14px",
            boxShadow: "0 0 30px rgba(255,0,0,0.4)",
          },
        }}
      />

      <Suspense fallback={<Spinner />}>
        <ScrollProgressBar />

        {/* ================= Background Wrapper ================= */}
        <div className="relative min-h-screen w-full overflow-hidden text-gray-100">

          {/* Base Gradient */}
          <div className="absolute inset-0 -z-30 bg-gradient-to-br from-gray-950 via-black to-gray-900" />

          {/* Glow Accent 1 */}
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-600/20 blur-[180px] rounded-full animate-pulse -z-20" />

          {/* Glow Accent 2 */}
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-pink-600/20 blur-[200px] rounded-full animate-[float_12s_ease-in-out_infinite] -z-20" />

          {/* Noise Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.05)_1px,_transparent_0)] bg-[length:40px_40px] opacity-30 -z-20" />

          {/* Particles */}
          <div className="absolute inset-0 -z-10">
            <Particles
              particleColors={[
                "#ffffff",
                "#ff2e63",
                "#ff6a00",
                "#f53347",
                "#ffff00",
              ]}
              particleCount={990}
              particleSpread={9}
              speed={0.3}
              particleBaseSize={180}
              moveParticlesOnHover
              alphaParticles
            
            />
          </div>

          {/* ================= Main Content ================= */}
          <div className="relative z-10">

            <Navbar location={locationData} />
            <div className="pt-12" />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<SingleProduct />} />
              <Route path="/category/:category" element={<CategoryProduct />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/order-history" element={<OrderHistory />} />

              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <WishlistPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/contact"
                element={
                  <ProtectedRoute>
                    <Contact />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart location={locationData} getLocation={getLocation} />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>

            {!hideFooter && <Footer />}
          </div>
        </div>
      </Suspense>
    </>
  );
};

/* ===========================
   Root App
=========================== */
export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>

      <AppWrapper />
    </BrowserRouter>
  );
}
