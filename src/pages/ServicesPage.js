import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import apiClient from "../lib/apiClient";

const ADDRESS = "462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7, Canada";
const PHONE = "514-778-8318";
const MAP_QUERY = "462 4e Rue de la Pointe Shawinigan QC G9N 1G7";

const SERVICES = [
  {
    id: "boule-zero",
    title: "Boule à Zéro",
    desc: "Rasage total de la tête réalisé au salon pour un rendu net, propre et assumé. Serviette chaude incluse.",
    img: "/Photos/BouleZero.jpg",
    icon: "◉",
  },
  {
    id: "flat-top",
    title: "Flat Top",
    desc: "La coiffure iconique à sommet plat — taillée avec précision dans notre fauteuil de barbier traditionnel.",
    img: "/Photos/FlatTop.jpg",
    icon: "▬",
  },
  {
    id: "dreadlocks",
    title: "Dreadlocks",
    desc: "Création et entretien de locks authentiques. Espace dédié au tressage, ambiance détendue.",
    img: "/Photos/Dreadlocks.jpg",
    icon: "⟁",
  },
  {
    id: "mini-afro",
    title: "Mini Afro",
    desc: "Un afro compact et bien défini — volume maîtrisé, texture valorisée. Consultation style incluse.",
    img: "/Photos/MiniAfro.jpg",
    icon: "◎",
  },
  {
    id: "afro-naturelle",
    title: "Afro Naturelle",
    desc: "La pleine expression de votre texture naturelle, façonnée et volumisée par nos mains expertes au salon.",
    img: "/Photos/AfroNaturelle.jpg",
    icon: "❋",
  },
  {
    id: "nattes",
    title: "Nattes & Tresses Collées",
    desc: "Tressage serré et précis, plaqué au crâne. Réalisé en salon avec produits pros pour tenue longue durée.",
    img: "/Photos/Nattes.jpg",
    icon: "≋",
  },
  {
    id: "coupe-classique",
    title: "Coupe Ultra Courte Classique",
    desc: "La coupe intemporelle — courte, nette, professionnelle. Rasage nuque + finition à la lame.",
    img: "/Photos/CoupeClassique.jpg",
    icon: "✂",
  },
  {
    id: "courte-degradee",
    title: "Courte Dégradée",
    desc: "Longueur conservée sur le dessus avec dégradé subtil. Travail aux ciseaux et tondeuse de précision.",
    img: "/Photos/CourteDegradee.jpg",
    icon: "◌",
  },
  {
    id: "fade",
    title: "Fade (Dégradé)",
    desc: "Notre spécialité — dégradé de la peau vers la longueur. Transitions parfaitement fondues au salon.",
    img: "/Photos/Fade.jpg",
    icon: "▽",
  },
  {
    id: "afro-taper",
    title: "Afro Taper",
    desc: "Volume afro préservé sur le dessus, effilé avec précision sur les côtés. Style moderne structuré.",
    img: "/Photos/AfroTaper.jpg",
    icon: "◈",
  },
  {
    id: "waves-360",
    title: "Waves 360",
    desc: "Technique de brossage et compression en salon. Conseils produits + suivi pour waves uniformes.",
    img: "/Photos/Waves360.jpg",
    icon: "〜",
  },
];

const GALLERY = [
  { src: "/Photos/salon1.jpg", alt: "Intérieur du barbershop Mr. Renaudin - fauteuils" },
  { src: "/Photos/salon2.jpg", alt: "Poste de barbier professionnel" },
  { src: "/Photos/salon3.jpg", alt: "Espace d'attente du salon" },
];

const TESTIMONIALS = [
  {
    quote: "Le meilleur fade que j'aie jamais eu. L'ambiance du salon est exceptionnelle — on se sent vraiment dans un vrai barbershop haut de gamme.",
    author: "Marc-André T.",
  },
  {
    quote: "Professionnel, précis, et le lieu est impeccable. Je viens de Trois-Rivières juste pour me faire couper ici.",
    author: "Dominic R.",
  },
  {
    quote: "Ils ont pris le temps de comprendre exactement ce que je voulais. Le salon est propre, moderne, et l'accueil est top.",
    author: "Kevin L.",
  },
];

