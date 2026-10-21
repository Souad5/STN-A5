import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken, clearToken } from "../utils/auth";
import { getMe } from "../services/auth.api";

// requireAdmin: only users with the admin role may see the children
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const token = getToken();
  const [status, setStatus] = useState(token ? "checking" : "denied");

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    getMe()
      .then((res) => {
        if (cancelled) return;
        if (requireAdmin && res.data.role !== "admin") setStatus("forbidden");
        else setStatus("allowed");
      })
      .catch((err) => {
        if (cancelled) return;
        // only an auth failure invalidates the session; network errors must not grant access
        if (err.response?.status === 401 || err.response?.status === 403) clearToken();
        setStatus("denied");
      });

    return () => {
      cancelled = true;
    };
  }, [token, requireAdmin]);

  if (status === "checking") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (status === "denied") return <Navigate to="/login" replace />;
  if (status === "forbidden") return <Navigate to="/student" replace />;

  return children;
}
