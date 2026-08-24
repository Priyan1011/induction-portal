const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../middleware/auth");
const {
  login,
  listInductees,
  getInductee,
  assignDomain,
  advanceRound,
  finalizeDecisions,
} = require("../controllers/adminController");

router.post("/login", login); // POST /api/admin/login

router.get("/inductees", requireAdmin, listInductees); // GET /api/admin/inductees?domain=&rank=
router.get("/inductees/:id", requireAdmin, getInductee); // GET /api/admin/inductees/:id
router.patch("/inductees/:id/assign-domain", requireAdmin, assignDomain); // Module C
router.post("/inductees/advance-round", requireAdmin, advanceRound); // Module F
router.post("/inductees/finalize", requireAdmin, finalizeDecisions); // Module F

module.exports = router;
