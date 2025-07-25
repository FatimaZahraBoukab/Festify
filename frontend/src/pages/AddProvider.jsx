import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function AddProvider() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("providers/", { name, category, price });
      alert("Prestataire ajouté !");
      navigate("/admin");
    } catch (error) {
      console.error("Erreur lors de l'ajout", error);
    }
  };

  return (
    <div>
      <h2>Ajouter un prestataire</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Sélectionner une catégorie</option>
          <option value="salle">Salle</option>
          <option value="buffet">Buffet</option>
          <option value="décoration">Décoration</option>
          <option value="animation">Animation</option>
        </select>
        <input type="number" placeholder="Prix" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}

export default AddProvider;
