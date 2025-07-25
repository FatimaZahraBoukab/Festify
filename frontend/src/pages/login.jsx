import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logoImage from './images/logo.png';
import './Auth.css'

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    login(username, password);
  };*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password); // Appelez la fonction de connexion
      navigate("/home"); // Redirigez vers la page d'accueil après une connexion réussie
    } catch (error) {
      console.error("Erreur de connexion", error);
    }
  };

  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo-container">
          <div className="auth-logo">
            {/* Emplacement pour votre logo */}
            <div className="logo-placeholder">
              <img src={logoImage} alt="Festify Logo" className="logo-image" />
            </div>
          </div>
          <h1 className="auth-app-name">Festify</h1>
        </div>
        
        <div className="auth-form-container">
          <div className="auth-welcome">
            <h2>Bienvenue</h2>
            <p>Connectez-vous pour accéder à votre espace</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur</label>
              <div className="input-with-icon">
                <i className="icon user-icon"></i>
                <input
                  id="username"
                  type="text"
                  placeholder="Entrez votre nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Mot de passe</label>
                <Link to="/forgot-password" className="forgot-password">Mot de passe oublié?</Link>
              </div>
              <div className="input-with-icon">
                <i className="icon password-icon"></i>
                <input
                  id="password"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="auth-button">
              Se connecter
            </button>
            
            <div className="auth-alternative">
              <span>Vous n'avez pas de compte?</span>
              <Link to="/register" className="auth-switch-link">S'inscrire</Link>
            </div>
          </form>
        </div>
      </div>
      
      <div className="auth-decoration">
        <div className="decoration-content">
          <h2>Gérez vos événements en toute simplicité</h2>
          <p>Transformez vos idées en expériences inoubliables</p>
          <p>De la conception à la réalisation, Festify donne vie à vos événements</p>
          <div className="tagline">
            Votre vision, notre expertise
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
