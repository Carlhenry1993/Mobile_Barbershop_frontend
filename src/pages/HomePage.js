import React, { Suspense, lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ErrorBoundary } from "react-error-boundary";
import { motion } from "framer-motion";
import ButtonHome from "../components/ButtonHome";

// Lazy-loaded components
const Header = lazy(() => import("../components/Header"));
const Footer = lazy(() => import("../components/Footer"));

// Error fallback
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-700 rounded-lg mx-4 my-8">
      <p className="font-bold">Une erreur est survenue :</p>
      <pre className="text-sm mt-2">{error.message}</pre>

      <ButtonHome
        text="Réessayer"
        onClick={resetErrorBoundary}
        className="mt-4 bg-red-600 text-white px-6 py-2 rounded"
        ariaLabel="Réessayer"
      />
    </div>
  );
};

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 18 },
  },
};

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBookNowClick = () => {
    navigate("/booking");
  };

  return (
    <>
      {/* SEO (IMPORTANT for physical business) */}
      <Helmet>
        <title>Mr. Renaudin Barbershop | Shawinigan Barber Shop</title>
        <meta
          name="description"
          content="Barbershop professionnel à Shawinigan, QC. Coupe de cheveux moderne, rasage et soins de barbe. Adresse : 462 4e Rue de la Pointe, Shawinigan."
        />
        <meta
          name="keywords"
          content="barbershop Shawinigan, barber Shawinigan, coupe de cheveux QC, rasage barbe Canada"
        />
        <meta name="geo.region" content="CA-QC" />
        <meta name="geo.placename" content="Shawinigan" />
      </Helmet>

      {/* Header */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div className="text-center py-6">Chargement...</div>}>
          <Header />
        </Suspense>
      </ErrorBoundary>

      {/* MAIN CONTENT */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* HERO SECTION */}
        <motion.section
          variants={itemVariants}
          className="relative min-h-screen flex items-center justify-center text-center px-4"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/Photos/rasage12.jpg')",
            }}
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 text-white max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Mr. Renaudin Barbershop
            </h1>

            <p className="text-lg md:text-xl font-medium mb-6">
              Barbershop professionnel à Shawinigan, QC
            </p>

            <div className="mb-6 text-sm md:text-base opacity-90">
              📍 462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7, Canada
            </div>

            <ButtonHome
              text="Réserver maintenant"
              onClick={handleBookNowClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-lg"
            />
          </div>
        </motion.section>

        {/* VALUE SECTION */}
        <motion.section
          variants={itemVariants}
          className="py-16 bg-white text-center px-4"
        >
          <h2 className="text-3xl font-bold mb-10">Pourquoi nous choisir</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Expertise",
                text: "Coiffure professionnelle avec précision et style moderne.",
              },
              {
                title: "Confort",
                text: "Service flexible en salon ou à domicile selon vos besoins.",
              },
              {
                title: "Rapidité",
                text: "Service efficace sans compromis sur la qualité.",
              },
            ].map((item, index) => (
              <div key={index} className="p-6 shadow-md rounded-lg">
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ADDRESS SECTION */}
        <motion.section
          variants={itemVariants}
          className="py-16 bg-gray-100 text-center px-4"
        >
          <h2 className="text-3xl font-bold mb-4">Notre emplacement</h2>

          <p className="text-lg">
            📍 462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7, Canada
          </p>

          <p className="text-gray-600 mt-2">
            Venez directement en salon ou réservez en ligne.
          </p>
        </motion.section>
      </motion.div>

      {/* FOOTER */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div className="text-center py-6">Chargement...</div>}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default HomePage;