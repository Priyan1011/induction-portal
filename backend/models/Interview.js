const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    inductee: { type: mongoose.Schema.Types.ObjectId, ref: "Inductee", required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: "InterviewSlot", required: true },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "No-show"],
      default: "Scheduled",
    },
    // Brownie: interviewer notes/rating, visible only to admin
    notes: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
