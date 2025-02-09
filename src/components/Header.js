import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi"; // Icône hamburger
import { VscClose } from "react-icons/vsc"; // Icône fermer

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [role, setRole] = useState(null); // Rôle de l'utilisateur
  const location = useLocation();

  useEffect(() => {
    // Récupère le rôle de l'utilisateur depuis localStorage
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Utilise useMemo pour recalculer navLinks uniquement lorsque le rôle change
  const navLinks = useMemo(() => [
    { path: "/", label: "Accueil" },
    { path: "/services", label: "Nos Services" },
    { path: "/booking", label: "Réservez" },
    { path: "/about", label: "À Propos" },
    { path: "/annonces", label: "Annonces" },
    { path: "/contact", label: "Contact" },
    // Ajoute le lien Admin uniquement pour les administrateurs
    ...(role === "admin" ? [{ path: "/admin", label: "Espace Admin" }] : []),
  ], [role]);

  const renderLinks = (onClick) =>
    navLinks.map((link) => (
      <li key={link.path} className="transition-transform duration-300 ease-in-out">
        <Link
          to={link.path}
          className={`text-lg font-medium py-2 px-4 rounded-md ${
            location.pathname === link.path
              ? "text-white bg-blue-600"
              : "text-gray-800 hover:text-white hover:bg-blue-500 hover:scale-105"
          }`}
          onClick={onClick}
        >
          {link.label}
        </Link>
      </li>
    ));

  return (
    <header className="bg-blue-50 text-gray-800 py-4 sticky top-0 z-50 shadow-md transition-all duration-300" role="banner">
      <nav className="container mx-auto flex justify-between items-center px-4">
        {/* Logo et slogan promotionnel */}
        <Link to="/" className="flex items-center">
          <img
            src="/Photos/Logo5.png"
            alt="Logo Mr. Renaudin Barbershop"
            className="h-20 w-auto"
          />
          <span className="ml-3 text-xl font-bold text-blue-600 hidden md:block">
            Votre style, notre passion
          </span>
        </Link>

        {/* Bouton de menu mobile */}
        <button
          className="lg:hidden flex items-center text-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className="mr-2 text-base font-medium">
            {isMenuOpen ? "Fermer" : "Menu"}
          </span>
          {isMenuOpen ? <VscClose /> : <GiHamburgerMenu />}
        </button>

        {/* Menu Desktop */}
        <ul className="hidden lg:flex space-x-6">{renderLinks()}</ul>
      </nav>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <ul
          id="mobile-menu"
          className="lg:hidden bg-blue-50 text-center p-4 space-y-4 shadow-md rounded-md transition-transform duration-300 ease-in-out"
        >
          {renderLinks(toggleMenu)}
        </ul>
      )}
    </header>
  );
};

export default Header;
