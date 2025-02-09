import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fix the Authorization header by using template literals
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

  useEffect(() => {
    // Scroll to the top when the page loads
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    const checkAdmin = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          setIsAdmin(decodedToken.role === 'admin');
        } catch (err) {
          console.error("Erreur lors du décodage du token :", err);
          setIsAdmin(false);
        }
      }
    };

    const fetchAnnouncements = async () => {
      setLoadingAnnouncements(true);
      try {
        const response = await axios.get('/api/announcements');
        const data = response.data;
        // Check if the response is directly an array or nested inside an object
        if (Array.isArray(data)) {
          setAnnouncements(data);
        } else if (data && Array.isArray(data.announcements)) {
          setAnnouncements(data.announcements);
        } else {
          console.error("Unexpected API response structure:", data);
          setError("Impossible de charger les annonces pour le moment.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des annonces :", err);
        setError("Impossible de charger les annonces pour le moment.");
      } finally {
        setLoadingAnnouncements(false);
      }
    };

    checkAdmin();
    fetchAnnouncements();
  }, []);

  const validateFields = () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      setError("Le titre et le contenu sont obligatoires.");
      return false;
    }
    return true;
  };

  const handleAddOrEditAnnouncement = async () => {
    if (!validateFields()) return;

    setLoading(true);
    setError('');
    try {
      let response;
      if (editingId) {
        response = await axios.put(`/api/announcements/${editingId}`, newAnnouncement);
        setAnnouncements(
          announcements.map((announcement) =>
            announcement.id === editingId ? response.data : announcement
          )
        );
        toast.success('Annonce modifiée avec succès !');
      } else {
        response = await axios.post('/api/announcements', newAnnouncement);
        setAnnouncements([response.data, ...announcements]);
        toast.success('Annonce ajoutée avec succès !');
      }
      setNewAnnouncement({ title: '', content: '' });
      setEditingId(null);
    } catch (err) {
      console.error("Erreur lors de l'ajout/modification :", err);
      setError("Une erreur est survenue lors de l'opération. Veuillez réessayer !");
      toast.error("Une erreur est survenue !");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      try {
        await axios.delete(`/api/announcements/${id}`);
        setAnnouncements(announcements.filter((announcement) => announcement.id !== id));
        toast.success('Annonce supprimée avec succès !');
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
        setError("Impossible de supprimer l'annonce.");
        toast.error("Une erreur est survenue !");
      }
    }
  };

  const handleEditAnnouncement = (id) => {
    const announcementToEdit = announcements.find((announcement) => announcement.id === id);
    if (announcementToEdit) {
      setNewAnnouncement({ title: announcementToEdit.title, content: announcementToEdit.content });
      setEditingId(id);
    }
  };

  const scrollToAnnouncements = () => {
    const announcementsSection = document.getElementById("announcements-section");
    if (announcementsSection) {
      announcementsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen flex flex-col">
      <Header />

      {/* Entête promotionnelle */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 px-4 sm:px-6 md:px-8 text-center rounded-b-3xl shadow-2xl animate__animated animate__fadeIn">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 animate__animated animate__bounceIn drop-shadow-lg">
          Découvrez les Annonces Exclusives !
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 animate__animated animate__fadeIn drop-shadow">
          Restez informé des dernières offres et nouveautés qui transformeront votre expérience.
        </p>
        <button
          onClick={scrollToAnnouncements}
          className="bg-yellow-500 text-black px-6 sm:px-8 py-3 rounded-full text-lg font-semibold hover:bg-yellow-600 transition duration-300 animate__animated animate__fadeIn animate__delay-1s"
        >
          Voir les annonces
        </button>
      </section>

      {/* Section des annonces */}
      <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 mb-8">
          Les Annonces Exclusives
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-600 border border-red-300 rounded-md shadow-md">
            {error}
          </div>
        )}

        {isAdmin && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl mb-8">
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
              {editingId ? 'Modifier' : 'Ajouter'} une annonce promotionnelle
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Titre accrocheur pour l'annonce"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full p-3 sm:p-4 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 bg-white text-gray-800"
                />
                <svg
                  className="absolute left-3 top-3 w-5 h-5 sm:w-6 sm:h-6 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 13l-7 7-7-7" />
                </svg>
              </div>
              <textarea
                placeholder="Détaillez ici le contenu de votre annonce"
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 h-32 transition duration-300 bg-white text-gray-800"
              />
              <button
                onClick={handleAddOrEditAnnouncement}
                className="w-full py-2 sm:py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
                disabled={loading}
              >
                {loading ? 'En cours...' : editingId ? 'Modifier l\'annonce' : 'Ajouter l\'annonce'}
              </button>
            </div>
          </div>
        )}

        {loadingAnnouncements ? (
          <div className="text-center py-12 text-lg font-semibold">
            Chargement des annonces...
          </div>
        ) : (
          <div id="announcements-section" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {Array.isArray(announcements) && announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  {announcement.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {announcement.content}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mb-4">
                  {(() => {
                    const dateObj = new Date(announcement.created_at);
                    const datePart = dateObj.toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    });
                    const timePart = dateObj.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    });
                    return `${datePart} / ${timePart}`;
                  })()}
                </p>
                {isAdmin && (
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleEditAnnouncement(announcement.id)}
                      className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300 text-sm sm:text-base"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      className="text-red-600 hover:text-red-800 font-semibold transition duration-300 text-sm sm:text-base"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AnnouncementPage;
