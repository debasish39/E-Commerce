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
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
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

const BOTTOM_LINKS = [
  { name: "Home", path: "/", icon: Home },
  { name: "Shop", path: "/products", icon: ShoppingBag },
  { name: "Orders", path: "/order-history", icon: Package },
  { name: "Track", path: "/track-order", icon: MapPin },
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
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  /* ===== AUTH USER ===== */
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setAuthUser(data.user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out");
    window.location.href = "/sign-in";
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
    AOS.init({ duration: 400, easing: "ease-out-cubic", once: false, mirror: false });
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
    const tid = toast.loading("Listening… speak now");
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
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      p => { onLocationChange(p.coords.latitude, p.coords.longitude); onClose(); },
      e => toast.error("Failed: " + e.message)
    );
  };

  const locationLabel = location
    ? `${location.village || location.town || location.city || location.suburb || location.county || ""}, ${location.state || ""}`
    : "Set location";

  useEffect(() => {
    if (searchOpen) AOS.refresh();
  }, [searchOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700;900&display=swap');

        :root {
          --m-primary: #4F46E5;
          --m-primary-dark: #3730A3;
          --m-primary-container: #E7E5FE;
          --m-on-primary-container: #211B6D;
          --m-surface: #FFFFFF;
          --m-surface-dim: #F6F6FB;
          --m-surface-container: #F1F0F8;
          --m-surface-container-high: #E9E7F4;
          --m-outline: #DEDCE9;
          --m-outline-strong: #C9C6DA;
          --m-on-surface: #1B1B21;
          --m-on-surface-variant: #5F5C6B;
          --m-error: #BA1A1A;
          --m-error-container: #FFDAD6;
          --m-scrim: rgba(20,18,32,0.45);
          --m-radius-full: 100px;
          --m-radius-lg: 20px;
          --m-radius-xl: 28px;
          --m-elev-1: 0 1px 2px rgba(27,27,33,0.16), 0 1px 4px rgba(27,27,33,0.06);
          --m-elev-2: 0 2px 6px rgba(27,27,33,0.12), 0 4px 14px rgba(27,27,33,0.08);
          --m-elev-3: 0 6px 18px rgba(27,27,33,0.14), 0 2px 6px rgba(27,27,33,0.08);
        }

        .nb, .nb * { font-family: 'Roboto', system-ui, sans-serif; box-sizing: border-box; }

        @keyframes nbFadeUp { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: translateY(0);} }
        @media (prefers-reduced-motion: reduce) { .nb *, .nb *::before, .nb *::after { animation-duration: 0.001ms !important; } }

        /* ── bar ── */
        .nb-bar {
          background: rgba(255,255,255,0.98);
          border-bottom: 1px solid var(--m-outline);
          transition: box-shadow 0.2s, transform 0.25s ease;
        }
        .nb-bar.sc { box-shadow: var(--m-elev-1); }

        /* ── location chip ── */
        .nb-loc {
          display:flex;align-items:center;gap:6px;
          font-size:12px;font-weight:600;
          color: var(--m-on-surface-variant);
          background: var(--m-surface-container);
          border:1px solid var(--m-outline);
          border-radius: var(--m-radius-full);
          padding:7px 12px;
          cursor:pointer;max-width:180px;
          transition: background 0.15s, border-color 0.15s;
        }
        .nb-loc:hover { background: var(--m-primary-container); border-color: transparent; color: var(--m-on-primary-container); }
        .nb-loc .loc-txt { white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }

        /* ── search field trigger ── */
        .nb-search-trigger {
          width:100%;
          display:flex;align-items:center;gap:10px;
          border-radius: var(--m-radius-full);
          border:1px solid var(--m-outline);
          background: var(--m-surface-container);
          padding:9px 16px;
          transition: background 0.15s, border-color 0.15s;
        }
        .nb-search-trigger:hover { background: var(--m-surface-container-high); border-color: var(--m-outline-strong); }

        .nb-kbd {
          display:flex;align-items:center;gap:2px;
          border-radius:8px;
          border:1px solid var(--m-outline-strong);
          background: var(--m-surface);
          padding:3px 7px;
          font-size:11px;font-weight:700;
          color: var(--m-on-surface-variant);
        }

        /* ── nav link ── */
        .nb-link {
          display:flex;align-items:center;gap:6px;
          font-size:13.5px;font-weight:600;
          color: var(--m-on-surface-variant);
          padding:8px 14px;border-radius: var(--m-radius-full);
          transition: color 0.15s, background 0.15s;
          white-space:nowrap;
        }
        .nb-link:hover { color: var(--m-primary); background: var(--m-surface-container); }
        .nb-link.act { color: var(--m-primary-dark); background: var(--m-primary-container); }

        /* ── icon button ── */
        .nb-ibtn {
          position:relative;
          width:40px;height:40px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          color: var(--m-on-surface-variant);
          background: transparent;
          border:none;
          transition: background 0.15s;
          flex-shrink:0;
        }
        .nb-ibtn:hover { background: var(--m-surface-container); }

        /* ── badge ── */
        .nb-badge {
          position:absolute;top:1px;right:1px;
          min-width:16px;height:16px;border-radius:9px;
          font-size:9px;font-weight:700;
          display:flex;align-items:center;justify-content:center;
          background: var(--m-primary);
          color:white;padding:0 3px;
          border:1.5px solid white;
        }

        /* ── drawer ── */
        .nb-drawer { background: var(--m-surface); border-right:1px solid var(--m-outline); }
        .nb-dlink {
          display:flex;align-items:center;gap:12px;
          padding:12px 14px;border-radius: 14px;
          font-size:14px;font-weight:600;
          color: var(--m-on-surface-variant);
          transition: background 0.15s, color 0.15s;
        }
        .nb-dlink:hover, .nb-dlink.dact { background: var(--m-primary-container); color: var(--m-on-primary-container); }

        /* ── bottom nav (Material 3 style) ── */
        .nb-bottom {
          background: var(--m-surface);
          border-top:1px solid var(--m-outline);
        }
        .nb-blink {
          display:flex;flex-direction:column;align-items:center;
          gap:4px;font-size:10.5px;font-weight:600;
          color: var(--m-on-surface-variant);
          transition: color 0.15s;
          min-width:52px;
        }
        .nb-blink.bact { color: var(--m-primary-dark); }
        .nb-bpill {
          width:52px;height:26px;
          display:flex;align-items:center;justify-content:center;
          border-radius: var(--m-radius-full);
          transition: background 0.2s;
        }
        .nb-blink.bact .nb-bpill { background: var(--m-primary-container); }

        /* ── buttons ── */
        .nb-btn-primary {
          background: var(--m-primary);
          color: #fff;
          border-radius: var(--m-radius-full);
          font-weight:600;
          transition: background 0.15s, box-shadow 0.15s;
          box-shadow: var(--m-elev-1);
        }
        .nb-btn-primary:hover { background: var(--m-primary-dark); box-shadow: var(--m-elev-2); }

        .nb-btn-tonal {
          background: var(--m-primary-container);
          color: var(--m-on-primary-container);
          border-radius: var(--m-radius-full);
          font-weight:600;
          transition: background 0.15s;
        }
        .nb-btn-tonal:hover { background: #DAD7FC; }

        /* ── search overlay ── */
        .nb-search-page {
          position: fixed; inset: 0; z-index: 101;
          display:flex; align-items:flex-start; justify-content:center;
          padding: 8vh 16px 0;
        }
        .nb-search-card {
          width:100%; max-width:640px;
          background: var(--m-surface);
          border-radius: var(--m-radius-xl);
          border: 1px solid var(--m-outline);
          box-shadow: var(--m-elev-3);
          overflow:hidden;
        }
        .nb-search-header {
          display:flex; align-items:center; gap:12px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--m-outline);
        }
        .nb-search-header input {
          flex:1; border:none; outline:none; background:transparent;
          font-size:15px; font-weight:500; color: var(--m-on-surface);
        }
        .nb-search-header input::placeholder { color: #9B98A8; }

        .nb-search-body { max-height: 65vh; overflow-y:auto; padding: 16px; }

        .nb-search-section-title {
          display:flex;align-items:center;gap:8px;
          font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
          color: var(--m-on-surface-variant);
          margin: 4px 4px 10px;
        }

        .nb-search-item {
          display:flex;align-items:center;gap:12px;
          padding:12px 14px;border-radius:14px;
          border:1px solid var(--m-outline);
          background: var(--m-surface);
          cursor:pointer;
          transition: background 0.15s, border-color 0.15s;
          margin-bottom:8px;
        }
        .nb-search-item:hover { background: var(--m-surface-container); border-color: var(--m-outline-strong); }

        .nb-search-item-icon {
          width:36px;height:36px;border-radius:10px;
          background: var(--m-surface-container);
          display:flex;align-items:center;justify-content:center;
          flex-shrink:0;
        }

        .nb-voice-btn {
          width:100%;
          display:flex;align-items:center;gap:14px;
          border-radius:18px;
          padding: 14px 16px;
          border: 1px solid var(--m-outline);
          background: var(--m-surface);
          transition: background 0.2s, border-color 0.2s;
        }
        .nb-voice-btn.listening { background: var(--m-primary-container); border-color: transparent; }
        .nb-voice-icon {
          width:44px;height:44px;border-radius:14px;
          display:flex;align-items:center;justify-content:center;
          background: var(--m-surface-container);
          flex-shrink:0;
        }
        .nb-voice-icon.listening { background: var(--m-primary); }

        /* ── location modal field ── */
        .nb-minput {
          background: var(--m-surface-container);
          border:1px solid var(--m-outline);
          color: var(--m-on-surface);
          border-radius:14px;font-size:13.5px;
        }
        .nb-minput::placeholder { color:#9B98A8; }
        .nb-minput:focus { outline:none;border-color: var(--m-primary); box-shadow: 0 0 0 3px var(--m-primary-container); }
      `}</style>

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <>
          <div
            className="fixed inset-0 z-[100]"
            style={{ background: "var(--m-scrim)" }}
            data-aos="fade"
            onClick={() => setSearchOpen(false)}
          />

          <div className="nb-search-page" data-aos="fade-up" data-aos-duration="250">
            <div className="nb-search-card" onClick={(e) => e.stopPropagation()}>
              <div className="nb-search-header">
                <Search size={18} style={{ color: "var(--m-on-surface-variant)" }} />
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearchSubmit(search); }}
                  placeholder="Search products, brands, categories..."
                />
                <span className="nb-kbd hidden sm:flex">ESC</span>
                <button onClick={() => setSearchOpen(false)} className="nb-ibtn">
                  <X size={16} />
                </button>
              </div>

              <div className="nb-search-body">
                <div className="mb-6">
                  <div className="nb-search-section-title"><Mic size={12} /> Voice search</div>
                  <button
                    onClick={handleVoiceSearch}
                    className={`nb-voice-btn ${isListening ? "listening" : ""}`}
                  >
                    <div className={`nb-voice-icon ${isListening ? "listening" : ""}`}>
                      <Mic size={17} className={isListening ? "text-white animate-pulse" : ""} style={{ color: isListening ? "#fff" : "var(--m-on-surface-variant)" }} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--m-on-surface)" }}>
                        {isListening ? "Listening..." : "Tap to speak"}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--m-on-surface-variant)" }}>Search using your voice</span>
                    </div>
                  </button>
                </div>

                {recentSearches.length > 0 && (
                  <div>
                    <div className="nb-search-section-title"><Search size={12} /> Recent searches</div>
                    {recentSearches.map((item, idx) => (
                      <button key={idx} onClick={() => handleSearchSubmit(item)} className="nb-search-item w-full text-left">
                        <div className="nb-search-item-icon">
                          <Search size={14} style={{ color: "var(--m-on-surface-variant)" }} />
                        </div>
                        <div className="flex-1 text-sm font-semibold truncate" style={{ color: "var(--m-on-surface)" }}>
                          {item}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setRecentSearches((prev) => prev.filter((s) => s !== item)); }}
                          className="nb-ibtn"
                          style={{ width: 30, height: 30 }}
                        >
                          <X size={13} style={{ color: "var(--m-on-surface-variant)" }} />
                        </button>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* MOBILE DRAWER OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30"
          style={{ background: "var(--m-scrim)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ════ NAVBAR ════ */}
      <header
        className={`nb fixed top-0 left-0 right-0 z-40 nb-bar ${scrolled ? "sc" : ""}`}
        style={{ transform: showNav ? "translateY(0)" : "translateY(-100%)", transition: "transform 0.3s ease" }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

          {/* LOGO + LOCATION */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link to="/" className=" hidden md:flex items-center">
              <img src="/logo.png" alt="Logo" className="h-9 w-auto object-contain" />
            </Link>
            <button className="hidden sm:flex nb-loc" onClick={(e) => { e.stopPropagation(); onOpen(); }}>
              <MapPinned size={14} />
              <span className="loc-txt">{locationLabel}</span>
              <ChevronDown size={14} />
            </button>
          </div>

          {/* SEARCH (desktop) */}
          <div className="hidden md:flex flex-1 max-w-[480px]">
            <button onClick={() => setSearchOpen(true)} className="nb-search-trigger">
              <Search size={16} style={{ color: "var(--m-on-surface-variant)" }} />
              <span className="text-sm" style={{ color: "#9B98A8" }}>Search products...</span>
              <div className="ml-auto hidden lg:flex nb-kbd">⌘K</div>
            </button>
          </div>

          {/* NAV LINKS + ICONS (desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ name, path, icon }) => (
              <NavLink key={path} to={path} className={({ isActive }) => `nb-link ${isActive ? "act" : ""}`}>
                {icon}{name}
              </NavLink>
            ))}

            <div className="w-px h-5 mx-2" style={{ background: "var(--m-outline)" }} />

            <Link to="/cart" className="nb-ibtn">
              <ShoppingCart size={19} />
              {cartItem.length > 0 && <span className="nb-badge">{cartItem.length}</span>}
            </Link>

            <Link to="/wishlist" className="nb-ibtn ml-1">
              <Heart size={19} />
              {wishlist.length > 0 && <span className="nb-badge">{wishlist.length}</span>}
            </Link>

            <div className="ml-2">
              {!authUser ? (
                <button onClick={() => navigate("/sign-in")} className="nb-btn-tonal flex items-center gap-2 px-4 py-2 text-sm">
                  <User size={15} /> Sign in
                </button>
              ) : (
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <button
                      className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all"
                      style={{ borderColor: "var(--m-outline)", background: "var(--m-surface)" }}
                    >
                      <img src={authUser?.image} alt={authUser?.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                      <span className="hidden lg:block text-xs font-semibold" style={{ color: "var(--m-on-surface)" }}>
                        {authUser.name}
                      </span>
                      <ChevronDown size={14} style={{ color: "var(--m-on-surface-variant)" }} />
                    </button>
                  </DropdownTrigger>

                  <DropdownMenu
                    aria-label="Profile Actions"
                    variant="flat"
                    classNames={{
                      base: "min-w-[240px] rounded-[20px] border p-2",
                      list: "gap-1",
                    }}
                    style={{ borderColor: "var(--m-outline)", background: "var(--m-surface)", boxShadow: "var(--m-elev-2)" }}
                  >
                    <DropdownItem key="profile" onPress={() => navigate("/profile")} startContent={<User size={16} />}>
                      Profile
                    </DropdownItem>
                    <DropdownItem key="orders" onPress={() => navigate("/order-history")} startContent={<Package size={16} />}>
                      Orders
                    </DropdownItem>
                    <DropdownItem key="track" onPress={() => navigate("/track-order")} startContent={<Truck size={16} />}>
                      Track order
                    </DropdownItem>
                    <DropdownItem
                      key="logout"
                      className="text-red-600"
                      color="danger"
                      onPress={logout}
                      startContent={<LogOut size={16} />}
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
            <button onClick={() => setSearchOpen(true)} className="nb-search-trigger flex-1 max-w-[150px]">
              <Search size={14} style={{ color: "var(--m-on-surface-variant)" }} />
              <span className="text-xs truncate" style={{ color: "#9B98A8" }}>Search...</span>
            </button>

            {/* <button className="nb-loc" onClick={(e) => { e.stopPropagation(); onOpen(); }} style={{ maxWidth: 110 }}>
              <MapPinned size={13} />
              <ChevronDown size={12} />
            </button> */}

            <Link to="/cart" className="nb-ibtn">
              <ShoppingCart size={19} />
              {cartItem.length > 0 && <span className="nb-badge">{cartItem.length}</span>}
            </Link>

            <Link to="/wishlist" className="nb-ibtn">
              <Heart size={19} />
              {wishlist.length > 0 && <span className="nb-badge">{wishlist.length}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* ════ LOCATION MODAL ════ */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="center"
        backdrop="blur"
        classNames={{ backdrop: "bg-black/40" }}
        hideCloseButton
        className="z-[9999]"
      >
        <ModalContent
          className="nb relative rounded-[28px] overflow-hidden max-w-lg w-[95%]"
          style={{ background: "var(--m-surface)", border: "1px solid var(--m-outline)", boxShadow: "var(--m-elev-3)" }}
        >
          {(onModalClose) => (
            <>
              <button
                onClick={onModalClose}
                className="absolute top-4 right-4 nb-ibtn"
                style={{ width: 32, height: 32, background: "var(--m-surface-container)" }}
              >
                <X size={14} />
              </button>

              <ModalHeader className="flex flex-col items-center gap-2 pb-5 pt-8 border-b" style={{ borderColor: "var(--m-outline)" }}>
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: "var(--m-primary-container)" }}
                >
                  <LocateFixed size={16} style={{ color: "var(--m-on-primary-container)" }} />
                </div>
                <h2 className="font-bold text-base" style={{ color: "var(--m-on-surface)" }}>Set delivery location</h2>
                <p className="text-xs" style={{ color: "var(--m-on-surface-variant)" }}>
                  Choose your address to check delivery availability
                </p>

                <div
                  className="mt-2 w-full flex items-start gap-3 rounded-2xl px-4 py-3"
                  style={{ background: "var(--m-surface-container)" }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--m-surface)", border: "1px solid var(--m-outline)" }}
                  >
                    <MapPinned size={16} style={{ color: "var(--m-primary)" }} />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--m-on-surface-variant)" }}>
                      Current location
                    </p>
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--m-on-surface)" }}>
                      {locationLabel}
                    </p>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody className="py-5 space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 relative flex items-center">
                    <span className="absolute left-3 pointer-events-none">
                      <LocateFixed size={15} style={{ color: "var(--m-on-surface-variant)" }} />
                    </span>
                    <input
                      type="text"
                      placeholder="City, area or pincode"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAreaSearch()}
                      className="nb-minput w-full pl-9 pr-3 py-2.5"
                    />
                  </div>
                  <button onClick={handleAreaSearch} className="nb-btn-primary flex items-center gap-1.5 px-4 py-2.5 text-sm flex-shrink-0">
                    <Search size={13} /> Search
                  </button>
                </div>

                <button
                  onClick={() => { handleUseMyLocation(); onClose(); }}
                  className="nb-btn-tonal w-full flex items-center justify-center gap-2 py-2.5 text-sm"
                >
                  <MapPin size={13} /> Use current location
                </button>

                <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--m-outline)" }}>
                  <LocationMap onSelect={(lat, lng) => { onLocationChange(lat, lng); onClose(); }} />
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ════ MOBILE DRAWER ════ */}
      <aside
        className={`nb nb-drawer fixed top-0 left-0 h-full w-72 z-50 transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--m-outline)" }}>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--m-primary)" }}>
              <span className="text-white text-sm font-bold">E</span>
            </div>
            <span className="text-lg font-bold" style={{ color: "var(--m-on-surface)" }}>EShop</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="nb-ibtn">
            <X size={16} />
          </button>
        </div>

        <div className="px-4 pt-4">
          <button
            onClick={() => { onOpen(); setMobileOpen(false); }}
            className="nb-loc w-full flex text-left px-3 py-2.5 text-sm"
            style={{ maxWidth: "100%" }}
          >
            <MapPinned size={15} />
            <span className="truncate flex-1 text-xs">{locationLabel}</span>
            <ChevronDown size={13} />
          </button>
        </div>

        <nav className="px-4 pt-4 space-y-1">
          {[
            { name: "Home", path: "/", icon: <Home size={17} /> },
            { name: "Orders", path: "/order-history", icon: <ShoppingCart size={17} /> },
            { name: "Track order", path: "/track-order", icon: <Truck size={17} /> },
          ].map(({ name, path, icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `nb-dlink ${isActive ? "dact" : ""}`}
            >
              {icon}{name}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4 flex gap-3">
          <Link
            to="/cart"
            onClick={() => setMobileOpen(false)}
            className="nb-btn-primary flex-1 flex items-center justify-center gap-2 py-3 text-sm"
          >
            <ShoppingCart size={15} />
            Cart
            {cartItem.length > 0 && (
              <span className="bg-white/25 px-1.5 py-0.5 rounded-full text-[10px] font-bold">{cartItem.length}</span>
            )}
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setMobileOpen(false)}
            className="nb-btn-tonal flex-1 flex items-center justify-center gap-2 py-3 text-sm"
          >
            <Heart size={15} />
            Wishlist
            {wishlist.length > 0 && (
              <span className="bg-white/60 px-1.5 py-0.5 rounded-full text-[10px] font-bold">{wishlist.length}</span>
            )}
          </Link>
        </div>
      </aside>

      {/* ════ BOTTOM NAV (Material 3) ════ */}
      <div
        className="nb sm:hidden fixed bottom-0 left-0 right-0 z-40 nb-bottom"
        style={{
          transform: showNav ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s ease",
        }}
      >
        <div className="flex items-center justify-around px-1 py-2">
          {BOTTOM_LINKS.map(({ name, path, icon: Icon }) => (
            <NavLink key={path} to={path} className={({ isActive }) => `nb-blink ${isActive ? "bact" : ""}`}>
              <span className="nb-bpill"><Icon size={19} /></span>
              {name}
            </NavLink>
          ))}

          <button
            onClick={() => navigate(authUser ? "/profile" : "/sign-in")}
            className={`nb-blink ${routerLocation.pathname === "/profile" ? "bact" : ""}`}
          >
            <span className="nb-bpill">
              {authUser?.image ? (
                <img src={authUser.image} alt="profile" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <User size={19} />
              )}
            </span>
            Profile
          </button>
        </div>
      </div>
    </>
  );
}