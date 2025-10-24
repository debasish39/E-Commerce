import React from 'react';
import Slider from 'react-slick';
import { Truck, Lock, RotateCcw, Clock } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const features = [
  { icon: Truck, text: 'Free Shipping', subtext: 'On orders over ₹100' },
  { icon: Lock, text: 'Secure Payment', subtext: '100% protected payments' },
  { icon: RotateCcw, text: 'Easy Returns', subtext: '30-day return policy' },
  { icon: Clock, text: '24/7 Support', subtext: 'Dedicated customer service' },
];

const Features = () => {
  const settings = {
    // dots: true,
    autoplay:true,
    autoplaySpeed: 3000,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
      {/* Mobile Carousel */}
<div className="sm:hidden">
  <Slider {...settings}>
    {features.map((feature, index) => (
      <div
        key={index}
        className="flex flex-row items-center justify-center text-center relative  gap-4 ml-6"
      >
        <div>
        <feature.icon className="sm:h-10 sm:w-10 h-9 w-9 text-red-500 mb-2 absolute flex items-center" aria-hidden="true" />
        </div>
        <div>
        <p className="text-base font-medium text-gray-900">{feature.text}</p>
        <p className="mt-1 text-sm text-gray-800">{feature.subtext}</p>
        </div>
      </div>
    ))}
  </Slider>
</div>


        {/* Desktop Flex/Grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center text-left">
              <feature.icon className="h-10 w-10 text-red-500" aria-hidden="true" />
              <div className="ml-4">
                <p className="text-base font-medium text-gray-900">{feature.text}</p>
                <p className="mt-1 text-sm text-gray-800">{feature.subtext}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Features;
