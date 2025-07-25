import { Link } from "react-router-dom";
import "./AdminSidebar.css"; // Import du fichier CSS

function AdminSidebar() {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/users">Utilisateurs</Link></li>
        <li><Link to="/providers">Prestataires</Link></li>
        <li><Link to="/events">Événements</Link></li>
      </ul>
    </div>
  );
}

export default AdminSidebar;
