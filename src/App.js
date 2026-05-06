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

// ScrollToTop component: scrolls to the top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

// Charger les fonts du thème Mr. Renaudin
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  return null;
};

const App = () => {
  const [role, setRole] = useState(null); // "client" or "admin"
  const [clientId, setClientId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Logout handler: clears state and localStorage
  const handleLogout = useCallback(() => {
    setRole(null);
    setToken(null);
    setClientId(null);
    localStorage.removeItem("token");
  }, []);

  // When token changes, decode it manually using atob
  useEffect(() => {
    if (token) {
      try {
        const [, payload] = token.split(".");
        const decodedToken = JSON.parse(atob(payload));

        // Vérifier expiration
        if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
          console.warn("Token expiré");
          handleLogout();
          return;
        }

        setRole(decodedToken.role);
        if (decodedToken.role === "client") {
          // IMPORTANT: convertir en string pour matcher la DB VARCHAR
          setClientId(decodedToken.id.toString());
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
      setClientId(userId.toString()); // IMPORTANT: string
    }
  }, []);

  return (
    <Router>
      <FontLoader />
      <ScrollToTop />
      {!role? (
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

          {/* ChatApp for clients and admins - key pour éviter re-mount */}
          {role === "client" && clientId && (
            <ChatApp key={clientId} clientId={clientId} isAdmin={false} />
          )}
          {role === "admin" && <ChatApp key="admin" clientId={null} isAdmin={true} />}

          <Routes>
            {/* Common Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/booking" element={<BookingPage />} />
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