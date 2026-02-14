import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  MapPin,
  ChevronDown,
  Home,
  ShoppingBag,
  Package,
  Phone, Search, User
} from "lucide-react";
import { FaSignInAlt } from "react-icons/fa";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import { AiOutlineHeart } from "react-icons/ai";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/wishlistContext";
import AOS from "aos";
import "aos/dist/aos.css";
import { getData } from "../context/DataContext";
import OrderHistory from "../pages/OrderHistory";

export default function Navbar({ location, onLocationChange }) {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { cartItem } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const { search, setSearch } = getData();
  const [showNavbar, setShowNavbar] = useState(true);
  const [showBottomNav, setShowBottomNav] = useState(true);
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
        setIsLocationModalOpen(false);
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
        setIsLocationModalOpen(true);
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setIsMobileNavOpen(false)}
          data-aos="fade-in"
        ></div>
      )}

      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 
  bg-black/40 backdrop-blur-md border-b border-red-600/50 
  py-3 shadow-[0_2px_20px_rgba(255,80,80,0.25)]
  transition-transform duration-300 ease-in-out
  ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
        data-aos="fade-down"
        onClick={() => setIsLocationModalOpen(false)}
      >

        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo + Location */}
          <div className="flex items-center gap-4" data-aos="zoom-in">
            <Link
              to="/"
              className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,99,71,0.6)]"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              E-Shop
            </Link>
            <div className="hidden sm:flex">{renderLocation()}</div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center justify-center gap-6" data-aos="fade-left">
            {/* Desktop Search */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search products..."
                className="w-full bg-black/10 border border-orange-700/60 placeholder-gray-500 
    text-white rounded-xl pl-5 pr-12 py-2.5 text-sm
    focus:outline-none focus:ring-1 focus:ring-red-900
    backdrop-blur-md transition w-56 focus:w-72"
              />

              <Search className="absolute right-4 h-4 w-4 text-gray-400" />
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
                <SignInButton>
                  <button className="bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 text-white font-medium px-4 py-1.5 rounded-md transition flex items-center gap-1 justify-center flex-row shadow-md hover:shadow-red-500/40">
                    <FaSignInAlt /> <span>Sign In</span>
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{ elements: { avatarBox: "h-8 w-8 ring-2 ring-red-500" } }}
                />
              </SignedIn>
            </div>
          </nav>

          {/* Mobile Nav + Cart + Auth */}
          <div className="sm:hidden flex items-center justify-center gap-4" data-aos="fade-right">
            {/* Mobile Search */}
            <div className="relative flex items-center w-full" data-aos="fade-right">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search products..."
                className="w-full bg-black/10 border border-orange-700/60 placeholder-gray-500 
    text-white rounded-xl pl-5 pr-12 py-2.5 text-sm
    focus:outline-none focus:ring-1 focus:ring-red-900
    backdrop-blur-md transition"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
      {isLocationModalOpen && (
        <div className="z-[100]">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={() => setIsLocationModalOpen(false)}
          ></div>

          <div
            className="fixed inset-0 flex items-start justify-center z-50 px-4 pt-30 min-h-screen"
            onClick={() => setIsLocationModalOpen(false)}
          >
            <div
              className="relative bg-gradient-to-br from-gray-900/80 via-black/70 to-gray-800/80
              backdrop-blur-2xl border border-red-500/30 shadow-[0_0_30px_rgba(255,60,60,0.3)]
              rounded-2xl w-full max-w-md px-8 py-6 text-center text-gray-100
              animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-300 mb-3 drop-shadow-[0_0_10px_rgba(255,99,71,0.4)]">
                Set Your Location
              </h2>

              <p className="text-sm text-gray-400 mb-6">
                Allow access to your location for tailored recommendations and faster delivery.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => { handleUseMyLocation(), setIsLocationModalOpen(false) }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg
                  bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500
                  text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/30 cursor-pointer"
                >
                  <MapPin className="w-5 h-5" />
                  Use My Current Location
                </button>

                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  className="text-gray-400 hover:text-red-400 text-sm w-full mt-4 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Offcanvas Menu */}
      <aside
        className={`sm:hidden fixed min-h-screen top-0 left-0 w-3/4 max-w-xs h-full 
        bg-black/90 backdrop-blur-lg border-r border-red-500/40 rounded-r-2xl 
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
        className={`sm:hidden fixed bottom-3 left-1/2 -translate-x-1/2 
  w-[95%] max-w-md z-48
  bg-black/90 backdrop-blur-2xl
  rounded-2xl border border-red-400
  shadow-[0_0_30px_red]
  transition-transform duration-300 ease-in-out
  ${showBottomNav ? "translate-y-0" : "translate-y-24"}`}
      >
        <div className="flex justify-between items-center px-4 py-3">

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
              `relative -mt-8 flex flex-col items-center justify-center
    h-14 w-14 rounded-full
    bg-gradient-to-r from-red-500 to-red-800
    shadow-[0_8px_25px_rgba(255,80,80,0.5)]
    transition-all duration-300
    ${isActive ? "scale-110" : "hover:scale-105"}`
            }
          >
            <ShoppingCart className="h-6 w-6 text-white" />

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
              <SignInButton>
                <div className="flex flex-col items-center hover:text-red-400 transition cursor-pointer">
                  <User className="h-5 w-5 mb-1" />
                  Account
                </div>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex flex-col items-center">
                <UserButton afterSignOutUrl="/" />
                <span className="text-[11px] mt-1">Profile</span>
              </div>
            </SignedIn>
          </div>

        </div>
      </div>


    </>
  );
}
