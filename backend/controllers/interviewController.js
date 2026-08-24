const InterviewSlot = require("../models/InterviewSlot");
const Interview = require("../models/Interview");
const Inductee = require("../models/Inductee");
const { sendEmail } = require("../utils/email");

// Module D — Basic: admin defines available interview time slots
async function createSlot(req, res) {
  try {
    const { date, startTime, endTime, domain } = req.body;
    const slot = await InterviewSlot.create({ date, startTime, endTime, domain: domain || null });
    return res.status(201).json(slot);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while creating slot." });
  }
}

// Lists open (or all, for admin) slots — inductees only see unbooked ones
async function listSlots(req, res) {
  try {
    const filter = {};
    if (req.query.domain) filter.domain = req.query.domain;
    if (req.user?.role !== "admin") filter.isBooked = false;
    const slots = await InterviewSlot.find(filter).sort({ date: 1, startTime: 1 });
    return res.json(slots);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while listing slots." });
  }
}

// Module D — Basic: inductee books a slot.
// Conflict check: (a) slot must not already be booked, (b) inductee cannot
// already have a different scheduled interview.
async function bookSlot(req, res) {
  try {
    if (req.user.role !== "inductee") {
      return res.status(403).json({ message: "Only inductees can book interview slots." });
    }
    const inducteeId = req.user.inducteeId;
    const { slotId } = req.body;

    const existingBooking = await Interview.findOne({ inductee: inducteeId, status: "Scheduled" });
    if (existingBooking) {
      return res.status(409).json({ message: "You already have a scheduled interview. Cancel it before booking another." });
    }

    const slot = await InterviewSlot.findById(slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found." });
    if (slot.isBooked) return res.status(409).json({ message: "This slot has just been booked by someone else. Please pick another." });

    slot.isBooked = true;
    slot.bookedBy = inducteeId;
    await slot.save();

    const interview = await Interview.create({ inductee: inducteeId, slot: slot._id, status: "Scheduled" });

    const inductee = await Inductee.findById(inducteeId);
    await sendEmail({
      to: inductee.email,
      subject: "SCIEnT Induction — Interview Scheduled",
      text: `Hi ${inductee.name},\n\nYour interview has been scheduled for ${slot.date} at ${slot.startTime}. We'll send a reminder closer to the date. Good luck!\n\n— SCIEnT Team`,
    });

    return res.status(201).json(interview);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while booking slot." });
  }
}

// Module E — Basic: admin marks interview status. Not visible to the inductee
// (there is no inductee-facing route that returns this field — see routes/interviews.js).
async function updateStatus(req, res) {
  try {
    const { status } = req.body; // "Scheduled" | "Completed" | "No-show"
    const interview = await Interview.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!interview) return res.status(404).json({ message: "Interview not found." });
    return res.json(interview);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while updating status." });
  }
}

// Module E — Brownie: interviewer notes/rating, admin-only
async function updateNotes(req, res) {
  try {
    const { notes, rating } = req.body;
    const interview = await Interview.findByIdAndUpdate(req.params.id, { notes, rating }, { new: true });
    if (!interview) return res.status(404).json({ message: "Interview not found." });
    return res.json(interview);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while updating notes." });
  }
}

// Admin-only: full interview list with status + notes
async function listInterviews(req, res) {
  try {
    const interviews = await Interview.find()
      .populate("inductee", "name rollNumber email assignedDomain")
      .populate("slot");
    return res.json(interviews);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while listing interviews." });
  }
}

// Module D — Basic: reminder email ahead of scheduled interview.
// Intended to be called by a daily cron job (see server.js).
async function sendUpcomingReminders() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const slots = await InterviewSlot.find({ date: tomorrowStr, isBooked: true }).populate("bookedBy");
  for (const slot of slots) {
    if (!slot.bookedBy) continue;
    await sendEmail({
      to: slot.bookedBy.email,
      subject: "Reminder: Your SCIEnT interview is tomorrow",
      text: `Hi ${slot.bookedBy.name},\n\nJust a reminder that your interview is scheduled for tomorrow, ${slot.date} at ${slot.startTime}.\n\n— SCIEnT Team`,
    });
  }
  console.log(`Interview reminders sent for ${slots.length} slot(s) on ${tomorrowStr}.`);
}

module.exports = {
  createSlot,
  listSlots,
  bookSlot,
  updateStatus,
  updateNotes,
  listInterviews,
  sendUpcomingReminders,
};
