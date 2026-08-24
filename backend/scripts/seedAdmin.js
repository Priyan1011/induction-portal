// Run once to create the admin account: node scripts/seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "changeme123";

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log(`Admin "${username}" already exists.`);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ username, passwordHash });
    console.log(`Admin created — username: ${username}, password: ${password}`);
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
