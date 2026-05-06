import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { VscClose } from "react-icons/vsc";

const useHeaderStyles = () => {
  useEffect(() => {
    const styleId = "mr-renaudin-header-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
  .hd-root {
        --hd-black: #0e1015;
        --hd-charcoal:#161b24;
        --hd-card: #1e2535;
        --hd-border: #2a3348;
        --hd-gold: #d4a843;
        --hd-gold-lt: #f0c96a;
        --hd-cream: #eef2f7;
        --hd-light: #b8c8da;
        --hd-muted: #7888a0;

        background: rgba(22, 27, 36, 0.95);
        color: var(--hd-cream);
        font-family: 'DM Sans', sans-serif;
        position: sticky;
        top: 0;
        z-index: 100;
        border-bottom: 1px solid var(--hd-border);
        backdrop-filter: blur(12px);
      }

  .hd-nav {
        max-width: 1100px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1.5rem;
      }

  .hd-logo-wrap {
        display: flex;
        align-items: center;
        text-decoration: none;
        gap: 0.75rem;
      }

  .hd-logo-img {
        height: 48px;
        width: auto;
        max-width: 160px;
        object-fit: contain;
        display: block;
      }
      @media (max-width: 540px) {
    .hd-logo-img { height: 44px; }
      }

  .hd-logo-text-wrap {
        display: flex;
        flex-direction: column;
        line-height: 1.1;
      }

  .hd-tagline {
        font-size: 0.6rem;
        font-weight: 500;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--hd-gold);
        margin-top: 0.2rem;
      }
      @media (min-width: 768px) {
    .hd-tagline { font-size: 0.65rem; }
      }

  .hd-menu-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: transparent;
        border: 1px solid var(--hd-border);
        color: var(--hd-cream);
        font-size: 1.5rem;
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        transition: border-color 0.2s, color 0.2s;
      }

  .hd-menu-btn:hover,.hd-menu-btn:focus-visible {
        border-color: var(--hd-gold);
        color: var(--hd-gold);
        outline: none;
      }

  .hd-menu-btn-text {
        font-size: 0.75rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        font-weight: 500;
      }

      @media (min-width: 1024px) {
   .hd-menu-btn { display: none; }
      }

  .hd-links {
        display: none;
        list-style: none;
        gap: 0.25rem;
      }

      @media (min-width: 1024px) {
   .hd-links { display: flex; }
      }

  .hd-link {
        display: block;
        font-size: 0.82rem;
        font-weight: 500;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--hd-light);
        text-decoration: none;
        padding: 0.6rem 1rem;
        border: 1px solid transparent;
        transition: color 0.2s, border-color 0.2s, background 0.2s;
      }

  .hd-link:hover,.hd-link:focus-visible {
        color: var(--hd-gold);
        border-color: var(--hd-gold);
        outline: none;
      }

  .hd-link.active {
        color: var(--hd-black);
        background: var(--hd-gold);
        border-color: var(--hd-gold);
      }

  .hd-link.active:hover {
        background: var(--hd-gold-lt);
      }

  .hd-mobile-menu {
        background: var(--hd-charcoal);
        border-top: 1px solid var(--hd-border);
        padding: 1rem 1.5rem 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        animation: slideDown 0.3s ease;
      }

      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }

  .hd-mobile-menu.hd-link {
        text-align: center;
        padding: 0.9rem 1rem;
      }

      @media (min-width: 1024px) {
   .hd-mobile-menu { display: none; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);
};

const Header = () => {
  useHeaderStyles();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    const handleClickOutside = (e) => {
      if (
        isMenuOpen &&
        menuRef.current &&
   !menuRef.current.contains(e.target) &&
        btnRef.current &&
   !btnRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = useMemo(
    () => [
      { path: "/", label: "Accueil" },
      { path: "/services", label: "Nos Services" },
      { path: "/booking", label: "Réservez" },
      { path: "/about", label: "À Propos" },
      { path: "/annonces", label: "Annonces" },
      { path: "/contact", label: "Contact" },
 ...(role === "admin"? [{ path: "/admin", label: "Espace Admin" }] : []),
    ],
    [role]
  );

  const renderLinks = (onClick) =>
    navLinks.map((link) => (
      <li key={link.path}>
        <Link
          to={link.path}
          className={`hd-link ${location.pathname === link.path? "active" : ""}`}
          onClick={onClick}
          aria-current={location.pathname === link.path? "page" : undefined}
        >
          {link.label}
        </Link>
      </li>
    ));

  return (
    <header className="hd-root" role="banner">
      <nav className="hd-nav">
        <Link to="/" className="hd-logo-wrap" aria-label="Mr. Renaudin Barbershop - Accueil">
          {!logoError? (
            <img
              src="/Photos/Logo5.png"
              alt="Logo Mr. Renaudin Barbershop"
              className="hd-logo-img"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1rem",
              fontWeight: 900,
              color: "var(--hd-gold)"
            }}>
              MR. RENAUDIN
            </div>
          )}
          <div className="hd-logo-text-wrap">
            <div className="hd-tagline">Votre style, notre passion</div>
          </div>
        </Link>

        <button
          ref={btnRef}
          className="hd-menu-btn"
          onClick={toggleMenu}
          aria-label={isMenuOpen? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className="hd-menu-btn-text">{isMenuOpen? "Fermer" : "Menu"}</span>
          {isMenuOpen? <VscClose /> : <GiHamburgerMenu />}
        </button>

        <ul className="hd-links">{renderLinks()}</ul>
      </nav>

      {isMenuOpen && (
        <ul id="mobile-menu" ref={menuRef} className="hd-mobile-menu">
          {renderLinks(toggleMenu)}
        </ul>
      )}
    </header>
  );
};

export default Header;