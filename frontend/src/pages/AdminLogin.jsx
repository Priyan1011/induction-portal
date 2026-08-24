import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/admin/login", { username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "admin");
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 360 }}>
      <h1>Admin Login</h1>
      <form onSubmit={submit}>
        <label>Username</label>
        <input required value={username} onChange={(e) => setUsername(e.target.value)} />
        <label>Password</label>
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="error">{error}</div>}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
