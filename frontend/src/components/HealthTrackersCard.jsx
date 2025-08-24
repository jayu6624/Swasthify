import React, { useState, useEffect } from 'react';
// Import icons from react-icons
import { 
  FaHome, FaUtensils, FaRunning, FaChartBar, FaWater,
  FaBed, FaHeartbeat, FaWalking, FaCamera, FaBell, FaUser,
  FaChevronLeft, FaChevronRight, FaPlus
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const HealthTrackersCard = ({ userData }) => {
    const trackers = [
      {
        name: 'Water',
        icon: <FaWater className="text-blue-500 mr-2" />,
        value: `${userData.water.current}/${userData.water.goal} glasses`,
        progress: (userData.water.current / userData.water.goal) * 100,
        bgColor: 'bg-blue-50',
        progressColor: 'bg-blue-500',
        type: 'progress'
      },
      {
        name: 'Sleep',
        icon: <FaBed className="text-indigo-500 mr-2" />,
        value: `${userData.sleep.hours} hrs`,
        subtitle: `Quality: ${userData.sleep.quality}`,
        bgColor: 'bg-indigo-50',
        type: 'info'
      },
      {
        name: 'Heart Rate',
        icon: <FaHeartbeat className="text-red-500 mr-2" />,
        value: `${userData.heartRate.current} BPM`,
        subtitle: `Min: ${userData.heartRate.min} • Max: ${userData.heartRate.max}`,
        bgColor: 'bg-red-50',
        type: 'info'
      },
      {
        name: 'Steps',
        icon: <FaWalking className="text-green-500 mr-2" />,
        value: `${userData.steps.current}/${userData.steps.goal}`,
        progress: (userData.steps.current / userData.steps.goal) * 100,
        bgColor: 'bg-green-50',
        progressColor: 'bg-green-500',
        type: 'progress'
      }
    ];
  
    return (
      <motion.div 
        className="bg-white p-4 rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="font-semibold text-lg mb-4">Health Trackers</h2>
        <div className="grid grid-cols-2 gap-4">
          {trackers.map((tracker, index) => (
            <motion.div 
              key={index} 
              className={`p-3 ${tracker.bgColor} rounded-lg`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {tracker.icon}
                  <h3 className="font-medium text-sm">{tracker.name}</h3>
                </div>
                <span className="text-sm font-medium">{tracker.value}</span>
              </div>
              {tracker.type === 'progress' ? (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className={`${tracker.progressColor} h-2 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${tracker.progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 + index * 0.1 }}
                  />
                </div>
              ) : (
                <div className="text-xs text-gray-600">{tracker.subtitle}</div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };
  
  export default HealthTrackersCard;