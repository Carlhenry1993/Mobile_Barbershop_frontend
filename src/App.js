// App.js
import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import "animate.css";

/* ───────── Pages ───────── */
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import ContactPage from "./pages/ContactPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import AnnoncePage from "./pages/AnnoncePage";

/* ───────── Components ───────── */
import Login from "./components/Login";
import ChatApp from "./components/ChatApp";

/* ───────── ScrollToTop ───────── */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

/* ───────── SAFE JWT DECODE ───────── */
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];

    // fix base64url → base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    return JSON.parse(atob(base64));
  } catch (err) {
    console.error("Token invalide:", err);
    return null;
  }
};

/* ───────── APP ───────── */
const App = () => {
  const [role, setRole] = useState(null); // "client" | "admin"
  const [clientId, setClientId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  /* ─── Logout ─── */
  const handleLogout = useCallback(() => {
    setRole(null);
    setClientId(null);
    setToken(null);
    localStorage.removeItem("token");
  }, []);

  /* ─── Decode token on load ─── */
  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);

      if (!decoded) {
        handleLogout();
      } else {
        setRole(decoded.role);

        if (decoded.role === "client") {
          setClientId(decoded.id);
        }
      }
    }

    setLoading(false);
  }, [token, handleLogout]);

  /* ─── Login ─── */
  const handleLogin = useCallback((userRole, userId, userToken) => {
    setRole(userRole);
    setToken(userToken);
    localStorage.setItem("token", userToken);

    if (userRole === "client") {
      setClientId(userId);
    }
  }, []);

  /* ─── Loading screen ─── */
  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Chargement...
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />

      {!role ? (
        /* ───────── LOGIN ───────── */
        <Login onLogin={handleLogin} />
      ) : (
        <div>
          {/* ───────── HEADER ACTIONS ───────── */}
          <div style={{ padding: "1rem", background: "#eee" }}>
            <button
              onClick={handleLogout}
              style={{
                background: "#e63946",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Déconnexion
            </button>
          </div>

          {/* ───────── CHAT ───────── */}
          {role === "client" && clientId && (
            <ChatApp clientId={clientId} isAdmin={false} />
          )}

          {role === "admin" && (
            <ChatApp clientId={null} isAdmin={true} />
          )}

          {/* ───────── ROUTES ───────── */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route
              path="/annonces"
              element={<AnnoncePage readOnly={role === "client"} />}
            />

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      )}
    </Router>
  );
};

export default App;