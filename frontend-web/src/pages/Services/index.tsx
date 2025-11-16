import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { servicesAPI } from '../../services/api';
import './Services.css';

export const Services: React.FC = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Chargement...</div>;
  }

  return (
    <div className="services-page">
      <div className="container">
        <h1>{t('services.title')}</h1>

        <div className="services-grid">
          {services.length > 0 ? (
            services.map((service) => (
              <Link key={service.id} to={`/services/${service.id}`} className="service-card">
                <div className="service-image">
                  {service.images && service.images[0] ? (
                    <img src={service.images[0]} alt={service.name} />
                  ) : (
                    <div className="placeholder-image">📷</div>
                  )}
                </div>
                <div className="service-content">
                  <h3>{service.name}</h3>
                  <p className="service-category">{service.category}</p>
                  <p className="service-description">{service.description}</p>
                  <div className="service-footer">
                    <span className="service-price">
                      {service.basePrice} {service.currency}
                    </span>
                    <span className="service-rating">
                      ⭐ {service.rating} ({service.reviewCount})
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>{t('services.noResults')}</p>
          )}
        </div>
      </div>
    </div>
  );
};
