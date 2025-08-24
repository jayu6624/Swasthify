import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Otp from "./components/Otp.jsx";
import HomePage from "./pages/HomePage.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import SnapMeal from "./pages/SnapMeal.jsx";
import { ParallaxProvider } from "react-scroll-parallax";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";
import AppThemeProvider from "./theme/ThemeProvider";

function App() {
  return (
    <AppThemeProvider>
      <div>
        <ParallaxProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/otp" element={<Otp />} />

            {/* Post-login navigation handler */}
            <Route
              path="/auth-redirect"
              element={
                <ProtectedRoute>
                  <Navigate to="/onboarding" replace />
                </ProtectedRoute>
              }
            />

            {/* Authentication Required Routes */}
            <Route path="/onboarding" element={<Onboarding />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/snap-meal"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard?section=snap" replace />
                </ProtectedRoute>
              }
            />

            <Route
              path="/about-us"
              element={<AboutPage />} // Remove ProtectedRoute wrapper
            />
            <Route
              path="/contact"
              element={<ContactPage />} // Remove ProtectedRoute wrapper
            />
          </Routes>
        </ParallaxProvider>
      </div>
    </AppThemeProvider>
  );
}

export default App;
