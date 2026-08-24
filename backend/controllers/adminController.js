const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const Inductee = require("../models/Inductee");
const Interview = require("../models/Interview");
const { sendEmail } = require("../utils/email");

// --- Admin auth ---
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { role: "admin", username },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error during login." });
  }
}

// Module B — Basic: list all inductees, filterable by domain & preference rank
async function listInductees(req, res) {
  try {
    const { domain, rank } = req.query;
    const filter = {};

    if (domain && rank === "1") filter["preferences.first"] = domain;
    else if (domain && rank === "2") filter["preferences.second"] = domain;
    else if (domain) filter.$or = [{ "preferences.first": domain }, { "preferences.second": domain }];

    const inductees = await Inductee.find(filter).sort({ createdAt: -1 });
    return res.json(inductees);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while listing inductees." });
  }
}

// Module B — Basic: view a single inductee's full application
async function getInductee(req, res) {
  try {
    const inductee = await Inductee.findById(req.params.id);
    if (!inductee) return res.status(404).json({ message: "Inductee not found." });
    const interviews = await Interview.find({ inductee: inductee._id }).populate("slot");
    return res.json({ inductee, interviews });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

// Module C — Basic: admin confirms/assigns a domain for an inductee
async function assignDomain(req, res) {
  try {
    const { domain } = req.body;
    const inductee = await Inductee.findByIdAndUpdate(
      req.params.id,
      { assignedDomain: domain },
      { new: true, runValidators: true }
    );
    if (!inductee) return res.status(404).json({ message: "Inductee not found." });
    return res.json(inductee);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while assigning domain." });
  }
}

// Module F — Basic: admin selects who moves to the next round
async function advanceRound(req, res) {
  try {
    const { inducteeIds, round } = req.body; // array of ids moving to `round`
    await Inductee.updateMany(
      { _id: { $in: inducteeIds } },
      { round, status: "In Review" }
    );
    const inductees = await Inductee.find({ _id: { $in: inducteeIds } });
    for (const inductee of inductees) {
      await sendEmail({
        to: inductee.email,
        subject: `SCIEnT Induction — You've advanced to Round ${round}`,
        text: `Hi ${inductee.name},\n\nGood news — you've been selected to move on to round ${round} of the induction process. We'll share next steps shortly.\n\n— SCIEnT Team`,
      });
    }
    return res.json({ message: `${inductees.length} inductee(s) advanced to round ${round}.` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while advancing round." });
  }
}

// Module F — Basic: final decision — bulk status update + announcement email
async function finalizeDecisions(req, res) {
  try {
    const { selectedIds, rejectedIds } = req.body;

    if (selectedIds?.length) {
      await Inductee.updateMany({ _id: { $in: selectedIds } }, { status: "Selected" });
      const selected = await Inductee.find({ _id: { $in: selectedIds } });
      for (const s of selected) {
        await sendEmail({
          to: s.email,
          subject: "SCIEnT Induction — Congratulations!",
          text: `Hi ${s.name},\n\nCongratulations! You've been selected to join SCIEnT in the ${s.assignedDomain} domain. Welcome aboard!\n\n— SCIEnT Team`,
        });
      }
    }

    if (rejectedIds?.length) {
      await Inductee.updateMany({ _id: { $in: rejectedIds } }, { status: "Rejected" });
      const rejected = await Inductee.find({ _id: { $in: rejectedIds } });
      for (const r of rejected) {
        await sendEmail({
          to: r.email,
          subject: "SCIEnT Induction — Update on your application",
          text: `Hi ${r.name},\n\nThank you for taking part in the SCIEnT induction process. This time we won't be moving forward with your application, but we really appreciated your effort and hope you apply again in future.\n\n— SCIEnT Team`,
        });
      }
    }

    return res.json({ message: "Decisions finalized and applicants notified." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while finalizing decisions." });
  }
}

module.exports = { login, listInductees, getInductee, assignDomain, advanceRound, finalizeDecisions };
