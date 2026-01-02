// src/App.jsx - WITH LANDING PAGE
import { useState, useEffect } from "react";
import api from "./api/client";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [currentPage, setCurrentPage] = useState("landing"); // "landing", "login", "register"

  useEffect(() => {
    const token = localStorage.getItem("access");
    const role = localStorage.getItem("role");

    console.log("🔍 Checking role:", role); // DEBUG

    if (!token) {
      setIsLoggedIn(false);
      setChecking(false);
      return;
    }

    api.get("/api/tickets/")
      .then(() => {
        setIsLoggedIn(true);
        setUserRole(role);
        console.log("✅ Logged in as role:", role); // DEBUG
        setChecking(false);
      })
      .catch(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        setChecking(false);
      });
  }, []);

  const handleLoggedIn = () => {
    const role = localStorage.getItem("role");
    console.log("🎯 Login successful, role:", role); // DEBUG
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentPage("landing");
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (checking) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020617",
        color: "#e5e7eb",
        fontSize: "14px"
      }}>
        Loading...
      </div>
    );
  }

  if (!isLoggedIn) {
    if (currentPage === "landing") {
      return <LandingPage onNavigate={handleNavigate} />;
    }
    if (currentPage === "register") {
      return <Register onLoggedIn={handleLoggedIn} onBack={() => setCurrentPage("landing")} onNavigate={handleNavigate} />;
    }
    return <Login onLoggedIn={handleLoggedIn} onBack={() => setCurrentPage("landing")} />;
  }

  // Determine which dashboard to show based on role
  if (userRole === "1") {
    return <AdminDashboard onLogout={handleLogout} />;
  }
  if (userRole === "3") {
    return <AgentDashboard onLogout={handleLogout} />;
  }
  console.log("👤 Loading UserDashboard");
  return <UserDashboard onLogout={handleLogout} />;
}

export default App;
