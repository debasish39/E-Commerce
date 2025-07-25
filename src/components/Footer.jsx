import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaPinterest, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-gray-300 pt-10 border-t-4 border-red-600 relative bottom-0">
      <div className="max-w-full  px-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Logo & Description */}
        <div>
          <Link to="/">
            <h1 className="text-red-500 text-3xl font-bold mb-3">E-com</h1>
          </Link>
          <p className="text-sm">
            Powering your world with top-notch electronics and gadgets.
          </p>
          <p className="mt-2 text-sm">Berhampur, Odisha, India</p>
          <p className="text-sm">
            Email: <a href="mailto:djproject963@gmail.com" className="text-red-400-400">djproject963@gmail.com</a>
          </p>
          <p className="text-sm">Phone: +91 70778 6***4</p>
        </div>

        {/* Customer Service Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Customer Service</h3>
          <ul className="text-sm space-y-2">
            <li><Link to="/contact" className="hover:text-red-500">Contact Us</Link></li>
            <li><Link to="/shipping" className="hover:text-red-500">Shipping & Returns</Link></li>
            <li><Link to="/faqs" className="hover:text-red-500">FAQs</Link></li>
            <li><Link to="/order-tracking" className="hover:text-red-500">Order Tracking</Link></li>
            <li><Link to="/support" className="hover:text-red-500">Support Center</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
          <p className="text-sm mb-2">Stay connected on social media</p>
          <div className="flex space-x-4 text-xl">
            <a href="#" aria-label="Facebook" className="hover:text-red-500"><FaFacebook /></a>
            <a href="#" aria-label="Instagram" className="hover:text-red-500"><FaInstagram /></a>
            <a href="#" aria-label="Twitter" className="hover:text-red-500"><FaTwitter /></a>
            <a href="#" aria-label="Pinterest" className="hover:text-red-500"><FaPinterest /></a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Stay Updated</h3>
          <p className="text-sm mb-2">
            Get special offers and new product alerts.
          </p>
          <form className="mt-4 flex">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full p-2 rounded-l-md bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-4 rounded-r-md hover:bg-red-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 border-t border-gray-600 pt-5 text-center text-sm pb-3 text-gray-400">
        <p>
          &copy; {new Date().getFullYear()}{' '}
          <span className="text-red-500 font-semibold">E-com</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
