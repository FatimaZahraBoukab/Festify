import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./SendInvitation.css";

function SendInvitation() {
  const [email, setEmail] = useState("");
  const [eventId, setEventId] = useState("");
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("events/")
      .then(response => setEvents(response.data))
      .catch(error => console.error("Erreur lors de la récupération des événements", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("invitations/", { email, event: eventId });
      alert("Invitation envoyée !");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'invitation", error);
    }
  };

  return (
    /*<div>
      <h2>Envoyer une invitation</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email de l'invité" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <select value={eventId} onChange={(e) => setEventId(e.target.value)} required>
          <option value="">Sélectionner un événement</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.name}</option>
          ))}
        </select>
        <button type="submit">Envoyer</button>
      </form>
    </div>*/
    <div className="invitation-container">
      <h2 className="invitation-title">Envoyer une invitation</h2>
      <form className="invitation-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email de l'invité</label>
          <input 
            type="email" 
            className="form-control" 
            placeholder="Entrez l'email de l'invité" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Événement</label>
          <select 
            className="form-control" 
            value={eventId} 
            onChange={(e) => setEventId(e.target.value)} 
            required
          >
            <option value="">Sélectionner un événement</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>{event.name}</option>
            ))}
          </select>
        </div>
        <button className="btn-submit" type="submit">Envoyer l'invitation</button>
      </form>
    </div>
  );
}

export default SendInvitation;
