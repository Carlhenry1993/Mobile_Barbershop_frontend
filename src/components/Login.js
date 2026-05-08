import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ADDRESS = "462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7";
const PHONE = "514-778-8318";

const WelcomeMessage = ({ scrollToForm, setIsLogin }) => (
  <div style={styles.welcomeContainer}>
    <div style={styles.badge}>Mr. Renaudin Barbershop</div>
    <h2 style={styles.welcomeTitle}>
      Réservation en ligne<br />réservée aux membres
    </h2>
    
    <div style={styles.accountRequiredBox}>
      <div style={styles.lockIcon}>🔒</div>
      <p style={styles.accountRequiredText}>
        <strong>Un compte client est obligatoire pour réserver</strong><br />
        Création gratuite en 30 secondes
      </p>
    </div>

    <p style={styles.welcomeText}>
      Créez votre compte pour choisir votre créneau, modifier vos rendez-vous et recevoir des rappels.
    </p>

    <button
      style={styles.welcomeButton}
      onClick={() => {
        setIsLogin(false);
        scrollToForm();
      }}
    >
      Créer mon compte maintenant
    </button>

    <p style={styles.smallText}>
      Déjà membre ? <button onClick={scrollToForm} style={styles.inlineLink}>Connectez-vous</button><br />
      {ADDRESS} • <a href={`tel:${PHONE}`} style={styles.phoneLink}>{PHONE}</a>
    </p>
  </div>
);

