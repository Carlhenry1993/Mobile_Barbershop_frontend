import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutPage = () => {
  return (
    <div className="bg-blue-50">
      <Header />

      {/* Section Héro avec overlay pour lisibilité */}
      <section className="relative py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Photos/about-hero.jpg')" }}
          aria-label="Image de fond"
        ></div>
        {/* Overlay sombre semi-transparent pour améliorer le contraste */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 animate__animated animate__fadeInDown drop-shadow-lg">
            Transformez Votre Look
          </h1>
          <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-xl mx-auto animate__animated animate__fadeInUp drop-shadow">
            Vivez une expérience de coiffure exceptionnelle qui sublime votre style et révèle votre personnalité.
          </p>
          <a
            href="/booking"
            className="block w-full sm:w-auto bg-white text-blue-700 px-4 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base md:text-xl font-semibold hover:bg-blue-100 transition-all animate__animated animate__zoomIn"
            aria-label="Réservez maintenant"
          >
            Réservez Votre Rendez-vous
          </a>
        </div>
      </section>

      {/* Section Notre Histoire */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto text-center px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6">Notre Histoire</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-base sm:text-lg text-gray-700 mb-6">
              Tout a commencé par un rêve : offrir une expérience de coiffure d’exception, où chaque coupe est une œuvre d’art et chaque soin un moment de bien-être absolu.
            </p>
            <p className="text-base sm:text-lg text-gray-700">
              Depuis nos débuts modestes, nous avons su allier tradition et innovation pour créer un service unique, pensé pour révéler votre personnalité et vous faire sentir exceptionnel.
            </p>
          </div>
        </div>
      </section>

      {/* Section Notre Emplacement */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto text-center px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6">Notre Emplacement</h2>
          <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
            Nous sommes fiers d'être situés dans la région dynamique de Trois-Rivières et Shawinigan, au Québec, Canada. Notre barbershop sert ces communautés et leurs environs, offrant des services de coiffure de qualité supérieure dans une ambiance conviviale.
          </p>
        </div>
      </section>

      {/* Section Nos Valeurs */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto text-center px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6">Nos Valeurs</h2>
          <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            L’excellence, la passion et l’engagement envers nos clients sont le cœur de notre démarche.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {[
              {
                title: "Service Client Exceptionnel",
                description:
                  "Nous plaçons votre satisfaction au premier plan, en vous offrant un service personnalisé, chaleureux et sur-mesure.",
              },
              {
                title: "Confort et Praticité",
                description:
                  "Profitez d’un service de coiffure à domicile, pensé pour vous offrir une expérience sans stress et dans un confort absolu.",
              },
              {
                title: "Professionnalisme et Expertise",
                description:
                  "Nos coiffeurs experts allient savoir-faire traditionnel et techniques modernes pour des résultats impeccables.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-blue-50 border border-blue-200 p-4 sm:p-8 rounded-lg shadow-md transform hover:scale-105 transition-all"
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-3 sm:mb-4">
                  {value.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Engagement */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">Notre Engagement</h2>
          <p className="text-base sm:text-lg mb-6 max-w-3xl mx-auto">
            Nous transformons chaque rendez-vous en une expérience mémorable, où chaque détail compte pour vous offrir le meilleur de la coiffure à domicile.
          </p>
          <a
            href="/contact"
            className="block w-full sm:w-auto bg-white text-blue-700 px-4 sm:px-8 py-3 rounded-full text-base sm:text-xl font-semibold hover:bg-blue-100 transition-all mx-auto"
            aria-label="Contactez-nous pour en savoir plus"
          >
            Contactez-nous pour en savoir plus
          </a>
        </div>
      </section>

      {/* Section Nos Services */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Découvrez Nos Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[
              {
                img: "/Photos/CoupeClassique.jpg",
                alt: "Coupe Classique",
                title: "Coupe Classique",
                description:
                  "Intemporelle et élégante. Offrez-vous un look raffiné qui traverse le temps, avec une coupe précise et sophistiquée réalisée par nos experts.",
              },
              {
                img: "/Photos/RasageBarbe.jpg",
                alt: "Rasage de la Barbe",
                title: "Rasage de la Barbe",
                description:
                  "Un soin sur mesure. Redéfinissez votre style avec un rasage expert alliant tradition et modernité pour un résultat net et sur-mesure.",
              },
              {
                img: "/Photos/RasageComplet.jpg",
                alt: "Rasage Complet",
                title: "Rasage Complet",
                description:
                  "Un rituel de soin. Vivez une expérience luxueuse et relaxante, où chaque détail est pensé pour laisser votre peau douce et revitalisée.",
              },
              {
                img: "/Photos/DegradeModerne.jpg",
                alt: "Dégradé Moderne",
                title: "Dégradé Moderne",
                description:
                  "L'élégance à l'état pur. Adoptez un style audacieux et contemporain, façonné pour mettre en valeur votre personnalité unique.",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-blue-50 border border-blue-200 shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-all"
              >
                <img
                  src={service.img}
                  alt={service.alt}
                  className="w-full h-48 sm:h-60 object-cover object-top"
                />
                <div className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-blue-800">
                    {service.title}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Témoignages de nos clients */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Témoignages de Nos Clients</h2>
          <div className="max-w-3xl mx-auto">
            {[
              {
                quote:
                  "Un service exceptionnel ! Mon look a été totalement transformé et l'expérience était digne d'un grand salon.",
                author: "Samuel D.",
              },
              {
                quote:
                  "La qualité et le professionnalisme sont au rendez-vous. Je recommande vivement pour une expérience haut de gamme.",
                author: "Laurence M.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-blue-50 border border-blue-200 p-4 sm:p-8 rounded-lg shadow-md mb-4 sm:mb-6"
              >
                <p className="text-lg sm:text-xl text-gray-800 italic mb-3">
                  "{testimonial.quote}"
                </p>
                <p className="text-base sm:text-lg font-bold text-blue-800">
                  - {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Appel à l'action pour réservation */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Prêt à transformer votre look ?</h2>
          <p className="text-base sm:text-lg mb-6 max-w-2xl mx-auto">
            Réservez dès aujourd'hui votre rendez-vous et vivez une expérience de coiffure exceptionnelle dans notre barbershop.
          </p>
          <a
            href="/booking"
            className="bg-white text-blue-700 px-6 sm:px-8 py-3 rounded-full text-base sm:text-xl font-semibold hover:bg-blue-100 transition-all"
          >
            Réservez maintenant
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
