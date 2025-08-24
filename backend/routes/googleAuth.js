const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Initialize Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      const user = req.user;
      console.log("Google OAuth user:", user);

      // Generate JWT token
      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      console.log("Generated token payload:", {
        _id: user._id,
        email: user.email,
      });

      // Check if user has completed onboarding
      const hasCompletedOnboarding = user.isOnboardingCompleted || false;
      console.log("Onboarding completed:", hasCompletedOnboarding);

      // Redirect to frontend with token and onboarding status
      const redirectUrl = hasCompletedOnboarding
        ? `http://localhost:5173/dashboard?token=${token}`
        : `http://localhost:5173/onboarding?token=${token}`;

      console.log("Redirecting to:", redirectUrl);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.redirect("http://localhost:5173/login?error=oauth_failed");
    }
  }
);

module.exports = router;
