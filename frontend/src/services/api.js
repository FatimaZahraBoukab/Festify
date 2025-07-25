import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Ajouter automatiquement le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est une 401 et que ce n'est pas une requête de rafraîchissement
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Rafraîchir le token
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await api.post("token/refresh/", { refresh: refreshToken });

        // Mettre à jour le token d'accès
        localStorage.setItem("access_token", response.data.access);

        // Rejouer la requête originale avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si le rafraîchissement échoue, déconnecter l'utilisateur
        console.error("Erreur de rafraîchissement du token", refreshError);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; // Rediriger vers la page de connexion
      }
    }

    return Promise.reject(error);
  }
);


export default api;
