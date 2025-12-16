import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, User, MessageSquareMore } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../App';
import GeminiChat from './GeminiChat';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  }, [location]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      {/* Promo Banner */}
      <div className="bg-jade-900 text-white text-xs sm:text-sm py-2 text-center px-4 font-bold tracking-wide">
        FRIENDS & FAMILY SALE: EXTRA 30% OFF SELECT STYLES | CODE: FRIEND
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 text-gray-600 hover:text-jade-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-jade-600 text-white flex items-center justify-center font-serif font-bold text-xl rounded-sm">J</div>
              <span className="text-3xl font-serif font-bold tracking-tighter text-gray-900">JADE</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8 text-sm font-bold tracking-wide text-gray-700">
              <Link to="/shop?category=women" className="hover:text-jade-600 hover:underline decoration-2 underline-offset-4 transition-colors">WOMEN</Link>
              <Link to="/shop?category=men" className="hover:text-jade-600 hover:underline decoration-2 underline-offset-4 transition-colors">MEN</Link>
              <Link to="/shop?category=home" className="hover:text-jade-600 hover:underline decoration-2 underline-offset-4 transition-colors">HOME</Link>
              <Link to="/shop?category=beauty" className="hover:text-jade-600 hover:underline decoration-2 underline-offset-4 transition-colors">BEAUTY</Link>
              <Link to="/shop" className="hover:text-red-600 hover:underline decoration-2 underline-offset-4 transition-colors text-red-600">SALE</Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex relative">
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="pl-3 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-jade-500 focus:ring-1 focus:ring-jade-500 w-40 lg:w-64 transition-all"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-jade-600">
                  <Search size={18} />
                </button>
              </div>
              <button className="text-gray-700 hover:text-jade-600 hidden sm:block">
                <User size={24} strokeWidth={1.5} />
              </button>
              <Link to="/cart" className="text-gray-700 hover:text-jade-600 relative group">
                <ShoppingBag size={24} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-20 shadow-lg py-4 px-4 flex flex-col space-y-4">
            <div className="relative mb-4">
               <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-jade-500"
                />
               <Search className="absolute right-3 top-3 text-gray-400" size={18} />
            </div>
            <Link to="/shop?category=women" className="text-lg font-semibold text-gray-800 border-b pb-2">Women</Link>
            <Link to="/shop?category=men" className="text-lg font-semibold text-gray-800 border-b pb-2">Men</Link>
            <Link to="/shop?category=home" className="text-lg font-semibold text-gray-800 border-b pb-2">Home</Link>
            <Link to="/shop?category=beauty" className="text-lg font-semibold text-gray-800 border-b pb-2">Beauty</Link>
            <Link to="/shop" className="text-lg font-bold text-red-600 pb-2">Sale & Clearance</Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-serif text-xl font-bold mb-6">Customer Service</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Order Status</a></li>
                <li><a href="#" className="hover:text-white transition">Shipping & Delivery</a></li>
                <li><a href="#" className="hover:text-white transition">Returns</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold mb-6">Our Stores</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Store Locator</a></li>
                <li><a href="#" className="hover:text-white transition">Curbside Pickup</a></li>
                <li><a href="#" className="hover:text-white transition">Personal Stylist</a></li>
                <li><a href="#" className="hover:text-white transition">Gift Cards</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold mb-6">Jade Rewards</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Join for Free</a></li>
                <li><a href="#" className="hover:text-white transition">Manage Account</a></li>
                <li><a href="#" className="hover:text-white transition">Cardholder Benefits</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold mb-6">Stay Connected</h3>
              <p className="text-gray-400 text-sm mb-4">Sign up for emails & get 25% off today.</p>
              <div className="flex">
                <input type="email" placeholder="Email Address" className="bg-gray-800 border-none text-white px-4 py-2 w-full focus:ring-1 focus:ring-jade-500" />
                <button className="bg-jade-600 px-4 py-2 font-bold uppercase text-xs tracking-wider hover:bg-jade-500 transition">Sign Up</button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>&copy; 2024 Jade Department Stores, Inc. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Use</a>
              <a href="#" className="hover:text-white">CA Privacy Rights</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button for Gemini Chat */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="bg-jade-600 hover:bg-jade-700 text-white rounded-full p-4 shadow-2xl flex items-center justify-center transition-transform hover:scale-105"
          >
            <MessageSquareMore size={28} />
          </button>
        )}
      </div>

      {/* Chat Drawer */}
      <GeminiChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Layout;
