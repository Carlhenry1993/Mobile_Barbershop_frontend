import React, { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion";
// ❌ SUPPRIMÉ: import Header from "../components/Header";
// ❌ SUPPRIMÉ: import Footer from "../components/Footer";
import { toast } from 'react-toastify';
// ToastContainer retiré — géré globalement dans App.js

const ADDRESS = "462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7, Canada";
const PHONE = "514-778-8318";
const EMAIL = "mrrenaudinbarber@gmail.com";
const MAP_QUERY = "462 4e Rue de la Pointe Shawinigan QC G9N 1G7";
const CONTACT_ENDPOINT = process.env.REACT_APP_CONTACT_ENDPOINT || "https://mobile-barbershop-backend.onrender.com/api/contact";

const useContactStyles = () => {
  useEffect(() => {
    const styleId = "mr-renaudin-contact-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
  .ct-root {
        --ct-black: #0e1015;
        --ct-charcoal: #161b24;
        --ct-card: #1e2535;
        --ct-border: #2a3348;
        --ct-gold: #d4a843;
        --ct-gold-lt: #f0c96a;
        --ct-gold-dim: rgba(212,168,67,0.13);
        --ct-steel: #8ba8c8;
        --ct-cream: #eef2f7;
        --ct-light: #b8c8da;
        --ct-muted: #7888a0;
        --ct-danger: #e74c3c;
        --ct-success: #27ae60;

        background: var(--ct-black);
        color: var(--ct-cream);
        font-family: 'DM Sans', sans-serif;
        -webkit-font-smoothing: antialiased;
        min-height: 100svh;
        display: flex;
        flex-direction: column;
      }

  .ct-root::before {
        content: '';
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
        opacity: 0.035;
      }

  .ct-inner { position: relative; z-index: 1; flex: 1; }

  .ct-eyebrow {
        font-family: 'DM Sans', sans-serif;
        font-size: 0.68rem;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: var(--ct-gold);
        margin-bottom: 1rem;
      }

  .ct-display {
        font-family: 'Playfair Display', Georgia, serif;
        font-weight: 900;
        line-height: 1.05;
        color: var(--ct-cream);
      }

  .ct-serif-body {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-weight: 300;
        font-size: 1.25rem;
        line-height: 1.85;
        color: var(--ct-light);
      }
      @media (max-width: 768px) {
  .ct-serif-body { font-size: 1.15rem; }
      }

  .ct-gold-rule {
        display: block;
        width: 60px;
        height: 2px;
        background: var(--ct-gold);
        margin: 0 auto 1.5rem;
      }

  .ct-section-pad { padding: 7rem 1.5rem; }
      @media (max-width: 768px) {
  .ct-section-pad { padding: 5rem 1.25rem; }
      }

  .ct-btn-gold, .ct-btn-outline {
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
  .ct-btn-gold {
        background: var(--ct-gold);
        color: var(--ct-black);
      }
  .ct-btn-gold:hover, .ct-btn-gold:focus-visible { 
        background: var(--ct-gold-lt); 
        transform: translateY(-2px);
        outline: 2px solid var(--ct-gold-lt);
        outline-offset: 2px;
      }
  .ct-btn-gold:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
  .ct-btn-outline {
        background: transparent;
        color: var(--ct-cream);
        border: 1px solid rgba(184,200,218,0.3);
      }
  .ct-btn-outline:hover, .ct-btn-outline:focus-visible { 
        border-color: var(--ct-gold); 
        color: var(--ct-gold); 
        transform: translateY(-2px);
        outline: 2px solid var(--ct-gold);
        outline-offset: 2px;
      }

  .ct-hero {
        position: relative;
        min-height: 70svh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        overflow: hidden;
        padding: 0 1.5rem;
        background: var(--ct-charcoal);
      }

  .ct-hero::after {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 50% 30%, rgba(212,168,67,0.08) 0%, transparent 60%);
      }

  .ct-card {
        background: var(--ct-card);
        border: 1px solid var(--ct-border);
        padding: 2.5rem 2rem;
        height: 100%;
      }

  .ct-input, .ct-textarea {
        width: 100%;
        background: var(--ct-black);
        border: 1px solid var(--ct-border);
        color: var(--ct-cream);
        font-family: 'DM Sans', sans-serif;
        font-size: 0.95rem;
        padding: 1rem 1.25rem;
        transition: border-color 0.3s, background 0.3s;
      }
  .ct-input::placeholder, .ct-textarea::placeholder {
        color: var(--ct-muted);
      }
  .ct-input:focus, .ct-textarea:focus {
        outline: none;
        border-color: var(--ct-gold);
        background: #1a2332;
      }
  .ct-textarea {
        resize: vertical;
        min-height: 120px;
      }

  .ct-label {
        display: block;
        font-size: 0.8rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--ct-gold);
        margin-bottom: 0.5rem;
        font-weight: 500;
      }

  .ct-error {
        color: var(--ct-danger);
        font-size: 0.8rem;
        margin-top: 0.5rem;
      }

  .ct-contact-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1.75rem;
      }

  .ct-contact-icon {
        font-size: 1.5rem;
        color: var(--ct-gold);
        margin-top: 0.2rem;
        flex-shrink: 0;
      }

  .ct-contact-link {
        color: var(--ct-light);
        text-decoration: none;
        transition: color 0.2s;
      }
  .ct-contact-link:hover {
        color: var(--ct-gold);
      }

  .ct-success-box {
        background: rgba(39,174,96,0.1);
        border: 1px solid rgba(39,174,96,0.3);
        padding: 2rem;
        text-align: center;
      }

  .ct-success-title {
        font-family: 'Playfair Display', serif;
        font-size: 1.75rem;
        color: var(--ct-success);
        margin-bottom: 0.75rem;
      }

  .ct-map-wrap {
        border: 1px solid var(--ct-border);
        overflow: hidden;
        margin-top: 2rem;
        aspect-ratio: 16/9;
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
      animate={inView ? "show" : "hidden"}
      custom={delay}
      variants={fadeUp}
    >
      {children}
    </motion.div>
  );
};

const ContactPage = () => {
  useContactStyles();
  const shouldReduceMotion = useReducedMotion();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const onSubmit = async (data) => {
    setSubmissionError("");
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        setSubmitted(true);
        reset();
        toast.success("Message envoyé ! On vous répond vite.");
      } else {
        const errorData = await response.json();
        setSubmissionError(errorData.message || "Une erreur est survenue. Réessayez !");
        toast.error("Erreur lors de l'envoi");
      }
    } catch (error) {
      setSubmissionError("Erreur réseau : merci de réessayer dans quelques instants !");
      toast.error("Erreur réseau");
    }
  };

  return (
    <div className="ct-root">
      <div className="ct-inner">
        
        {/* Hero */}
        <section className="ct-hero">
          <div className="relative z-10 max-w-4xl mx-auto">
            <motion.p
              className="ct-eyebrow"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Parlons de votre style
            </motion.p>

            <motion.h1
              className="ct-display"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", marginBottom: "1.5rem" }}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              Contactez<br />
              <span style={{ color: "var(--ct-gold)" }}>Mr. Renaudin</span>
            </motion.h1>

            <motion.p
              className="ct-serif-body"
              style={{ maxWidth: "680px", margin: "0 auto 2.5rem" }}
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Une question, une demande speciale ou besoin de choisir le bon service ?
              Ecrivez-nous ou appelez le salon; on vous guide vers le rendez-vous qui correspond a votre style.
            </motion.p>
          </div>
        </section>

        {/* Main Content */}
        <section className="ct-section-pad" style={{ background: "var(--ct-charcoal)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "3rem",
            }}>
              
              {/* Coordonnées */}
              <FadeIn>
                <div className="ct-card">
                  <p className="ct-eyebrow">Nos coordonnées</p>
                  <span className="ct-gold-rule" style={{ margin: "0 0 2rem 0" }} />
                  <h2 className="ct-display" style={{ fontSize: "2rem", marginBottom: "2rem" }}>
                    Votre prochain style commence ici
                  </h2>
                  
                  <div className="ct-contact-item">
                    <span className="ct-contact-icon">📞</span>
                    <div>
                      <p className="ct-label">Téléphone</p>
                      <a href={`tel:${PHONE}`} className="ct-contact-link">
                        {PHONE}
                      </a>
                    </div>
                  </div>

                  <div className="ct-contact-item">
                    <span className="ct-contact-icon">✉️</span>
                    <div>
                      <p className="ct-label">Email</p>
                      <a href={`mailto:${EMAIL}`} className="ct-contact-link">
                        {EMAIL}
                      </a>
                    </div>
                  </div>

                  <div className="ct-contact-item">
                    <span className="ct-contact-icon">📍</span>
                    <div>
                      <p className="ct-label">Adresse</p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ct-contact-link"
                      >
                        {ADDRESS}
                      </a>
                    </div>
                  </div>

                  <div className="ct-contact-item">
                    <span className="ct-contact-icon">🕐</span>
                    <div>
                      <p className="ct-label">Horaires</p>
                      <p className="ct-contact-link" style={{ color: "var(--ct-light)" }}>
                        Lundi - Vendredi : 11h00 - 19h00<br />
                        Samedi : 12h00 - 19h00<br />
                        Dimanche : 11h00 - 17h00
                      </p>
                    </div>
                  </div>

                  <div className="ct-map-wrap">
                    <iframe
                      title="Mr. Renaudin Barbershop Location"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0, display: "block", filter: "grayscale(30%) contrast(1.05)" }}
                      loading="lazy"
                    />
                  </div>
                </div>
              </FadeIn>

              {/* Formulaire */}
              <FadeIn delay={0.15}>
                <div className="ct-card">
                  <p className="ct-eyebrow">Écrivez-nous</p>
                  <span className="ct-gold-rule" style={{ margin: "0 0 2rem 0" }} />
                  <h2 className="ct-display" style={{ fontSize: "2rem", marginBottom: "2rem" }}>
                    Envoyez votre demande
                  </h2>

                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div
                        key="success"
                        className="ct-success-box"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h3 className="ct-success-title">Message envoyé !</h3>
                        <p style={{ color: "var(--ct-light)", fontSize: "0.95rem" }}>
                          Merci de nous avoir contactes. Le salon vous repondra rapidement avec une attention claire et personnalisee.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {submissionError && (
                          <div style={{
                            background: "rgba(231,76,60,0.1)",
                            border: "1px solid rgba(231,76,60,0.3)",
                            color: "#ff8a7a",
                            padding: "1rem",
                            marginBottom: "1.5rem",
                            fontSize: "0.9rem"
                          }}>
                            {submissionError}
                          </div>
                        )}

                        <div style={{ marginBottom: "1.5rem" }}>
                          <label htmlFor="fullName" className="ct-label">
                            Nom complet
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            placeholder="Votre nom complet"
                            {...register("fullName", {
                              required: "Votre nom est requis"
                            })}
                            className="ct-input"
                          />
                          {errors.fullName && (
                            <p className="ct-error">{errors.fullName.message}</p>
                          )}
                        </div>

                        <div style={{ marginBottom: "1.5rem" }}>
                          <label htmlFor="email" className="ct-label">
                            Adresse e-mail
                          </label>
                          <input
                            type="email"
                            id="email"
                            placeholder="votre@email.com"
                            {...register("email", {
                              required: "Votre e-mail est requis",
                              pattern: {
                                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                message: "E-mail invalide"
                              }
                            })}
                            className="ct-input"
                          />
                          {errors.email && (
                            <p className="ct-error">{errors.email.message}</p>
                          )}
                        </div>

                        <div style={{ marginBottom: "1.5rem" }}>
                          <label htmlFor="message" className="ct-label">
                            Votre message
                          </label>
                          <textarea
                            id="message"
                            rows="5"
                            placeholder="Parlez-nous de votre projet capillaire..."
                            {...register("message", {
                              required: "Votre message est requis"
                            })}
                            className="ct-textarea"
                          />
                          {errors.message && (
                            <p className="ct-error">{errors.message.message}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="ct-btn-gold"
                          disabled={isSubmitting}
                          style={{ width: "100%" }}
                        >
                          {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="ct-section-pad" style={{ 
          background: "var(--ct-black)",
          borderTop: "1px solid var(--ct-border)",
          textAlign: "center"
        }}>
          <FadeIn>
            <p className="ct-eyebrow">Passez nous voir</p>
            <span className="ct-gold-rule" />
            <h2 className="ct-display" style={{ 
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)", 
              maxWidth: "600px", 
              margin: "0 auto 1.5rem" 
            }}>
              Walk-ins acceptés
            </h2>
            <p className="ct-serif-body" style={{ maxWidth: "480px", margin: "0 auto 2.5rem" }}>
              Pas de rendez-vous ? Passez directement au salon. Selon disponibilité, on vous prend en charge.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ct-btn-gold"
              >
                Voir sur Google Maps
              </a>
              <a href={`tel:${PHONE}`} className="ct-btn-outline">
                Appeler maintenant
              </a>
            </div>
          </FadeIn>
        </section>

      </div>
</div>
  );
};

export default ContactPage;
