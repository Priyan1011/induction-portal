import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function DomainPage() {
  const domain = localStorage.getItem("domain");
  const name = localStorage.getItem("name");

  const [tasks, setTasks] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [slots, setSlots] = useState([]);

  const loadAll = async () => {
    if (!domain) return;
    const [tasksRes, qnaRes, slotsRes] = await Promise.all([
      api.get(`/domain/${domain}/tasks`),
      api.get(`/domain/${domain}/qna`),
      api.get(`/interviews/slots`, { params: { domain } }),
    ]);
    setTasks(tasksRes.data);
    setQuestions(qnaRes.data);
    setSlots(slotsRes.data);
  };

  useEffect(() => { loadAll(); }, [domain]);

  const askQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    await api.post(`/domain/${domain}/qna`, { question: newQuestion });
    setNewQuestion("");
    loadAll();
  };

  const bookSlot = async (slotId) => {
    try {
      await api.post("/interviews/book", { slotId });
      alert("Interview booked! Check your email for confirmation.");
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Could not book slot.");
    }
  };

  if (!domain) {
    return <div className="card">Please <a href="/domain-login">log in</a> first.</div>;
  }

  return (
    <div>
      <div className="card">
        <h1>{domain} — Welcome, {name}</h1>
      </div>

      <div className="card">
        <h2>Tasks (Module C)</h2>
        {tasks.length === 0 && <p>No tasks posted yet.</p>}
        <table>
          <thead><tr><th>Title</th><th>Description</th><th>Deadline</th></tr></thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t._id}>
                <td>{t.title}</td><td>{t.description}</td>
                <td>{new Date(t.deadline).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Q&A (Module C)</h2>
        <form onSubmit={askQuestion}>
          <label>Ask a question</label>
          <textarea value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} />
          <button type="submit">Post Question</button>
        </form>
        <div style={{ marginTop: 16 }}>
          {questions.map((q) => (
            <div key={q._id} style={{ borderTop: "1px solid #eee", padding: "10px 0" }}>
              <p><strong>Q:</strong> {q.question}</p>
              <p><strong>A:</strong> {q.answer || "Awaiting admin response…"}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Book an Interview Slot (Module D)</h2>
        {slots.length === 0 && <p>No open slots right now.</p>}
        <table>
          <thead><tr><th>Date</th><th>Time</th><th></th></tr></thead>
          <tbody>
            {slots.map((s) => (
              <tr key={s._id}>
                <td>{s.date}</td><td>{s.startTime} - {s.endTime}</td>
                <td><button onClick={() => bookSlot(s._id)}>Book</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
