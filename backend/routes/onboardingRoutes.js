const express = require("express");
const router = express.Router();
const onboardingController = require("../controllers/OnboardingController");
const { protect } = require("../middleware/authMiddleware");

// Create new onboarding
router.post("/create", protect, onboardingController.createOnboarding);

// Get current user's onboarding
router.get("/me", protect, onboardingController.getMyOnboarding);

// Get all onboarding entries
router.get("/", onboardingController.getAllOnboarding);

// Get specific onboarding
router.get("/:id", onboardingController.getOnboardingById);

// Update onboarding
router.put("/:id", onboardingController.updateOnboarding);

module.exports = router;
