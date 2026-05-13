import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────────
const PHONE      = "514-778-8318";
const MAP_QUERY  = "462 4e Rue de la Pointe Shawinigan QC G9N 1G7";
const PHOTO_MAIN = "/Photos/rasage12.jpeg";

const HOURS = [
  { day: "Lundi – Vendredi", hours: "11h – 19h" },
  { day: "Samedi",           hours: "12h – 19h" },
  { day: "Dimanche",         hours: "11h – 17h" },
];

const SERVICES = [
  { num: "01", title: "Fade & Dégradé",            desc: "Notre spécialité absolue — transition parfaite de la peau vers la longueur, zéro compromis." },
  { num: "02", title: "Boule à Zéro",              desc: "Rasage total, rendu net et assumé. La définition de la précision à l'état pur." },
  { num: "03", title: "Flat Top",                   desc: "Silhouette architecturale iconique. Un design qui impose le respect." },
  { num: "04", title: "Dreadlocks",                desc: "Création et entretien de locks authentiques, façonnées avec soin et expertise." },
  { num: "05", title: "Mini Afro & Afro Naturelle", desc: "Volume maîtrisé ou pleine expression — texture valorisée par des mains expertes." },
  { num: "06", title: "Waves 360",                 desc: "Brossage et compression pour des waves uniformes — un chef-d'œuvre de texture." },
  { num: "07", title: "Afro Taper",                desc: "Volume préservé en haut, effilé avec précision sur les côtés." },
  { num: "08", title: "Nattes & Tresses",          desc: "Tressage serré et précis, plaqué au crâne — soigné, durable, élégant." },
  { num: "09", title: "Coupe Classique",           desc: "Courte, nette, professionnelle. La valeur sûre pour chaque occasion." },
];

const TESTIMONIALS = [
  { quote: "Le meilleur fade que j'aie jamais eu. L'attention aux détails est incomparable.", author: "Marc-André T.", since: "Client depuis 2019" },
  { quote: "Professionnel, précis. On se sent vraiment dans un établissement haut de gamme.", author: "Dominic R.",    since: "Client depuis 2021" },
  { quote: "Ils ont pris le temps de comprendre exactement ce que je voulais. Au-dessus de mes attentes.", author: "Kevin L.", since: "Client depuis 2020" },
];

