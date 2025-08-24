import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import axiosInstance from "../utils/axios";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/images/logo.jpg";

const Login = () => {
  const [identify, setIdentify] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identify.trim() || !password) {
      toast.warning("Please enter all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/user/login", {
        identifier: identify.trim(),
        password,
      });
      console.log("Login response:", response.data);

      if (response.data) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          console.log("Token stored during login:", response.data.token);
        } else {
          console.log("No token in login response");
        }
        toast.success("Login successful!");
        console.log(
          "response of a onbording : " + response.data.isOnboardingCompleted
        );

        if (response.data.isOnboardingCompleted) {
          navigate("/dashboard");
        } else {
          navigate("/onboarding");
        }
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.code === "ERR_NETWORK") {
        toast.error("Connection failed");
      } else if (error.response?.status === 401) {
        toast.error("Invalid credentials");
      } else {
        toast.error("Login failed");
      }
    } finally {
      setIsLoading(false);
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
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md md:max-w-lg mx-4 overflow-hidden"
      >
        <div className="p-8 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-6"
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
            className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center justify-center mb-6"
          >
            <User size={20} className="text-green-500 mr-2" />
            Sign In to Your Account
          </motion.h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Email or Mobile
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute top-3 left-3 text-gray-400"
                />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                  placeholder="Enter email or mobile"
                  value={identify}
                  onChange={(e) => setIdentify(e.target.value)}
                  required
                  aria-label="Email or Mobile"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
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
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-green-500 focus:ring-green-500 h-4 w-4"
                  aria-label="Remember me"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-green-500 hover:text-green-600 font-medium"
                aria-label="Forgot password"
              >
                Forgot password?
              </a>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
              disabled={isLoading}
              aria-label="Sign In"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-center mt-5 text-gray-600"
          >
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-green-500 hover:text-green-600 font-medium"
              aria-label="Create Account"
            >
              Create Account
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="relative my-5"
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
            transition={{ delay: 0.9, duration: 0.6 }}
            className="space-y-3"
          >
            {/* Google Sign In Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() =>
                (window.location.href = "http://localhost:4000/api/auth/google")
              }
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
              aria-label="Sign in with Google"
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
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-5 pt-3 text-center text-xs text-gray-500"
          >
            By signing in, you agree to our
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
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
