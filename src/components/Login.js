import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ADDRESS = "462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7";
const PHONE   = "514-778-8318";
const API_URL = "https://api.mrrenaudinbarbershop.com";

// ─── Styles injectés une seule fois (responsive via media queries CSS) ────────
const useLoginStyles = () => {
  useEffect(() => {
    const id = "mrr-login-styles";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.innerHTML = `
      .lp-wrap {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: #0e1015;
        font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        position: relative;
      }
      .lp-overlay {
        position: absolute; inset: 0; z-index: 1;
        background: linear-gradient(135deg, rgba(14,16,21,0.97), rgba(22,27,36,0.97));
      }
      .lp-content {
        position: relative; z-index: 10;
        flex: 1; display: flex; align-items: center; justify-content: center;
        padding: 3rem 1.25rem;
      }
      .lp-split {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2.5rem;
        width: 100%;
        max-width: 1100px;
        align-items: start;
      }
      @media (min-width: 768px) {
        .lp-split {
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .lp-content { padding: 4rem 2rem; }
      }

      /* Welcome side */
      .lp-welcome { text-align: center; }
      @media (min-width: 768px) { .lp-welcome { text-align: left; } }

      .lp-badge {
        display: inline-block;
        background: rgba(212,168,67,0.12);
        color: #d4a843;
        border: 1px solid rgba(212,168,67,0.3);
        padding: 5px 14px;
        font-size: 0.68rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        margin-bottom: 1.25rem;
      }
      .lp-welcome-title {
        font-family: 'Playfair Display', serif;
        font-size: clamp(1.8rem, 5vw, 2.6rem);
        font-weight: 900;
        color: #eef2f7;
        line-height: 1.15;
        margin-bottom: 1.25rem;
      }
      .lp-lock-box {
        background: rgba(212,168,67,0.1);
        border: 1.5px solid #d4a843;
        padding: 1.25rem 1.5rem;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: flex-start;
        gap: 0.85rem;
        text-align: left;
      }
      .lp-lock-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 0.1rem; }
      .lp-lock-text { color: #eef2f7; font-size: 0.9rem; line-height: 1.6; margin: 0; }
      .lp-welcome-body {
        color: #b8c8da; font-size: 0.92rem; line-height: 1.75;
        margin-bottom: 1.75rem;
      }
      .lp-welcome-btn {
        display: inline-block;
        background: #d4a843; color: #0e1015;
        font-weight: 700; font-size: 0.85rem;
        letter-spacing: 0.08em; text-transform: uppercase;
        padding: 14px 32px; border: none;
        cursor: pointer; transition: background 0.2s, transform 0.15s;
        width: 100%;
      }
      @media (min-width: 768px) { .lp-welcome-btn { width: auto; } }
      .lp-welcome-btn:hover { background: #f0c96a; transform: translateY(-2px); }
      .lp-small {
        color: #5a6478; font-size: 0.75rem;
        margin-top: 0.85rem; line-height: 1.6;
      }
      .lp-small a, .lp-inline-link {
        color: #d4a843; text-decoration: underline;
        background: none; border: none; cursor: pointer;
        font-size: inherit; padding: 0;
      }

      /* Form side */
      .lp-form-wrap {
        width: 100%; max-width: 440px; margin: 0 auto;
      }
      .lp-form-card {
        background: #1e2535;
        border: 1px solid #2a3348;
        padding: 2rem 1.5rem;
      }
      @media (min-width: 480px) { .lp-form-card { padding: 3rem 2.5rem; } }
      .lp-form-title {
        font-family: 'Playfair Display', serif;
        font-size: 1.6rem; font-weight: 700;
        color: #eef2f7; margin-bottom: 0.5rem;
      }
      .lp-info-alert {
        background: rgba(212,168,67,0.08);
        border: 1px solid rgba(212,168,67,0.25);
        color: #d4a843;
        padding: 10px 14px;
        font-size: 0.8rem; line-height: 1.5;
        margin-bottom: 1.25rem;
      }
      .lp-form-body {
        display: flex; flex-direction: column; gap: 1.1rem;
        margin-top: 1.25rem;
      }
      .lp-grid2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }
      @media (max-width: 420px) {
        .lp-grid2 { grid-template-columns: 1fr; }
      }
      .lp-field { display: flex; flex-direction: column; gap: 5px; }
      .lp-label { color: #b8c8da; font-size: 0.78rem; font-weight: 500; }
      .lp-input {
        width: 100%; padding: 11px 13px;
        background: #0e1015;
        border: 1px solid #2a3348;
        color: #eef2f7;
        font-size: 0.95rem;
        font-family: 'DM Sans', sans-serif;
        transition: border-color 0.2s, box-shadow 0.2s;
        box-sizing: border-box;
        outline: none;
      }
      .lp-input:focus {
        border-color: #d4a843;
        box-shadow: 0 0 0 3px rgba(212,168,67,0.12);
      }
      .lp-input:disabled { opacity: 0.5; cursor: not-allowed; }
      .lp-hint { color: #5a6478; font-size: 0.7rem; }
      .lp-checkbox-row {
        display: flex; align-items: center; gap: 10px;
        color: #b8c8da; font-size: 0.85rem; cursor: pointer;
      }
      .lp-checkbox-row input { width: 16px; height: 16px; cursor: pointer; accent-color: #d4a843; }
      .lp-submit {
        width: 100%; padding: 13px;
        background: #d4a843; color: #0e1015;
        border: none; font-size: 0.85rem;
        font-weight: 700; letter-spacing: 0.08em;
        text-transform: uppercase; cursor: pointer;
        transition: background 0.2s, opacity 0.2s;
        margin-top: 0.5rem;
      }
      .lp-submit:hover:not(:disabled) { background: #f0c96a; }
      .lp-submit:disabled { opacity: 0.5; cursor: not-allowed; }
      .lp-switch { text-align: center; margin-top: 0.75rem; }
      .lp-switch p { color: #b8c8da; font-size: 0.82rem; margin-bottom: 6px; }
      .lp-switch-btn {
        background: none; border: none;
        color: #d4a843; font-weight: 600;
        font-size: 0.82rem; text-decoration: underline;
        cursor: pointer;
      }
      .lp-error {
        background: rgba(231,76,60,0.1);
        border: 1px solid rgba(231,76,60,0.3);
        color: #ff8a7a; padding: 11px 14px;
        font-size: 0.8rem; text-align: center;
        margin-top: 0.5rem;
      }
    `;
    document.head.appendChild(s);
    return () => { document.getElementById(id)?.remove(); };
  }, []);
};

