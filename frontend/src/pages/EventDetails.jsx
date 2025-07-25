import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header2';
import Footer from '../components/Footer';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // État pour la galerie d'images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // État pour stocker les données de l'événement
  const [eventData, setEventData] = useState(null);
  // État pour gérer le chargement
  const [loading, setLoading] = useState(true);
  
  // Base de données factice d'événements - À remplacer par un appel API
  const eventsDatabase = {
    // Mariage
    "1": {
      id: "1",
      title: "Mariage élégant en bord de mer",
      category: "Mariages",
      date: "15 Juin 2025",
      location: "Hôtel Royal Atlas, Agadir",
      price: "À partir de 25 000 MAD",
      rating: 4.8,
      description: "Transformez votre jour spécial en un événement inoubliable avec notre forfait de mariage en bord de mer. Profitez d'une cérémonie élégante face à l'océan atlantique, suivie d'une réception somptueuse dans nos salons décorés avec goût.",
      features: [
        "Cérémonie face à la mer",
        "Réception pour 150 invités",
        "Menu gastronomique personnalisé",
        "Décoration florale complète",
        "Suite nuptiale offerte",
        "DJ et animation musicale",
        "Service photo et vidéo professionnel"
      ],
      testimonials: [
        {
          name: "Leila et Amine",
          comment: "Notre mariage était exactement comme nous l'avions rêvé. L'équipe de Festify a su capturer notre vision et la transformer en réalité.",
          avatar: "src/pages/images/testimonial-couple1.jpg"
        },
        {
          name: "Yasmine et Karim",
          comment: "Le souci du détail était impressionnant. Nos invités nous parlent encore de la beauté de notre mariage plusieurs mois après!",
          avatar: "src/pages/images/testimonial-couple2.jpg"
        }
      ],
      images: [
        "src/pages/images/wedding-main.jpg",
        "src/pages/images/wedding-ceremony.jpg",
        "src/pages/images/wedding-reception.jpg",
        "src/pages/images/wedding-food.jpg",
        "src/pages/images/wedding-decor.jpg"
      ],
      similarEvents: ["2", "3", "4"]
    },
    
    // Conférence
    "2": {
      id: "2",
      title: "Conférence Technologie & Innovation",
      category: "Conférences",
      date: "22 Septembre 2025",
      location: "Centre des Congrès, Casablanca",
      price: "À partir de 15 000 MAD",
      rating: 4.6,
      description: "Organisez une conférence professionnelle qui impressionnera vos participants. Notre forfait comprend une salle équipée des dernières technologies audiovisuelles, un service de restauration haut de gamme et une équipe dédiée pour assurer le bon déroulement de votre événement.",
      features: [
        "Salle de conférence pour 200 personnes",
        "Équipement audiovisuel de pointe",
        "Wifi haute vitesse dédié",
        "Service d'enregistrement et streaming",
        "Pauses café et déjeuner gastronomique",
        "Espace d'exposition pour sponsors",
        "Service d'inscription digital"
      ],
      testimonials: [
        {
          name: "Omar Benali",
          comment: "L'organisation de notre conférence annuelle a été impeccable. Festify a dépassé nos attentes en matière de professionnalisme et de qualité de service.",
          avatar: "src/pages/images/testimonial-business1.jpg"
        },
        {
          name: "Salma Kabbaj",
          comment: "Nos participants ont été enchantés par la qualité de l'événement. Tous les aspects techniques ont fonctionné parfaitement.",
          avatar: "src/pages/images/testimonial-business2.jpg"
        }
      ],
      images: [
        "src/pages/images/conference-main.jpg",
        "src/pages/images/conference-room.jpg",
        "src/pages/images/conference-speakers.jpg",
        "src/pages/images/conference-audience.jpg",
        "src/pages/images/conference-networking.jpg"
      ],
      similarEvents: ["5", "6", "1"]
    },
    
    // Anniversaire
    "3": {
      id: "3",
      title: "Anniversaire luxueux thème Mille et Une Nuits",
      category: "Anniversaires",
      date: "Sur demande",
      location: "Palais Namaskar, Marrakech",
      price: "À partir de 18 000 MAD",
      rating: 4.9,
      description: "Célébrez votre anniversaire dans un cadre somptueux inspiré des contes des Mille et Une Nuits. Notre équipe créera pour vous une ambiance magique et enchanteresse avec une décoration élaborée, une cuisine raffinée et des animations spectaculaires.",
      features: [
        "Décoration thématique complète",
        "Buffet gastronomique oriental",
        "Gâteau d'anniversaire personnalisé",
        "DJ et playlist sur mesure",
        "Spectacle de danse orientale",
        "Cadeaux souvenirs pour les invités",
        "Photographe professionnel"
      ],
      testimonials: [
        {
          name: "Nadia Chaoui",
          comment: "Mon 30ème anniversaire restera gravé dans ma mémoire grâce à l'organisation exceptionnelle de Festify. Chaque détail était parfait!",
          avatar: "src/pages/images/testimonial-birthday1.jpg"
        },
        {
          name: "Mehdi Tazi",
          comment: "Mes amis parlent encore de mon anniversaire des mois plus tard. L'ambiance et la décoration étaient simplement magiques.",
          avatar: "src/pages/images/testimonial-birthday2.jpg"
        }
      ],
      images: [
        "src/pages/images/birthday-main.jpg",
        "src/pages/images/birthday-decor.jpg",
        "src/pages/images/birthday-cake.jpg",
        "src/pages/images/birthday-entertainment.jpg",
        "src/pages/images/birthday-guests.jpg"
      ],
      similarEvents: ["7", "8", "1"]
    }
    // Vous pouvez ajouter d'autres événements (4, 5, 6, 7, 8) au besoin
  };

  // Charger les données de l'événement
  useEffect(() => {
    // Simule un appel API
    const loadEventData = () => {
      setLoading(true);
      
      // Délai artificiel pour simuler le chargement (à supprimer en production)
      setTimeout(() => {
        const event = eventsDatabase[id];
        
        if (event) {
          setEventData(event);
        } else {
          // Rediriger vers une page 404 ou la page d'événements si l'ID n'existe pas
          navigate('/events', { replace: true });
        }
        
        setLoading(false);
      }, 300);
    };
    
    loadEventData();
  }, [id, navigate]);

  // Navigation entre les images
  const nextImage = () => {
    if (!eventData) return;
    
    setCurrentImageIndex((prevIndex) => 
      prevIndex === eventData.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!eventData) return;
    
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? eventData.images.length - 1 : prevIndex - 1
    );
  };

  // Fonction pour revenir à la page des événements
  const handleBack = () => {
    navigate('/events');
  };

  // Fonction pour réserver cet événement
  const handleBookNow = () => {
    navigate(`/book-event/${id}`);
  };

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="event-details-page">
        <Header />
        <div className="event-details-container loading">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Chargement des détails de l'événement...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Si les données ne sont pas disponibles (devrait être intercepté par le useEffect)
  if (!eventData) {
    return (
      <div className="event-details-page">
        <Header />
        <div className="event-details-container">
          <div className="error-message">
            <h2>Événement non trouvé</h2>
            <p>Désolé, cet événement n'existe pas ou a été supprimé.</p>
            <button className="btn btn-primary" onClick={handleBack}>
              Retour aux événements
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="event-details-page">
      <Header />
      
      <div className="event-details-container">
        {/* Chemin de navigation */}
        <div className="breadcrumbs">
          <span onClick={() => navigate('/home')}>Accueil</span> &gt; 
          <span onClick={() => navigate('/home')}>Événements</span> &gt; 
          <span>{eventData.title}</span>
        </div>
        
        {/* En-tête de l'événement */}
        <div className="event-header">
          <h1>{eventData.title}</h1>
          <div className="event-meta">
            <div className="event-category">
              <i className="fas fa-tag"></i> {eventData.category}
            </div>
            <div className="event-location">
              <i className="fas fa-map-marker-alt"></i> {eventData.location}
            </div>
            <div className="event-date">
              <i className="fas fa-calendar-alt"></i> {eventData.date}
            </div>
            <div className="event-rating">
              <i className="fas fa-star"></i> {eventData.rating}/5
            </div>
          </div>
        </div>
        
        {/* Section principale */}
        <div className="event-main-content">
          {/* Galerie d'images */}
          <div className="event-gallery">
            <div className="main-image-container">
              <img 
                src={eventData.images[currentImageIndex]} 
                alt={`${eventData.title} - image ${currentImageIndex + 1}`} 
                className="main-image"
              />
              <button className="gallery-nav prev" onClick={prevImage}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="gallery-nav next" onClick={nextImage}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            <div className="image-thumbnails">
              {eventData.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Miniature ${index + 1}`}
                  className={index === currentImageIndex ? 'active' : ''}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
          
          {/* Information sur l'événement */}
          <div className="event-info">
            <div className="event-description">
              <h2>Description</h2>
              <p>{eventData.description}</p>
            </div>
            
            <div className="event-price">
              <h3>Prix</h3>
              <div className="price-tag">{eventData.price}</div>
              <button className="btn btn-primary book-now" onClick={handleBookNow}>
                Réserver maintenant
              </button>
            </div>
            
            <div className="event-features">
              <h3>Ce qui est inclus</h3>
              <ul>
                {eventData.features.map((feature, index) => (
                  <li key={index}><i className="fas fa-check-circle"></i> {feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Témoignages */}
        <div className="event-testimonials">
          <h2>Ce qu'en disent nos clients</h2>
          <div className="testimonials-grid">
            {eventData.testimonials.map((testimonial, index) => (
              <div className="testimonial-card" key={index}>
                <div className="testimonial-content">
                  <p>"{testimonial.comment}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src={testimonial.avatar} alt={testimonial.name} />
                  </div>
                  <div className="author-name">
                    <h4>{testimonial.name}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Événements similaires */}
        <div className="similar-events">
          <h2>Événements similaires</h2>
          <div className="similar-events-grid">
            {/* On affiche 3 événements similaires maximum */}
            {eventData.similarEvents && eventData.similarEvents.slice(0, 3).map((similarEventId) => {
              const similarEvent = eventsDatabase[similarEventId];
              // Vérifier si l'événement existe dans notre base de données
              if (!similarEvent) return null;
              
              return (
                <div className="similar-event-card" key={similarEventId}>
                  <img 
                    src={similarEvent.images[0]} 
                    alt={similarEvent.title} 
                  />
                  <h3>{similarEvent.title}</h3>
                  <p>{similarEvent.location}</p>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => navigate(`/event/${similarEventId}`)}
                  >
                    Voir les détails
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Boutons d'action */}
        <div className="event-actions">
          <button className="btn btn-secondary" onClick={handleBack}>
            <i className="fas fa-arrow-left"></i> Retour aux événements
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/contact')}>
            <i className="fas fa-question-circle"></i> Poser une question
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EventDetails;