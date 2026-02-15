import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password || submitting) return;

    try {
      setSubmitting(true);
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch {
      alert("Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Unified IoT Dashboard</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="button" onClick={login}>
          {submitting ? "Logging in..." : "Login"}
        </button>

        <p onClick={() => navigate("/register")}>Create account</p>
      </div>
    </div>
  );
}

export default Login;
