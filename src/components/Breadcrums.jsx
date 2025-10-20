import React from 'react'
import { useNavigate } from 'react-router-dom'

const Breadcrums = ({title}) => {
    const navigate = useNavigate()
  return (
    <div className='max-w-6xl mx-auto my-10 '>
      <h1 className='text-gray-700 font-semibold '><span className='cursor-pointer text-[12px] sm:text-xl' onClick={()=>navigate('/')}>Home</span> / <span className='cursor-pointer text-[12px] sm:text-xl' onClick={()=>navigate('/products')}>Products</span> / <span className='text-[13px] sm:text-xl'>{title}</span></h1>
    </div>
  )
}

export default Breadcrums