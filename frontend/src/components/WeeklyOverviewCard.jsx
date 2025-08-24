import React, { useState, useEffect } from 'react';
// Import icons from react-icons
import { 
  FaHome, FaUtensils, FaRunning, FaChartBar, FaWater,
  FaBed, FaHeartbeat, FaWalking, FaCamera, FaBell, FaUser,
  FaChevronLeft, FaChevronRight, FaPlus
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
const WeeklyOverviewCard = ({ userData }) => {
    return (
      <motion.div 
        className="bg-white p-4 rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-semibold text-lg mb-2">Weekly Overview</h2>
        <p className="text-sm text-gray-500 mb-4">Your calorie intake for the past week</p>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Calorie Intake</span>
          <div className="flex items-center">
            <span className="text-green-600 text-sm font-medium">+5%</span>
          </div>
        </div>
        <div className="text-sm text-gray-500 mb-3">This Week vs Last Week</div>
        
        {/* Weekly Bar Chart */}
        <div className="space-y-2">
          {userData.weeklyCalories.map((day, index) => (
            <motion.div 
              key={index} 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <span className="w-8 text-sm">{day.day}</span>
              <div className="flex-1 ml-2">
                <div className="w-full bg-gray-100 rounded-full h-6 flex items-center">
                  <motion.div 
                    className="bg-green-500 h-6 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(day.calories / 2000) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 + index * 0.05 }}
                  />
                </div>
              </div>
              <span className="ml-2 text-sm text-gray-700">{day.calories} cal</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };
  export default WeeklyOverviewCard;