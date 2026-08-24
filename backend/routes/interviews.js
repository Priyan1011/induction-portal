const express = require("express");
const router = express.Router();
const { requireAuth, requireAdmin } = require("../middleware/auth");
const {
  createSlot,
  listSlots,
  bookSlot,
  updateStatus,
  updateNotes,
  listInterviews,
} = require("../controllers/interviewController");

// Module D
router.post("/slots", requireAdmin, createSlot); // admin defines slots
router.get("/slots", requireAuth, listSlots); // inductee sees open slots / admin sees all
router.post("/book", requireAuth, bookSlot); // inductee books a slot

// Module E — admin-only, so status/notes never reach an inductee-facing route
router.get("/", requireAdmin, listInterviews);
router.patch("/:id/status", requireAdmin, updateStatus);
router.patch("/:id/notes", requireAdmin, updateNotes);

module.exports = router;