// ─── Global styles ────────────────────────────────────────────────────────────
const useInjectStyles = () => {
  useEffect(() => {
    const id = "mrr-2026";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;0,6..96,900;1,6..96,300;1,6..96,500&family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500&display=swap');

      :root {
        --ink:     #0a0b0e;
        --surface: #12141a;
        --card:    #181c24;
        --border:  rgba(212,168,67,0.12);
        --gold:    #d4a843;
        --gold-lt: #efc860;
        --gold-xd: rgba(212,168,67,0.06);
        --cream:   #ede8de;
        --fog:     #8e97aa;
        --mist:    #b8c0d0;
      }

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body {
        background: var(--ink);
        color: var(--cream);
        font-family: 'Outfit', system-ui, sans-serif;
        font-weight: 300;
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
      }

      body::after {
        content: '';
        position: fixed; inset: 0; pointer-events: none; z-index: 9999;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E");
        opacity: 0.025; mix-blend-mode: overlay;
      }

      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-track { background: var(--ink); }
      ::-webkit-scrollbar-thumb { background: var(--gold); }

      .t-display {
        font-family: 'Bodoni Moda', Georgia, serif;
        line-height: 0.93; letter-spacing: -0.025em; color: var(--cream);
      }
      .t-mono {
        font-family: 'DM Mono', monospace; font-weight: 300;
        letter-spacing: 0.15em; font-size: 0.68rem;
        text-transform: uppercase; color: var(--gold);
      }
      .t-body {
        font-family: 'Outfit', sans-serif; font-weight: 300;
        line-height: 1.9; color: var(--fog); font-size: 1rem;
      }
      .t-label {
        font-family: 'Outfit', sans-serif; font-weight: 400;
        font-size: 0.72rem; letter-spacing: 0.12em;
        text-transform: uppercase; color: var(--fog);
      }

      .rule-v { display: block; width: 1px; background: var(--gold); opacity: 0.5; }
      .rule-h { display: block; height: 1px; background: var(--gold); opacity: 0.5; }

      .btn {
        display: inline-flex; align-items: center; gap: 0.65rem;
        font-family: 'DM Mono', monospace;
        font-size: 0.68rem; font-weight: 500;
        letter-spacing: 0.22em; text-transform: uppercase;
        padding: 1rem 2.2rem; cursor: pointer; text-decoration: none;
        transition: background 0.22s, color 0.22s, border-color 0.22s, transform 0.18s;
        clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
      }
      .btn-gold  { background: var(--gold); color: var(--ink); border: none; }
      .btn-gold:hover  { background: var(--gold-lt); transform: translateY(-2px); }
      .btn-ghost { background: transparent; color: var(--cream); border: 1px solid rgba(237,232,222,0.18); }
      .btn-ghost:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-2px); }

      .wrap { max-width: 1320px; margin: 0 auto; padding: 0 2.5rem; }

      .svc-row {
        display: grid; grid-template-columns: 52px 1fr 28px;
        gap: 2rem; align-items: center;
        padding: 1.8rem 0; border-bottom: 1px solid var(--border);
        transition: all 0.22s; cursor: default;
      }
      .svc-row:first-child { border-top: 1px solid var(--border); }
      .svc-row:hover { background: var(--gold-xd); padding-left: 0.75rem; padding-right: 0.75rem; margin: 0 -0.75rem; }
      .svc-row:hover .svc-arrow { opacity: 1; transform: translateX(0); }
      .svc-arrow { opacity: 0; transform: translateX(-6px); transition: all 0.22s; color: var(--gold); font-size: 1rem; }

      .tcard {
        background: var(--card); border: 1px solid var(--border);
        padding: 2.5rem 2rem; position: relative; overflow: hidden;
        transition: border-color 0.3s, transform 0.3s;
      }
      .tcard:hover { border-color: rgba(212,168,67,0.35); transform: translateY(-4px); }
      .tcard::before {
        content: '\\201C'; position: absolute; top: -1rem; left: 1.5rem;
        font-family: 'Bodoni Moda', serif; font-size: 8rem; line-height: 1;
        color: var(--gold); opacity: 0.07; pointer-events: none;
      }

      .h-row {
        display: flex; justify-content: space-between; align-items: center;
        padding: 0.9rem 0; border-bottom: 1px solid var(--border);
        font-size: 0.88rem; gap: 1rem;
      }
      .h-row:last-child { border-bottom: none; }

      .stat-n {
        font-family: 'Bodoni Moda', serif;
        font-size: clamp(2.5rem, 4vw, 4rem);
        font-weight: 700; line-height: 1;
        color: var(--gold); letter-spacing: -0.03em;
      }

      .sticky-cta {
        position: fixed; bottom: 1.25rem; left: 1.25rem; right: 1.25rem;
        z-index: 200; display: none;
      }
      @media (max-width: 768px) { .sticky-cta { display: block; } }

      /* ── Responsive ── */
      @media (max-width: 1024px) {
        .wrap { padding: 0 1.75rem; }
        .hero-split { grid-template-columns: 1fr !important; }
        .hero-photo-col { display: none !important; }
        .about-split { grid-template-columns: 1fr !important; }
        .about-photo-col { min-height: 55vw !important; }
        .about-text-col { padding: 4rem 2rem !important; }
        .services-split { grid-template-columns: 1fr !important; }
        .services-photo-aside { display: none !important; }
        .services-list-col { padding: 5rem 1.75rem !important; }
        .contact-split { grid-template-columns: 1fr !important; }
        .contact-info-col { padding: 5rem 1.75rem !important; }
        .contact-map-col { min-height: 50vw !important; }
      }
      @media (max-width: 640px) {
        .wrap { padding: 0 1.25rem; }
        .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 2rem !important; padding: 3rem 1.25rem !important; }
        .grid-3 { grid-template-columns: 1fr !important; gap: 1.25rem !important; }
        .hero-ctas { flex-direction: column; }
        .hero-ctas > * { width: 100%; justify-content: center; }
        .svc-row { grid-template-columns: 40px 1fr; }
        .svc-arrow { display: none; }
        .testi-header { flex-direction: column !important; align-items: flex-start !important; gap: 1.5rem !important; }
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
      }
    `;
    document.head.appendChild(s);
    return () => { document.getElementById(id)?.remove(); };
  }, []);
};

// ─── FadeIn ───────────────────────────────────────────────────────────────────
const FadeIn = ({ children, delay = 0, y = 28, className = "", style = {} }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} style={style}>{children}</div>;
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
};

// ─── Section label ────────────────────────────────────────────────────────────
const Label = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
    <span className="rule-h" style={{ width: "28px" }} />
    <span className="t-mono">{children}</span>
  </div>
);

// ─── HomePage ─────────────────────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();
  const reduce   = useReducedMotion();
  useInjectStyles();

  const heroRef  = useRef(null);
  const { scrollYProgress: heroScroll }  = useScroll({ target: heroRef,  offset: ["start start", "end start"] });
  const heroPhotoY   = useTransform(heroScroll,  [0, 1], ["0%", "22%"]);
  const heroTextFade = useTransform(heroScroll,  [0, 0.6], [1, 0]);

  const aboutRef = useRef(null);
  const { scrollYProgress: aboutScroll } = useScroll({ target: aboutRef, offset: ["start end", "end start"] });
  const aboutPhotoY  = useTransform(aboutScroll, [0, 1], ["-8%", "8%"]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  const schema = {
    "@context": "https://schema.org", "@type": "BarberShop",
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

      {/* ══════════════════════════════════════════════════
          §1  HERO — Texte gauche · Photo droite
      ══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{ position: "relative", minHeight: "100svh", overflow: "hidden", background: "var(--ink)" }}
        aria-label="Mr. Renaudin Barbershop"
      >
        {/* Desktop split grid */}
        <div
          className="hero-split"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100svh", position: "relative", zIndex: 2 }}
        >
          {/* Copy */}
          <motion.div
            style={{
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              padding: "0 3rem 6rem 2.5rem",
              opacity: reduce ? 1 : heroTextFade,
            }}
          >
            <motion.div
              style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}
              initial={reduce ? {} : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <span className="rule-h" style={{ width: "28px" }} />
              <span className="t-mono">Établi à Shawinigan · Québec</span>
            </motion.div>

            <motion.h1
              className="t-display"
              style={{ fontSize: "clamp(4.5rem, 7.5vw, 9.5rem)", marginBottom: "0.25em" }}
              initial={reduce ? {} : { opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Mr.<br />
              <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Renaudin</em>
            </motion.h1>

            <motion.div
              style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" }}
              initial={reduce ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.65 }}
            >
              <span style={{
                fontFamily: "'Bodoni Moda', serif",
                fontSize: "clamp(1.6rem, 2.5vw, 2.8rem)",
                color: "var(--fog)", fontWeight: 400, letterSpacing: "0.06em",
              }}>Barbershop</span>
              <span className="rule-h" style={{ flex: 1, maxWidth: "64px" }} />
            </motion.div>

            <motion.p
              className="t-body"
              style={{ maxWidth: "380px", marginBottom: "3rem", fontSize: "1.05rem" }}
              initial={reduce ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Là où la précision rencontre la tradition. Une expérience de toilettage pensée pour l'homme qui ne fait aucun compromis.
            </motion.p>

            <motion.div
              className="hero-ctas"
              style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
              initial={reduce ? {} : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1 }}
            >
              <button className="btn btn-gold" onClick={() => navigate("/reserver")}>
                Prendre rendez-vous <span aria-hidden="true">→</span>
              </button>
              <a href={`tel:${PHONE}`} className="btn btn-ghost">{PHONE}</a>
            </motion.div>

            {/* Scroll cue */}
            {!reduce && (
              <motion.div
                style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
              >
                <span className="t-mono" style={{ fontSize: "0.55rem" }}>scroll</span>
                <motion.span className="rule-v" style={{ height: "50px" }}
                  animate={{ scaleY: [0.3, 1, 0.3] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            )}
          </motion.div>

          {/* Photo column */}
          <div
            className="hero-photo-col"
            style={{ position: "relative", overflow: "hidden" }}
            aria-hidden="true"
          >
            <motion.div
              style={{
                position: "absolute", inset: "-12% 0",
                backgroundImage: `url('${PHOTO_MAIN}')`,
                backgroundSize: "cover", backgroundPosition: "center 20%",
                y: reduce ? 0 : heroPhotoY,
              }}
            />
            {/* Left vignette */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,11,14,0.75) 0%, rgba(10,11,14,0.05) 45%)" }} />
            {/* Corner marks */}
            <div style={{ position: "absolute", top: "2rem", right: "2rem", width: "40px", height: "40px", borderTop: "1px solid rgba(212,168,67,0.45)", borderRight: "1px solid rgba(212,168,67,0.45)" }} />
            <div style={{ position: "absolute", bottom: "2rem", left: "2rem", width: "40px", height: "40px", borderBottom: "1px solid rgba(212,168,67,0.45)", borderLeft: "1px solid rgba(212,168,67,0.45)" }} />
            {/* Vertical text */}
            <div style={{ position: "absolute", right: "1.5rem", bottom: "3rem", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
              <span className="t-mono" style={{ fontSize: "0.58rem", opacity: 0.45, letterSpacing: "0.3em" }}>462 4e Rue de la Pointe · Shawinigan</span>
            </div>
          </div>
        </div>

        {/* Mobile bg photo (shown only when split is hidden) */}
        <div
          style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: `url('${PHOTO_MAIN}')`, backgroundSize: "cover", backgroundPosition: "center 20%" }}
          aria-hidden="true"
        />
        <div
          style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to top, rgba(10,11,14,0.97) 0%, rgba(10,11,14,0.6) 55%, rgba(10,11,14,0.25) 100%)" }}
          aria-hidden="true"
        />
        <style>{`
          @media (min-width: 1025px) {
            section > div[aria-hidden="true"] { display: none !important; }
          }
          @media (max-width: 1024px) {
            .hero-split > div:first-child { position: relative; z-index: 2; }
          }
        `}</style>
      </section>

      {/* ══════════════════════════════════════════════════
          §2  STATS
      ══════════════════════════════════════════════════ */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div
          className="stats-grid wrap"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "3rem", padding: "4rem 2.5rem", textAlign: "center" }}
        >
          {[
            { val: "10+",  label: "Années d'expertise" },
            { val: "5 ★",  label: "Note clientèle" },
            { val: "9",    label: "Services signature" },
            { val: "100%", label: "Satisfaction garantie" },
          ].map(({ val, label }, i) => (
            <FadeIn key={label} delay={i * 0.08}>
              <div className="stat-n">{val}</div>
              <div className="t-label" style={{ marginTop: "0.6rem" }}>{label}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          §3  À PROPOS — Photo gauche · Texte droite
      ══════════════════════════════════════════════════ */}
      <section id="about" ref={aboutRef} style={{ background: "var(--ink)" }}>
        <div
          className="about-split"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "88vh" }}
        >
          {/* Photo */}
          <div
            className="about-photo-col"
            style={{ position: "relative", overflow: "hidden", minHeight: "600px" }}
            aria-hidden="true"
          >
            <motion.div
              style={{
                position: "absolute", inset: "-10% 0",
                backgroundImage: `url('${PHOTO_MAIN}')`,
                backgroundSize: "cover", backgroundPosition: "center 30%",
                y: reduce ? 0 : aboutPhotoY,
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,11,14,0.08), rgba(10,11,14,0.55))" }} />
            {/* Floating glass stat */}
            <div style={{
              position: "absolute", bottom: "3rem", left: "2.5rem",
              background: "rgba(10,11,14,0.8)", backdropFilter: "blur(12px)",
              border: "1px solid var(--border)", padding: "1.5rem 2rem",
            }}>
              <div style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "2.8rem", fontWeight: 700, color: "var(--gold)", lineHeight: 1 }}>10+</div>
              <div className="t-label" style={{ marginTop: "0.4rem" }}>Années de maîtrise</div>
            </div>
          </div>

          {/* Text */}
          <div
            className="about-text-col"
            style={{ display: "flex", alignItems: "center", padding: "7rem 5rem" }}
          >
            <FadeIn delay={0.15}>
              <div>
                <Label>Notre philosophie</Label>
                <h2 className="t-display" style={{ fontSize: "clamp(2.5rem, 3.5vw, 4.5rem)", marginBottom: "2.5rem" }}>
                  Plus qu'une coupe.<br />
                  <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Une identité.</em>
                </h2>
                <p className="t-body" style={{ maxWidth: "480px", marginBottom: "1.75rem" }}>
                  Chez Mr. Renaudin Barbershop, chaque rendez-vous est un rituel réfléchi. Nous croyons qu'un excellent soin est le fondement de la confiance — et la confiance ouvre toutes les portes.
                </p>
                <p className="t-body" style={{ maxWidth: "480px", marginBottom: "3.5rem" }}>
                  Nos barbiers maîtrisent autant les techniques modernes que l'artisanat classique, pour des résultats dignes des meilleurs établissements de Montréal, Toronto et au-delà.
                </p>
                {[
                  { n: "I",   h: "Précision constante",  b: "Chaque visite offre la même qualité irréprochable. Zéro approximation." },
                  { n: "II",  h: "Service personnalisé", b: "Votre morphologie, vos préférences, votre lifestyle — chaque détail compte." },
                  { n: "III", h: "Atmosphère premium",   b: "Un environnement professionnel et chaleureux qui respecte votre temps." },
                ].map(({ n, h, b }) => (
                  <div key={n} style={{ display: "flex", gap: "1.5rem", padding: "1.4rem 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "0.82rem", color: "var(--gold)", opacity: 0.55, flexShrink: 0, minWidth: "22px", paddingTop: "0.15rem" }}>{n}</span>
                    <div>
                      <p style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "1rem", color: "var(--cream)", marginBottom: "0.3rem" }}>{h}</p>
                      <p style={{ fontSize: "0.86rem", color: "var(--fog)", lineHeight: 1.7 }}>{b}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          §4  SERVICES — Liste · Photo sticky droite
      ══════════════════════════════════════════════════ */}
      <section id="services" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <div
          className="services-split"
          style={{ display: "grid", gridTemplateColumns: "1fr 400px", maxWidth: "1320px", margin: "0 auto" }}
        >
          {/* List */}
          <div
            className="services-list-col"
            style={{ padding: "7rem 4rem 7rem 2.5rem" }}
          >
            <FadeIn>
              <Label>Ce que nous offrons</Label>
              <h2 className="t-display" style={{ fontSize: "clamp(2.5rem, 4vw, 4.5rem)", marginBottom: "4rem" }}>
                Nos<br /><em style={{ fontStyle: "italic", color: "var(--gold)" }}>Services</em>
              </h2>
            </FadeIn>

            <div>
              {SERVICES.map(({ num, title, desc }, i) => (
                <FadeIn key={num} delay={i * 0.04}>
                  <div className="svc-row">
                    <span className="t-mono" style={{ paddingTop: "0.1rem" }}>{num}</span>
                    <div>
                      <h3 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "1.15rem", color: "var(--cream)", marginBottom: "0.3rem", letterSpacing: "-0.01em" }}>{title}</h3>
                      <p style={{ fontSize: "0.875rem", color: "var(--fog)", lineHeight: 1.7 }}>{desc}</p>
                    </div>
                    <span className="svc-arrow" aria-hidden="true">→</span>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.2}>
              <div style={{ marginTop: "3rem" }}>
                <button className="btn btn-gold" onClick={() => navigate("/reserver")}>
                  Réserver votre place →
                </button>
              </div>
            </FadeIn>
          </div>

          {/* Sticky photo */}
          <div
            className="services-photo-aside"
            style={{ position: "relative", overflow: "hidden" }}
            aria-hidden="true"
          >
            <div style={{
              position: "sticky", top: 0, height: "100vh",
              backgroundImage: `url('${PHOTO_MAIN}')`,
              backgroundSize: "cover", backgroundPosition: "center 15%",
            }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(18,20,26,0.7) 0%, rgba(18,20,26,0.1) 60%)" }} />
              <div style={{
                position: "absolute", right: "1.5rem", top: "50%",
                transform: "translateY(-50%) rotate(90deg)",
                fontFamily: "'Bodoni Moda', serif", fontSize: "0.65rem",
                letterSpacing: "0.45em", color: "rgba(212,168,67,0.3)",
                textTransform: "uppercase", whiteSpace: "nowrap",
              }}>
                Mr. Renaudin · Shawinigan
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          §5  EDITORIAL BREAK — Full bleed photo
      ══════════════════════════════════════════════════ */}
      <section style={{ position: "relative", height: "65vh", minHeight: "420px", overflow: "hidden" }} aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${PHOTO_MAIN}')`, backgroundSize: "cover", backgroundPosition: "center 42%" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,11,14,0.55)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(212,168,67,0.4), transparent)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(212,168,67,0.25), transparent)" }} />

        <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 2rem" }}>
          <div style={{ textAlign: "center", maxWidth: "820px" }}>
            <span className="rule-v" style={{ height: "44px", margin: "0 auto 2.5rem", display: "block" }} />
            <p style={{
              fontFamily: "'Bodoni Moda', serif",
              fontSize: "clamp(1.6rem, 3.5vw, 3.2rem)",
              fontStyle: "italic", fontWeight: 400,
              color: "var(--cream)", lineHeight: 1.45,
            }}>
              "Chaque détail est intentionnel.<br />Chaque coupe est une affirmation."
            </p>
            <span className="rule-v" style={{ height: "44px", margin: "2.5rem auto 0", display: "block" }} />
          </div>
        </div>
        {/* Corner marks */}
        <div style={{ position: "absolute", top: "1.75rem", right: "1.75rem", width: "36px", height: "36px", borderTop: "1px solid rgba(212,168,67,0.45)", borderRight: "1px solid rgba(212,168,67,0.45)", opacity: 0.7 }} />
        <div style={{ position: "absolute", bottom: "1.75rem", left: "1.75rem", width: "36px", height: "36px", borderBottom: "1px solid rgba(212,168,67,0.45)", borderLeft: "1px solid rgba(212,168,67,0.45)", opacity: 0.7 }} />
      </section>

      {/* ══════════════════════════════════════════════════
          §6  TÉMOIGNAGES
      ══════════════════════════════════════════════════ */}
      <section id="temoignages" style={{ background: "var(--ink)", borderTop: "1px solid var(--border)", padding: "8rem 2.5rem" }}>
        <div className="wrap">
          <FadeIn>
            <div
              className="testi-header"
              style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem", marginBottom: "5rem" }}
            >
              <div>
                <Label>Ce qu'ils disent</Label>
                <h2 className="t-display" style={{ fontSize: "clamp(2.5rem, 4vw, 4.5rem)" }}>
                  Nos clients,<br /><em style={{ fontStyle: "italic", color: "var(--gold)" }}>nos ambassadeurs</em>
                </h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingBottom: "0.5rem" }}>
                <div style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "3rem", fontWeight: 700, color: "var(--gold)", lineHeight: 1 }}>5.0</div>
                <div>
                  <div style={{ color: "var(--gold)", fontSize: "0.85rem", letterSpacing: "0.05em" }}>★★★★★</div>
                  <div className="t-label" style={{ marginTop: "0.25rem" }}>Note Google</div>
                </div>
              </div>
            </div>
          </FadeIn>

          <div
            className="grid-3"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}
          >
            {TESTIMONIALS.map(({ quote, author, since }, i) => (
              <FadeIn key={author} delay={i * 0.1}>
                <div className="tcard">
                  <p style={{
                    fontFamily: "'Bodoni Moda', serif",
                    fontSize: "1.05rem", fontStyle: "italic",
                    color: "var(--cream)", lineHeight: 1.8,
                    marginBottom: "2rem", position: "relative", zIndex: 1,
                  }}>
                    {quote}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                    <span className="rule-h" style={{ width: "24px" }} />
                    <div>
                      <p style={{ fontWeight: 500, fontSize: "0.85rem", color: "var(--cream)" }}>{author}</p>
                      <p className="t-label" style={{ marginTop: "0.15rem", fontSize: "0.65rem" }}>{since}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          §7  CONTACT — Infos gauche · Carte droite
      ══════════════════════════════════════════════════ */}
      <section id="contact" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <div
          className="contact-split"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", maxWidth: "1320px", margin: "0 auto" }}
        >
          {/* Info */}
          <div
            className="contact-info-col"
            style={{ padding: "7rem 5rem 7rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}
          >
            <FadeIn>
              <Label>Nous trouver</Label>
              <h2 className="t-display" style={{ fontSize: "clamp(2.5rem, 3.5vw, 4rem)", marginBottom: "4rem" }}>
                Visitez<br /><em style={{ fontStyle: "italic", color: "var(--gold)" }}>notre barbershop</em>
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", marginBottom: "3.5rem" }}>
                <div style={{ paddingLeft: "1.5rem", borderLeft: "2px solid var(--gold)" }}>
                  <p className="t-label" style={{ marginBottom: "0.6rem" }}>Adresse</p>
                  <p style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "1.2rem", color: "var(--cream)", lineHeight: 1.55 }}>
                    462 4e Rue de la Pointe<br />Shawinigan, QC G9N 1G7
                  </p>
                </div>

                <div style={{ paddingLeft: "1.5rem", borderLeft: "1px solid var(--border)" }}>
                  <p className="t-label" style={{ marginBottom: "0.6rem" }}>Téléphone</p>
                  <a href={`tel:${PHONE}`} style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "1.2rem", color: "var(--gold)", textDecoration: "none", letterSpacing: "0.02em" }}>
                    {PHONE}
                  </a>
                </div>

                <div style={{ paddingLeft: "1.5rem", borderLeft: "1px solid var(--border)" }}>
                  <p className="t-label" style={{ marginBottom: "1rem" }}>Heures d'ouverture</p>
                  {HOURS.map(({ day, hours }) => (
                    <div key={day} className="h-row">
                      <span style={{ color: "var(--fog)" }}>{day}</span>
                      <span style={{ color: "var(--cream)", fontWeight: 500 }}>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button className="btn btn-gold" onClick={() => navigate("/reserver")}>
                  Réserver maintenant →
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  Itinéraire
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Map */}
          <div
            className="contact-map-col"
            style={{ position: "relative", overflow: "hidden", minHeight: "500px" }}
          >
            <iframe
              title="Mr. Renaudin Barbershop — Carte"
              src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
              width="100%" height="100%"
              style={{ display: "block", border: 0, filter: "grayscale(65%) contrast(1.05) brightness(0.78)", minHeight: "500px", position: "absolute", inset: 0 }}
              loading="lazy"
            />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, var(--gold), transparent)" }} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          §8  CTA FINAL
      ══════════════════════════════════════════════════ */}
      <section style={{ position: "relative", padding: "11rem 2.5rem", background: "var(--ink)", borderTop: "1px solid var(--border)", textAlign: "center", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Bodoni Moda', serif",
          fontSize: "clamp(8rem, 22vw, 24rem)", fontWeight: 900,
          color: "rgba(212,168,67,0.025)", letterSpacing: "-0.05em",
          userSelect: "none", pointerEvents: "none", lineHeight: 1,
        }}>
          BARBER
        </div>

        <FadeIn>
          <div style={{ position: "relative", zIndex: 2, maxWidth: "680px", margin: "0 auto" }}>
            <Label>Prêt pour votre transformation ?</Label>
            <span className="rule-v" style={{ height: "50px", margin: "0 auto 2.5rem", display: "block" }} />
            <h2 className="t-display" style={{ fontSize: "clamp(3rem, 7vw, 7rem)", marginBottom: "2rem" }}>
              Votre meilleur look<br />
              <em style={{ fontStyle: "italic", color: "var(--gold)" }}>commence ici.</em>
            </h2>
            <p className="t-body" style={{ maxWidth: "400px", margin: "0 auto 3.5rem" }}>
              Réservez en ligne ou appelez-nous — nous sommes prêts à vous offrir une coupe dont vous vous souviendrez.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", justifyContent: "center" }}>
              <button className="btn btn-gold" onClick={() => navigate("/reserver")}>
                Prendre rendez-vous <span aria-hidden="true">→</span>
              </button>
              <a href={`tel:${PHONE}`} className="btn btn-ghost">{PHONE}</a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Mobile sticky CTA */}
      <div className="sticky-cta">
        <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }} onClick={() => navigate("/reserver")}>
          Prendre rendez-vous →
        </button>
      </div>
    </>
  );
};

export default HomePage;