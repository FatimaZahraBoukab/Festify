import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './PrestataireAuth.css'; // Importer le fichier CSS
import logoImage from '../pages/images/logo.png'; // Assurez-vous d'avoir le logo

const PrestataireLogin = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Envoi des données au backend via une requête POST
            const response = await fetch('http://localhost:8000/api/login/provider/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Réponse du backend après connexion:', data);
                // Stocker les tokens JWT dans le localStorage
                localStorage.setItem('accessToken', data.access);
                localStorage.setItem('refreshToken', data.refresh);

                alert('Connexion réussie !');
                window.location.href = '/prestataire/dashboard'; // Redirection vers le tableau de bord après connexion
            } else {
                const errorData = await response.json();
                setError(`Erreur lors de la connexion : ${errorData.detail || 'Identifiants invalides.'}`);
            }
        } catch (error) {
            console.error('Erreur réseau:', error);
            setError('Une erreur réseau s\'est produite.');
        }
    };

    return (
        <div className="prestataire-auth-page">
            <div className="prestataire-auth-content">
                <div className="prestataire-auth-logo-container">
                    <div className="prestataire-auth-logo">
                        <div className="logo-placeholder">
                            <img src={logoImage} alt="Festify Logo" className="logo-image" />
                        </div>
                    </div>
                    
                </div>
                
                <div className="prestataire-auth-welcome">
                    <h2>Espace Prestataire</h2>
                    <p>Connectez-vous pour accéder à votre interface de gestion</p>
                </div>

                {error && <div className="error-message">{error}</div>}
                
                <div className="login-container">
                    <form onSubmit={handleSubmit}>
                        {/* Champ Nom d'utilisateur */}
                        <div>
                            <label htmlFor="username">Nom d'utilisateur</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Entrez votre nom d'utilisateur"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Champ Mot de passe */}
                        <div>
                            <label htmlFor="password">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Entrez votre mot de passe"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Bouton de soumission */}
                        <button type="submit">Se connecter</button>
                        
                        <div className="prestataire-auth-alternative">
                            <span>Vous n'avez pas de compte?</span>
                            <Link to="/prestataire/register" className="prestataire-auth-switch-link">S'inscrire</Link>
                        </div>
                    </form>
                </div>
            </div>
            
            <div className="prestataire-auth-decoration">
                <div className="prestataire-decoration-content">
                    <h2>Espace Prestataires Événementiels</h2>
                    <p>Rejoignez le réseau des professionnels de l'événementiel</p>
                    <p>Gérez vos services et collaborez avec les organisateurs d'événements</p>
                    <div className="prestataire-tagline">
                        Votre expertise, notre plateforme
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrestataireLogin;