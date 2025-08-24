const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    email: String,
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    snapHistory: [
      {
        date: { type: Date, default: Date.now },
        activity: String,
      },
    ],
    streaks: {
      count: { type: Number, default: 0 },
      lastUpdated: { type: Date, default: Date.now },
    },
    reminders: [
      {
        message: String,
        time: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Update index to use 'user' field
ProfileSchema.index({ user: 1 });

module.exports = mongoose.model("Profile", ProfileSchema);
