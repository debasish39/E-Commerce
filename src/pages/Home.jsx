import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import ProductFilter from "../components/ProductFilter"; // ✅ New
import Carousel from "../components/Carousel";
import MidBanner from "../components/MidBanner";
import Features from "../components/Features";
import Category from "../components/Category";
import Loading from "../assets/Loading4.webm";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 300,
      easing: "ease-in-out",
      once: false,
    });

    AOS.refresh();

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 900);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-32 h-32 sm:w-48 sm:h-48 object-contain"
        >
          <source src={Loading} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }
  

  return (
    <div  className="relative min-h-screen text-gray-800  overflow-hidden">
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
      <div data-aos="fade-up">
        <Carousel />
      </div>

      <div data-aos="fade-right">
        <Category />
      </div>
      <div data-aos="zoom-in">
        <MidBanner />
      </div>
      <div data-aos="fade-left">
        <Features />
      </div>
    </div>
  );
}
