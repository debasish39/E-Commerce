import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { FaUser, FaEnvelope, FaFileAlt } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "../components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "",
    orderId: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  /* ================= FAQ STATE ================= */
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How can I track my order?",
      answer:
        "After placing an order, you will receive a tracking ID via email. You can use the order tracking page to check the status.",
    },
    {
      question: "What is your return policy?",
      answer:
        "You can request a return within 7 days of delivery if the product is damaged or defective.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Shipping usually takes 3–5 business days depending on your location.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can contact our support team using the form above or email us at djproject963@gmail.com.",
    },
  ];

  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim())
      newErrors.name = "Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email))
        newErrors.email = "Invalid email format";
    }

    if (!formData.inquiryType)
      newErrors.inquiryType = "Please select inquiry type";

    if (
      formData.inquiryType === "order" &&
      !formData.orderId.trim()
    )
      newErrors.orderId = "Order ID is required";

    if (!formData.message.trim())
      newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10)
      newErrors.message =
        "Message must be at least 10 characters";

    return newErrors;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the form errors.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      access_key: accessKey,
      ...formData,
      subject: "E-Commerce Inquiry",
      from_name: formData.name.trim(),
    };

    try {
      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Message sent successfully!");

        setFormData({
          name: "",
          email: "",
          inquiryType: "",
          orderId: "",
          message: "",
        });

        setErrors({});
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } catch {
      toast.error("Submission failed. Check your network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen py-12 px-4 bg-transparent relative">
        <Toaster position="top-right" richColors closeButton theme="dark" />

        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-10">
          
          {/* MAP */}
          <div
            className="w-full lg:w-1/2 h-[400px] lg:h-[80vh] rounded-2xl overflow-hidden"
            data-aos="fade-right"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.9316664188245!2d85.61682517655123!3d20.13223376978005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19ad20457753ef%3A0x8d2834dd8305ea76!2sEinstein%20Academy%20of%20Technology%20and%20Management!5e1!3m2!1sen!2sin!4v1761017897848!5m2!1sen!2sin"
              className="w-full h-full"
              style={{ border: 0 }}
              loading="lazy"
              title="Google Map"
            ></iframe>
          </div>

          {/* FORM */}
          <div
            className="w-full lg:w-1/2 flex flex-col"
            data-aos="fade-left"
          >
            <h2 className="text-3xl font-bold text-center text-red-600 mb-4">
              Customer Support
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* NAME */}
              <div>
                <div className="relative">
                  <FaUser className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-10 px-4 py-2 rounded-lg border bg-transparent ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <div className="relative">
                  <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full pl-10 px-4 py-2 rounded-lg border bg-transparent ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* INQUIRY TYPE */}
              <div>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border bg-transparent ${
                    errors.inquiryType ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Inquiry Type</option>
                  <option value="order">Order Issue</option>
                  <option value="product">Product Inquiry</option>
                  <option value="return">Returns & Refunds</option>
                  <option value="general">General Question</option>
                </select>
                {errors.inquiryType && (
                  <p className="text-red-500 text-sm">
                    {errors.inquiryType}
                  </p>
                )}
              </div>

              {/* ORDER ID */}
              {formData.inquiryType === "order" && (
                <div>
                  <input
                    type="text"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleChange}
                    placeholder="#123456"
                    className={`w-full px-4 py-2 rounded-lg border bg-transparent ${
                      errors.orderId ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.orderId && (
                    <p className="text-red-500 text-sm">
                      {errors.orderId}
                    </p>
                  )}
                </div>
              )}

              {/* MESSAGE */}
              <div>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message..."
                  className={`w-full px-4 py-2 rounded-lg border bg-transparent ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-red-500 to-black/90 hover:from-red-600 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <IoIosSend /> Submit Request
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-gray-400 text-sm">
              Our support team responds within 1–2 business days.
            </div>
          </div>
        </div>

      {/* FAQ SECTION */}
<div className="max-w-7xl mx-auto mt-9 px-4">

  <h2 className="text-3xl md:text-4xl font-bold text-center mb-10
  bg-gradient-to-r from-red-500 to-black/30 bg-clip-text text-transparent">
    Frequently Asked Questions
  </h2>

  <div className="space-y-4">

    {faqs.map((faq, index) => (
      <div
        key={index}
        className="rounded-2xl border border-red-500/20
        bg-black/30 backdrop-blur-md
        shadow-md hover:border-red-500/40
        transition-all duration-300"
      >

        <button
          onClick={() => toggleFAQ(index)}
          className="w-full flex justify-between items-center
          px-6 py-4 text-left"
        >

          <span className="text-white font-semibold text-base md:text-lg">
            {faq.question}
          </span>

          <span
            className={`text-red-500 text-2xl transition-transform duration-300 ${
              openFAQ === index ? "rotate-45" : "rotate-0"
            }`}
          >
            +
          </span>

        </button>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            openFAQ === index
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="px-6 pb-5 text-gray-300 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>

      </div>
    ))}

  </div>

</div>
      </div>

      <Footer />
    </>
  );
}