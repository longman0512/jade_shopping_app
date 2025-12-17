
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number; // For sale display
  category: string;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  vtoAvailable?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum SortOption {
  Recommended = 'Recommended',
  PriceLowHigh = 'Price: Low to High',
  PriceHighLow = 'Price: High to Low',
  Newest = 'Newest Arrivals',
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

// New Types
export type OrderStatus = 'Accepted' | 'In Delivery' | 'Finished';

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  date: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: 'Credit Card' | 'PayPal';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'order' | 'promo' | 'system';
}

export interface UserSettings {
  language: 'en' | 'es' | 'fr' | 'de';
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}