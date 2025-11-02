import React from "react";
import Slider from "react-slick";
import { Truck, Lock, RotateCcw, Clock } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const features = [
  { icon: Truck, text: "Fast Delivery", subtext: "Get your order in record time" },
  { icon: Lock, text: "Secure Payment", subtext: "100% protected payments" },
  { icon: RotateCcw, text: "Easy Returns", subtext: "30-day return policy" },
  { icon: Clock, text: "24/7 Support", subtext: "Dedicated customer service" },
];

const Features = () => {
  const settings = {
    autoplay: true,
    autoplaySpeed: 3500,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
  };

  return (
    <section className="relative py-14 px-4 sm:px-8 md:px-12 bg-gradient-to-br from-[#fff7f7] via-white to-[#ffeef0] dark:from-[#0d0d0d] dark:via-[#141414] dark:to-[#1a1a1a] transition-all duration-700">
      <div className="max-w-7xl mx-auto text-center">
        {/* --- Section Title --- */}
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-10 text-gray-800 dark:text-gray-100 tracking-tight"
          style={{ fontFamily: "'Poppins', sans-serif" }}
          data-aos="fade-up"
        >
          Why Shop With <span className="text-red-500 drop-shadow-md">Us?</span>
        </h2>

        {/* --- Mobile Carousel --- */}
        <div className="sm:hidden">
          <Slider {...settings}>
            {features.map((feature, index) => (
              <div key={index} className="px-6 py-4">
                <div
                  className="flex flex-col items-center justify-center p-8 bg-white/70 dark:bg-[#1e1e1e]/70 
                  backdrop-blur-lg border border-red-200/20 rounded-3xl shadow-lg hover:shadow-red-500/10 
                  transition-all duration-500 hover:scale-[1.03]"
                >
                  <feature.icon className="h-12 w-12 text-red-500 mb-3 drop-shadow-md" />
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {feature.text}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {feature.subtext}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* --- Responsive Grid (for tablets & up) --- */}
        <div
          className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 mt-6"
          data-aos="fade-up"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center text-center p-8 rounded-3xl 
              bg-white/70 dark:bg-[#1e1e1e]/70 backdrop-blur-lg border border-red-200/20 shadow-md 
              transition-all duration-500 hover:scale-[1.06] hover:shadow-xl hover:border-red-500/30"
            >
              {/* Animated Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/0 via-red-400/10 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700" />

              <feature.icon
                className="h-12 w-12 md:h-14 md:w-14 text-red-500 mb-4 drop-shadow-sm transition-transform duration-500 group-hover:scale-110"
                aria-hidden="true"
              />
              <p className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
                {feature.text}
              </p>
              <p className="mt-1 text-sm md:text-base text-gray-600 dark:text-gray-300">
                {feature.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
