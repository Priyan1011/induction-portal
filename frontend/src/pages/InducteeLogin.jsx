import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

export default function InducteeLogin() {
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/inductee-auth/login", { email, rollNumber });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "inductee");
      localStorage.setItem("domain", data.inductee.domain);
      localStorage.setItem("name", data.inductee.name);
      navigate("/domain");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400 }}>
      <h1>My Domain</h1>
      <p>Enter the email and roll number you applied with.</p>
      <form onSubmit={submit}>
        <label>Email</label>
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Roll Number</label>
        <input required value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} />
        {error && <div className="error">{error}</div>}
        <button type="submit">Enter</button>
      </form>
    </div>
  );
}
