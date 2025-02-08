import React, { useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';

const ServicesPage = () => {
  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <ParallaxProvider>
      <div className="bg-gray-100">
        <Header />

        {/* Hero Section with Parallax */}
        <section className="relative py-24 md:py-32 bg-gradient-to-r from-[#00A8CC] to-[#1ABC9C] text-white text-center overflow-hidden">
          <Parallax speed={-10}>
            <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover">
              <source src="/videos/service-background.mp4" type="video/mp4" />
            </video>
          </Parallax>
          <div className="relative z-10 container mx-auto px-4">
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg" 
              data-aos="fade-up" 
              data-aos-delay="200"
            >
              Offrez-vous l'Expérience du Rasage d'Exception à Domicile
            </h1>
            <p 
              className="text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-sm" 
              data-aos="fade-up" 
              data-aos-delay="400"
            >
              Redécouvrez le plaisir d’un rasage professionnel, dans le confort de votre foyer. Nos experts passionnés transforment chaque séance en un moment unique de bien-être et de sophistication. Vous méritez le meilleur !
            </p>
            <a
              href="#services"
              className="inline-block bg-white text-[#00A8CC] px-6 sm:px-8 py-3 rounded-full text-base sm:text-xl font-semibold hover:bg-[#F1C40F] transition-all"
              aria-label="Découvrez nos services"
              data-aos="fade-up" 
              data-aos-delay="600"
            >
              Explorer nos prestations
            </a>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 md:py-20 bg-white" data-aos="zoom-in-up">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 
                className="text-3xl sm:text-4xl font-extrabold text-[#00A8CC] mb-4" 
                data-aos="fade-up"
              >
                Nos Services de Rasage : L'Art du Soin Personnalisé
              </h2>
              <p 
                className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto" 
                data-aos="fade-up" 
                data-aos-delay="200"
              >
                Chaque prestation est conçue pour sublimer votre style et votre confort. Que vous optiez pour un rasage complet, un dégradé moderne, ou un soin sur-mesure, nos experts mettent leur savoir-faire à votre service pour révéler le meilleur de vous-même.
              </p>
            </div>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
              {/* Rasage Complet */}
              <div
                className="bg-white p-6 sm:p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105"
                role="region"
                aria-labelledby="service1"
                data-aos="fade-up"
              >
                <div className="w-full h-72 sm:h-96 flex justify-center items-center rounded-lg mb-4 overflow-hidden">
                  <img 
                    src="/Photos/RasageComplet.jpg" 
                    alt="Rasage Complet – Soin Total" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 id="service1" className="text-xl sm:text-2xl font-semibold text-[#00A8CC] mb-3">
                  Rasage Complet : Le Rituel Ultime
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3">
                  Offrez-vous un soin complet qui conjugue tradition et innovation. Profitez d’un rasage précis, d’une peau sublimée et d’une sensation de fraîcheur incomparable.
                </p>
                <a
                  href="/booking"
                  className="inline-block bg-[#00A8CC] text-white px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold hover:bg-[#F1C40F] transition-all"
                >
                  Réservez dès maintenant
                </a>
                <p className="text-xs sm:text-sm text-gray-500 mt-3 italic">
                  Un instant de détente et de raffinement, rien que pour vous.
                </p>
              </div>

              {/* Dégradé Moderne */}
              <div
                className="bg-white p-6 sm:p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105"
                role="region"
                aria-labelledby="service2"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="w-full h-72 sm:h-96 flex justify-center items-center rounded-lg mb-4 overflow-hidden">
                  <img 
                    src="/Photos/DegradeModerne.jpg" 
                    alt="Dégradé Moderne – Style Audacieux" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 id="service2" className="text-xl sm:text-2xl font-semibold text-[#00A8CC] mb-3">
                  Dégradé Moderne : L'Élégance Réinventée
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3">
                  Sublimez votre style avec un dégradé moderne, taillé avec précision pour mettre en lumière votre personnalité. Osez l'audace et la sophistication en toute simplicité.
                </p>
                <a
                  href="/booking"
                  className="inline-block bg-[#00A8CC] text-white px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold hover:bg-[#F1C40F] transition-all"
                >
                  Adoptez votre style
                </a>
                <p className="text-xs sm:text-sm text-gray-500 mt-3 italic">
                  Un look moderne, pour une allure inoubliable.
                </p>
              </div>

              {/* Coupe Classique */}
              <div
                className="bg-white p-6 sm:p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105"
                role="region"
                aria-labelledby="service3"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="w-full h-72 sm:h-96 flex justify-center items-center rounded-lg mb-4 overflow-hidden">
                  <img 
                    src="/Photos/CoupeClassique.jpg" 
                    alt="Coupe Classique – Élégance Intemporelle" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 id="service3" className="text-xl sm:text-2xl font-semibold text-[#00A8CC] mb-3">
                  Coupe Classique : L'Intemporel Revisité
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3">
                  Alliez élégance et tradition avec notre coupe classique. Une prestation soignée qui garantit une finition nette et un style résolument raffiné.
                </p>
                <a
                  href="/booking"
                  className="inline-block bg-[#00A8CC] text-white px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold hover:bg-[#F1C40F] transition-all"
                >
                  Réservez votre séance
                </a>
                <p className="text-xs sm:text-sm text-gray-500 mt-3 italic">
                  Un style qui traverse le temps, pour une confiance renouvelée.
                </p>
              </div>

              {/* Rasage de la Barbe */}
              <div
                className="bg-white p-6 sm:p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105"
                role="region"
                aria-labelledby="service4"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                <div className="w-full h-72 sm:h-96 flex justify-center items-center rounded-lg mb-4 overflow-hidden">
                  <img 
                    src="/Photos/RasageBarbe.jpg" 
                    alt="Rasage de la Barbe – Soin Personnalisé" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 id="service4" className="text-xl sm:text-2xl font-semibold text-[#00A8CC] mb-3">
                  Rasage de la Barbe : Votre Signature de Style
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3">
                  Offrez à votre barbe un soin sur mesure. Que vous souhaitiez une taille classique ou une mise en forme audacieuse, nos experts sculptent votre barbe pour révéler votre caractère.
                </p>
                <a
                  href="/booking"
                  className="inline-block bg-[#00A8CC] text-white px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold hover:bg-[#F1C40F] transition-all"
                >
                  Réservez votre soin
                </a>
                <p className="text-xs sm:text-sm text-gray-500 mt-3 italic">
                  Un rasage impeccable pour une allure qui fait sensation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-20 bg-[#f9f9f9]" data-aos="fade-up">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00A8CC] mb-6">
              Nos Clients Témoignent de Leur Expérience
            </h2>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
              <div className="max-w-sm w-full p-4 sm:p-6 bg-white rounded-lg shadow-md">
                <p className="text-base sm:text-lg text-gray-600 mb-4">
                  "Un service exceptionnel ! J'ai redécouvert le plaisir d'un rasage de qualité – chaque détail compte. Une expérience vraiment unique !"
                </p>
                <p className="font-semibold text-[#00A8CC]">Marc D.</p>
                <p className="text-gray-500">Client fidèle</p>
              </div>
              <div className="max-w-sm w-full p-4 sm:p-6 bg-white rounded-lg shadow-md">
                <p className="text-base sm:text-lg text-gray-600 mb-4">
                  "Le dégradé moderne réalisé par l'équipe a complètement transformé mon look. Un résultat impeccable et un service aux petits soins."
                </p>
                <p className="font-semibold text-[#00A8CC]">David L.</p>
                <p className="text-gray-500">Client satisfait</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action */}
        <section className="bg-[#00A8CC] py-16 md:py-20 text-white text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4">
            Prêt à Révéler Votre Style ?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            Réservez dès maintenant et offrez-vous le luxe d’un rasage professionnel chez vous. Laissez-vous séduire par une expérience de soin personnalisée, pensée pour vous.
          </p>
          <a
            href="/booking"
            className="inline-block bg-[#F1C40F] text-[#333] px-6 sm:px-8 py-3 rounded-full text-base sm:text-xl font-semibold hover:bg-[#F1C40F] transition-all"
          >
            Réservez votre rendez-vous
          </a>
        </section>

        <Footer />
      </div>
    </ParallaxProvider>
  );
};

export default ServicesPage;
