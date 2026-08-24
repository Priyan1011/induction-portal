const mongoose = require("mongoose");

const DOMAINS = ["DevOps", "Corporate Communications", "Creatives"];

const inducteeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true, unique: true },
    contact: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },

    // Module A — exactly 2 domain preferences, ranked
    preferences: {
      first: { type: String, enum: DOMAINS, required: true },
      second: { type: String, enum: DOMAINS, required: true },
    },

    // Optional domain-specific follow-up answers (Brownie)
    followUpAnswers: { type: mongoose.Schema.Types.Mixed, default: {} },

    // Module C — domain confirmed by admin
    assignedDomain: { type: String, enum: DOMAINS, default: null },

    // Module F — round progression
    round: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["Applied", "In Review", "Selected", "Rejected"],
      default: "Applied",
    },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

inducteeSchema.pre("validate", function (next) {
  if (this.preferences && this.preferences.first === this.preferences.second) {
    this.invalidate("preferences.second", "First and second preference must be different domains.");
  }
  next();
});

module.exports = mongoose.model("Inductee", inducteeSchema);
module.exports.DOMAINS = DOMAINS;
