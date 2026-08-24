const express = require("express");
const router = express.Router();
const { inducteeLogin } = require("../controllers/inducteeAuthController");

// POST /api/inductee-auth/login
router.post("/login", inducteeLogin);

module.exports = router;
