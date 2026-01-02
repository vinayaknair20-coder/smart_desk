// src/pages/Register.jsx - New Registration Page
import { useState } from "react";
import axios from "axios";

const pageStyle = {
    minHeight: "100vh",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f4f8",
    color: "#1e293b",
    fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const cardStyle = {
    width: "400px",
    borderRadius: "20px",
    background: "#ffffff",
    boxShadow: "0 18px 60px rgba(15,23,42,0.7)",
    padding: "24px 28px 26px",
};

const titleStyle = {
    fontSize: "22px",
    fontWeight: 600,
    color: "#0f172a",
    textAlign: "center",
};

const subtitleStyle = {
    marginTop: "4px",
    fontSize: "13px",
    color: "#475569",
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
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    color: "#0f172a",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
};

const buttonStyle = {
    width: "100%",
    marginTop: "8px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #fb923c, #f97316)",
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

const backBtnStyle = {
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
};

export default function Register({ onLoggedIn, onBack, onNavigate }) {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.username || !formData.email || !formData.password) {
            setError("Please fill in all required fields.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        try {
            setLoading(true);

            // 1. Register
            await axios.post("http://127.0.0.1:8000/api/auth/register/", {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName,
            });

            // 2. Auto-Login
            const loginRes = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
                username: formData.username,
                password: formData.password,
            });

            // 3. Save tokens
            localStorage.setItem("access", loginRes.data.access);
            localStorage.setItem("refresh", loginRes.data.refresh);

            if (loginRes.data.user) {
                const role = loginRes.data.user.role.toString();
                const userId = loginRes.data.user.id.toString();
                localStorage.setItem("role", role);
                localStorage.setItem("user_id", userId);
            }

            // 4. Redirect
            if (onLoggedIn) onLoggedIn();

        } catch (err) {
            console.error("Registration failed", err.response?.data);
            if (err.response?.data?.username) {
                setError("Username already exists.");
            } else if (err.response?.data?.email) {
                setError("Email already exists.");
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={pageStyle}>
            {onBack && (
                <button
                    onClick={onBack}
                    style={backBtnStyle}
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
                <h1 style={titleStyle}>Create Account</h1>
                <p style={subtitleStyle}>Join Smart Service Desk today.</p>

                {error && <div style={errorStyle}>{error}</div>}

                <form onSubmit={handleRegister} style={{ marginTop: "18px" }}>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                        <div style={{ flex: 1 }}>
                            <div style={labelStyle}>First Name (Optional)</div>
                            <input
                                style={inputStyle}
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="John"
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={labelStyle}>Last Name (Optional)</div>
                            <input
                                style={inputStyle}
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                        <div style={labelStyle}>Username *</div>
                        <input
                            style={inputStyle}
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="johndoe"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                        <div style={labelStyle}>Email Address *</div>
                        <input
                            style={inputStyle}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                        <div style={labelStyle}>Password *</div>
                        <input
                            style={inputStyle}
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 8 characters"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <div style={labelStyle}>Confirm Password *</div>
                        <input
                            style={inputStyle}
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter password"
                            required
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
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p style={{ marginTop: "16px", fontSize: "12px", color: "#64748b", textAlign: "center" }}>
                    Already have an account?{" "}
                    <button
                        onClick={() => onNavigate("login")}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#f97316",
                            fontWeight: 600,
                            cursor: "pointer",
                            padding: 0,
                            textDecoration: "underline",
                        }}
                    >
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
}
