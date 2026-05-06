import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { motion, useInView, useReducedMotion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Constantes utilisées dans le composant
const ADDRESS = "462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7, Canada";
const PHONE = "514-778-8318";
const MAP_QUERY = "462 4e Rue de la Pointe Shawinigan QC G9N 1G7";

const useAnnouncementsStyles = () => {
  useEffect(() => {
    const styleId = "mr-renaudin-announcements-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
  .an-root {
        --an-black: #0e1015;
        --an-charcoal: #161b24;
        --an-card: #1e2535;
        --an-border: #2a3348;
        --an-gold: #d4a843;
        --an-gold-lt: #f0c96a;
        --an-gold-dim: rgba(212,168,67,0.13);
        --an-steel: #8ba8c8;
        --an-cream: #eef2f7;
        --an-light: #b8c8da;
        --an-muted: #7888a0;
        --an-danger: #e74c3c;

        background: var(--an-black);
        color: var(--an-cream);
        font-family: 'DM Sans', sans-serif;
        -webkit-font-smoothing: antialiased;
        min-height: 100svh;
        display: flex;
        flex-direction: column;
      }

  .an-root::before {
        content: '';
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
        opacity: 0.035;
      }

  .an-inner { position: relative; z-index: 1; flex: 1; }

  .an-eyebrow {
        font-family: 'DM Sans', sans-serif;
        font-size: 0.68rem;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: var(--an-gold);
        margin-bottom: 1rem;
      }

  .an-display {
        font-family: 'Playfair Display', Georgia, serif;
        font-weight: 900;
        line-height: 1.05;
        color: var(--an-cream);
      }

  .an-serif-body {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-weight: 300;
        font-size: 1.25rem;
        line-height: 1.85;
        color: var(--an-light);
      }
      @media (max-width: 768px) {
  .an-serif-body { font-size: 1.15rem; }
      }

  .an-gold-rule {
        display: block;
        width: 60px;
        height: 2px;
        background: var(--an-gold);
        margin: 0 auto 1.5rem;
      }

  .an-section-pad { padding: 7rem 1.5rem; }
      @media (max-width: 768px) {
  .an-section-pad { padding: 5rem 1.25rem; }
      }

  .an-btn-gold, .an-btn-outline {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'DM Sans', sans-serif;
        font-weight: 500;
        font-size: 0.85rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 1rem 2rem;
        border: none;
        cursor: pointer;
        transition: background 0.3s, transform 0.2s, border-color 0.3s, color 0.3s;
        text-decoration: none;
        will-change: transform;
      }
  .an-btn-gold {
        background: var(--an-gold);
        color: var(--an-black);
      }
  .an-btn-gold:hover, .an-btn-gold:focus-visible { 
        background: var(--an-gold-lt); 
        transform: translateY(-2px);
        outline: 2px solid var(--an-gold-lt);
        outline-offset: 2px;
      }
  .an-btn-gold:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
  .an-btn-outline {
        background: transparent;
        color: var(--an-cream);
        border: 1px solid rgba(184,200,218,0.3);
      }
  .an-btn-outline:hover, .an-btn-outline:focus-visible { 
        border-color: var(--an-gold); 
        color: var(--an-gold); 
        transform: translateY(-2px);
        outline: 2px solid var(--an-gold);
        outline-offset: 2px;
      }

  .an-hero {
        position: relative;
        min-height: 70svh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        overflow: hidden;
        padding: 0 1.5rem;
        background: var(--an-charcoal);
      }

  .an-hero::after {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 50% 30%, rgba(212,168,67,0.08) 0%, transparent 60%);
      }

  .an-admin-card {
        background: var(--an-card);
        border: 1px solid var(--an-border);
        padding: 2.5rem 2rem;
        margin-bottom: 3rem;
      }

  .an-input, .an-textarea {
        width: 100%;
        background: var(--an-black);
        border: 1px solid var(--an-border);
        color: var(--an-cream);
        font-family: 'DM Sans', sans-serif;
        font-size: 0.95rem;
        padding: 1rem 1.25rem;
        transition: border-color 0.3s, background 0.3s;
      }
  .an-input::placeholder, .an-textarea::placeholder {
        color: var(--an-muted);
      }
  .an-input:focus, .an-textarea:focus {
        outline: none;
        border-color: var(--an-gold);
        background: #1a2332;
      }
  .an-textarea {
        resize: vertical;
        min-height: 120px;
      }

  .an-card {
        background: var(--an-card);
        border: 1px solid var(--an-border);
        padding: 2rem;
        transition: border-color 0.35s, transform 0.35s, background 0.35s;
        will-change: transform;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
  .an-card:hover { 
        border-color: var(--an-gold); 
        transform: translateY(-6px); 
        background: #222e42; 
      }

  .an-card-title {
        font-family: 'Playfair Display', serif;
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--an-cream);
        margin-bottom: 0.75rem;
        letter-spacing: 0.01em;
      }

  .an-card-content {
        font-size: 0.95rem;
        color: var(--an-light);
        line-height: 1.75;
        margin-bottom: 1rem;
        flex: 1;
      }

  .an-card-date {
        font-size: 0.75rem;
        color: var(--an-muted);
        letter-spacing: 0.05em;
        margin-bottom: 1rem;
      }

  .an-card-actions {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--an-border);
      }

  .an-action-btn {
        background: transparent;
        border: none;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        transition: color 0.2s;
      }
  .an-action-edit {
        color: var(--an-gold);
      }
  .an-action-edit:hover {
        color: var(--an-gold-lt);
      }
  .an-action-delete {
        color: var(--an-danger);
      }
  .an-action-delete:hover {
        color: #ff6b5a;
      }

  .an-error {
        background: rgba(231,76,60,0.1);
        border: 1px solid rgba(231,76,60,0.3);
        color: #ff8a7a;
        padding: 1rem 1.5rem;
        margin-bottom: 2rem;
        font-size: 0.9rem;
      }

  .an-address-box {
        background: var(--an-card);
        border: 1px solid var(--an-border);
        padding: 2rem;
        text-align: center;
        margin-top: 3rem;
      }
  .an-address-text {
        font-size: 0.95rem;
        color: var(--an-light);
        margin-bottom: 1rem;
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) return <div className={className}>{children}</div>;
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView? "show" : "hidden"}
      custom={delay}
      variants={fadeUp}
    >
      {children}
    </motion.div>
  );
};

