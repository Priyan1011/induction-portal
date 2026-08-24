// Manual trigger for interview reminders, for testing without waiting a day.
// Run: node scripts/sendReminders.js
require("dotenv").config();
const mongoose = require("mongoose");
const { sendUpcomingReminders } = require("../controllers/interviewController");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  await sendUpcomingReminders();
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
