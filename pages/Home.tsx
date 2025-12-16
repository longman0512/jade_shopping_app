import React from 'react';
import { CATEGORIES, MOCK_PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, RefreshCw, ShieldCheck } from 'lucide-react';

const Home: React.FC = () => {
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[500px] md:h-[600px] bg-gray-100 overflow-hidden">
        <img 
          src="https://picsum.photos/seed/fashionhero/1920/1080" 
          alt="New Arrivals" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
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

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-center mb-12 text-gray-900">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link to={`/shop?category=${cat.slug}`} key={cat.id} className="group text-center">
                <div className="relative overflow-hidden rounded-full aspect-square mb-4 ring-2 ring-offset-4 ring-transparent group-hover:ring-jade-500 transition-all duration-300">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-gray-700 group-hover:text-jade-700 tracking-wide uppercase text-sm">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Trending Now</h2>
                <p className="text-gray-500">Handpicked favorites just for you.</p>
            </div>
            <Link to="/shop" className="text-jade-700 font-bold hover:underline decoration-2 underline-offset-4 flex items-center gap-1">
                View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-jade-900 text-white">
        <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <Truck size={40} className="mb-4 text-jade-300" strokeWidth={1.5} />
                    <h3 className="text-lg font-bold mb-2">Free Shipping & Returns</h3>
                    <p className="text-jade-200 text-sm">On all orders over $75. Shop with confidence.</p>
                </div>
                <div className="flex flex-col items-center">
                    <ShieldCheck size={40} className="mb-4 text-jade-300" strokeWidth={1.5} />
                    <h3 className="text-lg font-bold mb-2">Secure Payment</h3>
                    <p className="text-jade-200 text-sm">Your payment information is always safe with us.</p>
                </div>
                <div className="flex flex-col items-center">
                    <RefreshCw size={40} className="mb-4 text-jade-300" strokeWidth={1.5} />
                    <h3 className="text-lg font-bold mb-2">30-Day Money Back</h3>
                    <p className="text-jade-200 text-sm">If you don't love it, return it. No questions asked.</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
