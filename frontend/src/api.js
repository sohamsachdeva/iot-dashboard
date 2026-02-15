import axios from "axios";

const isLocalDev =
  typeof window !== "undefined" && window.location.hostname === "localhost";

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL || (isLocalDev ? "http://localhost:5000/api" : "/api"),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
