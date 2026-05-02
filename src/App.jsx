import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";

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

  // ✅ PWA STATES
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  /* ================= Online/Offline ================= */
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

  /* ================= PWA INSTALL CAPTURE ================= */
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      setTimeout(() => {
        setShowInstall(true);
      }, 4000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () =>
      window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  /* ================= SHOW INSTALL TOAST ================= */
  useEffect(() => {
    if (!showInstall || !deferredPrompt) return;

    if (location.pathname !== "/") return;

    const isMobile = /Android|iPhone/i.test(navigator.userAgent);
    if (!isMobile) return;

    const lastShown = localStorage.getItem("pwa_prompt_time");
    const now = Date.now();

    if (lastShown && now - lastShown < 7 * 24 * 60 * 60 * 1000) return;

    toast("Install this app 🚀", {
      description: "Add to home screen for faster experience",
      action: {
        label: "Install",
        onClick: async () => {
          deferredPrompt.prompt();

          const choice = await deferredPrompt.userChoice;

          if (choice.outcome === "accepted") {
            console.log("PWA installed");
          }

          setShowInstall(false);
        },
      },
    });

    localStorage.setItem("pwa_prompt_time", now);
  }, [showInstall, deferredPrompt, location.pathname]);

  /* ================= INSTALL SUCCESS ================= */
  useEffect(() => {
    const handleInstalled = () => {
      toast.success("App installed successfully 🎉");
    };

    window.addEventListener("appinstalled", handleInstalled);

    return () =>
      window.removeEventListener("appinstalled", handleInstalled);
  }, []);

  /* ================= Tawk Chat ================= */
  useEffect(() => {
    if (window.Tawk_API) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/69084ab76435f2194e4f2aa9/1j9467o9s";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  /* ================= LOCATION ================= */
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

  /* ================= INIT ================= */
  useEffect(() => {
    getLocation();

    AOS.init({
      duration: 300,
      once: false,
      easing: "ease-in-out",
    });
  }, []);

  /* ================= UI LOGIC ================= */
  const hideFooter =
    location.pathname === "/contact" ||
    location.pathname === "/cart" ||
    location.pathname === "/wishlist";

  if (!isOnline) return <Offline />;

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 4000,
          classNames: {
            toast:
              "bg-white/80 backdrop-blur-xl text-gray-800 border border-blue-200 rounded-xl shadow-lg px-4 py-1",
          },
        }}
      />

      <Suspense fallback={<Spinner />}>
        <ScrollProgressBar />

        <div className="relative min-h-screen w-full overflow-hidden text-gray-800">
          <div className="absolute inset-0 -z-30 bg-gradient-to-br from-gray-100 via-gray-200 to-blue-100" />

          <div className="absolute inset-0 -z-10">
            <Particles particleColors={["#2563eb"]} particleCount={80} />
          </div>

          <div className="relative z-10">
            <Navbar
              location={locationData}
              onLocationChange={onLocationChange}
            />
            <div className="pt-12" />

            <Routes>
              <Route path="/legal/:type" element={<LegalPage />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<SingleProduct />} />
              <Route path="/category/:category" element={<CategoryProduct />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              <Route path="/track-order" element={<TrackOrder />} />
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
