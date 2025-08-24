import React, { useState, useEffect } from 'react';
// Import icons from react-icons
import { 
  FaHome, FaUtensils, FaRunning, FaChartBar, FaWater,
  FaBed, FaHeartbeat, FaWalking, FaCamera, FaBell, FaUser,
  FaChevronLeft, FaChevronRight, FaPlus
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
const TodayActivityCard = ({ userData }) => {
    return (
      <motion.div 
        className="bg-white p-4 rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-semibold text-lg mb-1">Today's Activity</h2>
        <p className="text-sm text-gray-500 mb-4">Track your activities throughout the day</p>
        
        <h3 className="font-medium text-sm mb-2">Today's Activity Summary</h3>
        
        <div className="space-y-3">
          {userData.activities.map((activity, index) => (
            <motion.div 
              key={index} 
              className="flex items-center p-2 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                {activity.type === 'Walking' && <FaWalking />}
                {activity.type === 'Cycling' && <FaRunning />}
                {activity.type === 'Gym' && <FaHeartbeat />}
              </div>
              <div className="ml-3">
                <div className="font-medium">{activity.type}</div>
                <div className="text-xs text-gray-500">{activity.duration}</div>
              </div>
              <div className="ml-auto text-sm font-medium">{activity.calories} cal</div>
            </motion.div>
          ))}
        </div>
        
        <motion.button 
          className="mt-4 w-full border border-green-700 text-green-700 py-2 rounded-md text-sm hover:bg-green-700 hover:text-white transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Add New Activity
        </motion.button>
      </motion.div>
    );
  };
  
  export default TodayActivityCard;