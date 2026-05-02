import React, { Suspense, lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import ButtonHome from "../components/ButtonHome";

const Header = lazy(() => import("../components/Header"));
const Footer = lazy(() => import("../components/Footer"));

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
      <Helmet>
        <title>Mr. Renaudin Barbershop - Shawinigan</title>
        <meta
          name="description"
          content="Barbershop professionnel à Shawinigan. Coupe moderne, barbe, dégradé et service à domicile. Réservez maintenant."
        />
      </Helmet>

      <Suspense fallback={<div>Chargement...</div>}>
        <Header />
      </Suspense>

      {/* 🔥 HERO PREMIUM */}
      <section className="relative min-h-screen flex items-center justify-center text-center">
        <div
          className="absolute inset-0 bg-cover bg-center brightness-75"
          style={{ backgroundImage: "url('/Photos/rasage12.jpg')" }}
        />

        <div className="relative z-10 text-white px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            L’Excellence du Style à Shawinigan
          </h1>

          <p className="text-xl max-w-2xl mx-auto mb-6">
            💈 Barbershop professionnel + service à domicile  
            ✂️ Coupe moderne, barbe et dégradé  
            📍 462 4e Rue de la Pointe
          </p>

          <button
            onClick={handleBookNowClick}
            className="bg-yellow-500 hover:bg-yellow-600 px-8 py-4 text-xl font-bold rounded-lg shadow-lg"
          >
            🔥 Prendre rendez-vous maintenant
          </button>
        </div>
      </section>

      {/* 💰 PRIX */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-4xl font-bold mb-10">Nos Tarifs</h2>

        <div className="grid md:grid-cols-3 gap-8 px-6">
          <div className="shadow-lg p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Coupe</h3>
            <p className="text-3xl font-bold text-yellow-500">$30</p>
          </div>

          <div className="shadow-lg p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Coupe + Barbe</h3>
            <p className="text-3xl font-bold text-yellow-500">$45</p>
          </div>

          <div className="shadow-lg p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Déplacement</h3>
            <p className="text-3xl font-bold text-yellow-500">+$10</p>
          </div>
        </div>
      </section>

      {/* ⭐ AVIS CLIENTS */}
      <section className="py-16 bg-blue-50 text-center">
        <h2 className="text-4xl font-bold mb-10">Avis Clients</h2>

        <div className="grid md:grid-cols-2 gap-8 px-6">
          <div className="bg-white p-6 shadow-lg rounded-lg">
            ⭐⭐⭐⭐⭐  
            <p className="mt-4">
              “Service incroyable, très professionnel. Je recommande à 100%.”
            </p>
            <p className="mt-2 font-bold">— Jean</p>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-lg">
            ⭐⭐⭐⭐⭐  
            <p className="mt-4">
              “Le meilleur barber à Shawinigan. Résultat parfait.”
            </p>
            <p className="mt-2 font-bold">— Marc</p>
          </div>
        </div>
      </section>

      {/* 📍 LOCALISATION + MAP */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-4xl font-bold mb-6">Nous trouver</h2>

        <p className="mb-6 text-lg">
          📍 462 4e Rue de la Pointe  
          <br />
          Shawinigan, QC G9N 1G7
        </p>

        <div className="max-w-4xl mx-auto">
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps?q=462+4e+Rue+de+la+Pointe+Shawinigan&output=embed"
            className="w-full h-80 rounded-lg shadow-lg"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* 🎯 CTA FINAL */}
      <section className="py-16 bg-blue-200 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Prêt pour une nouvelle coupe ?
        </h2>

        <button
          onClick={handleBookNowClick}
          className="bg-yellow-500 hover:bg-yellow-600 px-8 py-4 text-xl font-bold rounded-lg"
        >
          Réserver maintenant
        </button>
      </section>

      <Suspense fallback={<div>Chargement...</div>}>
        <Footer />
      </Suspense>
    </>
  );
};

export default HomePage;