import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Home.css';

export const Home: React.FC = () => {
  const { t } = useTranslation();

  const categories = [
    { key: 'restaurant', icon: '🍽️' },
    { key: 'accommodation', icon: '🏨' },
    { key: 'leisure', icon: '🎭' },
    { key: 'wellness', icon: '💆' },
    { key: 'transport', icon: '🚗' },
    { key: 'event', icon: '🎉' },
    { key: 'commerce', icon: '🛍️' },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>{t('home.hero.title')}</h1>
            <p>{t('home.hero.subtitle')}</p>
            <Link to="/services" className="btn btn-primary btn-large">
              {t('home.hero.cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2>{t('home.categories.title')}</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                key={category.key}
                to={`/services?category=${category.key}`}
                className="category-card"
              >
                <div className="category-icon">{category.icon}</div>
                <h3>{t(`home.categories.${category.key}`)}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🎫</div>
              <h3>Réservation facile</h3>
              <p>Réservez vos services en quelques clics avec confirmation instantanée</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💳</div>
              <h3>Paiement sécurisé</h3>
              <p>Mobile Money & cartes bancaires - Paiements 100% sécurisés</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📱</div>
              <h3>Tickets numériques</h3>
              <p>QR code et PDF téléchargeables pour toutes vos réservations</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🗺️</div>
              <h3>Parcours personnalisés</h3>
              <p>Créez vos itinéraires sur mesure avec notre module Mon Parcours</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