const AnnouncementPage = () => {
  useAnnouncementsStyles();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [editingId, setEditingId] = useState(null);

  axios.defaults.baseURL = 'https://mobile-barbershop-backend.onrender.com';
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(decodedToken.role === 'admin');
      } catch (err) {
        console.error("Erreur lors du décodage du token :", err);
        setIsAdmin(false);
      }
    }

    const fetchAnnouncements = async () => {
      setLoadingAnnouncements(true);
      try {
        const response = await axios.get('/api/announcements');
        const data = response.data;
        if (Array.isArray(data)) {
          setAnnouncements(data);
        } else if (data && Array.isArray(data.announcements)) {
          setAnnouncements(data.announcements);
        } else {
          console.error("Structure inattendue de la réponse API :", data);
          setError("Impossible de charger les annonces pour le moment.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des annonces :", err);
        setError("Impossible de charger les annonces pour le moment.");
      } finally {
        setLoadingAnnouncements(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const validateFields = () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      setError("Le titre et le contenu sont obligatoires.");
      return false;
    }
    return true;
  };

  const handleAddOrEditAnnouncement = async () => {
    if (!validateFields()) return;
    setLoading(true);
    setError('');
    try {
      let response;
      if (editingId) {
        response = await axios.put(`/api/announcements/${editingId}`, newAnnouncement);
        setAnnouncements(
          announcements.map((announcement) =>
            announcement.id === editingId ? response.data : announcement
          )
        );
        toast.success('Annonce modifiée avec succès !');
      } else {
        response = await axios.post('/api/announcements', newAnnouncement);
        setAnnouncements([response.data, ...announcements]);
        toast.success('Annonce ajoutée avec succès !');
      }
      setNewAnnouncement({ title: '', content: '' });
      setEditingId(null);
    } catch (err) {
      console.error("Erreur lors de l'ajout/modification :", err);
      setError("Une erreur est survenue lors de l'opération. Veuillez réessayer !");
      toast.error("Une erreur est survenue !");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      try {
        await axios.delete(`/api/announcements/${id}`);
        setAnnouncements(announcements.filter((announcement) => announcement.id !== id));
        toast.success('Annonce supprimée avec succès !');
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
        setError("Impossible de supprimer l'annonce.");
        toast.error("Une erreur est survenue !");
      }
    }
  };

  const handleEditAnnouncement = (id) => {
    const announcementToEdit = announcements.find((announcement) => announcement.id === id);
    if (announcementToEdit) {
      setNewAnnouncement({ title: announcementToEdit.title, content: announcementToEdit.content });
      setEditingId(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToAnnouncements = () => {
    const section = document.getElementById("announcements-section");
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const datePart = dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const timePart = dateObj.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${datePart} à ${timePart}`;
  };

  return (
    <div className="an-root">
      <Header />
      <div className="an-inner">
        
        {/* Hero */}
        <section className="an-hero">
          <div className="relative z-10 max-w-4xl mx-auto">
            <motion.p
              className="an-eyebrow"
              initial={shouldReduceMotion? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Nouveautés & Promotions
            </motion.p>

            <motion.h1
              className="an-display"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", marginBottom: "1.5rem" }}
              initial={shouldReduceMotion? {} : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              Annonces Exclusives<br />
              <span style={{ color: "var(--an-gold)" }}>Mr. Renaudin</span>
            </motion.h1>

            <motion.p
              className="an-serif-body"
              style={{ maxWidth: "680px", margin: "0 auto 2.5rem" }}
              initial={shouldReduceMotion? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Restez informé des dernières offres, événements et nouveautés de votre barbershop à Shawinigan. 
              Promotions saisonnières, nouveaux services, horaires spéciaux — tout est ici.
            </motion.p>

            <motion.div
              initial={shouldReduceMotion? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              <button onClick={scrollToAnnouncements} className="an-btn-gold">
                Voir les annonces
              </button>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section id="announcements-section" className="an-section-pad" style={{ background: "var(--an-charcoal)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <p className="an-eyebrow">Dernières nouvelles</p>
                <span className="an-gold-rule" />
                <h2 className="an-display" style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}>
                  Nos Annonces
                </h2>
              </div>
            </FadeIn>

            {error && (
              <FadeIn>
                <div className="an-error">{error}</div>
              </FadeIn>
            )}

            {isAdmin && (
              <FadeIn delay={0.1}>
                <div className="an-admin-card">
                  <h3 className="an-display" style={{ fontSize: "1.75rem", marginBottom: "1.5rem" }}>
                    {editingId ? 'Modifier' : 'Ajouter'} une annonce
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <input
                      type="text"
                      placeholder="Titre de l'annonce"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                      className="an-input"
                    />
                    <textarea
                      placeholder="Contenu de l'annonce"
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                      className="an-textarea"
                    />
                    <button
                      onClick={handleAddOrEditAnnouncement}
                      className="an-btn-gold"
                      disabled={loading}
                      style={{ width: "100%" }}
                    >
                      {loading ? 'En cours...' : editingId ? 'Modifier l\'annonce' : 'Publier l\'annonce'}
                    </button>
                  </div>
                </div>
              </FadeIn>
            )}

            {loadingAnnouncements ? (
              <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--an-light)" }}>
                Chargement des annonces...
              </div>
            ) : announcements.length === 0 ? (
              <FadeIn>
                <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--an-muted)" }}>
                  Aucune annonce pour le moment. Revenez bientôt !
                </div>
              </FadeIn>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "2rem",
              }}>
                {announcements.map((announcement, i) => (
                  <FadeIn key={announcement.id} delay={i * 0.06}>
                    <div className="an-card">
                      <h3 className="an-card-title">{announcement.title}</h3>
                      <p className="an-card-content">{announcement.content}</p>
                      <p className="an-card-date">{formatDate(announcement.created_at)}</p>
                      {isAdmin && (
                        <div className="an-card-actions">
                          <button
                            onClick={() => handleEditAnnouncement(announcement.id)}
                            className="an-action-btn an-action-edit"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                            className="an-action-btn an-action-delete"
                          >
                            Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  </FadeIn>
                ))}
              </div>
            )}

            {/* Adresse du salon utilisée ici */}
            <FadeIn delay={0.3}>
              <div className="an-address-box">
                <p className="an-eyebrow" style={{ marginBottom: "0.5rem" }}>Nous trouver</p>
                <p className="an-address-text">{ADDRESS}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="an-btn-outline"
                >
                  Ouvrir dans Google Maps
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* CTA */}
        <section className="an-section-pad" style={{ 
          background: "var(--an-black)",
          borderTop: "1px solid var(--an-border)",
          textAlign: "center"
        }}>
          <FadeIn>
            <p className="an-eyebrow">Besoin d'infos ?</p>
            <span className="an-gold-rule" />
            <h2 className="an-display" style={{ 
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)", 
              maxWidth: "600px", 
              margin: "0 auto 1.5rem" 
            }}>
              Contactez-nous
            </h2>
            <p className="an-serif-body" style={{ maxWidth: "480px", margin: "0 auto 2.5rem" }}>
              Une question sur une promotion ? Besoin de plus d'infos ? Notre équipe est là pour vous.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
              <button className="an-btn-gold" onClick={() => navigate("/contact")}>
                Nous contacter
              </button>
              <a href={`tel:${PHONE}`} className="an-btn-outline">
                {PHONE}
              </a>
            </div>
          </FadeIn>
        </section>

      </div>
      <Footer />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default AnnouncementPage;