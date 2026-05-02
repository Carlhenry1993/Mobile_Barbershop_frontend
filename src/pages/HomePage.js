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

const MAP_QUERY =
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

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* SEO PREMIUM LOCAL */}
      <Helmet>
        <title>Mr. Renaudin Barbershop | Shawinigan QC</title>
        <meta
          name="description"
          content="Barbershop premium à Shawinigan. Coupes modernes, dégradés propres et soins de barbe. Situé au 462 4e Rue de la Pointe."
        />
      </Helmet>

      {/* HEADER */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div className="p-4">Chargement...</div>}>
          <Header />
        </Suspense>
      </ErrorBoundary>

      {/* HERO PREMIUM */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="relative min-h-screen flex items-center justify-center text-center px-4"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Photos/rasage12.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-white max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Mr. Renaudin Barbershop
          </h1>

          <p className="mt-4 text-lg md:text-xl text-gray-200">
            Barbershop premium à Shawinigan, QC
          </p>

          <p className="mt-2 text-sm text-gray-300">{ADDRESS}</p>

          {/* CONTACT STRIP */}
          <div className="mt-6 flex flex-col md:flex-row gap-3 justify-center">
            <ButtonHome
              text="📅 Réserver"
              onClick={() => navigate("/booking")}
              className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg"
            />

            <a
              href={`tel:${PHONE}`}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg"
            >
              📞 {PHONE}
            </a>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                MAP_QUERY
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg"
            >
              📍 Directions
            </a>
          </div>
        </div>
      </motion.section>

      {/* ABOUT PREMIUM */}
      <section className="py-20 bg-white text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Expérience Barbershop Premium
        </h2>

        <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
          Chez Mr. Renaudin Barbershop, nous offrons une expérience moderne et
          professionnelle centrée sur la précision, le style et le confort. Chaque
          coupe est réalisée avec attention aux détails pour un résultat propre et
          élégant.
        </p>
      </section>

      {/* SERVICES PREMIUM GRID */}
      <section className="py-20 bg-gray-100 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          Nos services
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Fade & Dégradé",
              text: "Transitions propres et modernes adaptées à votre style.",
            },
            {
              title: "Barbe & Line-up",
              text: "Contours précis et entretien de barbe professionnel.",
            },
            {
              title: "Rasage classique",
              text: "Expérience traditionnelle avec finition parfaite.",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <h3 className="font-bold text-xl mb-2">{s.title}</h3>
              <p className="text-gray-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LOCATION PREMIUM */}
      <section className="py-20 text-center px-4">
        <h2 className="text-3xl font-bold mb-3">Notre emplacement</h2>

        <p className="text-gray-700 font-medium">{ADDRESS}</p>

        <div className="mt-8 max-w-5xl mx-auto rounded-xl overflow-hidden shadow-lg">
          <iframe
            title="Barbershop Map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              MAP_QUERY
            )}&output=embed`}
            width="100%"
            height="380"
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
          className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg"
        >
          Open in Google Maps 📍
        </a>
      </section>

      {/* CTA PREMIUM */}
      <section className="py-20 bg-black text-white text-center px-4">
        <h2 className="text-3xl font-bold mb-3">
          Prêt pour une coupe premium ?
        </h2>

        <p className="text-gray-300 mb-6">
          Réservez votre rendez-vous maintenant
        </p>

        <ButtonHome
          text="Réserver maintenant"
          onClick={() => navigate("/booking")}
          className="bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg"
        />
      </section>

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