import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";

// ─── Constants ───────────────────────────────────────────────────────────────
const PHONE = "514-778-8318";
const MAP_QUERY = "462 4e Rue de la Pointe Shawinigan QC G9N 1G7";

const HOURS = [
  { day: "Lundi – Vendredi", hours: "11h00 – 19h00" },
  { day: "Samedi",           hours: "12h00 – 19h00" },
  { day: "Dimanche",         hours: "11h00 – 17h00" },
];

const SERVICES = [
  { num: "01", title: "Fade & Dégradé",           desc: "Notre spécialité absolue — transition parfaite de la peau vers la longueur, zéro compromis." },
  { num: "02", title: "Boule à Zéro",             desc: "Rasage total, rendu net et assumé. La définition de la précision à l'état pur." },
  { num: "03", title: "Flat Top",                  desc: "Silhouette architecturale iconique. Un design qui impose le respect." },
  { num: "04", title: "Dreadlocks",               desc: "Création et entretien de locks authentiques, façonnées avec soin et expertise." },
  { num: "05", title: "Mini Afro & Afro Naturelle",desc: "Volume maîtrisé ou pleine expression — texture valorisée par des mains expertes." },
  { num: "06", title: "Waves 360",                desc: "Brossage et compression pour des waves uniformes — un chef-d'œuvre de texture." },
  { num: "07", title: "Afro Taper",               desc: "Volume préservé en haut, effilé avec précision sur les côtés pour un rendu moderne." },
  { num: "08", title: "Nattes & Tresses",         desc: "Tressage serré et précis, plaqué au crâne — soigné, durable, élégant." },
  { num: "09", title: "Coupe Classique",          desc: "Courte, nette, professionnelle. La valeur sûre pour chaque occasion." },
];

const TESTIMONIALS = [
  { quote: "Le meilleur fade que j'aie jamais eu. L'attention aux détails est incomparable.", author: "Marc-André T.", since: "Client depuis 2019" },
  { quote: "Professionnel, précis. On se sent vraiment dans un établissement haut de gamme.", author: "Dominic R.",    since: "Client depuis 2021" },
  { quote: "Ils ont pris le temps de comprendre exactement ce que je voulais. Au-dessus de mes attentes.", author: "Kevin L.", since: "Client depuis 2020" },
];

