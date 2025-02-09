import React, { useState, useCallback, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "animate.css"; // Importer animate.css

const BookingPage = () => {
  // Scroll to the top when the component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Données initiales du formulaire centralisées
  const initialFormData = {
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    shavingType: "",
    preferredDate: "",
    preferredTime: "",
    memo: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const shavingOptions = [
    "Rasage complet",
    "Coupe classique",
    "Dégradé moderne",
    "Rasage de la barbe uniquement",
  ];

  const availability = {
    Lundi: "11h30 AM - 08h30 PM",
    Mardi: "11h30 AM - 08h30 PM",
    Mercredi: "11h30 AM - 08h30 PM",
    Jeudi: "11h30 AM - 08h30 PM",
    Vendredi: "11h30 AM - 08h30 PM",
    Samedi: "11h30 AM - 08h30 PM",
    Dimanche: "11h30 AM - 08h30 PM",
  };

  // Utilisation de useCallback pour éviter la recréation de la fonction à chaque rendu
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validateForm = () => {
    if (!formData.fullName || !formData.phoneNumber || !formData.email) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      return false;
    }
    // Comparaison de la date sans tenir compte de l'heure
    const selectedDate = new Date(formData.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setErrorMessage("Veuillez sélectionner une date future.");
      return false;
    }
    // Effacer le message d'erreur en cas de validation réussie
    setErrorMessage("");
    return true;
  };

  // Use the REACT_APP_API_URL environment variable if available, or fallback to the production URL.
  const API_URL = process.env.REACT_APP_API_URL || "https://mobile-barbershop-frontend.vercel.app";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    // Normalisation de la date pour le format ISO (YYYY-MM-DD)
    const normalizedFormData = {
      ...formData,
      preferredDate: new Date(formData.preferredDate).toISOString().split("T")[0],
    };

    try {
      const response = await fetch(`${API_URL}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedFormData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData(initialFormData);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Une erreur s'est produite.");
      }
    } catch (error) {
      setErrorMessage("Une erreur réseau s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Composant pour l'affichage de chaque horaire
  const AvailabilityCard = ({ day, hours }) => (
    <div
      className="bg-blue-50 p-4 sm:p-6 rounded-lg text-center shadow-lg hover:bg-blue-100 transition-all duration-300 animate__animated animate__fadeInUp"
    >
      <p className="text-lg sm:text-xl font-medium text-gray-800">{day}</p>
      <p className="text-sm sm:text-base text-gray-600">{hours}</p>
    </div>
  );

  return (
    <>
      <Header />

      <main className="bg-gradient-to-b from-blue-100 to-blue-200 min-h-screen py-8 sm:py-10">
        {/* Section Hero */}
        <section className="text-center py-16 px-4 sm:px-6 md:px-12 bg-blue-50 shadow-lg rounded-lg mx-2 sm:mx-10 mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-3 sm:mb-4 leading-tight animate__animated animate__fadeInUp">
            Offrez-vous le meilleur soin capillaire avec Mr. Renaudin Barbershop
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 animate__animated animate__fadeInUp">
            Prenez rendez-vous dès aujourd'hui pour vivre une expérience coiffure inoubliable.
          </p>
        </section>

        {/* Section Horaires */}
        <section className="py-12 px-4 sm:px-8 bg-white shadow-md rounded-lg mx-2 sm:mx-10 mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-6 animate__animated animate__bounceIn">
            Nos horaires flexibles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Object.entries(availability).map(([day, hours], index) => (
              <AvailabilityCard key={index} day={day} hours={hours} />
            ))}
          </div>
        </section>

        {/* Section Réservation */}
        <section className="container mx-auto px-4 sm:px-6 py-12 bg-white shadow-xl rounded-lg mx-2 sm:mx-10 mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-6 animate__animated animate__fadeInUp">
            Réservez votre service maintenant
          </h2>

          {submitted ? (
            <div className="text-center animate__animated animate__fadeInUp">
              <h3 className="text-2xl sm:text-3xl font-semibold text-green-600 mb-3">
                Votre demande de réservation a bien été envoyée !
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-3">
                Merci d'avoir choisi Mr. Renaudin Barbershop. Nous traitons actuellement votre demande.
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-3">
                Vous recevrez bientôt un e-mail avec l'état de votre réservation.
              </p>
              <p className="text-base sm:text-lg text-gray-600">
                Merci pour votre confiance et à très bientôt.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate__animated animate__fadeInUp">
              {errorMessage && (
                <p className="text-red-500 text-center font-semibold">{errorMessage}</p>
              )}

              {/* Informations client */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              </div>

              {/* Sélection du type de rasage */}
              <div>
                <label htmlFor="shavingType" className="block text-sm font-medium text-gray-700">
                  Type de rasage
                </label>
                <select
                  id="shavingType"
                  name="shavingType"
                  value={formData.shavingType}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                >
                  <option value="" disabled>
                    Sélectionnez un type de rasage
                  </option>
                  {shavingOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date et heure préférées */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">
                    Date préférée
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700">
                    Heure préférée
                  </label>
                  <input
                    type="time"
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  />
                </div>
              </div>

              {/* Zone de texte pour le memo */}
              <div>
                <label htmlFor="memo" className="block text-sm font-medium text-gray-700">
                  Memo (facultatif)
                </label>
                <textarea
                  id="memo"
                  name="memo"
                  value={formData.memo}
                  onChange={handleInputChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              </div>

              {/* Bouton de soumission */}
              <div className="text-center">
                <button
                  type="submit"
                  className="mt-4 w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 animate__animated animate__bounceIn"
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer la demande"}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default BookingPage;
