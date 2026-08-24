const jwt = require("jsonwebtoken");
const Inductee = require("../models/Inductee");

// Module C — Basic: "Once admin assigns/confirms a domain for an inductee,
// they get access to that domain's page only."
//
// Scope note: the task brief doesn't ask for a full account/password system
// for inductees (they never set a password anywhere in the spec — only the
// admin has credentials). So this is a deliberately lightweight identity
// check: prove you own the application (email + roll number) and, if a
// domain has been assigned, get a scoped token for that domain's page.
// Swap this for a real magic-link or OTP flow before using this in
// production with real applicant data.
async function inducteeLogin(req, res) {
  try {
    const { email, rollNumber } = req.body;
    const inductee = await Inductee.findOne({ email: email.toLowerCase(), rollNumber });
    if (!inductee) return res.status(404).json({ message: "No application found with that email + roll number." });

    if (!inductee.assignedDomain) {
      return res.status(403).json({
        message: "Your domain hasn't been confirmed by the admin yet. Please check back later.",
      });
    }

    const token = jwt.sign(
      { role: "inductee", inducteeId: inductee._id, domain: inductee.assignedDomain },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    return res.json({ token, inductee: { id: inductee._id, name: inductee.name, domain: inductee.assignedDomain } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error during login." });
  }
}

module.exports = { inducteeLogin };
