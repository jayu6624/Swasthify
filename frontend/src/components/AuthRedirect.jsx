import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/user/status",
          {
            withCredentials: true,
          }
        );

        if (response.data.isOnboardingCompleted) {
          navigate("/dashboard");
        } else {
          navigate("/onboarding");
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        navigate("/login");
      }
    };

    checkUserStatus();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default AuthRedirect;
