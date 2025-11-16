/**
 * Format price with currency
 */
export const formatPrice = (price: number, currency: string = 'XOF'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

/**
 * Format date
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

/**
 * Format date and time
 */
export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

/**
 * Truncate text
 */
export const truncate = (text: string, length: number = 100): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Get initials from name
 */
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate phone
 */
export const isValidPhone = (phone: string): boolean => {
  const re = /^\+?[1-9]\d{1,14}$/;
  return re.test(phone.replace(/\s/g, ''));
};
