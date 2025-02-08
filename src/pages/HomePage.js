import React, { Suspense, lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ErrorBoundary } from "react-error-boundary";
import { motion } from "framer-motion";
import ButtonHome from "../components/ButtonHome";

// Chargement paresseux du Header et Footer pour optimiser les performances
const Header = lazy(() => import("../components/Header"));
const Footer = lazy(() => import("../components/Footer"));

// Composant de fallback en cas d'erreur
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert" className="p-4 bg-red-100 text-red-700 rounded-lg mx-4 my-8">
    <p className="font-semibold">Une erreur est survenue :</p>
    <pre className="text-sm">{error.message}</pre>
    <ButtonHome
      text="Réessayer"
      onClick={resetErrorBoundary}
      className="mt-4 bg-red-600 text-white px-6 py-2 rounded"
      ariaLabel="Réessayer"
    />
  </div>
);

// Variantes d'animation pour le conteneur et les éléments individuels
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
};

const HomePage = () => {
  const navigate = useNavigate();

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Redirection vers la page de réservation
  const handleBookNowClick = () => {
    navigate("/booking");
  };

  return (
    <>
      <Helmet>
        <title>Mr. Renaudin Barbershop - Coiffure à Domicile</title>
        <meta
          name="description"
          content="Coiffure professionnelle à domicile avec Mr. Renaudin Barbershop. Réservez dès maintenant pour un style moderne sans quitter votre maison."
        />
      </Helmet>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div className="text-center py-8">Chargement...</div>}>
          <Header />
        </Suspense>
      </ErrorBoundary>

      {/* Conteneur principal animé avec stagger pour ses enfants */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Section Hero */}
        <motion.main
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          variants={itemVariants}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/Photos/Rasage12.jpg')",
              filter: "brightness(100%)"
            }}
            aria-label="Image de fond du Barbershop"
          />
          <div className="relative z-10 text-center px-4 py-16 lg:py-32">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg text-white"
              variants={itemVariants}
            >
              Bienvenue Chez Mr. Renaudin Barbershop
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed text-white font-bold drop-shadow"
              variants={itemVariants}
            >
              <div className="space-y-4">
                <p>
                  <span className="font-bold text-white">Confort :</span> Une expérience de coiffure exclusive, directement chez vous.
                </p>
                <p>
                  <span className="font-bold text-white">Style :</span> Un look soigné, adapté à vos goûts.
                </p>
                <p>
                  <span className="font-bold text-white">Expertise :</span> Des professionnels qualifiés à votre service.
                </p>
              </div>
              <span className="mt-4 inline-block">
                Prenez rendez-vous dès maintenant et transformez votre style sans effort. 🚐✂️
              </span>
            </motion.p>
            <ButtonHome
              text="Réservez Votre Rendez-vous"
              onClick={handleBookNowClick}
              className="bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-300 py-3 px-8 text-xl font-bold rounded-lg shadow-lg"
            />
          </div>
        </motion.main>

        {/* Section "Pourquoi Choisir Mr. Renaudin Barbershop ?" */}
        <motion.section className="py-16 bg-blue-50 text-gray-800" variants={itemVariants}>
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">Pourquoi Choisir Mr. Renaudin Barbershop ?</h2>
            <p className="text-lg mb-12">
              Votre temps est précieux. Avec notre service de coiffure à domicile, bénéficiez de coupes modernes et soignées, le tout sans stress. Faites confiance à un expert alliant passion, précision et professionnalisme.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  img: "/Photos/Icone1.jpeg",
                  alt: "Confort à Domicile",
                  title: "Confort à Domicile",
                  description: "Recevez un service de qualité directement chez vous."
                },
                {
                  img: "/Photos/Icone2.jpeg",
                  alt: "Style Moderne",
                  title: "Style Moderne",
                  description: "Des coupes adaptées à votre style et personnalité."
                },
                {
                  img: "/Photos/Icone3.jpeg",
                  alt: "Gain de Temps",
                  title: "Gain de Temps",
                  description: "Plus besoin de vous déplacer. Nous venons à vous."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white shadow-lg rounded-lg p-8 text-center flex flex-col items-center hover:scale-105 transform transition-transform duration-300"
                  variants={itemVariants}
                >
                  <img
                    src={item.img}
                    alt={item.alt}
                    className="h-40 w-40 object-cover rounded-full mb-6"
                  />
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-700 text-lg">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Section "À Propos de Nous" */}
        <motion.section className="py-16 bg-white text-gray-800" variants={itemVariants}>
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">À Propos de Nous</h2>
            <p className="text-lg mb-12">
              Mr. Renaudin Barbershop est dédié à offrir des services de coiffure de qualité, directement chez vous. Forts d’une passion pour l’art de la coiffure et d’un engagement envers la satisfaction de nos clients, nous vous apportons expertise, service personnalisé et une attention aux détails inégalée.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[
                {
                  title: "Expérience et Expertise",
                  description: "Plus de 10 ans d’expérience dans la coiffure professionnelle, pour des styles modernes et adaptés."
                },
                {
                  title: "Service Personnalisé",
                  description: "Nous prenons le temps de comprendre vos besoins et d'adapter nos services à votre style."
                },
                {
                  title: "Confiance et Engagement",
                  description: "Votre satisfaction est notre priorité. Nous nous engageons à vous offrir un service fiable et professionnel."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-blue-50 shadow-lg rounded-lg p-8 text-center hover:shadow-2xl transition-shadow duration-300"
                  variants={itemVariants}
                >
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-700 text-lg">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Section "Nos Services" */}
        <motion.section className="py-16 bg-blue-100 text-gray-800" variants={itemVariants}>
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-8">Nos Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  img: "/Photos/CoupeClassique.jpg",
                  alt: "Coupe Classique",
                  title: "Coupe Classique",
                  description: "L'élégance intemporelle pour un look raffiné et sophistiqué."
                },
                {
                  img: "/Photos/RasageBarbe.jpg",
                  alt: "Rasage de la Barbe",
                  title: "Rasage de la Barbe",
                  description: "Un rasage sur mesure alliant tradition et modernité pour une barbe sculptée."
                },
                {
                  img: "/Photos/RasageComplet.jpg",
                  alt: "Rasage Complet",
                  title: "Rasage Complet",
                  description: "Un rituel de soin luxueux pour une peau douce et un rafraîchissement complet."
                },
                {
                  img: "/Photos/DegradeModerne.jpg",
                  alt: "Dégradé Moderne",
                  title: "Dégradé Moderne",
                  description: "Affichez votre style audacieux avec un dégradé travaillé dans les moindres détails."
                }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-white shadow-lg rounded-lg p-6 text-center hover:scale-105 transform transition-transform duration-300"
                  variants={itemVariants}
                >
                  <img
                    src={service.img}
                    alt={service.alt}
                    className="h-48 w-full object-cover object-top rounded-lg mb-6"
                  />
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-700 text-base">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Section "Comment ça Marche ?" */}
        <motion.section className="py-16 bg-white text-gray-800" variants={itemVariants}>
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">Comment ça Marche ?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {[
                {
                  img: "/Photos/Icone4.jpeg",
                  alt: "Réservez",
                  title: "1. Réservez",
                  description: "Choisissez la date et l'heure qui vous conviennent."
                },
                {
                  img: "/Photos/Icone5.jpeg",
                  alt: "Profitez",
                  title: "2. Profitez",
                  description: "Recevez un service de coiffure à domicile, adapté à vos préférences."
                },
                {
                  img: "/Photos/Icone6.jpeg",
                  alt: "Soyez satisfait",
                  title: "3. Soyez satisfait",
                  description: "Détendez-vous et profitez d'un résultat impeccable."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="text-center hover:scale-105 transform transition-transform duration-300"
                  variants={itemVariants}
                >
                  <img
                    src={step.img}
                    alt={step.alt}
                    className="w-48 h-48 mb-6 mx-auto object-cover rounded-full"
                  />
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-lg text-gray-700">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Section Témoignages */}
        <motion.section className="py-16 bg-blue-50 text-gray-800" variants={itemVariants}>
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">Ce que disent nos clients</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { testimonial: "Service exceptionnel ! J'ai adoré l'expérience et le résultat était parfait.", client: "Jean Dupont" },
                { testimonial: "Une transformation incroyable, le professionnalisme est au rendez-vous.", client: "Marie Claire" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white shadow-lg rounded-lg p-8 hover:scale-105 transform transition-transform duration-300"
                  variants={itemVariants}
                >
                  <p className="text-xl italic">"{item.testimonial}"</p>
                  <p className="mt-4 font-bold">- {item.client}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Section Appel à l'action final */}
        <motion.section className="py-16 bg-blue-100 text-gray-800 text-center" variants={itemVariants}>
          <h2 className="text-4xl font-extrabold mb-4">Prêt pour une transformation ?</h2>
          <p className="text-lg mb-8">
            Ne laissez pas votre style au hasard. Réservez dès maintenant pour profiter d'une coupe moderne et d'un service d'exception à domicile.
          </p>
          <ButtonHome
            text="Réservez Maintenant"
            onClick={handleBookNowClick}
            className="bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-300 py-3 px-8 text-xl font-bold rounded-lg shadow-lg"
          />
        </motion.section>
      </motion.div>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div className="text-center py-8">Chargement...</div>}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default HomePage;
