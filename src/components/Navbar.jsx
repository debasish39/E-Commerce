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

  return (
    <>


      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-slate-950/45 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />

          <div className="fixed inset-0 z-[101] flex items-start justify-center px-3 pt-[8vh] sm:px-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.18)]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 border-b border-slate-200 p-3">
                <Search size={18} className="shrink-0 text-slate-500" />
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearchSubmit(search); }}
                  placeholder="Search products, brands, categories..."
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                />
                <span className="hidden h-6 min-w-8 items-center justify-center rounded-md border border-slate-200 bg-white px-1.5 text-[9px] font-extrabold text-slate-500 shadow-sm sm:flex">ESC</span>
                <button aria-label="Close search" onClick={() => setSearchOpen(false)} className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10">
                  <X size={16} />
                </button>
              </div>

              <div className="max-h-[66vh] overflow-y-auto p-4">
                <div className="mb-6">
                  <div className="mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.08em] text-slate-500"><Mic size={12} /> Voice search</div>
                  <button
                    onClick={handleVoiceSearch}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${isListening ? "border-indigo-200 bg-indigo-50" : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50"}`}
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isListening ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                      <Mic size={17} className={isListening ? "animate-pulse text-white" : "text-slate-500"} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[13.5px] font-semibold text-slate-900">
                        {isListening ? "Listening..." : "Tap to speak"}
                      </span>
                      <span className="text-xs text-slate-500">Search using your voice</span>
                    </div>
                  </button>
                </div>

                {recentSearches.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.08em] text-slate-500"><Search size={12} /> Recent searches</div>
                    {recentSearches.map((item, idx) => (
                      <div key={idx} className="mb-2 flex w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                          <span className="text-indigo-600"><Search size={14} /></span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSearchSubmit(item)}
                          className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-slate-900"
                        >
                          {item}
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove ${item} from recent searches`}
                          onClick={() => setRecentSearches((prev) => prev.filter((s) => s !== item))}
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <X size={13} />
                        </button>
                      </div>
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
          className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-[2px]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ════ NAVBAR ════ */}
      <header
        className={`fixed inset-x-0 top-0 z-40 px-2 pt-2 transition-transform duration-300 sm:px-3 ${showNav ? "translate-y-0" : "-translate-y-full"}`}
        
      >
        <div
          className={`mx-auto flex min-h-[64px] max-w-7xl items-center justify-between gap-3 rounded-2xl border px-3.5 shadow-sm backdrop-blur-xl transition-all duration-300 sm:px-4 ${
            scrolled
              ? "border-indigo-100/80 bg-white/95 shadow-[0_12px_35px_rgba(15,23,42,0.09)]"
              : "border-slate-200/70 bg-white/90 shadow-[0_8px_25px_rgba(15,23,42,0.06)]"
          }`}
        >

          {/* LOGO + LOCATION */}
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
            <Link to="/" className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 md:hidden">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
            </Link>
            <Link to="/" className="group hidden h-10 items-center justify-center rounded-xl px-2 transition hover:bg-indigo-50 md:flex">
              <img src="/logo.png" alt="Logo" className="h-9 w-auto object-contain" />
            </Link>
            <button
              type="button"
              aria-label={`Choose delivery location: ${locationLabel}`}
              onClick={(e) => { e.stopPropagation(); onOpen(); }}
              className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-indigo-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-md sm:w-auto sm:max-w-[190px] sm:gap-2 sm:rounded-xl sm:bg-slate-50/80 sm:px-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition group-hover:bg-white">
                <MapPinned size={16} />
              </span>
              <span className="hidden min-w-0 truncate text-[11px] font-bold text-slate-600 sm:block">
                {locationLabel}
              </span>
              <ChevronDown size={13} className="hidden shrink-0 text-slate-400 sm:block" />
            </button>
          </div>

          {/* SEARCH (desktop) */}
          <div className="hidden md:flex flex-1 max-w-[480px]">
            <button onClick={() => setSearchOpen(true)} className="group flex h-11 w-full items-center gap-2.5 rounded-xl border border-transparent bg-slate-50 px-3 text-left text-slate-500 transition-all duration-200 hover:border-indigo-100 hover:bg-indigo-50/70 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm"><Search size={15} /></span>
              <span className="text-sm" style={{ color: "#9B98A8" }}>Search products...</span>
              <div className="ml-auto hidden h-6 min-w-8 items-center justify-center rounded-md border border-slate-200 bg-white px-1.5 text-[9px] font-extrabold text-slate-500 shadow-sm lg:flex">⌘K</div>
            </button>
          </div>

          {/* NAV LINKS + ICONS (desktop) */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(({ name, path, icon }) => (
              <NavLink key={path} to={path} className={({ isActive }) => `group relative inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-[11px] font-extrabold transition-all duration-200 ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"}`}>
                {icon}{name}
              </NavLink>
            ))}

            <div className="mx-2 h-6 w-px bg-slate-200" />

            <Link to="/cart" className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10">
              <ShoppingCart size={19} />
              {cartItem.length > 0 && <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-indigo-600 px-1 text-[8px] font-black leading-none text-white shadow-md shadow-indigo-200">{cartItem.length}</span>}
            </Link>

            <Link to="/wishlist" className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10">
              <Heart size={19} />
              {wishlist.length > 0 && <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-indigo-600 px-1 text-[8px] font-black leading-none text-white shadow-md shadow-indigo-200">{wishlist.length}</span>}
            </Link>

            <div className="ml-2">
              {!authUser ? (
                <button onClick={() => navigate("/sign-in")} className="flex h-10 items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 text-xs font-extrabold text-indigo-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-100 hover:shadow-md">
                  <User size={15} /> Sign in
                </button>
              ) : (
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <button
                      className="group flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50"
                      style={{ borderColor: "#e2e8f0", background: "#ffffff" }}
                    >
                      <img src={authUser?.image} alt={authUser?.name} className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm" />
                      <span className="hidden lg:block text-xs font-semibold text-slate-900">
                        {authUser.name}
                      </span>
                      <ChevronDown size={14} className="text-slate-500" />
                    </button>
                  </DropdownTrigger>

                  <DropdownMenu
                    aria-label="Profile Actions"
                    variant="flat"
                    classNames={{
                      base: "min-w-[240px] rounded-[20px] border p-2",
                      list: "gap-1",
                    }}
                    style={{ borderColor: "#e2e8f0", background: "#ffffff", boxShadow: "0 10px 30px rgba(15,23,42,.08)" }}
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
            <button onClick={() => setSearchOpen(true)} className="flex h-10 min-w-0 max-w-[150px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/70">
              <span className="shrink-0 text-indigo-600"><Search size={14} /></span>
              <span className="text-xs truncate truncate text-xs text-slate-400">Search...</span>
            </button>

            {/* <button className="" onClick={(e) => { e.stopPropagation(); onOpen(); }} style={{ maxWidth: 110 }}>
              <MapPinned size={13} />
              <ChevronDown size={12} />
            </button> */}

            <Link to="/cart" className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10">
              <ShoppingCart size={19} />
              {cartItem.length > 0 && <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-indigo-600 px-1 text-[8px] font-black leading-none text-white shadow-md shadow-indigo-200">{cartItem.length}</span>}
            </Link>

            <Link to="/wishlist" className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10">
              <Heart size={19} />
              {wishlist.length > 0 && <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-indigo-600 px-1 text-[8px] font-black leading-none text-white shadow-md shadow-indigo-200">{wishlist.length}</span>}
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
          className="relative w-[95%] max-w-lg overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.18)]"

        >
          {(onModalClose) => (
            <>
              <button
                onClick={onModalClose}
                className="absolute right-4 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                
              >
                <X size={14} />
              </button>

              <ModalHeader className="flex flex-col items-center gap-2 border-b border-slate-200 px-4 pb-5 pt-7 sm:px-6 sm:pt-8">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center bg-indigo-50"
                >
                  <LocateFixed size={16} style={{ color: "#3730a3" }} />
                </div>
                <h2 className="font-bold text-base text-slate-900">Set delivery location</h2>
                <p className="text-xs text-slate-500">
                  Choose your address to check delivery availability
                </p>

                <div
                  className="mt-2 flex w-full min-w-0 items-start gap-3 rounded-2xl bg-slate-50 px-3 py-3 sm:px-4"
                  
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}
                  >
                    <MapPinned size={16} className="text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Current location
                    </p>
                    <p className="text-sm font-semibold truncate text-slate-900">
                      {locationLabel}
                    </p>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody className="py-5 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex-1 relative flex items-center">
                    <span className="absolute left-3 pointer-events-none">
                      <LocateFixed size={15} className="text-slate-500" />
                    </span>
                    <input
                      type="text"
                      placeholder="City, area or pincode"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAreaSearch()}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                  <button onClick={handleAreaSearch} className="flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 sm:w-auto">
                    <Search size={13} /> Search
                  </button>
                </div>

                <button
                  onClick={() => { handleUseMyLocation(); onClose(); }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-50 py-2.5 text-sm font-extrabold text-indigo-700 transition hover:bg-indigo-100"
                >
                  <MapPin size={13} /> Use current location
                </button>

                <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "#e2e8f0" }}>
                  <div className="h-full w-full">
                     <LocationMap onSelect={(lat, lng) => { onLocationChange(lat, lng); onClose(); }} />
                   </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ════ MOBILE DRAWER ════ */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[290px] border-r border-slate-200 bg-white shadow-[20px_0_55px_rgba(15,23,42,0.14)] transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#e2e8f0" }}>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-600">
              <span className="text-white text-sm font-bold">E</span>
            </div>
            <span className="text-lg font-bold text-slate-900">Odikart</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10">
            <X size={16} />
          </button>
        </div>

        <div className="px-4 pt-4">
          <button
            onClick={() => { onOpen(); setMobileOpen(false); }}
            className="flex w-full min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-sm text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
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
              className={({ isActive }) => ` ${isActive ? "dact" : ""}`}
            >
              {icon}{name}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4 flex gap-3">
          <Link
            to="/cart"
            onClick={() => setMobileOpen(false)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5"
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
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-50 py-3 text-sm font-extrabold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-100"
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
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 shadow-[0_-10px_30px_rgba(15,23,42,0.07)] backdrop-blur-xl sm:hidden"
        style={{
          transform: showNav ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s ease",
        }}
      >
        <div className="flex items-center justify-around px-1 py-2">
          {BOTTOM_LINKS.map(({ name, path, icon: Icon }) => (
            <NavLink key={path} to={path} className={({ isActive }) => `flex min-w-[55px] flex-col items-center gap-1 text-[9px] font-bold transition ${isActive ? "text-indigo-700" : "text-slate-500"}`}>
              <span className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${routerLocation.pathname === path ? "bg-indigo-50" : "group-hover:bg-indigo-50"}`}><Icon size={19} /></span>
              {name}
            </NavLink>
          ))}

          <button
            onClick={() => navigate(authUser ? "/profile" : "/sign-in")}
            className={`flex min-w-[55px] flex-col items-center gap-1 text-[9px] font-bold transition ${routerLocation.pathname === "/profile" ? "text-indigo-700" : "text-slate-500"}`}
          >
            <span className="flex h-7 w-12 items-center justify-center rounded-full">
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