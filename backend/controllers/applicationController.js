const Inductee = require("../models/Inductee");
const { sendEmail } = require("../utils/email");

// Module A — Basic: Public application submission
async function submitApplication(req, res) {
  try {
    const { name, rollNumber, contact, email, firstPreference, secondPreference, followUpAnswers } = req.body;

    if (!name || !rollNumber || !contact || !email || !firstPreference || !secondPreference) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (firstPreference === secondPreference) {
      return res.status(400).json({ message: "You cannot pick the same domain twice." });
    }

    const existing = await Inductee.findOne({ rollNumber });
    if (existing) {
      return res.status(409).json({ message: "An application with this roll number already exists." });
    }

    const inductee = await Inductee.create({
      name,
      rollNumber,
      contact,
      email,
      preferences: { first: firstPreference, second: secondPreference },
      followUpAnswers: followUpAnswers || {},
    });

    // Confirmation email
    await sendEmail({
      to: email,
      subject: "SCIEnT Induction — Application Received",
      text: `Hi ${name},\n\nThanks for applying to SCIEnT! We've recorded your preferences as ${firstPreference} (1st) and ${secondPreference} (2nd).\nWe'll be in touch with next steps.\n\n— SCIEnT Team`,
    });

    return res.status(201).json({ message: "Application submitted successfully.", inducteeId: inductee._id });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(err.errors)[0].message });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error while submitting application." });
  }
}

module.exports = { submitApplication };