const useServicesStyles = () => {
  useEffect(() => {
    const styleId = "mr-renaudin-services-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
    .sv-root {
        --sv-black: #0e1015;
        --sv-charcoal: #161b24;
        --sv-card: #1e2535;
        --sv-border: #2a3348;
        --sv-gold: #d4a843;
        --sv-gold-lt: #f0c96a;
        --sv-gold-dim: rgba(212,168,67,0.13);
        --sv-steel: #8ba8c8;
        --sv-cream: #eef2f7;
        --sv-light: #b8c8da;
        --sv-muted: #7888a0;

        background: var(--sv-black);
        color: var(--sv-cream);
        font-family: 'DM Sans', sans-serif;
        -webkit-font-smoothing: antialiased;
      }

    .sv-root::before {
        content: '';
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
        opacity: 0.035;
      }

    .sv-inner { position: relative; z-index: 1; }

    .sv-eyebrow {
        font-family: 'DM Sans', sans-serif;
        font-size: 0.68rem;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: var(--sv-gold);
        margin-bottom: 1rem;
      }

    .sv-display {
        font-family: 'Playfair Display', Georgia, serif;
        font-weight: 900;
        line-height: 1.05;
        color: var(--sv-cream);
      }

    .sv-serif-body {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-weight: 300;
        font-size: 1.25rem;
        line-height: 1.85;
        color: var(--sv-light);
      }
      @media (max-width: 768px) {
    .sv-serif-body { font-size: 1.15rem; }
      }

    .sv-gold-rule {
        display: block;
        width: 60px;
        height: 2px;
        background: var(--sv-gold);
        margin: 0 auto 1.5rem;
      }

    .sv-section-pad { padding: 7rem 1.5rem; }
      @media (max-width: 768px) {
    .sv-section-pad { padding: 5rem 1.25rem; }
      }

    .sv-btn-gold, .sv-btn-outline {
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
    .sv-btn-gold {
        background: var(--sv-gold);
        color: var(--sv-black);
      }
    .sv-btn-gold:hover, .sv-btn-gold:focus-visible { 
        background: var(--sv-gold-lt); 
        transform: translateY(-2px);
        outline: 2px solid var(--sv-gold-lt);
        outline-offset: 2px;
      }
    .sv-btn-outline {
        background: transparent;
        color: var(--sv-cream);
        border: 1px solid rgba(184,200,218,0.3);
      }
    .sv-btn-outline:hover, .sv-btn-outline:focus-visible { 
        border-color: var(--sv-gold); 
        color: var(--sv-gold); 
        transform: translateY(-2px);
        outline: 2px solid var(--sv-gold);
        outline-offset: 2px;
      }

    .sv-hero {
        position: relative;
        min-height: 90svh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        overflow: hidden;
        padding: 0 1.5rem;
        background: var(--sv-black);
      }

    .sv-hero-bg {
        position: absolute;
        inset: 0;
        background-image: url('/Photos/salon-hero.jpg');
        background-size: cover;
        background-position: center;
        opacity: 0.4;
      }
    .sv-hero-bg::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(14,16,21,0.97) 0%, rgba(14,16,21,0.6) 50%, rgba(14,16,21,0.85) 100%);
      }

    .sv-address-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.8rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--sv-gold);
        background: rgba(212,168,67,0.1);
        border: 1px solid rgba(212,168,67,0.3);
        padding: 0.6rem 1.25rem;
        margin-top: 1.5rem;
      }

    .sv-service-card {
        background: var(--sv-card);
        border: 1px solid var(--sv-border);
        overflow: hidden;
        transition: border-color 0.35s, transform 0.35s, background 0.35s;
        will-change: transform;
      }
    .sv-service-card:hover { 
        border-color: var(--sv-gold); 
        transform: translateY(-8px); 
        background: #222e42; 
      }

    .sv-service-img-wrap {
        position: relative;
        width: 100%;
        aspect-ratio: 4/3;
        overflow: hidden;
        background: var(--sv-black);
      }
    .sv-service-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ease;
      }
    .sv-service-card:hover .sv-service-img {
        transform: scale(1.05);
      }

    .sv-service-icon {
        position: absolute;
        top: 1.25rem;
        right: 1.25rem;
        font-size: 1.75rem;
        width: 52px;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(14,16,21,0.85);
        border: 1px solid var(--sv-gold);
        color: var(--sv-gold);
        backdrop-filter: blur(8px);
      }

    .sv-service-body {
        padding: 2rem;
      }

    .sv-service-title {
        font-family: 'Playfair Display', serif;
        font-size: 1.35rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
        color: var(--sv-cream);
        letter-spacing: 0.01em;
      }

    .sv-service-desc {
        font-size: 0.92rem;
        color: var(--sv-light);
        line-height: 1.75;
        margin-bottom: 1.5rem;
      }

    .sv-gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-top: 3rem;
      }

    .sv-gallery-item {
        position: relative;
        aspect-ratio: 4/3;
        overflow: hidden;
        border: 1px solid var(--sv-border);
        transition: border-color 0.3s;
      }
    .sv-gallery-item:hover {
        border-color: var(--sv-gold);
      }
    .sv-gallery-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ease;
      }
    .sv-gallery-item:hover .sv-gallery-img {
        transform: scale(1.05);
      }

    .sv-testimonial-card {
        background: var(--sv-card);
        border: 1px solid var(--sv-border);
        padding: 2.5rem 2rem;
        height: 100%;
      }
    .sv-testimonial-quote {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.15rem;
        font-style: italic;
        color: var(--sv-cream);
        line-height: 1.8;
        margin-bottom: 1.25rem;
      }
    .sv-testimonial-author {
        font-size: 0.75rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--sv-gold);
      }

    .sv-ornament {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        margin: 0.5rem 0 2rem;
        color: var(--sv-gold);
        font-size: 1.1rem;
      }
    .sv-ornament::before,
    .sv-ornament::after {
        content: '';
        flex: 1;
        max-width: 80px;
        height: 1px;
        background: var(--sv-border);
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

const ServicesPage = () => {
  useServicesStyles();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [apiServices, setApiServices] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    apiClient.get("/api/booking/services").then(res => setApiServices(res.data || [])).catch(() => setApiServices([]));
    apiClient.get("/api/gallery").then(res => setGalleryPhotos(res.data || [])).catch(() => setGalleryPhotos([]));
    apiClient.get("/api/reviews").then(res => setReviews((res.data || []).slice(0, 3))).catch(() => setReviews([]));
  }, []);

  const dynamicServices = apiServices.length
    ? apiServices.map((service, index) => {
        const fallback = SERVICES[index % SERVICES.length];
        const visual = galleryPhotos[index % Math.max(galleryPhotos.length, 1)];
        return {
          id: service.id,
          title: service.name,
          desc: service.description || fallback.desc,
          img: visual?.image_data || fallback.img,
          icon: fallback.icon,
          price: service.price,
          duration: service.duration,
        };
      })
    : SERVICES;
  const serviceGallery = galleryPhotos.length
    ? galleryPhotos.slice(0, 6).map(photo => ({ src: photo.image_data, alt: photo.title }))
    : GALLERY;
  const testimonials = reviews.length
    ? reviews.map(review => ({
        quote: review.comment,
        author: review.client_name || "Client Mr. Renaudin",
      }))
    : TESTIMONIALS;

  return (
    <div className="sv-root">
      <div className="sv-inner">
        
        {/* Hero */}
        <section className="sv-hero">
          <div className="sv-hero-bg" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <motion.p
              className="sv-eyebrow"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Shawinigan, Québec
            </motion.p>

            <motion.h1
              className="sv-display"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", marginBottom: "1.5rem" }}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              L'Expérience<br />
              <span style={{ color: "var(--sv-gold)" }}>Barbershop Premium</span>
            </motion.h1>

            <motion.p
              className="sv-serif-body"
              style={{ maxWidth: "680px", margin: "0 auto 1.5rem" }}
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Entrez dans notre salon où tradition et modernité se rencontrent. Fauteuils en cuir, serviettes chaudes, 
              produits haut de gamme — chaque détail est pensé pour votre confort et votre style.
            </motion.p>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              <a href="#services" className="sv-btn-gold" aria-label="Découvrez nos services">
                Voir nos prestations
              </a>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sv-address-badge"
              >
                📍 {ADDRESS}
              </a>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="sv-section-pad" style={{ background: "var(--sv-charcoal)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                <p className="sv-eyebrow">11 Services Signature</p>
                <span className="sv-gold-rule" />
                <h2 className="sv-display" style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", marginBottom: "1rem" }}>
                  Nos Prestations au Salon
                </h2>
                <p className="sv-serif-body" style={{ maxWidth: "680px", margin: "0 auto" }}>
                  Chaque service est réalisé dans notre espace dédié à Shawinigan. Réservation en ligne ou par téléphone.
                </p>
              </div>
            </FadeIn>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2rem",
            }}>
              {dynamicServices.map((service, i) => (
                <FadeIn key={service.id} delay={i * 0.06}>
                  <div className="sv-service-card">
                    <div className="sv-service-img-wrap">
                      <img 
                        src={service.img} 
                        alt={service.title}
                        className="sv-service-img"
                        loading="lazy"
                      />
                      <div className="sv-service-icon" aria-hidden="true">{service.icon}</div>
                    </div>
                    <div className="sv-service-body">
                      <h3 className="sv-service-title">{service.title}</h3>
                      <p className="sv-service-desc">{service.desc}</p>
                      {service.price && (
                        <p className="sv-service-desc" style={{ color: "var(--sv-gold)", fontWeight: 700 }}>
                          {service.duration} min · {service.price}$ CAD
                        </p>
                      )}
                      <button
                        className="sv-btn-gold"
                        onClick={() => navigate("/reserver")}
                        aria-label={`Réserver ${service.title}`}
                      >
                        Réserver
                      </button>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Galerie Salon */}
        <section className="sv-section-pad" style={{ background: "var(--sv-black)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <p className="sv-eyebrow">Notre espace</p>
                <span className="sv-gold-rule" />
                <h2 className="sv-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "1rem" }}>
                  Bienvenue au Salon
                </h2>
                <p className="sv-serif-body" style={{ maxWidth: "600px", margin: "0 auto" }}>
                  Un lieu propre, moderne et accueillant. 3 fauteuils, produits Redken & American Crew, café offert.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="sv-gallery-grid">
                {serviceGallery.map((img, i) => (
                  <div key={i} className="sv-gallery-item">
                    <img src={img.src} alt={img.alt} className="sv-gallery-img" loading="lazy" />
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Testimonials */}
        <section className="sv-section-pad" style={{ background: "var(--sv-charcoal)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                <p className="sv-eyebrow">Témoignages clients</p>
                <span className="sv-gold-rule" />
                <h2 className="sv-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                  Ce qu'ils disent du salon
                </h2>
              </div>
            </FadeIn>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
              gap: "2rem" 
            }}>
              {testimonials.map((t, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="sv-testimonial-card">
                    <p className="sv-testimonial-quote">"{t.quote}"</p>
                    <div className="sv-ornament" aria-hidden="true">✦</div>
                    <span className="sv-testimonial-author">— {t.author}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="sv-section-pad" style={{ 
          background: "var(--sv-black)",
          borderTop: "1px solid var(--sv-border)",
          textAlign: "center"
        }}>
          <FadeIn>
            <p className="sv-eyebrow">Prêt ?</p>
            <span className="sv-gold-rule" />
            <h2 className="sv-display" style={{ 
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)", 
              maxWidth: "600px", 
              margin: "0 auto 1.5rem" 
            }}>
              Passez au salon
            </h2>
            <p className="sv-serif-body" style={{ maxWidth: "480px", margin: "0 auto 2.5rem" }}>
              Réservez en ligne ou passez nous voir au {ADDRESS}. Walk-ins acceptés selon disponibilité.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
              <button className="sv-btn-gold" onClick={() => navigate("/reserver")}>
                Prendre rendez-vous
              </button>
              <a href={`tel:${PHONE}`} className="sv-btn-outline">
                {PHONE}
              </a>
            </div>
          </FadeIn>
        </section>

      </div>
    </div>
  );
};

export default ServicesPage;
