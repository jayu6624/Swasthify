const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received:", token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded:", decoded);
      console.log("Looking for user with _id:", decoded._id);

      // Get user from token
      req.user = await User.findById(decoded._id).select("-password");
      console.log("User found:", req.user ? "Yes" : "No");
      
      if (req.user) {
        console.log("User details:", {
          _id: req.user._id,
          email: req.user.email,
          name: req.user.name
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
  } else {
    console.log("No authorization header found");
    res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }
};

module.exports = { protect };
