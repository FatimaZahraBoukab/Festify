import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './PrestataireAuth.css';
import logoImage from '../pages/images/logo.png';

const PrestataireRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    entreprise: '',
    service: '',
    contact: '',
    description: '',
    profile_picture: null,
    location: ''
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_picture: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setError("");

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await fetch('http://localhost:8000/api/register/provider/', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Inscription réussie !');
        navigate('/prestataire/login');
      } else {
        const errorData = await response.json();
        setError(`Erreur lors de l'inscription : ${JSON.stringify(errorData)}`);
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
          <h2>Rejoindre Festify</h2>
          <p>Créez votre compte prestataire et développez votre activité</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="register-container">
          <form onSubmit={handleSubmit}>
            {/* Champ Nom d'utilisateur */}
            <div>
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Choisissez un nom d'utilisateur"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* Champ Email */}
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Entrez votre adresse email"
                value={formData.email}
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
                placeholder="Créez un mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Champ Confirmer le mot de passe */}
            <div>
              <label htmlFor="confirm_password">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                placeholder="Confirmez votre mot de passe"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Champ Nom de l'entreprise */}
            <div>
              <label htmlFor="entreprise">Nom de l'entreprise</label>
              <input
                type="text"
                id="entreprise"
                name="entreprise"
                placeholder="Entrez le nom de votre entreprise"
                value={formData.entreprise}
                onChange={handleChange}
                required
              />
            </div>

            {/* Champ Service proposé */}
            <div>
              <label htmlFor="service">Service proposé</label>
              <input
                type="text"
                id="service"
                name="service"
                placeholder="Entrez le service que vous proposez"
                value={formData.service}
                onChange={handleChange}
                required
              />
            </div>

            {/* Champ Contact */}
            <div>
              <label htmlFor="contact">Contact</label>
              <input
                type="text"
                id="contact"
                name="contact"
                placeholder="Entrez votre numéro de téléphone"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>

            {/* Champ Description */}
            <div>
              <label htmlFor="description">Description de vos services</label>
              <textarea
                id="description"
                name="description"
                placeholder="Décrivez votre activité et vos services..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Champ Localisation */}
            <div>
              <label htmlFor="location">Localisation</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Entrez votre localisation"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {/* Champ Photo de profil */}
            <div>
              <label htmlFor="profile_picture">Photo de profil</label>
              <input
                type="file"
                id="profile_picture"
                name="profile_picture"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            

            {/* Bouton de soumission */}
            <button type="submit">S'inscrire</button>

            <div className="prestataire-auth-alternative">
              <span>Vous avez déjà un compte?</span>
              <Link to="/prestataire/login" className="prestataire-auth-switch-link">Se connecter</Link>
            </div>
          </form>
        </div>
      </div>

      <div className="prestataire-auth-decoration">
        <div className="prestataire-decoration-content">
          <h2>Développez votre réseau professionnel</h2>
          <p>Rejoignez les prestataires qui font confiance à Festify</p>
          <p>Accédez à de nouvelles opportunités et valorisez votre savoir-faire</p>
          <div className="prestataire-tagline">
            Faites rayonner votre expertise
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrestataireRegister;