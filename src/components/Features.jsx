import React from "react";
import Slider from "react-slick";
import { Truck, Lock, RotateCcw, Clock } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const features = [
  { icon: Truck, text: "Fast Delivery", subtext: "Get your order in record time" },
  { icon: Lock, text: "Secure Payment", subtext: "100% protected payments" },
  { icon: RotateCcw, text: "Easy Returns", subtext: "7-days return policy" },
  { icon: Clock, text: "24/7 Support", subtext: "Dedicated customer service" },
];

const Features = () => {
  const settings = {
    autoplay: true,
    autoplaySpeed: 3500,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
  };

  return (
    <section className="relative py-20 px-6 sm:px-10 bg-transparent">

    

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Title */}
        <div className="text-center mb-14">

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-800">
            Why Shop With{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Us
            </span>
            ?
          </h2>

          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
  We deliver quality products with secure payments, fast shipping,
  and dedicated customer support.
</p>

        </div>

        {/* Mobile Slider */}
        <div className="sm:hidden">
          <Slider {...settings}>
            {features.map((feature, index) => (
              <div key={index} className="px-3">
                <FeatureCard feature={feature} />
              </div>
            ))}
          </Slider>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>

      </div>
    </section>
  );
};

const FeatureCard = ({ feature }) => {
  const Icon = feature.icon;

  return (
    <div
    className="
group relative p-6 rounded-3xl text-center
border border-blue-100
bg-white
shadow-md
transition-all duration-500
hover:shadow-[0_10px_35px_rgba(59,130,246,0.25)]
hover:-translate-y-1
hover:border-blue-400
"
    >

      {/* hover glow */}
<div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/0 via-blue-500/15 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />

      {/* icon container */}
      <div
        className="
w-14 h-14 mx-auto mb-4 flex items-center justify-center
rounded-xl bg-blue-500/10 text-blue-600
group-hover:scale-110 transition-transform duration-500
"
      >
        <Icon size={26} />
      </div>

     <h3 className="text-lg font-semibold text-gray-800">
  {feature.text}
</h3>

    <p className="mt-1 text-sm text-gray-600">
  {feature.subtext}
</p>

    </div>
  );
};

export default Features;