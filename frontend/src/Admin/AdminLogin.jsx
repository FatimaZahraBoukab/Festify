"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import "./AdminLogin.css" // Import the CSS file
import logoImage from './logo.png';

function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await api.post("/admin/login/", {
        username,
        password,
      })

      if (response.data.success) {
        // Stocker le token dans le localStorage
        localStorage.setItem("adminToken", response.data.token)
        localStorage.setItem(
          "adminUser",
          JSON.stringify({
            id: response.data.user_id,
            isSuperuser: response.data.is_superuser,
            username: username,
          }),
        )

        // Rediriger vers le tableau de bord admin
        navigate("/admin/dashboard")
      } else {
        setError("Échec de l'authentification")
      }
    } catch (err) {
      setError("Erreur de connexion: " + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="Admin-login-container">
      <div className="Admin-login-left">
        <div className="Admin-logo-container">
          <img src={logoImage} alt="Festify Logo" className="logo-image" />
         
        </div>

        <div className="Admin-login-form-container">
       
  
          {error && (
            <div className="error-alert" role="alert">
              {error}
            </div>
          )}
            
          <form className="Admin-login-form" onSubmit={handleSubmit}>

          <div className="Admin-welcome-123">
            <h2>Bienvenue</h2>
          </div>
            <div className="Admin-form-group">
            <div className="Admin-username-header">
              <label htmlFor="username">Nom d'utilisateur</label>
              </div>
              <div className="Admin-input-container">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Saisissez votre nom d'utilisateur"
                />
                <span className="Admin-input-icon">👤</span>
              </div>
            </div>

            <div className="Admin-form-group">
              <div className="Admin-password-header">
                <label htmlFor="password">Mot de passe</label>
                
              </div>
              <div className="Admin-input-container">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Saisissez votre mot de passe"
                />
                <span className="Admin-input-icon">🔒</span>
              </div>
            </div>

            <button type="submit" disabled={loading} className="Admin-login-button">
              {loading ? "Connexion en cours..." : "SE CONNECTER"}
            </button>
          </form>

          
        </div>
      </div>

      <div className="Admin-login-right">
        <div className="Admin-right-content">
          <h2 className="Admin-headline">Administration des Événements</h2>
          <p className="Admin-subheadline">Gérez tous vos événements depuis un seul endroit</p>
          <p className="Admin-description">
            Planifiez, organisez et suivez vos événements avec notre interface d'administration intuitive
          </p>
          <p className="Admin-tagline">Simplifiez votre gestion événementielle</p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

