import React, { useState, useEffect } from 'react';
// Import icons from react-icons
import { 
  FaHome, FaUtensils, FaRunning, FaChartBar, FaWater,
  FaBed, FaHeartbeat, FaWalking, FaCamera, FaBell, FaUser,
  FaChevronLeft, FaChevronRight, FaPlus
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
const Card = ({ title, children, className = "" }) => {
    return (
      <motion.div 
        className={`bg-white p-5 rounded-lg shadow-sm ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {title && <h3 className="font-semibold text-lg mb-4">{title}</h3>}
        {children}
      </motion.div>
    );
  };
  export default Card;