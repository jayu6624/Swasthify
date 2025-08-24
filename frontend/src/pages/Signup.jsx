import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/images/logo.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    number: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthColor, setStrengthColor] = useState("bg-gray-200");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[!@#$%^&*]/.test(password)) score += 1;
    setStrengthScore(score);
    if (score === 0 || password === "") {
      setPasswordStrength("");
      setStrengthColor("bg-gray-200");
    } else if (score <= 2) {
      setPasswordStrength("Weak password");
      setStrengthColor("bg-red-500");
    } else if (score <= 4) {
      setPasswordStrength("Medium password");
      setStrengthColor("bg-yellow-500");
    } else {
      setPasswordStrength("Strong password");
      setStrengthColor("bg-green-500");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!strongPasswordRegex.test(formData.password)) {
      toast.error(
        "Password must be at least 8 characters long, include 1 uppercase letter, and 1 symbol"
      );
      return;
    }
    try {
      const checkResponse = await axios.post(
        "http://localhost:4000/api/user/status",
        { email: formData.email }
      );
      if (checkResponse.data.exists) {
        toast.error("Account already exists. Please login.");
        navigate("/login");
        return;
      }
      localStorage.setItem("tempUserData", JSON.stringify(formData));
      await axios.post("http://localhost:4000/api/user/send-otp", {
        email: formData.email,
      });
      toast.success("OTP sent to your email!");
      navigate("/otp", {
        state: {
          email: formData.email,
          formData: formData,
          isNewUser: true,
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-4 md:bg-cover md:bg-fixed md:bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      <div className="md:absolute md:inset-0 md:bg-green-200/50 md:backdrop-blur-sm" />
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl p-8 md:p-16"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex items-center gap-3 mb-8 justify-center"
        >
          <img
            src={logo}
            alt="Swasthify Logo"
            className="w-12 h-12 rounded-full border-2 border-green-200"
          />
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
            Swasthify
          </h1>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl md:text-2xl font-semibold text-gray-800 text-center mb-8"
        >
          Create Your Account
        </motion.h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Section */}
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Name
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute top-3 left-3 text-gray-400"
                  />
                  <input
                    type="text"
                    name="name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    aria-label="Name"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                  placeholder="Your age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  aria-label="Age"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  aria-label="Gender"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </motion.div>
            </div>
            {/* Right Section */}
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute top-3 left-3 text-gray-400"
                  />
                  <input
                    type="email"
                    name="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-label="Email"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute top-3 left-3 text-gray-400"
                  />
                  <input
                    type="text"
                    name="number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="Your phone number"
                    value={formData.number}
                    onChange={handleChange}
                    required
                    aria-label="Phone Number"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute top-3 left-3 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 space-y-1"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((barNum) => (
                      <motion.div
                        key={barNum}
                        animate={{
                          backgroundColor:
                            barNum <= strengthScore ? strengthColor : "#E5E7EB",
                        }}
                        transition={{ duration: 0.3 }}
                        className="h-1.5 w-full rounded-full"
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs transition-all duration-300 ${
                      strengthScore <= 2
                        ? "text-red-600"
                        : strengthScore <= 4
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {passwordStrength}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg mt-8"
            aria-label="Sign Up"
          >
            Sign Up
          </motion.button>
        </form>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-6 text-gray-600"
        >
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-500 hover:text-green-600 font-medium"
            aria-label="Log in"
          >
            Log in
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="relative my-6"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="space-y-3"
        >
          {/* Google Sign Up Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() =>
              (window.location.href = "http://localhost:4000/api/auth/google")
            }
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
            aria-label="Sign up with Google"
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
              <path
                d="M22.5 12.2727C22.5 11.4545 22.4318 10.6818 22.3182 9.90909H12V14.0455H17.9091C17.6818 15.3182 16.9773 16.3636 15.9091 17.0682V19.6818H19.4091C21.4545 17.7955 22.5 15.2727 22.5 12.2727Z"
                fill="#4285F4"
              />
              <path
                d="M12 22.5C14.7273 22.5 17.0455 21.5455 18.8182 19.6818L15.3182 17.0682C14.4545 17.6364 13.3182 17.9545 12 17.9545C9.13636 17.9545 6.72727 16 5.86364 13.3182H2.25V15.9545C4.02273 19.8636 7.72727 22.5 12 22.5Z"
                fill="#34A853"
              />
              <path
                d="M5.86364 13.3182C5.68182 12.75 5.57955 12.1364 5.57955 11.5C5.57955 10.8636 5.68182 10.25 5.86364 9.68182V7.04545H2.25C1.59091 8.38636 1.22727 9.90909 1.22727 11.5C1.22727 13.0909 1.59091 14.6136 2.25 15.9545L5.86364 13.3182Z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.04545C13.4773 5.04545 14.7955 5.54545 15.8182 6.45455L18.8182 3.45455C17.0227 1.77273 14.7273 0.75 12 0.75C7.72727 0.75 4.02273 3.38636 2.25 7.29545L5.86364 9.93182C6.72727 7.25 9.13636 5.04545 12 5.04545Z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </motion.button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mt-6 pt-3 text-center text-xs text-gray-500"
        >
          By signing up, you agree to our
          <a
            href="#"
            className="text-green-500 hover:text-green-600"
            aria-label="Terms of Service"
          >
            Terms
          </a>{" "}
          and
          <a
            href="#"
            className="text-green-500 hover:text-green-600"
            aria-label="Privacy Policy"
          >
            Privacy Policy
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
