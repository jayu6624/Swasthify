import React, { useState, useEffect } from 'react';
// Import icons from react-icons
import { 
  FaHome, FaUtensils, FaRunning, FaChartBar, FaWater,
  FaBed, FaHeartbeat, FaWalking, FaCamera, FaBell, FaUser,
  FaChevronLeft, FaChevronRight, FaPlus
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import MacronutrientsList from './MacronutrientsList'; // Assuming you have this component


const CalorieIntakeCard = ({ userData }) => {
    const caloriePercentage = Math.round((userData.currentCalories / userData.calorieGoal) * 100);
  
    return (
      <motion.div 
        className="bg-white p-4 rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="font-semibold text-lg mb-4">Calorie Intake</h2>
        <div className="flex">
          {/* Calorie Circle */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                className="text-gray-100"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
              <circle
                className="text-green-600"
                strokeWidth="8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
                strokeDasharray={`${2 * Math.PI * 58}`}
                strokeDashoffset={`${2 * Math.PI * 58 * (1 - caloriePercentage / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-green-700">{caloriePercentage}%</span>
              <span className="text-xs text-gray-500">of daily goal</span>
            </div>
          </div>
  
          {/* Macronutrients Breakdown */}
          <MacronutrientsList userData={userData} />
        </div>
        <div className="mt-4 text-center text-sm font-medium text-gray-700">
          {userData.currentCalories} / {userData.calorieGoal} calories
        </div>
      </motion.div>
    );
  };
  export default CalorieIntakeCard;