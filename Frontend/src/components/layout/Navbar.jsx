import React from 'react'
import { Link } from 'react-router-dom'
import Login from '../../pages/Login'

const Navbar = () => {
  return (
    <div className='bg-white border-b-2 border-gray-300 h-[10%] flex items-center justify-between px-10'>
      <h1 className='text-black text-2xl font-bold bg-gray-200 px-3 py-1 rounded-3xl' >BIT Academy</h1>
      <div>
        <Link to='/login' className='text-lg font-bold text-white bg-blue-800 px-3 py-2 rounded-lg'>Login</Link>
      </div>
    </div>
  )
}

export default Navbar

