import React, { Suspense, lazy, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ErrorBoundary } from "react-error-boundary";
import { motion, useInView, useReducedMotion } from "framer-motion";

const Header = lazy(() => import("../components/Header"));
const Footer = lazy(() => import("../components/Footer"));

const ADDRESS = "462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7, Canada";
const PHONE = "514-778-8318";
const MAP_QUERY = "462 4e Rue de la Pointe Shawinigan QC G9N 1G7";

const HOURS = [
  { day: "Lundi", hours: "Fermé" },
  { day: "Mardi - Vendredi", hours: "9h00 - 19h00" },
  { day: "Samedi", hours: "9h00 - 17h00" },
  { day: "Dimanche", hours: "Fermé" },
];

/* ─── Inject styles once ──────────────────────────────────────── */
const useInjectStyles = () => {
  useEffect(() => {
    const styleId = "mr-renaudin-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      :root {
        --black:    #0e1015;
        --charcoal: #161b24;
        --card:     #1e2535;
        --border:   #2a3348;
        --gold:     #d4a843;
        --gold-lt:  #f0c96a;
        --gold-dim: rgba(212,168,67,0.13);
        --copper:   #8ba8c8;
        --cream:    #eef2f7;
        --muted:    #7888a0;
        --light:    #b8c8da;
        --white:    #eef2f7;
        --steel:    #8ba8c8;
      }

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      body {
        background: var(--black);
        color: var(--cream);
        font-family: 'DM Sans', sans-serif;
        -webkit-font-smoothing: antialiased;
      }

      body::before {
        content: '';
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9999;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
        opacity: 0.035;
      }

      .gold-rule {
        display: block;
        width: 60px;
        height: 2px;
        background: var(--gold);
        margin: 0 auto 1.5rem;
      }

      .section-pad { padding: 7rem 1.5rem; }
      @media (max-width: 768px) {
        .section-pad { padding: 5rem 1.25rem; }
      }

      .eyebrow {
        font-family: 'DM Sans', sans-serif;
        font-size: 0.68rem;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: var(--gold);
        margin-bottom: 1rem;
      }

      .display {
        font-family: 'Playfair Display', Georgia, serif;
        font-weight: 900;
        line-height: 1.05;
        color: var(--cream);
      }

      .serif-body {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-weight: 300;
        font-size: 1.25rem;
        line-height: 1.85;
        color: var(--light);
      }
      @media (max-width: 768px) {
        .serif-body { font-size: 1.15rem; }
      }

      .btn-gold, .btn-outline {
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
      .btn-gold {
        background: var(--gold);
        color: var(--black);
      }
      .btn-gold:hover, .btn-gold:focus-visible { 
        background: var(--gold-lt); 
        transform: translateY(-2px);
        outline: 2px solid var(--gold-lt);
        outline-offset: 2px;
      }
      .btn-outline {
        background: transparent;
        color: var(--cream);
        border: 1px solid rgba(184,200,218,0.3);
      }
      .btn-outline:hover, .btn-outline:focus-visible { 
        border-color: var(--gold); 
        color: var(--gold); 
        transform: translateY(-2px);
        outline: 2px solid var(--gold);
        outline-offset: 2px;
      }

      .feature-card {
        background: var(--card);
        border: 1px solid var(--border);
        padding: 2.5rem 2rem;
        position: relative;
        overflow: hidden;
        transition: border-color 0.35s, transform 0.35s, background 0.35s;
        will-change: transform;
      }
      .feature-card::before {
        content: '';
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 2px;
        background: linear-gradient(90deg, var(--steel), var(--gold-lt));
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.4s ease;
      }
      .feature-card:hover { border-color: var(--gold); transform: translateY(-6px); background: #222e42; }
      .feature-card:hover::before { transform: scaleX(1); }

      .feature-icon {
        font-size: 1.5rem;
        margin-bottom: 1.25rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        background: var(--gold-dim);
        border: 1px solid rgba(212,168,67,0.25);
      }

      .feature-card h3 {
        font-family: 'Playfair Display', serif;
        font-size: 1.2rem;
        font-weight: 700;
        margin-bottom: 0.6rem;
        color: var(--cream);
        letter-spacing: 0.01em;
      }

      .feature-card p {
        font-size: 0.92rem;
        color: var(--light);
        line-height: 1.7;
      }

      .testimonial-card {
        background: var(--card);
        border: 1px solid var(--border);
        padding: 2.5rem 2rem;
      }
      .testimonial-card p {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.15rem;
        font-style: italic;
        color: var(--cream);
        line-height: 1.8;
        margin-bottom: 1.25rem;
      }
      .testimonial-card span {
        font-size: 0.75rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--gold);
      }

      .map-wrap {
        border: 1px solid var(--border);
        overflow: hidden;
      }

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
        color: var(--light);
        margin-top: 0.4rem;
      }

      .why-us-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 3rem;
        align-items: center;
      }
      @media (min-width: 900px) {
        .why-us-grid {
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
        }
      }

      .hours-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 1rem;
      }
      .hours-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
        color: var(--light);
        padding: 0.4rem 0;
        border-bottom: 1px solid var(--border);
      }
      .hours-row:last-child { border-bottom: none; }

      .mobile-sticky-cta {
        position: fixed;
        bottom: 1rem;
        left: 1rem;
        right: 1rem;
        z-index: 50;
        display: none;
      }
      @media (max-width: 768px) {
        .mobile-sticky-cta { display: block; }
      }

      @media (max-width: 768px) {
        .display { font-size: clamp(2.5rem, 10vw, 5rem); }
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

/* ─── Error fallback ──────────────────────────────────────────── */
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div style={{ padding: "2rem", background: "#1a0000", color: "#ff6b", borderRadius: "8px", margin: "2rem" }}>
    <p style={{ fontWeight: "bold" }}>Une erreur est survenue :</p>
    <pre style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>{error.message}</pre>
    <button onClick={resetErrorBoundary} className="btn-gold" style={{ marginTop: "1rem" }}>
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

/* ─── Data ────────────────────────────────────────────────────── */
const SERVICES = [
  { icon: "◉", title: "Boule à Zéro", desc: "Rasage total de la tête pour un rendu net, propre et assumé. La définition même de la précision." },
  { icon: "▬", title: "Flat Top", desc: "La coiffure iconique à sommet plat — une silhouette architecturale qui impose le respect." },
  { icon: "⟁", title: "Dreadlocks", desc: "Création et entretien de locks authentiques, façonnées avec soin pour un style naturel et affirmé." },
  { icon: "◎", title: "Mini Afro", desc: "Un afro compact et bien défini — volume maîtrisé, texture valorisée, style impeccable." },
  { icon: "❋", title: "Afro Naturelle", desc: "La pleine expression de votre texture naturelle, façonnée et volumisée par des mains expertes." },
  { icon: "≋", title: "Nattes & Tresses Collées", desc: "Tressage serré et précis, plaqué au crâne pour un rendu soigné, durable et élégant." },
  { icon: "✂", title: "Coupe Ultra Courte Classique", desc: "La coupe intemporelle — courte, nette, professionnelle. Une valeur sûre pour chaque occasion." },
  { icon: "◌", title: "Courte Dégradée", desc: "Longueur légèrement conservée sur le dessus avec un dégradé subtil sur les côtés et la nuque." },
  { icon: "▽", title: "Fade (Dégradé)", desc: "Notre spécialité absolue — dégradé de la peau vers la longueur, avec des transitions parfaitement fondues." },
  { icon: "◈", title: "Afro Taper", desc: "Volume afro préservé sur le dessus, effilé avec précision sur les côtés pour un rendu moderne et structuré." },
  { icon: "〜", title: "Waves 360", desc: "Technique de brossage et compression pour créer des waves uniformes sur tout le crâne — un chef-d'œuvre de texture." },
];

const TESTIMONIALS = [
  { quote: "Le meilleur fade que j'aie jamais eu. L'attention aux détails est incomparable — je n'irai nulle part ailleurs.", author: "Marc-André T." },
  { quote: "Professionnel, précis, et l'ambiance est exceptionnelle. On se sent vraiment dans un vrai barbershop haut de gamme.", author: "Dominic R." },
  { quote: "Ils ont pris le temps de comprendre exactement ce que je voulais. Je suis reparti avec un look au-dessus de mes attentes.", author: "Kevin L." },
];

/* ─── Page ────────────────────────────────────────────────────── */
const HomePage = () => {
  const navigate = useNavigate();
  useInjectStyles();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    "name": "Mr. Renaudin Barbershop",
    "image": "/Photos/rasage12.jpeg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "462 4e Rue de la Pointe",
      "addressLocality": "Shawinigan",
      "addressRegion": "QC",
      "postalCode": "G9N 1G7",
      "addressCountry": "CA"
    },
    "telephone": PHONE,
    "url": typeof window !== "undefined" ? window.location.origin : "",
    "priceRange": "$$",
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "09:00", "closes": "19:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "09:00", "closes": "17:00" }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Mr. Renaudin Barbershop | Barbier Premium — Shawinigan, QC</title>
        <meta name="description" content="Mr. Renaudin Barbershop — le barbershop premium de Shawinigan. Fades experts, coupes classiques, sculpture de barbe et rasage traditionnel. Prenez rendez-vous." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={null}>
          <Header />
        </Suspense>
      </ErrorBoundary>

      {/* ══════════════════════════════ HERO ══════════════════════════════════════════════ */}
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/Photos/rasage12.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
          }}
          role="img"
          aria-label="Intérieur du barbershop Mr. Renaudin"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(14,16,21,0.97) 0%, rgba(14,16,21,0.6) 50%, rgba(14,16,21,0.22) 100%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "900px" }}>
          <motion.p
            className="eyebrow"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Établi à Shawinigan, Québec
          </motion.p>

          <motion.h1
            className="display"
            style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", color: "var(--cream)" }}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
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
              color: "rgba(238,242,247,0.8)",
              marginTop: "1.25rem",
              maxWidth: "520px",
              lineHeight: 1.6,
            }}
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Là où la précision rencontre la tradition. Une expérience de toilettage premium, pensée pour l'homme moderne.
          </motion.p>

          <motion.div
            style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2.5rem" }}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <button className="btn-gold" onClick={() => navigate("/booking")} aria-label="Prendre rendez-vous en ligne">
              Prendre rendez-vous
            </button>
            <a href={`tel:${PHONE}`} className="btn-outline" aria-label={`Appeler le ${PHONE}`}>
              Nous appeler
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              aria-label="Obtenir l'itinéraire vers le barbershop"
            >
              Itinéraire
            </a>
          </motion.div>
        </div>

        {!shouldReduceMotion && (
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
        )}
      </section>

      {/* ══════════════════════════════════════════════ STATS ══════════════════════════════════════════════ */}
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
            { n: "11", label: "Services signature" },
            { n: "100%", label: "Axé satisfaction" },
          ].map(({ n, label }, i) => (
            <FadeIn key={label} delay={i * 0.1}>
              <div className="stat-number">{n}</div>
              <div className="stat-label">{label}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════ ABOUT ══════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background: "var(--black)", textAlign: "center" }}>
        <FadeIn>
          <p className="eyebrow">Notre philosophie</p>
          <span className="gold-rule" />
          <h2 className="display" style={{ fontSize: "clamp(2.2rem, 5vw, 3.75rem)", maxWidth: "700px", margin: "0 auto 2rem" }}>
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

      {/* ══════════════════════════════════════════════ SERVICES ══════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background: "var(--charcoal)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <p className="eyebrow">Ce que nous offrons</p>
              <span className="gold-rule" />
              <h2 className="display" style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}>
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
                  <div className="feature-icon" style={{ color: "var(--gold)" }} aria-hidden="true">{icon}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
              <button className="btn-gold" onClick={() => navigate("/booking")} aria-label="Réserver votre place maintenant">
                Réserver votre place
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════ WHY US ══════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background: "var(--black)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }} className="why-us-grid">
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
                alt="Intérieur du barbershop Mr. Renaudin avec fauteuil et outils professionnels"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
                loading="lazy"
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "2rem",
                  background: "linear-gradient(to top, rgba(14,16,21,0.92), transparent)",
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
              <div style={{ position: "absolute", top: "1.25rem", right: "1.25rem", width: "40px", height: "40px", border: "2px solid var(--gold)" }} />
              <div style={{ position: "absolute", bottom: "1.25rem", left: "1.25rem", width: "40px", height: "40px", border: "2px solid var(--gold)" }} />
            </div>
          </FadeIn>

          <FadeIn delay={1}>
            <p className="eyebrow">Pourquoi nous choisir</p>
            <span className="gold-rule" style={{ margin: "0 0 1.5rem" }} />
            <h2 className="display" style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.9rem)", marginBottom: "1.75rem", lineHeight: 1.1 }}>
              Le standard d'un barbershop de luxe, ici même à Shawinigan.
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                { title: "Précision constante", body: "Chaque visite offre la même qualité irréprochable. Aucune approximation — juste une excellence fiable et répétable." },
                { title: "Service personnalisé", body: "Nous écoutons d'abord. La forme de votre visage, votre mode de vie et vos préférences guident chacune de nos décisions." },
                { title: "Atmosphère premium", body: "Un environnement propre et professionnel qui respecte votre temps et élève l'ensemble de l'expérience." },
              ].map(({ title, body }) => (
                <div key={title} style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--gold)", marginTop: "0.15rem", flexShrink: 0 }} aria-hidden="true">✦</span>
                  <div>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.35rem", color: "var(--cream)" }}>
                      {title}
                    </h4>
                    <p style={{ fontSize: "0.92rem", color: "var(--light)", lineHeight: 1.7 }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════ TESTIMONIALS ══════════════════════════════════════════════ */}
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {TESTIMONIALS.map(({ quote, author }, i) => (
              <FadeIn key={author} delay={i * 0.1}>
                <div className="testimonial-card">
                  <p style={{ marginBottom: "1.25rem" }}>"{quote}"</p>
                  <div className="ornament" aria-hidden="true">✦</div>
                  <span>— {author}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════ LOCATION + HOURS ══════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background: "var(--black)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p className="eyebrow">Nous trouver</p>
              <span className="gold-rule" />
              <h2 className="display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "0.75rem" }}>
                Visitez notre boutique
              </h2>
              <p style={{ color: "var(--light)", fontSize: "0.92rem", letterSpacing: "0.05em" }}>{ADDRESS}</p>
              <p style={{ color: "var(--gold)", fontWeight: 500, marginTop: "0.35rem", fontSize: "0.95rem" }}>
                <a href={`tel:${PHONE}`} style={{ color: "inherit", textDecoration: "none" }} aria-label={`Appeler ${PHONE}`}>{PHONE}</a>
              </p>
            </div>
          </FadeIn>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
            <FadeIn delay={0.3}>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", marginBottom: "1rem", color: "var(--cream)" }}>
                  Heures d'ouverture
                </h3>
                <div className="hours-list">
                  {HOURS.map(({ day, hours }) => (
                    <div key={day} className="hours-row">
                      <span>{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
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
                  aria-label="Ouvrir dans Google Maps"
                >
                  Ouvrir dans Google Maps
                </a>
                            </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════ FINAL CTA ══════════════════════════════════════════════ */}
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
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(5rem, 18vw, 16rem)",
            fontWeight: 900,
            color: "rgba(212,168,67,0.04)",
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
            <button className="btn-gold" onClick={() => navigate("/booking")} aria-label="Prendre rendez-vous maintenant">
              Prendre rendez-vous
            </button>
            <a href={`tel:${PHONE}`} className="btn-outline" aria-label={`Appeler ${PHONE}`}>
              {PHONE}
            </a>
          </div>
        </FadeIn>
      </section>

      {/* Mobile sticky CTA */}
      <div className="mobile-sticky-cta">
        <button 
          className="btn-gold" 
          style={{ width: "100%", justifyContent: "center" }}
          onClick={() => navigate("/booking")}
          aria-label="Prendre rendez-vous"
        >
          Prendre rendez-vous
        </button>
      </div>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default HomePage;