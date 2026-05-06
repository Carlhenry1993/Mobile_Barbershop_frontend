import React from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const ADDRESS = "462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7, Canada";
const PHONE = "514-778-8318";
const EMAIL = "mrrenaudinbarber@gmail.com";
const MAP_QUERY = "462 4e Rue de la Pointe Shawinigan QC G9N 1G7";

const SERVICES = [
  "Boule à Zéro",
  "Flat Top",
  "Dreadlocks",
  "Mini Afro",
  "Afro Naturelle",
  "Nattes & Tresses Collées",
  "Coupe Ultra Courte Classique",
  "Courte Dégradée",
  "Fade (Dégradé)",
  "Afro Taper",
  "Waves 360",
];

const footerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

  .ft-root {
    --ft-black:   #0e1015;
    --ft-charcoal:#161b24;
    --ft-card:    #1e2535;
    --ft-border:  #2a3348;
    --ft-gold:    #d4a843;
    --ft-gold-lt: #f0c96a;
    --ft-steel:   #8ba8c8;
    --ft-cream:   #eef2f7;
    --ft-light:   #b8c8da;
    --ft-muted:   #7888a0;

    background: var(--ft-black);
    color: var(--ft-cream);
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    position: relative;
    overflow: hidden;
  }

  /* ── Grain overlay ── */
  .ft-root::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.03;
  }

  .ft-inner { position: relative; z-index: 1; }

  /* ── Top gold border ── */
  .ft-topbar {
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--ft-gold), var(--ft-gold-lt), var(--ft-gold), transparent);
  }

  /* ── CTA strip ── */
  .ft-cta {
    border-bottom: 1px solid var(--ft-border);
    padding: 4rem 1.5rem;
    text-align: center;
  }

  .ft-cta-eyebrow {
    font-size: 0.65rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--ft-gold);
    margin-bottom: 0.75rem;
  }

  .ft-cta-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 2.75rem);
    font-weight: 900;
    color: var(--ft-cream);
    line-height: 1.1;
    margin-bottom: 0.6rem;
  }

  .ft-cta-sub {
    font-size: 0.9rem;
    color: var(--ft-light);
    letter-spacing: 0.04em;
    margin-bottom: 2rem;
  }

  .ft-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--ft-gold);
    color: var(--ft-black);
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.82rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.9rem 2.25rem;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background 0.25s, transform 0.2s;
  }

  .ft-cta-btn:hover {
    background: var(--ft-gold-lt);
    transform: translateY(-2px);
  }

  /* ── Grid ── */
  .ft-grid {
    max-width: 1100px;
    margin: 0 auto;
    padding: 4.5rem 1.5rem;
    display: grid;
    grid-template-columns: 2fr 1.4fr 1fr 1fr;
    gap: 3rem;
    border-bottom: 1px solid var(--ft-border);
  }

  @media (max-width: 900px) {
    .ft-grid { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
  }

  @media (max-width: 540px) {
    .ft-grid { grid-template-columns: 1fr; gap: 2rem; }
  }

  /* ── Column headings ── */
  .ft-col-title {
    font-family: 'Playfair Display', serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--ft-cream);
    margin-bottom: 1.25rem;
    letter-spacing: 0.02em;
  }

  .ft-col-title::after {
    content: '';
    display: block;
    width: 28px;
    height: 1.5px;
    background: var(--ft-gold);
    margin-top: 0.5rem;
  }

  /* ── Brand column ── */
  .ft-brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 900;
    color: var(--ft-cream);
    line-height: 1.1;
    margin-bottom: 0.25rem;
  }

  .ft-brand-name span { color: var(--ft-gold); }

  .ft-brand-tagline {
    font-size: 0.78rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ft-muted);
    margin-bottom: 1.25rem;
  }

  .ft-brand-desc {
    font-size: 0.88rem;
    color: var(--ft-light);
    line-height: 1.75;
    margin-bottom: 1.5rem;
  }

  /* ── Links ── */
  .ft-link {
    font-size: 0.88rem;
    color: var(--ft-light);
    text-decoration: none;
    display: block;
    margin-bottom: 0.55rem;
    transition: color 0.2s;
  }

  .ft-link:hover { color: var(--ft-gold); }

  .ft-address {
    font-size: 0.88rem;
    color: var(--ft-light);
    line-height: 1.7;
    margin-bottom: 1.25rem;
  }

  /* ── Map link ── */
  .ft-map-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ft-gold);
    text-decoration: none;
    border-bottom: 1px solid rgba(212,168,67,0.35);
    padding-bottom: 2px;
    transition: border-color 0.2s, color 0.2s;
  }

  .ft-map-btn:hover { border-color: var(--ft-gold); color: var(--ft-gold-lt); }

  /* ── Contact info ── */
  .ft-contact-row {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    margin-bottom: 0.85rem;
  }

  .ft-contact-icon {
    color: var(--ft-gold);
    font-size: 0.75rem;
    margin-top: 0.2rem;
    flex-shrink: 0;
  }

  .ft-contact-text {
    font-size: 0.88rem;
    color: var(--ft-light);
    text-decoration: none;
    line-height: 1.5;
    transition: color 0.2s;
  }

  a.ft-contact-text:hover { color: var(--ft-gold); }

  /* ── Services list ── */
  .ft-services-list {
    list-style: none;
    padding: 0;
    margin: 0;
    columns: 1;
  }

  .ft-services-list li {
    font-size: 0.83rem;
    color: var(--ft-light);
    padding: 0.3rem 0;
    border-bottom: 1px solid rgba(42,51,72,0.7);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.2s;
  }

  .ft-services-list li:last-child { border-bottom: none; }

  .ft-services-list li::before {
    content: '✦';
    font-size: 0.55rem;
    color: var(--ft-gold);
    flex-shrink: 0;
  }

  /* ── Social icons ── */
  .ft-social {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .ft-social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border: 1px solid var(--ft-border);
    color: var(--ft-muted);
    text-decoration: none;
    font-size: 1rem;
    transition: border-color 0.25s, color 0.25s, transform 0.2s;
  }

  .ft-social-link:hover {
    border-color: var(--ft-gold);
    color: var(--ft-gold);
    transform: translateY(-3px);
  }

  /* ── Bottom bar ── */
  .ft-bottom {
    max-width: 1100px;
    margin: 0 auto;
    padding: 1.75rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .ft-bottom-copy {
    font-size: 0.78rem;
    color: var(--ft-muted);
    letter-spacing: 0.04em;
  }

  .ft-bottom-copy span { color: var(--ft-gold); }

  .ft-bottom-right {
    font-size: 0.75rem;
    color: var(--ft-muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .ft-ornament {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--ft-gold);
    font-size: 0.6rem;
    letter-spacing: 0.2em;
  }

  .ft-ornament::before,
  .ft-ornament::after {
    content: '';
    display: block;
    width: 40px;
    height: 1px;
    background: var(--ft-border);
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ft-root">
      <style>{footerStyles}</style>

      {/* ── Gold top border ── */}
      <div className="ft-topbar" />

      <div className="ft-inner">

        {/* ── CTA Strip ── */}
        <div className="ft-cta">
          <p className="ft-cta-eyebrow">Prêt pour votre transformation ?</p>
          <h2 className="ft-cta-title">
            Votre meilleur look<br />commence ici.
          </h2>
          <p className="ft-cta-sub">
            Shawinigan · Barbershop Premium · Sur rendez-vous
          </p>
          <a href="/booking" className="ft-cta-btn">
            Réserver maintenant
          </a>
        </div>

        {/* ── Main Grid ── */}
        <div className="ft-grid">

          {/* Brand */}
          <div>
            <p className="ft-brand-name">
              Mr. Renaudin<br />
              <span>Barbershop</span>
            </p>
            <p className="ft-brand-tagline">Shawinigan, Québec</p>
            <p className="ft-brand-desc">
              Un barbershop premium au cœur de Shawinigan. Précision, style et 
              expérience artisanale pour l'homme moderne qui refuse le compromis.
            </p>

            {/* Social */}
            <div className="ft-social">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="ft-social-link"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="ft-social-link"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="ft-social-link"
              >
                <FaXTwitter />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="ft-social-link"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="ft-col-title">Nos Services</h3>
            <ul className="ft-services-list">
              {SERVICES.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Visit */}
          <div>
            <h3 className="ft-col-title">Nous Trouver</h3>
            <p className="ft-address">{ADDRESS}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ft-map-btn"
            >
              ↗ Google Maps
            </a>
          </div>

          {/* Contact */}
          <div>
            <h3 className="ft-col-title">Contact</h3>

            <div className="ft-contact-row">
              <span className="ft-contact-icon">✦</span>
              <a href={`tel:${PHONE}`} className="ft-contact-text">
                {PHONE}
              </a>
            </div>

            <div className="ft-contact-row">
              <span className="ft-contact-icon">✦</span>
              <a href={`mailto:${EMAIL}`} className="ft-contact-text">
                {EMAIL}
              </a>
            </div>

            <div className="ft-contact-row" style={{ marginTop: "1rem" }}>
              <span className="ft-contact-icon">✦</span>
              <span className="ft-contact-text">
                Lundi – Samedi<br />
                9h00 – 19h00
              </span>
            </div>

            <div className="ft-contact-row">
              <span className="ft-contact-icon">✦</span>
              <span className="ft-contact-text">
                Dimanche : Fermé
              </span>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="ft-bottom">
          <p className="ft-bottom-copy">
            © {currentYear} <span>Mr. Renaudin Barbershop</span> — Shawinigan, QC
          </p>
          <div className="ft-ornament">✦</div>
          <p className="ft-bottom-right">
            Artisanat · Précision · Excellence
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;