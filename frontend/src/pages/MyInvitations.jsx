import { useEffect, useState } from "react";
import api from "../services/api";

function MyInvitations() {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    api.get("invitations/")
      .then(response => setInvitations(response.data))
      .catch(error => console.error("Erreur lors de la récupération des invitations", error));
  }, []);

  return (
    <div>
      <h1>Mes Invitations</h1>
      <ul>
        {invitations.map(invite => (
          <li key={invite.id}>
            {invite.email} - {invite.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyInvitations;
