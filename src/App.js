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
import Header from "./components/Header";
import Footer from "./components/Footer";

// ScrollToTop component
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

// Composant pour protéger les routes privées
const ProtectedRoute = ({ children, token }) => {
  if (!token) {
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [role, setRole] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogout = useCallback(() => {
    setRole(null);
    setToken(null);
    setClientId(null);
    localStorage.removeItem("token");
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const [, payload] = token.split(".");
        const decodedToken = JSON.parse(atob(payload));

        if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
          console.warn("Token expiré");
          handleLogout();
          return;
        }

        setRole(decodedToken.role);
        if (decodedToken.role === "client") {
          setClientId(decodedToken.id.toString());
        }
      } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
        handleLogout();
      }
    } else {
      setRole(null);
      setClientId(null);
    }
  }, [token, handleLogout]);

  const handleLogin = useCallback((userRole, userId = null, userToken) => {
    setRole(userRole);
    setToken(userToken);
    localStorage.setItem("token", userToken);
    if (userRole === "client" && userId) {
      setClientId(userId.toString());
    }
  }, []);

  return (
    <Router>
      <FontLoader />
      <ScrollToTop />

      {/* Header visible partout */}
      <Header role={role} onLogout={handleLogout} />

      {/* ChatApp seulement si connecté */}
      {role === "client" && clientId && (
        <ChatApp key={clientId} clientId={clientId} isAdmin={false} />
      )}
      {role === "admin" && <ChatApp key="admin" clientId={null} isAdmin={true} />}

      <Routes>
        {/* Routes Publiques - Pas de compte requis */}
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/a-propos" element={<AboutPage />} />
        <Route path="/annonces" element={<AnnoncePage readOnly={!role || role === "client"} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Routes Privées - Compte requis */}
        <Route
          path="/reserver"
          element={
            <ProtectedRoute token={token}>
              <BookingPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;