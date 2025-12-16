import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIES, MOCK_PRODUCTS, BRANDS } from '../constants';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Women');
  const dealsScrollRef = useRef<HTMLDivElement>(null);
  const lovedScrollRef = useRef<HTMLDivElement>(null);
  
  // Video Carousel State
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  const deals = MOCK_PRODUCTS.filter(p => p.originalPrice);
  const lovedProducts = MOCK_PRODUCTS.filter(p => p.category === activeCategory);

  const promoVideos = [
    { id: 1, poster: 'https://picsum.photos/seed/vposter1/600/350', url: 'https://cdn.coverr.co/videos/coverr-walking-in-a-city-at-night-4523/1080p.mp4', title: 'Neon Summer Nights' },
    { id: 2, poster: 'https://picsum.photos/seed/vposter2/600/350', url: 'https://cdn.coverr.co/videos/coverr-applying-face-cream-979/1080p.mp4', title: 'Morning Rituals' },
    { id: 3, poster: 'https://picsum.photos/seed/vposter3/600/350', url: 'https://cdn.coverr.co/videos/coverr-preparing-food-in-kitchen-2629/1080p.mp4', title: 'Culinary Excellence' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentVideoIndex(prev => (prev + 1) % promoVideos.length);
    }, 8000);
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
    <div className="space-y-4 px-4 lg:px-6">
      {/* SECTION 1: Can't-miss deals */}
      <section className="bg-white rounded-[28px] py-12">
        <div className="container mx-auto">
          <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-normal text-gray-900 mb-4 tracking-tight">Deals you don't want to miss.</h2>
            <Link to="/shop" className="text-jade-700 font-medium hover:underline">View all offers</Link>
          </div>
          
          <div className="relative group/carousel">
             <button 
                onClick={() => scrollContainer(dealsScrollRef, 'left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-4 bg-white shadow-lg rounded-full text-gray-700 border border-gray-100 hidden md:flex opacity-0 group-hover/carousel:opacity-100 transition-opacity"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={() => scrollContainer(dealsScrollRef, 'right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-4 bg-white shadow-lg rounded-full text-gray-700 border border-gray-100 hidden md:flex opacity-0 group-hover/carousel:opacity-100 transition-opacity"
            >
                <ChevronRight size={24} />
            </button>

            <div 
                ref={dealsScrollRef}
                className="flex overflow-x-auto gap-4 pb-8 no-scrollbar snap-x snap-mandatory px-2"
            >
                {deals.map((product) => (
                <div 
                    key={product.id}
                    className="flex-shrink-0 w-64 snap-start h-full"
                >
                    <ProductCard product={product} />
                </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Category Picker */}
      <section className="bg-white py-16">
        <div className="container mx-auto text-center">
           <h2 className="text-3xl md:text-4xl font-normal text-gray-900 mb-2 tracking-tight">Picked for you.</h2>
           <div className="flex justify-center overflow-x-auto my-8 space-x-3 no-scrollbar py-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  activeCategory === cat.name 
                    ? 'bg-jade-50 text-jade-700 border-jade-200' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative group/carousel px-4">
             <button 
                onClick={() => scrollContainer(lovedScrollRef, 'left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-4 bg-white shadow-lg rounded-full text-gray-700 border border-gray-100 hidden md:flex opacity-0 group-hover/carousel:opacity-100 transition-opacity"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={() => scrollContainer(lovedScrollRef, 'right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-4 bg-white shadow-lg rounded-full text-gray-700 border border-gray-100 hidden md:flex opacity-0 group-hover/carousel:opacity-100 transition-opacity"
            >
                <ChevronRight size={24} />
            </button>

            {lovedProducts.length > 0 ? (
                <div 
                    ref={lovedScrollRef}
                    className="flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x snap-mandatory px-2"
                >
                {lovedProducts.map((product) => (
                    <div key={product.id} className="flex-shrink-0 w-72 snap-center">
                       <ProductCard product={product} />
                    </div>
                ))}
                </div>
            ) : (
                <div className="py-20 text-gray-400 bg-gray-50 rounded-3xl">
                    No items to show.
                </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: Inspiration (Rounded Video) */}
      <section className="pb-8">
          <div className="w-full relative group rounded-[28px] md:rounded-[48px] max-w-[1440px] overflow-hidden bg-black aspect-video md:aspect-[21/9]">
              {promoVideos.map((video, index) => (
                  <div 
                    key={video.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentVideoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  >
                      <video 
                        className="w-full h-full object-cover opacity-80"
                        poster={video.poster}
                        src={video.url}
                        muted
                        loop
                        autoPlay={index === currentVideoIndex}
                        playsInline
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                         <h2 className="text-3xl md:text-5xl font-normal mb-4 text-center">{video.title}</h2>
                      </div>
                  </div>
              ))}
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {promoVideos.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentVideoIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentVideoIndex ? 'bg-white w-8' : 'bg-white/40 w-2'}`}
                      />
                  ))}
              </div>
          </div>
      </section>

      {/* SECTION 4: Brands - Cards Style */}
      <section className="py-16 bg-gray-50 rounded-[28px]">
         <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-normal text-gray-900 mb-12 text-center tracking-tight">Popular Brands</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {BRANDS.map((brand, idx) => (
                    <div key={idx} className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="h-12 w-full flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                            <img src={brand.logo} alt={`${brand.name}`} className="h-full object-contain" />
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;