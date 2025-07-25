import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const { name, email, inquiryType, message } = formData;

  // Basic required field validation
  if (!name.trim() || !email.trim() || !inquiryType || !message.trim()) {
    toast.error(
      <span className="flex items-center gap-2">
       
        Please fill all the required fields.
      </span>
    );
    return;
  }

  setIsSubmitting(true);

  const payload = {
    access_key: accessKey,
    ...formData,
    subject: "E-Commerce",
    from_name: formData.name,
  };

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success) {
      toast.success(
        <span className="flex items-center gap-2">
         
          Message sent successfully!
        </span>
      );
      setFormData({
        name: '',
        email: '',
        inquiryType: '',
        orderId: '',
        message: '',
      });
    } else {
      toast.error(
        <span className="flex items-center gap-2">
        
          Something went wrong. Try again.
        </span>
      );
    }
  } catch (error) {
    toast.error(
      <span className="flex items-center gap-2">
        
        Submission failed. Check your network.
      </span>
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className=" min-h-screen py-1 px-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-4xl mx-auto p-8 rounded-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-6 text-center">Customer Support</h2>
        <p className="text-center text-gray-600 mb-8">
          Have a question about your order or need help with a product? Reach out and we'll be in touch!
        </p>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-red-600 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
              placeholder="Enter Your Full Name"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-red-600 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
              placeholder="Enter Your Email Address"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Inquiry Type</label>
            <select
              name="inquiryType"
              required
              value={formData.inquiryType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-red-600 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="" disabled>Select an option</option>
              <option value="order">Order Issue</option>
              <option value="product">Product Inquiry</option>
              <option value="return">Returns & Refunds</option>
              <option value="general">General Question</option>
            </select>
          </div>

          {formData.inquiryType === 'order' && (
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Order ID (Optional)</label>
              <input
                type="text"
                name="orderId"
                value={formData.orderId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-red-600 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="#123456"
              />
            </div>
          )}

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Message</label>
            <textarea
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-2 border border-red-600 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
              placeholder="Describe your issue or question..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            } bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition`}
          >
            {isSubmitting ? 'Sending...' : 'Submit Request'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Our support team will respond within 1–2 business days.
        </p>
      </div>
    </div>
  );
}
