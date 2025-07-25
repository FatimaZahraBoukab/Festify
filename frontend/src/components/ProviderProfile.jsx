import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProviderProfile.css';

const ProviderProfile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    entreprise: '',
    service: '',
    contact: '',
    description: '',
    location: '',
    profile_picture: null,
    profile_picture_url: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    // Ajouter la police Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const fetchProfile = async () => {
  setIsLoading(true);
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch('http://localhost:8000/api/provider/profile/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      setProfile({
        ...data,
        profile_picture_url: data.profile_picture 
          ? `http://localhost:8000${data.profile_picture}` // Ajoutez l'URL de base si nécessaire
          : '',
        location: data.location || ''
      });
      setError(null);
    } else {
      setError('Erreur lors de la récupération du profil. Veuillez réessayer plus tard.');
    }
  } catch (error) {
    setError('Problème de connexion au serveur. Veuillez vérifier votre connexion internet.');
  } finally {
    setIsLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({
        ...profile,
        profile_picture: file,
        profile_picture_url: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  const token = localStorage.getItem('accessToken');
  
  try {
    const formData = new FormData();
    
    // Ajouter tous les champs modifiables
    formData.append('entreprise', profile.entreprise);
    formData.append('service', profile.service);
    formData.append('contact', profile.contact);
    formData.append('description', profile.description);
    formData.append('location', profile.location);
    
    // Vérifier si c'est un nouveau fichier
    if (profile.profile_picture && profile.profile_picture instanceof File) {
      formData.append('profile_picture', profile.profile_picture);
    }

    const response = await fetch('http://localhost:8000/api/provider/profile/', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

      if (response.ok) {
        setIsEditing(false);
        displayNotification('Profil mis à jour avec succès', 'success');
        // Forcer le rechargement complet du profil
        await fetchProfile();
      } else {
        const errorData = await response.json();
        console.error('Erreur backend:', errorData);
        displayNotification('Échec de la mise à jour du profil', 'error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      displayNotification('Problème de connexion au serveur', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const displayNotification = (message, type) => {
    const notificationElement = document.createElement('div');
    notificationElement.className = `notification ${type}`;
    notificationElement.textContent = message;
    document.body.appendChild(notificationElement);
    
    setTimeout(() => {
      notificationElement.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(notificationElement);
      }, 500);
    }, 3000);
  };

  if (isLoading && !profile.username) {
    return (
      <div className="provider-container">
        <div className="loading-animation">
          <div className="loading-circle"></div>
          <div className="loading-circle"></div>
          <div className="loading-circle"></div>
        </div>
        <p>Chargement de votre profil...</p>
      </div>
    );
  }

  if (error && !profile.username) {
    return (
      <div className="provider-container error-state">
        <div className="error-icon">!</div>
        <div className="error-message">{error}</div>
        <button className="action-button retry-button" onClick={fetchProfile}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="provider-container">
      <div className="profile-hero">
        <div className="background-pattern"></div>
        
        <div className="profile-header-content">
          <div className="profile-picture-section">
            {profile.profile_picture_url ? (
              <img 
  src={profile.profile_picture_url}
  alt="Photo de profil" 
  className="profile-avatar"
  onError={(e) => {
    e.target.onerror = null; 
    e.target.src = '/placeholder-profile.jpg'
  }}
  key={profile.profile_picture_url}
/>
            ) : (
              <div className="profile-avatar-placeholder">
                <span>{profile.username ? profile.username.charAt(0).toUpperCase() : "P"}</span>
              </div>
            )}
            
            {!isEditing && (
              <button className="change-photo-button" onClick={() => setIsEditing(true)}>
                <span className="edit-icon">✏</span>
              </button>
            )}
          </div>
          
          <div className="profile-headline">
            <h1 className="profile-name">{profile.username || "Prestataire"}</h1>
            <h2 className="profile-company">{profile.entreprise || "Votre Entreprise"}</h2>
            <p className="profile-tagline">{profile.service || "Services proposés"}</p>
          </div>
        </div>
        
        {!isEditing && (
          <button className="edit-profile-button" onClick={() => setIsEditing(true)}>
            Modifier le profil
          </button>
        )}
      </div>

      <div className="profile-content">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="edit-form" encType="multipart/form-data">
            <div className="form-columns">
              <div className="form-left-column">
                <div className="form-section">
                  <h3 className="section-title">Informations de base</h3>
                  
                  <div className="form-group">
                    <label htmlFor="username">Nom d'utilisateur</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={profile.username}
                      className="form-input readonly"
                      readOnly
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile.email}
                      className="form-input readonly"
                      readOnly
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="entreprise">Entreprise</label>
                    <input
                      type="text"
                      id="entreprise"
                      name="entreprise"
                      value={profile.entreprise}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                </div>
                
                <div className="form-section">
                  <h3 className="section-title">Photo de profil</h3>
                  <div className="photo-upload-area">
                    {profile.profile_picture_url && (
                      <img 
                        src={profile.profile_picture_url} 
                        alt="Aperçu" 
                        className="profile-preview"
                        key={profile.profile_picture_url}
                      />
                    )}
                    
                    <div className="upload-controls">
                      <label htmlFor="profile_picture" className="file-upload-button">
                        Choisir une photo
                      </label>
                      <input
                        type="file"
                        id="profile_picture"
                        name="profile_picture"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden-file-input"
                      />
                      <p className="upload-help">JPG, PNG ou GIF, max 2 Mo</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="form-right-column">
                <div className="form-section">
                  <h3 className="section-title">Détails professionnels</h3>
                  
                  <div className="form-group">
                    <label htmlFor="service">Service</label>
                    <input
                      type="text"
                      id="service"
                      name="service"
                      value={profile.service}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Services proposés"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="contact">Contact</label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      value={profile.contact}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Numéro de téléphone ou autre moyen de contact"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="location">Localisation</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Votre localisation"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-section full-width">
              <h3 className="section-title">À propos de vos services</h3>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={profile.description}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="5"
                  placeholder="Décrivez votre activité et vos services..."
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="save-button"
                disabled={isLoading}
              >
                {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details-container">
            <div className="profile-card contact-card">
              <div className="card-header">
                <h3>Contact</h3>
                <div className="card-icon">📞</div>
              </div>
              <div className="card-body">
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{profile.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Téléphone</span>
                  <span className="info-value">
                    {profile.contact || <span className="empty-info">Non renseigné</span>}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Localisation</span>
                  <span className="info-value">
                    {profile.location || <span className="empty-info">Non renseigné</span>}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="profile-card company-card">
              <div className="card-header">
                <h3>Entreprise</h3>
                <div className="card-icon">🏢</div>
              </div>
              <div className="card-body">
                <div className="info-item">
                  <span className="info-label">Nom</span>
                  <span className="info-value">
                    {profile.entreprise || <span className="empty-info">Non renseigné</span>}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Services</span>
                  <span className="info-value">
                    {profile.service || <span className="empty-info">Non renseigné</span>}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="profile-card about-card">
              <div className="card-header">
                <h3>À propos</h3>
                <div className="card-icon">ℹ</div>
              </div>
              <div className="card-body">
                <p className="description-content">
                  {profile.description || 
                    <span className="empty-info">
                      Aucune description disponible. Modifiez votre profil pour ajouter des informations sur vos services et expertises.
                    </span>
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderProfile;