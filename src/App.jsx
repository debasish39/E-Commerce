import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import { Toaster } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";
import { Alert, Button } from "@heroui/react";
import Spinner from "./components/Spinner";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import SsoCallback from "./pages/SsoCallback";
import VerifySignIn from "./pages/VerifySignIn";
import ProfilePage from "./pages/ProfilePage";
import Offline from "./pages/Offline";
import TrackOrder from "./pages/TrackOrder";
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
const LegalPage = lazy(() => import("./pages/LegalPage.jsx"));
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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      setTimeout(() => {
        // ✅ Already installed → don't show
        const isStandalone =
          window.matchMedia("(display-mode: standalone)").matches ||
          window.navigator.standalone === true;

        if (isStandalone) return;

        // 🧠 show only once per day
        const last = localStorage.getItem("pwa_banner_time");
        const now = Date.now();

        if (last && now - last < 1 * 24 * 60 * 60 * 1000) return;
        setShowInstall(true);
        localStorage.setItem("pwa_banner_time", now);
      }, 9000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () =>
      window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  useEffect(() => {
    const installed = () => {
      setShowInstall(false);
    };

    window.addEventListener("appinstalled", installed);

    return () =>
      window.removeEventListener("appinstalled", installed);
  }, []);
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
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      console.log("Installed");
    }

    setShowInstall(false);
  };
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
  // useEffect(() => {
  //   const handleBeforeUnload = (e) => {
  //     e.preventDefault();
  //     e.returnValue = ""; 
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);
  /* ================= Hide Footer Logic ================= */
  const hideFooter =
    location.pathname === "/contact" ||
    location.pathname === "/cart" ||
    location.pathname === "/wishlist";
  if (!isOnline) {
    return <Offline />;
  }
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
              particleCount={105}
              particleSpread={6}
              speed={0.3}
              particleBaseSize={180}
              moveParticlesOnHover
              alphaParticles

            />
          </div>

          {/* ================= Main Content ================= */}
          <div className="relative z-10">
            {showInstall && location.pathname === "/" && (
              <div
                data-aos="fade-up"
                data-aos-duration="700"
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
              >
                <div className="relative overflow-hidden rounded-2xl border border-blue-200/20 bg-white/60 backdrop-blur-3xl shadow-[0_20px_60px_rgba(37,99,235,0.35)]">

                  {/* Animated Glow Background */}
                  <div className="absolute -top-16 -left-16 w-56 h-56 bg-blue-400/30 blur-[120px] rounded-full animate-pulse" />
                  <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-indigo-400/30 blur-[140px] rounded-full animate-[float_8s_ease-in-out_infinite]" />

                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-blue-400/20 pointer-events-none" />

                  {/* Content */}
                  <div className="relative z-10 flex items-center justify-between gap-4 px-5 py-4">

                    {/* Left Content */}
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800 text-sm tracking-wide">
                        Install App 🚀
                      </span>

                      <span className="text-xs text-gray-500">
                        Faster checkout • Offline access • Smooth experience
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">

                      <button
                        onClick={handleInstall}
                        className="px-4 py-1.5 text-xs font-medium rounded-lg 
            bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
            shadow-lg hover:scale-105 hover:shadow-blue-500/40 
            transition-all duration-300"
                      >
                        Install
                      </button>

                      <button
                        onClick={() => setShowInstall(false)}
                        className="w-7 h-7 flex items-center justify-center rounded-full 
            bg-white/40 backdrop-blur-md text-gray-600 hover:text-black 
            hover:bg-white/70 transition"
                      >
                        ✕
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            )}
            <Navbar
              location={locationData}
              onLocationChange={onLocationChange}
            />
            <div className="pt-12" />

            <Routes>
              <Route path="/legal/:type" element={<LegalPage />} />

              <Route path="*" element={<NotFound />} />
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
              <Route
                path="/order-history"
                element={
                  <ProtectedRoute>
                    <OrderHistory />
                  </ProtectedRoute>
                }
              />
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
              <Route
                path="/track-order"
                element={
                  <ProtectedRoute>
                    <TrackOrder />
                  </ProtectedRoute>
                }
              />
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
