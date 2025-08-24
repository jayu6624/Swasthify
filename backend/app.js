const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectToDb = require("./config/db");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const userRoutes = require("./routes/user.route");
const profileRoutes = require("./routes/profile.route");
const onboardingRoutes = require("./routes/onboardingRoutes");
const googleAuthRoutes = require("./routes/googleAuth");
const snapRoutes = require("./routes/snapRoutes");
const PythonAutoSetup = require("./python/autoSetup");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);

// Initialize Passport
app.use(passport.initialize());
require("./config/googleAuth");

app.use("/api/user", userRoutes);
app.use("/api/user/profile", profileRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/snap", snapRoutes);

// Initialize Python environment for SnapMeal
async function initializePythonEnvironment() {
  try {
    const pythonSetup = new PythonAutoSetup();
    console.log("🚀 Initializing SnapMeal Python environment...");

    const envReady = await pythonSetup.checkPythonEnvironment();
    if (envReady) {
      await pythonSetup.testMealAnalyzer();
      console.log("✅ SnapMeal Python environment is ready!");
    } else {
      console.log(
        "⚠️  SnapMeal Python environment setup failed. Some features may not work."
      );
    }
  } catch (error) {
    console.error("❌ Error setting up Python environment:", error.message);
    console.log("💡 SnapMeal feature may not work properly.");
  }
}

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);

  // Initialize Python environment after server starts
  await initializePythonEnvironment();
});

connectToDb();

module.exports = app;
