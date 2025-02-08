import React, { useState } from "react";
import { AiOutlinePhone, AiOutlineMail } from "react-icons/ai";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading state

    try {
      const response = await fetch("https://mobile-barbershop-backend.onrender.com/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Message envoyé avec succès !");
        setFormData({ fullName: "", email: "", message: "" });
      } else {
        alert(result.message || "Erreur lors de l'envoi du message.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message", error);
      alert("Erreur lors de l'envoi du message.");
    } finally {
      setLoading(false); // Remove loading state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-xl mx-auto">
      <h3 className="text-3xl font-semibold text-blue-600 mb-6 text-center">Contactez-nous</h3>

      {/* Full Name */}
      <div className="mb-6">
        <label htmlFor="fullName" className="block text-lg font-medium text-gray-700">
          Nom complet
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Entrez votre nom complet"
        />
      </div>

      {/* Email */}
      <div className="mb-6">
        <label htmlFor="email" className="block text-lg font-medium text-gray-700">
          E-mail
        </label>
        <div className="flex items-center space-x-3">
          <AiOutlineMail className="text-2xl text-gray-500" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Entrez votre adresse e-mail"
          />
        </div>
      </div>

      {/* Message */}
      <div className="mb-6">
        <label htmlFor="message" className="block text-lg font-medium text-gray-700">
          Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows="6"
          placeholder="Tapez votre message ici"
        />
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-4 text-lg font-medium rounded-md focus:ring-2 focus:ring-blue-500 ${
            loading
              ? "bg-blue-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Envoi..." : "Envoyer le message"}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
