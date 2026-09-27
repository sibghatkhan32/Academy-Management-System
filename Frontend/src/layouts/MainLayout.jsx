import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'// Adjust the path based on your folder structure
import Navbar from '../components/layout/Navbar'  // Adjust the path based on your folder structure

const MainLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 ">
      {/* 1. Left Sidebar - Stays fixed on the screen */}
      <Sidebar />
            
      {/* 2. Right Side Area - Contains Navbar + Main Dynamic Content */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        {/* Top Navbar - Stays fixed at the top of the right panel */}
        <Navbar />

        {/* Dynamic Screen Content - Only this part will scroll if needed */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default MainLayout
