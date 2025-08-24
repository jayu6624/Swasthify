// const userService = require("../services/user.service");
// const { validationResult } = require("express-validator");
// const userModel = require("../models/user.model");

// const nodemailer = require('nodemailer');

// module.exports.registerUser = async (req, res) => {
//   try {
//     const errors = validationResult(req);

//     // Validate request payload
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name, age, gender, email, number, password } = req.body;

//     // Validate phone number format
//     if (!/^\d{10}$/.test(number)) {
//       return res.status(400).json({
//         message: "Invalid phone number format. Please provide a 10-digit number.",
//       });
//     }

//     // Check if the user already exists
//     const existingUser = await userService.getUserByEmail(email);
//     if (existingUser) {
//       return res.status(400).json({
//         message: "User already exists. Please try logging in.",
//       });
//     }

//     // Create the new user
//     const user = await userService.createUser({
//       name,
//       age,
//       gender,
//       email,
//       number,
//       password,
//     });

//     // Generate token
//     const token = user.generateAuthToken();

//     res.status(201).json({
//       message: "User registered successfully.",
//       token,
//       user: { name: user.name, email: user.email, number: user.number },
//     });
//   } catch (error) {
//     console.error("Error in registerUser:", error.message);
//     res.status(500).json({
//       message: "An unexpected error occurred. Please try again later.",
//     });
//   }
// };

// module.exports.loginUser = async (req, res, next) => {
//     try {
//         // Validate request fields
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const { identifier, password } = req.body; // identifier can be email or phone number

//         // Check if the identifier is an email or phone number
//         const isEmail = /\S+@\S+\.\S+/.test(identifier);
//         console.log("identifire = "+identifier);

//         const searchField = isEmail ? { email: identifier } : { number: identifier };
//         console.log(searchField);

//         // Find user by email or phone number
//         const user = await userModel.findOne(searchField).select("+password");
//         console.log("user  = "+user);

//         console.log("---------------");
//         if (!user) {
//             return res.status(401).json({ message: "Invalid email/phone or password" });
//         }

//         // Compare password
//         const isMatch = await user.comparePassword(password);
//         if (!isMatch) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         // Generate JWT token
//         const token = user.generateAuthToken();
//         res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });

//         res.status(200).json({ token, user });
//     } catch (error) {
//         console.error("Error in loginUser:", error.message);
//         res.status(500).json({ message: "An unexpected error occurred. Please try again." });
//     }
// };

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// const

const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const nodemailer = require("nodemailer");

let otpStorage = {}; // Temporary storage for OTPs

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Ignore self-signed cert errors
  },
});

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP to user's email during registration
module.exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Please login." });
    }

    const otp = generateOTP();
    otpStorage[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Expires in 5 minutes

    await transporter.sendMail({
      from: "Swasthify <no-reply@swasthify.com>",
      to: email,
      subject: "Email Verification OTP",
      text: `Welcome to Swasthify!\n\nYour OTP for email verification is: ${otp}.\nPlease enter this OTP within 5 minutes to verify your email.\n\nThank you for joining us!\n\n- The Swasthify Team`,
    });

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("Error in sendOTP:", error.message);
    res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
};

// Verify OTP route
module.exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedOTP = otpStorage[email];

    if (!storedOTP || storedOTP.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (Date.now() > storedOTP.expiresAt) {
      delete otpStorage[email];
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    res
      .status(200)
      .json({ message: "OTP verified. Proceed with registration." });
  } catch (error) {
    console.error("Error in verifyOTP:", error.message);
    res
      .status(500)
      .json({ message: "OTP verification failed. Please try again." });
  }
};

// Register user only after OTP verification
module.exports.registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    console.log(errors);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() +"error in validation"});
    }

    const { name, age, gender, email, number, password } = req.body;

    if (!otpStorage[email]) {
      return res.status(400).json({
        message: "Email not verified. Please complete OTP verification.",
      });
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(number)) {
      return res.status(400).json({
        message:
          "Invalid phone number format. Please provide a 10-digit number.",
      });
    }

    // Check if user already exists
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Please login." });
    }

    // Create user
    const user = await userService.createUser({
      name,
      age,
      gender,
      email,
      number,
      password,
    });

    // Remove OTP from storage
    delete otpStorage[email];

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(201).json({
      message: "User registered successfully.",
      token,
      user: { name: user.name, email: user.email, number: user.number },
    });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    res
      .status(500)
      .json({ message: "An unexpected error occurred. Please try again." });
  }
};

// User login
module.exports.loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { identifier, password } = req.body;

    // Determine if identifier is email or phone
    const isEmail = /\S+@\S+\.\S+/.test(identifier);
    const searchField = isEmail
      ? { email: identifier }
      : { number: identifier };

    // Find user
    const user = await userModel.findOne(searchField).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email/phone or password" });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    console.log("tokn = " + token);
    console.log("user = " + user);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isOnboardingCompleted: user.isOnboardingCompleted,
      },
      isOnboardingCompleted: user.isOnboardingCompleted,
    });
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    res
      .status(500)
      .json({ message: "An unexpected error occurred. Please try again." });
  }
};
// Check user status (exists or not)
module.exports.checkUserStatus = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userService.getUserByEmail(email);

    if (user) {
      return res.status(200).json({ exists: true });
    }

    res.status(200).json({ exists: false });
  } catch (error) {
    console.error("Error checking user status:", error.message);
    res.status(500).json({
      message: "Failed to check user status. Please try again.",
    });
  }
};

module.exports.updateonboarding = async (req, res) => {
  try {
    // Get user ID from auth token instead of email
    const userId = req.user._id; // This comes from auth middleware

    // Find user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update onboarding status
    user.isOnboardingCompleted = true;
    await user.save();

    res.status(200).json({
      message: "Onboarding completed successfully.",
      user: {
        name: user.name,
        email: user.email,
        isOnboardingCompleted: user.isOnboardingCompleted,
      },
    });
  } catch (error) {
    console.error("Error updating onboarding status:", error.message);
    res.status(500).json({ message: "Failed to update onboarding status." });
  }
};
