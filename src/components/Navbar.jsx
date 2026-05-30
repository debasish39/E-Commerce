import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart, MapPin, ChevronDown,
  Home, ShoppingBag, Package, Phone,
  Search, Mic, MicOff, X,
} from "lucide-react";
import {
  Modal, ModalContent, ModalHeader,
  ModalBody, useDisclosure,
} from "@heroui/react";
import { FaRegUserCircle } from "react-icons/fa";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import { BsBox2 } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/wishlistContext";
import { getData } from "../context/DataContext";
import LocationMap from "../components/LocationMap";
import { toast } from "sonner";

const NAV_LINKS = [
  { name: "Collections", path: "/products", icon: "🛍️" },
  { name: "Contact", path: "/contact", icon: "📞" },
  { name: "Orders", path: "/order-history", icon: "📦" },
  { name: "Track Order", path: "/track-order", icon: "🚚" },
];

export default function Navbar({ location, onLocationChange }) {
  const { user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [area, setArea] = useState("");
  const { cartItem } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const { search, setSearch } = getData();

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
            <Link
              to="/"
              className="text-[24px]"
              style={{
                fontFamily: "'Pacifico', cursive",
                background: "linear-gradient(135deg,#4f46e5,#2563eb)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "0.5px",
                fontWeight: "700",
              }}
            >
              E-Shop
            </Link>
            <button className=" hidden sm:flex justify-center items-center gap-1 border border-violet-300 bg-black/5 rounded-md px-1.5 py-1 text-sm" onClick={e => { e.stopPropagation(); onOpen(); }}>
              <span style={{ color: "#6366f1", flexShrink: 0 }}>📍</span>
              <span className="loc-txt text-xs">{locationLabel}</span>
              <ChevronDown size={15} style={{ color: "#6366f1", flexShrink: 0 }} />
            </button>
          </div>

          {/* SEARCH (desktop) */}
          <div className="hidden md:flex flex-1 max-w-[500px]">

            <div className="
    relative flex items-center w-full
    rounded-xl overflow-hidden
    border border-indigo-100
    bg-white/80 backdrop-blur
    shadow-sm
    focus-within:ring-2 focus-within:ring-indigo-300
    transition
  ">

              {/* LEFT ICON */}
             <span
  className="absolute left-3"
  style={{
    fontSize: "15px",
  }}
>
  🔍
</span>

              {/* INPUT */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && navigate("/products")}
                placeholder="Search products…"
                className="
        w-full
        pl-9 pr-10 py-2
        text-sm text-gray-700
        bg-transparent
        outline-none
        placeholder:text-indigo-300
      "
              />

              {/* RIGHT ICON (VOICE) */}
              <button
                onClick={handleVoiceSearch}
                className={`
        absolute right-3
        transition-all
        ${isListening
                    ? "text-indigo-500 animate-pulse"
                    : "text-indigo-300 hover:text-indigo-500"}
      `}
              >
                {isListening ? <span>🔇</span> : <span>🎤</span>}
              </button>

            </div>
          </div>

          {/* NAV LINKS + ICONS (desktop) */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(({ name, path, icon }) => (
              <NavLink key={path} to={path}
                className={({ isActive }) => `nb-link ${isActive ? "act" : ""}`}>
                <span style={{ color: "#6366f1" }}>{icon}</span>{name}
              </NavLink>
            ))}

            <div className="w-px h-5 mx-2" style={{ background: "rgba(99,102,241,0.15)" }} />

            <Link to="/cart" className="nb-ibtn">
              <span>🛒</span>
              {cartItem.length > 0 && <span className="nb-badge">{cartItem.length}</span>}
            </Link>

            <Link to="/wishlist" className="nb-ibtn ml-1">
              <span>❤️</span>
              {wishlist.length > 0 && <span className="nb-badge">{wishlist.length}</span>}
            </Link>

            <div className="ml-1">
              <SignedOut>
                <button onClick={() => navigate("/sign-in")} className="nb-ibtn">
                  <span>👤</span>
                </button>
              </SignedOut>
              <SignedIn>
                {user && (
                  <button onClick={() => navigate("/profile")}
                    className="w-8 h-8 rounded-xl overflow-hidden cursor-pointer"
                    style={{ boxShadow: "0 0 0 2px #6366f1" }}>
                    <img src={user.imageUrl} alt="profile" className="w-full h-full object-cover" />
                  </button>
                )}
              </SignedIn>
            </div>
          </nav>

          {/* MOBILE RIGHT */}
          <div className="sm:hidden flex items-center gap-2">

            {/* SEARCH BAR */}
            <div className="
    relative flex items-center flex-1
    rounded-xl overflow-hidden
    border border-indigo-100
    bg-white/30 backdrop-blur
    shadow-sm
    focus-within:ring-2 focus-within:ring-indigo-300
    transition
  ">

              {/* LEFT SEARCH ICON */}
           <span
  className="absolute left-3"
  style={{
    fontSize: "15px",
  }}
>
  🔍
</span>

              {/* INPUT */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate("/products");
                    setMobileOpen(false);
                  }
                }}
                placeholder="Search products…"
                className="
        w-full
        pl-9 pr-10 py-2
        text-sm text-gray-700
        bg-transparent outline-none
        placeholder:text-indigo-300
      "
              />

              {/* VOICE ICON */}
              <button
                onClick={handleVoiceSearch}
                className={`
        absolute right-3
        transition-all
        ${isListening
                    ? "text-indigo-500 animate-pulse"
                    : "text-indigo-300"}
      `}
              >
                {isListening ? <span>🔇</span> :<span>🎤</span>}
              </button>

            </div>

            {/* MENU BUTTON */}
            <button
              className="
      nb-ibtn
      flex items-center justify-center
    "
              onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen
                ? <HiMenuAlt3 size={18} style={{ color: "#6366f1" }} />
                : <HiMenuAlt1 size={18} />}
            </button>

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
                <span>📍</span>
              </div>
              <h2 className="font-bold text-base text-indigo-950" style={{ fontFamily: "'Syne',sans-serif" }}>
                Set Delivery Location
              </h2>
              <p className="text-xs text-slate-400">Choose your address to check delivery availability</p>
            </ModalHeader>
            <ModalBody className="py-5 space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 relative flex items-center">
                  <span className="absolute left-3 pointer-events-none" style={{ color: "#a5b4fc" }}>📍</span>
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
              E-Shop
            </Link>

          </div>
          <div className="flex items-center gap-2">
            <SignedOut>
              <button onClick={() => { navigate("/sign-in"); setMobileOpen(false); }}
                className="w-3 h-3 rounded-xl flex items-center justify-center nb-ibtn">
                <span>👤</span>
              </button>
            </SignedOut>
            <SignedIn>
              {user && (
                <img src={user.imageUrl} alt="profile"
                  onClick={() => { navigate("/profile"); setMobileOpen(false); }}
                  className="w-8 h-8 rounded-lg cursor-pointer"
                  style={{ boxShadow: "0 0 0 2px #6366f1" }} />
              )}
            </SignedIn>
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
            <span>📍</span>
            <span className="truncate flex-1 text-xs">{locationLabel}</span>
            <ChevronDown size={11} style={{ color: "#c7d2fe", flexShrink: 0 }} />
          </button>
        </div>

        {/* nav links */}
        <nav className="px-4 pt-4 space-y-0.5">
          {[{ name: "Home", path: "/", icon: <span>🏠</span> }, { name: "Orders", path: "/order-history", icon: <span>🛒</span> },
          { name: "Track Order", path: "/track-order", icon: <span>🚚</span> },].map(({ name, path, icon }) => (
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
      <div className={`sm:hidden nb nb-bottom fixed bottom-0 inset-x-0 z-40`}
        style={{ transform: showNav ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s ease" }}>
        <div className="flex items-end justify-around px-3 pt-2 pb-3 max-w-md mx-auto">

          <NavLink to="/" className={({ isActive }) => `nb-blink ${isActive ? "bact" : ""}`}>
            <span  style={{ fontSize: "20px" }}>🏠</span> Home
          </NavLink>

        <NavLink
  to="/products"
  className={({ isActive }) =>
    `nb-blink ${isActive ? "bact" : ""}`
  }
>
  <span style={{ fontSize: "20px" }}>🛍️</span>
  Collections
</NavLink>

{/* floating cart */}
<NavLink to="/cart">
  {({ isActive }) => (
    <div
      className={`nb-cfloat relative ${
        isActive ? "scale-110" : ""
      }`}
    >
      <span style={{ fontSize: "24px" }}>🛒</span>

      {cartItem.length > 0 && (
        <span
          className="nb-badge"
          style={{
            top: -3,
            right: -3,
            border: "2px solid white",
          }}
        >
          {cartItem.length}
        </span>
      )}
    </div>
  )}
</NavLink>

<NavLink
  to="/wishlist"
  className={({ isActive }) =>
    `nb-blink relative ${isActive ? "bact" : ""}`
  }
>
  <div className="relative">
    <span style={{ fontSize: "20px" }}>❤️</span>

    {wishlist.length > 0 && (
      <span
        className="nb-badge"
        style={{ top: -6, right: -8 }}
      >
        {wishlist.length}
      </span>
    )}
  </div>

  Wishlist
</NavLink>

<div className="nb-blink">
  <SignedOut>
    <button
      onClick={() => navigate("/sign-in")}
      className="flex flex-col items-center gap-1"
    >
      <span style={{ fontSize: "20px" }}>👤</span>
      Account
    </button>
  </SignedOut>

  <SignedIn>
    {user && (
      <button
        onClick={() => navigate("/profile")}
        className="flex flex-col items-center gap-1"
      >
        <img
          src={user.imageUrl}
          alt="p"
          className="w-7 h-7 rounded-full"
          style={{
            boxShadow: "0 0 0 2px #6366f1",
          }}
        />

        <span>Profile</span>
      </button>
    )}
  </SignedIn>

          </div>
        </div>
      </div>
    </>
  );
}