import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, MapPin, ChevronDown } from "lucide-react";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import { FaBolt } from 'react-icons/fa'; 
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useCart } from "../context/CartContext";

export default function Navbar({ location, onLocationChange}) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const {cartItem}=useCart();
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
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
  ];

  const renderLocation = () => (
    <div
      className="flex items-center gap-1 text-gray-600 text-sm relative cursor-pointer"
      onClick={(e) =>{ e.stopPropagation();
          setOpenDropdown(!openDropdown);
      }
      }
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
        onClick={() => setOpenDropdown(!openDropdown)}
      />
      {openDropdown && (
        <div className="absolute top-10 left-0 w-[250px] bg-[#FFFFFF] shadow-xl border rounded-md p-4 z-99">
          <h1 className="font-semibold mb-2 text-lg">Change Location</h1>
          <button
            onClick={handleUseMyLocation}
            className="text-sm text-red-600 cursor-pointer mb-3"
          >
           <span className="flex items-center gap-1"> <MapPin/> Use My Current Location</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Overlay */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0   "
          onClick={() => setIsMobileNavOpen(false)}
        ></div>
      )}

      {/* Navbar */}
      <header className="bg-[#F9E4D1] border-b-[3px] shadow-2xl border-red-500 py-3 fixed top-0 left-0  right-0  z-30 " onClick={(e)=>{

        e.stopPropagation();
        setOpenDropdown(false);
      }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo + Location */}
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl sm:text-3xl font-bold text-red-600"style={{ fontFamily: "'Pacifico', cursive" }}>              E-Shop
            </Link>
            <div className="hidden sm:flex">{renderLocation()}</div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-6">
            <ul className="flex gap-6 font-medium text-gray-800">
              {navLinks.map(({ name, path }) => (
                <li key={name}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      isActive
                        ? "text-red-600 border-b-2 font-bold border-red-600 pb-1"
                        : "hover:text-red-500 font-bold transition"
                    }
                  >
                    {name}
                  </NavLink>
                </li>
              ))}
            </ul>

            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              <span className="absolute -top-2 -right-2 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                 {cartItem.length}
              </span>
            </Link>

            <div className="ml-4">
              <SignedOut>
                <SignInButton>
                  <button className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-1.5 rounded-md transition">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8 ring-2 ring-red-500",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </nav>

          {/* Mobile Cart + Menu Toggle */}
          <div className="sm:hidden flex items-center gap-6">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              <span className="absolute -top-2 -right-2 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                {cartItem.length}
              </span>
            </Link>
              {/* Auth */}
          <div className="flex items-center justify-between ">
            <SignedOut>
              <SignInButton>
                <button className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1 rounded transition">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8 ring-2 ring-red-500",
                  },
                }}
              />
            </SignedIn>
          </div>
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

      {/* Offcanvas - Mobile Menu (from LEFT) */}
      <aside
        className={`sm:hidden fixed top-0 left-0 w-3/4 max-w-xs h-full bg-[#FBDCC0]  transform transition-transform z-30 duration-300 border-r-3  rounded-r-2xl rounded-b-1xl ease-in-out shadow-2xl border-red-100 ${
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b-3 border-red-500">
          <h2 className="text-lg font-bold text-red-500">E-Shop</h2>
        </div>

        <div className="p-4 space-y-4">
          {/* Location */}
          <div>{renderLocation()}</div>

          {/* Nav Links */}
          {[...navLinks].map(
            ({ name, path,}) => (
              <NavLink
                key={name}
                to={path}
                onClick={() => setIsMobileNavOpen(false)}
                className={({ isActive }) =>
                  "flex items-center justify-between text-left w-full px-3 py-2 rounded-md border-l-4 transition " +
                  (isActive
                    ? "text-red-600 border-red-500 bg-red-50 font-semibold"
                    : "text-gray-700 hover:text-red-500 hover:bg-gray-100 border-transparent")
                }
              >
                <span>{name}</span>
                {/* {isCart && (
                  <span className="relative ml-2">
                    <ShoppingCart className="h-5 w-5 text-gray-700" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 h-4 w-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </span>
                )} */}
              </NavLink>
            )
          )}

        
        </div>
      </aside>
    </>
  );
}
