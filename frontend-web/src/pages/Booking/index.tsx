import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bookingsAPI } from '../../services/api';

export const Booking: React.FC = () => {
  const { t } = useTranslation();
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookingDate: '',
    bookingTime: '',
    quantity: 1,
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await bookingsAPI.create({
        ...formData,
        serviceId,
      });
      alert('Réservation créée avec succès!');
      navigate(`/dashboard`);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Erreur lors de la création de la réservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>{t('booking.title')}</h1>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <div className="form-group">
          <label>{t('booking.date')}</label>
          <input
            type="date"
            className="input"
            value={formData.bookingDate}
            onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>{t('booking.time')}</label>
          <input
            type="time"
            className="input"
            value={formData.bookingTime}
            onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>{t('booking.quantity')}</label>
          <input
            type="number"
            className="input"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="form-group">
          <label>Demandes spéciales</label>
          <textarea
            className="input"
            rows={4}
            value={formData.specialRequests}
            onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Réservation en cours...' : t('booking.confirm')}
        </button>
      </form>
    </div>
  );
};
