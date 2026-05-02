import React, { Suspense, lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ErrorBoundary } from "react-error-boundary";
import { motion } from "framer-motion";
import ButtonHome from "../components/ButtonHome";

const Header = lazy(() => import("../components/Header"));
const Footer = lazy(() => import("../components/Footer"));

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert" className="p-4 bg-red-100 text-red-700 rounded-lg mx-4 my-8">
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
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
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
      <Helmet>
        <title>Mr. Renaudin Barbershop | Shawinigan, QC</title>
        <meta
          name="description"
          content="Barbershop professionnel à Shawinigan. Coupe de cheveux, dégradés modernes et taille de barbe. Situé au 462 4e Rue de la Pointe, Shawinigan, QC."
        />
      </Helmet>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div className="p-4">Chargement...</div>}>
          <Header />
        </Suspense>
      </ErrorBoundary>

      {/* HERO */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="relative min-h-screen flex items-center justify-center text-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Photos/rasage12.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/50" />

        <motion.div variants={item} className="relative z-10 text-white px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Mr. Renaudin Barbershop
          </h1>

          <p className="mt-4 text-lg md:text-xl">
            Barbershop professionnel à Shawinigan, QC
          </p>

          <p className="mt-2 text-sm opacity-80">
            📍 462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7, Canada
          </p>

          <div className="mt-6">
            <ButtonHome
              text="Prendre rendez-vous"
              onClick={() => navigate("/booking")}
              className="bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* POSITIONNEMENT SALON */}
      <section className="py-16 bg-white text-center px-4">
        <h2 className="text-3xl font-bold mb-4">
          Votre barbershop de confiance à Shawinigan
        </h2>

        <p className="max-w-3xl mx-auto text-gray-600 text-lg">
          Mr. Renaudin Barbershop est un salon de coiffure masculin moderne situé
          au cœur de Shawinigan. Nous offrons des coupes précises, des dégradés
          propres et un service professionnel dans une ambiance propre, moderne et
          accueillante.
        </p>
      </section>

      {/* SERVICES */}
      <section className="py-16 bg-gray-100 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Nos services</h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Coupe moderne",
              text: "Dégradés propres et styles actuels adaptés à votre visage.",
            },
            {
              title: "Barbe & soin",
              text: "Taille de barbe précise et finition professionnelle.",
            },
            {
              title: "Rasage classique",
              text: "Expérience traditionnelle avec finition nette.",
            },
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-xl mb-2">{s.title}</h3>
              <p className="text-gray-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LOCALISATION CLAIRE */}
      <section className="py-16 text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Nous trouver</h2>

        <p className="text-lg font-medium">
          📍 462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7, Canada
        </p>

        <p className="text-gray-600 mt-2">
          Facile d’accès • Stationnement disponible • Rendez-vous recommandés
        </p>
      </section>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div className="p-4">Chargement...</div>}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default HomePage;