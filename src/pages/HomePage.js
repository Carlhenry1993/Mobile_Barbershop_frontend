import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, useInView, useReducedMotion } from "framer-motion";
import apiClient from "../lib/apiClient";
import {
  FaCalendarCheck,
  FaCut,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

const ADDRESS = "462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7, Canada";
const PHONE = "514-778-8318";
const MAP_QUERY = "462 4e Rue de la Pointe Shawinigan QC G9N 1G7";
const WHATSAPP_NUMBER = "15147788318";
const WHATSAPP_MSG = encodeURIComponent(
  "Bonjour Mr. Renaudin Barbershop, j'aimerais prendre rendez-vous."
);
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

const SERVICES = [
  {
    title: "Fade & contours",
    desc: "Des transitions propres, une ligne nette et une finition adaptee a la forme du visage.",
  },
  {
    title: "Coupe classique",
    desc: "Une coupe sobre, precise et facile a porter pour le travail, les sorties et le quotidien.",
  },
  {
    title: "Barbe & rasage",
    desc: "Ligne de barbe, rasage soigne et finition chaude pour un visage proprement structure.",
  },
  {
    title: "Afro, waves & texture",
    desc: "Volume, definition et entretien pour garder une texture elegante plus longtemps.",
  },
];

const PILLARS = [
  ["Precision", "Chaque contour, transition et finition est travaille pour servir le visage."],
  ["Presence", "Un accueil calme, respectueux et attentif, sans precipitation inutile."],
  ["Style durable", "Des conseils simples pour garder une allure nette apres le rendez-vous."],
];

const STEPS = [
  ["01", "Choisir", "Selectionnez le service qui correspond a votre style."],
  ["02", "Reserver", "Prenez le creneau qui s'accorde a votre horaire."],
  ["03", "S'installer", "Arrivez au salon, detendez-vous, laissez la precision parler."],
  ["04", "Ressortir net", "Quittez le fauteuil avec une coupe propre et une confiance visible."],
];

const HOURS = [
  ["Lundi - Vendredi", "11h00 - 19h00"],
  ["Samedi", "12h00 - 19h00"],
  ["Dimanche", "11h00 - 17h00"],
];

const useInjectStyles = () => {
  useEffect(() => {
    const styleId = "mr-renaudin-home-premium-v6";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      .home-root {
        --bg: #0b0d10;
        --paper: #f4efe5;
        --ink: #f7f1e8;
        --muted: #aeb7c0;
        --panel: #15191f;
        --panel-2: #1d232b;
        --line: rgba(247,241,232,0.13);
        --gold: #d6aa4b;
        --green: #71816e;
        --clay: #9b5b45;
        background: var(--bg);
        color: var(--ink);
        font-family: 'DM Sans', Arial, sans-serif;
        overflow: hidden;
      }
      .home-root * { box-sizing: border-box; }
      .home-root a { color: inherit; }
      .home-shell { width: min(1180px, calc(100% - 32px)); margin: 0 auto; }
      .home-eyebrow {
        color: var(--gold);
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        margin: 0;
      }
      .home-title {
        font-family: 'Playfair Display', Georgia, serif;
        font-weight: 900;
        letter-spacing: 0;
        line-height: 0.96;
        margin: 0;
      }
      .home-copy {
        color: var(--muted);
        line-height: 1.75;
        margin: 0;
      }
      .home-btn {
        min-height: 46px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.55rem;
        border: 1px solid var(--line);
        padding: 0.85rem 1.1rem;
        font-size: 0.8rem;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        text-decoration: none;
        cursor: pointer;
        transition: transform 0.2s, border-color 0.2s, background 0.2s, color 0.2s;
      }
      .home-btn:hover, .home-btn:focus-visible {
        transform: translateY(-2px);
        border-color: var(--gold);
        outline: none;
      }
      .home-btn.primary { background: var(--gold); border-color: var(--gold); color: #111; }
      .home-btn.dark { background: rgba(21,25,31,0.88); color: var(--ink); }
      .home-actions { display: flex; flex-wrap: wrap; gap: 0.8rem; }

      .home-hero {
        position: relative;
        min-height: calc(100svh - 74px);
        padding: 6.5rem 0 2rem;
        display: flex;
        align-items: flex-end;
        isolation: isolate;
      }
      .home-hero-media {
        position: absolute;
        inset: 0;
        z-index: -3;
        background: linear-gradient(135deg, #171b20, #222318 48%, #10181b);
      }
      .home-hero-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .home-hero-shade {
        position: absolute;
        inset: 0;
        z-index: -2;
        background:
          linear-gradient(90deg, rgba(11,13,16,0.97) 0%, rgba(11,13,16,0.72) 47%, rgba(11,13,16,0.24) 100%),
          linear-gradient(0deg, rgba(11,13,16,0.98) 0%, rgba(11,13,16,0.24) 48%, rgba(11,13,16,0.54) 100%);
      }
      .home-hero::after {
        content: "";
        position: absolute;
        inset: auto 0 0;
        height: 28%;
        z-index: -1;
        background: linear-gradient(0deg, var(--bg), transparent);
      }
      .home-hero-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 340px;
        gap: 2.5rem;
        align-items: end;
      }
      .home-hero h1 {
        max-width: 830px;
        font-size: clamp(3.3rem, 8.4vw, 7.7rem);
        margin-top: 0.85rem;
      }
      .home-hero-lead {
        max-width: 650px;
        margin: 1.25rem 0 2rem;
        color: rgba(247,241,232,0.84);
        font-size: clamp(1rem, 1.9vw, 1.22rem);
        line-height: 1.75;
      }
      .home-hero-note {
        margin-top: 2.5rem;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
      }
      .home-hero-note div { padding: 1.1rem 1rem 1.1rem 0; }
      .home-hero-note strong {
        display: block;
        font-family: 'Playfair Display', Georgia, serif;
        color: var(--gold);
        font-size: clamp(1.45rem, 2.6vw, 2rem);
      }
      .home-hero-note span { color: rgba(247,241,232,0.7); font-size: 0.82rem; line-height: 1.5; }
      .home-appointment-card {
        background: rgba(21,25,31,0.9);
        border: 1px solid var(--line);
        padding: 1.2rem;
        backdrop-filter: blur(18px);
      }
      .home-appointment-card h2 { margin: 0; font-size: 1rem; }
      .home-quick-row {
        display: grid;
        grid-template-columns: 28px 1fr;
        gap: 0.8rem;
        padding: 1rem 0;
        border-top: 1px solid var(--line);
      }
      .home-quick-row:first-of-type { margin-top: 0.9rem; }
      .home-quick-row svg { color: var(--gold); margin-top: 0.2rem; }
      .home-quick-row strong { display: block; font-size: 0.88rem; }
      .home-quick-row span { display: block; color: var(--muted); font-size: 0.84rem; line-height: 1.55; margin-top: 0.16rem; }

      .home-section { padding: 6rem 0; }
      .home-section.tight { padding-top: 3.5rem; }
      .home-section-head {
        display: grid;
        grid-template-columns: minmax(0, 0.95fr) minmax(280px, 0.55fr);
        gap: 2rem;
        align-items: end;
        margin-bottom: 2.25rem;
      }
      .home-section h2 {
        font-size: clamp(2.15rem, 4.7vw, 4.7rem);
        margin-top: 0.65rem;
      }
      .home-intro {
        display: grid;
        grid-template-columns: 0.9fr 1.1fr;
        gap: 1rem;
        align-items: stretch;
      }
      .home-intro-card {
        background: var(--paper);
        color: #141414;
        padding: clamp(1.6rem, 4vw, 3rem);
        min-height: 390px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .home-intro-card h2 {
        color: #141414;
        font-size: clamp(2rem, 4.4vw, 4.2rem);
      }
      .home-intro-card p { color: #46505a; max-width: 610px; margin-top: 1rem; }
      .home-pillars {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1px;
        background: var(--line);
        border: 1px solid var(--line);
      }
      .home-pillar {
        background: var(--panel);
        padding: 1.35rem;
        min-height: 190px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .home-pillar span { color: var(--gold); font-weight: 900; font-size: 0.8rem; }
      .home-pillar h3 { margin: 1rem 0 0.55rem; font-size: 1.15rem; }
      .home-pillar p { color: var(--muted); line-height: 1.65; margin: 0; font-size: 0.9rem; }

      .home-services {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
      }
      .home-service {
        position: relative;
        min-height: 270px;
        background: var(--panel);
        border: 1px solid var(--line);
        padding: 1.2rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
      }
      .home-service::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(214,170,75,0.1), transparent 55%);
        opacity: 0;
        transition: opacity 0.25s;
      }
      .home-service:hover::before { opacity: 1; }
      .home-service-number { color: var(--gold); font-weight: 900; font-size: 0.8rem; }
      .home-service h3 {
        position: relative;
        margin: 0 0 0.65rem;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 1.55rem;
      }
      .home-service p { position: relative; margin: 0; color: var(--muted); line-height: 1.66; font-size: 0.92rem; }

      .home-band {
        padding: 6rem 0;
        background:
          linear-gradient(135deg, rgba(113,129,110,0.18), rgba(155,91,69,0.12)),
          var(--panel);
        border-block: 1px solid var(--line);
      }
      .home-flow {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        border: 1px solid var(--line);
      }
      .home-flow-step {
        min-height: 220px;
        padding: 1.25rem;
        border-right: 1px solid var(--line);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: rgba(11,13,16,0.18);
      }
      .home-flow-step:last-child { border-right: 0; }
      .home-flow-step span { color: var(--gold); font-weight: 900; }
      .home-flow-step strong { display: block; font-size: 1.15rem; margin-bottom: 0.55rem; }
      .home-flow-step p { color: var(--muted); line-height: 1.6; margin: 0; font-size: 0.9rem; }

      .home-gallery {
        display: grid;
        grid-template-columns: 1.15fr 0.85fr 1fr;
        grid-auto-rows: 230px;
        gap: 1rem;
      }
      .home-shot {
        position: relative;
        overflow: hidden;
        border: 1px solid var(--line);
        background: var(--panel);
      }
      .home-shot:nth-child(1), .home-shot:nth-child(5) { grid-row: span 2; }
      .home-shot img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.45s ease; }
      .home-shot:hover img { transform: scale(1.04); }
      .home-shot span {
        position: absolute;
        left: 0.8rem;
        bottom: 0.8rem;
        background: rgba(11,13,16,0.78);
        border: 1px solid var(--line);
        padding: 0.42rem 0.6rem;
        color: var(--ink);
        font-size: 0.72rem;
        font-weight: 900;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .home-empty-note {
        grid-column: 1 / -1;
        background: var(--panel);
        border: 1px solid var(--line);
        color: var(--muted);
        padding: 2rem;
        line-height: 1.7;
      }

      .home-proof {
        display: grid;
        grid-template-columns: minmax(0, 0.85fr) minmax(320px, 0.45fr);
        gap: 1rem;
        align-items: start;
      }
      .home-review-head, .home-hours {
        background: var(--panel-2);
        border: 1px solid var(--line);
        padding: 1.5rem;
      }
      .home-review-head blockquote {
        margin: 0.75rem 0 0;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(1.8rem, 3vw, 3.2rem);
        line-height: 1.05;
      }
      .home-review-head p { color: var(--muted); line-height: 1.7; margin: 1rem 0 0; max-width: 620px; }
      .home-reviews { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem; }
      .home-review { background: var(--panel); border: 1px solid var(--line); padding: 1.25rem; }
      .home-review-stars { color: var(--gold); letter-spacing: 0.08em; margin-bottom: 0.8rem; }
      .home-review p { color: var(--muted); line-height: 1.65; margin: 0.6rem 0 0; }
      .home-hours-row {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.9rem 0;
        border-bottom: 1px solid var(--line);
        color: var(--muted);
      }
      .home-hours-row strong { color: var(--ink); }

      .home-location {
        display: grid;
        grid-template-columns: 0.85fr 1.15fr;
        gap: 1rem;
        align-items: stretch;
      }
      .home-location-card {
        background: var(--paper);
        color: #141414;
        border: 1px solid rgba(20,20,20,0.08);
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 390px;
      }
      .home-location-card .home-eyebrow { color: #8d6320; }
      .home-location-card .home-title { color: #141414; font-size: clamp(2.1rem, 4vw, 3.8rem); margin-top: 0.7rem; }
      .home-location-card .home-copy { color: #4c5560; margin-top: 1rem; }
      .home-location-card .home-btn.dark { background: #15191f; border-color: #15191f; color: var(--ink); }
      .home-map {
        min-height: 390px;
        border: 1px solid var(--line);
        overflow: hidden;
        background: var(--panel);
      }
      .home-map iframe { width: 100%; height: 100%; border: 0; display: block; }

      @media (max-width: 980px) {
        .home-hero-grid,
        .home-section-head,
        .home-intro,
        .home-proof,
        .home-location { grid-template-columns: 1fr; }
        .home-services, .home-reviews { grid-template-columns: repeat(2, 1fr); }
        .home-pillars { grid-template-columns: 1fr; }
        .home-gallery { grid-template-columns: 1fr 1fr; }
        .home-shot:nth-child(1), .home-shot:nth-child(5) { grid-row: span 1; }
      }
      @media (max-width: 640px) {
        .home-hero { min-height: auto; padding: 5rem 0 2.5rem; }
        .home-hero-note, .home-services, .home-flow, .home-gallery, .home-reviews { grid-template-columns: 1fr; }
        .home-actions { flex-direction: column; }
        .home-btn { width: 100%; }
        .home-flow-step { border-right: 0; border-bottom: 1px solid var(--line); min-height: 160px; }
        .home-flow-step:last-child { border-bottom: 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        .home-root *, .home-root *::before, .home-root *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(styleId)?.remove();
  }, []);
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

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

const HomePage = () => {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [reviews, setReviews] = useState([]);
  useInjectStyles();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    apiClient.get("/api/gallery?placement=home")
      .then(res => setGalleryPhotos(res.data || []))
      .catch(() => setGalleryPhotos([]));
    apiClient.get("/api/reviews")
      .then(res => setReviews((res.data || []).slice(0, 3)))
      .catch(() => setReviews([]));
  }, []);

  const featuredPhoto = galleryPhotos.find(photo => photo.is_featured) || galleryPhotos[0];
  const visibleGallery = galleryPhotos.slice(0, 6);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    name: "Mr. Renaudin Barbershop",
    image: featuredPhoto?.image_data || "",
    address: {
      "@type": "PostalAddress",
      streetAddress: "462 4e Rue de la Pointe",
      addressLocality: "Shawinigan",
      addressRegion: "QC",
      postalCode: "G9N 1G7",
      addressCountry: "CA",
    },
    telephone: PHONE,
    url: typeof window !== "undefined" ? window.location.origin : "",
    priceRange: "$$",
  };

  return (
    <main className="home-root">
      <Helmet>
        <title>Mr. Renaudin Barbershop | Barbier premium a Shawinigan</title>
        <meta
          name="description"
          content="Mr. Renaudin Barbershop a Shawinigan. Coupes nettes, fades, barbe, texture et reservation en ligne dans une experience de salon premium."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <section className="home-hero">
        <div className="home-hero-media">
          {featuredPhoto && (
            <img src={featuredPhoto.image_data} alt={featuredPhoto.title || "Mr. Renaudin Barbershop"} />
          )}
        </div>
        <div className="home-hero-shade" />
        <div className="home-shell home-hero-grid">
          <div>
            <motion.p
              className="home-eyebrow"
              initial={reduce ? {} : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              Barbershop premium a Shawinigan
            </motion.p>
            <motion.h1
              className="home-title"
              initial={reduce ? {} : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Mr. Renaudin Barbershop
            </motion.h1>
            <motion.p
              className="home-hero-lead"
              initial={reduce ? {} : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22 }}
            >
              Une adresse canadienne pour les clients qui veulent une coupe nette,
              une barbe propre et une presence qui se remarque avant meme de parler.
            </motion.p>
            <motion.div
              className="home-actions"
              initial={reduce ? {} : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.32 }}
            >
              <button className="home-btn primary" onClick={() => navigate("/reserver")}>
                <FaCalendarCheck /> Reserver
              </button>
              <a className="home-btn dark" href={`tel:${PHONE}`}>
                <FaPhoneAlt /> Appeler
              </a>
              <a className="home-btn dark" href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp /> WhatsApp
              </a>
            </motion.div>
            <div className="home-hero-note">
              <div><strong>Shawinigan</strong><span>Une adresse locale au Quebec, facile a rejoindre.</span></div>
              <div><strong>11+</strong><span>Services pour coupe, barbe, texture et finition.</span></div>
              <div><strong>7j/7</strong><span>Reservation en ligne pour choisir le bon moment.</span></div>
            </div>
          </div>

          <motion.aside
            className="home-appointment-card"
            initial={reduce ? {} : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.42 }}
          >
            <h2>Preparer votre visite</h2>
            <div className="home-quick-row">
              <FaMapMarkerAlt />
              <div>
                <strong>Adresse</strong>
                <span>{ADDRESS}</span>
              </div>
            </div>
            <div className="home-quick-row">
              <FaCut />
              <div>
                <strong>Specialites</strong>
                <span>Fade, coupe classique, barbe, afro, waves et tresses.</span>
              </div>
            </div>
            <div className="home-quick-row">
              <FaCalendarCheck />
              <div>
                <strong>Rendez-vous</strong>
                <span>Choisissez le service, puis laissez le salon faire le reste.</span>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="home-section tight">
        <div className="home-shell home-intro">
          <FadeIn className="home-intro-card">
            <div>
              <p className="home-eyebrow">Signature du salon</p>
              <h2 className="home-title">Une coupe doit changer la facon dont on se tient.</h2>
            </div>
            <p className="home-copy">
              Mr. Renaudin Barbershop construit son experience autour d'une idee simple:
              le style ne doit pas seulement etre propre, il doit donner de l'assurance.
            </p>
          </FadeIn>
          <div className="home-pillars">
            {PILLARS.map(([title, text], index) => (
              <FadeIn className="home-pillar" delay={index} key={title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-shell">
          <FadeIn className="home-section-head">
            <div>
              <p className="home-eyebrow">Services signature</p>
              <h2 className="home-title">Des prestations pour une allure propre, forte et durable.</h2>
            </div>
            <p className="home-copy">
              Chaque service est pense pour respecter le visage, le style personnel et
              le rythme de vie du client. Le resultat doit rester net apres le miroir.
            </p>
          </FadeIn>
          <div className="home-services">
            {SERVICES.map((service, index) => (
              <FadeIn className="home-service" delay={index} key={service.title}>
                <span className="home-service-number">0{index + 1}</span>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="home-band">
        <div className="home-shell">
          <FadeIn className="home-section-head">
            <div>
              <p className="home-eyebrow">Experience au fauteuil</p>
              <h2 className="home-title">Un parcours simple, soigne, sans confusion.</h2>
            </div>
            <p className="home-copy">
              De la reservation a la sortie du salon, chaque etape doit rester claire,
              confortable et digne d'une adresse que les clients recommandent.
            </p>
          </FadeIn>
          <div className="home-flow">
            {STEPS.map(([number, title, text], index) => (
              <FadeIn className="home-flow-step" delay={index} key={title}>
                <span>{number}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-shell">
          <FadeIn className="home-section-head">
            <div>
              <p className="home-eyebrow">Lookbook</p>
              <h2 className="home-title">Des resultats qui donnent envie de prendre rendez-vous.</h2>
            </div>
            <p className="home-copy">
              La galerie presente les vraies coupes publiees par le salon: contours,
              textures, barbes et finitions qui inspirent le prochain style.
            </p>
          </FadeIn>
          <div className="home-gallery">
            {visibleGallery.length === 0 ? (
              <div className="home-empty-note">
                La galerie sera bientot enrichie avec les prochaines realisations Mr. Renaudin.
                Chaque photo aidera les clients a choisir leur inspiration avant de reserver.
              </div>
            ) : visibleGallery.map((item, index) => (
              <FadeIn className="home-shot" delay={index} key={item.id}>
                <img src={item.image_data} alt={item.title} loading="lazy" />
                <span>{item.title || item.category}</span>
              </FadeIn>
            ))}
          </div>
          {visibleGallery.length > 0 && (
            <div className="home-actions" style={{ justifyContent: "center", marginTop: "2rem" }}>
              <button className="home-btn dark" onClick={() => navigate("/galerie")}>Voir toute la galerie</button>
            </div>
          )}
        </div>
      </section>

      <section className="home-section">
        <div className="home-shell home-proof">
          <div>
            <FadeIn className="home-review-head">
              <p className="home-eyebrow">Avis clients</p>
              <blockquote>Ce que les clients disent de nous</blockquote>
              <p>
                Une bonne coupe se remarque dans la posture, le regard et la confiance
                qu'elle laisse en sortant du salon. C'est cette impression que Mr.
                Renaudin cherche a livrer a chaque rendez-vous.
              </p>
            </FadeIn>
            <div className="home-reviews">
              {reviews.length === 0 ? (
                <div className="home-empty-note">
                  Les premiers avis seront affiches ici lorsque les clients raconteront
                  leur experience avec leurs propres mots.
                </div>
              ) : reviews.map(review => (
                <article className="home-review" key={review.id}>
                  <div className="home-review-stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                  <strong>{review.title || review.service_name || "Avis client"}</strong>
                  <p>{review.comment}</p>
                  <p style={{ color: "var(--gold)", fontWeight: 800 }}>{review.client_name || "Client Mr. Renaudin"}</p>
                </article>
              ))}
            </div>
          </div>
          <FadeIn className="home-hours" delay={1}>
            <p className="home-eyebrow">Horaires</p>
            {HOURS.map(([day, hour]) => (
              <div className="home-hours-row" key={day}>
                <strong>{day}</strong>
                <span>{hour}</span>
              </div>
            ))}
            <div className="home-actions" style={{ marginTop: "1.4rem" }}>
              <button className="home-btn primary" onClick={() => navigate("/reserver")}>
                <FaCalendarCheck /> Prendre rendez-vous
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="home-section">
        <div className="home-shell home-location">
          <FadeIn className="home-location-card">
            <div>
              <p className="home-eyebrow">Adresse</p>
              <h2 className="home-title">Le salon de Shawinigan pour sortir propre et confiant.</h2>
              <p className="home-copy">{ADDRESS}</p>
            </div>
            <div className="home-actions" style={{ marginTop: "2rem" }}>
              <a
                className="home-btn primary"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaMapMarkerAlt /> Itineraire
              </a>
              <a className="home-btn dark" href={`tel:${PHONE}`}>
                <FaPhoneAlt /> {PHONE}
              </a>
            </div>
          </FadeIn>
          <FadeIn className="home-map" delay={1}>
            <iframe
              title="Carte Mr. Renaudin Barbershop"
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
            />
          </FadeIn>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
