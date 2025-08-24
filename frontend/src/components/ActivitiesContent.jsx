import React, { useState, useEffect } from "react";
// Import icons from react-icons
import {
  FaHome,
  FaUtensils,
  FaRunning,
  FaChartBar,
  FaWater,
  FaBed,
  FaHeartbeat,
  FaWalking,
  FaCamera,
  FaBell,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ActivitiesContent = ({ userData }) => {
  return (
    <div className="h-full">
      <h2 className="text-xl font-semibold mb-6">Activity Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="bg-white p-5 rounded-lg shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-semibold text-lg mb-4">Daily Activities</h3>
          <div className="space-y-4">
            {userData.activities.map((activity, index) => (
              <motion.div
                key={index}
                className="p-4 bg-gray-50 rounded-lg flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-xl">
                  {activity.type === "Walking" && <FaWalking />}
                  {activity.type === "Cycling" && <FaRunning />}
                  {activity.type === "Gym" && <FaHeartbeat />}
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-lg">{activity.type}</h4>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500 mr-3">
                      {activity.duration}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {activity.calories} cal
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="mt-6 w-full bg-green-700 text-white py-3 rounded-md hover:bg-green-800 transition-colors">
            Record New Activity
          </button>
        </motion.div>

        <motion.div
          className="bg-white p-5 rounded-lg shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold text-lg mb-4">Activity Stats</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="text-sm text-gray-500">Total Steps</h4>
              <div className="text-2xl font-bold mt-1">
                {userData.steps.current}
              </div>
              <div className="mt-2 text-xs text-green-700">
                {Math.round(
                  (userData.steps.current / userData.steps.goal) * 100
                )}
                % of daily goal
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm text-gray-500">Calories Burned</h4>
              <div className="text-2xl font-bold mt-1">870</div>
              <div className="mt-2 text-xs text-blue-700">
                43% of daily goal
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="text-sm text-gray-500">Active Minutes</h4>
              <div className="text-2xl font-bold mt-1">135</div>
              <div className="mt-2 text-xs text-purple-700">
                90% of daily goal
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="text-sm text-gray-500">Distance</h4>
              <div className="text-2xl font-bold mt-1">6.2 km</div>
              <div className="mt-2 text-xs text-yellow-700">
                62% of daily goal
              </div>
            </div>
          </div>
          <h4 className="font-medium mb-2">Weekly Progress</h4>
          <div className="h-40 bg-gray-50 rounded-lg flex items-end justify-between p-3">
            {[65, 40, 85, 70, 95, 50, 60].map((height, index) => (
              <motion.div
                key={index}
                className="w-8 bg-green-500 rounded-t-sm"
                style={{ height: `${height}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default ActivitiesContent;
