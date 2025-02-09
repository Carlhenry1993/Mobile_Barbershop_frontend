import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import 'animate.css';

// Import pages
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import ContactPage from "./pages/ContactPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import AnnoncePage from "./pages/AnnoncePage";

// Import components
import Login from "./components/Login";
import ChatApp from "./components/ChatApp";

// Import jwt-decode as a default import rather than a named import.
import jwtDecode from "jwt-decode";

// ScrollToTop component: listens to location changes and scrolls to the top
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const App = () => {
  const [role, setRole] = useState(null);       // User role: "client" or "admin"
  const [clientId, setClientId] = useState(null); // Client ID (for clients)
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Logout handler
  const handleLogout = useCallback(() => {
    setRole(null);
    setToken(null);
    setClientId(null);
    localStorage.removeItem("token");
  }, []);

  useEffect(() => {
    if (token) {
      try {
        // Decode token using jwtDecode (default import)
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role);
        if (decodedToken.role === "client") {
          setClientId(decodedToken.id);
        }
      } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
        handleLogout();
      }
    }
  }, [token, handleLogout]);

  // Login handler
  const handleLogin = useCallback((userRole, userId = null, userToken) => {
    setRole(userRole);
    setToken(userToken);
    localStorage.setItem("token", userToken);
    if (userRole === "client" && userId) {
      setClientId(userId);
    }
  }, []);

  return (
    <Router>
      <ScrollToTop />
      {!role ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div>
          {/* Logout Button */}
          <div className="p-4 bg-gray-200">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Déconnexion
            </button>
          </div>

          {/* ChatApp for clients and admins */}
          {role === "client" && clientId && (
            <ChatApp clientId={clientId} isAdmin={false} />
          )}
          {role === "admin" && <ChatApp clientId={null} isAdmin={true} />}

          <Routes>
            {/* Common Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/booking" element={<BookingPage />} />

            {/* Annonce Page: Read-only for clients */}
            <Route
              path="/annonces"
              element={<AnnoncePage readOnly={role === "client"} />}
            />

            {/* Fallback Redirection */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      )}
    </Router>
  );
};

export default App;
