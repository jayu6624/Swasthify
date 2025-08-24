const mongoose = require("mongoose");

const onboardingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    dob: { type: Date, required: true },
    city: { type: String, required: true },
    height: { type: Number, required: true },
    heightUnit: { type: String, enum: ["cm", "inches"], default: "cm" },
    weight: { type: Number, required: true },
    weightUnit: { type: String, enum: ["kg", "lbs"], default: "kg" },
    healthGoal: {
      type: String,
      enum: [
        "Weight Loss",
        "Weight Gain",
        "Maintain Weight",
        "Improve Fitness",
      ],
      required: true,
    },
    targetWeight: { type: Number },
    activityLevel: {
      type: String,
      enum: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"],
      required: true,
    },
    exerciseDays: { type: Number, required: true },
    exerciseType: [{ type: String }],
    dietPattern: { type: String, required: true },
    allergies: { type: String },
    cuisinePreferences: [{ type: String }],
    culturalFactors: { type: String },
    medicalConditions: { type: String },
    additionalInfo: { type: String },
    bmi: { type: Number },
    submittedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Onboarding", onboardingSchema);
