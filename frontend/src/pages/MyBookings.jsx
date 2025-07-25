import { useEffect, useState } from "react";
import api from "../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("bookings/")
      .then(response => setBookings(response.data))
      .catch(error => console.error("Erreur lors du fetch des réservations", error));
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm("Annuler cette réservation ?")) {
      try {
        await api.delete(`bookings/${id}/`);
        setBookings(bookings.filter(booking => booking.id !== id));
      } catch (error) {
        console.error("Erreur lors de l'annulation", error);
      }
    }
  };

  return (
    <div>
      <h1>Mes Réservations</h1>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id}>
            Réservation pour {booking.event.name} avec {booking.provider.name}
            <button onClick={() => handleCancel(booking.id)}>Annuler</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyBookings;
