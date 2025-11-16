import React from 'react';

export const PartnerDashboard: React.FC = () => {
  return (
    <div className="container">
      <h1>Tableau de bord Partenaire</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="card">
          <h3>Mes Services</h3>
          <p className="text-primary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
          <p>Services actifs</p>
        </div>

        <div className="card">
          <h3>Réservations</h3>
          <p className="text-primary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
          <p>En attente</p>
        </div>

        <div className="card">
          <h3>Chiffre d'affaires</h3>
          <p className="text-primary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>0 XOF</p>
          <p>Ce mois</p>
        </div>

        <div className="card">
          <h3>Note moyenne</h3>
          <p className="text-primary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>⭐ 0.0</p>
          <p>0 avis</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Fonctionnalités Partenaire</h3>
        <ul style={{ lineHeight: '2' }}>
          <li>📦 Gestion complète de vos offres et inventaire</li>
          <li>📅 Calendrier et tarification dynamique</li>
          <li>📊 Statistiques et analytics détaillés</li>
          <li>🚚 Option de livraison de services</li>
          <li>📢 Création de campagnes publicitaires</li>
          <li>💬 Communication directe avec les clients</li>
        </ul>
      </div>
    </div>
  );
};
