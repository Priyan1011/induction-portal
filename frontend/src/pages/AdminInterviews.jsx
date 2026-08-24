import { useEffect, useState } from "react";
import api from "../api/axios.js";

const STATUSES = ["Scheduled", "Completed", "No-show"];

export default function AdminInterviews() {
  const [interviews, setInterviews] = useState([]);

  const load = async () => {
    const { data } = await api.get("/interviews");
    setInterviews(data);
  };

  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status) => {
    await api.patch(`/interviews/${id}/status`, { status });
    load();
  };

  const editNotes = async (id, current) => {
    const notes = prompt("Interviewer notes:", current.notes || "");
    if (notes === null) return;
    const ratingStr = prompt("Rating (1-5):", current.rating || "");
    const rating = ratingStr ? Number(ratingStr) : null;
    await api.patch(`/interviews/${id}/notes`, { notes, rating });
    load();
  };

  return (
    <div className="card">
      <h1>Interview Status Tracking (Module E)</h1>
      <p style={{ fontSize: 13, color: "#666" }}>Visible to admin only — inductees never see this page or these fields.</p>
      <table>
        <thead><tr><th>Inductee</th><th>Domain</th><th>Date</th><th>Status</th><th>Notes / Rating</th></tr></thead>
        <tbody>
          {interviews.map((iv) => (
            <tr key={iv._id}>
              <td>{iv.inductee?.name} ({iv.inductee?.rollNumber})</td>
              <td>{iv.inductee?.assignedDomain}</td>
              <td>{iv.slot?.date} {iv.slot?.startTime}</td>
              <td>
                <select value={iv.status} onChange={(e) => changeStatus(iv._id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td>
                {iv.notes ? `${iv.notes} (${iv.rating ?? "no rating"})` : "—"}{" "}
                <button className="secondary" onClick={() => editNotes(iv._id, iv)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
