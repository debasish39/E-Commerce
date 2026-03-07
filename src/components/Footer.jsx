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
    <footer className="bg-black/80 text-gray-300 pt-10 border-t-4 border-red-600 relative bottom-0">
      <div className="max-w-full px-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Logo Section */}
        <div>
          <Link to="/">
            <h1
              className="text-red-500 text-3xl font-bold mb-3"
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
              className="text-red-400 ml-1"
            >
              djproject963@gmail.com
            </a>
          </p>

          <p className="text-sm">
            Phone:
            <a
              href="tel:+916370195243"
              className="text-red-400 ml-1"
            >
              +91 6370195243
            </a>
          </p>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Customer Service
          </h3>

          <ul className="text-sm space-y-2">
            <li>
              <Link to="/contact" className="hover:text-red-500">
                Contact Us
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-red-500">
                Shipping & Returns
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-red-500">
                FAQs
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-red-500">
                Order Tracking
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-red-500">
                Support Center
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Follow Us
          </h3>

          <p className="text-sm mb-2">
            Stay connected on social media
          </p>

          <div className="flex space-x-4 text-xl">
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="hover:text-red-500"
            >
              <FaFacebook />
            </a>

            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="hover:text-red-500"
            >
              <FaInstagram />
            </a>

            <a
              href="https://twitter.com"
              aria-label="Twitter"
              className="hover:text-red-500"
            >
              <FaTwitter />
            </a>

            <a
              href="https://linkedin.com"
              aria-label="Linkedin"
              className="hover:text-red-500"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Stay Updated
          </h3>

          <p className="text-sm mb-2">
            Get special offers and new product alerts.
          </p>

          <form
            className="mt-4 flex"
            onSubmit={handleSubscribe}
            noValidate
          >
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full p-2 rounded-l-md bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white px-4 rounded-r-md hover:bg-red-700 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Sending..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 border-t border-gray-600 pt-5 text-center text-sm pb-3 text-gray-400">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-red-500 font-semibold">
            E-Shop
          </span>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;