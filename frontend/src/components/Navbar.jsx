import { Link } from "react-router-dom";
import "./Navbar.css"; // Import du fichier CSS

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">Event Planner</h1>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/providers">Prestataires</Link>
        <Link to="/my-bookings">Mes Réservations</Link>
        <Link to="/admin">Admin</Link>
      </div>
    </nav>
  );
}

export default Navbar;
