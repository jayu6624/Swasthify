import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUtensils,
  FaRunning,
  FaChartBar,
  FaBell,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaCamera,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import DashboardContent from "../components/DashboardContent";
import NutritionContent from "../components/NutritionContent";
import ActivitiesContent from "../components/ActivitiesContent";
import ReportsContent from "../components/ReportsContent";
import SnapMeal from "./SnapMeal";
import api from "../utils/axios";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const todayRef = useRef(null); // For auto-scroll
  const sections = ["dashboard", "nutrition", "activities", "reports", "snap"];

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const sectionParam = urlParams.get("section");

    if (token) {
      localStorage.setItem("token", token);
      const nextUrl =
        sectionParam && sections.includes(sectionParam)
          ? `/dashboard?section=${sectionParam}`
          : "/dashboard";
      navigate(nextUrl, { replace: true });
    }

    // Support deep-linking to a specific section via query param
    if (sectionParam && sections.includes(sectionParam)) {
      setActiveSectionIndex(sections.indexOf(sectionParam));
    }

    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [location, navigate]);

  // Fetch onboarding and compute goals
  useEffect(() => {
    const fetchAndCompute = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get("/onboarding/me");
        const onboarding = data.onboarding;
        const user = data.user || {};

        // Unit conversions
        const heightCm =
          onboarding.heightUnit === "inches"
            ? onboarding.height * 2.54
            : onboarding.height;
        const weightKg =
          onboarding.weightUnit === "lbs"
            ? onboarding.weight / 2.20462
            : onboarding.weight;

        // Age
        let age = user.age;
        if (!age && onboarding.dob) {
          const dob = new Date(onboarding.dob);
          const diffMs = Date.now() - dob.getTime();
          const ageDate = new Date(diffMs);
          age = Math.abs(ageDate.getUTCFullYear() - 1970);
        }
        if (!age) age = 30;

        // Gender coefficient for Mifflin-St Jeor
        const gender = user.gender || "Male";
        const genderConst = gender === "Female" ? -161 : 5; // 'Other' treated as 5

        // BMR and TDEE
        const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + genderConst;
        const activityFactorMap = {
          Sedentary: 1.2,
          "Lightly Active": 1.375,
          "Moderately Active": 1.55,
          "Very Active": 1.725,
        };
        const activityFactor =
          activityFactorMap[onboarding.activityLevel] || 1.2;
        let tdee = bmr * activityFactor;

        // Goal adjustment
        const goal = onboarding.healthGoal;
        if (goal === "Weight Loss") tdee -= 500;
        else if (goal === "Weight Gain") tdee += 500;
        else if (goal === "Improve Fitness") tdee += 250;

        const calorieGoal = Math.max(1200, Math.round(tdee));

        // Protein per kg based on goal
        let proteinPerKg = 1.6;
        if (goal === "Weight Loss") proteinPerKg = 2.0;
        else if (goal === "Weight Gain") proteinPerKg = 1.8;
        const proteinGoalG = Math.round(proteinPerKg * weightKg);

        // Fat ~25% calories
        const fatGoalG = Math.round((0.25 * calorieGoal) / 9);

        // Carbs remainder
        const carbsGoalG = Math.max(
          0,
          Math.round((calorieGoal - (proteinGoalG * 4 + fatGoalG * 9)) / 4)
        );

        // Fiber ~14g/1000 kcal
        const fiberGoalG = Math.round((calorieGoal / 1000) * 14);

        // Weekly calories mock around goal
        const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const weeklyCalories = dayNames.map((day) => ({
          day,
          calories: Math.round(calorieGoal * (0.9 + Math.random() * 0.2)),
        }));

        setUserData({
          name: "User",
          calorieGoal,
          currentCalories: 0,
          macros: {
            protein: { current: 0, goal: proteinGoalG },
            carbs: { current: 0, goal: carbsGoalG },
            fat: { current: 0, goal: fatGoalG },
            fiber: { current: 0, goal: fiberGoalG },
          },
          weeklyCalories,
          activities: [],
          water: { current: 0, goal: 8 },
          sleep: { hours: 0, quality: "" },
          heartRate: { current: 0, min: 0, max: 0 },
          steps: { current: 0, goal: 10000 },
        });
      } catch (e) {
        setError(
          e?.response?.data?.message || "Failed to load onboarding data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAndCompute();
  }, []);

  // Generate all dates for the current month
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    return {
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dateNum: date.getDate(),
      isToday: date.toDateString() === today.toDateString(),
    };
  });

  useEffect(() => {
    // Auto-scroll to today's date in mobile view
    if (todayRef.current) {
      todayRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, []);

  const navigateSection = (direction) => {
    if (direction === "next" && activeSectionIndex < sections.length - 1) {
      setActiveSectionIndex((prev) => prev + 1);
    } else if (direction === "prev" && activeSectionIndex > 0) {
      setActiveSectionIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <Sidebar
              activeSection={sections[activeSectionIndex]}
              onSectionChange={(section) => {
                setActiveSectionIndex(sections.indexOf(section));
                setIsSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block bg-white shadow-lg">
        <Sidebar
          activeSection={sections[activeSectionIndex]}
          onSectionChange={(section) =>
            setActiveSectionIndex(sections.indexOf(section))
          }
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="bg-white/80 backdrop-blur-md px-6 py-4 shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden text-gray-600"
                onClick={() => setIsSidebarOpen(true)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                Dashboard
                <span className="ml-3 text-sm text-gray-500">
                  {currentDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-6">
              <button className="relative text-gray-600 hover:text-green-600">
                <FaBell size={18} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  1
                </span>
              </button>
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:ring-2 hover:ring-green-500 cursor-pointer">
                <FaUser className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Date Selector */}
        {/* <div className="p-4 bg-white border-b overflow-x-auto scrollbar-hide">
          <div className="flex gap-4">
            {monthDays.map((day, index) => (
              <button
                key={index}
                ref={day.isToday ? todayRef : null}
                onClick={() => setSelectedDay(index)}
                className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors min-w-[50px] ${
                  day.isToday
                    ? "bg-green-600 text-white"
                    : selectedDay === index
                    ? "bg-green-100 text-green-700"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span className="text-xs font-medium">{day.dayName}</span>
                <span className="text-lg font-semibold">{day.dateNum}</span>
              </button>
            ))}
          </div>
        </div> */}

        {/* Section Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSectionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full overflow-y-auto p-6 space-y-6"
            >
              {activeSectionIndex === 0 && userData && (
                <DashboardContent userData={userData} />
              )}
              {activeSectionIndex === 1 && (
                <NutritionContent userData={userData} />
              )}
              {activeSectionIndex === 2 && (
                <ActivitiesContent userData={userData} />
              )}
              {activeSectionIndex === 3 && (
                <ReportsContent userData={userData} />
              )}
              {activeSectionIndex === 4 && userData && (
                <SnapMeal
                  userGoals={{
                    calorieGoal: userData.calorieGoal,
                    proteinGoal: userData.macros.protein.goal,
                    carbsGoal: userData.macros.carbs.goal,
                    fatGoal: userData.macros.fat.goal,
                    fiberGoal: userData.macros.fiber.goal,
                  }}
                  onConfirmMeal={(totals) => {
                    setUserData((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        currentCalories: Math.max(
                          0,
                          Math.round(
                            prev.currentCalories + (totals?.calories || 0)
                          )
                        ),
                        macros: {
                          protein: {
                            ...prev.macros.protein,
                            current: Math.max(
                              0,
                              Math.round(
                                prev.macros.protein.current +
                                  (totals?.protein || 0)
                              )
                            ),
                          },
                          carbs: {
                            ...prev.macros.carbs,
                            current: Math.max(
                              0,
                              Math.round(
                                prev.macros.carbs.current + (totals?.carbs || 0)
                              )
                            ),
                          },
                          fat: {
                            ...prev.macros.fat,
                            current: Math.max(
                              0,
                              Math.round(
                                prev.macros.fat.current + (totals?.fats || 0)
                              )
                            ),
                          },
                          fiber: {
                            ...prev.macros.fiber,
                            current: Math.max(
                              0,
                              Math.round(
                                prev.macros.fiber.current + (totals?.fiber || 0)
                              )
                            ),
                          },
                        },
                      };
                    });
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Section Navigation (Mobile Only) */}
        <div className="flex justify-center py-3 bg-white border-t md:hidden">
          <button
            onClick={() => navigateSection("prev")}
            disabled={activeSectionIndex === 0}
            className={`mx-2 p-2 rounded-full ${
              activeSectionIndex === 0
                ? "text-gray-300"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaChevronLeft />
          </button>
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSectionIndex(index)}
              className={`mx-1 w-2 h-2 rounded-full ${
                activeSectionIndex === index ? "bg-green-600" : "bg-gray-300"
              }`}
            />
          ))}
          <button
            onClick={() => navigateSection("next")}
            disabled={activeSectionIndex === sections.length - 1}
            className={`mx-2 p-2 rounded-full ${
              activeSectionIndex === sections.length - 1
                ? "text-gray-300"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Bottom Navigation for Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t py-2 flex justify-around shadow-lg">
          {sections.map((section, index) => (
            <button
              key={section}
              onClick={() => setActiveSectionIndex(index)}
              className={`flex flex-col items-center text-sm ${
                activeSectionIndex === index
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              {index === 0 && <FaHome />}
              {index === 1 && <FaUtensils />}
              {index === 2 && <FaRunning />}
              {index === 3 && <FaChartBar />}
              {index === 4 && <FaCamera />}
              <span className="text-xs capitalize">{section}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