// ─── Inject global styles ─────────────────────────────────────────────────────
const useInjectStyles = () => {
  useEffect(() => {
    const id = "mr-renaudin-2026";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;0,6..96,900;1,6..96,400;1,6..96,700&family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');

      :root {
        --ink:      #0c0d0f;
        --ink2:     #161820;
        --surface:  #181a20;
        --border:   rgba(212,168,67,0.14);
        --gold:     #d4a843;
        --gold-lt:  #f0c869;
        --gold-dim: rgba(212,168,67,0.08);
        --cream:    #f0ece2;
        --ash:      #8a90a0;
        --fog:      #b0b8c8;
        --white:    #f5f3ee;
      }

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      html { scroll-behavior: smooth; }

      body {
        background: var(--ink);
        color: var(--cream);
        font-family: 'Outfit', system-ui, sans-serif;
        font-weight: 300;
        -webkit-font-smoothing: antialiased;
      }

      /* Film grain overlay */
      body::after {
        content: '';
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9999;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E");
        opacity: 0.028;
        mix-blend-mode: overlay;
      }

      /* Scrollbar */
      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-track { background: var(--ink); }
      ::-webkit-scrollbar-thumb { background: var(--gold); }

      /* Typography helpers */
      .t-display {
        font-family: 'Bodoni Moda', Georgia, serif;
        line-height: 0.95;
        letter-spacing: -0.02em;
        color: var(--cream);
      }
      .t-mono {
        font-family: 'DM Mono', monospace;
        font-weight: 300;
        letter-spacing: 0.12em;
        font-size: 0.7rem;
        text-transform: uppercase;
        color: var(--gold);
      }
      .t-body {
        font-family: 'Outfit', sans-serif;
        font-weight: 300;
        line-height: 1.85;
        color: var(--fog);
        font-size: 1.05rem;
      }
      .t-caption {
        font-family: 'Outfit', sans-serif;
        font-weight: 400;
        font-size: 0.78rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--ash);
      }

      /* Gold rule */
      .rule {
        display: block;
        width: 1px;
        height: 60px;
        background: var(--gold);
        margin: 0 auto;
        opacity: 0.7;
      }
      .rule-h {
        display: block;
        width: 40px;
        height: 1px;
        background: var(--gold);
        opacity: 0.7;
      }

      /* Section wrapper */
      .wrap { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }

      /* Buttons */
      .btn-primary {
        display: inline-flex; align-items: center; gap: 0.75rem;
        font-family: 'DM Mono', monospace;
        font-size: 0.72rem; font-weight: 500;
        letter-spacing: 0.2em; text-transform: uppercase;
        padding: 1.1rem 2.4rem;
        background: var(--gold); color: var(--ink);
        border: none; cursor: pointer;
        transition: background 0.25s, transform 0.2s;
        text-decoration: none;
        clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
        will-change: transform;
      }
      .btn-primary:hover { background: var(--gold-lt); transform: translateY(-2px); }

      .btn-ghost {
        display: inline-flex; align-items: center; gap: 0.75rem;
        font-family: 'DM Mono', monospace;
        font-size: 0.72rem; font-weight: 500;
        letter-spacing: 0.2em; text-transform: uppercase;
        padding: 1.1rem 2.4rem;
        background: transparent; color: var(--cream);
        border: 1px solid rgba(240,236,226,0.2); cursor: pointer;
        transition: border-color 0.25s, color 0.25s, transform 0.2s;
        text-decoration: none;
        will-change: transform;
      }
      .btn-ghost:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-2px); }

      /* Service row */
      .service-row {
        display: grid;
        grid-template-columns: 36px 1fr;
        align-items: start;
        gap: 1rem;
        padding: 1.4rem 0;
        border-bottom: 1px solid var(--border);
        transition: background 0.25s, padding 0.25s;
      }
      .service-row:first-child { border-top: 1px solid var(--border); }
      .service-arrow { display: none; }
      @media (min-width: 640px) {
        .service-row { grid-template-columns: 64px 1fr auto; gap: 2rem; padding: 2rem 0; }
        .service-arrow { display: block; }
        .service-row:hover { background: var(--gold-dim); padding-left: 1rem; padding-right: 1rem; margin: 0 -1rem; border-radius: 2px; }
      }

      /* Hours table */
      .hours-row {
        display: flex; justify-content: space-between; align-items: center;
        padding: 0.85rem 0;
        border-bottom: 1px solid var(--border);
        font-size: 0.85rem;
        gap: 0.75rem;
      }
      .hours-row:last-child { border-bottom: none; }

      /* Testimonial card */
      .testi-card {
        background: var(--surface);
        border: 1px solid var(--border);
        padding: 1.75rem;
        position: relative;
        overflow: hidden;
        transition: border-color 0.35s;
      }
      @media (min-width: 640px) { .testi-card { padding: 2.5rem; } }
      .testi-card::before {
        content: '"';
        position: absolute; top: -0.5rem; left: 1.5rem;
        font-family: 'Bodoni Moda', serif;
        font-size: 9rem; line-height: 1;
        color: var(--gold); opacity: 0.08;
        pointer-events: none;
      }
      .testi-card:hover { border-color: rgba(212,168,67,0.4); }

      /* Stat item */
      .stat-val {
        font-family: 'Bodoni Moda', serif;
        font-size: clamp(2.4rem, 8vw, 4.5rem);
        font-weight: 700;
        color: var(--gold);
        line-height: 1;
        letter-spacing: -0.03em;
      }

      /* Mobile sticky CTA */
      .sticky-mobile {
        position: fixed; bottom: 1.25rem; left: 1.25rem; right: 1.25rem;
        z-index: 100; display: none;
      }
      @media (max-width: 768px) { .sticky-mobile { display: block; } }

      /* Grid helpers — mobile-first */
      .grid-2 { display: grid; grid-template-columns: 1fr; gap: 3rem; }
      .grid-3 { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
      @media (min-width: 680px)  { .grid-3 { grid-template-columns: repeat(3, 1fr); gap: 1.5rem; } }
      @media (min-width: 900px)  { .grid-2 { grid-template-columns: 1fr 1fr; gap: 5rem; } }

      /* Section spacing — mobile-first */
      .sect { padding: 4.5rem 1.25rem; }
      @media (min-width: 640px)  { .sect { padding: 7rem 2rem; } }
      @media (min-width: 1024px) { .sect { padding: 10rem 2rem; } }

      /* Wrapper padding */
      .wrap { max-width: 1280px; margin: 0 auto; padding: 0 1.25rem; }
      @media (min-width: 640px) { .wrap { padding: 0 2rem; } }

      /* Buttons — stack full-width on tiny phones */
      @media (max-width: 420px) {
        .hero-ctas { flex-direction: column; }
        .hero-ctas .btn-primary,
        .hero-ctas .btn-ghost { width: 100%; justify-content: center; }
      }

      /* Hero ghost text — only on wide screens */
      @media (min-width: 900px) { .hero-ghost-text { display: block !important; } }

      /* Hero CTA row — stack on tiny phones */
      .hero-ctas { display: flex; flex-wrap: wrap; gap: 1rem; }
      @media (max-width: 420px) {
        .hero-ctas { flex-direction: column; }
        .hero-ctas > * { width: 100%; justify-content: center; }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);
};

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show:   (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.85, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const FadeIn = ({ children, delay = 0, className = "", style = {} }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} style={style}>{children}</div>;
  return (
    <motion.div ref={ref} className={className} style={style}
      initial="hidden" animate={inView ? "show" : "hidden"}
      custom={delay} variants={fadeUp}>
      {children}
    </motion.div>
  );
};

