require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { sendUpcomingReminders } = require("./controllers/interviewController");

const applicationRoutes = require("./routes/applications");
const adminRoutes = require("./routes/admin");
const inducteeAuthRoutes = require("./routes/inducteeAuth");
const domainRoutes = require("./routes/domain");
const interviewRoutes = require("./routes/interviews");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.use("/api/applications", applicationRoutes); // Module A
app.use("/api/admin", adminRoutes); // Module B, C(assign), F
app.use("/api/inductee-auth", inducteeAuthRoutes); // simplified inductee identity check
app.use("/api/domain", domainRoutes); // Module C
app.use("/api/interviews", interviewRoutes); // Module D, E

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  // Module D — Basic: "Email reminder sent to inductee ahead of their
  // scheduled interview." Runs once a day; also exported so you can trigger
  // it manually for testing (see scripts/sendReminders.js).
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  setInterval(() => {
    sendUpcomingReminders().catch((err) => console.error("Reminder job failed:", err));
  }, ONE_DAY_MS);
});
