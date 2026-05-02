import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const ADDRESS = "462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7, Canada";
const PHONE = "514-778-8318";
const EMAIL = "mrrenaudinbarber@gmail.com";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-16 pb-10">
      
      {/* TOP CTA STRIP */}
      <div className="max-w-6xl mx-auto px-4 mb-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">
          Mr. Renaudin Barbershop — Shawinigan
        </h2>
        <p className="text-gray-400 mt-2">
          Barbershop physique • Coupe moderne • Dégradé propre • Expérience premium
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* VISIT */}
        <div>
          <h3 className="text-lg font-semibold mb-4">📍 Visitez le shop</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {ADDRESS}
          </p>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              ADDRESS
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            Ouvrir sur Google Maps
          </a>
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="text-lg font-semibold mb-4">✂️ Services</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>Coupe moderne</li>
            <li>Fade / Dégradé</li>
            <li>Barbe & lineup</li>
            <li>Rasage classique</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold mb-4">📞 Contact</h3>

          <p className="text-gray-400 text-sm mb-2">{PHONE}</p>

          <a
            href={`tel:${PHONE}`}
            className="text-blue-400 hover:underline block mb-3"
          >
            Appeler maintenant
          </a>

          <a
            href={`mailto:${EMAIL}`}
            className="text-blue-400 hover:underline block"
          >
            {EMAIL}
          </a>
        </div>

        {/* BOOKING */}
        <div>
          <h3 className="text-lg font-semibold mb-4">📅 Réservation</h3>

          <p className="text-gray-400 text-sm mb-4">
            Réserve ton rendez-vous en ligne et viens directement au shop.
          </p>

          <a
            href="/booking"
            className="bg-yellow-500 text-black px-5 py-2 rounded-lg font-bold hover:bg-yellow-400 transition inline-block"
          >
            Réserver maintenant
          </a>
        </div>
      </div>

      {/* SOCIAL */}
      <div className="max-w-6xl mx-auto px-4 mt-12 flex justify-center space-x-6">
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FaFacebook size={22} />
        </a>

        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram size={22} />
        </a>

        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <FaTwitter size={22} />
        </a>

        <a
          href="https://www.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
        >
          <FaYoutube size={22} />
        </a>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm px-4">
        <p>
          © {currentYear} Mr. Renaudin Barbershop — Shawinigan, QC
        </p>

        <p className="mt-2">
          Développé avec passion pour une expérience client premium.
        </p>
      </div>
    </footer>
  );
};

export default Footer;