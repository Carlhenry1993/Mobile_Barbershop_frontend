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

const MAPS_QUERY =
  "462 4e Rue de la Pointe Shawinigan QC G9N 1G7";

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="p-4 bg-red-100 text-red-700 rounded-lg mx-4 my-8">
    <p className="font-bold">Une erreur est survenue :</p>
    <pre className="text-sm mt-2">{error.message}</pre>
    <ButtonHome
      text="Réessayer"
      onClick={resetErrorBoundary}
      className="mt-4 bg-red-600 text-white px-6 py-2 rounded"
    />
  </div>
);

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* SEO LOCAL BUSINESS */}
      <Helmet>
        <title>Mr. Renaudin Barbershop | Shawinigan QC</title>

        <meta
          name="description"
          content="Barbershop professionnel à Shawinigan, QC. Coupe de cheveux moderne, dégradés, rasage de barbe. Situé au 462 4e Rue de la Pointe."
        />

        <meta
          name="keywords"
          content="barbershop Shawinigan, barber QC, coupe cheveux Shawinigan, fade haircut Canada"
        />

        <meta name="geo.region" content="CA-QC" />
        <meta name="geo.placename" content="Shawinigan" />
      </Helmet>

      {/* HEADER */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div className="p-4">Chargement...</div>}>
          <Header />
        </Suspense>
      </ErrorBoundary>

      <motion.div initial="hidden" animate="show" variants={container}>
        {/* HERO */}
        <motion.section
          variants={item}
          className="relative min-h-screen flex items-center justify-center text-center px-4"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/Photos/rasage12.jpg')" }}
          />
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 text-white max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold">
              Mr. Renaudin Barbershop
            </h1>

            <p className="mt-4 text-lg">
              Barbershop professionnel à Shawinigan, QC
            </p>

            <p className="mt-2 text-sm opacity-80">{ADDRESS}</p>

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex flex-col md:flex-row gap-3 justify-center">
              <ButtonHome
                text="📅 Réserver"
                onClick={() => navigate("/booking")}
                className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg"
              />

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  MAPS_QUERY
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg"
              >
                📍 Directions
              </a>

              <a
                href="tel:+1"
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg"
              >
                📞 Call Now
              </a>
            </div>
          </div>
        </motion.section>

        {/* TRUST / BUSINESS INFO */}
        <motion.section
          variants={item}
          className="py-16 bg-white text-center px-4"
        >
          <h2 className="text-3xl font-bold mb-4">
            Barber professionnel à Shawinigan
          </h2>

          <p className="max-w-3xl mx-auto text-gray-600">
            Nous offrons des coupes modernes, dégradés propres et tailles de
            barbe précises dans un environnement propre, professionnel et
            accueillant.
          </p>
        </motion.section>

        {/* SERVICES */}
        <motion.section
          variants={item}
          className="py-16 bg-gray-100 px-4"
        >
          <h2 className="text-3xl font-bold text-center mb-10">
            Nos services
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "Coupe moderne",
                text: "Fade, taper, styles actuels et précis.",
              },
              {
                title: "Barbe",
                text: "Line-up propre et entretien de barbe.",
              },
              {
                title: "Rasage",
                text: "Rasage classique et finition nette.",
              },
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-xl mb-2">{s.title}</h3>
                <p className="text-gray-600">{s.text}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* GOOGLE MAPS */}
        <motion.section
          variants={item}
          className="py-16 text-center px-4"
        >
          <h2 className="text-3xl font-bold mb-4">Nous trouver</h2>

          <p className="text-gray-700 font-medium">{ADDRESS}</p>

          <div className="mt-6 max-w-4xl mx-auto">
            <iframe
              title="Barbershop Location"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                MAPS_QUERY
              )}&output=embed`}
              width="100%"
              height="350"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              MAPS_QUERY
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg"
          >
            Open in Google Maps 📍
          </a>
        </motion.section>

        {/* CTA */}
        <motion.section
          variants={item}
          className="py-16 bg-black text-white text-center px-4"
        >
          <h2 className="text-3xl font-bold mb-3">
            Prêt pour une coupe propre ?
          </h2>

          <p className="mb-6 opacity-80">
            Réservez votre rendez-vous maintenant
          </p>

          <ButtonHome
            text="Réserver maintenant"
            onClick={() => navigate("/booking")}
            className="bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg"
          />
        </motion.section>
      </motion.div>

      {/* FOOTER */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div className="p-4">Chargement...</div>}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default HomePage;