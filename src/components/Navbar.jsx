import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ShoppingCart,
  MapPin,
  ChevronDown,
  Home,
  Info,
  Package,
  Phone,
} from "lucide-react";
import { FaHeart, FaSignInAlt } from "react-icons/fa";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../hooks/useWishlist";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Navbar({ location, onLocationChange }) {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { cartItem } = useCart();
  const { wishlist } = useWishlist();

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out",
      once: false,
    });
  }, []);

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
    { name: "About", path: "/about", icon: <Info className="h-4 w-4 text-red-500" /> },
    { name: "Products", path: "/products", icon: <Package className="h-4 w-4 text-red-500" /> },
    { name: "Contact", path: "/contact", icon: <Phone className="h-4 w-4 text-red-500" /> },
  ];

  const renderLocation = () => (
    <div
      className="flex items-center gap-1 text-gray-600 text-sm relative cursor-pointer"
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
      {/* ===== Background overlay for mobile menu ===== */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMobileNavOpen(false)}
          data-aos="fade-in"
        ></div>
      )}

      {/* ===== Navbar ===== */}
      <header
        className="bg-[#F9E4D1]/90 border-b-[3px] shadow-2xl border-red-500 py-3 fixed top-0 left-0 right-0 z-30 backdrop-blur-md"
        data-aos="fade-down"
        onClick={() => setIsLocationModalOpen(false)}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo + Location */}
          <div className="flex items-center gap-4" data-aos="zoom-in">
            <Link
              to="/"
              className="text-2xl sm:text-3xl font-bold text-red-600"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              E-Shop
            </Link>
            <div className="hidden sm:flex">{renderLocation()}</div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-6" data-aos="fade-left">
            <ul className="flex gap-6 font-medium text-gray-800">
              {navLinks.map(({ name, path, icon }) => (
                <li key={name} className="relative group">
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `flex items-center gap-1 pb-1 transition-all duration-300 ${
                        isActive
                          ? "text-red-600 font-bold"
                          : "text-gray-800 hover:text-red-600 font-semibold"
                      }`
                    }
                  >
                    {icon} {name}
                  </NavLink>
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full ${
                      window.location.pathname === path ? "w-full" : "w-0"
                    }`}
                  ></span>
                </li>
              ))}
            </ul>

            {/* Cart */}
            <Link to="/cart" className="relative" data-aos="fade-left">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              <span className="absolute -top-2 -right-2 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                {cartItem.length}
              </span>
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative" data-aos="fade-left">
              <FaHeart className="h-6 w-6 text-red-500" />
              <span className="absolute -top-2 -right-2 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            </Link>

            {/* Auth */}
            <div className="ml-4" data-aos="fade-left">
              <SignedOut>
                <SignInButton>
                  <button className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-1.5 rounded-md transition flex items-center gap-1 justify-center flex-row">
                    <FaSignInAlt /> <span>Sign In</span>
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: { avatarBox: "h-8 w-8 ring-2 ring-red-500" },
                  }}
                />
              </SignedIn>
            </div>
          </nav>

          {/* ===== Mobile Nav + Cart + Auth ===== */}
          <div className="sm:hidden flex items-center gap-4" data-aos="fade-right">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              <span className="absolute -top-2 -right-2 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                {cartItem.length}
              </span>
            </Link>

            <Link to="/wishlist" className="relative">
              <FaHeart className="h-6 w-6 text-red-500" />
              <span className="absolute -top-2 -right-2 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <SignedOut>
                <SignInButton>
                  <button className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-1.5 rounded-md transition flex items-center gap-1 justify-center flex-row">
                    <FaSignInAlt />Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: { avatarBox: "h-8 w-8 ring-2 ring-red-500" },
                  }}
                />
              </SignedIn>
            </div>

            {/* Toggle */}
            {isMobileNavOpen ? (
              <HiMenuAlt3
                onClick={() => setIsMobileNavOpen(false)}
                className="h-7 w-7 text-gray-800 cursor-pointer"
              />
            ) : (
              <HiMenuAlt1
                onClick={() => setIsMobileNavOpen(true)}
                className="h-7 w-7 text-gray-800 cursor-pointer"
              />
            )}
          </div>
        </div>
      </header>

    {/* ===== Location Modal ===== */}
{isLocationModalOpen && (
  <>
    {/* Overlay (click to close) */}
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      onClick={() => setIsLocationModalOpen(false)}
    ></div>

    {/* Modal Content (click inside won’t close) */}
    <div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl w-11/12 max-w-md z-50 p-6 border-t-4 border-red-500"
      data-aos="zoom-in"
      onClick={(e) => e.stopPropagation()} // ⬅ Prevent modal from closing when clicked inside
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Change Your Location
      </h2>
      <p className="text-sm text-gray-600 mb-5">
        Allow us to access your location for a better shopping experience.
      </p>
      <button
        // onClick={handleUseMyLocation} //When we want for only one function 
          onClick={() => {
    handleUseMyLocation();
    setIsLocationModalOpen(false);
  }}

        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-medium transition w-full cursor-pointer"
      >
        <MapPin className="inline-block mr-2" />
        Use My Current Location
      </button>
      <button
        onClick={() => setIsLocationModalOpen(false)}
        className="mt-4 text-gray-500 hover:text-gray-800 text-sm w-full cursor-pointer"
      >
        Cancel
      </button>
    </div>
  </>
)}


      {/* ===== Mobile Offcanvas Menu ===== */}
      <aside
        className={`sm:hidden fixed top-0 left-0 w-3/4 max-w-xs h-full bg-[#FBDCC0]/95 transform transition-transform z-40 duration-300 border-r-4 border-red-200 rounded-r-2xl shadow-2xl ease-in-out ${
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        data-aos="fade-right"
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b-4 border-red-500">
          <h2
            className="text-lg font-bold text-red-500"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            E-Shop
          </h2>
        </div>

        <div className="flex flex-col justify-between h-full">
          <div className="p-4 space-y-4 overflow-y-auto">
            <div>{renderLocation()}</div>

            {navLinks.map(({ name, path, icon }) => (
              <NavLink
                key={name}
                to={path}
                onClick={() => setIsMobileNavOpen(false)}
                className={({ isActive }) =>
                  "flex items-center gap-2 text-left w-full px-3 py-2 rounded-md border-l-4 transition " +
                  (isActive
                    ? "text-red-600 border-red-500 bg-red-50 font-semibold"
                    : "text-gray-700 hover:text-red-500 hover:bg-gray-100 border-transparent")
                }
                data-aos="fade-up"
              >
                {icon}
                <span>{name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
