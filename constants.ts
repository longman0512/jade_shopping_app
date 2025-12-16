import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Women', slug: 'women', image: 'https://picsum.photos/seed/womenfashion/400/500' },
  { id: '2', name: 'Men', slug: 'men', image: 'https://picsum.photos/seed/menfashion/400/500' },
  { id: '3', name: 'Beauty', slug: 'beauty', image: 'https://picsum.photos/seed/beauty/400/500' },
  { id: '4', name: 'Home', slug: 'home', image: 'https://picsum.photos/seed/homedecor/400/500' },
  { id: '5', name: 'Shoes', slug: 'shoes', image: 'https://picsum.photos/seed/shoes/400/500' },
  { id: '6', name: 'Handbags', slug: 'handbags', image: 'https://picsum.photos/seed/handbags/400/500' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Cashmere Turtleneck Sweater',
    brand: 'Charter Club',
    price: 89.99,
    originalPrice: 159.00,
    category: 'Women',
    image: 'https://picsum.photos/seed/sweater/600/800',
    description: 'Luxuriously soft cashmere sweater featuring a classic turtleneck design and ribbed trim. Perfect for layering during colder months.',
    rating: 4.5,
    reviews: 128
  },
  {
    id: 'p2',
    name: 'Slim-Fit Linen Blazer',
    brand: 'Alfani',
    price: 120.00,
    category: 'Men',
    image: 'https://picsum.photos/seed/blazer/600/800',
    description: 'A breathable linen blazer tailored for a modern slim fit. Ideal for summer weddings or smart-casual office wear.',
    rating: 4.2,
    reviews: 85
  },
  {
    id: 'p3',
    name: 'Advanced Night Repair Serum',
    brand: 'Estée Lauder',
    price: 115.00,
    category: 'Beauty',
    image: 'https://picsum.photos/seed/serum/600/800',
    description: 'The #1 serum in the US. Fights key signs of aging. Reveals a smoother, more radiant, younger look.',
    rating: 4.9,
    reviews: 3400
  },
  {
    id: 'p4',
    name: 'Artisan 5-Qt. Stand Mixer',
    brand: 'KitchenAid',
    price: 449.99,
    originalPrice: 499.99,
    category: 'Home',
    image: 'https://picsum.photos/seed/mixer/600/800',
    description: 'Make up to 9 dozen cookies in a single batch with the KitchenAid Artisan Series 5 Quart Tilt-Head Stand Mixer.',
    rating: 4.8,
    reviews: 12050
  },
  {
    id: 'p5',
    name: 'Leather Crossbody Bag',
    brand: 'Michael Kors',
    price: 158.00,
    category: 'Handbags',
    image: 'https://picsum.photos/seed/bag/600/800',
    description: 'Designed in a clean-lined silhouette from Saffiano leather, this crossbody bag is an instant classic.',
    rating: 4.6,
    reviews: 210
  },
  {
    id: 'p6',
    name: 'Running Sneakers',
    brand: 'Nike',
    price: 85.00,
    category: 'Shoes',
    image: 'https://picsum.photos/seed/sneaker/600/800',
    description: 'Lightweight mesh upper with cushioned midsole for all-day comfort and support during your runs.',
    rating: 4.4,
    reviews: 560
  },
  {
    id: 'p7',
    name: 'Floral Chiffon Maxi Dress',
    brand: 'INC International Concepts',
    price: 79.50,
    originalPrice: 99.50,
    category: 'Women',
    image: 'https://picsum.photos/seed/dress/600/800',
    description: 'Flowy and feminine, this floral print maxi dress features a flattering V-neckline and tiered skirt.',
    rating: 4.3,
    reviews: 95
  },
  {
    id: 'p8',
    name: 'Stainless Steel Cookware Set',
    brand: 'Cuisinart',
    price: 199.99,
    originalPrice: 299.99,
    category: 'Home',
    image: 'https://picsum.photos/seed/cookware/600/800',
    description: 'Professional quality stainless steel cookware set. Aluminum encapsulated base heats quickly and spreads heat evenly.',
    rating: 4.7,
    reviews: 430
  },
  {
    id: 'p9',
    name: 'Matte Lipstick',
    brand: 'MAC',
    price: 22.00,
    category: 'Beauty',
    image: 'https://picsum.photos/seed/lipstick/600/800',
    description: 'The iconic product that made M·A·C famous. This creamy rich formula features high colour payoff in a no-shine matte finish.',
    rating: 4.6,
    reviews: 809
  },
  {
    id: 'p10',
    name: 'Egyptian Cotton Sheets',
    brand: 'Hotel Collection',
    price: 140.00,
    originalPrice: 200.00,
    category: 'Home',
    image: 'https://picsum.photos/seed/sheets/600/800',
    description: 'Experience the luxury of 5-star hotel bedding with these high thread count Egyptian cotton sheets.',
    rating: 4.3,
    reviews: 55
  },
  {
    id: 'p11',
    name: 'Leather Oxford Shoes',
    brand: 'Cole Haan',
    price: 150.00,
    category: 'Men',
    image: 'https://picsum.photos/seed/oxford/600/800',
    description: 'Classic oxford shoes with modern comfort technology. Perfect for the office or formal events.',
    rating: 4.8,
    reviews: 112
  },
  {
    id: 'p12',
    name: 'Silk Scarf',
    brand: 'Ralph Lauren',
    price: 65.00,
    originalPrice: 95.00,
    category: 'Women',
    image: 'https://picsum.photos/seed/scarf/600/800',
    description: 'A beautiful silk scarf that adds a touch of elegance to any outfit.',
    rating: 4.7,
    reviews: 42
  }
];