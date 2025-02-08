import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4 lg:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Section 1: Contactez-Nous */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contactez-Nous</h3>
          <p className="text-gray-300 text-sm mb-4">
            Prêt à transformer votre look ? Parlons-en !
          </p>
          <a
            href="/contact"
            className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm inline-block hover:bg-blue-500 transition-all duration-300"
          >
            Contactez-nous →
          </a>
        </div>

        {/* Section 2: Nos Services */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Nos Services</h3>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>
              <a href="/services" className="hover:text-blue-400 transition-all duration-300">
                Coupe Classique
              </a>
            </li>
            <li>
              <a href="/services" className="hover:text-blue-400 transition-all duration-300">
                Rasage de la Barbe
              </a>
            </li>
            <li>
              <a href="/services" className="hover:text-blue-400 transition-all duration-300">
                Rasage Complet
              </a>
            </li>
            <li>
              <a href="/services" className="hover:text-blue-400 transition-all duration-300">
                Dégradé Moderne
              </a>
            </li>
          </ul>
        </div>

        {/* Section 3: Informations de Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Informations de Contact</h3>
          <p className="text-gray-300 text-sm mb-2">Envoyez-nous un courriel :</p>
          <a
            href="mailto:mrrenaudinbarber@gmail.com"
            className="text-blue-400 hover:underline mb-2 inline-block"
          >
            mrrenaudinbarber@gmail.com
          </a>
          <p className="text-gray-300 text-sm mb-2">Appelez-nous :</p>
          <p className="text-blue-400 mb-2">514-778-8318</p>
          <p className="text-gray-300 text-sm">Adresse :</p>
          <p className="text-gray-400">Trois-Rivières, Shawinigan, QC, Canada</p>
        </div>

        {/* Section 4: Réservez Maintenant */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Réservez Maintenant</h3>
          <p className="text-gray-300 text-sm mb-4">
            Prenez rendez-vous en ligne et offrez-vous une expérience de soin unique.
          </p>
          <a
            href="/booking"
            className="bg-green-600 text-white px-6 py-3 rounded-md text-sm inline-block hover:bg-green-500 transition-all duration-300"
          >
            Réserver maintenant →
          </a>
        </div>

        {/* Section 5: Suivez-nous */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Suivez-nous</h3>
          <div className="flex space-x-4 mb-4">
            <a
              href="https://www.facebook.com"
              className="text-blue-400 hover:text-white transition-all duration-300"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://www.instagram.com"
              className="text-blue-400 hover:text-white transition-all duration-300"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.twitter.com"
              className="text-blue-400 hover:text-white transition-all duration-300"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://www.youtube.com"
              className="text-blue-400 hover:text-white transition-all duration-300"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center">
        <p className="text-gray-400 text-sm">
          &copy; {currentYear} Tous droits réservés - Mr. Renaudin Barbershop.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Développé par Carl Henry Fortunat - Expert Web.
        </p>
        <div className="mt-2 space-x-4">
          <a
            href="/privacy"
            className="text-gray-400 hover:text-blue-400 transition-all duration-300 text-sm"
          >
            Politique de confidentialité
          </a>
          <a
            href="/terms"
            className="text-gray-400 hover:text-blue-400 transition-all duration-300 text-sm"
          >
            Conditions Générales
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
