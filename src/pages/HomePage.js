import React, { Suspense, lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import ButtonHome from "../components/ButtonHome";

const Header = lazy(() => import("../components/Header"));
const Footer = lazy(() => import("../components/Footer"));

const ADDRESS = "462 4e Rue de la Pointe, Shawinigan, QC";
const PHONE = "514-778-8318";

const fade = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>Barber Shawinigan | Mr. Renaudin Barbershop</title>
        <meta
          name="description"
          content="Barbershop premium à Shawinigan. Fade, afro, waves, dreadlocks, barbe. Style moderne et précision."
        />
      </Helmet>

      <Suspense fallback={<div />}>
        <Header />
      </Suspense>

      {/* HERO */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={fade}
        className="relative min-h-screen flex items-center justify-center text-center px-4 bg-black text-white"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/Photos/rasage12.jpeg')" }}
        />

        <div className="relative z-10 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Le style n’est pas un hasard.
          </h1>

          <p className="mt-6 text-lg text-gray-300">
            Chaque coupe est pensée, structurée et exécutée avec précision.
          </p>

          <div className="mt-10">
            <ButtonHome
              text="Réserver maintenant"
              onClick={() => navigate("/booking")}
              className="bg-yellow-500 text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition"
            />
          </div>
        </div>
      </motion.section>

      {/* BRAND STORY */}
      <section className="py-32 bg-black text-white px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold">
            Une signature. Une identité.
          </h2>

          <p className="mt-8 text-gray-400 text-lg leading-relaxed">
            Mr. Renaudin Barbershop n’est pas simplement un salon de coiffure.
            C’est un espace où le style rencontre la discipline, où chaque détail
            est maîtrisé pour offrir une image forte, nette et moderne.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-32 bg-white text-black px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center">
            Nos spécialités
          </h2>

          <div className="mt-16 grid md:grid-cols-3 gap-12">
            {[
              "Fade (dégradé)",
              "Afro Taper",
              "Waves 360",
              "Flat Top",
              "Mini Afro",
              "Afro naturel",
              "Dreadlocks",
              "Tresses collées",
              "Coupe boule à zéro",
            ].map((item, i) => (
              <div key={i} className="border-b pb-4">
                <h3 className="font-semibold text-lg">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="py-32 bg-black text-white px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold">
            Une expérience maîtrisée
          </h2>

          <p className="mt-8 text-gray-400 leading-relaxed">
            De l’accueil à la finition, chaque étape est conçue pour offrir
            une expérience fluide, professionnelle et haut de gamme.
          </p>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-32 bg-white text-center px-6">
        <h2 className="text-4xl font-bold">Ils nous font confiance</h2>

        <div className="mt-16 grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {[
            "Résultat toujours parfait.",
            "Très professionnel et précis.",
            "Le meilleur barbershop de la région.",
          ].map((review, i) => (
            <div key={i} className="p-6 border rounded-xl">
              <p className="italic text-gray-600">“{review}”</p>
              <p className="mt-4">★★★★★</p>
            </div>
          ))}
        </div>
      </section>

      {/* LOCATION */}
      <section className="py-32 bg-black text-white text-center px-6">
        <h2 className="text-4xl font-bold">Localisation</h2>

        <p className="mt-4 text-gray-400">{ADDRESS}</p>
        <p className="text-yellow-400">{PHONE}</p>

        <div className="mt-12 max-w-5xl mx-auto rounded-xl overflow-hidden">
          <iframe
            title="map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              ADDRESS
            )}&output=embed`}
            width="100%"
            height="400"
          />
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-32 bg-black text-center px-6">
        <h2 className="text-4xl font-bold text-white">
          Prenez rendez-vous.
        </h2>

        <ButtonHome
          text="Réserver"
          onClick={() => navigate("/booking")}
          className="mt-8 bg-yellow-500 text-black px-10 py-4 rounded-full font-bold hover:scale-105 transition"
        />
      </section>

      <Suspense fallback={<div />}>
        <Footer />
      </Suspense>
    </>
  );
};

export default HomePage;