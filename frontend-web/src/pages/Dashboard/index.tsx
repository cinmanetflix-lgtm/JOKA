import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="container">
      <h1>Tableau de bord</h1>
      <p>Bienvenue, {user?.firstName} {user?.lastName}!</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="card">
          <h3>Mes Réservations</h3>
          <p>Consultez vos réservations en cours et passées</p>
        </div>

        <div className="card">
          <h3>Mes Favoris</h3>
          <p>Services que vous avez ajoutés aux favoris</p>
        </div>

        <div className="card">
          <h3>Mon Profil</h3>
          <p>Gérez vos informations personnelles</p>
        </div>

        <div className="card">
          <h3>Mes Paiements</h3>
          <p>Historique de vos transactions</p>
        </div>
      </div>
    </div>
  );
};
