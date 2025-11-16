import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>JOKA</h3>
            <p>Plateforme de découverte et réservation de services locaux en Côte d'Ivoire</p>
          </div>

          <div className="footer-section">
            <h4>Liens rapides</h4>
            <ul>
              <li><a href="/">Accueil</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/parcours">Mon Parcours</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: support@joka.ci</p>
            <p>Téléphone: +225 XX XX XX XX</p>
          </div>

          <div className="footer-section">
            <h4>Suivez-nous</h4>
            <div className="social-links">
              <a href="#" aria-label="Facebook">Facebook</a>
              <a href="#" aria-label="Instagram">Instagram</a>
              <a href="#" aria-label="Twitter">Twitter</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 JOKA. Tous droits réservés. Fait avec ❤️ pour la Côte d'Ivoire 🇨🇮</p>
        </div>
      </div>
    </footer>
  );
};
