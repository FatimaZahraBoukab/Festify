import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import './Auth.css'
import logoImage from './images/logo.png';
// Import du fichier CSS pour le style

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

     // Vérification des mots de passe
     if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    
    setError("");

    try {
      const response = await api.post("register/", {
        username,
        email,
        password,
      });
      alert("Inscription réussie ! Connectez-vous.");
    } catch (error) {
      console.error("Erreur d'inscription", error);
      alert("Erreur : " + JSON.stringify(error.response.data)); // Affiche les erreurs exactes
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
            <h2>Créez votre compte</h2>
            <p>Rejoignez-nous et commencez à gérer vos événements</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur</label>
              <div className="input-with-icon">
                <i className="icon user-icon"></i>
                <input
                  id="username"
                  type="text"
                  placeholder="Choisissez un nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <i className="icon email-icon"></i>
                <input
                  id="email"
                  type="email"
                  placeholder="Entrez votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <div className="input-with-icon">
                <i className="icon password-icon"></i>
                <input
                  id="password"
                  type="password"
                  placeholder="Créez un mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmation du mot de passe</label>
              <div className="input-with-icon">
                <i className="icon password-icon"></i>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirmez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="auth-button">
              S'inscrire
            </button>
            
            <div className="auth-alternative">
              <span>Vous avez déjà un compte?</span>
              <Link to="/login" className="auth-switch-link">Se connecter</Link>
            </div>
          </form>
        </div>
      </div>
      
      <div className="auth-decoration">
        <div className="decoration-content">
          <h2>L'excellence événementielle</h2>
          <p>Rejoignez les organisateurs qui font la différence</p>
          <div className="stats">
            <div className="stat">+500 événements</div>
            <div className="stat">98% de satisfaction</div>
            <div className="stat">Solution n°1 des professionnels</div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
