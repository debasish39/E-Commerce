import React, { useState, useEffect } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  ShoppingCart,
  MapPin,
  ChevronDown,
  Home,
  ShoppingBag,
  Package,
  Search,
  Mic,
  X,
  Heart,
  User,
  Truck,
  LogOut,
  LocateFixed,
  MapPinned,
} from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Dropdown,
  Avatar,
} from "@heroui/react";
import {

  DropdownTrigger,
  DropdownMenu,
  DropdownItem,


} from "@heroui/react";
import { Settings } from "lucide-react";
import { FaRegUserCircle } from "react-icons/fa";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import { BsBox2 } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/wishlistContext";
import { getData } from "../context/DataContext";
import LocationMap from "../components/LocationMap";
import { toast } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";
const NAV_LINKS = [
  { name: "Shop", path: "/products", icon: <ShoppingBag size={15} /> },

];

export default function Navbar({ location, onLocationChange }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [area, setArea] = useState("");
  const { cartItem } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const { search, setSearch } = getData();
  const [recentSearches, setRecentSearches] = useState([]);
  const routerLocation = useLocation();
  /* =====================================
     AUTH USER
  ===================================== */

  const [

    authUser,

    setAuthUser,

  ] = useState(null);

  /* =====================================
     LOAD USER
  ===================================== */

  useEffect(() => {

    const token =

      localStorage.getItem(
        "token"
      );

    if (!token)
      return;

    const fetchUser =
      async () => {

        try {

          const res =
            await fetch(

              "https://eshop-backend-y0e7.onrender.com/api/auth/me",

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`,

                },

              }

            );

          const data =
            await res.json();

          if (data.success) {

            setAuthUser(
              data.user
            );

          }

        } catch (error) {

          console.error(
            error
          );

        }

      };

    fetchUser();

  }, []);


  /* =====================================
     LOGOUT
  ===================================== */

  const logout =
    () => {

      localStorage.removeItem(
        "token"
      );

      toast.success(
        "Logged out"
      );

      window.location.href =
        "/sign-in";

    };



  useEffect(() => {
    let last = window.scrollY;
    const fn = () => {
      const cur = window.scrollY;
      setShowNav(cur <= last || cur < 80);
      setScrolled(cur > 10);
      last = cur;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
useEffect(() => {

  AOS.init({
    duration: 700,
    easing: "ease-out-cubic",
    once: false,
    mirror: true,
  });

}, []);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleVoiceSearch = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error("Speech recognition not supported"); return; }
    const rec = new SR();
    rec.continuous = false; rec.lang = "en-US"; rec.interimResults = false;
    const tid = toast.loading("🎤 Listening… Speak now");
    setIsListening(true); rec.start();
    rec.onresult = e => {
      const t = e.results[0][0].transcript;
      setSearch(t); toast.dismiss(tid); toast.success(`Searching: "${t}"`); navigate("/products");
    };
    rec.onend = () => { setIsListening(false); toast.dismiss(tid); };
    rec.onerror = () => { setIsListening(false); toast.dismiss(tid); toast.error("Not recognized."); };
  };
  useEffect(() => {

  const handleKeyDown = (e) => {

    // CMD + K (Mac)
    // CTRL + K (Windows)

    if (
      (e.metaKey || e.ctrlKey) &&
      e.key.toLowerCase() === "k"
    ) {

      e.preventDefault();

      setSearchOpen(true);

    }

    // ESC CLOSE

    if (e.key === "Escape") {

      setSearchOpen(false);

    }

  };

  window.addEventListener(
    "keydown",
    handleKeyDown
  );

  return () => {

    window.removeEventListener(
      "keydown",
      handleKeyDown
    );

  };

}, []);
  const handleSearchSubmit = (query) => {
    if (!query.trim()) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== query);

      return [query, ...filtered].slice(0, 5);
    });

    setSearch(query);
    setSearchOpen(false);

    navigate("/products");
  };
  const handleAreaSearch = async () => {
    if (!area) { toast.warning("Please enter a location"); return; }
    const tid = toast.loading("Searching location…");
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${area}`);
      const data = await res.json();
      if (data.length > 0) {
        onLocationChange(data[0].lat, data[0].lon);
        onClose(); toast.dismiss(tid); toast.success("Location found");
      } else { toast.dismiss(tid); toast.error("Location not found"); }
    } catch { toast.dismiss(tid); toast.error("Something went wrong"); }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      p => { onLocationChange(p.coords.latitude, p.coords.longitude); onClose(); },
      e => alert("Failed: " + e.message)
    );
  };

  const locationLabel = location
    ? `${location.village || location.town || location.city || location.suburb || location.county || ""}, ${location.state || ""}`
    : "Set Location";
useEffect(() => {

  if (searchOpen) {

    AOS.refresh();

  }

}, [searchOpen]);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');

        :root {
          --c-indigo: #4f46e5;
          --c-blue:   #2563eb;
          --c-light:  #eef2ff;
          --c-muted:  #6b7280;
          --c-border: rgba(99,102,241,0.15);
          --c-white:  #ffffff;
        }

    

        /* ── bar ── */
        .nb-bar {
          background:rgba(255,255,255,0.75);
          backdrop-filter:blur(20px) saturate(160%);
          -webkit-backdrop-filter:blur(20px) saturate(160%);
          border-bottom:1px solid rgba(99,102,241,0.12);
          transition:background 0.3s, box-shadow 0.3s, transform 0.3s ease;
        }
        .nb-bar.sc {
          background:rgba(255,255,255,0.92);
          box-shadow:0 4px 32px rgba(99,102,241,0.12), 0 1px 0 rgba(99,102,241,0.08) inset;
        }

        /* ── search ── */
        .nb-search {
          background:rgba(238,242,255,0.8);
          border:1px solid rgba(99,102,241,0.18);
          color:#1e1b4b;
          border-radius:12px;font-size:13px;
          transition:background 0.2s, border-color 0.2s, width 0.3s, box-shadow 0.2s;
        }
        .nb-search::placeholder { color:#a5b4fc; }
        .nb-search:focus {
          outline:none;
          background:#fff;
          border-color:#6366f1;
          box-shadow:0 0 0 3px rgba(99,102,241,0.15);
          width:240px !important;
        }

        /* ── nav link ── */
        .nb-link {
          display:flex;align-items:center;gap:5px;
          font-size:13px;font-weight:600;
          color:#6b7280;
          padding:6px 11px;border-radius:10px;
          transition:color 0.2s,background 0.2s;
          white-space:nowrap;
        }
        .nb-link:hover { color:var(--c-indigo);background:rgba(99,102,241,0.08); }
        .nb-link.act {
          color:var(--c-indigo);
          background:rgba(99,102,241,0.1);
          border:1px solid rgba(99,102,241,0.22);
        }

        /* ── icon button ── */
        .nb-ibtn {
          position:relative;
          width:36px;height:36px;border-radius:10px;
          display:flex;align-items:center;justify-content:center;
          color:#6b7280;
          background:rgba(238,242,255,0.7);
          border:1px solid rgba(99,102,241,0.14);
          transition:all 0.2s ease;
          flex-shrink:0;
        }
        .nb-ibtn:hover {
          color:var(--c-indigo);
          background:#eef2ff;
          border-color:rgba(99,102,241,0.35);
          transform:translateY(-1px);
          box-shadow:0 4px 16px rgba(99,102,241,0.18);
        }
     /* ════ SEARCH PAGE ════ */
        .search-page {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: linear-gradient(180deg, #f0f4ff 0%, #ffffff 100%);
          animation: fadeInUp 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
 
        .search-page-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
          z-index: 99;
        }
 
        .search-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.9);
          border-bottom: 1.5px solid rgba(99, 102, 241, 0.12);
          position: relative;
          z-index: 101;
        }
 
        .search-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(248, 250, 255, 0.9);
          border: 1.5px solid rgba(99, 102, 241, 0.15);
          border-radius: 16px;
          padding: 0 14px;
          transition: all 0.28s;
        }
 
        .search-input-wrapper:focus-within {
          background: white;
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
        }
 
        .search-input-wrapper input {
          flex: 1;
          height: 44px;
          background: transparent;
          border: none;
          outline: none;
          font-size: 15px;
          color: #1e1b4b;
          font-weight: 500;
        }
 
        .search-input-wrapper input::placeholder {
          color: #cbd5e1;
        }
 
        .search-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(99, 102, 241, 0.1);
          border: none;
          cursor: pointer;
          transition: all 0.28s;
          color: var(--c-indigo);
        }
 
        .search-close-btn:hover {
          background: rgba(99, 102, 241, 0.15);
          transform: scale(1.05) rotate(90deg);
        }
 
        /* ════ SEARCH CONTENT ════ */
        .search-content {
          height: calc(100vh - 70px);
          overflow-y: auto;
          padding: 20px 16px;
          position: relative;
          z-index: 101;
        }
 
        .search-section {
          margin-bottom: 28px;
          animation: slideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
 
        .search-section:nth-child(1) { animation-delay: 0.05s; }
        .search-section:nth-child(2) { animation-delay: 0.1s; }
 
        .search-title {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
 
        .search-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.7);
          border: 1.5px solid rgba(99, 102, 241, 0.1);
          cursor: pointer;
          transition: all 0.28s;
          margin-bottom: 8px;
        }
 
        .search-item:hover {
          background: rgba(255, 255, 255, 1);
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateX(4px);
          box-shadow: 0 8px 24px rgba(79, 70, 229, 0.1);
        }
 
        .search-item-icon {
          font-size: 18px;
          flex-shrink: 0;
        }
 
        .search-item-text {
          flex: 1;
          font-size: 14px;
          font-weight: 600;
          color: #1e1b4b;
        }
 
        .search-item-remove {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(239, 68, 68, 0.1);
          border: none;
          cursor: pointer;
          color: #ef4444;
          transition: all 0.28s;
          font-size: 12px;
        }
 
        .search-item-remove:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: scale(1.1);
        }
 
        /* ── badge ── */
        .nb-badge {
          position:absolute;top:-5px;right:-5px;
          min-width:17px;height:17px;border-radius:9px;
          font-size:9px;font-weight:700;
          display:flex;align-items:center;justify-content:center;
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          color:white;padding:0 3px;
          border:1.5px solid white;
        }

        /* ── location chip ── */
        .nb-loc {
          display:flex;align-items:center;gap:5px;
          font-size:11px;font-weight:600;
          color:#6b7280;
          background:rgba(238,242,255,0.7);
          border:1px solid rgba(99,102,241,0.14);
          border-radius:10px;padding:5px 10px;
          cursor:pointer;max-width:160px;
          transition:all 0.2s;
        }
        .nb-loc:hover {
          color:var(--c-indigo);
          background:#eef2ff;
          border-color:rgba(99,102,241,0.35);
          box-shadow:0 2px 10px rgba(99,102,241,0.12);
        }
        .nb-loc .loc-txt { white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }

        /* ── drawer ── */
        .nb-drawer {
          background:linear-gradient(180deg,#f0f4ff 0%,#ffffff 100%);
          border-right:1px solid rgba(99,102,241,0.12);
          box-shadow:8px 0 40px rgba(99,102,241,0.12);
        }
        .nb-dlink {
          display:flex;align-items:center;gap:10px;
          padding:11px 14px;border-radius:12px;
          font-size:13px;font-weight:600;
          color:#6b7280;
          transition:all 0.2s;
        }
        .nb-dlink:hover,.nb-dlink.dact {
          background:rgba(99,102,241,0.1);
          color:var(--c-indigo);
          transform:translateX(4px);
          border-left:2px solid #6366f1;
          padding-left:12px;
        }

        @keyframes dIn { from{opacity:0;transform:translateX(-14px);}to{opacity:1;transform:translateX(0);} }
        .nb-dlink { animation:dIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .nb-dlink:nth-child(1){animation-delay:0.05s}
        .nb-dlink:nth-child(2){animation-delay:0.09s}
        .nb-dlink:nth-child(3){animation-delay:0.13s}
        .nb-dlink:nth-child(4){animation-delay:0.17s}
        .nb-dlink:nth-child(5){animation-delay:0.21s}

        /* ── bottom nav ── */
        .nb-bottom {
          background:rgba(255,255,255,0.95);
          backdrop-filter:blur(16px);
          border-top:1px solid rgba(99,102,241,0.12);
          box-shadow:0 -4px 24px rgba(99,102,241,0.08);
          transition:transform 0.3s ease;
        }
        .nb-blink {
          display:flex;flex-direction:column;align-items:center;
          gap:3px;font-size:10px;font-weight:700;
          color:#9ca3af;
          transition:color 0.2s,transform 0.18s;
          min-width:44px;
        }
        .nb-blink.bact,.nb-blink:hover { color:var(--c-indigo);transform:translateY(-1px); }

        .nb-cfloat {
          width:52px;height:52px;border-radius:50%;
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 8px 24px rgba(79,70,229,0.4);
          margin-top:-20px;
          transition:transform 0.2s,box-shadow 0.2s;
        }
        .nb-cfloat:hover { transform:scale(1.08);box-shadow:0 12px 32px rgba(79,70,229,0.5); }

        /* ── modal ── */
        .nb-minput {
          background:rgba(238,242,255,0.7);
          border:1px solid rgba(99,102,241,0.18);
          color:#1e1b4b;border-radius:12px;font-size:13px;
        }
        .nb-minput::placeholder { color:#a5b4fc; }
        .nb-minput:focus { outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.15); }

        .nb-mob-s {
          background:rgba(238,242,255,0.8);
          border:1px solid rgba(99,102,241,0.18);
          color:#1e1b4b;border-radius:10px;font-size:13px;
        }
        .nb-mob-s::placeholder { color:#a5b4fc; }
        .nb-mob-s:focus { outline:none;border-color:#6366f1; }

        /* shimmer button */
        .btn-primary {
          background:linear-gradient(135deg,#4f46e5,#2563eb);
          position:relative;overflow:hidden;
          transition:transform 0.2s,box-shadow 0.2s;
        }
        .btn-primary:hover { transform:translateY(-2px);box-shadow:0 10px 28px rgba(79,70,229,0.4); }
        @keyframes shimmer {
          0%{background-position:-200% center;}
          100%{background-position:200% center;}
        }
        .btn-primary::after {
          content:'';position:absolute;inset:0;border-radius:inherit;
          background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.2) 50%,transparent 65%);
          background-size:200% 100%;
          animation:shimmer 2.2s infinite;
        }

        /* top accent bar */
        .nb-accent-bar {
          height:3px;
          background:linear-gradient(90deg,#4f46e5,#3b82f6,#6366f1);
        }
      `}</style>
      

  {/* SEARCH PAGE */}
{searchOpen && (
  <>

    {/* OVERLAY */}
    <div
      className="
        fixed inset-0 z-[100]

        bg-slate-950/30
        backdrop-blur-md

        transition-all duration-500
      "

      data-aos="fade"
      onClick={() => setSearchOpen(false)}
    />

    {/* WRAPPER */}
  <div
  className="
    fixed inset-0 z-[101]

    flex items-start justify-center

    pt-[7vh]
    px-4
  "

  data-aos="fade-up"
  data-aos-duration="500"
  data-aos-easing="ease-out-cubic"
>

      {/* MODAL */}
      <div
        data-aos="zoom-in-up"
        data-aos-duration="500"

        className="
          relative

          w-full max-w-2xl

          overflow-hidden

          rounded-[36px]

          border border-white/20

          bg-white/20
          backdrop-blur-[30px]

          shadow-[0_40px_120px_rgba(15,23,42,0.35)]
        "
      >

        {/* FLOATING LIGHTS */}
        <div
          className="
            absolute

            -top-24 -right-20

            w-72 h-72

            rounded-full

            bg-indigo-500/20

            blur-3xl

            animate-pulse
          "
        />

        <div
          className="
            absolute

            -bottom-24 -left-20

            w-72 h-72

            rounded-full

            bg-blue-500/10

            blur-3xl

            animate-pulse
          "
        />

        {/* SHIMMER */}
        <div
          className="
            absolute inset-0

            opacity-40

            bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.12),transparent)]

            animate-[shimmer_3s_linear_infinite]

            pointer-events-none
          "
        />

        {/* HEADER */}
        <div
          data-aos="fade-down"
          data-aos-delay="100"

          className="
            relative

            flex items-center gap-4

            px-6 py-5

            border-b border-white/20
          "
        >

          {/* ICON */}
          <div
            className="
              w-12 h-12

              rounded-2xl

              flex items-center justify-center

              bg-gradient-to-br
              from-indigo-500
              via-blue-500
              to-violet-500

              shadow-[0_12px_32px_rgba(79,70,229,0.30)]

              animate-pulse
            "
          >

            <Search
              size={20}
              className="text-white"
            />

          </div>

          {/* INPUT */}
          {/* INPUT */}
<div className="flex-1 relative">

  <input
    type="text"
    autoFocus
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        handleSearchSubmit(search);
      }
    }}
    placeholder="Search products, brands, categories..."
    className="
      w-full

      bg-transparent

      pr-12

      text-[16px]
      font-semibold
      text-white

      placeholder:text-white/70

      outline-none
    "
  />
 {/* CLEAR BUTTON */}
  {/*
  {search && (

    <button
      onClick={() => setSearch("")}

      className="
        absolute right-0 top-1/2
        -translate-y-1/2

        w-9 h-9

        rounded-xl

        flex items-center justify-center
        text-white
        bg-gray-300
        backdrop-blur-xl

        border border-white/10

        hover:bg-red-500
        hover:border-red-400

        hover:rotate-90
        hover:scale-110

        transition-all duration-300

        group
      "
    >

      <X
        size={15}
        className="
          text-white/70

          group-hover:text-white

          transition
        "
      />

    </button>

  )} */}

</div>

          {/* SHORTCUT */}
          <div
            className="
              hidden sm:flex items-center gap-1

              rounded-xl

              border border-white/30

              bg-white/50
              backdrop-blur-xl

              px-3 py-1.5

              text-[11px]
              font-bold
              text-indigo-500
            "
          >

            <kbd>ESC</kbd>

          </div>

          {/* CLOSE */}
          <button
            onClick={() => setSearchOpen(false)}

            className="
              w-10 h-10

              rounded-2xl

              flex items-center justify-center

              bg-white/60

              hover:bg-white

              transition-all duration-300
              hover:rotate-90
            "
          >

            <X
              size={18}
              className="text-slate-500"
            />

          </button>

        </div>

        {/* BODY */}
        <div
          className="
            relative

            max-h-[70vh]
            overflow-y-auto

            px-5 py-5
          "
        >

          {/* VOICE SEARCH */}
          <div
            className="mb-8"

            data-aos="fade-right"
            data-aos-delay="250"
          >

            <div
              className="
                flex items-center gap-2

                px-2 mb-4

                text-[11px]
                font-bold

                uppercase tracking-[0.16em]

                text-indigo-900
              "
            >

              <Mic size={13} />

              Voice Search

            </div>

            <button
              onClick={handleVoiceSearch}

              className={`
                group

                relative overflow-hidden

                w-full

                flex items-center gap-4

                rounded-[28px]

                border

                px-5 py-5

                transition-all duration-500

                hover:-translate-y-1
                hover:scale-[1.01]

                ${
                  isListening
                    ? `
                      border-indigo-300

                      bg-gradient-to-r
                      from-indigo-50/80
                      to-blue-50/80

                      shadow-[0_20px_50px_rgba(79,70,229,0.18)]
                    `
                    : `
                      border-white/30

                      bg-white/50

                      hover:border-indigo-200
                      hover:bg-white/70
                    `
                }
              `}
            >

              {/* ICON */}
              <div
                className={`
                  w-12 h-12

                  rounded-2xl

                  flex items-center justify-center

                  transition-all duration-500

                  ${
                    isListening
                      ? `
                        bg-gradient-to-br
                        from-indigo-500
                        to-blue-500

                        shadow-[0_12px_30px_rgba(79,70,229,0.28)]
                      `
                      : `
                        bg-white
                      `
                  }
                `}
              >

                <Mic
                  size={18}
                  className={
                    isListening
                      ? "text-white animate-pulse"
                      : "text-slate-500"
                  }
                />

              </div>

              {/* TEXT */}
              <div className="flex flex-col items-start">

                <span
                  className="
                    text-sm
                    font-semibold
                    text-slate-800
                  "
                >
                  {isListening
                    ? "Listening..."
                    : "Tap to speak"}
                </span>

                <span
                  className="
                    text-xs
                    text-slate-500
                  "
                >
                  Search using your voice
                </span>

              </div>

            </button>

          </div>

          {/* RECENT SEARCHES */}
          {recentSearches.length > 0 && (

            <div
              data-aos="fade-up"
              data-aos-delay="350"
            >

              <div
                className="
                  flex items-center gap-2

                  px-2 mb-4

                  text-[11px]
                  font-bold

                  uppercase tracking-[0.16em]

                  text-slate-500
                "
              >

                <Search size={13} />

                Recent Searches

              </div>

              <div className="space-y-3">

                {recentSearches.map((item, idx) => (

                  <button
                    key={idx}

                    data-aos="fade-up"
                    data-aos-delay={idx * 80}

                    onClick={() => handleSearchSubmit(item)}

                    className="
                      group

                      relative overflow-hidden

                      w-full

                      flex items-center gap-4

                      rounded-2xl

                      border border-white/30

                      bg-white/50

                      px-4 py-4

                      hover:border-indigo-200
                      hover:bg-white/70

                      hover:-translate-y-1
                      hover:scale-[1.01]

                      hover:shadow-[0_12px_32px_rgba(79,70,229,0.10)]

                      transition-all duration-500
                    "
                  >

                    {/* ICON */}
                    <div
                      className="
                        w-11 h-11

                        rounded-2xl

                        flex items-center justify-center

                        bg-white

                        group-hover:bg-indigo-100

                        transition-all duration-300
                      "
                    >

                      <Search
                        size={16}
                        className="
                          text-slate-500
                          group-hover:text-indigo-500
                        "
                      />

                    </div>

                    {/* TEXT */}
                    <div
                      className="
                        flex-1

                        text-left

                        text-sm
                        font-semibold
                        text-slate-700

                        truncate
                      "
                    >
                      {item}
                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        setRecentSearches((prev) =>
                          prev.filter((s) => s !== item)
                        );
                      }}

                      className="
                        w-9 h-9

                        rounded-xl

                        flex items-center justify-center

                        hover:bg-red-50

                        transition-all duration-300
                      "
                    >

                      <X
                        size={14}
                        className="
                          text-slate-400
                          hover:text-red-500
                        "
                      />

                    </button>

                  </button>

                ))}

              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  </>
)}
      {/* overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-indigo-950/20 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)} />
      )}

      {/* ════ NAVBAR ════ */}
      <header className={`nb fixed top-0 left-0 right-0 z-40 nb-bar ${scrolled ? "sc" : ""} bg-indigo-900 border border-violet-900 shadow-lg`}
        style={{ transform: showNav ? "translateY(0)" : "translateY(-100%)", transition: "transform 0.3s ease,background 0.3s,box-shadow 0.3s" }}>

        {/* top color bar */}

        <div className="max-w-7xl mx-auto px-4 h-13 flex items-center justify-between gap-3 " >

          {/* LOGO + LOCATION */}
          <div className="flex items-center gap-6 flex-shrink-0">
<Link to="/" className="flex items-center">
  <img
    src="/logo.png"
    alt="Logo"
    className="w-27 h-27 object-contain"
  />
</Link>
            <button className="hidden sm:flex justify-center items-center gap-1 border border-violet-200 bg-white/50 rounded-md px-1.5 py-2 text-sm" onClick={e => { e.stopPropagation(); onOpen(); }}>
              <span style={{ color: "#6366f1", flexShrink: 0 }}><MapPinned size={15}
                className="text-indigo-500" /></span>
              <span className="loc-txt text-xs truncate max-w-[90px] hidden sm:flex">
                {locationLabel}
              </span>
              <ChevronDown size={15} style={{ color: "#6366f1", flexShrink: 0 }} />
            </button>
          </div>

          {/* SEARCH (desktop) */}
          <div className="hidden md:flex flex-1 max-w-[500px]">

            <button
              onClick={() => setSearchOpen(true)}
              className="
      w-full
      flex items-center gap-3
      rounded-xl
      border border-indigo-100
      bg-white/80
      backdrop-blur
      px-4 py-2
      shadow-sm
      hover:border-indigo-300
      transition
    "
            >

              <Search size={18} className="text-indigo-500" />

              <span className="text-sm text-indigo-300">
                Search products...
              </span>

            <div
  className="
    ml-auto

    hidden lg:flex items-center gap-1

    rounded-xl

    border border-indigo-100

    bg-white/80

    px-2.5 py-1.5

    text-[11px]
    font-bold
    text-indigo-400

    shadow-sm
  "
>

  <kbd
    className="
      font-sans
      leading-none
    "
  >
    ⌘
  </kbd>

  <kbd
    className="
      font-sans
      leading-none
    "
  >
    K
  </kbd>

</div>

            </button>

          </div>
          {/* NAV LINKS + ICONS (desktop) */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(({ name, path, icon }) => (
              <NavLink key={path} to={path}
                className={({ isActive }) => `nb-link shadow-md border-indigo-300 ${isActive ? "act" : ""}`}>
                <span style={{ color: "#6366f1" }} className="text-indigo-500 shadow-md">{icon}</span>{name}
              </NavLink>
            ))}

            <div className="w-px h-5 mx-2 shadow-md" style={{ background: "rgba(99,102,241,0.15)" }} />

            <Link to="/cart" className="nb-ibtn shadow-md">
              <ShoppingCart
                size={18}
                className="text-indigo-500"
              />
              {cartItem.length > 0 && <span className="nb-badge">{cartItem.length}</span>}
            </Link>

            <Link to="/wishlist" className="nb-ibtn ml-1 shadow-md">
              <Heart
                size={18}
                className="text-pink-500"
              />
              {wishlist.length > 0 && <span className="nb-badge">{wishlist.length}</span>}
            </Link>

            {/* ACCOUNT DROPDOWN */}

            <div className="ml-2">

              {!authUser ? (

                <button
                  onClick={() => navigate("/sign-in")}
                  className="nb-ibtn"
                >
                  <User
                    size={18}
                    className="text-indigo-500"
                  />
                </button>

              ) : (

                <Dropdown placement="bottom-end">

                  <DropdownTrigger>

                    <button
                      className="
        flex items-center gap-2

        pl-1 pr-2 py-1

        rounded-2xl

        border border-indigo-100

        bg-white/80
        backdrop-blur-xl

        hover:border-indigo-300
        hover:shadow-lg

        transition-all duration-200
      "
                    >

                      <img
                        src={authUser?.image}
                        alt={authUser?.name}
                        size="sm"
                        className="
    ring-2 ring-indigo-500
    w-9 h-9
    flex-shrink-0 rounded-2xl
  "
                      />

                      <div className="hidden lg:flex flex-col text-left leading-tight">

                        <span className="text-xs font-semibold text-gray-800">
                          {authUser.name}
                        </span>
                      </div>
                      <ChevronDown
                        size={15}
                        className="text-indigo-400"
                      />

                    </button>

                  </DropdownTrigger>

                  <DropdownMenu
                    aria-label="Profile Actions"
                    variant="flat"
                    classNames={{
                      base: `
      min-w-[260px]

      rounded-3xl

      border border-indigo-100

      bg-white/80
      backdrop-blur-2xl

      shadow-[0_24px_80px_rgba(79,70,229,0.18)]

      p-2
    `,
                      list: "gap-1",
                    }}
                  >

                    <DropdownItem
                      key="profile"
                      onPress={() => navigate("/profile")}
                      startContent={
                        <User
                          size={16}
                          className="text-indigo-400"
                        />
                      }
                    >
                      Profile
                    </DropdownItem>

                    <DropdownItem
                      key="orders"
                      onPress={() => navigate("/order-history")}
                      startContent={
                        <Package
                          size={16}
                          className="text-indigo-400"
                        />
                      }
                    >
                      Orders
                    </DropdownItem>

                    <DropdownItem
                      key="track"
                      onPress={() => navigate("/track-order")}
                      startContent={
                        <Truck
                          size={16}
                          className="text-indigo-400"
                        />
                      }
                    >
                      Track Order
                    </DropdownItem>



                    <DropdownItem
                      key="logout"
                      className="text-red-500"
                      onPress={logout}
                      startContent={
                        <LogOut
                          size={16}
                          className="text-red-500"
                        />
                      }
                    >
                      Logout
                    </DropdownItem>

                  </DropdownMenu>

                </Dropdown>

              )}

            </div>




          </nav>



          {/* MOBILE RIGHT */}
          <div className="sm:hidden flex items-center gap-2 flex-1 justify-end">

            {/* SEARCH INPUT */}
            <button
              onClick={() => setSearchOpen(true)}
              className="
      flex items-center gap-2
      flex-1 max-w-[170px]
      px-3 py-2

      rounded-2xl
      border border-white/40

      bg-white/60
      backdrop-blur-xl

      shadow-[0_4px_20px_rgba(79,70,229,0.08)]

      transition-all shadow-md
    "
            >

              <Search
                size={15}
                className="text-indigo-400"
              />

              <span
                className="
        text-xs
        text-slate-400
        truncate
      "
              >
                Search products...
              </span>

            </button>
            <button className=" flex justify-center items-center gap-1 border border-violet-200 shadow-md bg-white/50 rounded-md px-1.5 py-2 text-sm" onClick={e => { e.stopPropagation(); onOpen(); }}>
              <span style={{ color: "#6366f1", flexShrink: 0 }}><MapPinned size={15}
                className="text-indigo-500" /></span>
              <span className="loc-txt text-xs truncate max-w-[90px] hidden sm:flex">
                {locationLabel}
              </span>
              <ChevronDown size={15} style={{ color: "#6366f1", flexShrink: 0 }} />
            </button>
            {/* CART */}
            <Link
              to="/cart"
              className="
      nb-ibtn
      bg-white/60
      backdrop-blur-xl
      border border-white/40
      shadow-md
    "
            >

              <ShoppingCart
                size={18}
                className="text-indigo-500"
              />

              {cartItem.length > 0 && (
                <span className="nb-badge">
                  {cartItem.length}
                </span>
              )}

            </Link>

            {/* WISHLIST */}
            <Link
              to="/wishlist"
              className="
      nb-ibtn
      bg-white/60
      backdrop-blur-xl
      border border-white/40
      shadow-md
    "
            >

              <Heart
                size={18}
                className="text-pink-500"
              />

              {wishlist.length > 0 && (
                <span className="nb-badge">
                  {wishlist.length}
                </span>
              )}

            </Link>

          </div>
        </div>
      </header>

      {/* ════ LOCATION MODAL ════ */}
      <Modal isOpen={isOpen} onClose={onClose} placement="center" backdrop="blur"
        classNames={{ backdrop: "bg-indigo-950/30 backdrop-blur-md" }}
        hideCloseButton className="z-[9999]">
        <ModalContent className="relative rounded-2xl overflow-hidden max-w-lg w-[95%]"
          style={{ background: "white", border: "1px solid rgba(99,102,241,0.15)", boxShadow: "0 24px 64px rgba(79,70,229,0.2)" }}>
          {(onClose) => (<>
            <div className="nb-accent-bar" />
            <button onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer"
              style={{ background: "#f5f3ff", border: "1px solid rgba(99,102,241,0.15)", color: "#6366f1" }}>
              <X size={14} />
            </button>
            <ModalHeader className="flex flex-col items-center gap-2 pb-5 pt-6 border-b"
              style={{ borderColor: "rgba(99,102,241,0.1)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#eef2ff,#e0e7ff)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <LocateFixed
                  size={15}
                  className="text-indigo-500"
                />
              </div>
              <h2 className="font-bold text-base text-indigo-950" style={{ fontFamily: "'Syne',sans-serif" }}>
                Set Delivery Location
              </h2>
              <p className="text-xs text-slate-400">
                Choose your address to check delivery availability
              </p>

              {/* CURRENT LOCATION */}
              <div
                className="
    mt-3
    w-full

    flex items-start gap-3

    rounded-2xl

    bg-indigo-50/80
    border border-indigo-100

    px-4 py-3
  "
              >

                <div
                  className="
      w-9 h-9
      rounded-xl

      flex items-center justify-center

      bg-white
      border border-indigo-100

      flex-shrink-0
    "
                >

                  <MapPinned
                    size={16}
                    className="text-indigo-500"
                  />

                </div>

                <div className="min-w-0 flex-1 text-left">

                  <p
                    className="
        text-[10px]
        font-semibold
        uppercase
        tracking-wide
        text-indigo-400
      "
                  >
                    Current Location
                  </p>

                  <p
                    className="
        text-sm
        font-semibold
        text-slate-700
        truncate
      "
                  >
                    {locationLabel}
                  </p>

                </div>

              </div>
            </ModalHeader>
            <ModalBody className="py-5 space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 relative flex items-center">
                  <span className="absolute left-3 pointer-events-none" style={{ color: "#a5b4fc" }}><LocateFixed
                    size={15}
                    className="text-indigo-500"
                  /></span>
                  <input type="text" placeholder="City, area or pincode"
                    value={area} onChange={e => setArea(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAreaSearch()}
                    className="nb-minput w-full pl-9 pr-3 py-2.5" />
                </div>
                <button onClick={handleAreaSearch}
                  className="btn-primary flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer flex-shrink-0">
                  <Search size={13} /><span className="relative z-10">Search</span>
                </button>
              </div>

              <button onClick={() => { handleUseMyLocation(); onClose(); }}
                className="group w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold cursor-pointer relative overflow-hidden transition-all"
                style={{ background: "#eef2ff", border: "1px solid rgba(99,102,241,0.22)", color: "#4f46e5" }}>
                <MapPin size={13} />Use Current Location
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition"
                  style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.08),transparent)" }} />
              </button>

              <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(99,102,241,0.12)" }}>
                <LocationMap onSelect={(lat, lng) => { onLocationChange(lat, lng); onClose(); }} />
              </div>
            </ModalBody>
          </>)}
        </ModalContent>
      </Modal>

      {/* ════ MOBILE DRAWER ════ */}
      <aside className={`nb nb-drawer fixed top-0 left-0 h-full w-72 z-50
        transition-transform duration-300 ease-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>

        <div className="nb-accent-bar" />

        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "rgba(99,102,241,0.1)" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg,#3b82f6,#6366f1,#8b5cf6)"
              }}>
              <span className="text-white text-sm font-bold">E</span>
            </div>

            <Link
              to="/"
              className=" text-2xl sm:text-3xl font-bold

    bg-gradient-to-r from-indigo-500 to-blue-500
    bg-clip-text text-transparent

    tracking-tight

    hover:opacity-80

    transition"

              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              EShop
            </Link>

          </div>
          <div className="flex items-center gap-2">




            <button onClick={() => setMobileOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer nb-ibtn">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* location */}
        <div className="px-4 pt-4">
          <button onClick={() => { onOpen(); setMobileOpen(false); }}
            className="nb-loc w-full flex text-left px-3 py-2.5 rounded-xl text-sm cursor-pointer"
            style={{ maxWidth: "100%" }}>
            <span><MapPinned size={15} className="text-indigo-500" /></span>
            <span className="truncate flex-1 text-xs">{locationLabel}</span>
            <ChevronDown size={11} style={{ color: "#c7d2fe", flexShrink: 0 }} />
          </button>
        </div>

        {/* nav links */}
        <nav className="px-4 pt-4 space-y-0.5">
          {[{ name: "Home", path: "/", icon: <Home size={16} /> }, { name: "Orders", path: "/order-history", icon: <ShoppingCart size={16} /> },
          { name: "Track Order", path: "/track-order", icon: <Truck size={16} /> },].map(({ name, path, icon }) => (
            <NavLink key={path} to={path} onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `nb-dlink ${isActive ? "dact" : ""}`}>
              <span style={{ color: "#6366f1" }}>{icon}</span>{name}
            </NavLink>
          ))}
        </nav>

        {/* bottom CTA */}
        <div className="absolute bottom-6 left-4 right-4 flex gap-3">
          <Link to="/cart" onClick={() => setMobileOpen(false)}
            className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white">
            <span>🛒</span>
            <span className="relative z-10">Cart</span>
            {cartItem.length > 0 && (
              <span className="relative z-10 bg-white/25 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                {cartItem.length}
              </span>
            )}
          </Link>
          <Link to="/wishlist" onClick={() => setMobileOpen(false)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#eef2ff", border: "1px solid rgba(99,102,241,0.2)", color: "#4f46e5" }}>
            <span>❤️</span>            Wishlist
            {wishlist.length > 0 && (
              <span className="bg-indigo-100 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-indigo-600">
                {wishlist.length}
              </span>
            )}
          </Link>
        </div>
      </aside>

      {/* ════ BOTTOM NAV ════ */}
      <div
        className="
    sm:hidden
    fixed bottom-3 left-3 right-3
    z-40

    transition-all duration-300 ease-out
  "
        style={{
          transform: showNav
            ? "translateY(0)"
            : "translateY(140%)",

          opacity: showNav ? 1 : 0,

          pointerEvents: showNav
            ? "auto"
            : "none",
        }}
      >
        <div
          className="
      flex items-center justify-around

      rounded-[28px]

      bg-white/70
      backdrop-blur-2xl

      border border-white/40

      shadow-[0_10px_40px_rgba(79,70,229,0.12)]

      px-2 py-3
    "
        >

          {/* HOME */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `
          flex flex-col items-center gap-1
          text-[10px] font-semibold
          transition-all

          ${isActive
                ? "text-indigo-600 scale-105"
                : "text-slate-400"}
        `
            }
          >
            <Home size={20} />
            Home
          </NavLink>

          {/* COLLECTION */}
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `
          flex flex-col items-center gap-1
          text-[10px] font-semibold
          transition-all

          ${isActive
                ? "text-indigo-600 scale-105"
                : "text-slate-400"}
        `
            }
          >
            <ShoppingBag size={20} />
            Shop
          </NavLink>

          {/* ORDERS */}
          <NavLink
            to="/order-history"
            className={({ isActive }) =>
              `
          flex flex-col items-center gap-1
          text-[10px] font-semibold
          transition-all

          ${isActive
                ? "text-indigo-600 scale-105"
                : "text-slate-400"}
        `
            }
          >
            <Package size={20} />
            Orders
          </NavLink>

          {/* TRACK */}
          <NavLink
            to="/track-order"
            className={({ isActive }) =>
              `
          flex flex-col items-center gap-1
          text-[10px] font-semibold
          transition-all

          ${isActive
                ? "text-indigo-600 scale-105"
                : "text-slate-400"}
        `
            }
          >
            <MapPin size={20} />
            Track
          </NavLink>

          {/* PROFILE */}
          <button
            onClick={() =>
              navigate(authUser ? "/profile" : "/sign-in")
            }
            className={`
    flex flex-col items-center gap-1
    text-[10px] font-semibold
    transition-all duration-200

    ${routerLocation.pathname === "/profile"
                ? "text-indigo-600 scale-105"
                : "text-slate-400"
              }
  `}
          >

            <div
              className="
      relative

      w-8 h-8

      rounded-2xl

      flex items-center justify-center

      bg-white/70
      backdrop-blur-xl

      border border-white/40

      shadow-[0_4px_20px_rgba(79,70,229,0.08)]

      overflow-hidden
    "
            >

              {authUser?.image ? (

                <img
                  src={authUser.image}
                  alt="profile"
                  className="
          w-full h-full
          object-cover
        "
                />

              ) : (

                <User
                  size={18}
                  className="text-indigo-500"
                />

              )}

            </div>

            <span>
              Profile
            </span>

          </button>

        </div>

      </div>
    </>
  );
}