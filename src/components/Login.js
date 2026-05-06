import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ADDRESS = "462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7";
const PHONE = "514-778-8318";

const WelcomeMessage = ({ scrollToForm }) => (
  <div style={styles.welcomeContainer}>
    <div style={styles.badge}>Barbershop Premium • Shawinigan</div>
    <h2 style={styles.welcomeTitle}>
      L'Excellence du Grooming Masculin
    </h2>
    <p style={styles.welcomeText}>
      <strong>Mr. Renaudin Barbershop</strong> — L’excellence du barbier traditionnel au cœur de Shawinigan.
      Situé au <strong>{ADDRESS}</strong>, notre équipe maîtrise l’art du fade, du rasage à l’ancienne et des coupes signature.
      Techniques françaises, précision québécoise. Votre style mérite mieux que l’ordinaire.
    </p>
    <div style={styles.features}>
      <div style={styles.feature}>✂️ Fades & Dégradés Haute Précision</div>
      <div style={styles.feature}>🪒 Rasage Traditionnel au Coupe-Chou</div>
      <div style={styles.feature}>⭐ Noté 4.9/5 par nos clients</div>
    </div>
    <button
      style={styles.welcomeButton}
      onClick={scrollToForm}
    >
      Réserver maintenant
    </button>
    <p style={styles.smallText}>
      {ADDRESS}<br />
      <a href={`tel:${PHONE}`} style={styles.phoneLink}>{PHONE}</a>
    </p>
  </div>
);

const LoginForm = ({
  isLogin,
  username,
  password,
  errorMessage,
  handleSubmit,
  setUsername,
  setPassword,
  setIsLogin,
  loading,
  formRef,
}) => (
  <div ref={formRef} id="login-form" style={styles.formContainer}>
    <div style={styles.form}>
      <h1 style={styles.title}>
        {isLogin? "Espace Membre" : "Rejoindre Mr. Renaudin"}
      </h1>
      <p style={styles.subtitle}>
        {isLogin
  ? "Gérez vos rendez-vous en ligne"
          : "Accédez aux créneaux prioritaires"}
      </p>

      <form onSubmit={handleSubmit} style={styles.formContent}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Nom d'utilisateur</label>
          <input
            type="text"
            placeholder="ex: client.shawinigan"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            disabled={loading}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          style={{
  ...styles.button,
  ...(loading? styles.buttonDisabled : {})
          }}
          disabled={loading}
        >
          {loading? "Connexion..." : isLogin? "Me connecter" : "Créer mon compte"}
        </button>

        <div style={styles.switchContainer}>
          <p style={styles.switchText}>
            {isLogin? "Nouveau chez Mr. Renaudin?" : "Déjà membre?"}
          </p>
          <button
            type="button"
            onClick={() => setIsLogin((prev) =>!prev)}
            style={styles.switchLink}
          >
            {isLogin? "Créer un compte" : "Me connecter"}
          </button>
        </div>

        {errorMessage && (
          <div style={styles.errorAlert}>
            {errorMessage}
          </div>
        )}

        <div style={styles.contactFooter}>
          <p style={styles.contactText}>
            {ADDRESS}<br />
            <a href={`tel:${PHONE}`} style={styles.contactLink}>{PHONE}</a>
          </p>
        </div>
      </form>
    </div>
  </div>
);

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

  const API_URL = "https://api.mrrenaudinbarbershop.com";

  // Redirect si déjà connecté ou après login
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

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!username ||!password) {
        setErrorMessage("Nom d'utilisateur et mot de passe requis.");
        return;
      }
      setLoading(true);
      setErrorMessage("");

      const endpoint = isLogin? "/login" : "/register";
      const body = isLogin
? { username, password }
        : { username, password, role: "client" };

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

        toast.success(isLogin? "Bon retour chez Mr. Renaudin!" : "Bienvenue chez Mr. Renaudin!");

        // Redirect après login
        const redirect = sessionStorage.getItem('redirectAfterLogin');
        if (redirect) {
          sessionStorage.removeItem('redirectAfterLogin');
          navigate(redirect);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error("Erreur:", error);
        setErrorMessage(error.message || "Erreur de connexion.");
        toast.error(error.message || "Erreur de connexion.");
      } finally {
        setLoading(false);
      }
    },
    [isLogin, username, password, onLogin, navigate]
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
            <WelcomeMessage scrollToForm={scrollToForm} />
            <LoginForm
              isLogin={isLogin}
              username={username}
              password={password}
              errorMessage={errorMessage}
              handleSubmit={handleSubmit}
              setUsername={setUsername}
              setPassword={setPassword}
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
    fontSize: 'clamp(2rem, 8vw, 3rem)',
    fontWeight: '700',
    marginBottom: '20px',
    fontFamily: "'Playfair Display', serif",
    lineHeight: '1.15',
  },
  welcomeText: {
    color: '#b8c8da',
    fontSize: '1rem',
    lineHeight: '1.7',
    marginBottom: '28px',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '28px',
    alignItems: 'center',
  },
  feature: {
    color: '#eef2f7',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  welcomeButton: {
    backgroundColor: '#d4a843',
    color: '#0e1015',
    fontWeight: '700',
    padding: '14px 32px',
    border: 'none',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
    maxWidth: '280px',
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
  subtitle: {
    fontSize: '0.85rem',
    marginBottom: '28px',
    color: '#b8c8da',
    lineHeight: '1.5',
  },
  formContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
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
  contactFooter: {
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid #2a3348',
    textAlign: 'center',
  },
  contactText: {
    color: '#6b7280',
    fontSize: '0.75rem',
    lineHeight: '1.6',
  },
  contactLink: {
    color: '#d4a843',
    textDecoration: 'none',
  },
};

// Media query pour desktop
if (typeof window!== 'undefined' && window.matchMedia('(min-width: 768px)').matches) {
  styles.splitLayout.gridTemplateColumns = '1fr 1fr';
  styles.splitLayout.gap = '60px';
  styles.splitLayout.alignItems = 'center';
  styles.welcomeContainer.textAlign = 'left';
  styles.welcomeContainer.padding = '20px';
  styles.features.alignItems = 'flex-start';
  styles.welcomeButton.width = 'auto';
  styles.welcomeButton.maxWidth = 'none';
  styles.form.padding = '48px 40px';
  styles.main.padding = '60px 20px';
  styles.welcomeTitle.fontSize = '3rem';
}

export default Login;