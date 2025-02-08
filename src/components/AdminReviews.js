import React, { useState, useEffect } from "react";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const response = await fetch("https://mobile-barbershop-backend.onrender.com/api/reviews");
    const data = await response.json();
    setReviews(data);
  };

  const handleAddOrUpdateReview = async (e) => {
    e.preventDefault();
    const method = editMode ? "PUT" : "POST";
    const url = editMode
      ? `https://mobile-barbershop-backend.onrender.com/api/reviews/${currentId}`
      : "https://mobile-barbershop-backend.onrender.com/api/reviews";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setFormData({ title: "", content: "" });
    setEditMode(false);
    fetchReviews();
  };

  const handleDeleteReview = async (id) => {
    await fetch(`https://mobile-barbershop-backend.onrender.com/api/reviews/${id}`, {
      method: "DELETE",
    });
    fetchReviews();
  };

  const handleEditReview = (review) => {
    setFormData({ title: review.title, content: review.content });
    setCurrentId(review.id);
    setEditMode(true);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddOrUpdateReview} className="space-y-2">
        <input
          type="text"
          placeholder="Titre"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Contenu"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          className="border p-2 w-full"
        ></textarea>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editMode ? "Modifier l'avis" : "Ajouter l'avis"}
        </button>
      </form>

      <ul className="space-y-2">
        {reviews.map((review) => (
          <li key={review.id} className="border p-2">
            <h2 className="font-bold">{review.title}</h2>
            <p>{review.content}</p>
            <div className="space-x-2">
              <button
                onClick={() => handleEditReview(review)}
                className="text-blue-500"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDeleteReview(review.id)}
                className="text-red-500"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminReviews;
