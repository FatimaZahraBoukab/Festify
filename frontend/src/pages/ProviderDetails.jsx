import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import './ProviderDetails.css';
import { FaEuroSign, FaStar, FaMapMarkerAlt, FaCalendarCheck, FaPhone, FaEnvelope, FaArrowLeft } from 'react-icons/fa';

function ProviderDetails() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Récupérer les détails du prestataire
        const providerResponse = await api.get(`providers/${id}/`);
        setProvider(providerResponse.data);

        // Récupérer les services du prestataire avec leurs images
        const servicesResponse = await api.get(`services/?provider_id=${id}`);
        
        // Pour chaque service, récupérer ses images
        const servicesWithImages = await Promise.all(
          servicesResponse.data.map(async (service) => {
            const imagesResponse = await api.get(`services/${service.id}/images/`);
            return {
              ...service,
              images: imagesResponse.data
            };
          })
        );

        setServices(servicesWithImages);
        
        // Récupérer les événements de l'utilisateur pour la réservation
        const eventsResponse = await api.get('events/');
        setEvents(eventsResponse.data);
        if (eventsResponse.data.length > 0) {
          setSelectedEvent(eventsResponse.data[0].id);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données", error);
        setError("Impossible de charger les informations du prestataire. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
const ServiceCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="custom-carousel">
      <div className="carousel-image-container">
        <img 
          src={images[currentIndex].image_url} 
          alt={`Slide ${currentIndex + 1}`}
          className="carousel-image"
        />
        {images.length > 1 && (
          <>
            <button className="carousel-button prev" onClick={prevSlide}>
              &lt;
            </button>
            <button className="carousel-button next" onClick={nextSlide}>
              &gt;
            </button>
            <div className="carousel-indicators">
              {images.map((_, index) => (
                <span 
                  key={index}
                  className={`indicator ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
const handleBooking = async (serviceId = null) => {
  const serviceToBook = serviceId ? services.find(s => s.id === serviceId) : selectedService;
  
  if (!selectedEvent) {
    alert("Veuillez sélectionner un événement pour la réservation.");
    return;
  }

  if (!serviceToBook) {
    alert("Veuillez sélectionner un service pour la réservation.");
    return;
  }

  try {
    // Structure corrigée pour correspondre à l'API
    const bookingData = {
      service_id: serviceToBook.id,  // Utilisez service_id au lieu de service
      event_id: selectedEvent,      // Utilisez event_id au lieu de event
      client_notes: "Réservation via l'interface client",
    };

    await api.post('bookings/', bookingData);
    
    alert(`Service "${serviceToBook.name}" réservé avec succès !`);
    navigate('/dashboard', { 
      state: { activeTab: 'bookings' } 
    });
  } catch (error) {
    console.error("Erreur complète:", error.response?.data || error.message);
    alert(`Erreur: ${error.response?.data?.detail || error.message || "Erreur inconnue"}`);
  }
};
  // Fonction pour afficher le prix du service sélectionné
  const renderSelectedServiceDetails = () => {
    if (!selectedService) return null;
    
    return (
      <div className="selected-service-details">
        <h3>Service sélectionné</h3>
        <p><strong>Nom:</strong> {selectedService.name}</p>
        <p><strong>Description:</strong> {selectedService.description}</p>
        <p><strong>Prix:</strong> {selectedService.price ? `${selectedService.price} €` : "Sur devis"}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Chargement des informations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oups, quelque chose s'est mal passé</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="error-container">
        <h2>Prestataire non trouvé</h2>
        <button onClick={() => navigate('/providers')}>Retour à la liste</button>
      </div>
    );
  }

  // Fonction pour gérer la sélection d'un événement
  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
  };

  return (
    <div className="provider-details-container">
      <button className="back-button" onClick={() => navigate('/providers')}>
        <FaArrowLeft /> Retour aux prestataires
      </button>
      
      <div className="provider-details-card">
        <div className="provider-header">
          <div className="provider-avatar">
            {provider.entreprise?.charAt(0)}
          </div>
          <div className="provider-title">
            <h1>{provider.entreprise}</h1>
            <div className="provider-subtitle">
              <span className="category-badge">{provider.service}</span>
              <div className="provider-rating">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="star-inactive" />
                <span>4.0/5</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ajout du sélecteur d'événement en haut de la page */}
        {events.length > 0 && (
          <div className="event-selector">
            <label>Événement pour réservation : </label>
            <select 
              value={selectedEvent} 
              onChange={handleEventChange}
            >
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name} ({formatDate(event.date)})
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="provider-sections">
          <div className="provider-main-info">
            <div className="info-section">
              <h2>À propos</h2>
              <p>{provider.description || "Aucune description disponible pour ce prestataire."}</p>
            </div>

            <div className="info-section">
              <h2>Services proposés</h2>
              {events.length === 0 ? (
                <div className="no-events-message">
                  <p>Vous devez créer un événement avant de pouvoir réserver un service.</p>
                  <button onClick={() => navigate('/create-event')} className="create-event-button">
                    Créer un événement
                  </button>
                </div>
              ) : (
                <div className="services-grid">
                  {services.map(service => (
                    <div 
                      key={service.id} 
                      className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                      onClick={() => setSelectedService(service)}
                    >
                      {service.images && service.images.length > 0 && (
  <ServiceCarousel images={service.images} />
)}
                      <div className="service-details">
                        <h3>{service.name}</h3>
                        <p>{service.description}</p>
                        <div className="service-price">
                          <FaEuroSign />
                          <span>{service.price ? `${service.price} €` : "Sur devis"}</span>
                        </div>
                        {/* Ajout du bouton "Réserver" sur chaque carte de service */}
                        <button 
                          className="book-now-button" 
                          onClick={(e) => {
                            e.stopPropagation(); // Empêche de sélectionner le service en même temps
                            handleBooking(service.id);
                          }}
                        >
                          <FaCalendarCheck /> Réserver 
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {services.length === 0 && (
                <p>Aucun service disponible pour ce prestataire.</p>
              )}
            </div>
            
            <div className="info-section">
              <h2>Localisation</h2>
              <div className="location-info">
                <FaMapMarkerAlt />
                <span>{provider.location || "Maroc"}</span>
              </div>
            </div>
            
            <div className="info-section">
              <h2>Contact</h2>
              <div className="contact-info">
                <div className="contact-item">
                  <FaEnvelope />
                  <span>{provider.contact || "Contact non disponible"}</span>
                </div>
                {provider.phone && (
                  <div className="contact-item">
                    <FaPhone />
                    <span>{provider.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="booking-sidebar">
            <div className="booking-card">
              <h2>Réserver ce prestataire</h2>
              {events.length === 0 ? (
                <div className="no-events">
                  <p>Vous n'avez pas encore d'événement.</p>
                  <button onClick={() => navigate('/create-event')}>Créer un événement</button>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Pour quel événement ?</label>
                    <select 
                      value={selectedEvent} 
                      onChange={(e) => setSelectedEvent(e.target.value)}
                    >
                      {events.map(event => (
                        <option key={event.id} value={event.id}>
                          {event.name} ({formatDate(event.date)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {renderSelectedServiceDetails()}
                  {selectedService ? (
                    <div className="selected-service">
                      <h3>Service sélectionné</h3>
                      <p>{selectedService.name}</p>
                      <p>{selectedService.price ? `${selectedService.price} €` : "Sur devis"}</p>
                    </div>
                  ) : (
                    <p>Veuillez sélectionner un service</p>
                  )}
                  <button 
                    className="book-button" 
                    onClick={() => handleBooking()} 
                    disabled={!selectedService}
                  >
                    <FaCalendarCheck /> Réserver maintenant
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fonction pour formater la date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

export default ProviderDetails;