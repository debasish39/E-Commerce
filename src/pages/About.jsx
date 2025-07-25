import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto px-6 py-16">
        {/* Heading */}
        <h1
          className="text-3xl md:text-5xl font-bold text-red-600 text-center mb-12"
          data-aos="fade-down"
        >
          About this Website
        </h1>

        {/* Info Card */}
        <div
          className="backdrop-blur shadow-xl rounded-3xl p-8 md:p-12 space-y-8 border border-red-100"
          data-aos="fade-up"
        >
          <p className="text-lg text-gray-800 leading-relaxed">
            👋 Welcome to <span className="font-bold text-red-600">E-Com</span>, your go-to
            destination for quality products at unbeatable prices. We're a passionate team of
            developers and designers committed to creating a seamless shopping experience.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed">
            🛍 Whether you're looking for the latest gadgets, trendy fashion, or home essentials,
            we’ve got something for everyone. Our catalog features smart filtering, powerful search,
            and responsive design — all built with modern technologies.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed">
            💻 This project is part of a full-stack eCommerce app, showcasing frontend filtering,
            dynamic product listings, and polished UI. Stay tuned for more features like user
            authentication, shopping cart, and payment integrations!
          </p>

          {/* Technologies */}
          <div className="text-lg text-gray-800 leading-relaxed space-y-2">
            <h2 className="font-semibold text-gray-900 text-xl">🧩 Technologies Used:</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>⚛️ React.js</li>
              <li>🎨 Tailwind CSS</li>
              <li>🧠 Context API for state management</li>
              <li>🔐 Clerk for authentication</li>
              <li>
                🔍 APIs:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded text-sm text-blue-600">
                  https://dummyjson.com/products
                </code>{" "}
                (recommended),{" "}
                <code className="bg-gray-100 px-2 py-1 rounded text-sm text-blue-600">
                  https://fakestoreapi.in
                </code>
              </li>
            </ul>
          </div>

          {/* Geo API Highlight Block */}
          <div
            className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-md"
            data-aos="fade-up"
          >
            <p className="text-gray-800">
              🌐 Planning to personalize based on user location? Use the{" "}
              <code className="bg-gray-100 px-2 py-1 rounded text-sm text-blue-600">
                https://api.geoapify.com/v1/geocode/
              </code>{" "}
              API to fetch geolocation data and enhance your user experience!
            </p>
          </div>
        </div>

      
      </div>
    </div>
  );
}
