import React, { useState } from "react";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    shavingType: "rasage standard", // par défaut
    preferredDate: "",
    preferredTime: "",
    memo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      alert("Veuillez entrer un numéro de téléphone valide.");
      return false;
    }

    const now = new Date();
    const selectedDate = new Date(`${formData.preferredDate}T${formData.preferredTime}`);
    if (selectedDate <= now) {
      alert("Veuillez sélectionner une date et une heure futures.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("https://mobile-barbershop-backend.onrender.com/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Réservation envoyée avec succès ! Nous vous confirmerons bientôt.");
      } else {
        alert(result.message || "Erreur lors de la réservation.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réservation", error);
      alert("Erreur lors de l'envoi de la réservation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Réservez votre coupe</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Nom complet</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Numéro de téléphone</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">E-mail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Adresse</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Type de rasage</label>
          <select
            name="shavingType"
            value={formData.shavingType}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-blue-500"
          >
            <option value="rasage standard">Rasage standard</option>
            <option value="rasage complet">Rasage complet</option>
            <option value="rasage avec soin">Rasage avec soin</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Date préférée</label>
          <input
            type="date"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            required
            className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Heure préférée</label>
          <input
            type="time"
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            required
            className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Memo</label>
          <textarea
            name="memo"
            value={formData.memo}
            onChange={handleChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-blue-500"
            placeholder="Ajoutez une note (facultatif)"
          />
        </div>
        <button
          type="submit"
          className={`w-full p-2 mt-4 text-white rounded-md ${isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Envoi en cours..." : "Réserver"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
