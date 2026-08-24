const jwt = require("jsonwebtoken");

// Verifies any valid token and attaches the decoded payload to req.user
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { role: 'admin' } or { role: 'inductee', inducteeId, domain }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Only allows role === 'admin'
function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  });
}

// Allows an inductee to access only their own assigned domain's data,
// admins can access any domain.
function requireDomainAccess(req, res, next) {
  requireAuth(req, res, () => {
    const requestedDomain = req.params.domain;
    if (req.user.role === "admin") return next();
    if (req.user.role === "inductee" && req.user.domain === requestedDomain) {
      return next();
    }
    return res.status(403).json({ message: "You do not have access to this domain" });
  });
}

module.exports = { requireAuth, requireAdmin, requireDomainAccess };
