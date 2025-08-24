#!/usr/bin/env node

const app = require("./app");
const connectToDb = require("./config/db");

async function startServer() {
  try {
    console.log("🚀 Starting Healthcare Backend Server...");

    // Connect to database
    await connectToDb();
    console.log("✅ Database connected successfully!");

    console.log("🎉 Server is ready! SnapMeal feature will be available.");
    console.log("📱 Frontend should be running on http://localhost:5173");
    console.log("🔧 Backend API available on http://localhost:4000");
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
