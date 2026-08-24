const express = require("express");
const router = express.Router();
const { submitApplication } = require("../controllers/applicationController");

// POST /api/applications — public application form (Module A)
router.post("/", submitApplication);

module.exports = router;
