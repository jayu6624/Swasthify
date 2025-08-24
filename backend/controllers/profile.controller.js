// controllers/profile.controller.js
const Profile = require("../models/profile.model");
const User = require("../models/user.model");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

// Create profile for a user
exports.createProfile = async (userId, profileData) => {
  try {
    // Check if profile already exists
    let existingProfile = await Profile.findOne({ userId: userId });
    if (existingProfile) {
      return existingProfile;
    }

    // Create new profile
    const newProfile = new Profile({
      user: userId,
      height: profileData.height || 0,
      weight: profileData.weight || 0,
      age: profileData.age,
      gender: profileData.gender,
    });

    return await newProfile.save();
  } catch (error) {
    console.error("Profile creation error:", error);
    throw error;
  }
};

// Get profile by user ID
exports.getProfileByUserId = async (req, res) => {
  try {
    const userId = req.params.userId.replace(":", ""); // Remove any colon if present
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // First find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Then find the profile using user reference
    const profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get profile by email
exports.getProfileByEmail = async (req, res) => {
  try {
    const email = req.params.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    const profile = await Profile.findOne({ user: user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found for this user",
      });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Get profile by email error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { height, weight, age, gender } = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          height,
          weight,
          age,
          gender,
        },
      },
      { new: true }
    );

    if (!updatedProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add activity snap
exports.addActivitySnap = async (req, res) => {
  try {
    const { activity } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        $push: {
          snapHistory: {
            activity,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Add activity error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add or update reminder
exports.updateReminders = async (req, res) => {
  try {
    const { message, time } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        $push: {
          reminders: { message, time },
        },
      },
      { new: true }
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Update reminders error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
