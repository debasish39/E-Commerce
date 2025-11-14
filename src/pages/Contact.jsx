import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaFileAlt, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: '',
    orderId: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  useEffect(() => {
    AOS.init({ duration: 500, easing: 'ease-in-out', once: false, offset: 100 });
  }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, inquiryType, message } = formData;
    if (!name.trim() || !email.trim() || !inquiryType || !message.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }
    setIsSubmitting(true);
    const payload = { access_key: accessKey, ...formData, subject: "E-Commerce Inquiry", from_name: name };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Message sent successfully!");
        setFormData({ name: '', email: '', inquiryType: '', orderId: '', message: '' });
      } else toast.error("Something went wrong. Try again.");
    } catch {
      toast.error("Submission failed. Check your network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-transparent relative">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-10">

        {/* MAP */}
        <div
          className="w-full lg:w-1/2 h-[400px] lg:h-[80vh] rounded-2xl shadow-none border-none overflow-hidden bg-transparent"
          data-aos="fade-right"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.9316664188245!2d85.61682517655123!3d20.13223376978005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19ad20457753ef%3A0x8d2834dd8305ea76!2sEinstein%20Academy%20of%20Technology%20and%20Management!5e1!3m2!1sen!2sin!4v1761017897848!5m2!1sen!2sin"
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
          ></iframe>
        </div>

        {/* FORM */}
        <div
          className="w-full lg:w-1/2 rounded-2xl shadow-none border-none p-0 flex flex-col bg-transparent"
          data-aos="fade-left"
        >
          <h2 className="text-3xl font-bold text-center text-red-600 mb-4">Customer Support</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            Have a question about your order or product? Reach out and we will respond quickly!
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 outline-none bg-transparent text-gray-900 dark:text-gray-100 transition"
                required
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 outline-none bg-transparent text-gray-900 dark:text-gray-100 transition"
                required
              />
            </div>

            <div className="relative">
              <FaFileAlt className="absolute top-3 left-3 text-gray-400" />
              <select
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                required
                className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 outline-none bg-transparent text-gray-100 transition"
              >
                <option value="" disabled className="text-gray-300 bg-black">
                  Select Inquiry Type
                </option>
                <option value="order" className="text-gray-300 bg-black">Order Issue</option>
                <option value="product" className="text-gray-300 bg-black">Product Inquiry</option>
                <option value="return" className="text-gray-300 bg-black">Returns & Refunds</option>
                <option value="general" className="text-gray-300 bg-black">General Question</option>
              </select>
            </div>

            {formData.inquiryType === 'order' && (
              <div className="relative">
                <FaFileAlt className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleChange}
                  placeholder="#123456"
                  className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 outline-none bg-transparent text-gray-900 dark:text-gray-100 transition"
                />
              </div>
            )}

            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message..."
                className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 outline-none bg-transparent text-gray-900 dark:text-gray-100 transition"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? 'Sending...' : 'Submit Request'}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm flex flex-col sm:flex-row gap-2">
            <span>Our support team responds within 1–2 business days.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
