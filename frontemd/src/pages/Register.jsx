// src/pages/Register.jsx - Validated Version
import { useState } from "react";
import axios from "axios";

// --- STYLES ---
const pageStyle = {
    minHeight: "100vh",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f4f8",
    color: "#1e293b",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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

// Helper for dynamic input styles based on error
const getInputStyle = (hasError) => ({
    width: "100%",
    padding: "9px 11px",
    borderRadius: "10px",
    background: "#ffffff",
    border: hasError ? "1px solid #ef4444" : "1px solid #cbd5e1",
    color: "#0f172a",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
});

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

const disabledButtonStyle = {
    ...buttonStyle,
    background: "#cbd5e1",
    cursor: "not-allowed",
    opacity: 0.7,
};

const errorTextStyle = {
    fontSize: "11px",
    color: "#ef4444",
    marginTop: "4px",
    minHeight: "14px", // To prevent jumpiness
};

const mainErrorStyle = {
    marginTop: "10px",
    fontSize: "12px",
    color: "#b91c1c",
    background: "#fee2e2",
    borderRadius: "8px",
    padding: "8px 12px",
    textAlign: "center",
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

// --- VALIDATION REGEX & LOGIC ---
const USERNAME_REGEX = /^[a-zA-Z0-9]+$/; // Alphanumeric only
const NAME_REGEX = /^[a-zA-Z]+$/; // Alphabets only
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function Register({ onLoggedIn, onBack, onNavigate }) {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
    });

    const [errors, setErrors] = useState({});
    const [mainError, setMainError] = useState("");
    const [loading, setLoading] = useState(false);

    // Validate a single field
    const validateField = (name, value) => {
        let err = "";
        switch (name) {
            case "firstName":
                if (value) {
                    if (value.length < 3) err = "Must be at least 3 chars.";
                    else if (!NAME_REGEX.test(value)) err = "Only letters allowed.";
                    else if (/(.)\1{2,}/.test(value)) err = "No repeating chars (e.g. 'sss').";

                    if (value === formData.lastName) err = "First & Last name can't be same.";
                }
                break;
            case "lastName":
                if (value) {
                    if (value.length < 1) err = "Required.";
                    else if (!NAME_REGEX.test(value)) err = "Only letters allowed.";
                    else if (/(.)\1{2,}/.test(value)) err = "No repeating chars (e.g. 'sss').";

                    if (value === formData.firstName) err = "First & Last name can't be same.";
                }
                break;
            case "username":
                if (!value) err = "Username is required.";
                else if (value.length < 3) err = "Must be at least 3 characters.";
                else if (!USERNAME_REGEX.test(value)) err = "Alphanumeric only (no spaces/symbols).";
                break;
            case "email":
                if (!value) err = "Email is required.";
                else if (!EMAIL_REGEX.test(value)) err = "Invalid email format.";
                break;
            case "password":
                if (!value) err = "Password is required.";
                else if (!PASSWORD_REGEX.test(value)) {
                    err = "Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.";
                }
                else if (formData.username && value.toLowerCase().includes(formData.username.toLowerCase())) {
                    err = "Password cannot contain your ID/Username.";
                }
                break;
            case "confirmPassword":
                if (!value) err = "Please confirm your password.";
                else if (value !== formData.password) err = "Passwords do not match.";
                break;
            default:
                break;
        }
        return err;
    };

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // --- 1. BLOCK INVALID CHARACTERS (Prevent typing) ---
        if (name === "username") {
            // Block spaces immediately
            if (value.includes(" ")) return;
        }

        // --- 2. UPDATE STATE ---
        setFormData(prev => ({ ...prev, [name]: newValue }));

        // --- 3. RAPID FEEDBACK (Validate immediately on type) ---
        // This ensures the user sees the error *before* they even try to leave the field.
        const errorMsg = validateField(name, newValue);
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    // Handle Blur (Validate on focus loss)
    const handleBlur = (e) => {
        const { name, value } = e.target;

        // --- AUTO TRIM & CAPITALIZE NAMES ---
        let processedValue = value.trim();

        if (name === "firstName" || name === "lastName") {
            if (processedValue.length > 0) {
                // Auto-capitalize first letter, lowercase rest
                processedValue = processedValue.charAt(0).toUpperCase() + processedValue.slice(1).toLowerCase();
            }
        }

        if (processedValue !== value) {
            setFormData(prev => ({ ...prev, [name]: processedValue }));
        }

        const errorMsg = validateField(name, processedValue);
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMainError("");

        // --- FINAL VALIDATION CHECK ---
        const newErrors = {};
        let isValid = true;
        Object.keys(formData).forEach(key => {
            const err = validateField(key, formData[key]);
            if (err) {
                newErrors[key] = err;
                isValid = false;
            }
        });

        setErrors(newErrors);

        if (!isValid) {
            setMainError("Please fix the errors above.");
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
                setMainError("Username already exists.");
                setErrors(prev => ({ ...prev, username: "Already taken." }));
            } else if (err.response?.data?.email) {
                setMainError("Email already exists.");
                setErrors(prev => ({ ...prev, email: "Already taken." }));
            } else {
                setMainError("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Check if form has any errors or empty required fields for button state
    const isFormValid =
        !errors.username && !errors.email && !errors.password && !errors.confirmPassword &&
        formData.username && formData.email && formData.password && formData.confirmPassword;

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

                {mainError && <div style={mainErrorStyle}>{mainError}</div>}

                <form onSubmit={handleRegister} style={{ marginTop: "18px" }}>
                    {/* Names Row */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "4px" }}>
                        <div style={{ flex: 1 }}>
                            <div style={labelStyle}>First Name</div>
                            <input
                                style={getInputStyle(!!errors.firstName)}
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="John"
                            />
                            <div style={errorTextStyle}>{errors.firstName}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={labelStyle}>Last Name</div>
                            <input
                                style={getInputStyle(!!errors.lastName)}
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Doe"
                            />
                            <div style={errorTextStyle}>{errors.lastName}</div>
                        </div>
                    </div>

                    {/* Username */}
                    <div style={{ marginBottom: "4px" }}>
                        <div style={labelStyle}>Username *</div>
                        <input
                            style={getInputStyle(!!errors.username)}
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="johndoe"
                            required
                        />
                        <div style={errorTextStyle}>{errors.username}</div>
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: "4px" }}>
                        <div style={labelStyle}>Email Address *</div>
                        <input
                            style={getInputStyle(!!errors.email)}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="john@example.com"
                            required
                        />
                        <div style={errorTextStyle}>{errors.email}</div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: "4px" }}>
                        <div style={labelStyle}>Password *</div>
                        <input
                            style={getInputStyle(!!errors.password)}
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Min 8 chars, 1 Up, 1 Low, 1#, 1 Sym"
                            required
                        />
                        <div style={errorTextStyle}>{errors.password}</div>
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: "12px" }}>
                        <div style={labelStyle}>Confirm Password *</div>
                        <input
                            style={getInputStyle(!!errors.confirmPassword)}
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Re-enter password"
                            required
                        />
                        <div style={errorTextStyle}>{errors.confirmPassword}</div>
                    </div>

                    <button
                        type="submit"
                        style={isFormValid ? buttonStyle : disabledButtonStyle}
                        disabled={loading || !isFormValid}
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
