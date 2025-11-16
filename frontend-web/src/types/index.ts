export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'partner' | 'admin';
  phone?: string;
  avatar?: string;
  language?: 'fr' | 'en';
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  basePrice: number;
  currency: string;
  images: string[];
  rating: number;
  reviewCount: number;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  address?: string;
  city?: string;
  isAvailable?: boolean;
  partner?: User;
}

export enum ServiceCategory {
  RESTAURANT = 'restaurant',
  ACCOMMODATION = 'accommodation',
  LEISURE = 'leisure',
  WELLNESS = 'wellness',
  TRANSPORT = 'transport',
  EVENT = 'event',
  COMMERCE = 'commerce',
}

export interface Booking {
  id: string;
  serviceId: string;
  userId: string;
  bookingDate: string;
  bookingTime?: string;
  quantity: number;
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  qrCode?: string;
  pdfTicket?: string;
  service?: Service;
  user?: User;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
}

export enum PaymentMethod {
  STRIPE = 'stripe',
  ORANGE_MONEY = 'orange_money',
  MTN_MONEY = 'mtn_money',
  MOOV_MONEY = 'moov_money',
  WAVE = 'wave',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface Parcours {
  id: string;
  name: string;
  description?: string;
  waypoints: Waypoint[];
  transportMode?: string;
  estimatedDuration?: number;
  estimatedDistance?: number;
  isPublic: boolean;
}

export interface Waypoint {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  type: string;
  duration?: number;
}
