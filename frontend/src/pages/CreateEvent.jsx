import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import styles from "./CreateEvent.module.css";
import axios from "axios";

function CreateEvent() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState(0);
  const [budget, setBudget] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log({ name, date, location, guests, budget });
      await api.post("events/", { name, date, location, guests, budget });
      alert("Événement créé !");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la création de l'événement", error);
    }
  };

  return (
    <div className={styles.createEventContainer}>
      <h2 className={styles.createEventTitle}>Créer un événement</h2>
      <form className={styles.createEventForm} onSubmit={handleSubmit}>
        <input 
          className={styles.formInput}
          type="text" 
          placeholder="Nom de l'événement" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          className={styles.formInput}
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
        <input 
          className={styles.formInput}
          type="text" 
          placeholder="Lieu" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          required 
        />
        <input 
          className={styles.formInput}
          type="number" 
          placeholder="Nombre d'invités" 
          value={guests} 
          onChange={(e) => setGuests(e.target.value)} 
          required 
        />
        <input 
          className={styles.formInput}
          type="number" 
          placeholder="Budget" 
          value={budget} 
          onChange={(e) => setBudget(e.target.value)} 
          required 
        />
        <button className={styles.submitButton} type="submit">Créer</button>
      </form>
    </div>
  );
}

export default CreateEvent;
