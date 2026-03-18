import React from 'react'
import banner from '../assets/midbanner.png'
import { useNavigate } from 'react-router-dom'

const MidBanner = () => {
  const navigate = useNavigate();
  return (
    <div className='md:py-24 py-0'>
      <div className='relative max-w-full mx-auto  md:rounded-2xl  pt-12 sm:pt-28 bg-cover bg-center h-[550px] md:h-[600px] ' style={{ backgroundImage: `url(${banner})`, backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className='absolute inset-0 bg-black/60 md:rounded-2xl bg-opacity-50 flex items-center justify-center'>
          <div className='text-center text-white px-4'>
            <h1 className='text-3xl md:text-5xl lg:text-6xl font-bold mb-4'>Next-Gen Electronics at Your Fingertips</h1>
            <p className='text-lg md:text-xl mb-6'>Discover the latest tech innovations with unbeatable prices and free shipping on all orders.</p>
        <button
  className="
  bg-gradient-to-r from-blue-600 to-indigo-600
  hover:from-blue-700 hover:to-indigo-700
  text-white
  font-semibold
  py-2 px-4 md:py-3 md:px-6
  rounded-lg
  transition duration-300
  hover:shadow-[0_8px_25px_rgba(99,102,241,0.35)]
  hover:scale-[1.03]
  active:scale-[0.97]
  cursor-pointer
  "
  onClick={() => navigate('/category/smartphones')}
>
  Shop Smartphones
</button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default MidBanner