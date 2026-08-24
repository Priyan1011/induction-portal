const mongoose = require("mongoose");

const qnaSchema = new mongoose.Schema(
  {
    domain: { type: String, required: true },
    inductee: { type: mongoose.Schema.Types.ObjectId, ref: "Inductee", required: true },
    question: { type: String, required: true },
    answer: { type: String, default: null },
    askedAt: { type: Date, default: Date.now },
    answeredAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QnA", qnaSchema);
