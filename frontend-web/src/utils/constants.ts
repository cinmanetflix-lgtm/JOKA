export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const;
export const DEFAULT_LANGUAGE = 'fr';

export const SUPPORTED_CURRENCIES = ['XOF', 'EUR', 'USD'] as const;
export const DEFAULT_CURRENCY = 'XOF';

export const SERVICE_CATEGORIES = [
  'restaurant',
  'accommodation',
  'leisure',
  'wellness',
  'transport',
  'event',
  'commerce',
] as const;

export const PAYMENT_METHODS = [
  'stripe',
  'orange_money',
  'mtn_money',
  'moov_money',
  'wave',
] as const;
