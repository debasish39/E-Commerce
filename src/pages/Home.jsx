import React, { useEffect, useState } from 'react';
import Carousel from '../components/Carousel';
import MidBanner from '../components/MidBanner';
import Features from '../components/Features';
import Category from '../components/Category';
import Loading from '../assets/Loading4.webm'; 

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (like fetching data or waiting for initial animation)
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 900); // 2 seconds

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
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
    <div>
      <Carousel />
      <Category />
      <MidBanner />
      <Features />
    </div>
  );
}
