// src/api/announcementAPI.js
import axios from "axios";

// URL complète de l'API sur votre backend hébergé sur Render
const API_URL = "https://mobile-barbershop-backend.onrender.com/api/announcements";

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
    throw error;
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
