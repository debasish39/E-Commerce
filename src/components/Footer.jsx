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
    <footer className="bg-white/50 text-gray-700 pt-10 border-t-1 border-indigo-500 shadow-[9px_9px_18px_indigo]">
      <div className="max-w-full sm:px-9 px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
        
        {/* Logo Section */}
        <div>
          <Link to="/">
            <h1
              className="text-indigo-600 text-xl sm:text-2xl font-bold mb-3"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              E-Shop
            </h1>
          </Link>

          <p className="text-sm">
            Powering your world with top-notch electronics and gadgets.
          </p>

          <p className="mt-2 text-sm">
            EATM, Baniatangi, Khurdha, Odisha
          </p>

          <p className="text-sm">
            Email:
            <a
              href="mailto:djproject963@gmail.com"
              className="text-blue-500 ml-1 hover:underline"
            >
              djproject963@gmail.com
            </a>
          </p>

          <p className="text-sm">
            Phone:
            <a
              href="tel:+916370195243"
              className="text-blue-500 ml-1 hover:underline"
            >
              +91 6370195243
            </a>
          </p>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Customer Service
          </h3>

          <ul className="text-sm space-y-2">
            <li>
              <Link to="/contact" className="hover:text-blue-600 transition">
                Contact Us
              </Link>
            </li>

            <li>
              <Link to="/shipping" className="hover:text-blue-600 transition">
                Shipping & Returns
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-blue-600 transition">
                FAQs
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-blue-600 transition">
                Order Tracking
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-blue-600 transition">
                Support Center
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Legal
          </h3>

          <ul className="text-sm space-y-2">
            <li>
              <Link to="/legal/terms" className="hover:text-blue-600 transition">
                Terms & Conditions
              </Link>
            </li>

            <li>
              <Link to="/legal/privacy" className="hover:text-blue-600 transition">
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link to="/legal/refund" className="hover:text-blue-600 transition">
                Refund Policy
              </Link>
            </li>

            <li>
              <Link to="/legal/shipping" className="hover:text-blue-600 transition">
                Shipping Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Follow Us
          </h3>

          <p className="text-sm mb-2">
            Stay connected on social media
          </p>

          <div className="flex space-x-4 text-xl">
            <a
              href="https://facebook.com"
              className="hover:text-blue-600 transition"
            >
              <FaFacebook />
            </a>

            <a
              href="https://instagram.com"
              className="hover:text-blue-600 transition"
            >
              <FaInstagram />
            </a>

            <a
              href="https://twitter.com"
              className="hover:text-blue-600 transition"
            >
              <FaTwitter />
            </a>

            <a
              href="https://linkedin.com"
              className="hover:text-blue-600 transition"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Stay Updated
          </h3>

          <p className="text-sm mb-2">
            Get special offers and new product alerts.
          </p>

          <form className="mt-4 flex" onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full p-2 rounded-l-md bg-gray-100 focus:outline-none border border-gray-300 focus:ring-1 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 transition"
            >
              {loading ? "Sending..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-gray-200 pt-5 text-center text-sm pb-3 text-gray-500">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-blue-600 font-semibold">E-Shop</span>. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;