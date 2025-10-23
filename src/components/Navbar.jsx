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
  const [openDropdown, setOpenDropdown] = useState(false);
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
        setOpenDropdown(false);
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
        setOpenDropdown(!openDropdown);
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
      <ChevronDown
        className={`ml-1 transition-transform ${
          openDropdown ? "rotate-180" : ""
        }`}
      />
      {openDropdown && (
        <div
          className="absolute top-10 left-0 w-[250px] bg-[#d0bcbc] shadow-xl border rounded-md p-4 z-50"
          data-aos="zoom-in"
        >
          <h1 className="font-semibold mb-2 text-lg text-black">
            Change Location
          </h1>
          <button
            onClick={handleUseMyLocation}
            className="text-sm text-red-600 cursor-pointer mb-3 flex items-center gap-1"
          >
            <MapPin /> Use My Current Location
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Background overlay for mobile menu */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMobileNavOpen(false)}
          data-aos="fade-in"
        ></div>
      )}

      {/* Navbar */}
      <header
        className="bg-[#F9E4D1]/90 border-b-[3px] shadow-2xl border-red-500 py-3 fixed top-0 left-0 right-0 z-30 backdrop-blur-md"
        data-aos="fade-down"
        onClick={(e) => {
          e.stopPropagation();
          setOpenDropdown(false);
        }}
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

            {/* Cart Icon */}
            <Link to="/cart" className="relative" data-aos="fade-left">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              <span className="absolute -top-2 -right-2 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                {cartItem.length}
              </span>
            </Link>

            {/* Wishlist Icon */}
            <Link to="/wishlist" className="relative" data-aos="fade-left">
              <FaHeart className="h-6 w-6 text-red-500" />
              <span className="absolute -top-2 -right-2 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            </Link>

            {/* Auth Buttons */}
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

          {/* Mobile Cart + Wishlist + Auth + Menu Toggle */}
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

            {/* Auth Buttons */}
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

            {/* Mobile Menu Toggle */}
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

      {/* Mobile Offcanvas Menu */}
      <aside
        className={`sm:hidden fixed top-0 left-0 w-3/4 max-w-xs h-full bg-[#FBDCC0]/95 transform transition-transform z-40 duration-300 border-r-4 border-red-200 rounded-r-2xl shadow-2xl ease-in-out ${
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        data-aos="fade-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b-4 border-red-500">
          <h2
            className="text-lg font-bold text-red-500"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            E-Shop
          </h2>
        </div>

        {/* Scrollable menu */}
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