// ─── HomePage ─────────────────────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();
  useInjectStyles();
  const reduce = useReducedMotion();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    "name": "Mr. Renaudin Barbershop",
    "address": { "@type": "PostalAddress", "streetAddress": "462 4e Rue de la Pointe", "addressLocality": "Shawinigan", "addressRegion": "QC", "postalCode": "G9N 1G7", "addressCountry": "CA" },
    "telephone": PHONE,
    "url": typeof window !== "undefined" ? window.location.origin : "",
    "priceRange": "$$",
  };

  return (
    <>
      <Helmet>
        <title>Mr. Renaudin Barbershop | Barbier Premium — Shawinigan, QC</title>
        <meta name="description" content="Mr. Renaudin Barbershop — le barbershop premium de Shawinigan. Fades experts, coupes classiques, sculpture de barbe. Réservez en ligne." />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* ══════════════════════════════════════════ HERO ══════════════════ */}
      <section
        ref={heroRef}
        style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}
        aria-label="Accueil Mr. Renaudin Barbershop"
      >
        {/* Parallax photo */}
        <motion.div
          style={{
            position: "absolute", inset: "-10% 0",
            backgroundImage: "url('/Photos/rasage12.jpeg')",
            backgroundSize: "cover", backgroundPosition: "center 25%",
            y: reduce ? 0 : heroY,
          }}
          role="img"
          aria-label="Intérieur du barbershop Mr. Renaudin"
        />

        {/* Gradient overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(12,13,15,0.92) 0%, rgba(12,13,15,0.55) 60%, rgba(12,13,15,0.2) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,13,15,1) 0%, transparent 45%)" }} />

        {/* Vertical "BARBER" ghost text — hidden on mobile to prevent overflow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", right: "3rem", top: "50%",
            transform: "translateY(-50%) rotate(90deg)",
            fontFamily: "'Bodoni Moda', serif",
            fontSize: "clamp(4rem, 8vw, 7rem)",
            fontWeight: 900, letterSpacing: "0.5em",
            color: "rgba(212,168,67,0.06)",
            userSelect: "none", whiteSpace: "nowrap",
            display: "none",
          }}
          className="hero-ghost-text"
        >
          BARBERSHOP
        </div>

        {/* Main copy */}
        <motion.div
          style={{ position: "relative", zIndex: 10, padding: "0 1.25rem 5rem", maxWidth: "860px", opacity: reduce ? 1 : heroOpacity, width: "100%" }}
        >
          {/* Eyebrow */}
          <motion.div
            style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}
            initial={reduce ? {} : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="rule-h" />
            <span className="t-mono">Établi à Shawinigan · Québec</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="t-display"
            style={{ fontSize: "clamp(4rem, 9vw, 8.5rem)", marginBottom: "0.15em" }}
            initial={reduce ? {} : { opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            Mr.<br />
            <span style={{ fontStyle: "italic", color: "var(--gold)" }}>Renaudin</span>
          </motion.h1>

          <motion.div
            style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2.5rem" }}
            initial={reduce ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
          >
            <span style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", color: "var(--fog)", fontWeight: 400, letterSpacing: "0.05em" }}>
              Barbershop
            </span>
            <span className="rule-h" style={{ flex: 1, maxWidth: "80px" }} />
          </motion.div>

          <motion.p
            style={{ maxWidth: "460px", fontFamily: "'Outfit', sans-serif", fontWeight: 300, fontSize: "1.1rem", lineHeight: 1.8, color: "var(--fog)", marginBottom: "3rem" }}
            initial={reduce ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Là où la précision rencontre la tradition. Une expérience de toilettage pensée pour l'homme qui ne fait aucun compromis.
          </motion.p>

          <motion.div
            style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
            className="hero-ctas"
            initial={reduce ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
          >
            <button className="btn-primary" onClick={() => navigate("/reserver")} aria-label="Prendre rendez-vous en ligne">
              Prendre rendez-vous
              <span aria-hidden="true">→</span>
            </button>
            <a href={`tel:${PHONE}`} className="btn-ghost" aria-label={`Appeler ${PHONE}`}>
              {PHONE}
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        {!reduce && (
          <motion.div
            style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", zIndex: 10 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <span className="t-mono" style={{ fontSize: "0.6rem" }}>Scroll</span>
            <motion.div
              style={{ width: 1, height: 50, background: "var(--gold)", transformOrigin: "top" }}
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </section>

      {/* ═════════════════════════════════════════ STATS ══════════════════ */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "4rem 1.25rem" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "2rem", textAlign: "center" }}>
            {[
              { val: "10+",  label: "Années d'expertise" },
              { val: "5 ★",  label: "Note clientèle" },
              { val: "9",    label: "Services signature" },
              { val: "100%", label: "Satisfaction garantie" },
            ].map(({ val, label }, i) => (
              <FadeIn key={label} delay={i * 0.08}>
                <div className="stat-val">{val}</div>
                <div className="t-caption" style={{ marginTop: "0.75rem" }}>{label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ MANIFESTE ══════════════════ */}
      <section id="about" className="sect" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <FadeIn>
              <div>
                <p className="t-mono" style={{ marginBottom: "2rem" }}>Notre philosophie</p>
                <h2
                  className="t-display"
                  style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", marginBottom: "2.5rem" }}
                >
                  Plus qu'une coupe.<br />
                  <span style={{ fontStyle: "italic", color: "var(--gold)" }}>Une identité.</span>
                </h2>
                <p className="t-body" style={{ maxWidth: "640px", marginBottom: "2rem" }}>
                  Chez Mr. Renaudin Barbershop, chaque rendez-vous est un rituel réfléchi. Nous croyons qu'un excellent soin est le fondement de la confiance — et la confiance ouvre toutes les portes.
                </p>
                <p className="t-body" style={{ maxWidth: "640px" }}>
                  Nos barbiers maîtrisent autant les techniques modernes que l'artisanat classique, pour des résultats dignes des meilleurs établissements de Montréal, Toronto et au-delà.
                </p>
              </div>
            </FadeIn>

            {/* Why us — horizontal strips */}
            <div style={{ marginTop: "4rem", display: "flex", flexDirection: "column" }}>
              {[
                { n: "I",   title: "Précision constante",   body: "Chaque visite offre la même qualité irréprochable. Aucune approximation." },
                { n: "II",  title: "Service personnalisé",  body: "La forme de votre visage, votre mode de vie et vos préférences guident chaque décision." },
                { n: "III", title: "Atmosphère premium",    body: "Un environnement propre et professionnel qui respecte votre temps." },
              ].map(({ n, title, body }, i) => (
                <FadeIn key={n} delay={i * 0.12}>
                  <div style={{
                    display: "flex", gap: "1.5rem", alignItems: "flex-start",
                    padding: "1.75rem 0",
                    borderBottom: "1px solid var(--border)",
                  }}>
                    <span style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "0.9rem", color: "var(--gold)", opacity: 0.6, paddingTop: "0.2rem", flexShrink: 0, minWidth: "28px" }}>{n}</span>
                    <div>
                      <h3 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "clamp(1.05rem, 3vw, 1.35rem)", color: "var(--cream)", marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>{title}</h3>
                      <p style={{ fontSize: "0.88rem", color: "var(--fog)", lineHeight: 1.75 }}>{body}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ SERVICES ════════════════ */}
      <section id="services" className="sect" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <div className="wrap">
          <FadeIn>
            <div style={{ marginBottom: "3rem" }}>
              <p className="t-mono" style={{ marginBottom: "1rem" }}>Ce que nous offrons</p>
              <h2 className="t-display" style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}>
                Nos<br /><span style={{ fontStyle: "italic", color: "var(--gold)" }}>Services</span>
              </h2>
            </div>
          </FadeIn>

          <div>
            {SERVICES.map(({ num, title, desc }, i) => (
              <FadeIn key={num} delay={i * 0.05}>
                <div className="service-row">
                  <span className="t-mono" style={{ paddingTop: "0.1rem" }}>{num}</span>
                  <div>
                    <h3 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "1.25rem", color: "var(--cream)", marginBottom: "0.4rem", letterSpacing: "-0.01em" }}>
                      {title}
                    </h3>
                    <p style={{ fontSize: "0.9rem", color: "var(--fog)", lineHeight: 1.7, maxWidth: "480px" }}>{desc}</p>
                  </div>
                  <span className="service-arrow" style={{ color: "var(--gold)", fontSize: "1.2rem", paddingTop: "0.2rem", flexShrink: 0 }} aria-hidden="true">→</span>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.2}>
            <div style={{ marginTop: "3rem" }}>
              <button className="btn-primary" onClick={() => navigate("/reserver")} aria-label="Réserver votre coupe">
                Réserver votre place →
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════ PHOTO BREAK (Editorial) ══════ */}
      <section
        style={{
          position: "relative",
          height: "50vh",
          minHeight: "280px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-hidden="true"
      >
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/Photos/rasage12.jpeg')",
          backgroundSize: "cover", backgroundPosition: "center 40%",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(12,13,15,0.6)" }} />

        {/* Centered editorial pull-quote */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 2rem" }}>
          <p style={{
            fontFamily: "'Bodoni Moda', serif",
            fontSize: "clamp(1.5rem, 4vw, 3.2rem)",
            fontStyle: "italic",
            fontWeight: 400,
            color: "var(--cream)",
            lineHeight: 1.4,
            maxWidth: "750px",
            margin: "0 auto",
          }}>
            "Chaque détail est intentionnel.<br />Chaque coupe est une affirmation."
          </p>
          <span className="rule-h" style={{ margin: "1.5rem auto 0", display: "block" }} />
        </div>

        {/* Corner marks */}
        {["top-right", "bottom-left"].map((corner) => (
          <div key={corner} style={{
            position: "absolute",
            top: corner.startsWith("top") ? "1.5rem" : "auto",
            bottom: corner.startsWith("bottom") ? "1.5rem" : "auto",
            left: corner.endsWith("left") ? "1.5rem" : "auto",
            right: corner.endsWith("right") ? "1.5rem" : "auto",
            width: "36px", height: "36px",
            borderTop: corner.startsWith("top") ? "1px solid var(--gold)" : "none",
            borderBottom: corner.startsWith("bottom") ? "1px solid var(--gold)" : "none",
            borderRight: corner.endsWith("right") ? "1px solid var(--gold)" : "none",
            borderLeft: corner.endsWith("left") ? "1px solid var(--gold)" : "none",
            opacity: 0.6,
          }} aria-hidden="true" />
        ))}
      </section>

      {/* ════════════════════════════════════ TÉMOIGNAGES ═════════════════ */}
      <section id="temoignages" className="sect" style={{ background: "var(--ink)", borderTop: "1px solid var(--border)" }}>
        <div className="wrap">
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "5rem" }}>
              <p className="t-mono" style={{ marginBottom: "1rem" }}>Témoignages clients</p>
              <h2 className="t-display" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
                Ce que disent<br /><span style={{ fontStyle: "italic", color: "var(--gold)" }}>nos clients</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid-3">
            {TESTIMONIALS.map(({ quote, author, since }, i) => (
              <FadeIn key={author} delay={i * 0.1}>
                <div className="testi-card">
                  <p style={{
                    fontFamily: "'Bodoni Moda', serif",
                    fontSize: "1.1rem", fontStyle: "italic",
                    color: "var(--cream)", lineHeight: 1.75,
                    marginBottom: "2rem", position: "relative", zIndex: 1,
                  }}>
                    {quote}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span className="rule-h" />
                    <div>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: "0.85rem", color: "var(--cream)" }}>{author}</p>
                      <p className="t-caption" style={{ marginTop: "0.2rem" }}>{since}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ LOCALISATION ════════════════ */}
      <section id="contact" className="sect" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <div className="wrap">
          <FadeIn>
            <div style={{ marginBottom: "5rem" }}>
              <p className="t-mono" style={{ marginBottom: "1rem" }}>Nous trouver</p>
              <h2 className="t-display" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
                Visitez<br /><span style={{ fontStyle: "italic", color: "var(--gold)" }}>notre barbershop</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid-2" style={{ gap: "5rem", alignItems: "start" }}>
            {/* Info column */}
            <FadeIn delay={0.1}>
              <div>
                {/* Address block */}
                <div style={{ marginBottom: "3rem", paddingLeft: "1.25rem", borderLeft: "1px solid var(--gold)" }}>
                  <p className="t-caption" style={{ marginBottom: "0.75rem" }}>Adresse</p>
                  <p style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "1.15rem", color: "var(--cream)", lineHeight: 1.6 }}>
                    462 4e Rue de la Pointe<br />Shawinigan, QC G9N 1G7
                  </p>
                </div>

                {/* Phone block */}
                <div style={{ marginBottom: "3.5rem", paddingLeft: "1.25rem", borderLeft: "1px solid var(--border)" }}>
                  <p className="t-caption" style={{ marginBottom: "0.75rem" }}>Téléphone</p>
                  <a href={`tel:${PHONE}`} style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "1.15rem", color: "var(--gold)", textDecoration: "none", letterSpacing: "0.02em" }}>
                    {PHONE}
                  </a>
                </div>

                {/* Hours */}
                <div>
                  <p className="t-caption" style={{ marginBottom: "1rem" }}>Heures d'ouverture</p>
                  {HOURS.map(({ day, hours }) => (
                    <div key={day} className="hours-row">
                      <span style={{ fontSize: "0.9rem", color: "var(--fog)" }}>{day}</span>
                      <span style={{ fontSize: "0.9rem", color: "var(--cream)", fontWeight: 500 }}>{hours}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "2.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <button className="btn-primary" onClick={() => navigate("/reserver")} aria-label="Réserver en ligne">
                    Réserver maintenant →
                  </button>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-ghost"
                    aria-label="Ouvrir l'itinéraire dans Google Maps"
                  >
                    Itinéraire
                  </a>
                </div>
              </div>
            </FadeIn>

            {/* Map */}
            <FadeIn delay={0.25}>
              <div style={{ border: "1px solid var(--border)", overflow: "hidden" }}>
                <iframe
                  title="Mr. Renaudin Barbershop — Carte"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
                  width="100%" height="420"
                  style={{ display: "block", border: 0, filter: "grayscale(60%) contrast(1.1) brightness(0.85)" }}
                  loading="lazy"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ CTA ══════════════════ */}
      <section
        style={{
          position: "relative",
          padding: "6rem 1.25rem",
          background: "var(--ink)",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Giant ghost word */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Bodoni Moda', serif",
          fontSize: "clamp(6rem, 22vw, 20rem)",
          fontWeight: 900,
          color: "rgba(212,168,67,0.035)",
          letterSpacing: "-0.04em",
          userSelect: "none", pointerEvents: "none",
          lineHeight: 1,
        }}>
          BARBER
        </div>

        <FadeIn>
          <div style={{ position: "relative", zIndex: 2 }}>
            <p className="t-mono" style={{ marginBottom: "1.5rem" }}>Prêt pour votre transformation ?</p>
            <span className="rule" style={{ height: "50px", marginBottom: "2.5rem" }} />
            <h2
              className="t-display"
              style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)", marginBottom: "1.5rem", maxWidth: "700px", margin: "0 auto 1.5rem" }}
            >
              Votre meilleur look<br />
              <span style={{ fontStyle: "italic", color: "var(--gold)" }}>commence ici.</span>
            </h2>
            <p className="t-body" style={{ maxWidth: "440px", margin: "0 auto 3.5rem" }}>
              Réservez en ligne ou appelez-nous directement — nous sommes prêts à vous offrir une coupe dont vous vous souviendrez.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", justifyContent: "center" }}>
              <button className="btn-primary" onClick={() => navigate("/reserver")} aria-label="Prendre rendez-vous maintenant">
                Prendre rendez-vous
                <span aria-hidden="true">→</span>
              </button>
              <a href={`tel:${PHONE}`} className="btn-ghost" aria-label={`Appeler le ${PHONE}`}>
                {PHONE}
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Mobile sticky CTA */}
      <div className="sticky-mobile">
        <button
          className="btn-primary"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={() => navigate("/reserver")}
          aria-label="Prendre rendez-vous"
        >
          Prendre rendez-vous →
        </button>
      </div>
    </>
  );
};

export default HomePage;