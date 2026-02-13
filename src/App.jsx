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
const About = lazy(() => import("./pages/About"));
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
   Loader Component
=========================== */
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
    Loading...
  </div>
);

/* ===========================
   App Wrapper
=========================== */
const AppWrapper = () => {
  const [locationData, setLocationData] = useState(null);
  const location = useLocation();
useEffect(() => {
  if (window.Tawk_API) return;

  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://embed.tawk.to/698ef4a1b449001c39035ca4/1jhb6n6eu";
  script.charset = "UTF-8";
  script.setAttribute("crossorigin", "*");

  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);

  /* ---- Get User Location ---- */
  const getLocation = async () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

        const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`;
        const response = await axios.get(url);
        setLocationData(response.data.features[0].properties);
      } catch (error) {
        console.error("Location fetch failed", error);
      }
    });
  };

  /* ---- Initial Effects ---- */
  useEffect(() => {
    getLocation();
    AOS.init({
      duration: 200,
      once: true,
    });
  }, []);

  /* ---- Hide Footer on Some Routes ---- */
  const hideFooter =
    location.pathname === "/contact" ||
    location.pathname === "/cart" ||
    location.pathname === "/wishlist";

  return (
    <>
      {/* ===== Toast Notifications ===== */}
      <Toaster
  position="top-right"
  expand
  richColors
  closeButton
/>

     <Suspense fallback={<Spinner />}>
        <ScrollProgressBar />

        <div className="relative min-h-screen w-full overflow-hidden bg-gray-950 bg-opacity-70 text-gray-100">
          {/* ===== Background Particles ===== */}
          <div className="absolute inset-0 -z-10">
            <Particles
              particleColors={[
                "#ffffff",
                "red",
                "#f53347",
                "#ff6a00",
                "#ffff00",
              ]}
              particleCount={300}
              particleSpread={18}
              speed={1}
              particleBaseSize={300}
              moveParticlesOnHover={true}
              alphaParticles={true}
              disableRotation={true}
            />
          </div>

          {/* ===== Navbar ===== */}
          <Navbar location={locationData} />
          <div className="pt-9 mt-3 sm:mt-0" />

          {/* ===== Routes ===== */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<SingleProduct />} />
            <Route path="/category/:category" element={<CategoryProduct />} />
            <Route path="/about" element={<About />} />
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

          {/* ===== Footer ===== */}
          {!hideFooter && <Footer />}
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
