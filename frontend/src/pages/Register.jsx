import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const register = async () => {
    if (!username || !email || !password || submitting) return;

    try {
      setSubmitting(true);
      await api.post("/auth/register", { username, email, password });
      alert("Registered successfully");
      navigate("/");
    } catch {
      alert("Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

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

        <button type="button" onClick={register}>
          {submitting ? "Creating account..." : "Register"}
        </button>

        <p onClick={() => navigate("/")}>Back to login</p>
      </div>
    </div>
  );
}

export default Register;
