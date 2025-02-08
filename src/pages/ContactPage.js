import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

// L'endpoint est défini via une variable d'environnement pour une flexibilité maximale
const CONTACT_ENDPOINT = process.env.REACT_APP_CONTACT_ENDPOINT || "https://mobile-barbershop-backend.onrender.com/api/contact";

const ContactPage = () => {
  // Scroll to the top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Gestion du formulaire et validation via React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  // Handler de soumission : envoi des données à l'API et affichage d'un message engageant
  const onSubmit = async (data) => {
    setSubmissionError("");
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        setSubmitted(true);
        reset();
      } else {
        const errorData = await response.json();
        setSubmissionError(errorData.message || "Oups, une erreur inattendue est survenue. Réessayez rapidement !");
      }
    } catch (error) {
      setSubmissionError("Erreur réseau : merci de réessayer dans quelques instants !");
    }
  };

  return (
    <>
      <Header />

      {/* Section Héro : captez l'attention et inspirez vos visiteurs */}
      <section className="bg-gradient-to-r from-blue-100 to-blue-200 text-gray-900 py-16 px-4 sm:py-20 sm:px-8 lg:py-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          <motion.div
            className="text-left w-full lg:w-1/2"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              Transformez votre look avec Mr. Renaudin Barbershop !
            </h1>
            <p className="text-base sm:text-lg lg:text-xl font-medium text-gray-700 mb-6">
              Vous rêvez d’une métamorphose capillaire ou d’un rafraîchissement de style ? Nos experts passionnés vous offrent une expérience unique et personnalisée. Contactez-nous dès maintenant – ou discutez en direct avec nous en cliquant sur l’icône de chat ci-dessous !
            </p>
          </motion.div>

          <motion.div
            className="mt-8 lg:mt-0 w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <img
              src="/Photos/Carnet1.png"
              alt="Illustration élégante"
              className="max-w-full w-64 sm:w-80 lg:w-96 mx-auto rounded-lg shadow-lg"
            />
          </motion.div>
        </div>
      </section>

      <main
        id="contact-section"
        className="bg-gradient-to-r from-gray-100 to-gray-200 py-10 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between space-y-8 lg:space-y-0 lg:space-x-8">
          {/* Section Coordonnées : inspirez confiance et démontrez votre expertise */}
          <motion.section
            className="w-full lg:w-1/2 bg-white shadow-lg rounded-3xl p-6 sm:p-8 lg:p-12 border-t-8 border-blue-500"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 mb-6">
              Nos Coordonnées – Parlons de votre transformation !
            </h2>
            <div className="space-y-6">
              <motion.p
                className="text-sm sm:text-base lg:text-lg text-gray-700 flex items-center"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <AiOutlinePhone className="mr-3 text-xl sm:text-2xl text-blue-600" />
                <a
                  href="tel:+15147788318"
                  className="text-blue-600 hover:underline break-words"
                >
                  +1 514 778 8318
                </a>
              </motion.p>

              <motion.p
                className="text-sm sm:text-base lg:text-lg text-gray-700 flex items-center"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <AiOutlineMail className="mr-3 text-xl sm:text-2xl text-blue-600" />
                <a
                  href="mailto:mrrenaudinbarber@gmail.com"
                  className="text-blue-600 hover:underline break-words"
                >
                  mrrenaudinbarber@gmail.com
                </a>
              </motion.p>

              <motion.p
                className="text-sm sm:text-base lg:text-lg text-gray-700 flex items-center"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <FaMapMarkerAlt className="mr-3 text-xl sm:text-2xl text-blue-600" />
                <a
                  href="https://www.google.com/maps?q=Trois-Rivières,+QC,+Canada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-words"
                >
                  Trois-Rivières, QC, Canada
                </a>
              </motion.p>

              <motion.p
                className="text-sm sm:text-base lg:text-lg text-gray-700 flex items-center"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <FaClock className="mr-3 text-xl sm:text-2xl text-blue-600" />
                <span className="text-xs sm:text-sm lg:text-base">
                  Ouverts tous les jours : 11h30 - 20h30
                </span>
              </motion.p>
            </div>
          </motion.section>

          {/* Section Formulaire : incitez à agir et à vivre l'expérience */}
          <motion.section
            className="w-full lg:w-1/2 bg-white shadow-lg rounded-3xl p-6 sm:p-8 lg:p-12 border-t-8 border-blue-500"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 mb-6">
              Contactez-nous dès maintenant et lancez votre transformation !
            </h2>
            <AnimatePresence>
              {submitted ? (
                <motion.div
                  key="successMessage"
                  className="text-center bg-green-100 p-6 rounded-xl shadow-lg border-l-4 border-green-600"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-green-700 mb-4">
                    Votre demande a été envoyée avec succès !
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                    Merci de nous avoir contactés. Nous vous répondrons très rapidement pour vous offrir une expérience sur-mesure.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  aria-label="Formulaire de contact attractif"
                >
                  {submissionError && (
                    <motion.div
                      key="errorMessage"
                      className="flex items-center justify-center mb-4 p-4 bg-red-100 border-2 border-red-500 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      role="alert"
                    >
                      <span className="text-red-600 text-2xl mr-2" aria-hidden="true">
                        ⚠️
                      </span>
                      <p className="text-red-600">{submissionError}</p>
                    </motion.div>
                  )}
                  <div className="mb-4">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Nom complet
                    </label>
                    <motion.input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="Entrez votre nom complet et démarrez votre transformation !"
                      aria-invalid={errors.fullName ? "true" : "false"}
                      aria-describedby={errors.fullName ? "fullName-error" : undefined}
                      {...register("fullName", {
                        required: "Votre nom complet est indispensable pour débuter votre métamorphose !"
                      })}
                      className="mt-2 block w-full rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 p-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    {errors.fullName && (
                      <p id="fullName-error" className="text-red-600 text-xs sm:text-sm mt-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Adresse e-mail
                    </label>
                    <motion.input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Votre adresse e-mail pour recevoir nos offres exclusives"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      {...register("email", {
                        required: "Votre e-mail est indispensable pour recevoir nos conseils premium",
                        pattern: {
                          value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                          message: "Veuillez saisir un e-mail valide"
                        }
                      })}
                      className="mt-2 block w-full rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 p-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    {errors.email && (
                      <p id="email-error" className="text-red-600 text-xs sm:text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Votre message
                    </label>
                    <motion.textarea
                      id="message"
                      name="message"
                      placeholder="Partagez en quelques mots vos attentes ou questions..."
                      rows="4"
                      aria-invalid={errors.message ? "true" : "false"}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      {...register("message", {
                        required: "Merci de nous indiquer brièvement ce que vous recherchez !"
                      })}
                      className="mt-2 block w-full rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 p-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    {errors.message && (
                      <p id="message-error" className="text-red-600 text-xs sm:text-sm mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <motion.button
                      type="submit"
                      className="inline-block px-6 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Envoi en cours..." : "Lancez ma transformation"}
                    </motion.button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </motion.section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ContactPage;
