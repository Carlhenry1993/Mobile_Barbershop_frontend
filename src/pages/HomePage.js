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
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const services = [
  "Fade (dégradé)",
  "Afro Taper",
  "Waves 360",
  "Flat Top",
  "Mini Afro",
  "Afro naturel",
  "Dreadlocks",
  "Tresses collées",
  "Coupe boule à zéro",
];

const reviews = [
  "Service impeccable, coupe parfaite à chaque fois.",
  "Meilleur barber à Shawinigan, très professionnel.",
  "Ambiance propre, résultats toujours top.",
];

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>
          Barber Shawinigan | Fade, Waves, Afro | Mr. Renaudin Barbershop
        </title>
        <meta
          name="description"
          content="Barbershop professionnel à Shawinigan. Fade, waves 360, afro, dreadlocks, tresses, barbe. Réservez votre coupe premium maintenant."
        />
      </Helmet>

      {/* HEADER */}
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense>

      {/* HERO SECTION */}
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

        <div className="relative z-10 text-white max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Votre style commence ici.
          </h1>

          <p className="mt-4 text-yellow-400 text-xl font-semibold">
            Mr. Renaudin Barbershop
          </p>

          <p className="mt-4 text-gray-300 text-lg">
            Spécialiste des coupes modernes, fades, waves et styles afro.
            Transformez votre image avec précision.
          </p>

          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
            <ButtonHome
              text="📅 Réserver maintenant"
              onClick={() => navigate("/booking")}
              className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:scale-105 transition"
            />

            <a
              href={`tel:${PHONE}`}
              className="bg-green-600 px-6 py-3 rounded-lg font-bold hover:scale-105 transition"
            >
              📞 Appeler
            </a>
          </div>
        </div>
      </motion.section>

      {/* BRAND */}
      <section className="py-24 text-center px-4 bg-white">
        <h2 className="text-4xl font-bold">
          Plus qu’une coupe. Une identité.
        </h2>

        <p className="mt-6 max-w-3xl mx-auto text-gray-600 text-lg">
          Chez Mr. Renaudin Barbershop, chaque client repart avec un style
          unique. Nous combinons précision, modernité et savoir-faire pour
          créer une image forte et élégante.
        </p>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-gray-50 text-center px-4">
        <h2 className="text-4xl font-bold">Nos services</h2>

        <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:-translate-y-2 hover:shadow-xl transition"
            >
              <h3 className="font-bold text-lg">{service}</h3>
              <p className="text-gray-500 mt-2">
                Coupe moderne avec finition professionnelle
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 bg-black text-white text-center px-4">
        <h2 className="text-4xl font-bold">
          Pourquoi choisir notre barbershop ?
        </h2>

        <div className="mt-10 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div>
            <h3 className="font-bold">🔥 Précision</h3>
            <p className="text-gray-300">Détails parfaits à chaque coupe</p>
          </div>

          <div>
            <h3 className="font-bold">💎 Style moderne</h3>
            <p className="text-gray-300">Toujours à la tendance</p>
          </div>

          <div>
            <h3 className="font-bold">✔ Satisfaction</h3>
            <p className="text-gray-300">Clients fidèles et satisfaits</p>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24 bg-white text-center px-4">
        <h2 className="text-4xl font-bold">Avis clients</h2>

        <div className="mt-10 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-gray-100 p-6 rounded-xl shadow"
            >
              <p className="italic text-gray-700">“{review}”</p>
              <p className="mt-4 font-bold">⭐⭐⭐⭐⭐</p>
            </div>
          ))}
        </div>
      </section>

      {/* LOCATION */}
      <section className="py-24 bg-gray-100 text-center px-4">
        <h2 className="text-4xl font-bold">Nous trouver</h2>

        <p className="mt-4 text-gray-600">{ADDRESS}</p>
        <p className="font-semibold">{PHONE}</p>

        <div className="mt-10 max-w-5xl mx-auto rounded-xl overflow-hidden shadow-xl">
          <iframe
            title="map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              ADDRESS
            )}&output=embed`}
            width="100%"
            height="400"
            loading="lazy"
          />
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 bg-yellow-500 text-center px-4">
        <h2 className="text-4xl font-bold text-black">
          Prêt pour une nouvelle image ?
        </h2>

        <ButtonHome
          text="Réserver maintenant"
          onClick={() => navigate("/booking")}
          className="mt-6 bg-black text-white px-10 py-3 rounded-xl font-bold hover:scale-105 transition"
        />
      </section>

      {/* FOOTER */}
      <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense>
    </>
  );
};

export default HomePage;