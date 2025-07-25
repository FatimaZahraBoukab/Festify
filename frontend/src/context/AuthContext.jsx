import { createContext, useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";


// Création du contexte
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // Définir correctement l'en-tête d'autorisation
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      api.get("users/")
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des données utilisateur", error);
          // Ne pas appeler logout() automatiquement pour chaque erreur

          setUser({isAuthenticated: true }); // ou gardez l'utilisateur tel qu'il est
        });
    }
  }, []);

const login = async (username, password) => {
  try {
    const response = await api.post("token/", { username, password }); // Utiliser /api/token/
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    setUser({ username });  // Stocker l'utilisateur connecté
    navigate("/home");  // Rediriger vers la page Home
  } catch (error) {
    console.error("Erreur de connexion", error);
    alert("Identifiants incorrects !");
  }
};

  // Déconnexion
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
