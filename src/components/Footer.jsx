import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const accessKey = import.meta.env.VITE_WEB3FORMS_SUB_ACCESS_KEY;

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: "Newsletter Subscriber",
          email: email,
          subject: "New Newsletter Subscription",
          message: `User subscribed with email: ${email}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("🎉 You are subscribed successfully!");
        setEmail("");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
   <footer className="bg-white/60 backdrop-blur-xl border-t border-indigo-300 shadow-[0_0_10px_rgba(0,0,0,0.1)] text-gray-700">

  <div className="max-w-7xl mx-auto px-5 py-9 sm:py-9 flex flex-col md:flex-row justify-between gap-3.6 sm:gap-10">

    {/* LEFT */}
    <div>
      <h1 className="text-indigo-600 text-xl font-bold mb-2"style={{ fontFamily: "'Pacific', sans-serif" }}>
        E-Shop
      </h1>

      <p className="text-sm text-gray-500 max-w-xs">
        Premium electronics & gadgets for your everyday needs.
      </p>
         <div className=" mt-3 flex gap-4 text-lg items-center">
      <a href="#" className="hover:text-indigo-600 transition">
        <FaFacebook />
      </a>

      <a href="#" className="hover:text-indigo-600 transition">
        <FaInstagram />
      </a>

      <a href="#" className="hover:text-indigo-600 transition">
        <FaTwitter />
      </a>

      <a href="#" className="hover:text-indigo-600 transition">
        <FaLinkedin />
      </a>
    </div>
    </div>

    {/* CENTER LINKS */}
    <div className="flex mt-3 sm:mt-0 flex-col gap-1.5 text-sm">
      <Link to="/contact" className="hover:text-indigo-600 transition">
        Contact
      </Link>

      <Link to="/track-order" className="hover:text-indigo-600 transition">
        Track Order
      </Link>

      <Link to="/legal/privacy" className="hover:text-indigo-600 transition">
        Privacy Policy
      </Link>

      <Link to="/legal/terms" className="hover:text-indigo-600 transition">
        Terms & Conditions
      </Link>
    </div>

    {/* NEWSLETTER */}
    <div className="w-full mt-3 sm:mt-0 max-w-sm">
      <h3 className="text-sm font-semibold text-indigo-600 mb-2 uppercase tracking-wide">
        Stay Updated
      </h3>

      <p className="text-xs text-gray-500 mb-3">
        Get offers & product updates
      </p>

      <form onSubmit={handleSubscribe} className="flex">

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-3 py-2 text-sm rounded-l-xl 
          bg-white/70 backdrop-blur border border-indigo-200 
          focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-semibold text-white 
          bg-gradient-to-r from-indigo-500 to-blue-500 
          rounded-r-xl hover:scale-105 transition"
        >
          {loading ? "..." : "Join"}
        </button>

      </form>
    </div>

    {/* SOCIAL */}
 

  </div>

  {/* BOTTOM */}
  <div className="border-t border-indigo-100 text-center text-xs text-gray-500 py-4">
    © {new Date().getFullYear()}{" "}
    <span className="text-indigo-600 font-semibold">E-Shop</span>. All rights reserved.
  </div>

</footer>
  );
};

export default Footer;