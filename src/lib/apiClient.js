import axios from "axios";
import { APP_CONFIG } from "../config/appConfig";

const apiClient = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
