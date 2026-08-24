import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function AdminSlots() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ date: "", startTime: "", endTime: "", domain: "" });

  const load = async () => {
    const { data } = await api.get("/interviews/slots");
    setSlots(data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/interviews/slots", form);
    setForm({ date: "", startTime: "", endTime: "", domain: "" });
    load();
  };

  return (
    <div>
      <div className="card">
        <h1>Interview Slots (Module D)</h1>
        <form onSubmit={submit}>
          <label>Date</label>
          <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <label>Start Time</label>
          <input required type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
          <label>End Time</label>
          <input required type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
          <label>Domain (optional — restricts this slot)</label>
          <input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="Leave blank for any domain" />
          <button type="submit">Add Slot</button>
        </form>
      </div>

      <div className="card">
        <h2>All Slots</h2>
        <table>
          <thead><tr><th>Date</th><th>Time</th><th>Domain</th><th>Booked?</th></tr></thead>
          <tbody>
            {slots.map((s) => (
              <tr key={s._id}>
                <td>{s.date}</td><td>{s.startTime} - {s.endTime}</td>
                <td>{s.domain || "Any"}</td><td>{s.isBooked ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
