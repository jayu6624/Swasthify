
import React, { useState, useEffect } from 'react';
// Import icons from react-icons
import { 
  FaHome, FaUtensils, FaRunning, FaChartBar, FaWater,
  FaBed, FaHeartbeat, FaWalking, FaCamera, FaBell, FaUser,
  FaChevronLeft, FaChevronRight, FaPlus
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
const ProgressBar = ({ value, max, color = "bg-green-600", height = "h-2", showText = false }) => {
    const percentage = Math.min(Math.round((value / max) * 100), 100);
    
    return (
      <div className="w-full">
        {showText && (
          <div className="flex justify-between text-sm mb-1">
            <span>{value} / {max}</span>
            <span>{percentage}%</span>
          </div>
        )}
        <div className={`w-full bg-gray-200 rounded-full ${height}`}>
          <motion.div 
            className={`${color} ${height} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    );
  };
  
  export default ProgressBar;