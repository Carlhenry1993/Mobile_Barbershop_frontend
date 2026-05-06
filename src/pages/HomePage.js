import React, { Suspense, lazy, useEffect, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ErrorBoundary } from "react-error-boundary";
import { motion, useInView } from "framer-motion";

/* ───────── Lazy Components ───────── */
const Header = lazy(() => import("../components/Header"));
const Footer = lazy(() => import("../components/Footer"));

/* ───────── Constants ───────── */
const ADDRESS = "462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7, Canada";
const PHONE = "514-778-8318";
const MAP_QUERY = "462 4e Rue de la Pointe Shawinigan QC G9N 1G7";

/* ───────── Fonts (optimized) ───────── */
const FontLink = memo(() => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');

    :root {
      --black:#0e1015;
      --charcoal:#161b24;
      --card:#1e2535;
      --border:#2a3348;
      --gold:#d4a843;
      --gold-light:#f0c96a;
      --light:#b8c8da;
      --cream:#eef2f7;
      --muted:#7888a0;
    }

    * { box-sizing:border-box; margin:0; padding:0; }

    body {
      background:var(--black);
      color:var(--cream);
      font-family:'DM Sans', sans-serif;
    }

    .section { padding:6rem 1.5rem; }
    .container { max-width:1100px; margin:auto; }

    .btn {
      padding:1rem 2rem;
      text-transform:uppercase;
      cursor:pointer;
      border:none;
      font-size:0.85rem;
    }

    .btn-gold {
      background:var(--gold);
      color:#000;
    }

    .btn-outline {
      border:1px solid rgba(255,255,255,0.3);
      color:white;
      background:transparent;
    }

    .grid {
      display:grid;
      gap:1.5rem;
      grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
    }
  `}</style>
));

/* ───────── Error UI ───────── */
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div style={{ padding: 20, background: "#1a0000", color: "#ff6b6b" }}>
    <strong>Erreur :</strong>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Réessayer</button>
  </div>
);

/* ───────── Animation ───────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1 }
  })
};

const FadeIn = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      custom={delay}
    >
      {children}
    </motion.div>
  );
};

/* ───────── Data ───────── */
const SERVICES = [
  { title: "Fade", desc: "Dégradé précis et maîtrisé." },
  { title: "Dreadlocks", desc: "Création et entretien." },
  { title: "Afro", desc: "Volume naturel structuré." },
  { title: "Waves", desc: "Texture parfaite 360°." }
];

/* ───────── Page ───────── */
const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <>
      <FontLink />

      <Helmet>
        <title>Mr. Renaudin Barbershop</title>
        <meta
          name="description"
          content="Barbershop premium à Shawinigan. Fades, afro, dreadlocks."
        />
      </Helmet>

      {/* HEADER */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
        </Suspense>
      </ErrorBoundary>

      {/* HERO */}
      <section style={{ position: "relative", minHeight: "100vh" }}>
        <img
          src="/Photos/rasage12.jpeg"
          alt="Barbershop premium"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute"
          }}
        />

        <div style={{ position: "relative", padding: "6rem 1.5rem" }}>
          <h1 style={{ fontSize: "3rem" }}>
            Mr. Renaudin <br /> Barbershop
          </h1>

          <p style={{ marginTop: 10 }}>
            Coupe premium pour homme moderne.
          </p>

          <div style={{ marginTop: 20 }}>
            <button
              className="btn btn-gold"
              onClick={() => navigate("/booking")}
            >
              Réserver
            </button>

            <a href={`tel:${PHONE}`} className="btn btn-outline">
              Appeler
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section">
        <div className="container">
          <h2>Services</h2>

          <div className="grid">
            {SERVICES.map((s, i) => (
              <FadeIn key={s.title} delay={i}>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="section">
        <div className="container">
          <h2>Localisation</h2>

          <iframe
            title="Google Map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
            width="100%"
            height="400"
            loading="lazy"
            style={{ border: 0 }}
            referrerPolicy="no-referrer-when-downgrade"
          />

          <p style={{ marginTop: 10 }}>{ADDRESS}</p>
          <a href={`tel:${PHONE}`}>{PHONE}</a>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: "center" }}>
        <h2>Votre style commence ici</h2>

        <button
          className="btn btn-gold"
          onClick={() => navigate("/booking")}
        >
          Prendre rendez-vous
        </button>
      </section>

      {/* FOOTER */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div>Loading...</div>}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default HomePage;