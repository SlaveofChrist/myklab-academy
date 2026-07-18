import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ex: http://localhost:5000/api
});


// Intercepteur : avant chaque requête, si un token existe en localStorage,
// on l'ajoute automatiquement dans le header Authorization.
// Ça évite de devoir le rajouter manuellement à chaque appel API.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
