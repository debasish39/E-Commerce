import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true });
  }, []);

  return (
    <section
      className="relative min-h-screen text-gray-800 py-20 px-6 md:px-12 overflow-hidden"
    >
       
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-red-500/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-500/20 blur-[150px] rounded-full animate-[float_8s_infinite_linear]" />
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-25px); }
          }
        `}</style>
      </div>
      <div className="relative z-10   text-center">
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
          className=" md:p-12 shadow-lg hover:shadow-2xl transition-all"
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
