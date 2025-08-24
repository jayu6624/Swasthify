import React, { useEffect, useState, useRef } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; // Add axios import
import { toast } from "react-toastify"; // Add toast notification import
const Onboarding = () => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState("next");
  const [pageValidation, setPageValidation] = useState({});
  const animationRef = useRef(null);
  const navigate = useNavigate();

  // Load initial form data from localStorage
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("onboarding");

    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return parsedData;
    }

    // Default initial state if no saved data
    return {
      dob: "",
      city: "",
      height: "",
      heightUnit: "cm",
      weight: "",
      weightUnit: "kg",
      healthGoal: "",
      targetWeight: "",
      activityLevel: "",
      exerciseDays: "",
      exerciseType: [],
      dietPattern: "",
      allergies: "",
      cuisinePreferences: [],
      culturalFactors: "",
      medicalConditions: "",
      additionalInfo: "",
    };
  });

  // Define validation rules for each page
  const validationRules = {
    1: (data) => !!data.dob, // DOB is required
    2: (data) => !!data.city, // City is required
    3: (data) => !!data.height, // Height is required
    4: (data) => !!data.weight, // Weight is required
    5: (data) => !!data.healthGoal, // Health goal is required
    6: (data) =>
      (data.healthGoal !== "Weight Loss" &&
        data.healthGoal !== "Weight Gain") ||
      !!data.targetWeight, // Target weight required for weight loss/gain
    7: (data) => !!data.activityLevel, // Activity level is required
    8: (data) => data.exerciseDays !== "", // Exercise days is required
    9: (data) => data.exerciseType.length > 0, // At least one exercise type is required
    10: (data) => !!data.dietPattern, // Diet pattern is required
    // The rest are optional
    11: () => true,
    12: () => true,
    13: () => true,
    14: () => true,
  };

  // Check validity of current page
  useEffect(() => {
    if (activeIndex > 0 && activeIndex <= Object.keys(validationRules).length) {
      const isValid = validationRules[activeIndex](formData);
      setPageValidation((prev) => ({ ...prev, [activeIndex]: isValid }));
    }
  }, [formData, activeIndex]);

  // Handle Google OAuth token from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    if (token) {
      // Clear any old token first
      localStorage.removeItem("token");
      // Store the new token
      localStorage.setItem("token", token);
      // Clean up the URL
      navigate("/onboarding", { replace: true });
    }
  }, [location, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      console.log("Form Data Updated (Input):", newData);
      return newData;
    });
  };

  const handleCheckboxChange = (e, group) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      let newData;
      if (checked) {
        newData = { ...prev, [group]: [...prev[group], value] };
      } else {
        newData = {
          ...prev,
          [group]: prev[group].filter((item) => item !== value),
        };
      }
      console.log("Form Data Updated (Checkbox):", newData);
      return newData;
    });
  };

  // Function to prepare data for backend submission
  const prepareDataForSubmission = () => {
    // Create a copy of the form data
    const submissionData = { ...formData };

    // Validate required fields
    const requiredFields = [
      "dob",
      "city",
      "height",
      "weight",
      "healthGoal",
      "activityLevel",
      "exerciseDays",
      "exerciseType",
      "dietPattern",
    ];

    const missingFields = requiredFields.filter(
      (field) => !submissionData[field]
    );
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Format data properly
    if (submissionData.dob) {
      const date = new Date(submissionData.dob);
      submissionData.dobFormatted = date.toISOString().split("T")[0];
    }

    // Add computed fields
    if (submissionData.height && submissionData.weight) {
      if (
        submissionData.heightUnit === "cm" &&
        submissionData.weightUnit === "kg"
      ) {
        const heightInMeters = submissionData.height / 100;
        submissionData.bmi = (
          submissionData.weight /
          (heightInMeters * heightInMeters)
        ).toFixed(1);
      } else if (
        submissionData.heightUnit === "inches" &&
        submissionData.weightUnit === "lbs"
      ) {
        // Convert to metric for BMI calculation
        const heightInMeters = (submissionData.height * 2.54) / 100;
        const weightInKg = submissionData.weight * 0.453592;
        submissionData.bmi = (
          weightInKg /
          (heightInMeters * heightInMeters)
        ).toFixed(1);
      }
    }

    // Convert arrays to strings if needed
    if (Array.isArray(submissionData.exerciseType)) {
      submissionData.exerciseType = submissionData.exerciseType.join(",");
    }
    if (Array.isArray(submissionData.cuisinePreferences)) {
      submissionData.cuisinePreferences =
        submissionData.cuisinePreferences.join(",");
    }

    // Add timestamp
    submissionData.submittedAt = new Date().toISOString();

    return submissionData;
  };

  // Function to submit data to backend

  const handleSubmitData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);

      if (!token) {
        toast.error("Please login first!");
        navigate("/login");
        return;
      }

      // Debug: Decode the token to see its structure
      try {
        const tokenParts = token.split(".");
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log("Token payload:", payload);
        }
      } catch (e) {
        console.log("Could not decode token:", e);
      }

      const dataToSubmit = prepareDataForSubmission();
      console.log("Data to submit:", dataToSubmit);
      console.log("Request headers:", {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });

      // First create onboarding data
      console.log("token => " + token);

      const onboardingResponse = await axios.post(
        "http://localhost:4000/api/onboarding/create",
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Onboarding data:", dataToSubmit);

      if (
        onboardingResponse.status === 200 ||
        onboardingResponse.status === 201
      ) {
        try {
          const updateResponse = await axios.put(
            "http://localhost:4000/api/user/update-onboarding-status",
            { onboardingStatus: true },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (updateResponse.status === 200) {
            localStorage.removeItem("onboarding");
            toast.success("Onboarding completed successfully!");
            navigate("/dashboard");
          }
        } catch (updateError) {
          console.error("Error updating onboarding status:", updateError);
          if (updateError.response?.status === 404) {
            toast.error("User not found. Please login again.");
            navigate("/login");
          } else {
            toast.warning("Onboarding data saved but status update failed.");
            navigate("/dashboard");
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  // One question per page design
  const pages = [
    // Welcome page
    {
      bg: "linear-gradient(135deg, #8B5CF6, #6366F1)",
      text: "white",
      icon: "fa-user-circle",
      title: "Welcome to Swasthify!",
      content: (
        <div className="questionnaire-section">
          <p className="buffer-text">
            We're excited to have you join our community of health enthusiasts.
            Let's start creating your personalized wellness journey.
          </p>
          <div className="progress-indicator">
            <div className="progress-text">Getting to know you</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "5%" }}></div>
            </div>
          </div>
        </div>
      ),
      showNextButton: true,
      showPrevButton: false,
    },

    // DOB
    {
      bg: "linear-gradient(135deg, #4F46E5, #4338CA)",
      text: "white",
      icon: "fa-calendar-alt",
      title: "When were you born?",
      content: (
        <div className="questionnaire-section">
          <p className="buffer-text">
            Your age helps us recommend activities and nutrition that's right
            for you.
          </p>
          <div className="form-group">
            <label className="floating-label" htmlFor="dob">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              required
              className={`glassy-input with-calendar-icon ${
                !formData.dob && activeIndex === 1 ? "required-field" : ""
              }`}
            />
            {!formData.dob && activeIndex === 1 && (
              <p className="validation-message">
                Please select your date of birth
              </p>
            )}
          </div>
          <div className="progress-indicator">
            <div className="progress-text">1 of 14</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "10%" }}></div>
            </div>
          </div>
        </div>
      ),
      showNextButton: true,
      showPrevButton: true,
    },

    // City
    {
      bg: "linear-gradient(135deg, #0EA5E9, #0284C7)",
      text: "white",
      icon: "fa-map-marked-alt",
      title: "Where are you based?",
      content: (
        <div className="questionnaire-section">
          <p className="buffer-text">
            We'll use this to suggest local resources and seasonal
            recommendations.
          </p>
          <div className="form-group location-input">
            <div className="input-icon">
              <i className="fas fa-search"></i>
            </div>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Search for your city"
              required
              className={`glassy-input with-icon ${
                !formData.city && activeIndex === 2 ? "required-field" : ""
              }`}
            />
            {!formData.city && activeIndex === 2 && (
              <p className="validation-message">Please enter your city</p>
            )}
          </div>
          <div className="quick-location-chips">
            <button
              className="location-chip"
              onClick={() =>
                setFormData((prev) => ({ ...prev, city: "New York" }))
              }
            >
              <i className="fas fa-map-pin"></i> New York
            </button>
            <button
              className="location-chip"
              onClick={() =>
                setFormData((prev) => ({ ...prev, city: "London" }))
              }
            >
              <i className="fas fa-map-pin"></i> London
            </button>
            <button
              className="location-chip"
              onClick={() =>
                setFormData((prev) => ({ ...prev, city: "Mumbai" }))
              }
            >
              <i className="fas fa-map-pin"></i> Mumbai
            </button>
          </div>
          <div className="progress-indicator">
            <div className="progress-text">2 of 14</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "15%" }}></div>
            </div>
          </div>
        </div>
      ),
      showNextButton: true,
      showPrevButton: true,
    },

    // Height
    {
      bg: "linear-gradient(135deg, #10B981, #059669)",
      text: "white",
      icon: "fa-ruler-vertical",
      title: "How tall are you?",
      content: (
        <div className="questionnaire-section">
          <div className="form-group">
            <div
              className={`input-group elevation-effect ${
                !formData.height && activeIndex === 3
                  ? "required-field-group"
                  : ""
              }`}
            >
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="Enter your height"
                required
                className="glassy-input"
              />
              <div className="unit-selector">
                <select
                  name="heightUnit"
                  value={formData.heightUnit}
                  onChange={handleInputChange}
                  className="glassy-select"
                >
                  <option value="cm">cm</option>
                  <option value="inches">inches</option>
                </select>
              </div>
            </div>
            {!formData.height && activeIndex === 3 && (
              <p className="validation-message">Please enter your height</p>
            )}
          </div>
          <div className="height-visual-aid">
            <div className="ruler-visual">
              <div className="ruler-marker"></div>
              <div className="ruler-marker"></div>
              <div className="ruler-marker"></div>
              <div className="ruler-marker"></div>
              <div className="ruler-marker tall"></div>
              <div className="ruler-marker"></div>
              <div className="ruler-marker"></div>
              <div className="ruler-marker"></div>
              <div className="ruler-marker"></div>
              <div
                className="ruler-person"
                style={{
                  height: `${
                    formData.height ? Math.min(100, formData.height / 2) : 50
                  }%`,
                }}
              >
                <i className="fas fa-user"></i>
              </div>
            </div>
          </div>
          <div className="progress-indicator">
            <div className="progress-text">3 of 14</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "20%" }}></div>
            </div>
          </div>
        </div>
      ),
      showNextButton: true,
      showPrevButton: true,
    },

    // Weight
    {
      bg: "linear-gradient(135deg, #059669, #047857)",
      text: "white",
      icon: "fa-weight",
      title: "What is your current weight?",
      content: (
        <div className="questionnaire-section">
          <div className="form-group">
            <div
              className={`input-group elevation-effect ${
                !formData.weight && activeIndex === 4
                  ? "required-field-group"
                  : ""
              }`}
            >
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="Enter your weight"
                required
                className="glassy-input"
              />
              <div className="unit-selector">
                <select
                  name="weightUnit"
                  value={formData.weightUnit}
                  onChange={handleInputChange}
                  className="glassy-select"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>
            {!formData.weight && activeIndex === 4 && (
              <p className="validation-message">Please enter your weight</p>
            )}
          </div>
          <div className="weight-visual">
            <div className="scale-icon">
              <i className="fas fa-balance-scale"></i>
            </div>
            <div
              className="weight-indicator"
              style={{
                width: `${
                  formData.weight ? Math.min(100, formData.weight / 2) : 50
                }%`,
              }}
            >
              <div className="weight-value">
                {formData.weight
                  ? `${formData.weight} ${formData.weightUnit}`
                  : "0"}
              </div>
            </div>
          </div>
          <div className="progress-indicator">
            <div className="progress-text">4 of 14</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "30%" }}></div>
            </div>
          </div>
        </div>
      ),
      showNextButton: true,
      showPrevButton: true,
    },

    // Health Goal
    {
      bg: "linear-gradient(135deg, #F59E0B, #D97706)",
      text: "white",
      icon: "fa-bullseye",
      title: "What's your primary health goal?",
      content: (
        <div className="questionnaire-section">
          <p className="buffer-text">
            We'll customize your journey based on what matters most to you.
          </p>
          <div className="form-group">
            <div className="modern-radio-cards">
              {[
                {
                  value: "Weight Loss",
                  icon: "fa-arrow-down",
                  color: "#EF4444",
                },
                { value: "Weight Gain", icon: "fa-arrow-up", color: "#F59E0B" },
                {
                  value: "Maintain Weight",
                  icon: "fa-equals",
                  color: "#10B981",
                },
                {
                  value: "Improve Fitness",
                  icon: "fa-running",
                  color: "#3B82F6",
                },
              ].map((goal) => (
                <label
                  key={goal.value}
                  className={`modern-radio-card ${
                    formData.healthGoal === goal.value ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="healthGoal"
                    value={goal.value}
                    checked={formData.healthGoal === goal.value}
                    onChange={handleInputChange}
                  />
                  <div className="card-content">
                    <div
                      className="card-icon"
                      style={{ backgroundColor: goal.color }}
                    >
                      <i className={`fas ${goal.icon}`}></i>
                    </div>
                    <span className="card-label">{goal.value}</span>
                  </div>
                </label>
              ))}
            </div>
            {!formData.healthGoal && activeIndex === 5 && (
              <p className="validation-message">Please select a health goal</p>
            )}
          </div>
          <div className="progress-indicator">
            <div className="progress-text">5 of 14</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "35%" }}></div>
            </div>
          </div>
        </div>
      ),
      showNextButton: true,
      showPrevButton: true,
    },

    // Target Weight (Conditional)
    {
      bg: "linear-gradient(135deg, #F97316, #EA580C)",
      text: "white",
      icon: "fa-chart-line",
      title: "What's your target weight?",
      content: (
        <div className="questionnaire-section">
          <p className="buffer-text">
            Setting a realistic goal is a key part of your success journey.
          </p>
          <div className="form-group">
            <div className="slider-container">
              <div className="weight-display">
                <span className="current-weight">
                  Current: {formData.weight || "0"} {formData.weightUnit}
                </span>
                <span className="target-weight">
                  Target: {formData.targetWeight || "0"} {formData.weightUnit}
                </span>
              </div>
              <div
                className={`input-group elevation-effect ${
                  !formData.targetWeight && activeIndex === 6
                    ? "required-field-group"
                    : ""
                }`}
              >
                <input
                  type="number"
                  id="targetWeight"
                  name="targetWeight"
                  value={formData.targetWeight}
                  onChange={handleInputChange}
                  placeholder="Enter target weight"
                  className="glassy-input"
                />
                <span className="unit-label">{formData.weightUnit}</span>
              </div>
              {!formData.targetWeight && activeIndex === 6 && (
                <p className="validation-message">
                  Please enter your target weight
                </p>
              )}
              <div className="weight-journey-visual">
                <div className="journey-start">
                  <i className="fas fa-dot-circle"></i>
                  <span>Now</span>
                </div>
                <div className="journey-line">
                  <div
                    className="journey-progress"
                    style={{
                      width:
                        formData.targetWeight && formData.weight
                          ? `${Math.min(
                              100,
                              Math.max(
                                0,
                                100 -
                                  (Math.abs(
                                    formData.targetWeight - formData.weight
                                  ) /
                                    formData.weight) *
                                    100
                              )
                            )}%`
                          : "0%",
                    }}
                  ></div>
                </div>
                <div className="journey-end">
                  <i className="fas fa-flag-checkered"></i>
                  <span>Goal</span>
                </div>
              </div>
            </div>
          </div>
          <div className="progress-indicator">
            <div className="progress-text">6 of 14</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "40%" }}></div>
            </div>
          </div>
        </div>
      ),
      showNextButton: true,
      showPrevButton: true,
      conditional:
        formData.healthGoal === "Weight Loss" ||
        formData.healthGoal === "Weight Gain",
    },

    // Activity Level
    {
      bg: "linear-gradient(135deg, #EC4899, #DB2777)",
      text: "white",
      icon: "fa-walking",
      title: "How active are you day-to-day?",
      content: (
        <div className="questionnaire-section">
          <p className="buffer-text">
            Your daily movement plays a huge role in your overall health.
          </p>
          <div className="form-group">
            <div className="activity-level-selector">
              {[
                {
                  value: "Sedentary",
                  icon: "fa-couch",
                  desc: "Little to no exercise",
                },
                {
                  value: "Lightly Active",
                  icon: "fa-walking",
                  desc: "Light exercise 1-3 days/week",
                },
                {
                  value: "Moderately Active",
                  icon: "fa-hiking",
                  desc: "Moderate exercise 3-5 days/week",
                },
                {
                  value: "Very Active",
                  icon: "fa-running",
                  desc: "Hard exercise 6-7 days/week",
                },
              ].map((level) => (
                <label
                  key={level.value}
                  className={`activity-card ${
                    formData.activityLevel === level.value ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="activityLevel"
                    value={level.value}
                    checked={formData.activityLevel === level.value}
                    onChange={handleInputChange}
                  />
                  <div className="activity-card-content">
                    <div className="activity-icon">
                      <i className={`fas ${level.icon}`}></i>
                    </div>
                    <div className="activity-details">
                      <span className="activity-title">{level.value}</span>
                      <span className="activity-desc">{level.desc}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {!formData.activityLevel && activeIndex === 7 && (
              <p className="validation-message">
                Please select your activity level
              </p>
            )}
          </div>
          <div className="progress-indicator">
            <div className="progress-text">7 of 14</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "50%" }}></div>
            </div>
          </div>
        </div>
      ),
      showNextButton: true,
      showPrevButton: true,
    },

    // Exercise Days
    {
      bg: "linear-gradient(135deg, #D946EF, #C026D3)",
      text: "white",
      icon: "fa-calendar-check",
      title: "How many days do you exercise weekly?",
      content: (
        <div className="questionnaire-section">
          <div className="form-group">
            <div className="weekly-calendar">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((day) => (
                <button
                  key={day}
                  className={`day-button ${
                    formData.exerciseDays == day ? "selected" : ""
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, exerciseDays: day }))
                  }
                >
                  {day === 0 ? "None" : day}
                  {day === 1 ? " day" : day > 1 ? " days" : ""}
                </button>
              ))}
            </div>
            {formData.exerciseDays === "" && activeIndex === 8 && (
              <p className="validation-message">
                Please select how many days you exercise
              </p>
            )}
            <div className="calendar-visual">
              <div className="week-view">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                  <div
                    key={idx}
                    className={`day-cell ${
                      idx < formData.exerciseDays ? "active" : ""
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="progress-indicator">
            <div className="progress-text">8 of 14</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "57%" }}></div>
            </div>
          </div>
        </div>
      ),
      showNextButton: true,
      showPrevButton: true,
    },

    // Exercise Type
    {
      bg: "linear-gradient(135deg, #A855F7, #9333EA)",
      text: "white",
      icon: "fa-dumbbell",
      title: "What types of exercise do you enjoy?",
      content: (
        <div className="questionnaire-section">
          <p className="buffer-text">
            Select all that apply. We believe the best exercise is one you'll
            actually do!
          </p>
          <div className="form-group">
            <div className="exercise-type-grid">
              {[
                { value: "Cardio", icon: "fa-heartbeat", color: "#EF4444" },
                {
                  value: "Strength Training",
                  icon: "fa-dumbbell",
                  color: "#3B82F6",
                }, // Updated from "Strength" to "Strength Training"
                { value: "Yoga", icon: "fa-pray", color: "#8B5CF6" },
                { value: "HIIT", icon: "fa-bolt", color: "#F97316" },
                { value: "Dance", icon: "fa-music", color: "#EC4899" },
                { value: "Swimming", icon: "fa-swimmer", color: "#06B6D4" },
                { value: "Cycling", icon: "fa-biking", color: "#10B981" },
                {
                  value: "Sports",
                  icon: "fa-basketball-ball",
                  color: "#F59E0B",
                },
              ].map((type) => (
                <label
                  key={type.value}
                  className={`exercise-card ${
                    formData.exerciseType.includes(type.value) ? "selected" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    value={type.value}
                    checked={formData.exerciseType.includes(type.value)}
                    onChange={(e) => handleCheckboxChange(e, "exerciseType")}
                  />
                  <div
                    className="exercise-icon"
                    style={{ backgroundColor: type.color }}
                  >
                    <i className={`fas ${type.icon}`}></i>
                  </div>
                  <span className="exercise-label">{type.value}</span>
                </label>
              ))}
            </div>
            {formData.exerciseType.length === 0 && activeIndex === 9 && (
              <p className="validation-message">
                Please select at least one exercise type
              </p>
            )}
          </div>
          <div className="progress-indicator">
            <div className="progress-text">9 of 14</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "64%" }}></div>
            </div>
          </div>
        </div>
      ),
      showNextButton: true,
      showPrevButton: true,
    },

    // Diet Pattern
    {
      bg: "linear-gradient(135deg, #EF4444, #DC2626)",
      text: "white",
      icon: "fa-utensils",
      title: "Do you follow a specific diet?",
      content: (
        <div className="questionnaire-section">
          <div className="form-group">
            <div className="diet-pattern-cards">
              {[
                {
                  value: "Vegan",
                  icon: "fa-seedling",
                  desc: "No animal products",
                },
                { value: "Vegetarian", icon: "fa-leaf", desc: "No meat" },
                {
                  value: "Non-Vegetarian",
                  icon: "fa-drumstick-bite",
                  desc: "Includes meat",
                },
                {
                  value: "Keto",
                  icon: "fa-cheese",
                  desc: "Low-carb, high-fat",
                },
                {
                  value: "Paleo",
                  icon: "fa-apple-alt",
                  desc: "Whole, unprocessed foods",
                },
                {
                  value: "Intermittent Fasting",
                  icon: "fa-clock",
                  desc: "Timed eating patterns",
                },
              ].map((diet) => (
                <label
                  key={diet.value}
                  className={`diet-card ${
                    formData.dietPattern === diet.value ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="dietPattern"
                    value={diet.value}
                    checked={formData.dietPattern === diet.value}
                    onChange={handleInputChange}
                  />
                  <div className="diet-card-content">
                    <div className="diet-icon">
                      <i className={`fas ${diet.icon}`}></i>
                    </div>
                    <div className="diet-details">
                      <span className="diet-title">{diet.value}</span>
                      <span className="diet-desc">{diet.desc}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {!formData.dietPattern && activeIndex === 10 && (
              <p className="validation-message">
                Please select your diet pattern
              </p>
            )}
          </div>
          <div className="progress-indicator">
            <div className="progress-text">10 of 14</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "71%" }}></div>
            </div>
          </div>
        </div>
      ),
      showNextButton: true,
      showPrevButton: true,
    },

    // Allergies
    {
      bg: "linear-gradient(135deg, #F43F5E, #E11D48)",
      text: "white",
      icon: "fa-allergies",
      title: "Any food allergies or intolerances?",
      content: (
        <div className="questionnaire-section">
          <p className="buffer-text">
            Knowing this helps us keep your recommendations safe and enjoyable.
          </p>
          <div className="form-group">
            <div className="common-allergies">
              {["Gluten", "Dairy", "Nuts", "Shellfish", "Eggs", "Soy"].map(
                (allergy) => (
                  <button
                    key={allergy}
                    className="allergy-chip"
                    onClick={() => {
                      const currentText = formData.allergies;
                      if (!currentText.includes(allergy)) {
                        setFormData((prev) => ({
                          ...prev,
                          allergies: currentText
                            ? `${currentText}, ${allergy}`
                            : allergy,
                        }));
                      }
                    }}
                  >
                    + {allergy}
                  </button>
                )
              )}
            </div>
            <textarea
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleInputChange}
              placeholder="List any allergies or intolerances"
              rows="3"
              className="glassy-textarea with-border"
            />
          </div>
          <div className="progress-indicator">
            <div className="progress-text">11 of 14</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "78%" }}></div>
            </div>
          </div>
        </div>
      ),
      showNextButton: true,
      showPrevButton: true,
    },

    // Cuisine Preferences
    {
      bg: "linear-gradient(135deg, #0284C7, #0369A1)",
      text: "white",
      icon: "fa-globe-asia",
      title: "What cuisines do you enjoy?",
      content: (
        <div className="questionnaire-section">
          <p className="buffer-text">
            Select all that you love. Variety is the spice of life!
          </p>
          <div className="form-group">
            <div className="cuisine-grid">
              {[
                { name: "Indian", icon: "🇮🇳" },
                { name: "Italian", icon: "🇮🇹" },
                { name: "Chinese", icon: "🇨🇳" },
                { name: "Mexican", icon: "🇲🇽" },
                { name: "Mediterranean", icon: "🫒" },
                { name: "Japanese", icon: "🇯🇵" },
                { name: "Thai", icon: "🇹🇭" },
                { name: "American", icon: "🇺🇸" },
                { name: "Middle Eastern", icon: "🥙" },
                { name: "Korean", icon: "🇰🇷" },
                { name: "French", icon: "🇫🇷" },
                { name: "Spanish", icon: "🇪🇸" },
              ].map((cuisine) => (
                <label
                  key={cuisine.name}
                  className={`cuisine-card ${
                    formData.cuisinePreferences.includes(cuisine.name)
                      ? "selected"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    value={cuisine.name}
                    checked={formData.cuisinePreferences.includes(cuisine.name)}
                    onChange={(e) =>
                      handleCheckboxChange(e, "cuisinePreferences")
                    }
                  />
                  <div className="cuisine-content">
                    <span className="cuisine-icon">{cuisine.icon}</span>
                    <span className="cuisine-name">{cuisine.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="progress-indicator">
            <div className="progress-text">12 of 14</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "85%" }}></div>
            </div>
          </div>
        </div>
      ),
      showNextButton: true,
      showPrevButton: true,
    },

    // Cultural Factors
    {
      bg: "linear-gradient(135deg, #4F46E5, #4338CA)",
      text: "white",
      icon: "fa-globe-americas",
      title: "Any cultural or religious dietary factors?",
      content: (
        <div className="questionnaire-section">
          <div className="form-group">
            <div className="religious-dietary-chips">
              {["Halal", "Kosher", "Hindu", "Buddhist", "Jain"].map(
                (factor) => (
                  <button
                    key={factor}
                    className="cultural-chip"
                    onClick={() => {
                      const currentText = formData.culturalFactors;
                      if (!currentText.includes(factor)) {
                        setFormData((prev) => ({
                          ...prev,
                          culturalFactors: currentText
                            ? `${currentText}, ${factor}`
                            : factor,
                        }));
                      }
                    }}
                  >
                    <i className="fas fa-plus-circle"></i> {factor}
                  </button>
                )
              )}
            </div>
            <textarea
              id="culturalFactors"
              name="culturalFactors"
              value={formData.culturalFactors}
              onChange={handleInputChange}
              placeholder="Any cultural or religious dietary considerations"
              rows="3"
              className="glassy-textarea with-border"
            />
          </div>
          <div className="progress-indicator">
            <div className="progress-text">13 of 14</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "92%" }}></div>
            </div>
          </div>
        </div>
      ),
      showNextButton: true,
      showPrevButton: true,
    },

    // Medical Conditions
    {
      bg: "linear-gradient(135deg, #0EA5E9, #0284C7)",
      text: "white",
      icon: "fa-heartbeat",
      title: "Any relevant medical conditions?",
      content: (
        <div className="questionnaire-section">
          <p className="buffer-text">
            This information stays private and helps us make safer
            recommendations.
          </p>
          <div className="form-group">
            <div className="common-conditions">
              {[
                "Diabetes",
                "Hypertension",
                "Thyroid",
                "Heart Disease",
                "PCOS",
                "IBS",
              ].map((condition) => (
                <button
                  key={condition}
                  className="condition-chip"
                  onClick={() => {
                    const currentText = formData.medicalConditions;
                    if (!currentText.includes(condition)) {
                      setFormData((prev) => ({
                        ...prev,
                        medicalConditions: currentText
                          ? `${currentText}, ${condition}`
                          : condition,
                      }));
                    }
                  }}
                >
                  <i className="fas fa-plus-circle"></i> {condition}
                </button>
              ))}
            </div>
            <textarea
              id="medicalConditions"
              name="medicalConditions"
              value={formData.medicalConditions}
              onChange={handleInputChange}
              placeholder="List any relevant medical conditions or medications"
              rows="3"
              className="glassy-textarea with-border"
            />
          </div>
          <div className="progress-indicator">
            <div className="progress-text">14 of 14</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "99%" }}></div>
            </div>
          </div>
        </div>
      ),
      showNextButton: true,
      showPrevButton: true,
    },

    // Completion
    {
      bg: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
      text: "white",
      icon: "fa-check-circle",
      title: "Perfect! You're all set.",
      content: (
        <div className="questionnaire-section final-section">
          <div className="completion-animation">
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
              </div>
            </div>
          </div>
          <p className="completion-text">
            Thank you for sharing your health information with us. Your
            personalized experience awaits!
          </p>
          <button
            className="start-button pulse-animation"
            onClick={handleSubmitData}
          >
            <Link>
              <span>Let's Begin</span>
            </Link>
            <i className="fas fa-arrow-right"></i>
          </button>
          <div className="completion-data">
            <div className="data-summary">
              <div className="summary-title">Your Profile Summary</div>
              <div className="summary-item">
                <i className="fas fa-user-circle"></i>
                <span>{formData.name}</span>
              </div>
              <div className="summary-item">
                <i className="fas fa-bullseye"></i>
                <span>Goal: {formData.healthGoal || "Not specified"}</span>
              </div>
              <div className="summary-item">
                <i className="fas fa-utensils"></i>
                <span>Diet: {formData.dietPattern || "Not specified"}</span>
              </div>
            </div>
          </div>
        </div>
      ),
      showNextButton: false,
      showPrevButton: true,
    },
  ];

  // Handle transition end
  const handleTransitionEnd = (e) => {
    if (e.target.classList.contains("page-content")) {
      setIsTransitioning(false);
    }
  };

  const handleNext = () => {
    if (isTransitioning) return;

    // If the current page requires validation and isn't valid, don't proceed
    if (activeIndex > 0 && activeIndex <= Object.keys(validationRules).length) {
      const isValid = validationRules[activeIndex](formData);
      if (!isValid) {
        // Highlight the field as required but don't proceed
        setPageValidation((prev) => ({ ...prev, [activeIndex]: false }));
        return;
      }
    }

    setIsTransitioning(true);
    setTransitionDirection("next");

    // Find the next non-conditional page or the next page that matches its condition
    let nextIndex = activeIndex + 1;
    while (
      nextIndex < pages.length &&
      pages[nextIndex].hasOwnProperty("conditional") &&
      pages[nextIndex].conditional === false
    ) {
      nextIndex++;
    }

    if (nextIndex < pages.length) {
      setTimeout(() => {
        setActiveIndex(nextIndex);
      }, 300); // This matches half of the CSS transition time
    }
  };

  const handlePrevious = () => {
    if (isTransitioning || activeIndex === 0) return;

    setIsTransitioning(true);
    setTransitionDirection("prev");

    // Find the previous non-conditional page or the previous page that matches its condition
    let prevIndex = activeIndex - 1;
    while (
      prevIndex >= 0 &&
      pages[prevIndex].hasOwnProperty("conditional") &&
      pages[prevIndex].conditional === false
    ) {
      prevIndex--;
    }

    if (prevIndex >= 0) {
      setTimeout(() => {
        setActiveIndex(prevIndex);
      }, 300); // This matches half of the CSS transition time
    }
  };

  // Filter out conditional pages that don't meet their condition
  const filteredPages = pages.filter(
    (page) => !page.hasOwnProperty("conditional") || page.conditional
  );

  // Check if the current page can proceed (for enabling/disabling next button)
  const canProceed = () => {
    if (activeIndex === 0) return true; // First page always proceeds

    if (activeIndex <= Object.keys(validationRules).length) {
      return validationRules[activeIndex](formData);
    }

    return true; // Default to true for pages without validation
  };

  return (
    <div className="onboarding-container">
      <style>{`
        .onboarding-container {
          width: 100%;
          height: 100vh;
          position: relative;
          overflow: hidden;
          font-family: "Inter", "Segoe UI", Arial, sans-serif;
          color: white;
          -webkit-tap-highlight-color: transparent;
        }

        /* Page styling */
        .page {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: 400% 400%;
          transition: opacity 0.6s ease;
          opacity: 0;
          pointer-events: none;
        }

        .page.active {
          opacity: 1;
          z-index: 1;
          pointer-events: all;
        }

        /* Page content styling */
        .page-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          transform: translateX(0);
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .page.active.transitioning-next .page-content {
          transform: translateX(-100%);
        }

        .page.active.transitioning-prev .page-content {
          transform: translateX(-100%);
        }

        .page.active.transitioning-prev .page-content {
          transform: translateX(100%);
        }

        .page.transitioning-in-next .page-content {
          transform: translateX(100%);
        }

        .page.transitioning-in-next.active .page-content {
          transform: translateX(0);
        }

        .page.transitioning-in-prev .page-content {
          transform: translateX(-100%);
        }

        .page.transitioning-in-prev.active .page-content {
          transform: translateX(0);
        }

        /* Animation for background */
        @keyframes gradientBackground {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Content styling */
        .content {
          text-align: center;
          max-width: min(95%, 600px);
          width: 100%;
          margin: 0 auto;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* Icon styling */
        .icon-container {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          margin-bottom: 25px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: pulseIcon 2s infinite;
        }

        @keyframes pulseIcon {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }

        .icon {
          font-size: 36px;
          width: 1em;
          height: 1em;
        }

        /* Typography */
        .title {
          font-size: clamp(24px, 5vw, 32px);
          margin: 0 0 20px 0;
          font-weight: 700;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          line-height: 1.2;
          padding: 0 10px;
        }

        .subtitle {
          font-size: 18px;
          margin-bottom: 30px;
          opacity: 0.9;
          font-weight: 400;
        }

        /* Navigation buttons */
        .navigation-button {
          position: fixed;
          bottom: max(20px, env(safe-area-inset-bottom, 20px));
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
          background-color: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .next-button {
          right: 20px;
          animation: floatButton 2s ease-in-out infinite;
        }

        .prev-button {
          left: 20px;
        }

        @keyframes floatButton {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .navigation-button:hover,
        .navigation-button:focus {
          background-color: rgba(255, 255, 255, 0.25);
          transform: scale(1.1);
          outline: none;
        }

        .navigation-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          animation: none;
          transform: none;
        }

        .navigation-button i {
          font-size: 28px;
          color: white;
        }

        /* Progress indicator */
        .progress-indicator {
          width: 100%;
          margin-top: 20px;
          text-align: center;
        }

        .progress-text {
          font-size: 14px;
          margin-bottom: 8px;
          opacity: 0.8;
        }

        .progress-bar {
          height: 4px;
          width: 100%;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background-color: white;
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        /* Validation styles */
        .required-field,
        .required-field-group {
          border-color: rgba(255, 80, 80, 0.7) !important;
          box-shadow: 0 0 0 2px rgba(255, 80, 80, 0.3) !important;
        }

        .validation-message {
          color: rgba(255, 150, 150, 0.9);
          font-size: 14px;
          margin-top: 8px;
          font-weight: 500;
          text-align: left;
          display: flex;
          align-items: center;
        }

        .validation-message::before {
          content: "!";
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          background: rgba(255, 100, 100, 0.8);
          border-radius: 50%;
          margin-right: 8px;
          font-weight: bold;
        }

        /* Glassy questionnaire styling */
        .questionnaire-section {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: max(20px, 5%);
          width: 100%;
          max-width: 500px;
          color: white;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin: 0 auto;
        }

        .questionnaire-section:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        }

        .buffer-text {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 20px;
          opacity: 0.9;
          text-align: center;
        }

        .instruction-text {
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 10px;
          text-align: center;
        }

        .form-group {
          margin-bottom: 20px;
          width: 100%;
        }

        /* Input styling */
        .glassy-input,
        .glassy-textarea,
        .glassy-select {
          width: 100%;
          padding: 15px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          font-size: 16px;
          color: white;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          appearance: none;
          -webkit-appearance: none;
        }

        .glassy-input.with-border,
        .glassy-textarea.with-border {
          border-width: 2px;
          border-color: rgba(255, 255, 255, 0.3);
        }

        .glassy-input.with-calendar-icon {
          background-image: url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>');
          background-repeat: no-repeat;
          background-position: right 15px center;
          padding-right: 45px;
        }

        .glassy-input::placeholder,
        .glassy-textarea::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .glassy-input:focus,
        .glassy-textarea:focus,
        .glassy-select:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .input-group {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .input-group.elevation-effect:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .input-group .glassy-input {
          border: none;
          background: transparent;
          border-radius: 0;
          box-shadow: none;
          flex: 1;
        }

        .unit-selector {
          padding: 0 15px;
          background-color: rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          min-width: 90px;
          justify-content: center;
        }

        .unit-selector .glassy-select {
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 10px;
          width: 100%;
          text-align: center;
        }

        .unit-label {
          padding: 0 15px;
          background-color: rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          min-width: 60px;
          justify-content: center;
        }

        /* Modern card selection styles */
        .modern-radio-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 15px;
          width: 100%;
        }

        .modern-radio-card {
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modern-radio-card input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .card-content {
          padding: 15px 10px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          aspect-ratio: 1/1;
        }

        .modern-radio-card:hover .card-content {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px);
        }

        .modern-radio-card.selected .card-content {
          background: rgba(255, 255, 255, 0.25);
          border-color: white;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          transform: translateY(-5px) scale(1.05);
        }

        .card-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
          font-size: 20px;
          color: white;
          transition: all 0.3s ease;
        }

        .modern-radio-card.selected .card-icon {
          transform: scale(1.1);
        }

        .card-label {
          font-weight: 600;
          font-size: 14px;
          text-align: center;
        }

        /* Activity level selector */
        .activity-level-selector {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .activity-card {
          position: relative;
          cursor: pointer;
        }

        .activity-card input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .activity-card-content {
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        .activity-card:hover .activity-card-content {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(5px);
        }

        .activity-card.selected .activity-card-content {
          background: rgba(255, 255, 255, 0.25);
          border-color: white;
          transform: translateX(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 18px;
          flex-shrink: 0;
        }

        .activity-details {
          display: flex;
          flex-direction: column;
        }

        .activity-title {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 5px;
        }

        .activity-desc {
          font-size: 13px;
          opacity: 0.8;
        }

        /* Weekly calendar */
        .weekly-calendar {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-bottom: 20px;
        }

        .day-button {
          padding: 12px;
          min-width: 60px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          font-size: 14px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .day-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
        }

        .day-button.selected {
          background: rgba(255, 255, 255, 0.3);
          border-color: white;
          transform: translateY(-3px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          font-weight: 600;
        }

        .calendar-visual {
          margin-top: 15px;
        }

        .week-view {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 5px;
        }

        .day-cell {
          aspect-ratio: 1/1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .day-cell.active {
          background: rgba(255, 255, 255, 0.3);
          font-weight: 600;
        }

        /* Exercise type grid */
        .exercise-type-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
          gap: 10px;
          width: 100%;
        }

        .exercise-card {
          position: relative;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .exercise-card input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .exercise-icon {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          font-size: 18px;
          color: white;
          transition: all 0.3s ease;
        }

        .exercise-card:hover .exercise-icon {
          transform: translateY(-5px);
        }

        .exercise-card.selected .exercise-icon {
          transform: translateY(-8px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .exercise-label {
          font-size: 13px;
          font-weight: 500;
          text-align: center;
        }

        .exercise-card.selected .exercise-label {
          font-weight: 600;
        }

        /* Diet pattern cards */
        .diet-pattern-cards {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .diet-card {
          position: relative;
          cursor: pointer;
        }

        .diet-card input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .diet-card-content {
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        .diet-card:hover .diet-card-content {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(5px);
        }

        .diet-card.selected .diet-card-content {
          background: rgba(255, 255, 255, 0.25);
          border-color: white;
          transform: translateX(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .diet-icon {
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 16px;
          flex-shrink: 0;
        }

        .diet-details {
          display: flex;
          flex-direction: column;
        }

        .diet-title {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 3px;
        }

        .diet-desc {
          font-size: 13px;
          opacity: 0.8;
        }

        /* Cuisine grid */
        .cuisine-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          gap: 10px;
          width: 100%;
        }

        .cuisine-card {
          position: relative;
          cursor: pointer;
        }

        .cuisine-card input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .cuisine-content {
          padding: 12px 8px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          height: 100%;
        }

        .cuisine-card:hover .cuisine-content {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
        }

        .cuisine-card.selected .cuisine-content {
          background: rgba(255, 255, 255, 0.25);
          border-color: white;
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .cuisine-icon {
          font-size: 22px;
          margin-bottom: 5px;
        }

        .cuisine-name {
          font-size: 13px;
          font-weight: 500;
          text-align: center;
        }

        /* Quick chips for location, allergies, etc */
        .quick-location-chips,
        .common-allergies,
        .religious-dietary-chips,
        .common-conditions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 15px;
        }

        .location-chip,
        .allergy-chip,
        .cultural-chip,
        .condition-chip {
          padding: 8px 15px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          font-size: 14px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .location-chip:hover,
        .allergy-chip:hover,
        .cultural-chip:hover,
        .condition-chip:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        /* Visual aids */
        .height-visual-aid,
        .weight-visual {
          margin: 20px 0;
          display: flex;
          justify-content: center;
        }

        .ruler-visual {
          height: 120px;
          width: 40px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 5px 0;
        }

        .ruler-marker {
          width: 10px;
          height: 1px;
          background: rgba(255, 255, 255, 0.5);
          margin-left: 5px;
        }

        .ruler-marker.tall {
          width: 15px;
          height: 2px;
          background: white;
        }

        .ruler-person {
          position: absolute;
          left: -40px;
          bottom: 0;
          font-size: 24px;
          transition: height 0.3s ease;
        }

        .weight-indicator {
          height: 20px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.5) 100%
          );
          border-radius: 10px;
          transition: width 0.3s ease;
          position: relative;
        }

        .weight-value {
          position: absolute;
          top: -25px;
          right: 0;
          font-weight: 600;
          font-size: 14px;
        }

        .scale-icon {
          margin-right: 15px;
          font-size: 24px;
        }

        /* Target weight visual */
        .weight-journey-visual {
          margin-top: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .journey-start,
        .journey-end {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          font-size: 14px;
        }

        .journey-line {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }

        .journey-progress {
          height: 100%;
          background: white;
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        .weight-display {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .current-weight,
        .target-weight {
          padding: 5px 10px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 5px;
        }

        /* Search location styling */
        .location-input {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.7;
        }

        .glassy-input.with-icon {
          padding-left: 40px;
        }

        /* Floating label */
        .floating-label {
          position: absolute;
          top: -10px;
          left: 15px;
          font-size: 12px;
          background: rgba(0, 0, 0, 0.2);
          padding: 2px 8px;
          border-radius: 4px;
          pointer-events: none;
        }

        /* Completion page styling */
        .final-section {
          max-width: 600px;
        }

        .completion-text {
          font-size: 18px;
          line-height: 1.6;
          margin-bottom: 30px;
          opacity: 0.9;
          text-align: center;
        }

        .start-button {
          background: white;
          color: #3b82f6;
          border: none;
          border-radius: 30px;
          padding: 16px 32px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 20px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .start-button:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }

        .pulse-animation {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }

        /* Success checkmark animation */
        .completion-animation {
          margin-bottom: 20px;
        }

        .success-checkmark {
          width: 80px;
          height: 80px;
          margin: 0 auto;
        }

        .check-icon {
          width: 80px;
          height: 80px;
          position: relative;
          border-radius: 50%;
          box-sizing: content-box;
          border: 4px solid white;
        }

        .check-icon::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
        }

        .check-icon .icon-line {
          height: 4px;
          background-color: white;
          display: block;
          border-radius: 2px;
          position: absolute;
          z-index: 10;
        }

        .check-icon .icon-line.line-tip {
          top: 38px;
          left: 16px;
          width: 25px;
          transform: rotate(45deg);
          animation: iconLineTip 0.75s;
        }

        .check-icon .icon-line.line-long {
          top: 32px;
          right: 12px;
          width: 47px;
          transform: rotate(-45deg);
          animation: iconLineLong 0.75s;
        }

        @keyframes iconLineTip {
          0% {
            width: 0;
            left: 0;
            top: 20px;
          }
          54% {
            width: 0;
            left: 0;
            top: 20px;
          }
          70% {
            width: 25px;
            left: -8px;
            top: 35px;
          }
          84% {
            width: 17px;
            left: 12px;
            top: 40px;
          }
          100% {
            width: 25px;
            left: 16px;
            top: 38px;
          }
        }

        @keyframes iconLineLong {
          0% {
            width: 0;
            right: 0;
            top: 50px;
          }
          65% {
            width: 0;
            right: 0;
            top: 50px;
          }
          84% {
            width: 55px;
            right: 0;
            top: 28px;
          }
          100% {
            width: 47px;
            right: 12px;
            top: 32px;
          }
        }

        /* Completion data display */
        .completion-data {
          margin-top: 30px;
          width: 100%;
        }

        .data-summary {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          padding: 15px;
          width: 100%;
        }

        .summary-title {
          text-align: center;
          font-weight: 600;
          margin-bottom: 10px;
          font-size: 16px;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 5px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .content {
            padding: 15px 0;
          }

          .icon-container {
            width: 70px;
            height: 70px;
            margin-bottom: 20px;
          }

          .icon {
            font-size: 28px;
          }

          .title {
            margin-bottom: 15px;
          }

          .questionnaire-section {
            padding: 20px 15px;
          }

          .modern-radio-cards {
            grid-template-columns: repeat(2, 1fr);
          }

          .card-icon {
            width: 40px;
            height: 40px;
            font-size: 18px;
            margin-bottom: 10px;
          }

          .exercise-type-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .cuisine-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .navigation-button {
            width: 60px;
            height: 60px;
          }

          .navigation-button i {
            font-size: 24px;
          }

          .buffer-text {
            font-size: 15px;
          }

          .activity-card-content,
          .diet-card-content {
            padding: 10px;
          }

          .activity-icon,
          .diet-icon {
            width: 35px;
            height: 35px;
            font-size: 16px;
            margin-right: 10px;
          }

          .activity-title,
          .diet-title {
            font-size: 15px;
          }

          .activity-desc,
          .diet-desc {
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .icon-container {
            width: 60px;
            height: 60px;
          }

          .icon {
            font-size: 24px;
          }

          .questionnaire-section {
            padding: 15px 12px;
          }

          .exercise-type-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }

          .cuisine-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .card-content {
            padding: 12px 8px;
          }

          .exercise-icon {
            width: 35px;
            height: 35px;
            font-size: 16px;
          }

          .exercise-label,
          .cuisine-name {
            font-size: 12px;
          }

          .weekly-calendar {
            gap: 6px;
          }

          .day-button {
            min-width: 50px;
            padding: 10px 8px;
            font-size: 13px;
          }

          .location-chip,
          .allergy-chip,
          .cultural-chip,
          .condition-chip {
            padding: 6px 12px;
            font-size: 13px;
          }

          .glassy-input,
          .glassy-textarea,
          .glassy-select {
            padding: 12px;
            font-size: 15px;
          }

          .navigation-button {
            width: 55px;
            height: 55px;
          }

          .navigation-button i {
            font-size: 22px;
          }
        }

        /* Fix iOS Safari bottom padding */
        @supports (-webkit-touch-callout: none) {
          .navigation-button {
            bottom: max(20px, env(safe-area-inset-bottom, 20px));
          }

          .content-wrapper {
            padding-bottom: env(safe-area-inset-bottom, 20px);
          }
        }
      `}</style>

      {filteredPages.map((page, index) => (
        <div
          key={index}
          className={`page ${activeIndex === index ? "active" : ""} ${
            isTransitioning && activeIndex === index
              ? `transitioning-${transitionDirection}`
              : ""
          } ${
            isTransitioning &&
            ((transitionDirection === "next" && index === activeIndex + 1) ||
              (transitionDirection === "prev" && index === activeIndex - 1))
              ? `transitioning-in-${transitionDirection}`
              : ""
          }`}
          style={{ background: page.bg }}
        >
          <div className="page-content" onTransitionEnd={handleTransitionEnd}>
            <div className="content">
              <div className="icon-container">
                <i className={`fas ${page.icon} icon`} />
              </div>
              <h1 className="title">{page.title}</h1>
              {page.subtitle && <p className="subtitle">{page.subtitle}</p>}
              {page.content}
            </div>
          </div>
        </div>
      ))}

      {/* Previous button */}
      {activeIndex > 0 &&
        filteredPages[activeIndex].showPrevButton !== false && (
          <button
            className="navigation-button prev-button"
            onClick={handlePrevious}
            aria-label="Previous"
            disabled={isTransitioning}
          >
            <i className="fas fa-arrow-left" />
          </button>
        )}

      {/* Next button */}
      {activeIndex < filteredPages.length - 1 &&
        filteredPages[activeIndex].showNextButton !== false && (
          <button
            className="navigation-button next-button"
            onClick={handleNext}
            aria-label="Next"
            disabled={isTransitioning || !canProceed()}
          >
            <i className="fas fa-arrow-right" />
          </button>
        )}
    </div>
  );
};

export default Onboarding;
