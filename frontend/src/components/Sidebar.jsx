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

const Sidebar = ({
  isCollapsed,
  toggleSidebar,
  activeSection,
  onSectionChange,
}) => {
  const sectionToIcon = {
    dashboard: <FaHome />,
    nutrition: <FaUtensils />,
    activities: <FaRunning />,
    reports: <FaChartBar />,
    snap: <FaCamera />,
  };

  const sectionToText = {
    dashboard: "Dashboard",
    nutrition: "Nutrition Advisor",
    activities: "Activities",
    reports: "Reports",
    snap: "Snap Meal",
  };

  return (
    <motion.div
      className="bg-white shadow-lg overflow-hidden"
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="p-4 border-b flex items-center">
        <div className="w-8 h-8 bg-green-700 rounded-md flex items-center justify-center">
          <span className="text-white font-bold">S</span>
        </div>
        {!isCollapsed && (
          <h1 className="text-xl font-semibold ml-2">Swasthify</h1>
        )}
        <button onClick={toggleSidebar} className="ml-auto text-gray-500">
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      <div className="py-4">
        {Object.keys(sectionToIcon).map((section) => (
          <div
            key={section}
            onClick={() => onSectionChange(section)}
            className={`flex items-center px-4 py-3 cursor-pointer ${
              activeSection === section ? "bg-green-50" : "hover:bg-gray-50"
            }`}
          >
            <div
              className={`${
                isCollapsed ? "mx-auto" : ""
              } w-6 flex items-center justify-center ${
                activeSection === section ? "text-green-700" : "text-gray-500"
              }`}
            >
              {sectionToIcon[section]}
            </div>
            {!isCollapsed && (
              <span
                className={`ml-3 text-sm ${
                  activeSection === section
                    ? "font-medium text-green-700"
                    : "text-gray-700"
                }`}
              >
                {sectionToText[section]}
              </span>
            )}
          </div>
        ))}
      </div>

      {!isCollapsed && (
        <div className="p-4 mt-4 mx-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-green-700 rounded-md flex items-center justify-center">
              <FaPlus className="text-white text-xs" />
            </div>
            <h3 className="ml-2 text-sm font-medium">Health Dashboard Pro</h3>
          </div>
          <p className="text-xs text-gray-500">
            Get full access to all premium features
          </p>
          <button className="mt-3 w-full bg-green-700 text-white py-2 rounded-md text-sm">
            Upgrade Now
          </button>
        </div>
      )}
    </motion.div>
  );
};
export default Sidebar;
