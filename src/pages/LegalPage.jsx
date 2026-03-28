import React from "react";
import { useParams } from "react-router-dom";

/* ===============================
   DATA CONFIG
=============================== */
const legalContent = {
  terms: {
    title: "Terms & Conditions",
    desc: "Understand the rules and guidelines for using our platform.",
    sections: [
      { title: "Use of Website", content: "You agree not to misuse the platform or engage in illegal activities." },
      { title: "Products", content: "Products are subject to availability and may change without notice." },
      { title: "Pricing", content: "All prices are in INR and may change anytime." },
      { title: "Orders", content: "We reserve the right to cancel orders due to errors or fraud." },
      { title: "Returns", content: "Returns are accepted within 7 days under valid conditions." },
      { title: "Liability", content: "We are not responsible for indirect damages or delays." },
      { title: "Contact", content: "support@eshop.debasish.xyz" },
    ],
  },

  privacy: {
    title: "Privacy Policy",
    desc: "Learn how we collect, use, and protect your data.",
    sections: [
      { title: "Information We Collect", content: "Name, email, address, and usage data." },
      { title: "How We Use Data", content: "To process orders and improve user experience." },
      { title: "Data Protection", content: "We use secure systems to protect your data." },
      { title: "Cookies", content: "We use cookies to enhance user experience." },
      { title: "Contact", content: "support@eshop.debasish.xyz" },
    ],
  },

  refund: {
    title: "Refund Policy",
    desc: "Know when and how refunds are processed.",
    sections: [
      { title: "Eligibility", content: "Items must be unused and returned within 7 days." },
      { title: "Refund Process", content: "Refunds are processed within 5–10 business days." },
      { title: "Non-refundable Items", content: "Certain items are not eligible for refunds." },
    ],
  },

  shipping: {
    title: "Shipping Policy",
    desc: "Delivery timelines, charges, and shipping details.",
    sections: [
      { title: "Delivery Time", content: "Orders are delivered within 3–7 business days." },
      { title: "Charges", content: "Shipping charges depend on location." },
      { title: "Delays", content: "Delays may occur due to logistics issues." },
    ],
  },
};

/* ===============================
   COMPONENT
=============================== */
const LegalPage = () => {
  const { type } = useParams();
  const page = legalContent[type];

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-xl">
        Page not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-gray-800">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto px-6 pt-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-700">
          {page.title}
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          {page.desc}
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-9">
        <div className="bg-white/50 rounded-3xl shadow-xl border border-indigo-300 p-6 md:p-10">

          <div className="grid md:grid-cols-2 gap-6">
            {page.sections.map((sec, index) => (
              <div
                key={index}
                className="group p-5 rounded-xl border border-indigo-200 bg-white/70 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <h2 className="text-lg font-semibold text-indigo-600 mb-2">
                  {index + 1}. {sec.title}
                </h2>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {sec.content}
                </p>

                {/* Accent Line */}
                <div className="mt-3 h-1 w-0 bg-indigo-500 rounded-full group-hover:w-12 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER NOTE */}
        <div className="text-center text-sm text-gray-500 mt-10">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;