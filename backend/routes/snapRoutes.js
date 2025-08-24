const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Upload image endpoint
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      console.error("[UPLOAD] No image file provided");
      return res.status(400).json({ error: "No image file provided" });
    }
    console.log(`[UPLOAD] Image saved: ${req.file.path}`);
    res.json({
      success: true,
      imagePath: req.file.path,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("[UPLOAD] Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// Analyze meal endpoint
router.post("/analyze", async (req, res) => {
  try {
    const { imagePath } = req.body;
    console.log(`[ANALYZE] Received imagePath: ${imagePath}`);
    if (!imagePath) {
      console.error("[ANALYZE] No image path provided");
      return res.status(400).json({ error: "Image path is required" });
    }
    if (!fs.existsSync(imagePath)) {
      console.error(`[ANALYZE] Image file not found: ${imagePath}`);
      return res.status(404).json({ error: "Image file not found" });
    }
    // Path to the Python script
    const pythonScriptPath = path.join(__dirname, "../python/meal_analyzer.py");
    if (!fs.existsSync(pythonScriptPath)) {
      console.error("[ANALYZE] Meal analyzer script not found");
      return res.status(500).json({ error: "Meal analyzer script not found" });
    }
    console.log(
      `[ANALYZE] Running Python script: ${pythonScriptPath} with image: ${imagePath}`
    );
    // Run Python script
    const pythonProcess = spawn("python", [pythonScriptPath, imagePath]);
    let result = "";
    let errorOutput = "";
    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });
    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });
    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("[ANALYZE] Python script error:", errorOutput);
        return res.status(500).json({
          error: "Failed to analyze meal",
          details: errorOutput,
        });
      }
      try {
        // Parse the JSON result from Python script
        const analysisResult = JSON.parse(result);
        // Clean up the uploaded file
        fs.unlink(imagePath, (err) => {
          if (err) console.error("[ANALYZE] Error deleting file:", err);
        });
        res.json(analysisResult);
      } catch (parseError) {
        console.error("[ANALYZE] JSON parse error:", parseError);
        console.error("[ANALYZE] Raw result:", result);
        res.status(500).json({
          error: "Invalid response from meal analyzer",
          rawResult: result,
        });
      }
    });
    pythonProcess.on("error", (error) => {
      console.error("[ANALYZE] Process error:", error);
      res.status(500).json({ error: "Failed to start meal analyzer" });
    });
  } catch (error) {
    console.error("[ANALYZE] Analysis error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get analysis history (optional)
router.get("/history", (req, res) => {
  // This could be implemented to store and retrieve analysis history
  res.json({ message: "History feature not implemented yet" });
});

module.exports = router;
