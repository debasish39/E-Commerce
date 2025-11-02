import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true });
  }, []);

  return (
    <section
      className="relative min-h-screen text-gray-800 py-20 px-6 md:px-12 overflow-hidden 
                 bg-gradient-to-br from-white/60 via-red-50/60 to-transparent 
                 dark:from-[#0f0f0f]/60 dark:via-[#1a1a1a]/70 dark:to-transparent
                 backdrop-blur-md"
    >
      {/* Background Glow / Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-red-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-300/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Header */}
        <h1
          data-aos="fade-up"
          className="text-4xl md:text-6xl font-bold text-red-600 mb-10"
          style={{ fontFamily: "'Pacifico', cursive" }}
        >
          About <span className="text-gray-900 dark:text-white">E-Shop</span>
        </h1>

        {/* Description Section */}
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          className="bg-white/70 dark:bg-[#1a1a1a]/70 backdrop-blur-xl border border-red-200/20 rounded-3xl p-8 md:p-12 shadow-lg hover:shadow-2xl transition-all"
        >
          <p className="text-lg md:text-xl leading-relaxed mb-6 text-gray-700 dark:text-gray-300">
            Welcome to <span className="font-bold text-red-600">E-Shop</span>, your one-stop
            destination for modern products at unbeatable prices. Our mission is to make online
            shopping effortless, fun, and inspiring.
          </p>

          <p className="text-lg md:text-xl leading-relaxed mb-6 text-gray-700 dark:text-gray-300">
            🛍️ From the latest gadgets to lifestyle essentials — explore a curated selection of
            products built for quality and value. Enjoy a seamless browsing experience with our
            responsive UI, intelligent filters, and smooth animations.
          </p>

          <p className="text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300">
            This project is part of a full-stack eCommerce platform designed to highlight clean
            architecture, powerful state management, and top-tier UX. Future updates will include
            secure authentication, cart persistence, and payment integration!
          </p>

          {/* Technologies */}
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="mt-10 text-left md:text-center"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              🧠 Technologies Used
            </h2>
            <div className="flex flex-wrap justify-center gap-3 text-base font-medium">
              <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full border border-red-200">
                React.js
              </span>
              <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full border border-red-200">
                Tailwind CSS
              </span>
              <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full border border-red-200">
                Context API
              </span>
              <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full border border-red-200">
                AOS Animations
              </span>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p
          data-aos="fade-up"
          data-aos-delay="400"
          className="mt-12 text-gray-500 text-sm italic"
        >
          “Empowering modern eCommerce with design, speed, and simplicity.” 🚀
        </p>
      </div>
    </section>
  );
}
