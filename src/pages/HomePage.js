import React, { Suspense, lazy, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ErrorBoundary } from "react-error-boundary";
import { motion, useInView } from "framer-motion";

const Header = lazy(() => import("../components/Header"));
const Footer = lazy(() => import("../components/Footer"));

const ADDRESS = "462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7, Canada";
const PHONE = "514-778-8318";
const MAP_QUERY = "462 4e Rue de la Pointe Shawinigan QC G9N 1G7";

/* ─── Fonts injected once ─────────────────────────────────────── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');

    :root {
      --black:    #0a0a0a;
      --charcoal: #141414;
      --card:     #1a1a1a;
      --border:   #2a2a2a;
      --gold:     #c9a84c;
      --gold-lt:  #e8c87a;
      --cream:    #f5f0e8;
      --muted:    #8a8a8a;
      --white:    #ffffff;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--black);
      color: var(--white);
      font-family: 'DM Sans', sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    /* ── Grain overlay ── */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      opacity: 0.035;
    }

    /* ── Gold horizontal rule ── */
    .gold-rule {
      display: block;
      width: 60px;
      height: 2px;
      background: var(--gold);
      margin: 0 auto 1.5rem;
    }

    /* ── Section wrapper ── */
    .section-pad { padding: 7rem 1.5rem; }

    /* ── Eyebrow label ── */
    .eyebrow {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.68rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 1rem;
    }

    /* ── Display heading ── */
    .display {
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 900;
      line-height: 1.05;
    }

    /* ── Italic serif body ── */
    .serif-body {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-weight: 300;
      font-size: 1.2rem;
      line-height: 1.8;
      color: var(--muted);
    }

    /* ── CTA buttons ── */
    .btn-gold {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--gold);
      color: var(--black);
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 1rem 2rem;
      border: none;
      cursor: pointer;
      transition: background 0.3s, transform 0.2s;
      text-decoration: none;
    }
    .btn-gold:hover { background: var(--gold-lt); transform: translateY(-2px); }

    .btn-outline {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: transparent;
      color: var(--white);
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 1rem 2rem;
      border: 1px solid var(--border);
      cursor: pointer;
      transition: border-color 0.3s, color 0.3s, transform 0.2s;
      text-decoration: none;
    }
    .btn-outline:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-2px); }

    /* ── Feature card ── */
    .feature-card {
      background: var(--card);
      border: 1px solid var(--border);
      padding: 2.5rem 2rem;
      position: relative;
      overflow: hidden;
      transition: border-color 0.35s, transform 0.35s;
    }
    .feature-card::before {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 2px;
      background: var(--gold);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.4s ease;
    }
    .feature-card:hover { border-color: var(--gold); transform: translateY(-6px); }
    .feature-card:hover::before { transform: scaleX(1); }

    .feature-icon {
      font-size: 2rem;
      margin-bottom: 1.25rem;
    }

    .feature-card h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.6rem;
      color: var(--white);
    }

    .feature-card p {
      font-size: 0.9rem;
      color: var(--muted);
      line-height: 1.6;
    }

    /* ── Testimonial card ── */
    .testimonial-card {
      background: var(--card);
      border: 1px solid var(--border);
      padding: 2.5rem 2rem;
    }
    .testimonial-card p {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.1rem;
      font-style: italic;
      color: var(--cream);
      line-height: 1.75;
      margin-bottom: 1.25rem;
    }
    .testimonial-card span {
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--gold);
    }

    /* ── Map container ── */
    .map-wrap {
      border: 1px solid var(--border);
      overflow: hidden;
    }

    /* ── Divider ornament ── */
    .ornament {
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
      margin: 0.5rem 0 2rem;
      color: var(--gold);
      font-size: 1.1rem;
    }
    .ornament::before,
    .ornament::after {
      content: '';
      flex: 1;
      max-width: 80px;
      height: 1px;
      background: var(--border);
    }

    /* ── Stat ── */
    .stat-number {
      font-family: 'Playfair Display', serif;
      font-size: 3.5rem;
      font-weight: 900;
      color: var(--gold);
      line-height: 1;
    }
    .stat-label {
      font-size: 0.78rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--muted);
      margin-top: 0.4rem;
    }

    @media (max-width: 768px) {
      .display { font-size: clamp(2.5rem, 10vw, 5rem); }
    }
  `}</style>
);

/* ─── Error fallback ──────────────────────────────────────────── */
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div style={{ padding: "2rem", background: "#1a0000", color: "#ff6b6b", borderRadius: "8px", margin: "2rem" }}>
    <p style={{ fontWeight: "bold" }}>Une erreur est survenue :</p>
    <pre style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>{error.message}</pre>
    <button onClick={resetErrorBoundary} style={{ marginTop: "1rem", padding: "0.5rem 1.25rem", background: "#c9a84c", color: "#000", border: "none", cursor: "pointer" }}>
      Réessayer
    </button>
  </div>
);

/* ─── Animation helpers ───────────────────────────────────────── */
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

/* ─── Data ────────────────────────────────────────────────────── */
const SERVICES = [
  {
    icon: "✦",
    title: "Fade Signature",
    desc: "Dégradés précis de la peau jusqu'à la longueur voulue, avec des lignes nettes qui définissent votre silhouette.",
  },
  {
    icon: "✦",
    title: "Coupe Classique",
    desc: "Travail aux ciseaux intemporel, façonné selon votre visage, votre style de vie et votre esthétique personnelle.",
  },
  {
    icon: "✦",
    title: "Sculpture de Barbe",
    desc: "Contourage et finition experts pour une barbe propre, bien formée et pleinement assumée.",
  },
  {
    icon: "✦",
    title: "Rasage à la Serviette Chaude",
    desc: "Une expérience traditionnelle au rasoir droit avec serviettes chaudes, crème à raser et soin après-rasage.",
  },
  {
    icon: "✦",
    title: "Combo Cheveux & Barbe",
    desc: "Le traitement complet — coupe et barbe ensemble pour un look parfaitement soigné de la tête aux pieds.",
  },
  {
    icon: "✦",
    title: "Contour & Mise en Forme",
    desc: "Définition précise de la ligne de cheveux et galbe des tempes pour encadrer votre visage à la perfection.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Le meilleur fade que j'aie jamais eu. L'attention aux détails est incomparable — je n'irai nulle part ailleurs.",
    author: "Marc-André T.",
  },
  {
    quote: "Professionnel, précis, et l'ambiance est exceptionnelle. On se sent vraiment dans un vrai barbershop haut de gamme.",
    author: "Dominic R.",
  },
  {
    quote: "Ils ont pris le temps de comprendre exactement ce que je voulais. Je suis reparti avec un look au-dessus de mes attentes.",
    author: "Kevin L.",
  },
];

/* ─── Page ────────────────────────────────────────────────────── */
const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <FontLink />

      <Helmet>
        <title>Mr. Renaudin Barbershop | Barbier Premium — Shawinigan, QC</title>
        <meta
          name="description"
          content="Mr. Renaudin Barbershop — le barbershop premium de Shawinigan. Fades experts, coupes classiques, sculpture de barbe et rasage traditionnel au coupe-chou. Prenez rendez-vous dès aujourd'hui."
        />
      </Helmet>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={null}>
          <Header />
        </Suspense>
      </ErrorBoundary>

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100svh",
          display: "flex",
          alignItems: "flex-end",
          padding: "0 1.5rem 6rem",
          overflow: "hidden",
        }}
      >
        {/* Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/Photos/rasage12.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
          }}
        />
        {/* Gradient veil */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.55) 50%, rgba(10,10,10,0.25) 100%)",
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: "900px" }}>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Établi à Shawinigan, Québec
          </motion.p>

          <motion.h1
            className="display"
            style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", color: "var(--white)" }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            Mr. Renaudin<br />
            <span style={{ color: "var(--gold)" }}>Barbershop</span>
          </motion.h1>

          <motion.p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "1.3rem",
              color: "rgba(255,255,255,0.7)",
              marginTop: "1.25rem",
              maxWidth: "520px",
              lineHeight: 1.6,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Là où la précision rencontre la tradition. Une expérience de toilettage premium, pensée pour l'homme moderne.
          </motion.p>

          <motion.div
            style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2.5rem" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <button className="btn-gold" onClick={() => navigate("/booking")}>
              Prendre rendez-vous
            </button>
            <a href={`tel:${PHONE}`} className="btn-outline">
              Nous appeler
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Itinéraire
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          style={{
            position: "absolute",
            bottom: "2rem",
            right: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.4rem",
            zIndex: 10,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
            Scroll
          </span>
          <motion.div
            style={{ width: 1, height: 60, background: "var(--gold)", transformOrigin: "top" }}
            animate={{ scaleY: [1, 0.4, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--charcoal)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "4rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "3rem",
            textAlign: "center",
          }}
        >
          {[
            { n: "10+", label: "Années d'expérience" },
            { n: "5★", label: "Note clientèle" },
            { n: "6", label: "Services signature" },
            { n: "100%", label: "Axé satisfaction" },
          ].map(({ n, label }, i) => (
            <FadeIn key={label} delay={i * 0.1}>
              <div className="stat-number">{n}</div>
              <div className="stat-label">{label}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background: "var(--black)", textAlign: "center" }}>
        <FadeIn>
          <p className="eyebrow">Notre philosophie</p>
          <span className="gold-rule" />
          <h2
            className="display"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.75rem)", maxWidth: "700px", margin: "0 auto 2rem" }}
          >
            Plus qu'une coupe.<br />Une identité.
          </h2>
        </FadeIn>
        <FadeIn delay={1}>
          <p className="serif-body" style={{ maxWidth: "680px", margin: "0 auto" }}>
            Chez Mr. Renaudin Barbershop, chaque rendez-vous est un rituel réfléchi. Nous croyons qu'un 
            excellent soin de la personne est le fondement de la confiance — et la confiance ouvre toutes 
            les portes. Nos barbiers maîtrisent autant les techniques modernes que l'artisanat classique, 
            pour des résultats dignes des meilleurs établissements de Montréal, Toronto et au-delà.
          </p>
        </FadeIn>
      </section>

      {/* ══════════════════════════════════════════════
          SERVICES
      ══════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background: "var(--charcoal)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <p className="eyebrow">Ce que nous offrons</p>
              <span className="gold-rule" />
              <h2
                className="display"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}
              >
                Nos Services
              </h2>
            </div>
          </FadeIn>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {SERVICES.map(({ icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <div className="feature-card">
                  <div className="feature-icon" style={{ color: "var(--gold)" }}>{icon}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
              <button className="btn-gold" onClick={() => navigate("/booking")}>
                Réserver votre place
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WHY US
      ══════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background: "var(--black)" }}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "center",
          }}
        >
          {/* Left: image placeholder / accent block */}
          <FadeIn>
            <div
              style={{
                position: "relative",
                aspectRatio: "4/5",
                background: "var(--card)",
                border: "1px solid var(--border)",
                overflow: "hidden",
              }}
            >
              <img
                src="/Photos/rasage12.jpeg"
                alt="Barbershop interior"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
              />
              {/* Gold corner accent */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "2rem",
                  background: "linear-gradient(to top, rgba(10,10,10,0.9), transparent)",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: "1.1rem",
                    color: "var(--cream)",
                    lineHeight: 1.6,
                  }}
                >
                  "Chaque détail est intentionnel.<br />Chaque coupe est une affirmation."
                </p>
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "1.25rem",
                  right: "1.25rem",
                  width: "40px",
                  height: "40px",
                  border: "2px solid var(--gold)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "1.25rem",
                  left: "1.25rem",
                  width: "40px",
                  height: "40px",
                  border: "2px solid var(--gold)",
                }}
              />
            </div>
          </FadeIn>

          {/* Right: copy */}
          <FadeIn delay={1}>
            <p className="eyebrow">Pourquoi nous choisir</p>
            <span className="gold-rule" style={{ margin: "0 0 1.5rem" }} />
            <h2
              className="display"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.9rem)", marginBottom: "1.75rem", lineHeight: 1.1 }}
            >
              Le standard d'un barbershop de luxe, ici même à Shawinigan.
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                {
                  title: "Précision constante",
                  body: "Chaque visite offre la même qualité irréprochable. Aucune approximation — juste une excellence fiable et répétable.",
                },
                {
                  title: "Service personnalisé",
                  body: "Nous écoutons d'abord. La forme de votre visage, votre mode de vie et vos préférences guident chacune de nos décisions.",
                },
                {
                  title: "Atmosphère premium",
                  body: "Un environnement propre et professionnel qui respecte votre temps et élève l'ensemble de l'expérience.",
                },
              ].map(({ title, body }) => (
                <div key={title} style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--gold)", marginTop: "0.15rem", flexShrink: 0 }}>✦</span>
                  <div>
                    <h4
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        fontSize: "1.05rem",
                        marginBottom: "0.35rem",
                        color: "var(--white)",
                      }}
                    >
                      {title}
                    </h4>
                    <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.65 }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background: "var(--charcoal)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <p className="eyebrow">Témoignages clients</p>
              <span className="gold-rule" />
              <h2 className="display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                Ce que disent nos clients
              </h2>
            </div>
          </FadeIn>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {TESTIMONIALS.map(({ quote, author }, i) => (
              <FadeIn key={author} delay={i * 0.1}>
                <div className="testimonial-card">
                  <p style={{ marginBottom: "1.25rem" }}>"{quote}"</p>
                  <div className="ornament">✦</div>
                  <span>— {author}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          LOCATION
      ══════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background: "var(--black)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p className="eyebrow">Nous trouver</p>
              <span className="gold-rule" />
              <h2 className="display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "0.75rem" }}>
                Visitez notre boutique
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", letterSpacing: "0.05em" }}>{ADDRESS}</p>
              <p style={{ color: "var(--gold)", fontWeight: 500, marginTop: "0.35rem", fontSize: "0.95rem" }}>
                {PHONE}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="map-wrap" style={{ borderRadius: 0 }}>
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
                className="btn-outline"
              >
                Ouvrir dans Google Maps
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--charcoal)",
          borderTop: "1px solid var(--border)",
          padding: "8rem 1.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background text */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(5rem, 18vw, 16rem)",
            fontWeight: 900,
            color: "rgba(201,168,76,0.035)",
            userSelect: "none",
            letterSpacing: "-0.04em",
            pointerEvents: "none",
          }}
        >
          BARBER
        </div>

        <FadeIn>
          <p className="eyebrow">Prêt ?</p>
          <span className="gold-rule" />
          <h2
            className="display"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", maxWidth: "600px", margin: "0 auto 1.5rem" }}
          >
            Votre meilleur look commence ici.
          </h2>
          <p className="serif-body" style={{ maxWidth: "480px", margin: "0 auto 2.5rem" }}>
            Réservez votre rendez-vous en ligne ou appelez-nous directement — nous sommes prêts à vous offrir une coupe dont vous vous souviendrez.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            <button className="btn-gold" onClick={() => navigate("/booking")}>
              Prendre rendez-vous
            </button>
            <a href={`tel:${PHONE}`} className="btn-outline">
              {PHONE}
            </a>
          </div>
        </FadeIn>
      </section>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default HomePage;