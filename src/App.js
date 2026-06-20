// App.js
import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "animate.css";

// Pages
import HomePage          from "./pages/HomePage";
import BookingPage       from "./pages/BookingPage";
import MyBookingsPage    from "./pages/MyBookingsPage";   // ← NEW
import ContactPage       from "./pages/ContactPage";
import ServicesPage      from "./pages/ServicesPage";
import GalleryPage       from "./pages/GalleryPage";
import AboutPage         from "./pages/AboutPage";
import AnnoncePage       from "./pages/AnnoncePage";
import AdminBookingsPage from "./pages/AdminBookingsPage";

// Components
import Login   from "./components/Login";
import ChatApp from "./components/ChatApp";
import Header  from "./components/Header";
import Footer  from "./components/Footer";

// ─── ScrollToTop ──────────────────────────────────────────────────────────────
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

// ─── Token helpers ─────────────────────────────────────────────────────────────
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const isTokenExpired = (decoded) =>
  decoded?.exp ? decoded.exp * 1000 < Date.now() : false;

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
const ProtectedRoute = ({ children, token, role, allowedRoles }) => {
  if (!token) {
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// ─── App ──────────────────────────────────────────────────────────────────────
const App = () => {
  const [role,     setRole]     = useState(null);
  const [clientId, setClientId] = useState(null);
  const [token,    setToken]    = useState(() => localStorage.getItem("token"));

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = useCallback(() => {
    setRole(null);
    setToken(null);
    setClientId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("chatState");
    localStorage.removeItem("unreadCount");
    localStorage.removeItem("selectedClientId");
  }, []);

  // ── Decode token → hydrate state ───────────────────────────────────────────
  useEffect(() => {
    if (!token) {
      setRole(null);
      setClientId(null);
      return;
    }
    const decoded = decodeToken(token);
    if (!decoded || isTokenExpired(decoded)) {
      console.warn("Token invalide ou expiré — déconnexion");
      handleLogout();
      return;
    }
    setRole(decoded.role);
    localStorage.setItem("role", decoded.role);
    if (decoded.role === "client") {
      setClientId(decoded.id?.toString() ?? null);
    }
  }, [token, handleLogout]);

  // ── Periodic token check (every minute) ───────────────────────────────────
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      const decoded = decodeToken(token);
      if (!decoded || isTokenExpired(decoded)) {
        console.warn("Token expiré — déconnexion automatique");
        handleLogout();
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [token, handleLogout]);

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = useCallback((userRole, userId = null, userToken) => {
    setRole(userRole);
    setToken(userToken);
    localStorage.setItem("token", userToken);
    localStorage.setItem("role", userRole);
    if (userRole === "client" && userId) {
      setClientId(userId.toString());
    }
  }, []);

  return (
    <Router>
      <ScrollToTop />

      {/* ── Global Toast — single instance for the entire app ── */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        draggable={false}
        theme="dark"
        style={{ zIndex: 99999 }}
      />

      <Header role={role} onLogout={handleLogout} />

      {/* Chat — mounted once, keyed by identity */}
      {role === "client" && clientId && (
        <ChatApp key={clientId} clientId={clientId} isAdmin={false} />
      )}
      {role === "admin" && (
        <ChatApp key="admin" clientId={null} isAdmin={true} />
      )}

      <Routes>
        {/* ── Public ── */}
        <Route path="/"          element={<HomePage />} />
        <Route path="/services"  element={<ServicesPage />} />
        <Route path="/galerie"   element={<GalleryPage />} />
        <Route path="/contact"   element={<ContactPage />} />
        <Route path="/a-propos"  element={<AboutPage />} />
        <Route path="/annonces"  element={<AnnoncePage readOnly={!role || role === "client"} />} />
        <Route path="/login"     element={<Login onLogin={handleLogin} />} />

        {/* ── Client: booking flow ── */}
        <Route
          path="/reserver"
          element={
            <ProtectedRoute token={token} role={role} allowedRoles={["client", "admin"]}>
              <BookingPage />
            </ProtectedRoute>
          }
        />

        {/* ── Client: my bookings ── */}
        <Route
          path="/compte"
          element={
            <ProtectedRoute token={token} role={role} allowedRoles={["client", "admin"]}>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />

        {/* ── Admin: dashboard ── */}
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute token={token} role={role} allowedRoles={["admin"]}>
              <AdminBookingsPage />
            </ProtectedRoute>
          }
        />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
