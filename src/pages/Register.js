import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    else if (formData.password.length < 6) newErrors.password = '6 caractères minimum';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch('https://api.mrrenaudinbarbershop.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Inscription réussie ! Vous pouvez vous connecter.');
        setFormData({ name: '', email: '', password: '' });
        setTimeout(() => onSwitchToLogin?.(), 1500);
      } else {
        toast.error(data.error || 'Erreur lors de l\'inscription.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur réseau. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>Créer un compte</h1>
        <p style={styles.subtitle}>Rejoignez Mr. Renaudin Barbershop</p>

        <div style={styles.inputGroup}>
          <input
            type="text"
            name="name"
            placeholder="Nom complet"
            value={formData.name}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(errors.name ? styles.inputError : {})
            }}
            disabled={loading}
          />
          {errors.name && <span style={styles.errorText}>{errors.name}</span>}
        </div>

        <div style={styles.inputGroup}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(errors.email ? styles.inputError : {})
            }}
            disabled={loading}
          />
          {errors.email && <span style={styles.errorText}>{errors.email}</span>}
        </div>

        <div style={styles.inputGroup}>
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(errors.password ? styles.inputError : {})
            }}
            disabled={loading}
          />
          {errors.password && <span style={styles.errorText}>{errors.password}</span>}
        </div>

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
          disabled={loading}
        >
          {loading ? 'Inscription...' : 'S\'inscrire'}
        </button>

        {onSwitchToLogin && (
          <p style={styles.switchText}>
            Déjà un compte ?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              style={styles.switchLink}
            >
              Se connecter
            </button>
          </p>
        )}
      </form>
      <ToastContainer theme="dark" position="top-center" />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0e1015',
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: '20px',
  },
  form: {
    backgroundColor: '#1e2535',
    padding: '48px 40px',
    border: '1px solid #2a3348',
    width: '100%',
    maxWidth: '440px',
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
  inputGroup: {
    marginBottom: '20px',
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
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    display: 'block',
    color: '#ff8a7a',
    fontSize: '0.8rem',
    marginTop: '6px',
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
    marginTop: '8px',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '24px',
    color: '#b8c8da',
    fontSize: '0.9rem',
  },
  switchLink: {
    background: 'none',
    border: 'none',
    color: '#d4a843',
    cursor: 'pointer',
    fontWeight: '600',
    textDecoration: 'underline',
    padding: 0,
  },
};

export default Register;