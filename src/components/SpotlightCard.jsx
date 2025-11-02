import React from 'react';
import Slider from 'react-slick';
import { Truck, Lock, RotateCcw, Clock } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SpotlightCard from './SpotlightCard'; // ✅ Import

const features = [
  { icon: Truck, text: 'Free Shipping', subtext: 'On orders over ₹100' },
  { icon: Lock, text: 'Secure Payment', subtext: '100% protected payments' },
  { icon: RotateCcw, text: 'Easy Returns', subtext: '30-day return policy' },
  { icon: Clock, text: '24/7 Support', subtext: 'Dedicated customer service' },
];

const Features = () => {
  const settings = {
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Mobile Carousel --- */}
        <div className="sm:hidden">
          <Slider {...settings}>
            {features.map((feature, index) => (
              <div key={index} className="flex flex-row items-center justify-center gap-4 ml-6">
                <SpotlightCard
                  spotlightColor="rgba(255, 77, 77, 0.25)"
                  className="w-[90%] bg-transparent"
                >
                  <div className="flex items-center gap-4">
                    <feature.icon className="h-8 w-8 text-red-400" />
                    <div>
                      <p className="text-base font-semibold text-white">
                        {feature.text}
                      </p>
                      <p className="mt-1 text-sm text-gray-300">
                        {feature.subtext}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            ))}
          </Slider>
        </div>

        {/* --- Desktop Grid --- */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <SpotlightCard
              key={index}
              spotlightColor="rgba(255, 77, 77, 0.25)"
              className="bg-transparent"
            >
              <div className="flex items-center text-left">
                <feature.icon className="h-10 w-10 text-red-400" />
                <div className="ml-4">
                  <p className="text-base font-semibold text-white">
                    {feature.text}
                  </p>
                  <p className="mt-1 text-sm text-gray-300">{feature.subtext}</p>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
