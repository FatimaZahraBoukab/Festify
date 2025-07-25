import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import { FaCalendarAlt, FaUsers, FaEuroSign, FaPlusCircle, FaEdit, FaTrash, FaEnvelope } from 'react-icons/fa';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({});

  // Utiliser useLocation pour récupérer l'état de navigation
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Vérifier si un état de navigation a été passé
    const locationState = location.state;
    return locationState?.activeTab || 'events';
  });

  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoading(true);
        setError(null);
        
        try {
          // Appels API séparés avec gestion d'erreur individuelle
          const eventsRes = await api.get("events/").catch(err => {
            console.error("Erreur lors du chargement des événements", err);
            return { data: [] };
          });
          
          const bookingsRes = await api.get("bookings/").catch(err => {
            console.error("Erreur lors du chargement des réservations", err);
            return { data: [] };
          });
          
          const invitationsRes = await api.get("invitations/").catch(err => {
            console.error("Erreur lors du chargement des invitations", err);
            return { data: [] };
          });
          
          setEvents(eventsRes.data || []);
          
          // Si nous avons des réservations, récupérons les détails complémentaires
          if (bookingsRes.data && bookingsRes.data.length > 0) {
            const bookingsWithDetails = await Promise.all(
              bookingsRes.data.map(async (booking) => {
                // Pour chaque réservation, récupérer les détails de l'événement, du prestataire et du service
                let eventDetails = {};
                let providerDetails = {};
                let serviceDetails = {};
                
                try {
                  if (booking.event) {
                    const eventRes = await api.get(`events/${booking.event}/`);
                    eventDetails = eventRes.data;
                  }
                } catch (error) {
                  console.error("Erreur lors du chargement des détails de l'événement", error);
                }
                
                try {
                  if (booking.provider) {
                    const providerRes = await api.get(`providers/${booking.provider}/`);
                    providerDetails = providerRes.data;
                  }
                } catch (error) {
                  console.error("Erreur lors du chargement des détails du prestataire", error);
                }
                
                try {
                  if (booking.service) {
                    const serviceRes = await api.get(`services/${booking.service}/`);
                    serviceDetails = serviceRes.data;
                  }
                } catch (error) {
                  console.error("Erreur lors du chargement des détails du service", error);
                }
                
                return {
                  ...booking,
                  eventDetails,
                  providerDetails,
                  serviceDetails
                };
              })
            );
            
            setBookings(bookingsWithDetails);
          } else {
            setBookings([]);
          }
          
          setInvitations(invitationsRes.data || []);
        } catch (error) {
          console.error("Erreur générale lors du chargement des données", error);
          setError("Impossible de charger vos données. Veuillez réessayer plus tard.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleDeleteEvent = async (id) => {
    if (!id) {
      console.error("ID de l'événement non défini");
      return;
    }
  
    if (window.confirm("Voulez-vous vraiment supprimer cet événement ?")) {
      try {
        await api.delete(`events/${id}/`);
        setEvents(events.filter(event => event.id !== id)); // Mettre à jour l'affichage
      } catch (error) {
        console.error("Erreur lors de la suppression", error);
      }
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm("Annuler cette réservation ?")) {
      try {
        await api.delete(`bookings/${id}/`);
        setBookings(bookings.filter(booking => booking.id !== id));
      } catch (error) {
        console.error("Erreur lors de l'annulation", error);
      }
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "Date non disponible";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Chargement de vos données...</p>
      </div>
    );
  }
  
  // Page d'erreur
  if (error) {
    return (
      <div className="error-container">
        <h2>Oups, quelque chose s'est mal passé</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  return (
    <div className="festify-dashboard-container">
      <div className="festify-dashboard-welcome">
        <h1>Festify</h1>
        <h2>Bienvenue, {user?.username || 'Utilisateur'} !</h2>
        <p>Gérez vos événements et réservations en toute simplicité</p>
      </div>

      <div className="festify-dashboard-tabs">
        <button 
          className={activeTab === 'events' ? 'active' : ''} 
          onClick={() => setActiveTab('events')}
        >
          <FaCalendarAlt /> Mes Événements
        </button>
        <button 
          className={activeTab === 'bookings' ? 'active' : ''} 
          onClick={() => setActiveTab('bookings')}
        >
          <FaUsers /> Mes Réservations
        </button>
        <button 
          className={activeTab === 'invitations' ? 'active' : ''} 
          onClick={() => setActiveTab('invitations')}
        >
          <FaEnvelope /> Mes Invitations
        </button>
      </div>

      <div className="festify-dashboard-content">
        {activeTab === 'events' && (
          <div className="festify-tab-content">
            <div className="festify-tab-header">
              <h2>Mes Événements</h2>
              <button className="add-button" onClick={() => navigate("/create-event")}>
                <FaPlusCircle /> Nouvel Événement
              </button>
            </div>

            {events.length === 0 ? (
              <div className="festify-empty-state">
                <p>Vous n'avez pas encore créé d'événements.</p>
                <button onClick={() => navigate("/create-event")}>Créer mon premier événement</button>
              </div>
            ) : (
              <div className="festify-events-grid">
                {events.map(event => (
                  <div key={event.id} className="festify-event-card">
                    <div className="festify-event-card-header">
                      <h3>{event.name}</h3>
                      <div className="festify-budget-tag">
                        <FaEuroSign /> {event.budget} €
                      </div>
                    </div>
                    <div className="festify-event-card-details">
                      <div className="festify-detail-item">
                        <FaCalendarAlt />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="festify-detail-item">
                        <i className="festify-fas fa-map-marker-alt"></i>
                        <span>{event.location}</span>
                      </div>
                      <div className="festify-detail-item">
                        <FaUsers />
                        <span>{event.guests} invités</span>
                      </div>
                    </div>
                    <div className="festify-event-actions">
                      <button className="festify-action-button edit" onClick={() => navigate(`/edit-event/${event.id}`)}>
                        <FaEdit /> Modifier
                      </button>
                      <button className="festify-action-button delete" onClick={() => handleDeleteEvent(event.id)}>
                        <FaTrash /> Supprimer
                      </button>
                      <button className="festify-action-button invite" onClick={() => navigate(`/send-invitation/${event.id}`)}>
                        <FaEnvelope /> Inviter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="festify-tab-content">
            <div className="festify-tab-header">
              <h2>Mes Réservations</h2>
            </div>
            {bookings.length === 0 ? (
              <div className="festify-empty-state">
                <p>Vous n'avez pas encore de réservations.</p>
                <button onClick={() => navigate("/providers")}>Parcourir les prestataires</button>
              </div>
            ) : (
              <div className="festify-bookings-list">
                {bookings.map(booking => (
                  <div key={booking.id} className="festify-booking-card">
                    <div className="festify-booking-status" data-status={booking.status}>
                      {booking.status === 'pending' ? 'En attente' : 
                       booking.status === 'confirmed' ? 'Confirmée' : 'Annulée'}
                    </div>
                    
                    {/* Affichage des informations du prestataire et du service */}
                    <h3>{booking.providerDetails?.entreprise || "Prestataire non spécifié"}</h3>
                    
                    <div className="festify-booking-details">
                      <p><strong>Événement:</strong> {booking.eventDetails?.name || "Non spécifié"}</p>
                      <p><strong>Service:</strong> {booking.serviceDetails?.name || "Service non spécifié"}</p>
                      <p><strong>Description:</strong> {booking.serviceDetails?.description || "Aucune description"}</p>
                      <p><strong>Prix:</strong> {booking.serviceDetails?.price ? `${booking.serviceDetails.price} €` : "Sur devis"}</p>
                      <p><strong>Réservé le:</strong> {formatDate(booking.booked_at)}</p>
                    </div>
                    
                    <div className="festify-booking-actions">
                      {booking.status !== 'cancelled' && (
                        <button className="action-button cancel" onClick={() => handleCancelBooking(booking.id)}>
                          Annuler
                        </button>
                      )}
                      <button 
                        className="festify-action-button contact" 
                        onClick={() => window.location.href = `mailto:${booking.providerDetails?.contact || ""}`}
                        disabled={!booking.providerDetails?.contact}
                      >
                        Contacter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'invitations' && (
          <div className="festify-tab-content">
            <div className="festify-tab-header">
              <h2>Invitations Envoyées</h2>
            </div>
            {invitations.length === 0 ? (
              <div className="festify-empty-state">
                <p>Vous n'avez pas encore envoyé d'invitations.</p>
                <button onClick={() => navigate("/send-invitation")}>Inviter des personnes</button>
              </div>
            ) : (
              <div className="festify-invitations-list">
                {invitations.map(invite => (
                  <div key={invite.id} className="festify-invitation-card">
                    <div className={`festify-invitation-status ${invite.status}`}>
                      {invite.status === 'sent' ? 'Envoyée' : 
                       invite.status === 'accepted' ? 'Acceptée' : 'Déclinée'}
                    </div>
                    <p><strong>Email:</strong> {invite.email}</p>
                    <p><strong>Événement:</strong> {invite.event.name}</p>
                    <p><strong>Envoyée le:</strong> {formatDate(invite.sent_at)}</p>
                    
                    {invite.status === 'sent' && (
                      <button className="festify-action-button resend">
                        Renvoyer l'invitation
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;