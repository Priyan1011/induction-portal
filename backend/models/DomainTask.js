const mongoose = require("mongoose");

const domainTaskSchema = new mongoose.Schema(
  {
    domain: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    deadline: { type: Date, required: true },
    postedBy: { type: String, default: "admin" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DomainTask", domainTaskSchema);
