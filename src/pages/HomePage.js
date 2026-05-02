import React, { Suspense, lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ErrorBoundary } from "react-error-boundary";
import { motion } from "framer-motion";
import ButtonHome from "../components/ButtonHome";

const Header = lazy(() => import("../components/Header"));
const Footer = lazy(() => import("../components/Footer"));

const ADDRESS =
  "462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7, Canada";

const PHONE = "514-778-8318";

const MAP_QUERY = "462 4e Rue de la Pointe Shawinigan QC G9N 1G7";

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="p-4 bg-red-100 text-red-700 rounded-lg mx-4 my-8">
    <p className="font-bold">Erreur technique :</p>
    <pre className="text-sm mt-2">{error.message}</pre>
    <ButtonHome
      text="Réessayer"
      onClick={resetErrorBoundary}
      className="mt-4 bg-red-600 text-white px-6 py-2 rounded"
    />
  </div>
);

const fade = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* SEO ELITE LOCAL */}
      <Helmet>
        <title>Mr. Renaudin Barbershop | Shawinigan Premium Barber</title>
        <meta
          name="description"
          content="Barbershop premium à Shawinigan. Fade, coupe moderne, barbe, rasage traditionnel. Expérience professionnelle haut de gamme au Québec."
        />
      </Helmet>

      {/* HEADER */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div>Chargement...</div>}>
          <Header />
        </Suspense>
      </ErrorBoundary>

      {/* HERO ELITE */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={fade}
        className="relative min-h-screen flex items-center justify-center text-center px-4"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Photos/rasage12.jpeg')" }}
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 text-white max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Mr. Renaudin Barbershop
          </h1>

          <p className="mt-4 text-xl text-gray-200">
            Le barbershop premium de Shawinigan
          </p>

          <p className="mt-2 text-sm text-gray-300">{ADDRESS}</p>

          <div className="mt-6 flex flex-col md:flex-row gap-3 justify-center">
            <ButtonHome
              text="📅 Réserver maintenant"
              onClick={() => navigate("/booking")}
              className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg"
            />

            <a
              href={`tel:${PHONE}`}
              className="bg-green-600 text-white font-bold px-6 py-3 rounded-lg"
              rel="noopener noreferrer"
            >
              📞 Appeler
            </a>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                MAP_QUERY
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg"
            >
              📍 Directions
            </a>
          </div>
        </div>
      </motion.section>

      {/* BRAND STORY (TRÈS IMPORTANT MARKETING) */}
      <section className="py-24 bg-white text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          Une expérience, pas seulement une coupe
        </h2>

        <p className="mt-6 max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
          Chez Mr. Renaudin Barbershop, nous ne faisons pas seulement des coupes.
          Nous construisons du style, de la confiance et une identité.
          Chaque client reçoit une attention personnalisée avec des techniques modernes
          et un souci du détail digne des meilleurs barbershops de Toronto et New York.
        </p>
      </section>

      {/* TRUST / LOCAL SEO */}
      <section className="py-20 bg-gray-100 text-center px-4">
        <h2 className="text-3xl font-bold">Barbershop de confiance à Shawinigan</h2>

        <p className="mt-4 max-w-3xl mx-auto text-gray-600">
          Situé au cœur de Shawinigan, nous servons une clientèle locale fidèle
          qui recherche un service professionnel, propre et moderne.
          Notre objectif : vous offrir une coupe qui améliore votre image immédiatement.
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold">🔥 Fades parfaits</h3>
            <p className="text-gray-600">Transitions nettes et modernes</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold">✂️ Barbe premium</h3>
            <p className="text-gray-600">Contours propres et stylés</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold">🪒 Rasage expert</h3>
            <p className="text-gray-600">Expérience classique et relaxante</p>
          </div>
        </div>
      </section>

      {/* VISIT SHOP + MAP ELITE */}
      <section className="py-24 bg-white text-center px-4">
        <h2 className="text-3xl font-bold">Visitez notre barbershop</h2>

        <p className="mt-3 text-gray-600">{ADDRESS}</p>
        <p className="text-gray-700 font-semibold">{PHONE}</p>

        <div className="mt-10 max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
          <iframe
            title="Google Maps Location"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              MAP_QUERY
            )}&output=embed`}
            width="100%"
            height="420"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            MAP_QUERY
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold"
        >
          Ouvrir dans Google Maps 📍
        </a>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-24 bg-black text-white text-center px-4">
        <h2 className="text-3xl font-bold">Pourquoi les clients nous choisissent</h2>

        <div className="mt-10 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-gray-200">
          <div>
            <h3 className="font-bold">✔ Qualité constante</h3>
            <p>Chaque coupe est soignée au détail près</p>
          </div>

          <div>
            <h3 className="font-bold">✔ Expérience premium</h3>
            <p>Ambiance propre et professionnelle</p>
          </div>

          <div>
            <h3 className="font-bold">✔ Clients fidèles</h3>
            <p>La confiance se construit avec le temps</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-yellow-500 text-center px-4">
        <h2 className="text-3xl font-bold text-black">
          Prêt pour votre nouvelle image ?
        </h2>

        <p className="mt-2 text-black">
          Réservez votre rendez-vous maintenant
        </p>

        <ButtonHome
          text="Réserver maintenant"
          onClick={() => navigate("/booking")}
          className="mt-6 bg-black text-white px-10 py-3 rounded-xl font-bold"
        />
      </section>

      {/* FOOTER */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div>Chargement...</div>}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default HomePage;