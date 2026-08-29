import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Carousel from "../components/Carousel";
import MidBanner from "../components/MidBanner";
import Features from "../components/Features";
import Category from "../components/Category";
import RandomProducts from "../components/RandomProducts";
import TrendingProducts from "../components/TrendingProducts";
import PeopleAlsoView from "../components/PeopleAlsoView";
import RecentlyViewed from "../components/RecentlyViewed";
import BestSellerProducts from "../components/BestSellerrProducts";
import PopulartProducts from "../components/PopulartProducts";
import TopRatedProducts from "../components/TopRatedProducts";
import FeaturedProducts from "../components/FeaturedProducts";
import NewArrivalProducts from "../components/NewArrivalProducts";
export default function Home() {

  useEffect(() => {
    AOS.init({
      duration: 400,
      easing: "ease-in-out",
      once: false,
      offset: 40,
    });

    return () => {};
  }, []);

  return (
    <div className="relative min-h-screen text-gray-800 overflow-hidden duration-500">

      <div data-aos="fade-up">
        <Carousel />
      </div>
 <div data-aos="fade-up">
        <RecentlyViewed />
      </div>
      <div data-aos="fade-right">
        <BestSellerProducts />
      </div>
      <div data-aos="fade-up">
        <PopulartProducts />
      </div>
      
  
     <div data-aos="fade-up">
        <TopRatedProducts />
      </div>
      
      <div data-aos="fade-up">
        <FeaturedProducts />
      </div>  
      <div data-aos="fade-up">
        <NewArrivalProducts/>
      </div>
    
    </div>
  );
}