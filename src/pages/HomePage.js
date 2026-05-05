import React, { Suspense, lazy, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ErrorBoundary } from "react-error-boundary";
import { motion, useInView } from "framer-motion";
import ButtonHome from "../components/ButtonHome";

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
    <p style={{ fontWeight: "bold" }}>Something went wrong:</p>
    <pre style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>{error.message}</pre>
    <button onClick={resetErrorBoundary} style={{ marginTop: "1rem", padding: "0.5rem 1.25rem", background: "#c9a84c", color: "#000", border: "none", cursor: "pointer" }}>
      Retry
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
    title: "Signature Fade",
    desc: "Precision skin-to-length fades with razor-sharp lines that define your silhouette.",
  },
  {
    icon: "✦",
    title: "Classic Cut",
    desc: "Timeless scissor work shaped to your face, lifestyle, and personal aesthetic.",
  },
  {
    icon: "✦",
    title: "Beard Sculpting",
    desc: "Expert contouring and detailing to keep your beard clean, shaped, and intentional.",
  },
  {
    icon: "✦",
    title: "Hot Towel Shave",
    desc: "A traditional straight-razor experience with hot towels, shave cream, and aftercare.",
  },
  {
    icon: "✦",
    title: "Hair & Beard Combo",
    desc: "The full treatment — cut and beard together for a completely polished look.",
  },
  {
    icon: "✦",
    title: "Lineup & Edge-Up",
    desc: "Crisp hairline definition and temple shaping that frames your face perfectly.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Best fade I've ever had. The attention to detail is unmatched — I won't go anywhere else.",
    author: "Marc-André T.",
  },
  {
    quote: "Professional, precise, and the atmosphere is outstanding. Feels like a proper grooming experience.",
    author: "Dominic R.",
  },
  {
    quote: "They took their time to understand exactly what I wanted. Left looking and feeling sharper than ever.",
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
        <title>Mr. Renaudin Barbershop | Premium Barber — Shawinigan, QC</title>
        <meta
          name="description"
          content="Mr. Renaudin Barbershop — Shawinigan's premier barbershop. Expert fades, classic cuts, beard sculpting, and traditional hot towel shaves. Book your appointment today."
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
            Established in Shawinigan, Québec
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
            Where precision meets tradition. A premium grooming experience crafted for the modern gentleman.
          </motion.p>

          <motion.div
            style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2.5rem" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <button className="btn-gold" onClick={() => navigate("/booking")}>
              Book an Appointment
            </button>
            <a href={`tel:${PHONE}`} className="btn-outline">
              Call Us
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Get Directions
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
            { n: "10+", label: "Years of Experience" },
            { n: "5★", label: "Client Rating" },
            { n: "6", label: "Signature Services" },
            { n: "100%", label: "Satisfaction Focused" },
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
          <p className="eyebrow">Our Philosophy</p>
          <span className="gold-rule" />
          <h2
            className="display"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.75rem)", maxWidth: "700px", margin: "0 auto 2rem" }}
          >
            More than a haircut.<br />An identity.
          </h2>
        </FadeIn>
        <FadeIn delay={1}>
          <p className="serif-body" style={{ maxWidth: "680px", margin: "0 auto" }}>
            At Mr. Renaudin Barbershop, every appointment is a deliberate ritual. We believe 
            great grooming is the foundation of confidence — and confidence opens every door. 
            Our barbers are trained in both modern technique and classic craft, delivering results 
            worthy of the best shops in Montréal, Toronto, and beyond.
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
              <p className="eyebrow">What We Offer</p>
              <span className="gold-rule" />
              <h2
                className="display"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}
              >
                Our Services
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
                Reserve Your Seat
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
                  "Every detail is deliberate.<br />Every cut is a statement."
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
            <p className="eyebrow">Why Choose Us</p>
            <span className="gold-rule" style={{ margin: "0 0 1.5rem" }} />
            <h2
              className="display"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.9rem)", marginBottom: "1.75rem", lineHeight: 1.1 }}
            >
              The standard of a luxury barbershop, right here in Shawinigan.
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                {
                  title: "Consistent Precision",
                  body: "Every visit delivers the same exacting quality. No guesswork — just reliable, repeatable excellence.",
                },
                {
                  title: "Personalized Service",
                  body: "We listen first. Your face shape, lifestyle, and preferences guide every decision we make.",
                },
                {
                  title: "Premium Atmosphere",
                  body: "A clean, professional environment that respects your time and elevates the entire experience.",
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
              <p className="eyebrow">Client Testimonials</p>
              <span className="gold-rule" />
              <h2 className="display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                What Our Clients Say
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
              <p className="eyebrow">Find Us</p>
              <span className="gold-rule" />
              <h2 className="display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "0.75rem" }}>
                Visit the Shop
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
                Open in Google Maps
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
          <p className="eyebrow">Ready?</p>
          <span className="gold-rule" />
          <h2
            className="display"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", maxWidth: "600px", margin: "0 auto 1.5rem" }}
          >
            Your best look starts here.
          </h2>
          <p className="serif-body" style={{ maxWidth: "480px", margin: "0 auto 2.5rem" }}>
            Book your appointment online or give us a call — we're ready to deliver a cut worth remembering.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            <button className="btn-gold" onClick={() => navigate("/booking")}>
              Book an Appointment
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