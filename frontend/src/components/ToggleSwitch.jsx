
import React, { useState, useEffect } from 'react';
// Import icons from react-icons
import { 
  FaHome, FaUtensils, FaRunning, FaChartBar, FaWater,
  FaBed, FaHeartbeat, FaWalking, FaCamera, FaBell, FaUser,
  FaChevronLeft, FaChevronRight, FaPlus
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
const ToggleSwitch = ({ enabled, onChange, label }) => {
    return (
      <div className="flex items-center">
        {label && <span className="mr-2 text-sm text-gray-700">{label}</span>}
        <button 
          onClick={onChange} 
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            enabled ? 'bg-green-600' : 'bg-gray-200'
          }`}
        >
          <span 
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`} 
          />
        </button>
      </div>
    );
  };

export default ToggleSwitch;