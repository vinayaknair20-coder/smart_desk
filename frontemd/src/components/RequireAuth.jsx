import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function RequireAuth({ children }) {
  const [checking, setChecking] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      setOk(false);
      setChecking(false);
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/tickets/", {
        headers: { Authorization: `Bearer ${access}` },
      })
      .then(() => {
        setOk(true);
        setChecking(false);
      })
      .catch(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setOk(false);
        setChecking(false);
      });
  }, []);

  if (checking) return null; // or a loader

  if (!ok) return <Navigate to="/login" replace />;

  return children;
}
