import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";

const DOMAINS = ["DevOps", "Corporate Communications", "Creatives"];

export default function InducteeDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [domainChoice, setDomainChoice] = useState("");

  const load = async () => {
    const { data } = await api.get(`/admin/inductees/${id}`);
    setData(data);
    setDomainChoice(data.inductee.assignedDomain || "");
  };

  useEffect(() => { load(); }, [id]);

  const confirmDomain = async () => {
    await api.patch(`/admin/inductees/${id}/assign-domain`, { domain: domainChoice });
    load();
  };

  if (!data) return <div className="card">Loading…</div>;
  const { inductee, interviews } = data;

  return (
    <div className="card">
      <h1>{inductee.name}</h1>
      <p><strong>Roll No.:</strong> {inductee.rollNumber} &nbsp; <strong>Email:</strong> {inductee.email} &nbsp; <strong>Contact:</strong> {inductee.contact}</p>
      <p><strong>Preferences:</strong> {inductee.preferences.first} (1st), {inductee.preferences.second} (2nd)</p>
      <p><strong>Status:</strong> <span className={`badge ${inductee.status.replace(" ", "")}`}>{inductee.status}</span> &nbsp; <strong>Round:</strong> {inductee.round}</p>

      <h2>Domain Assignment (Module C)</h2>
      <select value={domainChoice} onChange={(e) => setDomainChoice(e.target.value)}>
        <option value="">Not assigned</option>
        {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      <button onClick={confirmDomain}>Confirm Domain</button>

      <h2>Interviews</h2>
      {interviews.length === 0 && <p>No interviews booked yet.</p>}
      <table>
        <thead><tr><th>Date</th><th>Time</th><th>Status</th><th>Notes</th><th>Rating</th></tr></thead>
        <tbody>
          {interviews.map((iv) => (
            <tr key={iv._id}>
              <td>{iv.slot?.date}</td>
              <td>{iv.slot?.startTime} - {iv.slot?.endTime}</td>
              <td><span className={`badge ${iv.status.replace(" ", "")}`}>{iv.status}</span></td>
              <td>{iv.notes || "—"}</td>
              <td>{iv.rating || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
