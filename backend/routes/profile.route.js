const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");

// @route GET /api/profile/:userId - Get user profile
router.get("/:userId", profileController.getProfileByUserId);

// @route POST /api/profile - Create or update profile
router.post("/", profileController.createProfile);

// @route DELETE /api/profile/:userId - Delete profile

module.exports = router;