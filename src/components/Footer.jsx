import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaPinterest, FaTwitter } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          email,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(' You are subscribed!');
        setEmail('');
      } else {
        toast.error(`${result.message || 'Something went wrong'}`);
      }
    } catch (error) {
      toast.error('Network error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-neutral-900 text-gray-300 pt-10 border-t-4 border-red-600 relative bottom-0">
      <div className="max-w-full px-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Logo & Description */}
        <div>
          <Link to="/">
            <h1 className="text-red-500 text-3xl font-bold mb-3" style={{ fontFamily: "'Pacifico', cursive" }}>E-Shop</h1>
          </Link>
          <p className="text-sm">Powering your world with top-notch electronics and gadgets.</p>
          <p className="mt-2 text-sm">Berhampur, Odisha, India</p>
          <p className="text-sm">
            Email: <a href="mailto:djproject963@gmail.com" className="text-red-400">djproject963@gmail.com</a>
          </p>
          <p className="text-sm">Phone: +91 70778 6***4</p>
        </div>

        {/* Customer Service Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Customer Service</h3>
          <ul className="text-sm space-y-2">
            <li><Link to="/contact" className="hover:text-red-500">Contact Us</Link></li>
            <li><Link to="/contact" className="hover:text-red-500">Shipping & Returns</Link></li>
            <li><Link to="/contact" className="hover:text-red-500">FAQs</Link></li>
            <li><Link to="/contact" className="hover:text-red-500">Order Tracking</Link></li>
            <li><Link to="/contact" className="hover:text-red-500">Support Center</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
          <p className="text-sm mb-2">Stay connected on social media</p>
          <div className="flex space-x-4 text-xl">
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-red-500"><FaFacebook /></a>
            <a href="https://instagram.com/deba_963" aria-label="Instagram" className="hover:text-red-500"><FaInstagram /></a>
            <a href="https://twitter.com" aria-label="Twitter" className="hover:text-red-500"><FaTwitter /></a>
            <a href="https://www.linkedin.com/in/debasish-panda-857715314/" aria-label="Linkedin" className="hover:text-red-500"><FaLinkedin /></a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Stay Updated</h3>
          <p className="text-sm mb-2">Get special offers and new product alerts.</p>
          <form className="mt-4 flex" onSubmit={handleSubscribe} noValidate>
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
              className="bg-red-600 text-white px-4 rounded-r-md hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 border-t border-gray-600 pt-5 text-center text-sm pb-3 text-gray-400">
        <p>
          &copy; {new Date().getFullYear()}{' '}
          <span className="text-red-500 font-semibold"><Link to='/'>E-Shop</Link></span>. All rights reserved.
        </p>
      </div>

      {/* Toast Notifications (React Hot Toast) */}
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </footer>
  );
};

export default Footer;
