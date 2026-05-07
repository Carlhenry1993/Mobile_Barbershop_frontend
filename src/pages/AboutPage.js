import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
// ❌ SUPPRIMÉ: import Header from "../components/Header";
// ❌ SUPPRIMÉ: import Footer from "../components/Footer";

const ADDRESS = "462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7, Canada";
const PHONE = "514-778-8318";
const MAP_QUERY = "462 4e Rue de la Pointe Shawinigan QC G9N 1G7";

const VALUES = [
  {
    title: "Excellence Artisanale",
    desc: "Chaque coupe est exécutée avec une précision chirurgicale. Pas de compromis sur la qualité — juste des résultats qui parlent d’eux-mêmes.",
    icon: "✦",
  },
  {
    title: "Expérience Premium",
    desc: "Fauteuils en cuir, serviettes chaudes, produits Redken & American Crew. Un moment pour vous, dans une ambiance pensée pour l’homme moderne.",
    icon: "◆",
  },
  {
    title: "Savoir-Faire Authentique",
    desc: "Nos barbiers maîtrisent autant les techniques classiques que les tendances actuelles. 10+ ans d’expérience au service de votre style.",
    icon: "❖",
  },
];

const TEAM = [
  {
    name: "Renaudin",
    role: "Fondateur & Maître Barbier",
    img: "/Photos/barbier1.jpg",
    bio: "Passionné par l’art du grooming depuis 2014. Spécialiste du fade et des textures afro.",
  },
  {
    name: "Marc",
    role: "Barbier Expert",
    img: "/Photos/barbier2.jpg",
    bio: "Précision et créativité. Expert en coupes classiques et dégradés modernes.",
  },
];

