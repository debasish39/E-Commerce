import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import { Toaster } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";
import Spinner from "./components/Spinner";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import VerifySignIn from "./pages/VerifySignIn";
import ProfilePage from "./pages/ProfilePage";
import Offline from "./pages/Offline";
import TrackOrder from "./pages/TrackOrder";

/* ── lazy pages ── */
const Home           = lazy(() => import("./pages/Home"));
const Contact        = lazy(() => import("./pages/Contact"));
const Cart           = lazy(() => import("./pages/Cart"));
const Products       = lazy(() => import("./pages/Products"));
const SingleProduct  = lazy(() => import("./pages/SingleProduct"));
const CategoryProduct= lazy(() => import("./pages/CategoryProduct"));
const WishlistPage   = lazy(() => import("./pages/WishlistPage"));
const OrderSuccess   = lazy(() => import("./pages/OrderSuccess"));
const OrderHistory   = lazy(() => import("./pages/OrderHistory"));
const Verify         = lazy(() => import("./pages/verify"));
const LegalPage      = lazy(() => import("./pages/LegalPage.jsx"));

/* ── lazy components ── */
const Navbar           = lazy(() => import("./components/Navbar"));
const Footer           = lazy(() => import("./components/Footer"));
const ProtectedRoute   = lazy(() => import("./components/ProtectedRoute"));
const NotFound         = lazy(() => import("./components/NotFound"));
const ScrollToTop      = lazy(() => import("./components/scrollToTop"));
const Particles        = lazy(() => import("./components/Particles"));
const ScrollProgressBar= lazy(() => import("./components/ScrollProgressBar"));

/* ══════════════════════════════════════════════
   APP LOADER — modernized
══════════════════════════════════════════════ */
const LOADER_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@600;700&display=swap');

/* ── keyframes ── */
@keyframes al-fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes al-spin     { to{transform:rotate(360deg)} }
@keyframes al-orb1     { 0%,100%{transform:translate(0,0)} 50%{transform:translate(22px,-16px)} }
@keyframes al-orb2     { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-18px,20px)} }
@keyframes al-orb3     { 0%,100%{transform:translate(0,0)} 50%{transform:translate(14px,18px)} }
@keyframes al-pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.55;transform:scale(1.06)} }
@keyframes al-barFlow  { 0%{transform:translateX(-100%)} 100%{transform:translateX(350%)} }
@keyframes al-gridFade { from{opacity:0} to{opacity:1} }
@keyframes al-dotPop   { 0%,80%,100%{transform:scale(0);opacity:0} 40%{transform:scale(1);opacity:1} }
@keyframes al-shimmer  { 0%{background-position:-300% center} 100%{background-position:300% center} }
@keyframes al-ripple   { 0%{transform:scale(.6);opacity:.8} 100%{transform:scale(2.2);opacity:0} }
@keyframes al-scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(400%)} }

