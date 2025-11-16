import React from 'react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="container">
      <h1>Tableau de bord Administrateur</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="card">
          <h3>Utilisateurs</h3>
          <p className="text-primary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
          <p>Total</p>
        </div>

        <div className="card">
          <h3>Partenaires</h3>
          <p className="text-primary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
          <p>Actifs</p>
        </div>

        <div className="card">
          <h3>Services</h3>
          <p className="text-primary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
          <p>En ligne</p>
        </div>

        <div className="card">
          <h3>Réservations</h3>
          <p className="text-primary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
          <p>Total</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Fonctionnalités Administrateur</h3>
        <ul style={{ lineHeight: '2' }}>
          <li>👥 Gestion complète des utilisateurs et partenaires</li>
          <li>✅ Validation des inscriptions partenaires</li>
          <li>📊 Supervision et analytics globales</li>
          <li>📢 Gestion du module publicitaire</li>
          <li>🗺️ Gestion des parcours touristiques</li>
          <li>🚗 Suivi des locations de voitures</li>
          <li>🔒 Contrôle de sécurité et modération</li>
          <li>📈 Rapports et statistiques détaillés</li>
        </ul>
      </div>
    </div>
  );
};
