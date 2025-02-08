import axios from "axios";

const API_URL = "/api/announcements";

// Fonction générique pour effectuer les requêtes HTTP
const makeRequest = async (method, url, data = null) => {
  try {
    const response = await axios({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la requête ${method} ${url}:`, error);
    throw error; // Lancer l'erreur pour être gérée au niveau supérieur
  }
};

export const createAnnouncement = async (announcementData) => {
  return makeRequest("post", API_URL, announcementData);
};

export const getAnnouncements = async () => {
  return makeRequest("get", API_URL);
};

export const updateAnnouncement = async (id, announcementData) => {
  return makeRequest("put", `${API_URL}/${id}`, announcementData);
};

export const deleteAnnouncement = async (id) => {
  return makeRequest("delete", `${API_URL}/${id}`);
};
