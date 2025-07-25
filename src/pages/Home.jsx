import React from 'react'
import Carousel from '../components/Carousel'
import MidBanner from '../components/MidBanner'
import Features from '../components/Features'
import Category from '../components/Category'
// import Footer from '../components/Footer'
export default function Home() {
  return (
    <div className=''>
        <Carousel/>
        <Category/>
        <MidBanner/>
        <Features/>
        
    </div>
  )
}
