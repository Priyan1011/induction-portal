import { useState } from "react";
import api from "../api/axios.js";

const DOMAINS = ["DevOps", "Corporate Communications", "Creatives"];

export default function ApplicationForm() {
  const [form, setForm] = useState({
    name: "", rollNumber: "", contact: "", email: "",
    firstPreference: "", secondPreference: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (form.firstPreference && form.firstPreference === form.secondPreference) {
      setError("First and second preference must be different domains.");
      return;
    }

    try {
      await api.post("/applications", form);
      setSuccess("Application submitted! Check your email for confirmation.");
      setForm({ name: "", rollNumber: "", contact: "", email: "", firstPreference: "", secondPreference: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="card">
      <h1>Induction Application</h1>
      <p>Fill this out to apply. You can pick exactly two domains, ranked by preference.</p>
      <form onSubmit={submit}>
        <label>Full Name</label>
        <input required value={form.name} onChange={update("name")} />

        <label>Roll Number</label>
        <input required value={form.rollNumber} onChange={update("rollNumber")} />

        <label>Contact Number</label>
        <input required value={form.contact} onChange={update("contact")} />

        <label>Email</label>
        <input required type="email" value={form.email} onChange={update("email")} />

        <label>1st Preference</label>
        <select required value={form.firstPreference} onChange={update("firstPreference")}>
          <option value="">Select domain</option>
          {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        <label>2nd Preference</label>
        <select required value={form.secondPreference} onChange={update("secondPreference")}>
          <option value="">Select domain</option>
          {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
}
