import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicesAPI } from '../../services/api';
import './ServiceDetails.css';

export const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchService(id);
    }
  }, [id]);

  const fetchService = async (serviceId: string) => {
    try {
      const response = await servicesAPI.getById(serviceId);
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Chargement...</div>;
  }

  if (!service) {
    return <div className="container">Service non trouvé</div>;
  }

  return (
    <div className="service-details">
      <div className="container">
        <div className="service-details-grid">
          <div className="service-images">
            {service.images && service.images[0] ? (
              <img src={service.images[0]} alt={service.name} />
            ) : (
              <div className="placeholder-image">📷</div>
            )}
          </div>

          <div className="service-info">
            <h1>{service.name}</h1>
            <p className="category">{service.category}</p>
            <div className="rating">
              ⭐ {service.rating} ({service.reviewCount} avis)
            </div>

            <p className="description">{service.description}</p>

            <div className="price-section">
              <span className="price">
                {service.basePrice} {service.currency}
              </span>
            </div>

            <Link to={`/booking/${service.id}`} className="btn btn-primary btn-block">
              Réserver maintenant
            </Link>

            <div className="service-details-info">
              <h3>Informations</h3>
              <p><strong>Adresse:</strong> {service.address}</p>
              {service.city && <p><strong>Ville:</strong> {service.city}</p>}
              {service.contact && (
                <>
                  {service.contact.phone && (
                    <p><strong>Téléphone:</strong> {service.contact.phone}</p>
                  )}
                  {service.contact.email && (
                    <p><strong>Email:</strong> {service.contact.email}</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