// ─── WelcomeMessage ───────────────────────────────────────────────────────────
const WelcomeMessage = ({ scrollToForm, setIsLogin }) => (
  <div className="lp-welcome">
    <span className="lp-badge">Mr. Renaudin Barbershop</span>

    <h2 className="lp-welcome-title">
      Réservation en ligne<br />réservée aux membres
    </h2>

    <div className="lp-lock-box">
      <span className="lp-lock-icon">🔒</span>
      <p className="lp-lock-text">
        <strong>Un compte client est obligatoire pour réserver</strong><br />
        Création gratuite en 30 secondes
      </p>
    </div>

    <p className="lp-welcome-body">
      Créez votre compte pour choisir votre créneau, modifier vos rendez-vous et recevoir des rappels.
    </p>

    <button
      className="lp-welcome-btn"
      onClick={() => { setIsLogin(false); scrollToForm(); }}
    >
      Créer mon compte maintenant
    </button>

    <p className="lp-small">
      Déjà membre ?{" "}
      <button
        className="lp-inline-link"
        onClick={() => { setIsLogin(true); scrollToForm(); }}
      >
        Connectez-vous
      </button>
      <br />
      {ADDRESS} •{" "}
      <a href={`tel:${PHONE}`}>{PHONE}</a>
    </p>
  </div>
);

