import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./EditEvent.css";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({ name: "", date: "", location: "", guests: 0, budget: 0 });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.get(`events/${id}/`).then(response => setEvent(response.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    /*try {
      await api.put(`events/${id}/`, event);
      alert("Événement mis à jour !");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la modification", error);
    }*/

      try {
        await api.put(`events/${id}/`, event);
        const button = document.querySelector('.submit-button');
        button.classList.add('success-feedback');
        
        setTimeout(() => {
          alert("Événement mis à jour !");
          navigate("/dashboard");
        }, 500);
      } catch (error) {
        console.error("Erreur lors de la modification", error);
      } finally {
        setIsSubmitting(false);
      }
  };

  return (
    <div>
      <h2>Modifier l'événement</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={event.name} onChange={(e) => setEvent({ ...event, name: e.target.value })} required />
        <input type="date" value={event.date} onChange={(e) => setEvent({ ...event, date: e.target.value })} required />
        <input type="text" value={event.location} onChange={(e) => setEvent({ ...event, location: e.target.value })} required />
        <input type="number" value={event.guests} onChange={(e) => setEvent({ ...event, guests: e.target.value })} required />
        <input type="number" value={event.budget} onChange={(e) => setEvent({ ...event, budget: e.target.value })} required />
        <button type="submit">Enregistrer</button>
      </form>
    </div>

    
  )
}

export default EditEvent;
