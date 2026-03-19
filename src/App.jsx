import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import { Toaster } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";
import Spinner from "./components/Spinner";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import SsoCallback from "./pages/SsoCallback";
import VerifySignIn from "./pages/VerifySignIn";
import ProfilePage from "./pages/ProfilePage";

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
const Verify = lazy(() => import("./pages/verify"));
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

    // YOUR TAWK SCRIPT URL
    script.src = "https://embed.tawk.to/69084ab76435f2194e4f2aa9/1j9467o9s";

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
  const onLocationChange = async (lat, lon) => {
    try {
      const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

      const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`;

      const response = await axios.get(url);

      const newLocation = response.data.features[0]?.properties;

      setLocationData(newLocation);

      localStorage.setItem("userLocation", JSON.stringify(newLocation));

    } catch (error) {
      console.error("Manual location update failed", error);
    }
  };
  /* ================= Initial Effects ================= */
  useEffect(() => {
    getLocation();

    AOS.init({
      duration: 300,
      once: false,
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

        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 4000,

          classNames: {
            toast:
              "bg-white/80 backdrop-blur-xl text-gray-800 border border-blue-200 rounded-xl shadow-lg px-4 py-1",

            success:
              "border-green-400/40 shadow-[0_0_25px_rgba(34,197,94,0.5)]",

            error:
              "border-red-400/40 shadow-[0_0_25px_rgba(239,68,68,0.5)]",

            warning:
              "border-yellow-400/40 shadow-[0_0_25px_rgba(250,204,21,0.5)]",

            description: "text-gray-300 text-xs",

            actionButton:
              "bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-md",

            cancelButton:
              "bg-white/10 text-white text-xs px-3 py-1 rounded-md",
          },
        }}
      />
      <Suspense fallback={<Spinner />}>
        <ScrollProgressBar />

        {/* ================= Background Wrapper ================= */}
        <div className="relative min-h-screen w-full overflow-hidden text-gray-800">

          {/* Base Gradient */}
          <div className="absolute inset-0 -z-30 bg-gradient-to-br from-gray-100 via-gray-200 to-blue-100" />

          {/* Glow Accent 1 */}
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-400/30 blur-[180px] rounded-full animate-pulse -z-20" />

          {/* Glow Accent 2 */}
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-300/30 blur-[200px] rounded-full animate-[float_12s_ease-in-out_infinite] -z-20" />

          {/* Noise Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.05)_1px,_transparent_0)] bg-[length:40px_40px] opacity-10 -z-20" />

          {/* Particles */}
          <div className="absolute inset-0 -z-10">
            <Particles
              particleColors={[
                "#2563eb",
                "#60a5fa",
                "#93c5fd",
                "#3b82f6",
                "#1d4ed8",
              ]}
              particleCount={990}
              particleSpread={6}
              speed={0.3}
              particleBaseSize={180}
              moveParticlesOnHover
              alphaParticles

            />
          </div>

          {/* ================= Main Content ================= */}
          <div className="relative z-10">

            <Navbar
              location={locationData}
              onLocationChange={onLocationChange}
            />
            <div className="pt-12" />

            <Routes>
              <Route path="/verify" element={<Verify />} />
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/verify-signin" element={<VerifySignIn />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              <Route path="/sso-callback" element={<SsoCallback />} />
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<SingleProduct />} />
              <Route path="/category/:category" element={<CategoryProduct />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/profile" element={<ProfilePage />} />
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
                    <Cart
                      location={locationData}
                      getLocation={getLocation}
                      onLocationChange={onLocationChange}
                    />
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