// ─── LoginForm ────────────────────────────────────────────────────────────────
const LoginForm = ({ isLogin, formData, errorMessage, handleSubmit, handleChange, setIsLogin, loading, formRef }) => (
  <div ref={formRef} id="login-form" className="lp-form-wrap">
    <div className="lp-form-card">
      <h1 className="lp-form-title">
        {isLogin ? "Connexion" : "Créer un compte"}
      </h1>

      {!isLogin && (
        <div className="lp-info-alert">
          <strong>Compte requis</strong> pour réserver votre rendez-vous en ligne
        </div>
      )}

      <form onSubmit={handleSubmit} className="lp-form-body" noValidate>
        {/* ── Inscription uniquement ── */}
        {!isLogin && (
          <>
            <div className="lp-grid2">
              <div className="lp-field">
                <label className="lp-label">Prénom *</label>
                <input className="lp-input" type="text" name="firstName" placeholder="Jean"
                  value={formData.firstName} onChange={handleChange} disabled={loading} required />
              </div>
              <div className="lp-field">
                <label className="lp-label">Nom *</label>
                <input className="lp-input" type="text" name="lastName" placeholder="Tremblay"
                  value={formData.lastName} onChange={handleChange} disabled={loading} required />
              </div>
            </div>

            <div className="lp-field">
              <label className="lp-label">Email *</label>
              <input className="lp-input" type="email" name="email" placeholder="jean@email.com"
                value={formData.email} onChange={handleChange} disabled={loading} required autoComplete="email" />
              <span className="lp-hint">Requis pour confirmation de réservation</span>
            </div>

            <div className="lp-field">
              <label className="lp-label">Téléphone</label>
              <input className="lp-input" type="tel" name="phone" placeholder="514-555-1234"
                value={formData.phone} onChange={handleChange} disabled={loading} />
              <span className="lp-hint">Optionnel — pour rappels SMS</span>
            </div>
          </>
        )}

        {/* ── Commun ── */}
        <div className="lp-field">
          <label className="lp-label">
            {isLogin ? "Nom d'utilisateur ou Email" : "Nom d'utilisateur *"}
          </label>
          <input
            className="lp-input"
            type="text"
            name={isLogin ? "login" : "username"}
            placeholder={isLogin ? "jean.shawinigan ou email" : "jean.shawinigan"}
            value={isLogin ? formData.login : formData.username}
            onChange={handleChange}
            disabled={loading}
            autoComplete="username"
            required
          />
        </div>

        <div className="lp-field">
          <label className="lp-label">Mot de passe *</label>
          <input
            className="lp-input"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
          />
          {!isLogin && <span className="lp-hint">6 caractères minimum</span>}
        </div>

        {/* ── Inscription uniquement ── */}
        {!isLogin && (
          <>
            <div className="lp-field">
              <label className="lp-label">Confirmer mot de passe *</label>
              <input className="lp-input" type="password" name="confirmPassword" placeholder="••••••••"
                value={formData.confirmPassword} onChange={handleChange} disabled={loading} required />
            </div>

            <label className="lp-checkbox-row">
              <input type="checkbox" name="smsOptIn" checked={formData.smsOptIn}
                onChange={handleChange} />
              <span>Recevoir rappels SMS 24h avant mon RDV</span>
            </label>
          </>
        )}

        <button type="submit" className="lp-submit" disabled={loading}>
          {loading ? "Chargement…" : isLogin ? "Me connecter" : "Créer mon compte"}
        </button>

        <div className="lp-switch">
          <p>{isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?"}</p>
          <button type="button" className="lp-switch-btn" onClick={() => setIsLogin(p => !p)}>
            {isLogin ? "Créer un compte" : "Se connecter"}
          </button>
        </div>

        {errorMessage && <div className="lp-error">{errorMessage}</div>}
      </form>
    </div>
  </div>
);

// ─── Login (main) ─────────────────────────────────────────────────────────────
const Login = ({ onLogin }) => {
  // FIX: démarrer sur Connexion (true) et non Inscription
  const [isLogin, setIsLogin]   = useState(true);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", username: "",
    email: "", phone: "", password: "",
    confirmPassword: "", smsOptIn: true, login: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading]           = useState(false);
  const formRef  = useRef(null);
  const navigate = useNavigate();
  useLoginStyles();

  // Redirect si déjà connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const redirect = sessionStorage.getItem("redirectAfterLogin");
    if (redirect) { sessionStorage.removeItem("redirectAfterLogin"); navigate(redirect); }
    else navigate("/");
  }, [navigate]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (loading) return; // FIX: bloque double-submit
    setErrorMessage("");

    // Validation front
    if (isLogin) {
      if (!formData.login || !formData.password) {
        setErrorMessage("Veuillez remplir tous les champs."); return;
      }
    } else {
      if (!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password) {
        setErrorMessage("Veuillez remplir tous les champs obligatoires."); return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Les mots de passe ne correspondent pas."); return;
      }
      if (formData.password.length < 6) {
        setErrorMessage("Le mot de passe doit contenir au moins 6 caractères."); return;
      }
    }

    setLoading(true);

    const endpoint = isLogin ? "/login" : "/register";
    const body = isLogin
      ? { login: formData.login, password: formData.password }
      : {
          firstName: formData.firstName, lastName: formData.lastName,
          username: formData.username, email: formData.email,
          phone: formData.phone, password: formData.password,
          smsOptIn: formData.smsOptIn,
        };

    try {
      const res  = await fetch(`${API_URL}/api/auth${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de connexion");

      onLogin(isLogin ? data.user.role : "client", data.user.id.toString(), data.token);
      toast.success(isLogin ? "Bon retour !" : "Compte créé ! Vous pouvez réserver.");

      const redirect = sessionStorage.getItem("redirectAfterLogin");
      if (redirect) { sessionStorage.removeItem("redirectAfterLogin"); navigate(redirect); }
      else navigate("/reserver");

    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Erreur de connexion.");
      toast.error(err.message || "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  }, [isLogin, formData, loading, onLogin, navigate]);

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="lp-wrap">
      <div className="lp-overlay" />
      <div className="lp-content">
        <div className="lp-split">
          <WelcomeMessage scrollToForm={scrollToForm} setIsLogin={setIsLogin} />
          <LoginForm
            isLogin={isLogin}
            formData={formData}
            errorMessage={errorMessage}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            setIsLogin={setIsLogin}
            loading={loading}
            formRef={formRef}
          />
        </div>
      </div>
      <ToastContainer theme="dark" position="top-center" />
    </div>
  );
};

export default Login;