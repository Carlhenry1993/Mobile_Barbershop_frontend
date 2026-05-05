import React, { Suspense, lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import ButtonHome from "../components/ButtonHome";

const Header = lazy(() => import("../components/Header"));
const Footer = lazy(() => import("../components/Footer"));

const services = [
  "Fade (dégradé)",
  "Afro Taper",
  "Waves 360",
  "Flat Top",
  "Mini Afro",
  "Afro naturel",
  "Dreadlocks",
  "Tresses collées",
];

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Mr. Renaudin Barbershop | Premium Barber</title>
        <meta
          name="description"
          content="Barbershop moderne. Fade, afro, waves, style premium."
        />
      </Helmet>

      <Suspense fallback={<div />}>
        <Header />
      </Suspense>

      {/* HERO ULTRA MODERNE */}
      <section className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">

        {/* BACKGROUND GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

        {/* LIGHT EFFECT */}
        <div className="absolute w-[600px] h-[600px] bg-yellow-500/20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
        <div className="absolute w-[500px] h-[500px] bg-yellow-400/10 blur-[100px] rounded-full bottom-[-100px] right-[-100px]" />

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center max-w-4xl px-4"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Redéfinissez votre style.
          </h1>

          <p className="mt-6 text-gray-300 text-lg">
            Une expérience moderne, précise et élégante.
          </p>

          <div className="mt-10">
            <ButtonHome
              text="Réserver maintenant"
              onClick={() => navigate("/booking")}
              className="bg-yellow-500 text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition"
            />
          </div>
        </motion.div>
      </section>

      {/* SECTION GLASS CARDS */}
      <section className="py-32 bg-black px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

          {["Précision", "Style", "Excellence"].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl text-white"
            >
              <h3 className="text-xl font-bold">{item}</h3>
              <p className="mt-4 text-gray-400">
                Une approche moderne de la coiffure masculine.
              </p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* SERVICES ULTRA MODERN GRID */}
      <section className="py-32 bg-gradient-to-b from-black to-gray-900 text-white px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center">
            Nos services
          </h2>

          <div className="mt-16 grid md:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08 }}
                className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-md"
              >
                <p className="text-center font-medium">{service}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section className="py-32 bg-black text-center px-6">
        <h2 className="text-4xl font-bold text-white">
          Une expérience immersive
        </h2>

        <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
          Chaque détail est conçu pour offrir une expérience fluide,
          moderne et professionnelle.
        </p>
      </section>

      {/* CTA */}
      <section className="py-32 bg-black text-center px-6">
        <h2 className="text-4xl font-bold text-white">
          Prenez rendez-vous dès maintenant
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