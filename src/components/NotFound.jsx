import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '../assets/notfound.json';
import FuzzyText from './FuzzyText';

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="flex items-center justify-center min-h-full px-4 py-9">
      <div className="rounded-xl max-w-xl w-full px-6 py-3 text-center">
        
        {/* Animation */}
       <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto mb-6">
  <Lottie
    animationData={animationData}
    loop
    style={{ width: "100%", height: "100%" }}
  />
</div>

        {/* Fuzzy 404 Text
        <div className="mb-4 flex items-center justify-center">
          <FuzzyText
            fontSize="clamp(4rem, 20vw, 9rem)"
            fontWeight={900}
            color="#4F46E5"
            baseIntensity={0.15}
            hoverIntensity={0.5}
          >
            404
          </FuzzyText>
        </div> */}

        {/* Message */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </h2>

        <p className="text-sm sm:text-base text-gray-600 mb-1">
          The page{" "}
          <code className="bg-gray-100 px-2 py-1 rounded text-indigo-600 font-mono">
            {location.pathname}
          </code>{" "}
          doesn’t exist.
        </p>

        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Sorry, the page you’re looking for doesn’t exist or might have been moved.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="
          inline-block
          bg-gradient-to-r from-blue-600 to-indigo-600
          text-white
          px-6 py-3
          rounded-md
          text-sm sm:text-base
          font-semibold
          hover:from-blue-700 hover:to-indigo-700
          hover:shadow-[0_8px_25px_rgba(99,102,241,0.35)]
          transition
          focus:outline-none
          focus:ring-2
          focus:ring-indigo-400
          focus:ring-offset-2
          mb-9
          "
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;