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
    title: "Fade & degradé",
    desc: "Transitions propres, contours nets et finition adaptée a la forme du visage.",
    img: "/Photos/rasage1.jpg",
  },
  {
    title: "Coupe classique",
    desc: "Coupe courte, professionnelle et facile a entretenir pour le quotidien.",
    img: "/Photos/CoupeClassique.jpg",
  },
  {
    title: "Barbe & rasage",
    desc: "Ligne de barbe, rasage precis et serviette chaude pour une finition impeccable.",
    img: "/Photos/RasageBarbe.jpg",
  },
  {
    title: "Afro, waves & texture",
    desc: "Travail de texture, volume controle et conseils pour garder le style plus longtemps.",
    img: "/Photos/rasage3.jpg",
  },
];

const HOURS = [
  ["Lundi - Vendredi", "11h00 - 19h00"],
  ["Samedi", "12h00 - 19h00"],
  ["Dimanche", "11h00 - 17h00"],
];

const STATS = [
  ["Shawinigan", "Salon local au Canada"],
  ["11+", "Services de coupe et soin"],
  ["7j/7", "Reservation en ligne"],
];

const STEPS = [
  "Choisir le service",
  "Selectionner le jour",
  "Recevoir la confirmation",
  "Arriver et ressortir net",
];

