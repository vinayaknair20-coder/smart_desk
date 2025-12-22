  // src/App.jsx
  import { useState, useEffect } from "react";
  import axios from "axios";
  import Login from "./pages/Login";
  import UserDashboard from "./pages/UserDashboard";

  function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("access");

      if (!token) {
        setIsLoggedIn(false);
        setChecking(false);
        return;
      }

      axios
        .get("http://127.0.0.1:8000/api/tickets/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setIsLoggedIn(true);
          setChecking(false);
        })
        .catch(() => {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setIsLoggedIn(false);
          setChecking(false);
        });
    }, []);

    const handleLoggedIn = () => {
      setIsLoggedIn(true);
    };

    const handleLogout = () => {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setIsLoggedIn(false);
    };

    if (checking) return null;

    if (!isLoggedIn) {
      return <Login onLoggedIn={handleLoggedIn} />;
    }

    return <UserDashboard onLogout={handleLogout} />;
  }

  export default App;
