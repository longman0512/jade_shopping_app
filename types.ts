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