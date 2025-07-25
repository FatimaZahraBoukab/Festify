import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function RespondInvitation() {
  const { invitationId } = useParams();
  const navigate = useNavigate();

  const handleResponse = async (status) => {
    try {
      await api.post(`invitations/${invitationId}/respond/`, { status });
      alert("Réponse envoyée !");
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la réponse à l'invitation", error);
    }
  };

  return (
    <div>
      <h2>Répondre à l'invitation</h2>
      <button onClick={() => handleResponse("accepted")}>Accepter</button>
      <button onClick={() => handleResponse("declined")}>Refuser</button>
    </div>
  );
}

export default RespondInvitation;
