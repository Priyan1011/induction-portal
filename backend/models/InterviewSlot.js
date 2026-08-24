const mongoose = require("mongoose");

const interviewSlotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // "YYYY-MM-DD"
    startTime: { type: String, required: true }, // "HH:mm"
    endTime: { type: String, required: true },
    domain: { type: String, default: null }, // optional: restrict slot to a domain
    isBooked: { type: Boolean, default: false },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Inductee", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewSlot", interviewSlotSchema);