/* ── shell ── */
.al-shell {
  position:fixed; inset:0; z-index:9999;
  display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:0;
  font-family:'DM Sans',sans-serif;
  background:linear-gradient(155deg,#f0effd 0%,#e8eaff 35%,#edf3ff 70%,#f8f9ff 100%);
  overflow:hidden;
}

/* ── ambient orbs ── */
.al-orb {
  position:absolute; border-radius:50%;
  filter:blur(80px); pointer-events:none;
}
.al-o1 {
  width:520px; height:520px; top:-160px; left:-120px;
  background:radial-gradient(circle,rgba(80,70,228,.16) 0%,transparent 65%);
  animation:al-orb1 16s ease-in-out infinite;
}
.al-o2 {
  width:400px; height:400px; bottom:-120px; right:-80px;
  background:radial-gradient(circle,rgba(59,130,246,.13) 0%,transparent 65%);
  animation:al-orb2 19s ease-in-out infinite;
}
.al-o3 {
  width:280px; height:280px; top:45%; left:58%;
  background:radial-gradient(circle,rgba(124,58,237,.09) 0%,transparent 65%);
  animation:al-orb3 13s ease-in-out infinite;
}

/* ── dot-grid ── */
.al-grid {
  position:absolute; inset:0; pointer-events:none;
  background-image:radial-gradient(circle,rgba(80,70,228,.048) 1px,transparent 1px);
  background-size:30px 30px;
  animation:al-gridFade 1.2s ease both;
}

/* ── scanline sweep ── */
.al-scan {
  position:absolute; inset-inline:0; height:180px; pointer-events:none;
  background:linear-gradient(180deg,transparent,rgba(80,70,228,.04),transparent);
  animation:al-scanline 4s linear infinite;
}

/* ── content card ── */
.al-card {
  position:relative; z-index:1;
  display:flex; flex-direction:column; align-items:center; gap:28px;
  animation:al-fadeUp .60s cubic-bezier(.22,1,.36,1) both;
}

/* ── logo ring ── */
.al-logo-wrap {
  position:relative;
  width:96px; height:96px;
  display:flex; align-items:center; justify-content:center;
}
.al-logo-ring {
  position:absolute; inset:0; border-radius:50%;
  background:conic-gradient(
    from 0deg,
    #5046e4 0deg,
    #7c3aed 100deg,
    #3b82f6 220deg,
    rgba(80,70,228,.10) 280deg,
    rgba(80,70,228,.10) 360deg
  );
  animation:al-spin 1.6s linear infinite;
}
.al-logo-ring-inner {
  position:absolute; inset:6px; border-radius:50%;
  background:rgba(255,255,255,.96); backdrop-filter:blur(14px);
  display:flex; align-items:center; justify-content:center;
  box-shadow:inset 0 2px 8px rgba(80,70,228,.08);
}
.al-logo-img {
  width:54px; height:54px; object-fit:contain;
  animation:al-pulse 2.8s ease-in-out infinite;
}

/* ripple rings */
.al-ripple {
  position:absolute; inset:0; border-radius:50%;
  border:1.5px solid rgba(80,70,228,.22);
  animation:al-ripple 2.4s ease-out infinite;
}
.al-ripple:nth-child(2) { animation-delay:.80s; }
.al-ripple:nth-child(3) { animation-delay:1.60s; }

/* ── brand text ── */
.al-brand {
  font-family:'Syne',sans-serif;
  font-size:2rem; font-weight:900; letter-spacing:-.035em; line-height:1;
  background:linear-gradient(135deg,#5046e4 0%,#7c3aed 55%,#3b82f6 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.al-tagline {
  font-size:12.5px; font-weight:600; color:#9896b8;
  letter-spacing:.06em; text-transform:uppercase; margin-top:3px; text-align:center;
}

/* ── progress bar ── */
.al-prog-wrap {
  width:220px; display:flex; flex-direction:column; gap:8px; align-items:center;
}
.al-prog-track {
  width:100%; height:3px; border-radius:99px;
  background:rgba(80,70,228,.10); overflow:hidden; position:relative;
}
.al-prog-fill {
  height:100%; border-radius:99px;
  background:linear-gradient(90deg,#5046e4,#7c3aed,#3b82f6);
  transition:width .35s cubic-bezier(.22,1,.36,1);
  position:relative;
}
.al-prog-fill::after {
  content:''; position:absolute; inset:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);
  background-size:200% 100%;
  animation:al-barFlow 1.6s ease-in-out infinite;
}

/* ── pct text ── */
.al-pct {
  font-family:'JetBrains Mono',monospace;
  font-size:11px; font-weight:700; color:#5046e4; letter-spacing:.06em;
}

/* ── loading dots ── */
.al-dots { display:flex; gap:5px; align-items:center; }
.al-dot {
  width:5px; height:5px; border-radius:50%; background:#5046e4;
  animation:al-dotPop 1.4s ease-in-out infinite;
}
.al-dot:nth-child(2) { animation-delay:.20s; background:#7c3aed; }
.al-dot:nth-child(3) { animation-delay:.40s; background:#3b82f6; }

/* ── status text ── */
.al-status {
  font-size:12px; font-weight:600; color:#9896b8;
  letter-spacing:.03em; animation:al-fadeUp .40s ease both;
}

/* ── bottom pill ── */
.al-pill {
  position:absolute; bottom:28px;
  display:inline-flex; align-items:center; gap:7px;
  padding:7px 16px; border-radius:40px;
  background:rgba(255,255,255,.80); backdrop-filter:blur(12px);
  border:1px solid rgba(80,70,228,.12);
  box-shadow:0 4px 16px rgba(80,70,228,.08);
  font-size:11.5px; font-weight:700; color:#5046e4;
  animation:al-fadeUp .80s cubic-bezier(.22,1,.36,1) .40s both;
}
.al-pill-dot {
  width:7px; height:7px; border-radius:50%;
  background:linear-gradient(135deg,#10b981,#059669);
  animation:al-pulse 1.6s ease-in-out infinite;
}

/* ── corner accents ── */
.al-corner {
  position:absolute; width:40px; height:40px; pointer-events:none;
  opacity:.30;
}
.al-corner.tl { top:20px; left:20px; border-top:2px solid #5046e4; border-left:2px solid #5046e4; border-radius:6px 0 0 0; }
.al-corner.tr { top:20px; right:20px; border-top:2px solid #5046e4; border-right:2px solid #5046e4; border-radius:0 6px 0 0; }
.al-corner.bl { bottom:20px; left:20px; border-bottom:2px solid #5046e4; border-left:2px solid #5046e4; border-radius:0 0 0 6px; }
.al-corner.br { bottom:20px; right:20px; border-bottom:2px solid #5046e4; border-right:2px solid #5046e4; border-radius:0 0 6px 0; }
`;

const STATUS_MSGS = [
  "Warming up the engine…",
  "Fetching your products…",
  "Almost ready…",
  "Polishing the pixels…",
  "Just a moment…",
];

function AppLoader() {
  const [progress, setProgress] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    /* smooth progress */
    const pTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(pTimer); return 100; }
        const step = p < 60 ? Math.random() * 14 + 4 : Math.random() * 6 + 1;
        return Math.min(100, p + step);
      });
    }, 260);

    /* rotate status messages */
    const sTimer = setInterval(() => {
      setStatusIdx(i => (i + 1) % STATUS_MSGS.length);
    }, 900);

    return () => { clearInterval(pTimer); clearInterval(sTimer); };
  }, []);

  return (
    <>
      <style>{LOADER_CSS}</style>
      <div className="al-shell">
        {/* ambient */}
        <div className="al-orb al-o1" />
        <div className="al-orb al-o2" />
        <div className="al-orb al-o3" />
        <div className="al-grid" />
        <div className="al-scan" />

        {/* corner frame accents */}
        <div className="al-corner tl" />
        <div className="al-corner tr" />
        <div className="al-corner bl" />
        <div className="al-corner br" />

        {/* main card */}
        <div className="al-card">

          {/* logo ring */}
          <div className="al-logo-wrap">
            <div className="al-ripple" />
            <div className="al-ripple" />
            <div className="al-ripple" />
            <div className="al-logo-ring" />
            <div className="al-logo-ring-inner">
              <img src="/logo.png" alt="Odikart" className="al-logo-img" />
            </div>
          </div>

          {/* brand */}
          <div style={{ textAlign:"center", marginTop:-6 }}>
            <div className="al-brand">Odikart</div>
            <div className="al-tagline">Smart Shopping, Every Day</div>
          </div>

          {/* progress */}
          <div className="al-prog-wrap">
            <div className="al-prog-track">
              <div className="al-prog-fill" style={{ width:`${progress}%` }} />
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%" }}>
              <div className="al-dots">
                <div className="al-dot" />
                <div className="al-dot" />
                <div className="al-dot" />
              </div>
              <span className="al-pct">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* status */}
          <div className="al-status" key={statusIdx}>
            {STATUS_MSGS[statusIdx]}
          </div>

        </div>

        {/* bottom pill */}
        <div className="al-pill">
          <div className="al-pill-dot" />
          Secure &amp; Fast
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════
   APP WRAPPER
══════════════════════════════════════════════ */
const AppWrapper = () => {
  const [locationData,    setLocationData]    = useState(null);
  const location                              = useLocation();
  const [isOnline,        setIsOnline]        = useState(navigator.onLine);
  const [deferredPrompt,  setDeferredPrompt]  = useState(null);
  const [showInstall,     setShowInstall]     = useState(false);
  const [appLoading,      setAppLoading]      = useState(true);

  /* splash timer */
  useEffect(() => {
    const t = setTimeout(() => setAppLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  /* online/offline */
  useEffect(() => {
    const up   = () => setIsOnline(true);
    const down = () => setIsOnline(false);
    window.addEventListener("online",  up);
    window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, []);

  /* PWA install prompt */
  useEffect(() => {
    const handler = e => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => {
        const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
        if (standalone) return;
        const last = Number(localStorage.getItem("pwa_banner_time"));
        if (last && Date.now() - last < 60 * 60 * 1000) return;
        setShowInstall(true);
        localStorage.setItem("pwa_banner_time", Date.now().toString());
      }, 9000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    const h = () => setShowInstall(false);
    window.addEventListener("appinstalled", h);
    return () => window.removeEventListener("appinstalled", h);
  }, []);

  /* Tawk chat */
  useEffect(() => {
    if (window.Tawk_API) return;
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://embed.tawk.to/69084ab76435f2194e4f2aa9/1j9467o9s";
    s.charset = "UTF-8";
    s.setAttribute("crossorigin", "*");
    document.body.appendChild(s);
    return () => document.body.removeChild(s);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setShowInstall(false);
  };

  /* geolocation */
  const getLocation = async () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const { latitude, longitude } = pos.coords;
        const key = import.meta.env.VITE_GEOAPIFY_API_KEY;
        const res = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${key}`);
        setLocationData(res.data.features[0]?.properties || null);
      } catch (e) { console.error("Location fetch failed", e); }
    });
  };

  const onLocationChange = async (lat, lon) => {
    try {
      const key = import.meta.env.VITE_GEOAPIFY_API_KEY;
      const res = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${key}`);
      const loc = res.data.features[0]?.properties;
      setLocationData(loc);
      localStorage.setItem("userLocation", JSON.stringify(loc));
    } catch (e) { console.error("Manual location update failed", e); }
  };

  useEffect(() => {
    getLocation();
    AOS.init({ duration:300, once:false, easing:"ease-in-out" });
  }, []);

  const hideFooter = ["/contact", "/cart", "/wishlist"].includes(location.pathname);

  /* ── guards ── */
  if (appLoading) return <AppLoader />;
  if (!isOnline)  return <Offline />;

  return (
    <>
      {/* ── toaster ── */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 4000,
          classNames: {
            toast:        "bg-white/80 backdrop-blur-xl text-gray-800 border border-blue-200 rounded-xl shadow-lg px-4 py-1",
            success:      "border-green-400/40 shadow-[0_0_25px_rgba(34,197,94,0.5)]",
            error:        "border-red-400/40 shadow-[0_0_25px_rgba(239,68,68,0.5)]",
            warning:      "border-yellow-400/40 shadow-[0_0_25px_rgba(250,204,21,0.5)]",
            description:  "text-gray-300 text-xs",
            actionButton: "bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-md",
            cancelButton: "bg-white/10 text-white text-xs px-3 py-1 rounded-md",
          },
        }}
      />

      <Suspense fallback={<Spinner />}>
        <div className="relative min-h-screen w-full overflow-hidden text-gray-800">

          {/* base gradient */}
          <div className="absolute inset-0 -z-30 bg-gradient-to-br from-gray-100 via-gray-200 to-blue-100" />

          {/* glow accents */}
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-400/30 blur-[180px] rounded-full animate-pulse -z-20" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-300/30 blur-[200px] rounded-full animate-[float_12s_ease-in-out_infinite] -z-20" />

          {/* noise overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.05)_1px,_transparent_0)] bg-[length:40px_40px] opacity-10 -z-20" />

          {/* particles */}
          <div className="absolute inset-0 -z-10">
            <Particles
              particleColors={["#2563eb","#60a5fa","#93c5fd","#3b82f6","#1d4ed8"]}
              particleCount={105}
              particleSpread={6}
              speed={0.3}
              particleBaseSize={180}
              moveParticlesOnHover
              alphaParticles
            />
          </div>

          <div className="relative z-10">

            {/* ── PWA install banner ── */}
            {showInstall && location.pathname === "/" && (
              <div
                data-aos="fade-down"
                data-aos-duration="700"
                className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
              >
                <div className="relative overflow-hidden rounded-2xl border border-blue-200/20 bg-white/60 backdrop-blur-3xl shadow-[0_20px_60px_rgba(37,99,235,0.35)]">
                  <div className="absolute -top-16 -left-16 w-56 h-56 bg-blue-400/30 blur-[120px] rounded-full animate-pulse" />
                  <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-indigo-400/30 blur-[140px] rounded-full animate-[float_8s_ease-in-out_infinite]" />
                  <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-blue-400/20 pointer-events-none" />
                  <div className="relative z-10 flex items-center justify-between gap-4 px-5 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800 text-sm tracking-wide">Install App 🚀</span>
                      <span className="text-xs text-gray-500">Faster checkout · Offline access · Smooth experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={handleInstall}
                        className="px-4 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:scale-105 hover:shadow-blue-500/40 transition-all duration-300">
                        Install
                      </button>
                      <button onClick={() => setShowInstall(false)}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-md text-gray-600 hover:text-black hover:bg-white/70 transition">
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Navbar location={locationData} onLocationChange={onLocationChange} />
            <div className="pt-12" />

            <Routes>
              <Route path="/legal/:type"        element={<LegalPage />} />
              <Route path="*"                   element={<NotFound />} />
              <Route path="/verify-signup-otp"  element={<Verify />} />
              <Route path="/sign-in/*"          element={<SignInPage />} />
              <Route path="/verify-signin"      element={<VerifySignIn />} />
              <Route path="/sign-up/*"          element={<SignUpPage />} />
              <Route path="/"                   element={<Home />} />
              <Route path="/products"           element={<Products />} />
              <Route path="/products/:id"       element={<SingleProduct />} />
              <Route path="/category/:category" element={<CategoryProduct />} />
              <Route path="/order-success"      element={<OrderSuccess />} />
              <Route path="/profile"            element={<ProfilePage />} />
              <Route path="/order-history"
                element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
              <Route path="/wishlist"
                element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
              <Route path="/contact"
                element={<ProtectedRoute><Contact /></ProtectedRoute>} />
              <Route path="/cart"
                element={<ProtectedRoute><Cart location={locationData} getLocation={getLocation} onLocationChange={onLocationChange} /></ProtectedRoute>} />
              <Route path="/track-order"
                element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
            </Routes>

          </div>
        </div>
      </Suspense>
    </>
  );
};

/* ══════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════ */
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
