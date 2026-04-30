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
import { FaRegUserCircle, FaUser,FaBox } from "react-icons/fa";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import { BsBox2 } from "react-icons/bs";
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
      toast.error("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    const listeningToast = toast.loading("🎤 Listening... Speak now");

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setSearch(transcript);

      toast.dismiss(listeningToast);
      toast.success(`Searching for: "${transcript}"`);

      navigate("/products");
    };

    recognition.onend = () => {
      setIsListening(false);
      toast.dismiss(listeningToast);
    };

    recognition.onerror = () => {
      setIsListening(false);

      toast.dismiss(listeningToast);
      toast.error("Voice not recognized. Try again.");
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
  
    {
      name: "Collections",
      path: "/products",
      icon: <Package className="h-4 w-4 text-indigo-500" />,
    },
    {
      name: "Contact",
      path: "/contact",
      icon: <Phone className="h-4 w-4 text-indigo-500" />,
    },
    {
      name: "Orders",
      path: "/order-history",
      icon: <ShoppingBag className="h-4 w-4 text-indigo-500" />,
    },
      {
      name: "Track Order",
      path: "/track-order",
      icon: <BsBox2  className="h-4 w-4 text-indigo-800" />,

    },
  ];

  const renderLocation = () => (
    <div
      className="flex items-center gap-2 

    text-gray-700 text-sm font-medium

     
    

     hover:text-indigo-600
   

    transition-all duration-300 cursor-pointer"

      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      data-aos="fade-up"
    >

      {/* ICON */}
      <MapPin className="h-4 w-4 text-indigo-500" />

      {/* TEXT */}
      <span className="max-w-[150px] truncate">
        {location ? (
          <>
            {location.village ||
              location.town ||
              location.city ||
              location.suburb ||
              location.county ||
              location.state_district}
            , {location.state}
          </>
        ) : (
          "Add Location"
        )}
      </span>

      {/* DROPDOWN */}
      <ChevronDown className="ml-1 text-gray-400 transition-transform group-hover:rotate-180" />
    </div>
  );

  return (
    <>
      {/* Background overlay for mobile menu */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-white/40 backdrop-blur-sm z-30"
          onClick={() => setIsMobileNavOpen(false)}
          data-aos="fade-in"
        ></div>
      )}

      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40

  bg-white/50 backdrop-blur-md
  border-b border-gray-200
  py-3
  shadow-sm
  transition-transform duration-300 ease-in-out
  ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}

        data-aos="fade-down"
        onClick={() => onClose()}
      >

        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo + Location */}
          <div className="flex items-center gap-4" data-aos="zoom-in">

            {/* LOGO */}
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

            {/* LOCATION */}
            <div className="hidden md:flex">
              {renderLocation()}
            </div>

          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center justify-center gap-6"
            data-aos="fade-left"
          >

            {/* SEARCH */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search products..."
                className="bg-white/60 border border-gray-300

      text-gray-800 placeholder-gray-400

      rounded-lg pl-4 pr-12 py-2 text-sm

      focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500

      transition-all duration-300 w-56 focus:w-60"
              />

              {/* MIC */}
              <button
                onClick={handleVoiceSearch}
                className={`absolute right-3 transition-all duration-300 cursor-pointer ${isListening
                  ? "text-indigo-600 animate-pulse scale-110"
                  : "text-gray-400 hover:text-indigo-600"
                  }`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            </div>

            {/* NAV LINKS */}
            <ul className="flex gap-6 font-medium">
              {navLinks.map(({ name, path, icon }) => (
                <li key={name} className="relative group">
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `flex items-center gap-1 pb-1 transition-all duration-300 ${isActive
                        ? "text-indigo-600 font-semibold"
                        : "text-gray-600 hover:text-indigo-600"
                      }`
                    }
                  >
                    {icon} {name}
                  </NavLink>

                  {/* UNDERLINE */}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px]
          bg-indigo-500 transition-all duration-300
          ${window.location.pathname === path ? "w-full" : "w-0 group-hover:w-full"}`}
                  />
                </li>
              ))}
            </ul>

            {/* CART */}
            <Link to="/cart" className="relative group">
              <ShoppingCart className="h-6 w-6 text-gray-600 group-hover:text-indigo-600 transition" />

              <span className="absolute -top-2 -right-2 h-5 w-5 text-xs
    bg-indigo-600 text-white rounded-full flex items-center justify-center">
                {cartItem.length}
              </span>
            </Link>

            {/* WISHLIST */}
            <Link to="/wishlist" className="relative group">
              <AiOutlineHeart className="h-6 w-6 text-gray-600 group-hover:text-indigo-600 transition" />

              <span className="absolute -top-2 -right-2 h-5 w-5 text-xs
    bg-indigo-600 text-white rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            </Link>

            {/* AUTH */}
            <div className="ml-4">

              <SignedOut>
                <button
                  onClick={() => navigate("/sign-in")}
                  className="flex flex-col sm:flex-row items-center gap-1
        text-gray-600 hover:text-indigo-600 transition"
                >
                  <FaRegUserCircle className="h-6 w-6" />
                </button>
              </SignedOut>

              <SignedIn>
                <div className="flex flex-col items-center">
                  {user && (
                    <img
                      src={user.imageUrl}
                      alt="profile"
                      onClick={() => navigate("/profile")}
                      className="h-8 w-8 rounded-full
            ring-2 ring-indigo-500 cursor-pointer"
                    />
                  )}
                </div>
              </SignedIn>

            </div>

          </nav>

          {/* Mobile Nav + Cart + Auth */}
          <div
            className="md:hidden flex items-center justify-center gap-3"
            data-aos="fade-right"
          >

            {/* SEARCH */}
            <div className="relative flex items-center w-full">

              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search products..."
                className="w-52 focus:w-55 bg-white/60 border border-gray-300

      text-gray-800 placeholder-gray-400

      rounded-lg pl-3 pr-10 py-1.5 text-sm

      focus:outline-none
      focus:ring-1 focus:ring-indigo-300
      focus:border-indigo-300

      transition"
              />

              {/* MIC */}
              <button
                onClick={handleVoiceSearch}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer ${isListening
                  ? "text-indigo-600 animate-pulse scale-110"
                  : "text-gray-400 hover:text-indigo-600"
                  }`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

            </div>


            {/* MENU TOGGLE */}
            {isMobileNavOpen ? (
              <HiMenuAlt3
                onClick={() => setIsMobileNavOpen(false)}
                className="h-7 w-7 text-indigo-600 hover:text-indigo-900 cursor-pointer transition"
              />
            ) : (
              <HiMenuAlt1
                onClick={() => setIsMobileNavOpen(true)}
                className="h-7 w-7 text-indigo-600 hover:text-indigo-900 cursor-pointer transition"
              />
            )}

          </div>
        </div>
      </header>

      {/* Location Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="center"
        backdrop="blur"
        classNames={{
          body: "py-6",
          backdrop: "bg-black/40 backdrop-blur-md",
        }}
        hideCloseButton
        className="z-[9999]"
      >
        <ModalContent
          className="relative bg-white border border-gray-200
    rounded-2xl shadow-xl text-gray-800 overflow-hidden
    max-w-lg w-[95%]"
        >
          {(onClose) => (
            <>
              {/* CLOSE */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5
          w-8 h-8 flex items-center justify-center
          rounded-full bg-gray-100

          hover:bg-indigo-100 hover:text-indigo-600
          transition cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* HEADER */}
              <ModalHeader className="flex flex-col items-center gap-2 border-b border-gray-200 pb-5 pt-6">

                <div className="h-12 w-12 flex items-center justify-center
          rounded-xl bg-indigo-100">
                  <MapPin className="text-indigo-600" size={20} />
                </div>

                <h2 className="text-lg font-semibold">
                  Set Delivery Location
                </h2>

                <p className="text-xs text-gray-500">
                  Choose your address to check delivery availability
                </p>

              </ModalHeader>

              {/* BODY */}
              <ModalBody className="space-y-4 py-4">

                {/* SEARCH */}
                <div className="w-full relative">

                  {/* INPUT CONTAINER */}
                  <div
                    className="flex items-center gap-1 w-full
  px-2 h-9 

  rounded-lg border border-indigo-600 bg-white

  focus-within:ring-2 focus-within:ring-indigo-500
  focus-within:border-indigo-500

  transition"
                  >
                    <MapPin size={18} className="text-gray-400 shrink-0" />

                    <input
                      type="text"
                      placeholder="Search city or pincode"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="flex-1 bg-transparent text-sm
    outline-none placeholder-gray-400"
                    />
                  </div>

                  {/* BUTTON INSIDE */}
                  <button
                    onClick={handleAreaSearch}
                    className="absolute right-0 top-1/2 -translate-y-1/2

  flex items-center justify-center gap-1

  h-9 px-3 rounded-md border border-indigo-600
  text-white text-sm font-medium

  bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600

  shadow-md shadow-indigo-500/20
  hover:shadow-indigo-500/40

  hover:scale-[1.03] active:scale-[0.96]

  transition-all duration-300 cursor-pointer"
                  >
                    <Search size={16} />
                    <span>Search</span>
                  </button>

                </div>
                {/* DETECT LOCATION */}
                <button
                  onClick={() => {
                    handleUseMyLocation();
                    onClose();
                  }}
                  className="group relative w-full flex items-center justify-center gap-2
  py-2.5 rounded-xl

  border border-indigo-200
  bg-gradient-to-r from-indigo-50 to-blue-50

  text-indigo-600 font-medium

  shadow-sm hover:shadow-md

  hover:border-indigo-400
  hover:from-indigo-100 hover:to-blue-100

  active:scale-[0.97]

  transition-all duration-300 cursor-pointer overflow-hidden"
                >

                  {/* Icon */}
                  <MapPin
                    size={16}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />

                  Use Current Location

                  {/* Subtle Shine */}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100
  bg-gradient-to-r from-transparent via-white/40 to-transparent
  transition duration-500"></span>

                </button>

                {/* MAP */}
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
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
        className={`md:hidden fixed top-0 left-0 h-full w-3/4 max-w-xs
  bg-white border-r border-gray-200

  shadow-2xl

  transform transition-transform duration-300 ease-in-out z-50
  ${isMobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
        data-aos="fade-right"
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">

          <h1
            className="text-2xl font-bold
      bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600
      bg-clip-text text-transparent"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            E-Shop
          </h1>

        </div>

        {/* CONTENT */}
        <div className="flex flex-col justify-between h-full">

          <div className="p-4 space-y-5 overflow-y-auto">

            {/* LOCATION */}
            <div className="">
              {renderLocation()}
            </div>

            {/* NAV LINKS */}
            <div className="space-y-2">

              <NavLink
                to="/order-history"
                onClick={() => setIsMobileNavOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 w-full px-4 py-3 rounded-xl
            transition-all duration-200

            ${isActive
                    ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  }`
                }
              >
                <Package
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
                <span>Order History</span>
              </NavLink>

              <NavLink
                to="/contact"
                onClick={() => setIsMobileNavOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 w-full px-4 py-3 rounded-xl
            transition-all duration-200

            ${isActive
                    ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  }`
                }
              >
                <Phone
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
                <span>Contact</span>
              </NavLink>
 <NavLink
                to="/track-order"
                onClick={() => setIsMobileNavOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 w-full px-4 py-3 rounded-xl
            transition-all duration-200

            ${isActive
                    ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  }`
                }
              >
                <BsBox2
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
                <span>Track Order</span>
              </NavLink>
            </div>

          </div>

        </div>

      </aside>
      {/* ================= MOBILE BOTTOM NAVBAR ================= */}
      <div
        className={`sm:hidden fixed bottom-0 left-1/2 -translate-x-1/2
  w-full max-w-md z-50

  bg-white/90 border border-gray-200
  

  

  transition-transform duration-300 ease-in-out
  ${showBottomNav ? "translate-y-0" : "translate-y-24"}`}
      >
        <div className="flex justify-between items-center px-4 py-2.5">

          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs transition-all duration-300
      ${isActive
                ? "text-indigo-600 scale-105"
                : "text-gray-500 hover:text-indigo-600"
              }`
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
      ${isActive
                ? "text-indigo-600 scale-105"
                : "text-gray-500 hover:text-indigo-600"
              }`
            }
          >
            <Package className="h-5 w-5 mb-1" />
            Products
          </NavLink>

          {/* FLOATING CART */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative -mt-7 flex items-center justify-center
      h-14 w-14 rounded-full

      bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600

      shadow-lg shadow-indigo-500/30

      transition-all duration-300
      ${isActive ? "scale-110" : "hover:scale-105"}`
            }
          >
            <ShoppingCart className="h-6 w-6 text-white" />

            {/* BADGE */}
            <span
              className={`absolute -top-1 -right-1
      min-w-[18px] h-5 px-1 text-[10px]
      rounded-full flex items-center justify-center
      shadow-sm
      ${cartItem.length > 0
                  ? "bg-white text-indigo-600"
                  : "bg-gray-300 text-gray-600"
                }`}
            >
              {cartItem.length}
            </span>
          </NavLink>

          {/* Wishlist */}
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `relative flex flex-col items-center text-xs transition-all duration-300
      ${isActive
                ? "text-indigo-600 scale-105"
                : "text-gray-500 hover:text-indigo-600"
              }`
            }
          >
            <div className="relative">
              <AiOutlineHeart className="h-5 w-5 mb-1" />

              <span
                className={`absolute -top-2 -right-3
        min-w-[18px] h-5 px-1 text-[10px]
        rounded-full flex items-center justify-center
        shadow-sm
        ${wishlist.length > 0
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300 text-gray-600"
                  }`}
              >
                {wishlist.length}
              </span>
            </div>

            Wishlist
          </NavLink>

          {/* Account */}
          <div className="flex flex-col items-center text-xs text-gray-500">

            <SignedOut>
              <button
                onClick={() => navigate("/sign-in")}
                className="flex flex-col items-center gap-1 hover:text-indigo-600 transition"
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
                    className="h-8 w-8 rounded-full
            ring-2 ring-indigo-500 cursor-pointer"
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