const LoginForm = ({
  isLogin,
  formData,
  errorMessage,
  handleSubmit,
  handleChange,
  setIsLogin,
  loading,
  formRef,
}) => (
  <div ref={formRef} id="login-form" style={styles.formContainer}>
    <div style={styles.form}>
      <h1 style={styles.title}>
        {isLogin? "Connexion" : "Créer un compte"}
      </h1>
      
      {!isLogin && (
        <div style={styles.infoAlert}>
          <strong>Compte requis</strong> pour réserver votre rendez-vous en ligne
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.formContent}>
        {!isLogin && (
          <>
            <div style={styles.grid2}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Prénom *</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Jean"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={loading}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nom *</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Tremblay"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                name="email"
                placeholder="jean@email.com"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                disabled={loading}
                required
                autoComplete="email"
              />
              <span style={styles.hint}>Requis pour confirmation de réservation</span>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Téléphone</label>
              <input
                type="tel"
                name="phone"
                placeholder="514-555-1234"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
                disabled={loading}
              />
              <span style={styles.hint}>Optionnel - pour rappels SMS</span>
            </div>
          </>
        )}

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            {isLogin? "Nom d'utilisateur ou Email" : "Nom d'utilisateur *"}
          </label>
          <input
            type="text"
            name={isLogin? "login" : "username"}
            placeholder={isLogin? "jean.shawinigan ou email" : "jean.shawinigan"}
            value={isLogin? formData.login : formData.username}
            onChange={handleChange}
            style={styles.input}
            disabled={loading}
            autoComplete="username"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Mot de passe</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            disabled={loading}
            autoComplete={isLogin? "current-password" : "new-password"}
            required
          />
          {!isLogin && <span style={styles.hint}>6 caractères minimum</span>}
        </div>

        {!isLogin && (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirmer mot de passe *</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={styles.input}
                disabled={loading}
                required
              />
            </div>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="smsOptIn"
                checked={formData.smsOptIn}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <span>Recevoir rappels SMS 24h avant mon RDV</span>
            </label>
          </>
        )}

        <button
          type="submit"
          style={{
           ...styles.button,
           ...(loading? styles.buttonDisabled : {})
          }}
          disabled={loading}
        >
          {loading? "Chargement..." : isLogin? "Me connecter" : "Créer mon compte"}
        </button>

        <div style={styles.switchContainer}>
          <p style={styles.switchText}>
            {isLogin? "Pas encore de compte?" : "Déjà inscrit?"}
          </p>
          <button
            type="button"
            onClick={() => setIsLogin((prev) =>!prev)}
            style={styles.switchLink}
          >
            {isLogin? "Créer un compte" : "Se connecter"}
          </button>
        </div>

        {errorMessage && (
          <div style={styles.errorAlert}>
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  </div>
);

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    smsOptIn: true,
    login: '' // pour login = username ou email
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

  const API_URL = "https://api.mrrenaudinbarbershop.com";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const redirect = sessionStorage.getItem('redirectAfterLogin');
      if (redirect) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirect);
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
     ...prev,
      [name]: type === 'checkbox'? checked : value
    }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setErrorMessage("");

      if (isLogin) {
        if (!formData.login ||!formData.password) {
          setErrorMessage("Champs requis.");
          return;
        }
      } else {
        if (!formData.firstName ||!formData.lastName ||!formData.username ||!formData.email ||!formData.password) {
          setErrorMessage("Champs obligatoires manquants.");
          return;
        }
        if (formData.password!== formData.confirmPassword) {
          setErrorMessage("Les mots de passe ne correspondent pas.");
          return;
        }
        if (formData.password.length < 6) {
          setErrorMessage("Mot de passe 6 caractères minimum.");
          return;
        }
      }

      setLoading(true);

      const endpoint = isLogin? "/login" : "/register";
      const body = isLogin
       ? { login: formData.login, password: formData.password }
        : {
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            smsOptIn: formData.smsOptIn
          };

      try {
        const response = await fetch(`${API_URL}/api/auth${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erreur de connexion");
        }

        const userRole = isLogin? data.user.role : "client";
        const userId = data.user.id.toString();
        const userToken = data.token;

        onLogin(userRole, userId, userToken);

        toast.success(isLogin? "Bon retour!" : "Compte créé! Vous pouvez réserver.");

        const redirect = sessionStorage.getItem('redirectAfterLogin');
        if (redirect) {
          sessionStorage.removeItem('redirectAfterLogin');
          navigate(redirect);
        } else {
          navigate('/reserver');
        }
      } catch (error) {
        console.error("Erreur:", error);
        setErrorMessage(error.message || "Erreur de connexion.");
        toast.error(error.message || "Erreur de connexion.");
      } finally {
        setLoading(false);
      }
    },
    [isLogin, formData, onLogin, navigate]
  );

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        <main style={styles.main}>
          <div style={styles.splitLayout}>
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
        </main>
      </div>
      <ToastContainer theme="dark" position="top-center" />
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: '#0e1015',
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(14,16,21,0.97), rgba(22,27,36,0.97))',
    zIndex: 1,
  },
  content: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    flexGrow: 1,
    padding: '40px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '40px',
    maxWidth: '1200px',
    width: '100%',
    alignItems: 'start',
  },
  welcomeContainer: {
    textAlign: 'center',
    padding: '20px 0',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: 'rgba(212,168,67,0.15)',
    color: '#d4a843',
    padding: '6px 14px',
    fontSize: '0.7rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '20px',
    border: '1px solid rgba(212,168,67,0.3)',
  },
  welcomeTitle: {
    color: '#eef2f7',
    fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
    fontWeight: '700',
    marginBottom: '20px',
    fontFamily: "'Playfair Display', serif",
    lineHeight: '1.15',
  },
  accountRequiredBox: {
    backgroundColor: 'rgba(212,168,67,0.15)',
    border: '2px solid #d4a843',
    padding: '20px',
    marginBottom: '24px',
    borderRadius: '2px',
  },
  lockIcon: {
    fontSize: '2rem',
    marginBottom: '8px',
  },
  accountRequiredText: {
    color: '#eef2f7',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    margin: 0,
  },
  welcomeText: {
    color: '#b8c8da',
    fontSize: '0.95rem',
    lineHeight: '1.7',
    marginBottom: '28px',
  },
  welcomeButton: {
    backgroundColor: '#d4a843',
    color: '#0e1015',
    fontWeight: '700',
    padding: '16px 32px',
    border: 'none',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
    maxWidth: '320px',
  },
  smallText: {
    color: '#6b7280',
    fontSize: '0.75rem',
    marginTop: '14px',
    lineHeight: '1.5',
  },
  phoneLink: {
    color: '#d4a843',
    textDecoration: 'none',
  },
  inlineLink: {
    background: 'none',
    border: 'none',
    color: '#d4a843',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: 'inherit',
  },
  formContainer: {
    width: '100%',
    maxWidth: '440px',
    margin: '0 auto',
  },
  form: {
    backgroundColor: '#1e2535',
    padding: '32px 24px',
    border: '1px solid #2a3348',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#eef2f7',
    fontFamily: "'Playfair Display', serif",
  },
  infoAlert: {
    backgroundColor: 'rgba(212,168,67,0.1)',
    border: '1px solid rgba(212,168,67,0.3)',
    color: '#d4a843',
    padding: '12px',
    fontSize: '0.8rem',
    lineHeight: '1.5',
    marginBottom: '18px',
  },
  formContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: '#b8c8da',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #2a3348',
    backgroundColor: '#0e1015',
    color: '#eef2f7',
    fontSize: '0.95rem',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  hint: {
    color: '#6b7280',
    fontSize: '0.7rem',
    marginTop: '2px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#b8c8da',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  button: {
    width: '100%',
    backgroundColor: '#d4a843',
    color: '#0e1015',
    padding: '14px',
    border: 'none',
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '8px',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  switchContainer: {
    textAlign: 'center',
    marginTop: '8px',
  },
  switchText: {
    color: '#b8c8da',
    fontSize: '0.85rem',
    marginBottom: '8px',
  },
  switchLink: {
    background: 'none',
    border: 'none',
    color: '#d4a843',
    cursor: 'pointer',
    fontWeight: '600',
    textDecoration: 'underline',
    fontSize: '0.85rem',
  },
  errorAlert: {
    backgroundColor: 'rgba(231,76,60,0.1)',
    border: '1px solid rgba(231,76,60,0.3)',
    color: '#ff8a7a',
    padding: '12px',
    fontSize: '0.8rem',
    textAlign: 'center',
  },
};

if (typeof window!== 'undefined' && window.matchMedia('(min-width: 768px)').matches) {
  styles.splitLayout.gridTemplateColumns = '1fr 1fr';
  styles.splitLayout.gap = '60px';
  styles.splitLayout.alignItems = 'center';
  styles.welcomeContainer.textAlign = 'left';
  styles.welcomeContainer.padding = '20px';
  styles.welcomeButton.width = 'auto';
  styles.welcomeButton.maxWidth = 'none';
  styles.form.padding = '48px 40px';
  styles.main.padding = '60px 20px';
  styles.welcomeTitle.fontSize = '2.5rem';
}

export default Login;