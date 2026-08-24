const express = require("express");
const router = express.Router();
const { requireDomainAccess, requireAdmin } = require("../middleware/auth");
const {
  createTask,
  listTasks,
  askQuestion,
  answerQuestion,
  listQuestions,
} = require("../controllers/domainController");

// All routes are scoped to a specific domain and gated by requireDomainAccess,
// which allows admins (any domain) or an inductee whose assignedDomain matches.

router.get("/:domain/tasks", requireDomainAccess, listTasks);
router.post("/:domain/tasks", requireAdmin, createTask); // only admin posts tasks

router.get("/:domain/qna", requireDomainAccess, listQuestions);
router.post("/:domain/qna", requireDomainAccess, askQuestion); // inductee asks
router.post("/:domain/qna/:qnaId/answer", requireAdmin, answerQuestion); // admin answers

module.exports = router;
