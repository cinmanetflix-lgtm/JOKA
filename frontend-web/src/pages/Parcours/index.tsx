import React from 'react';

export const Parcours: React.FC = () => {
  return (
    <div className="container">
      <h1>Mon Parcours</h1>
      <p>Créez et gérez vos parcours touristiques personnalisés</p>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Fonctionnalités Mon Parcours</h3>
        <ul style={{ lineHeight: '2' }}>
          <li>📍 Création de parcours personnalisés avec points d'intérêt</li>
          <li>🤖 Suggestions automatiques par IA basées sur vos préférences</li>
          <li>🚗 Choix du moyen de déplacement (marche, vélo, taxi, location voiture)</li>
          <li>📱 Partage de parcours avec vos contacts (WhatsApp, lien direct)</li>
          <li>🗺️ Navigation guidée étape par étape avec notifications</li>
          <li>⏱️ Estimation de durée et distance pour chaque parcours</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button className="btn btn-primary">
          Créer un nouveau parcours
        </button>
      </div>
    </div>
  );
};
