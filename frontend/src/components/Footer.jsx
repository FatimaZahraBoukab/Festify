import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="src\pages\images\logo.png" alt="Festify Logo" />
              <span>Festify</span>
            </Link>
            <p className="footer-description">
              Votre plateforme de gestion d'événements innovante pour des célébrations inoubliables.
            </p>
          </div>

          <div className="footer-contact">
            <h3>Contactez-nous</h3>
            <ul>
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Rue des Festivals, 75000 Tanger</span>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <span>+212 6 11 95 58 23</span>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <span>contact@festify.com</span>
              </li>
            </ul>
          </div>

          {/* Nouvelle section pour devenir prestataire */}
          <div className="footer-become-provider">
            <h3>Devenir prestataire</h3>
            <p>
              Vous proposez des services pour événements? Rejoignez notre réseau de prestataires qualifiés.
            </p>
            <Link to="/prestataire/register" className="become-provider-btn">
              S'inscrire comme prestataire
            </Link>
          </div>

          <div className="footer-social">
            <h3>Suivez-nous</h3>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Festify. Tous droits réservés.</p>
        
        </div>
      </div>
    </footer>
  );
};

export default Footer;


