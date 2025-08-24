// const express = require("express");
// const { body } = require("express-validator");
// const userController = require("../controllers/user.controller");

// const router = express.Router();

// // Register Route
// router.post(
//   "/register",
//   [
//     body("name").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
//     body("age").isInt({ min: 1 }).withMessage("Age must be a valid number"),
//     body("gender").isIn(["Male", "Female", "Other"]).withMessage("Invalid gender value"),
//     body("email").isEmail().withMessage("Invalid Email"),
//     body("number").isLength({ min: 10, max: 10 }).withMessage("Phone number must be 10 digits long"),
//     body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
//   ],
//   userController.registerUser
// );

// router.post(
//     "/login",
//     [
//       body("identifier")
//         .notEmpty()
//         .withMessage("Email or phone number is required"),
//       body("password")
//         .isLength({ min: 6 })
//         .withMessage("Password must be at least 6 characters long"),
//     ],
//     userController.loginUser
//   );

// module.exports = router;
const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const auth = require('../middleware/user.auth');

const router = express.Router();

// Send OTP Route
router.post(
  "/send-otp",
  [body("email").isEmail().withMessage("Invalid Email")],
  userController.sendOTP
);

// Verify OTP Route
router.post(
  "/verify-otp",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits long"),
  ],
  userController.verifyOTP
);

// Register Route
router.post(
  "/register",
  [
    body("name")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),
    body("age").isInt({ min: 1 }).withMessage("Age must be a valid number"),
    body("gender")
      .isIn(["Male", "Female", "Other"])
      .withMessage("Invalid gender value"),
    body("email").isEmail().withMessage("Invalid Email"),
    body("number")
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone number must be 10 digits long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.registerUser
);

// Login Route
router.post(
  "/login",
  [
    body("identifier")
      .notEmpty()
      .withMessage("Email or phone number is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.loginUser
);

router.post(
  "/status",

  userController.checkUserStatus
);

router.put("/update-onboarding-status", auth, userController.updateonboarding);

module.exports = router;
