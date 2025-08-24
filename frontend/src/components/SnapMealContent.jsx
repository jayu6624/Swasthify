
import React, { useState, useEffect } from 'react';
// Import icons from react-icons
import { 
  FaHome, FaUtensils, FaRunning, FaChartBar, FaWater,
  FaBed, FaHeartbeat, FaWalking, FaCamera, FaBell, FaUser,
  FaChevronLeft, FaChevronRight, FaPlus
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
const SnapMealContent = () => {
    return (
      <div className="h-full flex flex-col">
        <h2 className="text-xl font-semibold mb-2">Snap Meal</h2>
        <p className="text-gray-500 mb-8">Use your camera to log meals and get nutritional information</p>
        
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
          <div className="text-green-700 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="font-medium text-lg mb-2">Click to upload</h3>
          <p className="text-sm text-gray-500 mb-2">or drag and drop</p>
          <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 10MB)</p>
        </div>
        
        <motion.button 
          className="mt-6 bg-green-700 text-white py-3 rounded-md hover:bg-green-800 transition-colors w-64 mx-auto"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Upload Photo
        </motion.button>
      </div>
    );
  };
  
  // Support Chat Button Component
  const SupportChatButton = () => {
    return (
      <motion.div 
        className="fixed bottom-4 right-4 bg-green-500 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </motion.div>
    );
  };
  
  // Additional health component for the dashboard
  const HealthModalComponent = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <motion.div 
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add Health Data</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Measurement Type</label>
              <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>Weight</option>
                <option>Blood Pressure</option>
                <option>Blood Sugar</option>
                <option>Body Temperature</option>
                <option>Heart Rate</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <div className="flex">
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter value"
                />
                <span className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-md py-2 px-3 text-gray-500">
                  kg
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
              <input 
                type="datetime-local" 
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea 
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="3"
                placeholder="Add any additional notes"
              />
            </div>
          </div>
          
          <div className="mt-6 flex space-x-3">
            <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button className="flex-1 bg-green-700 text-white py-2 rounded-md hover:bg-green-800">
              Save
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
  export default SnapMealContent;