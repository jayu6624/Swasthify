
import React, { useState, useEffect } from 'react';
// Import icons from react-icons
import { 
  FaHome, FaUtensils, FaRunning, FaChartBar, FaWater,
  FaBed, FaHeartbeat, FaWalking, FaCamera, FaBell, FaUser,
  FaChevronLeft, FaChevronRight, FaPlus
} from 'react-icons/fa';


const TopNavigation = () => {
    return (
      <div className="bg-white p-4 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500">Track your health and fitness goals</p>
        <div className="flex items-center space-x-4">
          <button className="relative">
            <FaBell className="text-gray-500" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              1
            </span>
          </button>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <FaUser className="text-gray-500" />
          </div>
        </div>
      </div>
    );
  };
  
  export default TopNavigation;