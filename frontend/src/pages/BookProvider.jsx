import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function BookProvider() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");

  useEffect(() => {
    api.get("events/").then(response => setEvents(response.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("bookings/", { event: selectedEvent, provider: providerId });
      alert("Réservation effectuée !");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la réservation", error);
    }
  };

  return (
    <div>
      <h2>Réserver un prestataire</h2>
      <form onSubmit={handleSubmit}>
        <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} required>
          <option value="">Sélectionner un événement</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.name}</option>
          ))}
        </select>
        <button type="submit">Réserver</button>
      </form>
    </div>
  );
}

export default BookProvider;
