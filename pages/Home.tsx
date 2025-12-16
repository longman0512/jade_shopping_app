import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIES, MOCK_PRODUCTS, BRANDS } from '../constants';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ChevronRight, ChevronLeft, Play } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Women');
  const dealsScrollRef = useRef<HTMLDivElement>(null);
  const lovedScrollRef = useRef<HTMLDivElement>(null);
  
  // Video Carousel State
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  // Deals: Items with original price
  const deals = MOCK_PRODUCTS.filter(p => p.originalPrice);
  
  // Products for "Loved by us" - filtering logic
  const lovedProducts = MOCK_PRODUCTS.filter(p => p.category === activeCategory);

  const promoVideos = [
    { id: 1, poster: 'https://picsum.photos/seed/vposter1/600/350', url: 'https://cdn.coverr.co/videos/coverr-walking-in-a-city-at-night-4523/1080p.mp4', title: 'Neon Summer Nights' },
    { id: 2, poster: 'https://picsum.photos/seed/vposter2/600/350', url: 'https://cdn.coverr.co/videos/coverr-applying-face-cream-979/1080p.mp4', title: 'Morning Rituals' },
    { id: 3, poster: 'https://picsum.photos/seed/vposter3/600/350', url: 'https://cdn.coverr.co/videos/coverr-preparing-food-in-kitchen-2629/1080p.mp4', title: 'Culinary Excellence' },
  ];

  // Auto slide video - Slower speed (8000ms)
  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentVideoIndex(prev => (prev + 1) % promoVideos.length);
    }, 8000); // 8 seconds
    return () => clearInterval(interval);
  }, [promoVideos.length]);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
        const scrollAmount = 300;
        ref.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    }
  };

  return (
    <div>
      {/* SECTION 1: Can't-miss deals */}
      <section className="py-12 bg-white mb-4 relative">
        <div className="container mx-auto px-4 lg:px-8 relative max-w-[1440px]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Can't-Miss Deals</h2>
          </div>
          
          <div className="relative group/carousel">
             {/* Navigation Buttons for Deals */}
             <button 
                onClick={() => scrollContainer(dealsScrollRef, 'left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 p-3 bg-white shadow-lg rounded-full text-gray-700 hover:text-jade-600 border border-gray-100 hidden md:flex opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={() => scrollContainer(dealsScrollRef, 'right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 p-3 bg-white shadow-lg rounded-full text-gray-700 hover:text-jade-600 border border-gray-100 hidden md:flex opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
            >
                <ChevronRight size={24} />
            </button>

            {/* Manual Sliding Carousel */}
            <div 
                ref={dealsScrollRef}
                className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x snap-mandatory px-2"
            >
                {deals.map((product) => (
                <div 
                    key={product.id}
                    className="flex-shrink-0 w-56 snap-start h-full"
                >
                    <ProductCard product={product} />
                </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Loved by us, picked for you */}
      <section className="py-16 bg-white mb-4">
        <div className="container mx-auto px-4 lg:px-8 max-w-[1440px]">
          <div className="text-center mb-8">
             <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Loved by us, picked for you</h2>
             <p className="text-gray-500">Our stylists' top picks for this season.</p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center overflow-x-auto mb-10 space-x-2 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${
                  activeCategory === cat.name 
                    ? 'bg-gray-900 text-white border-gray-900' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative group/carousel">
             {/* Navigation Buttons for Loved Products */}
             <button 
                onClick={() => scrollContainer(lovedScrollRef, 'left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 bg-white shadow-lg rounded-full text-gray-700 hover:text-jade-600 border border-gray-100 hidden md:flex opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={() => scrollContainer(lovedScrollRef, 'right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 bg-white shadow-lg rounded-full text-gray-700 hover:text-jade-600 border border-gray-100 hidden md:flex opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
            >
                <ChevronRight size={24} />
            </button>

            {/* Products Carousel for Active Category */}
            {lovedProducts.length > 0 ? (
                <div 
                    ref={lovedScrollRef}
                    className="flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x snap-mandatory px-2"
                >
                {lovedProducts.map((product) => (
                    <div key={product.id} className="flex-shrink-0 w-80 snap-center">
                       <ProductCard product={product} />
                    </div>
                ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-400 bg-gray-50 rounded-lg">
                    No highlighted products in this category right now.
                </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: Inspiration & Trends (Single Video Auto-Slide) - No Title, No Padding */}
      <section className="bg-white mb-4">
        <div className="container max-w-[1440px]">
          {/* Main Video Display - Width same as container */}
          <div className="w-full relative group">
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                  {promoVideos.map((video, index) => (
                      <div 
                        key={video.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentVideoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                      >
                         <video 
                            className="w-full h-full object-cover"
                            poster={video.poster}
                            src={video.url}
                            muted
                            loop
                            autoPlay={index === currentVideoIndex}
                            playsInline
                         />
                      </div>
                  ))}
              </div>

              {/* Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                  {promoVideos.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentVideoIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-500 shadow-sm ${idx === currentVideoIndex ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/80'}`}
                      />
                  ))}
              </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Top Brands for Gifting */}
      <section className="py-16 bg-white mb-8">
         <div className="container mx-auto px-4 lg:px-8 max-w-[1440px]">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-10 text-center">Top Brands for Gifting</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {BRANDS.map((brand, idx) => {
                   // Find a representative image from products if available, else random
                   const brandProduct = MOCK_PRODUCTS.find(p => p.brand.includes(brand.name));
                   const displayImage = brandProduct ? brandProduct.image : `https://picsum.photos/seed/${brand.name}/400/400`;

                   return (
                    <div key={idx} className="flex flex-col items-center group cursor-pointer">
                        {/* Product Image */}
                        <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden shadow-sm mb-4 border border-gray-100 group-hover:border-jade-600 transition-colors relative">
                             <img 
                                src={displayImage} 
                                alt={brand.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                        </div>
                        
                        {/* Brand Logo (Image) */}
                        <div className="h-8 md:h-10 w-full flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                            <img src={brand.logo} alt={`${brand.name} Logo`} className="h-full object-contain" />
                        </div>
                    </div>
                )})}
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;