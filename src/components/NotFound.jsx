import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '../assets/notfound.json';
import FuzzyText from './FuzzyText';
import { useLocation } from 'react-router-dom';

const NotFound = () => {
    const location = useLocation();
    console.log(location.pathname); // logs the current path like "/nonexistent"

  return (
    <div className="flex items-center justify-center min-h-full px-4 py-3">
      <div className="  rounded-xl max-w-xl w-full px-6 py-3 text-center  ">
        {/* Animation */}
        <div className="w-64 sm:w-72 mx-auto mb-6">
          <Lottie animationData={animationData} loop={true} />
        </div>

        {/* Fuzzy 404 Text */}
        <div className="mb-4 flex items-center justify-center">
          <FuzzyText
            fontSize="clamp(4rem, 20vw, 9rem)"
            fontWeight={900}
            color="#E7000B"
            baseIntensity={0.15}
            hoverIntensity={0.5}
          >
            404
          </FuzzyText>
        </div>

        {/* Message */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </h2>
         <p className="text-sm sm:text-base text-gray-600 mb-1">
          The page <code className="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono">{location.pathname}</code> doesn’t exist.
        </p>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Sorry, the page you’re looking for doesn’t exist or might have been moved.
        </p>

        {/* Call to Action */}
        <Link
          to="/"
          className="inline-block bg-red-600 text-white px-6 py-3 rounded-md text-sm sm:text-base font-semibold hover:bg-red-500 transition focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 mb-9"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