const useInjectStyles = () => {
  useEffect(() => {
    const styleId = "mr-renaudin-home-v5";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      .home-root {
        --bg: #0c0f13;
        --panel: #151a20;
        --panel-2: #1c232c;
        --ink: #f5f1e8;
        --muted: #a8b0ba;
        --line: rgba(245,241,232,0.12);
        --gold: #d6aa4b;
        --sage: #7b927d;
        --brick: #9a4f3d;
        --blue: #6f91ad;
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
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      .home-title {
        font-family: 'Playfair Display', Georgia, serif;
        letter-spacing: 0;
        line-height: 0.98;
        font-weight: 900;
      }
      .home-copy { color: var(--muted); line-height: 1.75; }
      .home-hero {
        position: relative;
        min-height: calc(100svh - 74px);
        display: grid;
        align-items: end;
        padding: 7rem 0 3.25rem;
        isolation: isolate;
      }
      .home-hero-media {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -2;
      }
      .home-hero-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .home-hero-media.empty { background: linear-gradient(135deg, #151a20, #25251f 45%, #19242a); }
      .home-hero-shade {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(90deg, rgba(12,15,19,0.94) 0%, rgba(12,15,19,0.68) 42%, rgba(12,15,19,0.26) 100%),
          linear-gradient(0deg, rgba(12,15,19,0.98) 0%, rgba(12,15,19,0.22) 42%, rgba(12,15,19,0.48) 100%);
        z-index: -1;
      }
      .home-hero::after {
        content: "";
        position: absolute;
        inset: auto 0 0;
        height: 34%;
        background: linear-gradient(0deg, var(--bg), transparent);
        z-index: -1;
      }
      .home-hero-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.05fr) 360px;
        gap: 2rem;
        align-items: end;
      }
      .home-hero h1 {
        max-width: 780px;
        font-size: clamp(3rem, 8vw, 7rem);
        margin: 0.8rem 0 1.2rem;
      }
      .home-hero-lead {
        max-width: 620px;
        color: rgba(245,241,232,0.82);
        font-size: clamp(1rem, 2vw, 1.22rem);
        line-height: 1.7;
      }
      .home-actions { display: flex; flex-wrap: wrap; gap: 0.85rem; margin-top: 2rem; }
      .home-btn {
        min-height: 46px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.55rem;
        border: 1px solid var(--line);
        padding: 0.85rem 1.15rem;
        font-size: 0.82rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        text-decoration: none;
        cursor: pointer;
        transition: transform 0.2s, border-color 0.2s, background 0.2s, color 0.2s;
      }
      .home-btn:hover, .home-btn:focus-visible { transform: translateY(-2px); outline: none; border-color: var(--gold); }
      .home-btn.primary { background: var(--gold); color: #101010; border-color: var(--gold); }
      .home-btn.dark { background: rgba(21,26,32,0.84); color: var(--ink); }
      .home-quick-panel {
        background: rgba(21,26,32,0.88);
        border: 1px solid var(--line);
        padding: 1.2rem;
        backdrop-filter: blur(16px);
      }
      .home-quick-panel h2 {
        margin: 0 0 0.85rem;
        font-size: 1rem;
        letter-spacing: 0;
      }
      .home-quick-row {
        display: grid;
        grid-template-columns: 28px 1fr;
        gap: 0.8rem;
        padding: 0.85rem 0;
        border-top: 1px solid var(--line);
      }
      .home-quick-row svg { margin-top: 0.2rem; color: var(--gold); }
      .home-quick-row strong { display: block; font-size: 0.88rem; }
      .home-quick-row span { display: block; color: var(--muted); font-size: 0.84rem; line-height: 1.55; margin-top: 0.15rem; }
      .home-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
        margin-top: 3rem;
      }
      .home-stat { padding: 1.25rem 1rem 1.25rem 0; }
      .home-stat strong {
        display: block;
        font-family: 'Playfair Display', Georgia, serif;
        color: var(--gold);
        font-size: clamp(1.5rem, 3vw, 2.25rem);
      }
      .home-stat span { color: var(--muted); font-size: 0.83rem; }
      .home-section { padding: 5.5rem 0; }
      .home-section-head {
        display: grid;
        grid-template-columns: minmax(0, 0.9fr) minmax(280px, 0.55fr);
        gap: 2rem;
        align-items: end;
        margin-bottom: 2rem;
      }
      .home-section h2 {
        font-size: clamp(2.1rem, 4.5vw, 4.6rem);
        margin: 0.6rem 0 0;
      }
      .home-services {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
      }
      .home-service {
        background: var(--panel);
        border: 1px solid var(--line);
        overflow: hidden;
        min-height: 100%;
      }
      .home-service img {
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
        display: block;
        background: #222;
      }
      .home-service-body { padding: 1.1rem; }
      .home-service h3 { margin: 0 0 0.45rem; font-size: 1.02rem; }
      .home-service p { margin: 0; color: var(--muted); line-height: 1.62; font-size: 0.9rem; }
      .home-band {
        background: var(--panel);
        border-block: 1px solid var(--line);
        padding: 5rem 0;
      }
      .home-flow {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0;
        border: 1px solid var(--line);
      }
      .home-flow-step {
        min-height: 150px;
        padding: 1.2rem;
        border-right: 1px solid var(--line);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .home-flow-step:last-child { border-right: 0; }
      .home-flow-step span { color: var(--gold); font-weight: 900; }
      .home-flow-step strong { font-size: 1rem; line-height: 1.35; }
      .home-gallery {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr 1fr;
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
        background: rgba(12,15,19,0.74);
        border: 1px solid var(--line);
        padding: 0.42rem 0.6rem;
        color: var(--ink);
        font-size: 0.72rem;
        font-weight: 800;
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
      .home-reviews { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem; }
      .home-review { background: var(--panel); border: 1px solid var(--line); padding: 1.25rem; }
      .home-review-stars { color: var(--gold); letter-spacing: 0.08em; margin-bottom: 0.8rem; }
      .home-review p { color: var(--muted); line-height: 1.65; margin: 0.6rem 0 0; }
      .home-proof {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      .home-quote, .home-hours {
        background: var(--panel-2);
        border: 1px solid var(--line);
        padding: 1.5rem;
      }
      .home-quote blockquote {
        margin: 0;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(1.35rem, 2.4vw, 2.1rem);
        line-height: 1.25;
      }
      .home-quote p { color: var(--muted); line-height: 1.65; margin: 1rem 0 0; }
      .home-hours-row {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.85rem 0;
        border-bottom: 1px solid var(--line);
        color: var(--muted);
      }
      .home-hours-row strong { color: var(--ink); }
      .home-location {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        align-items: stretch;
      }
      .home-map {
        min-height: 380px;
        border: 1px solid var(--line);
        overflow: hidden;
        background: var(--panel);
      }
      .home-map iframe { width: 100%; height: 100%; border: 0; display: block; }
      .home-location-card {
        background: linear-gradient(135deg, rgba(154,79,61,0.18), rgba(123,146,125,0.16)), var(--panel);
        border: 1px solid var(--line);
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      @media (max-width: 980px) {
        .home-hero-grid,
        .home-section-head,
        .home-proof,
        .home-location { grid-template-columns: 1fr; }
        .home-services, .home-reviews { grid-template-columns: repeat(2, 1fr); }
        .home-gallery { grid-template-columns: 1fr 1fr; }
        .home-shot:nth-child(1), .home-shot:nth-child(5) { grid-row: span 1; }
      }
      @media (max-width: 640px) {
        .home-hero { min-height: auto; padding: 5.5rem 0 2.5rem; }
        .home-actions { flex-direction: column; }
        .home-btn { width: 100%; }
        .home-stats, .home-services, .home-flow, .home-gallery, .home-reviews { grid-template-columns: 1fr; }
        .home-flow-step { border-right: 0; border-bottom: 1px solid var(--line); min-height: 118px; }
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
    apiClient.get("/api/gallery")
      .then(res => setGalleryPhotos(res.data || []))
      .catch(() => setGalleryPhotos([]));
    apiClient.get("/api/reviews")
      .then(res => setReviews((res.data || []).slice(0, 3)))
      .catch(() => setReviews([]));
  }, []);

  const featuredPhoto = galleryPhotos.find(photo => photo.is_featured) || galleryPhotos[0];
  const visibleGallery = galleryPhotos.slice(0, 6);
  const serviceVisuals = galleryPhotos.length ? galleryPhotos : [];

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
        <title>Mr. Renaudin Barbershop | Barbier professionnel a Shawinigan</title>
        <meta
          name="description"
          content="Mr. Renaudin Barbershop a Shawinigan, Quebec. Reservation en ligne, fades, coupes classiques, barbe, rasage et services de texture."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <section className="home-hero">
        <div className={`home-hero-media ${featuredPhoto ? "" : "empty"}`}>
          {featuredPhoto && <img src={featuredPhoto.image_data} alt={featuredPhoto.title || "Mr. Renaudin Barbershop"} />}
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
              Barbershop canadien a Shawinigan
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
              Entrez dans une adresse ou la coupe devient une signature. Mr. Renaudin
              Barbershop marie precision, accueil chaleureux et standards premium pour
              donner a chaque client une allure nette, confiante et durable.
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
            <div className="home-stats">
              {STATS.map(([value, label]) => (
                <div className="home-stat" key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <motion.aside
            className="home-quick-panel"
            initial={reduce ? {} : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.42 }}
          >
            <h2>Infos rapides</h2>
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
                <strong>Reservation</strong>
                <span>Choisissez votre moment, le salon prepare l'experience.</span>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="home-section">
        <div className="home-shell">
          <FadeIn className="home-section-head">
            <div>
              <p className="home-eyebrow">Services populaires</p>
              <h2 className="home-title">Des services penses pour votre meilleur profil.</h2>
            </div>
            <p className="home-copy">
              Du fade propre a la barbe structuree, chaque prestation est guidee par la
              forme du visage, le rythme de vie et le style que le client veut porter
              avec assurance.
            </p>
          </FadeIn>
          <div className="home-services">
            {SERVICES.map((service, index) => (
              <FadeIn className="home-service" delay={index} key={service.title}>
                {serviceVisuals[index % Math.max(serviceVisuals.length, 1)] ? (
                  <img
                    src={serviceVisuals[index % serviceVisuals.length].image_data}
                    alt={serviceVisuals[index % serviceVisuals.length].title || service.title}
                    loading="lazy"
                  />
                ) : null}
                <div className="home-service-body">
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
              <p className="home-eyebrow">Experience fluide</p>
              <h2 className="home-title">Du choix au fauteuil, tout reste simple.</h2>
            </div>
            <p className="home-copy">
              Choisissez votre prestation, reservez le moment qui vous convient et
              arrivez sereinement. Le salon s'occupe du reste: ponctualite, preparation
              et finition impeccable.
            </p>
          </FadeIn>
          <div className="home-flow">
            {STEPS.map((step, index) => (
              <FadeIn className="home-flow-step" delay={index} key={step}>
                <span>0{index + 1}</span>
                <strong>{step}</strong>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-shell">
          <FadeIn className="home-section-head">
            <div>
              <p className="home-eyebrow">Galerie</p>
              <h2 className="home-title">Des resultats qui parlent avant le rendez-vous.</h2>
            </div>
            <p className="home-copy">
              Decouvrez l'allure, les textures et les finitions qui font la reputation
              du salon. Chaque image est une invitation a imaginer votre prochain style.
            </p>
          </FadeIn>
          <div className="home-gallery">
            {visibleGallery.length === 0 ? (
              <div className="home-empty-note">
                La galerie sera bientot enrichie avec les coupes recentes du salon.
                Revenez decouvrir les prochains styles signes Mr. Renaudin.
              </div>
            ) : visibleGallery.map((item, index) => (
              <FadeIn className="home-shot" delay={index} key={item.id}>
                <img src={item.image_data} alt={item.title} loading="lazy" />
                <span>{item.category || item.title}</span>
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
          <FadeIn className="home-quote">
            <p className="home-eyebrow">Avis clients</p>
            <blockquote>Ce que les clients disent de nous</blockquote>
            <p>
              Une bonne coupe se remarque dans la posture, le regard et la confiance
              qu'elle laisse en sortant du salon. C'est cette impression que Mr.
              Renaudin cherche a livrer a chaque rendez-vous.
            </p>
          </FadeIn>
          <FadeIn className="home-hours" delay={1}>
            <p className="home-eyebrow">Horaires</p>
            {HOURS.map(([day, hour]) => (
              <div className="home-hours-row" key={day}>
                <strong>{day}</strong>
                <span>{hour}</span>
              </div>
            ))}
            <div className="home-actions">
              <button className="home-btn primary" onClick={() => navigate("/reserver")}>
                <FaCalendarCheck /> Prendre rendez-vous
              </button>
            </div>
          </FadeIn>
        </div>
        <div className="home-shell">
          <div className="home-reviews">
            {reviews.length === 0 ? (
              <div className="home-empty-note">
                Les avis des prochains clients apparaitront ici pour raconter
                l'experience du salon avec leurs propres mots.
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
      </section>

      <section className="home-section">
        <div className="home-shell home-location">
          <FadeIn className="home-location-card">
            <div>
              <p className="home-eyebrow">Localisation</p>
              <h2 className="home-title" style={{ fontSize: "clamp(2rem, 4vw, 3.9rem)", margin: "0.6rem 0 1rem" }}>
                Le siege du barber est au Canada.
              </h2>
              <p className="home-copy">{ADDRESS}</p>
            </div>
            <div className="home-actions">
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