const useAboutStyles = () => {
  useEffect(() => {
    const styleId = "mr-renaudin-about-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
   .ab-root {
        --ab-black: #0e1015;
        --ab-charcoal: #161b24;
        --ab-card: #1e2535;
        --ab-border: #2a3348;
        --ab-gold: #d4a843;
        --ab-gold-lt: #f0c96a;
        --ab-gold-dim: rgba(212,168,67,0.13);
        --ab-steel: #8ba8c8;
        --ab-cream: #eef2f7;
        --ab-light: #b8c8da;
        --ab-muted: #7888a0;

        background: var(--ab-black);
        color: var(--ab-cream);
        font-family: 'DM Sans', sans-serif;
        -webkit-font-smoothing: antialiased;
      }

   .ab-root::before {
        content: '';
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
        opacity: 0.035;
      }

   .ab-inner { position: relative; z-index: 1; }

   .ab-eyebrow {
        font-family: 'DM Sans', sans-serif;
        font-size: 0.68rem;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: var(--ab-gold);
        margin-bottom: 1rem;
      }

   .ab-display {
        font-family: 'Playfair Display', Georgia, serif;
        font-weight: 900;
        line-height: 1.05;
        color: var(--ab-cream);
      }

   .ab-serif-body {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-weight: 300;
        font-size: 1.25rem;
        line-height: 1.85;
        color: var(--ab-light);
      }
      @media (max-width: 768px) {
   .ab-serif-body { font-size: 1.15rem; }
      }

   .ab-gold-rule {
        display: block;
        width: 60px;
        height: 2px;
        background: var(--ab-gold);
        margin: 0 auto 1.5rem;
      }

   .ab-section-pad { padding: 7rem 1.5rem; }
      @media (max-width: 768px) {
   .ab-section-pad { padding: 5rem 1.25rem; }
      }

   .ab-btn-gold, .ab-btn-outline {
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
   .ab-btn-gold {
        background: var(--ab-gold);
        color: var(--ab-black);
      }
   .ab-btn-gold:hover, .ab-btn-gold:focus-visible { 
        background: var(--ab-gold-lt); 
        transform: translateY(-2px);
        outline: 2px solid var(--ab-gold-lt);
        outline-offset: 2px;
      }
   .ab-btn-outline {
        background: transparent;
        color: var(--ab-cream);
        border: 1px solid rgba(184,200,218,0.3);
      }
   .ab-btn-outline:hover, .ab-btn-outline:focus-visible { 
        border-color: var(--ab-gold); 
        color: var(--ab-gold); 
        transform: translateY(-2px);
        outline: 2px solid var(--ab-gold);
        outline-offset: 2px;
      }

   .ab-hero {
        position: relative;
        min-height: 85svh;
        display: flex;
        align-items: flex-end;
        padding: 0 1.5rem 6rem;
        overflow: hidden;
      }

   .ab-hero-bg {
        position: absolute;
        inset: 0;
        background-image: url('/Photos/salon-hero.jpg');
        background-size: cover;
        background-position: center 30%;
      }
   .ab-hero-bg::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(14,16,21,0.97) 0%, rgba(14,16,21,0.6) 50%, rgba(14,16,21,0.22) 100%);
      }

   .ab-value-card {
        background: var(--ab-card);
        border: 1px solid var(--ab-border);
        padding: 2.5rem 2rem;
        position: relative;
        overflow: hidden;
        transition: border-color 0.35s, transform 0.35s, background 0.35s;
        will-change: transform;
        height: 100%;
      }
   .ab-value-card::before {
        content: '';
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 2px;
        background: linear-gradient(90deg, var(--ab-steel), var(--ab-gold-lt));
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.4s ease;
      }
   .ab-value-card:hover { 
        border-color: var(--ab-gold); 
        transform: translateY(-6px); 
        background: #222e42; 
      }
   .ab-value-card:hover::before { transform: scaleX(1); }

   .ab-value-icon {
        font-size: 1.5rem;
        margin-bottom: 1.25rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        background: var(--ab-gold-dim);
        border: 1px solid rgba(212,168,67,0.25);
        color: var(--ab-gold);
      }

   .ab-value-title {
        font-family: 'Playfair Display', serif;
        font-size: 1.2rem;
        font-weight: 700;
        margin-bottom: 0.6rem;
        color: var(--ab-cream);
        letter-spacing: 0.01em;
      }

   .ab-value-desc {
        font-size: 0.92rem;
        color: var(--ab-light);
        line-height: 1.7;
      }

   .ab-team-card {
        background: var(--ab-card);
        border: 1px solid var(--ab-border);
        overflow: hidden;
        transition: border-color 0.35s, transform 0.35s;
      }
   .ab-team-card:hover {
        border-color: var(--ab-gold);
        transform: translateY(-6px);
      }

   .ab-team-img-wrap {
        position: relative;
        width: 100%;
        aspect-ratio: 3/4;
        overflow: hidden;
        background: var(--ab-black);
      }
   .ab-team-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ease;
      }
   .ab-team-card:hover .ab-team-img {
        transform: scale(1.05);
      }

   .ab-team-body {
        padding: 1.75rem;
        text-align: center;
      }

   .ab-team-name {
        font-family: 'Playfair Display', serif;
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--ab-cream);
        margin-bottom: 0.25rem;
      }

   .ab-team-role {
        font-size: 0.75rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--ab-gold);
        margin-bottom: 0.75rem;
      }

   .ab-team-bio {
        font-size: 0.88rem;
        color: var(--ab-light);
        line-height: 1.7;
      }

   .ab-map-wrap {
        border: 1px solid var(--ab-border);
        overflow: hidden;
        margin-top: 2rem;
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

const AboutPage = () => {
  useAboutStyles();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="ab-root">
      <div className="ab-inner">
        
        {/* Hero */}
        <section className="ab-hero">
          <div className="ab-hero-bg" />
          <div className="relative z-10 max-w-4xl mx-auto" style={{ textAlign: 'left' }}>
            <motion.p
              className="ab-eyebrow"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Établi à Shawinigan depuis 2014
            </motion.p>

            <motion.h1
              className="ab-display"
              style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", marginBottom: "1.25rem" }}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              Plus qu'un barbershop.<br />
              <span style={{ color: "var(--ab-gold)" }}>Une institution.</span>
            </motion.h1>

            <motion.p
              className="ab-serif-body"
              style={{ maxWidth: "520px", marginBottom: "2.5rem" }}
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Chez Mr. Renaudin, chaque visite est un rituel. Fauteuils en cuir vintage, serviettes chaudes, 
              et l’expertise de barbiers passionnés au service de votre style.
            </motion.p>

            <motion.div
              style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              <button className="ab-btn-gold" onClick={() => navigate("/reserver")}>
                Prendre rendez-vous
              </button>
              <a href={`tel:${PHONE}`} className="ab-btn-outline">
                Nous appeler
              </a>
            </motion.div>
          </div>
        </section>

        {/* Notre Histoire */}
        <section className="ab-section-pad" style={{ background: "var(--ab-charcoal)", textAlign: "center" }}>
          <FadeIn>
            <p className="ab-eyebrow">Notre histoire</p>
            <span className="ab-gold-rule" />
            <h2 className="ab-display" style={{ fontSize: "clamp(2.2rem, 5vw, 3.75rem)", maxWidth: "700px", margin: "0 auto 2rem" }}>
              De la passion à la référence<br />en Mauricie
            </h2>
          </FadeIn>
          <FadeIn delay={1}>
            <p className="ab-serif-body" style={{ maxWidth: "720px", margin: "0 auto" }}>
              Tout a commencé en 2014 avec un rêve simple : ramener l’authenticité du barbershop classique à Shawinigan. 
              Un lieu où la qualité prime sur la quantité, où chaque client repart avec plus qu’une coupe — une expérience. 
              Aujourd’hui, Mr. Renaudin est devenu la référence pour les hommes qui refusent le compromis sur leur style. 
              Trois-Rivières, Grand-Mère, Saint-Boniface… ils viennent de partout en Mauricie pour l’expertise et l’ambiance.
            </p>
          </FadeIn>
        </section>

        {/* Nos Valeurs */}
        <section className="ab-section-pad" style={{ background: "var(--ab-black)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                <p className="ab-eyebrow">Ce qui nous définit</p>
                <span className="ab-gold-rule" />
                <h2 className="ab-display" style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}>
                  Nos Valeurs
                </h2>
              </div>
            </FadeIn>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}>
              {VALUES.map((value, i) => (
                <FadeIn key={value.title} delay={i * 0.1}>
                  <div className="ab-value-card">
                    <div className="ab-value-icon" aria-hidden="true">{value.icon}</div>
                    <h3 className="ab-value-title">{value.title}</h3>
                    <p className="ab-value-desc">{value.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Notre Équipe */}
        <section className="ab-section-pad" style={{ background: "var(--ab-charcoal)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                <p className="ab-eyebrow">Les artisans</p>
                <span className="ab-gold-rule" />
                <h2 className="ab-display" style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}>
                  Notre Équipe
                </h2>
              </div>
            </FadeIn>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
              maxWidth: "700px",
              margin: "0 auto"
            }}>
              {TEAM.map((member, i) => (
                <FadeIn key={member.name} delay={i * 0.1}>
                  <div className="ab-team-card">
                    <div className="ab-team-img-wrap">
                      <img 
                        src={member.img} 
                        alt={member.name}
                        className="ab-team-img"
                        loading="lazy"
                      />
                    </div>
                    <div className="ab-team-body">
                      <h3 className="ab-team-name">{member.name}</h3>
                      <p className="ab-team-role">{member.role}</p>
                      <p className="ab-team-bio">{member.bio}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Emplacement */}
        <section className="ab-section-pad" style={{ background: "var(--ab-black)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <p className="ab-eyebrow">Nous trouver</p>
                <span className="ab-gold-rule" />
                <h2 className="ab-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "1rem" }}>
                  Au cœur de Shawinigan
                </h2>
                <p className="ab-serif-body" style={{ maxWidth: "600px", margin: "0 auto" }}>
                  Situé au {ADDRESS}. Stationnement gratuit devant. 
                  On sert Shawinigan, Trois-Rivières, Grand-Mère et toute la Mauricie.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="ab-map-wrap">
                <iframe
                  title="Mr. Renaudin Barbershop Location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
                  width="100%"
                  height="440"
                  style={{ border: 0, display: "block", filter: "grayscale(30%) contrast(1.05)" }}
                  loading="lazy"
                />
              </div>

              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ab-btn-outline"
                >
                  Ouvrir dans Google Maps
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* CTA Final */}
        <section className="ab-section-pad" style={{ 
          background: "var(--ab-charcoal)",
          borderTop: "1px solid var(--ab-border)",
          textAlign: "center"
        }}>
          <FadeIn>
            <p className="ab-eyebrow">On vous attend</p>
            <span className="ab-gold-rule" />
            <h2 className="ab-display" style={{ 
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)", 
              maxWidth: "600px", 
              margin: "0 auto 1.5rem" 
            }}>
              Passez au salon
            </h2>
            <p className="ab-serif-body" style={{ maxWidth: "480px", margin: "0 auto 2.5rem" }}>
              Réservez en ligne ou passez nous voir. Walk-ins acceptés selon disponibilité. 
              Café offert, bonne ambiance garantie.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
              <button className="ab-btn-gold" onClick={() => navigate("/reserver")}>
                Prendre rendez-vous
              </button>
              <a href={`tel:${PHONE}`} className="ab-btn-outline">
                {PHONE}
              </a>
            </div>
          </FadeIn>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;