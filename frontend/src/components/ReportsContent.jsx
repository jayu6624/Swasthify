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

const ReportsContent = () => {
  // Mock report data
  const reports = [
    {
      title: "Weekly Nutrition Summary",
      date: "2 days ago",
      type: "nutrition",
      summary:
        "Average calorie intake was 1,550 daily, 22% protein, 48% carbs, 30% fats",
    },
    {
      title: "Monthly Activity Report",
      date: "1 week ago",
      type: "activity",
      summary: "125,000 total steps, 2,400 calories burned on average per week",
    },
    {
      title: "Sleep Analysis",
      date: "2 weeks ago",
      type: "sleep",
      summary:
        "Average sleep 7.3 hours, sleep quality improved 12% compared to last month",
    },
  ];

  // Mock chart data
  const chartData = [10, 25, 15, 30, 35, 20, 25, 40, 30, 35, 45, 35];

  return (
    <div className="h-full">
      <h2 className="text-xl font-semibold mb-6">Reports & Analysis</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          className="bg-green-50 p-4 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-green-700 font-medium">Calorie Intake</h3>
          <div className="text-3xl font-bold my-2">1,580</div>
          <div className="text-sm text-gray-600">Daily Average</div>
          <div className="text-xs text-green-700 mt-2">↑ 5% from last week</div>
        </motion.div>

        <motion.div
          className="bg-blue-50 p-4 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-blue-700 font-medium">Water Intake</h3>
          <div className="text-3xl font-bold my-2">2.4L</div>
          <div className="text-sm text-gray-600">Daily Average</div>
          <div className="text-xs text-blue-700 mt-2">↑ 12% from last week</div>
        </motion.div>

        <motion.div
          className="bg-purple-50 p-4 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-purple-700 font-medium">Active Time</h3>
          <div className="text-3xl font-bold my-2">92 min</div>
          <div className="text-sm text-gray-600">Daily Average</div>
          <div className="text-xs text-purple-700 mt-2">
            ↑ 8% from last week
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="bg-white p-5 rounded-lg shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-lg mb-4">Monthly Trends</h3>
          <div className="h-64 flex items-end justify-between">
            {chartData.map((value, index) => (
              <motion.div
                key={index}
                className="relative w-6 bg-green-500 rounded-t-sm mx-1"
                style={{ height: `${value * 2}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${value * 2}%` }}
                transition={{ duration: 0.8, delay: 0.5 + index * 0.05 }}
                whileHover={{ backgroundColor: "#16a34a" }}
              >
                <motion.div
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-700 text-white text-xs py-1 px-2 rounded opacity-0 pointer-events-none"
                  whileHover={{ opacity: 1 }}
                >
                  {value * 20} cal
                </motion.div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-5 rounded-lg shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Recent Reports</h3>
            <button className="text-sm text-green-700 hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {reports.map((report, index) => (
              <motion.div
                key={index}
                className="p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{report.title}</h4>
                  <span className="text-xs text-gray-500">{report.date}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{report.summary}</p>
                <div className="mt-3 flex items-center">
                  <button className="text-sm text-green-700 hover:underline">
                    View Report
                  </button>
                  <span className="mx-2 text-gray-300">|</span>
                  <button className="text-sm text-gray-500 hover:underline">
                    Download PDF
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsContent;
