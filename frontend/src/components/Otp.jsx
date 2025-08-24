import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { email, formData } = location.state;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First verify OTP
      
      await axios.post("http://localhost:4000/api/user/verify-otp", {
        email,
        otp,
      });
      console.log(formData);
      
      // If OTP is verified, proceed with registration
      const response = await axios.post(
        "http://localhost:4000/api/user/register",
        formData
      );

      console.log("Registration response:", response.data);

      // Store the token in localStorage
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log("Token stored in localStorage");
      } else {
        console.log("No token in response");
      }
      
      

      // Clean up temporary data
      localStorage.removeItem("tempUserData");

      toast.success("Registration successful!");
      setTimeout(() => {
        navigate("/onboarding");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="bg-pink-100 flex items-center justify-center min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Email Verification</h2>
        <p className="text-gray-600 mb-4 text-center">
          Please enter the OTP sent to your email: {email}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otp;