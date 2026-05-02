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
    <p className="font-bold">Une erreur est survenue :</p>
    <pre className="text-sm mt-2">{error.message}</pre>
    <ButtonHome
      text="Réessayer"
      onClick={resetErrorBoundary}
      className="mt-4 bg-red-600 text-white px-6 py-2 rounded"
    />
  </div>
);

const fade = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* SEO LOCAL */}
      <Helmet>
        <title>Mr. Renaudin Barbershop | Shawinigan</title>
        <meta
          name="description"
          content="Barbershop professionnel à Shawinigan. Coupes modernes, dégradés, barbe et rasage. Expérience premium au 462 4e Rue de la Pointe."
        />
      </Helmet>

      {/* HEADER */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div>Chargement...</div>}>
          <Header />
        </Suspense>
      </ErrorBoundary>

      {/* HERO */}
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
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-white max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Mr. Renaudin Barbershop
          </h1>

          <p className="mt-4 text-xl text-gray-200">
            L’expérience barbershop premium à Shawinigan
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
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold"
            >
              📞 Appeler
            </a>
          </div>
        </div>
      </motion.section>

      {/* SECTION CONFIANCE */}
      <section className="py-20 bg-white text-center px-4">
        <h2 className="text-3xl font-bold">Une expérience premium pour chaque client</h2>
        <p className="mt-4 max-w-3xl mx-auto text-gray-600">
          Chez Mr. Renaudin Barbershop, chaque coupe est plus qu’un simple service :
          c’est une expérience personnalisée basée sur la précision, le style et le confort.
          Nous mettons l’accent sur les détails pour garantir un résultat impeccable.
        </p>
      </section>

      {/* SERVICES DETAILLES */}
      <section className="py-20 bg-gray-100 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          Nos services professionnels
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Coupe Fade moderne",
              text: "Dégradés propres et transitions parfaites adaptées à votre style.",
            },
            {
              title: "Entretien de barbe",
              text: "Contours précis, style net et soin professionnel de la barbe.",
            },
            {
              title: "Rasage classique",
              text: "Technique traditionnelle pour une peau douce et propre.",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-xl shadow-md"
            >
              <h3 className="font-bold text-xl mb-2">{s.title}</h3>
              <p className="text-gray-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VISITE SHOP */}
      <section className="py-20 bg-white text-center px-4">
        <h2 className="text-3xl font-bold">Venez nous rendre visite</h2>

        <p className="mt-3 text-gray-600">
          Situé au cœur de Shawinigan, notre barbershop vous accueille dans un environnement moderne et professionnel.
        </p>

        <p className="mt-4 font-semibold">{ADDRESS}</p>
        <p className="text-gray-700">{PHONE}</p>

        {/* MAP */}
        <div className="mt-8 max-w-5xl mx-auto rounded-xl overflow-hidden shadow-lg">
          <iframe
            title="Google Maps"
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
          className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Ouvrir dans Google Maps 📍
        </a>
      </section>

      {/* POURQUOI NOUS CHOISIR */}
      <section className="py-20 bg-black text-white text-center px-4">
        <h2 className="text-3xl font-bold">Pourquoi choisir notre barbershop ?</h2>

        <div className="max-w-4xl mx-auto mt-10 grid md:grid-cols-3 gap-8 text-gray-200">
          <div>
            <h3 className="font-bold text-lg">✔ Professionnalisme</h3>
            <p>Des coupes propres réalisées avec précision.</p>
          </div>

          <div>
            <h3 className="font-bold text-lg">✔ Expérience client</h3>
            <p>Un service personnalisé pour chaque client.</p>
          </div>

          <div>
            <h3 className="font-bold text-lg">✔ Confiance</h3>
            <p>Des clients fidèles et satisfaits.</p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-yellow-500 text-center px-4">
        <h2 className="text-3xl font-bold text-black">
          Prêt pour une nouvelle coupe ?
        </h2>

        <p className="mt-2 text-black">
          Réservez votre rendez-vous dès aujourd’hui
        </p>

        <ButtonHome
          text="Réserver maintenant"
          onClick={() => navigate("/booking")}
          className="mt-6 bg-black text-white px-8 py-3 rounded-lg font-bold"
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