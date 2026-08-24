import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const DOMAINS = ["DevOps", "Corporate Communications", "Creatives"];

export default function AdminDashboard() {
  const [inductees, setInductees] = useState([]);
  const [domain, setDomain] = useState("");
  const [rank, setRank] = useState("");
  const [selected, setSelected] = useState([]);

  const load = async () => {
    const params = {};
    if (domain) params.domain = domain;
    if (rank) params.rank = rank;
    const { data } = await api.get("/admin/inductees", { params });
    setInductees(data);
  };

  useEffect(() => { load(); }, [domain, rank]);

  const toggleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const advanceRound = async () => {
    const round = prompt("Advance selected inductees to which round number?");
    if (!round) return;
    await api.post("/admin/inductees/advance-round", { inducteeIds: selected, round: Number(round) });
    setSelected([]);
    load();
  };

  const finalize = async (decision) => {
    const payload = decision === "select" ? { selectedIds: selected } : { rejectedIds: selected };
    await api.post("/admin/inductees/finalize", payload);
    setSelected([]);
    load();
  };

  return (
    <div>
      <div className="card">
        <h1>Admin Dashboard</h1>
        <div className="filters">
          <select value={domain} onChange={(e) => setDomain(e.target.value)}>
            <option value="">All domains</option>
            {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={rank} onChange={(e) => setRank(e.target.value)}>
            <option value="">Any preference rank</option>
            <option value="1">1st choice</option>
            <option value="2">2nd choice</option>
          </select>
          <Link to="/admin/slots"><button className="secondary" type="button">Manage Interview Slots</button></Link>
          <Link to="/admin/interviews"><button className="secondary" type="button">Interview Status</button></Link>
        </div>

        {selected.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <button onClick={advanceRound}>Advance {selected.length} to next round</button>{" "}
            <button onClick={() => finalize("select")}>Mark Selected</button>{" "}
            <button className="danger" onClick={() => finalize("reject")}>Mark Rejected</button>
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th></th><th>Name</th><th>Roll No.</th><th>1st Pref</th><th>2nd Pref</th>
              <th>Assigned Domain</th><th>Round</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {inductees.map((i) => (
              <tr key={i._id}>
                <td><input type="checkbox" checked={selected.includes(i._id)} onChange={() => toggleSelect(i._id)} /></td>
                <td><Link to={`/admin/inductees/${i._id}`}>{i.name}</Link></td>
                <td>{i.rollNumber}</td>
                <td>{i.preferences?.first}</td>
                <td>{i.preferences?.second}</td>
                <td>{i.assignedDomain || "—"}</td>
                <td>{i.round}</td>
                <td><span className={`badge ${i.status.replace(" ", "")}`}>{i.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
