const DomainTask = require("../models/DomainTask");
const QnA = require("../models/QnA");

// Module C — Basic: admin posts a task with a deadline on a domain page
async function createTask(req, res) {
  try {
    const { domain } = req.params;
    const { title, description, deadline } = req.body;
    const task = await DomainTask.create({ domain, title, description, deadline });
    return res.status(201).json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while creating task." });
  }
}

async function listTasks(req, res) {
  try {
    const tasks = await DomainTask.find({ domain: req.params.domain }).sort({ deadline: 1 });
    return res.json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while listing tasks." });
  }
}

// Module C — Basic: inductee posts a question on their domain page
async function askQuestion(req, res) {
  try {
    const { domain } = req.params;
    const { question } = req.body;
    if (req.user.role !== "inductee") {
      return res.status(403).json({ message: "Only inductees can post questions." });
    }
    const qna = await QnA.create({ domain, inductee: req.user.inducteeId, question });
    return res.status(201).json(qna);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while posting question." });
  }
}

// Module C — Basic: admin responds to a question
async function answerQuestion(req, res) {
  try {
    const { answer } = req.body;
    const qna = await QnA.findByIdAndUpdate(
      req.params.qnaId,
      { answer, answeredAt: new Date() },
      { new: true }
    );
    if (!qna) return res.status(404).json({ message: "Question not found." });
    return res.json(qna);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while answering question." });
  }
}

async function listQuestions(req, res) {
  try {
    const questions = await QnA.find({ domain: req.params.domain })
      .populate("inductee", "name rollNumber")
      .sort({ createdAt: -1 });
    return res.json(questions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while listing questions." });
  }
}

module.exports = { createTask, listTasks, askQuestion, answerQuestion, listQuestions };
