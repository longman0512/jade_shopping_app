import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIES, MOCK_PRODUCTS } from '../constants';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ChevronRight, ChevronLeft, Play } from 'lucide-react';

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

  const calculateDiscount = (price: number, original?: number) => {
    if (!original) return 0;
    return Math.round(((original - price) / original) * 100);
  };

  const promoVideos = [
    { id: 1, poster: 'https://picsum.photos/seed/vposter1/600/350', url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4', title: 'Neon Summer Nights' },
    { id: 2, poster: 'https://picsum.photos/seed/vposter2/600/350', url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-putting-on-makeup-starts-smiling-869-large.mp4', title: 'Morning Rituals' },
    { id: 3, poster: 'https://picsum.photos/seed/vposter3/600/350', url: 'https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-salad-in-a-kitchen-40523-large.mp4', title: 'Culinary Excellence' },
  ];

  // Auto slide video
  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentVideoIndex(prev => (prev + 1) % promoVideos.length);
    }, 5000); // 5 seconds
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
      {/* Hero Section */}
      <div className="relative h-[500px] md:h-[600px] bg-gray-100 overflow-hidden mb-4">
        <img 
          src="https://picsum.photos/seed/fashionhero/1920/1080" 
          alt="New Arrivals" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-transparent flex items-center">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-xl text-white">
              <span className="uppercase tracking-[0.2em] text-sm font-bold mb-4 block text-jade-300">New Collection</span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
                Summer <br/> Elegance
              </h1>
              <p className="text-lg md:text-xl mb-8 font-light text-gray-200">
                Discover the latest trends in fashion and home. Curated just for you.
              </p>
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 font-bold tracking-wider hover:bg-jade-500 hover:text-white transition-all duration-300"
              >
                SHOP NOW <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Can't-miss deals */}
      <section className="py-12 bg-white mb-4">
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Can't-Miss Deals</h2>
            <div className="flex gap-2">
                <button 
                    onClick={() => scrollContainer(dealsScrollRef, 'left')}
                    className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <button 
                    onClick={() => scrollContainer(dealsScrollRef, 'right')}
                    className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
          </div>
          
          {/* Manual Sliding Carousel */}
          <div 
            ref={dealsScrollRef}
            className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x snap-mandatory"
          >
            {deals.map((product) => (
              <Link 
                to={`/product/${product.id}`} 
                key={product.id}
                className="flex-shrink-0 w-56 snap-start group"
              >
                <div className="relative aspect-[3/4] bg-gray-100 mb-3 overflow-hidden rounded-sm">
                   <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                   />
                   {/* Discount Badge */}
                   <div className="absolute top-2 right-2 bg-red-600 text-white font-bold text-sm px-3 py-1 rounded-sm shadow-md">
                     {calculateDiscount(product.price, product.originalPrice)}% OFF
                   </div>
                </div>
                {/* Simplified Content: Only Name */}
                <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-jade-700 transition-colors text-center">
                  {product.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: Loved by us, picked for you */}
      <section className="py-16 bg-white mb-4">
        <div className="container mx-auto px-4 lg:px-8">
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

          <div className="relative">
             {/* Navigation Buttons */}
             <button 
                onClick={() => scrollContainer(lovedScrollRef, 'left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 bg-white shadow-lg rounded-full text-gray-700 hover:text-jade-600 border border-gray-100 hidden md:flex"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={() => scrollContainer(lovedScrollRef, 'right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 bg-white shadow-lg rounded-full text-gray-700 hover:text-jade-600 border border-gray-100 hidden md:flex"
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
                    <div key={product.id} className="flex-shrink-0 w-80 snap-center bg-white border border-gray-100 rounded-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                    <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden">
                        <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                         {product.originalPrice && (
                            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                                Sale
                            </div>
                        )}
                    </Link>
                    <div className="p-5 flex flex-col flex-grow">
                        <Link to={`/product/${product.id}`}>
                            <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-jade-700 transition-colors line-clamp-1">{product.name}</h3>
                        </Link>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>
                        
                        <div className="mt-auto pt-4 border-t border-gray-50">
                            {/* Price */}
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className={`text-xl font-bold ${product.originalPrice ? 'text-red-600' : 'text-gray-900'}`}>
                                ${product.price.toFixed(2)}
                                </span>
                                {product.originalPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                    ${product.originalPrice.toFixed(2)}
                                </span>
                                )}
                            </div>

                            {/* Reviews and Buy Stats */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                    <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} strokeWidth={1} />
                                            ))}
                                    </div>
                                    <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
                                </div>
                                <div className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                    {Math.floor(product.reviews / 2)}+ bought
                                </div>
                            </div>
                        </div>
                    </div>
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

      {/* SECTION 3: Advertising and Promo (Single Video Auto-Slide) */}
      <section className="py-12 bg-white mb-4">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8 text-center">Inspiration & Trends</h2>
          
          <div className="max-w-4xl mx-auto relative group">
              {/* Main Video Display */}
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
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
                         <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-8 text-white">
                            <h3 className="text-2xl font-serif font-bold mb-2">{video.title}</h3>
                            <p className="text-sm opacity-90">Discover the stories behind the style.</p>
                         </div>
                      </div>
                  ))}
              </div>

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {promoVideos.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentVideoIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentVideoIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                      />
                  ))}
              </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Top Brands for Gifting */}
      <section className="py-16 bg-white">
         <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-10 text-center">Top Brands for Gifting</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                {deals.concat(lovedProducts).slice(0, 6).map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center group cursor-pointer">
                        <div className="w-full aspect-square bg-gray-50 rounded-full overflow-hidden shadow-sm mb-4 border border-gray-100 group-hover:border-jade-600 transition-colors p-6 flex items-center justify-center relative">
                            {/* Brand Image Mockup */}
                            <img 
                                src={item.image} 
                                alt={item.brand} 
                                className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500 opacity-80 group-hover:opacity-100" 
                            />
                        </div>
                        <span className="font-bold text-gray-900 text-sm uppercase tracking-wide group-hover:text-jade-700 border-b-2 border-transparent group-hover:border-jade-600 pb-1 transition-all">
                            {item.brand}
                        </span>
                    </div>
                ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;