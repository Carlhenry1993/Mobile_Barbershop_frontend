import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { VscClose } from "react-icons/vsc";

const useHeaderStyles = () => {
  useEffect(() => {
    const styleId = "mr-renaudin-header-styles-v4";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
.hd-root {
    --hd-black: #0e1015;
    --hd-charcoal: #161b24;
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
    -webkit-backdrop-filter: blur(12px);
  }

.hd-nav {
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding: 0.75rem 1.5rem;
    gap: 2rem;
  }

  /* ========== LOGO ZONE ========== */
.hd-logo-wrap {
    display: flex;
    align-items: center;
    text-decoration: none;
    gap: 0.75rem;
    justify-self: start;
  }

.hd-logo-img {
    height: 48px;
    width: auto;
    max-width: 160px;
    object-fit: contain;
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

  @media (max-width: 768px) {
 .hd-logo-img { height: 42px; }
 .hd-tagline {
    font-size: 0.55rem;
    letter-spacing: 0.12em;
  }
 .hd-nav { padding: 0.75rem 1rem; gap: 1rem; }
  }

  /* ========== NAV CENTER ========== */
.hd-nav-center {
    display: none;
    justify-content: center;
  }

  @media (min-width: 1024px) {
 .hd-nav-center { display: flex; }
  }

.hd-links {
    display: flex;
    list-style: none;
    gap: 0.25rem;
    align-items: center;
    margin: 0;
    padding: 0;
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
    transition: all 0.2s;
    white-space: nowrap;
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

.hd-link-admin {
    background: rgba(212,168,67,0.15)!important;
    color: var(--hd-gold)!important;
    border: 1px solid var(--hd-gold)!important;
  }

.hd-link-admin:hover {
    background: var(--hd-gold)!important;
    color: var(--hd-black)!important;
  }

  /* ── Mes réservations badge ── */
.hd-link-account {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

.hd-link-account::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--hd-gold);
    flex-shrink: 0;
  }

  /* ========== ACTIONS RIGHT ========== */
.hd-actions {
    display: none;
    align-items: center;
    gap: 0.75rem;
    justify-self: end;
  }

  @media (min-width: 1024px) {
 .hd-actions { display: flex; }
  }

.hd-cta-btn {
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.65rem 1.3rem;
    border: 1px solid var(--hd-gold);
    background: var(--hd-gold);
    color: var(--hd-black);
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    white-space: nowrap;
  }

.hd-cta-btn:hover {
    background: var(--hd-gold-lt);
    transform: translateY(-1px);
  }

.hd-cta-btn-outline {
    background: transparent;
    color: var(--hd-gold);
  }

.hd-cta-btn-outline:hover {
    background: var(--hd-gold);
    color: var(--hd-black);
  }

  /* ========== MOBILE MENU BTN ========== */
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
    transition: all 0.2s;
    justify-self: end;
  }

.hd-menu-btn:hover {
    border-color: var(--hd-gold);
    color: var(--hd-gold);
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

  /* ========== MOBILE MENU ========== */
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

.hd-mobile-cta {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--hd-border);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* ── Séparateur mobile ── */
.hd-mobile-divider {
    height: 1px;
    background: var(--hd-border);
    margin: 0.5rem 0;
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

const Header = ({ role, onLogout }) => {
  useHeaderStyles();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const btnRef = useRef(null);

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
      { path: "/",         label: "Accueil" },
      { path: "/services", label: "Nos Services" },
      { path: "/galerie",  label: "Galerie" },
      { path: "/a-propos", label: "À Propos" },
      { path: "/annonces", label: "Annonces" },
      { path: "/contact",  label: "Contact" },
    ],
    []
  );

  const handleBookingClick = () => { navigate("/reserver"); setIsMenuOpen(false); };
  const handleLoginClick   = () => { navigate("/login");    setIsMenuOpen(false); };
  const handleLogoutClick  = () => { onLogout();            setIsMenuOpen(false); };

  const renderLinks = (onClick) =>
    navLinks.map((link) => (
      <li key={link.path}>
        <Link
          to={link.path}
          className={`hd-link ${location.pathname === link.path ? "active" : ""}`}
          onClick={onClick}
          aria-current={location.pathname === link.path ? "page" : undefined}
        >
          {link.label}
        </Link>
      </li>
    ));

  return (
    <header className="hd-root" role="banner">
      <nav className="hd-nav">

        {/* ── Logo ── */}
        <Link to="/" className="hd-logo-wrap" aria-label="Mr. Renaudin Barbershop - Accueil">
          {!logoError ? (
            <img
              src="/Photos/Logo5.png"
              alt="Logo Mr. Renaudin Barbershop"
              className="hd-logo-img"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 900, color: "var(--hd-gold)" }}>
              MR. RENAUDIN
            </div>
          )}
          <div className="hd-logo-text-wrap">
            <div className="hd-tagline">Votre style, notre passion</div>
          </div>
        </Link>

        {/* ── Desktop nav center ── */}
        <div className="hd-nav-center">
          <ul className="hd-links">
            {renderLinks()}

            {/* Mes réservations — client connecté */}
            {role === "client" && (
              <li>
                <Link
                  to="/mon-espace"
                  className={`hd-link hd-link-account ${["/compte", "/mon-espace"].includes(location.pathname) ? "active" : ""}`}
                  aria-current={["/compte", "/mon-espace"].includes(location.pathname) ? "page" : undefined}
                >
                  Mon Espace
                </Link>
              </li>
            )}

            {/* Admin */}
            {role === "admin" && (
              <li>
                <Link
                  to="/admin/bookings"
                  className={`hd-link hd-link-admin ${location.pathname.startsWith("/admin") ? "active" : ""}`}
                >
                  🔧 Admin
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* ── Desktop actions ── */}
        <div className="hd-actions">
          <button onClick={handleBookingClick} className="hd-cta-btn">
            Réserver
          </button>
          {role ? (
            <button onClick={handleLogoutClick} className="hd-cta-btn hd-cta-btn-outline">
              Déconnexion
            </button>
          ) : (
            <button onClick={handleLoginClick} className="hd-cta-btn hd-cta-btn-outline">
              Connexion
            </button>
          )}
        </div>

        {/* ── Mobile menu button ── */}
        <button
          ref={btnRef}
          className="hd-menu-btn"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className="hd-menu-btn-text">{isMenuOpen ? "Fermer" : "Menu"}</span>
          {isMenuOpen ? <VscClose /> : <GiHamburgerMenu />}
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      {isMenuOpen && (
        <ul id="mobile-menu" ref={menuRef} className="hd-mobile-menu">
          {renderLinks(toggleMenu)}

          {/* Mes réservations — client connecté (mobile) */}
          {role === "client" && (
            <li>
              <Link
                to="/mon-espace"
                className={`hd-link hd-link-account ${["/compte", "/mon-espace"].includes(location.pathname) ? "active" : ""}`}
                onClick={toggleMenu}
              >
                📋 Mon Espace
              </Link>
            </li>
          )}

          {/* Admin (mobile) */}
          {role === "admin" && (
            <li>
              <Link
                to="/admin/bookings"
                className="hd-link hd-link-admin"
                onClick={toggleMenu}
              >
                🔧 Admin Réservations
              </Link>
            </li>
          )}

          {/* Séparateur */}
          <li><div className="hd-mobile-divider" /></li>

          {/* CTA */}
          <li className="hd-mobile-cta">
            <button onClick={handleBookingClick} className="hd-cta-btn" style={{ width: "100%" }}>
              Réserver
            </button>
            {role ? (
              <button onClick={handleLogoutClick} className="hd-cta-btn hd-cta-btn-outline" style={{ width: "100%" }}>
                Déconnexion
              </button>
            ) : (
              <button onClick={handleLoginClick} className="hd-cta-btn hd-cta-btn-outline" style={{ width: "100%" }}>
                Connexion
              </button>
            )}
          </li>
        </ul>
      )}
    </header>
  );
};

export default Header;
