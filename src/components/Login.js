import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Footer from "./Footer";

const WelcomeMessage = ({ scrollToForm }) => (
  <div style={styles.welcomeContainer}>
    <h2 style={styles.welcomeTitle}>
      Bienvenue chez Mr. Renaudin Barbershop
    </h2>
    <p style={styles.welcomeText}>
      Redécouvrez l'excellence de la coiffure à domicile. Nos barbiers experts vous
      offrent des coupes sur-mesure, alliant élégance et modernité pour sublimer votre
      style. Créez votre compte dès aujourd'hui et offrez-vous une expérience personnalisée
      et luxueuse, directement chez vous.
    </p>
    <button
      style={styles.welcomeButton}
      onClick={scrollToForm}
    >
      Rejoignez-nous dès maintenant
    </button>
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
        {isLogin? "Connexion" : "Créer un compte"}
      </h1>
      <p style={styles.subtitle}>
        {isLogin? "Accédez à votre espace" : "Rejoignez Mr. Renaudin"}
      </p>

      <form onSubmit={handleSubmit} style={styles.formContent}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          disabled={loading}
        />

        <button
          type="submit"
          style={{
          ...styles.button,
          ...(loading? styles.buttonDisabled : {})
          }}
          disabled={loading}
        >
          {loading? "Chargement..." : isLogin? "Se connecter" : "S’inscrire"}
        </button>

        <div style={styles.switchContainer}>
          <p style={styles.switchText}>
            {isLogin? "Pas encore de compte?" : "Déjà un compte?"}
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
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const API_URL = "https://api.mrrenaudinbarbershop.com";

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    onLogin(null, null, null);
    toast.info("Déconnexion réussie");
  }, [onLogin]);

  // Verify and decode the token whenever it changes
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

        const userRole = decodedToken.role;
        const userId = decodedToken.id.toString();
        onLogin(userRole, userId, token);
      } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
        localStorage.removeItem("token");
        setToken(null);
      }
    }
  }, [token, onLogin, handleLogout]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!username ||!password) {
        setErrorMessage("Veuillez remplir tous les champs.");
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
          throw new Error(data.error || `Erreur ${response.status}`);
        }

        const userRole = isLogin? data.user.role : "client";
        const userId = data.user.id.toString();
        const userToken = data.token;

        localStorage.setItem("token", userToken);
        setToken(userToken);
        onLogin(userRole, userId, userToken);

        toast.success(isLogin? "Connexion réussie!" : "Inscription réussie!");
        setErrorMessage("");
      } catch (error) {
        console.error("Erreur lors de la requête:", error);
        setErrorMessage(error.message || "Erreur lors de la connexion.");
        toast.error(error.message || "Erreur lors de la connexion.");
      } finally {
        setLoading(false);
      }
    },
    [isLogin, username, password, onLogin]
  );

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        <Header />
        <main style={styles.main}>
          {token? (
            <div style={styles.loggedInContainer}>
              <h2 style={styles.loggedInTitle}>
                Vous êtes connecté!
              </h2>
              <button
                onClick={handleLogout}
                style={styles.logoutButton}
              >
                Se déconnecter
              </button>
              <div style={styles.loggedInText}>
                Accédez à votre espace pour un service personnalisé.
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </main>
        <Footer />
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
    background: 'linear-gradient(135deg, rgba(14,16,21,0.95), rgba(22,27,36,0.95))',
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
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeContainer: {
    textAlign: 'center',
    padding: '40px 20px',
    maxWidth: '700px',
    marginBottom: '40px',
  },
  welcomeTitle: {
    color: '#eef2f7',
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '20px',
    fontFamily: "'Playfair Display', serif",
    textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
  },
  welcomeText: {
    color: '#b8c8da',
    fontSize: '1.1rem',
    lineHeight: '1.7',
    marginBottom: '32px',
    textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
  },
  welcomeButton: {
    backgroundColor: '#d4a843',
    color: '#0e1015',
    fontWeight: '700',
    padding: '14px 32px',
    border: 'none',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  formContainer: {
    width: '100%',
    maxWidth: '440px',
  },
  form: {
    backgroundColor: '#1e2535',
    padding: '48px 40px',
    border: '1px solid #2a3348',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '8px',
    color: '#eef2f7',
    fontFamily: "'Playfair Display', serif",
  },
  subtitle: {
    fontSize: '0.9rem',
    textAlign: 'center',
    marginBottom: '32px',
    color: '#b8c8da',
  },
  formContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
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
    fontSize: '0.9rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
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
    fontSize: '0.9rem',
    marginBottom: '8px',
  },
  switchLink: {
    background: 'none',
    border: 'none',
    color: '#d4a843',
    cursor: 'pointer',
    fontWeight: '600',
    textDecoration: 'underline',
    fontSize: '0.9rem',
  },
  errorAlert: {
    backgroundColor: 'rgba(231,76,60,0.1)',
    border: '1px solid rgba(231,76,60,0.3)',
    color: '#ff8a7a',
    padding: '12px',
    fontSize: '0.85rem',
    textAlign: 'center',
  },
  loggedInContainer: {
    textAlign: 'center',
    backgroundColor: '#1e2535',
    padding: '48px',
    border: '1px solid #2a3348',
  },
  loggedInTitle: {
    color: '#eef2f7',
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '24px',
    fontFamily: "'Playfair Display', serif",
  },
  logoutButton: {
    backgroundColor: '#d4a843',
    color: '#0e1015',
    fontWeight: '700',
    padding: '12px 32px',
    border: 'none',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    cursor: 'pointer',
  },
  loggedInText: {
    marginTop: '24px',
    color: '#b8c8da',
    fontSize: '1rem',
  },
};

export default Login;