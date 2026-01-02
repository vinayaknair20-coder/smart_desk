// src/pages/Login.jsx - FINAL FIXED VERSION
import { useState } from "react";
import axios from "axios";

const pageStyle = {
  minHeight: "100vh",
  margin: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f0f4f8",
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const cardStyle = {
  width: "360px",
  borderRadius: "20px",
  background: "#ffffff",
  boxShadow: "0 18px 60px rgba(15,23,42,0.7)",
  padding: "24px 28px 26px",
};

const titleStyle = {
  fontSize: "22px",
  fontWeight: 600,
  color: "#020617",
  textAlign: "center",
};

const subtitleStyle = {
  marginTop: "4px",
  fontSize: "13px",
  color: "#64748b",
  textAlign: "center",
};

const labelStyle = {
  fontSize: "11px",
  fontWeight: 500,
  color: "#0f172a",
  marginBottom: "4px",
};

const inputStyle = {
  width: "100%",
  padding: "9px 11px",
  borderRadius: "10px",
  border: "1px solid #cbd5f5",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  marginTop: "8px",
  borderRadius: "999px",
  background: "#f97316",
  color: "#ffffff",
  border: "none",
  padding: "10px 0",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
};

const errorStyle = {
  marginTop: "10px",
  fontSize: "11px",
  color: "#b91c1c",
  background: "#fee2e2",
  borderRadius: "8px",
  padding: "6px 8px",
};

const footerStyle = {
  marginTop: "10px",
  fontSize: "11px",
  color: "#94a3b8",
  textAlign: "center",
};

export default function Login({ onLoggedIn, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
        username,
        password,
      });

      // Save tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // Save user info (role + user_id) - CRITICAL FOR ROUTING
      if (res.data.user) {
        const role = res.data.user.role.toString(); // Convert to string
        const userId = res.data.user.id.toString();

        localStorage.setItem("role", role);
        localStorage.setItem("user_id", userId);

        console.log("✅ Login successful - Role:", role, "User ID:", userId);
      }

      if (onLoggedIn) onLoggedIn();
    } catch (err) {
      console.error("Login failed", err.response?.data);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            background: "transparent",
            border: "1px solid #cbd5e1",
            color: "#64748b",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(59,130,246,0.1)";
            e.target.style.borderColor = "#3b82f6";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.borderColor = "rgba(255,255,255,0.2)";
          }}
        >
          ← Back to Home
        </button>
      )}
      <div style={cardStyle}>
        <h1 style={titleStyle}>Smart Desk Login</h1>
        <p style={subtitleStyle}>Enter your credentials to continue.</p>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleLogin} style={{ marginTop: "18px" }}>
          <div style={{ marginBottom: "12px" }}>
            <div style={labelStyle}>Username</div>
            <input
              style={inputStyle}
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. vichu"
            />
          </div>

          <div style={{ marginBottom: "4px" }}>
            <div style={labelStyle}>Password</div>
            <input
              style={inputStyle}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "wait" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p style={footerStyle}>
          Trouble logging in? Contact your administrator.
        </p>
      </div>
    </div>
  );
}
