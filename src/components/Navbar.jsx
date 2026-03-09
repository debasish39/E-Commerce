import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  MapPin,
  ChevronDown,
  Home,
  ShoppingBag,
  Package,
  Phone,
  Search,
  Mic,
  MicOff, X
} from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { FaRegUserCircle, FaUser } from "react-icons/fa";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import { AiOutlineHeart } from "react-icons/ai";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/wishlistContext";
import AOS from "aos";
import "aos/dist/aos.css";
import { getData } from "../context/DataContext";
import OrderHistory from "../pages/OrderHistory";
import { useUser } from "@clerk/clerk-react";
import LocationMap from "../components/LocationMap";
import { toast } from "sonner";
export default function Navbar({ location, onLocationChange }) {
  const { user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { cartItem } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const { search, setSearch } = getData();
  const [showNavbar, setShowNavbar] = useState(true);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [area, setArea] = useState("");
const handleAreaSearch = async () => {
  if (!area) {
    toast.warning("Please enter a location");
    return;
  }

  const loadingToast = toast.loading("Searching location...");

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${area}`
    );

    const data = await res.json();

    if (data.length > 0) {
      const lat = data[0].lat;
      const lon = data[0].lon;

      onLocationChange(lat, lon);
      onClose();

      toast.dismiss(loadingToast);
      toast.success("Location found successfully");
    } else {
      toast.dismiss(loadingToast);
      toast.error("Location not found");
    }
  } catch (error) {
    console.error(error);
    toast.dismiss(loadingToast);
    toast.error("Something went wrong");
  }
};
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US"; // Change to hi-IN if needed
    recognition.interimResults = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearch(transcript);
      navigate("/products");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };
  };
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scroll Down
        setShowNavbar(false);
        setShowBottomNav(false);
      } else {
        // Scroll Up
        setShowNavbar(true);
        setShowBottomNav(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate("/products");
      setIsMobileNavOpen(false);
    }
  };


  //   useEffect(() => {
  //     AOS.init({ duration: 700, easing: "ease-out", once: false });
  //   }, []);

  // Disable body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = isMobileNavOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileNavOpen]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationChange(position.coords.latitude, position.coords.longitude);
        onClose();
      },
      (error) => {
        alert("Failed to get location: " + error.message);
      }
    );
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <Home className="h-4 w-4 text-red-500" /> },
    { name: "Products", path: "/products", icon: <Package className="h-4 w-4 text-red-500" /> },
    { name: "Contact", path: "/contact", icon: <Phone className="h-4 w-4 text-red-500" /> },
    { name: "Orders", path: "/order-history", icon: <ShoppingBag className="h-4 w-4 text-red-500" /> },
  ];

  const renderLocation = () => (
    <div
      className="flex items-center gap-1 text-gray-300 text-sm relative cursor-pointer hover:text-red-400 transition"
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      data-aos="fade-up"
    >
      <MapPin className="h-4 w-4 text-red-500" />
      <span className="font-semibold max-w-[150px] truncate">
        {location ? (
          <>
            {location.village ||
              location.town ||
              location.city ||
              location.suburb ||
              location.county ||
              location.state_district}
            , {location.state}, {location.country}
          </>
        ) : (
          "Add Location"
        )}
      </span>
      <ChevronDown className="ml-1 transition-transform" />
    </div>
  );

  return (
    <>
      {/* Background overlay for mobile menu */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => setIsMobileNavOpen(false)}
          data-aos="fade-in"
        ></div>
      )}

      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 
  bg-black/10 backdrop-blur-md border-b border-red-600/50 
  py-3 shadow-[0_2px_66px_rgba(255,80,80,0.25)]
  transition-transform duration-300 ease-in-out
  ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
        data-aos="fade-down"
        onClick={() => onClose()}
      >

        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo + Location */}
          <div className="flex items-center gap-4" data-aos="zoom-in">
            <Link
              to="/"
              className="text-[24px] sm:text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-300 bg-clip-text text-transparent drop-shadow-[3px_3px_30px_red]"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              E-Shop
            </Link>
            <div className="hidden md:flex">{renderLocation()}</div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-6" data-aos="fade-left">
            <div className="relative flex items-center">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search products..."
                className="bg-black/10 border border-orange-700/60 
    text-white rounded-xl pl-5 pr-20 py-2.5 text-sm
    focus:outline-none focus:ring-1 focus:ring-red-900
    backdrop-blur-md transition w-56 focus:w-72"
              />



              {/* 🎙 Mic Button */}
              <button
                onClick={handleVoiceSearch}
                className={`absolute right-4 transition-all duration-300 cursor-pointer ${isListening
                  ? "text-red-500 animate-pulse scale-110"
                  : "text-gray-400 hover:text-red-400"
                  }`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            </div>

            <ul className="flex gap-6 font-medium">
              {navLinks.map(({ name, path, icon }) => (
                <li key={name} className="relative group">
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `flex items-center gap-1 pb-1 transition-all duration-300 ${isActive
                        ? "text-red-400 font-bold"
                        : "text-gray-300 hover:text-red-400 font-medium"
                      }`
                    }
                  >
                    {icon} {name}
                  </NavLink>
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-[2px] bg-red-400 transition-all duration-300 group-hover:w-full ${window.location.pathname === path ? "w-full" : "w-0"
                      }`}
                  ></span>
                </li>
              ))}
            </ul>

            {/* Cart */}
            <Link to="/cart" className="relative" data-aos="fade-left">
              <ShoppingCart className="h-6 w-6 text-gray-300 hover:text-red-400 transition" />
              <span className="absolute -top-2 -right-2 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                {cartItem.length}
              </span>
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative" data-aos="fade-left">
              <AiOutlineHeart className="h-6 w-6 text-gray-300 hover:text-red-400 transition" />
              <span className="absolute -top-2 -right-2 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            </Link>

            {/* Auth */}
            <div className="ml-4" data-aos="fade-left">

              <SignedOut>
                <button
                  onClick={() => navigate("/sign-in")}
                  className="flex flex-col sm:flex-row items-center gap-1 text-white hover:text-red-500 transition cursor-pointer"
                >
                  <FaRegUserCircle className="h-5 sm:h-6 w-5 mb-1 sm:w-6" />
                  <span className="text-[11px] md:hidden"> Account</span>
                </button>
              </SignedOut>

              <SignedIn>
                <div className="flex flex-col items-center">
                  {user && (
                    <img
                      src={user.imageUrl}
                      alt="profile"
                      onClick={() => navigate("/profile")}
                      className="h-8 w-8 rounded-full ring-1 ring-red-500 cursor-pointer"
                    />
                  )}
                  <span className="text-[11px] mt-1s md:hidden">Profile</span>
                </div>
              </SignedIn>
            </div>
          </nav>

          {/* Mobile Nav + Cart + Auth */}
          <div className="md:hidden flex items-center justify-center gap-4" data-aos="fade-right">
            <div className="relative flex items-center w-full">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search products..."
                className="w-60 bg-black/10 border border-orange-700/60 
    text-white rounded-xl pl-5 pr-20 py-2.5 text-sm
    focus:outline-none focus:ring-1 focus:ring-red-900
    backdrop-blur-md transition"
              />


              <button
                onClick={handleVoiceSearch}
                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer ${isListening
                  ? "text-red-500 animate-pulse scale-110"
                  : "text-gray-400 hover:text-red-400"
                  }`}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            </div>



            {/* Toggle */}
            {isMobileNavOpen ? (
              <HiMenuAlt3
                onClick={() => setIsMobileNavOpen(false)}
                className="h-7 w-7 text-gray-300 hover:text-red-400 cursor-pointer"
              />
            ) : (
              <HiMenuAlt1
                onClick={() => setIsMobileNavOpen(true)}
                className="h-7 w-7 text-gray-300 hover:text-red-400 cursor-pointer"
              />
            )}
          </div>
        </div>
      </header>

      {/* Location Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="top-center"
        backdrop="blur"
           classNames={{
          body: "py-6",
          backdrop: "bg-black/60 backdrop-opacity-40",
          
        }}
        hideCloseButton
        className="z-[9999]"
      >
        <ModalContent
          className="
    relative bg-gradient-to-br from-black/70 via-black/60 to-gray-900/90
    backdrop-blur-3xl border border-white/10
    rounded-3xl shadow-[0_0_45px_rgba(255,70,70,0.35)]
    text-gray-200 overflow-hidden
    max-w-lg w-[95%]"
        >
          {(onClose) => (
            <>
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6
w-9 h-9 flex items-center justify-center
rounded-full
bg-white/10
hover:bg-red-500/70
active:bg-red-500/70
focus:bg-red-500/70
text-gray-300
hover:text-white
active:text-white
focus:text-white
transition duration-200 cursor-pointer"
              >
                <X size={33} />
              </button>
              {/* HEADER */}
              <ModalHeader
                className="
          flex flex-col items-center gap-2
          border-b border-white/10
          pb-5 pt-6
        "
              >
                <div
                  className="
            h-12 w-12 flex items-center justify-center
            rounded-xl bg-red-500/20 border border-red-500/30
            shadow-[0_0_10px_rgba(255,70,70,0.4)]
          "
                >
                  <MapPin className="text-red-400" size={22} />
                </div>

                <h2 className="text-lg font-semibold text-white">
                  Set Delivery Location
                </h2>

                <p className="text-xs text-gray-400">
                  Choose your address to check delivery availability
                </p>
              </ModalHeader>

              {/* BODY */}
              <ModalBody className="space-y-1 py-2">

                {/* Search Input */}
                <div className="flex gap-2">

                  <div
                    className="
              flex items-center gap-2
              flex-1 px-3 py-2
              rounded-xl
              bg-black/40 border border-white/10
              focus-within:border-red-400
              transition"
                  >
                    <MapPin size={16} className="text-gray-400" />

                    <input
                      type="text"
                      placeholder="Search city, area or pincode"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="
                flex-1 bg-transparent
                text-sm text-white
                outline-none placeholder-gray-400"
                    />
                  </div>

                  <button
                    onClick={handleAreaSearch}
                    className="
              px-3 py-1 rounded-xl
              bg-gradient-to-r from-red-500 to-black/30 border border-red-500/40
              text-gray-300 font-medium text-sm
              shadow-md
              hover:scale-105 active:scale-95
              transition cursor-pointer"
                  >
                    Search
                  </button>

                </div>


                {/* Detect location button */}
                <button
                  onClick={() => {
                    handleUseMyLocation();
                    onClose();
                  }}
                  className="
            flex items-center justify-center gap-2
            w-full py-2
            rounded-xl
            border border-red-500/40
            bg-red-500/10
            text-red-300 font-medium
            hover:bg-red-500/20
            transition"
                >
                  <MapPin size={16} />
                  Detect My Location
                </button>


                {/* MAP SECTION */}
                <div
                  className="
            rounded-2xl overflow-hidden
            border border-white/10
            shadow-lg
            bg-black/30 mb-3"
                >
                  <LocationMap
                    onSelect={(lat, lng) => {
                      onLocationChange(lat, lng);
                      onClose();
                    }}
                  />
                </div>

              </ModalBody>


            </>
          )}
        </ModalContent>
      </Modal>
      {/* Mobile Offcanvas Menu */}
      <aside
        className={`md:hidden fixed min-h-screen top-0 left-0 w-3/4 max-w-xs h-full 
        bg-black/70 backdrop-blur-lg border-r border-red-500/40 rounded-r-2xl 
        transform transition-transform z-49 duration-300 ease-in-out 
        ${isMobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
        data-aos="fade-right"
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-red-500/40">
          <h2
            className="text-lg font-bold bg-gradient-to-r from-red-400 to-orange-300 bg-clip-text text-transparent"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            E-Shop
          </h2>
        </div>

        <div className="flex flex-col justify-between h-full">
          <div className="p-4 space-y-4 overflow-y-auto">
            {renderLocation()}

            <NavLink
              to="/order-history"
              onClick={() => setIsMobileNavOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-2 w-full px-3 py-2 rounded-md border-l-4 transition ${isActive
                  ? "text-red-400 border-red-500 bg-red-500/10 font-semibold"
                  : "text-gray-300 hover:text-red-400 hover:bg-white/10 border-transparent"
                }`
              }
            >
              <Package size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
              <span>Order History</span>
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setIsMobileNavOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-2 w-full px-3 py-2 rounded-md border-l-4 transition ${isActive
                  ? "text-red-400 border-red-500 bg-red-500/10 font-semibold"
                  : "text-gray-300 hover:text-red-400 hover:bg-white/10 border-transparent"
                }`
              }
            >
              <Phone size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
              <span>Contact</span>
            </NavLink>
            {/* 
<NavLink
  to="/profile"
  onClick={() => setIsMobileNavOpen(false)}
  className={({ isActive }) =>
    `group flex items-center gap-2 w-full px-3 py-2 rounded-md border-l-4 transition ${
      isActive
        ? "text-red-400 border-red-500 bg-red-500/10 font-semibold"
        : "text-gray-300 hover:text-red-400 hover:bg-white/10 border-transparent"
    }`
  }
>
  <User size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
  <span>My Profile</span>
</NavLink> */}

          </div>
        </div>
      </aside>
      {/* ================= MOBILE BOTTOM NAVBAR ================= */}
      <div
        className={`sm:hidden fixed bottom-3 rounded-3xl left-1/2 -translate-x-1/2 
  w-[93%] max-w-md z-48
  bg-black/50 backdrop-blur-2xl 
  shadow-[0_3px_12px_red]
  transition-transform duration-300 ease-in-out
  ${showBottomNav ? "translate-y-0" : "translate-y-24"}`}
      >
        <div className="flex justify-between items-center px-4 py-2.5">

          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs transition-all duration-300
        ${isActive ? "text-red-400 scale-110" : "text-gray-400 hover:text-red-400"}`
            }
          >
            <Home className="h-5 w-5 mb-1" />
            Home
          </NavLink>

          {/* Products */}
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs transition-all duration-300
        ${isActive ? "text-red-400 scale-110" : "text-gray-400 hover:text-red-400"}`
            }
          >
            <Package className="h-5 w-5 mb-1" />
            Products
          </NavLink>

          {/* Floating Cart Button */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative -mt-6 flex flex-col items-center justify-center
    h-14 w-14 rounded-full
    bg-gradient-to-r from-red-600 to-black/50
    shadow-[0_8px_25px_rgba(255,80,80,0.5)]
    transition-all duration-300
    ${isActive ? "scale-110" : "hover:scale-105"}`
            }
          >
            <ShoppingCart className="h-6 w-6 text-gray-300" />

            <span
              className={`absolute -top-1 -right-1
    min-w-[18px] h-5 px-1 text-[10px]
    rounded-full flex items-center justify-center
    shadow-md
    ${cartItem.length > 0
                  ? "bg-red-500 text-white"
                  : "bg-gray-600 text-gray-300"
                }`}
            >
              {cartItem.length}
            </span>
          </NavLink>

          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `relative flex flex-col items-center text-xs transition-all duration-300
    ${isActive ? "text-red-400 scale-110" : "text-gray-400 hover:text-red-400"}`
            }
          >
            <div className="relative">
              <AiOutlineHeart className="h-5 w-5 mb-1" />

              <span
                className={`absolute -top-2 -right-3
      min-w-[18px] h-5 px-1
      text-[10px] font-semibold
      rounded-full flex items-center justify-center
      shadow-md border border-black
      ${wishlist.length > 0
                    ? "bg-red-500 text-white"
                    : "bg-gray-600 text-gray-300"
                  }`}
              >
                {wishlist.length}
              </span>
            </div>

            Wishlist
          </NavLink>
          {/* Account */}
          <div className="flex flex-col items-center text-xs text-gray-400">

            <SignedOut>
              <button
                onClick={() => navigate("/sign-in")}
                className="flex flex-col items-center gap-1 text-gray-450 "
              >
                <FaRegUserCircle className="h-5 w-5 mb-1" />
                Account
              </button>
            </SignedOut>

            <SignedIn>
              <div className="flex flex-col items-center">
                {user && (
                  <img
                    src={user.imageUrl}
                    alt="profile"
                    onClick={() => navigate("/profile")}
                    className="h-8 w-8 rounded-full ring-2 ring-red-500 cursor-pointer"
                  />
                )}
                <span className="text-[11px] mt-1">Profile</span>
              </div>
            </SignedIn>

          </div>

        </div>
      </div>


    </>
  );
}
