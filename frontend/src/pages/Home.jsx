import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header2';
import Footer from '../components/Footer';
import './Home.css';
import api from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // État pour le formulaire de contact
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactStatus, setContactStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('providers/');

        const uniqueServices = [...new Set(response.data.map(provider => provider.service))];

        const servicesData = uniqueServices.map(service => ({
          name: service,
          description: `Trouvez les meilleurs prestataires pour ${service}`
        }));
        
        setServices(servicesData);
      } catch (err) {
        setError("Erreur lors du chargement des services");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Gérer les changements dans le formulaire de contact
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

   // Soumettre le formulaire de contact
   const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus({ submitting: true, success: false, error: null });
    
    try {
      await api.post('contacts/', contactForm);
      setContactStatus({ submitting: false, success: true, error: null });
      // Réinitialiser le formulaire après soumission réussie
      setContactForm({ name: '', email: '', subject: '', message: '' });
      
      // Message de succès qui disparaît après 5 secondes
      setTimeout(() => {
        setContactStatus(prev => ({ ...prev, success: false }));
      }, 5000);
    } catch (err) {
      console.error("Erreur lors de l'envoi du message", err);
      setContactStatus({ submitting: false, success: false, error: "Échec de l'envoi du message. Veuillez réessayer." });
    }
  };


  const handleServiceClick = (serviceName) => {
    navigate(`/providers?service=${encodeURIComponent(serviceName)}`);
  };

  const handleExploreEvents = () => {
    navigate('/providers');
  };

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  return (
    <div className="home-page">
      <Header />
      
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <h1>Créez des événements inoubliables</h1>
          <p>Festify vous accompagne dans l'organisation de vos événements de A à Z</p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={handleCreateEvent}>
              Créer un événement
            </button>
            <button className="btn btn-secondary" onClick={handleExploreEvents}>
              Explorer les préstataires
            </button>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="section-header">
            <h2>À propos de Festify</h2>
            <div className="section-divider"></div>
          </div>
          <div className="about-content">
            <div className="about-image">
              <img src="src/pages/images/about-image.jpg" alt="À propos de Festify" />
            </div>
            <div className="about-text">
              <h3>Votre partenaire pour des événements réussis</h3>
              <p>
                Festify est une plateforme innovante dédiée à la gestion d'événements, 
                conçue pour simplifier chaque étape de l'organisation, de la planification 
                à l'exécution.
              </p>
              <p>
                Notre mission est de vous offrir les outils nécessaires pour transformer 
                vos idées en expériences mémorables, que ce soit pour un mariage, 
                un anniversaire, une conférence ou tout autre type d'événement.
              </p>
              <div className="about-features">
                <div className="feature">
                  <i className="fas fa-calendar-check"></i>
                  <h4>Planification simplifiée</h4>
                </div>
                <div className="feature">
                  <i className="fas fa-users"></i>
                  <h4>Gestion des invités</h4>
                </div>
                <div className="feature">
                  <i className="fas fa-tasks"></i>
                  <h4>Suivi budgétaire</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section - Modifié */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Nos services</h2>
            <div className="section-divider"></div>
          </div>
          {loading ? (
            <div className="loading-container">
              <p>Chargement des services...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
            </div>
          ) : (
            <div className="services-grid">
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className="service-card"
                  onClick={() => handleServiceClick(service.name)}
                >
                  <div className="service-icon">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Events Showcase */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Ce que disent nos clients</h2>
            <div className="section-divider"></div>
          </div>
          <div className="testimonials-slider">
            <div className="testimonials-row">
              <div className="testimonial">
                <div className="testimonial-content">
                  <div className="quote-icon">
                    <i className="fas fa-quote-left"></i>
                  </div>
                  <p>
                    "Festify a rendu l'organisation de mon mariage tellement simple. 
                    J'ai pu tout gérer en un seul endroit et le jour J s'est déroulé sans accroc!"
                  </p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src="src\pages\images\photo-professionnelle-ia-femme-fond-ville-col-roule-noir-02.3e14978e.webp" alt="Client" />
                  </div>
                  <div className="author-info">
                    <h4>Sophie et Marc</h4>
                    <p>Mariage à Casablanca</p>
                  </div>
                </div>
              </div>
              <div className="testimonial">
                <div className="testimonial-content">
                  <div className="quote-icon">
                    <i className="fas fa-quote-left"></i>
                  </div>
                  <p>
                    "En tant qu'organisateur d'événements d'entreprise, Festify est devenu 
                    mon outil indispensable. La gestion des invités et le suivi budgétaire 
                    sont particulièrement efficaces."
                  </p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src="src\pages\images\homme.webp" alt="Client" />
                  </div>
                  <div className="author-info">
                    <h4>Karim Benjelloun</h4>
                    <p>Directeur événementiel chez TechMaroc</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonials-row">
              <div className="testimonial">
                <div className="testimonial-content">
                  <div className="quote-icon">
                    <i className="fas fa-quote-left"></i>
                  </div>
                  <p>
                    "Grâce à Festify, j'ai organisé l'anniversaire de mes 30 ans avec 
                    150 invités sans stress. L'interface est intuitive et les 
                    fonctionnalités de communication ont facilité tous les échanges."
                  </p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src="src\pages\images\voilée.jpg" alt="Client" />
                  </div>
                  <div className="author-info">
                    <h4>Amina Chakir</h4>
                    <p>Anniversaire à Rabat</p>
                  </div>
                </div>
              </div>
              <div className="testimonial">
                <div className="testimonial-content">
                  <div className="quote-icon">
                    <i className="fas fa-quote-left"></i>
                  </div>
                  <p>
                    "Festify a révolutionné notre façon d'organiser les événements culturels. 
                    La plateforme nous permet de gérer efficacement nos festivals annuels 
                    et d'offrir une meilleure expérience à nos participants."
                  </p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src="src\pages\images\téléchargement.jpeg" alt="Client" />
                  </div>
                  <div className="author-info">
                    <h4>Yousef El Mansouri</h4>
                    <p>Association Culturelle Marrakech</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2>Contactez-nous</h2>
            <div className="section-divider"></div>
          </div>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Besoin d'aide pour votre événement?</h3>
              <p>
                Notre équipe est à votre disposition pour répondre à toutes vos questions 
                et vous aider à créer l'événement parfait.
              </p>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <p>123 Rue des Festivals, 75000 Tanger</p>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <p>+212 6 11 95 58 23</p>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <p>contact@festify.com</p>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    placeholder="Votre nom" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    placeholder="Votre e-mail" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    placeholder="Sujet" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <textarea 
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder="Votre message" 
                    rows="5" 
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={contactStatus.submitting}
                >
                  {contactStatus.submitting ? 'Envoi en cours...' : 'Envoyer'}
                </button>
                {contactStatus.success && (
                  <div className="form-success-message">
                    Message envoyé avec succès! Nous vous répondrons dans les plus brefs délais.
                  </div>
                )}
                {contactStatus.error && (
                  <div className="form-error-message">
                    {contactStatus.error}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;