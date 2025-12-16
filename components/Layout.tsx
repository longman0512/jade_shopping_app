import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, User, MessageSquareMore, HelpCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../App';
import GeminiChat from './GeminiChat';
import { ArrowRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  }, [location]);

  // Handle scroll effect for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col items-center bg-white text-[#202124] font-sans">
      {/* Top utility bar - Green Background */}
      <div className="w-full bg-[#26966b] text-[11px] py-2 text-center text-white font-medium">
        Free shipping on all orders. <span className="text-white font-bold ml-1 cursor-pointer hover:underline">Learn more</span>
      </div>

      {/* Header - Dark Background */}
      <header className={`sticky top-0 z-40 bg-[#121827] w-full transition-shadow duration-200 ${scrolled ? 'shadow-md' : ''}`}>
        <div className="w-full max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
               <button 
                className="lg:hidden p-2 text-gray-300 hover:bg-white/10 rounded-full"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <Link to="/" className="flex items-center gap-2 group">
                 {/* Logo Text - White */}
                <span className="text-2xl font-normal tracking-tight text-white group-hover:text-jade-400 transition-colors">Jade</span>
              </Link>
            </div>

            {/* Center: Navigation (Desktop) - Light Gray Text */}
            <nav className="hidden lg:flex space-x-1">
              {[
                { name: 'Women', path: '/shop?category=women' },
                { name: 'Men', path: '/shop?category=men' },
                { name: 'Home', path: '/shop?category=home' },
                { name: 'Beauty', path: '/shop?category=beauty' },
                { name: 'Sale', path: '/shop', isSale: true },
              ].map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    link.isSale ? 'text-jade-400 hover:bg-white/10' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right: Icons - White/Gray */}
            <div className="flex items-center space-x-1">
              <button className="p-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-full transition-colors hidden sm:block">
                <Search size={20} />
              </button>
              <button className="p-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-full transition-colors hidden sm:block">
                <HelpCircle size={20} />
              </button>
              <Link to="/cart" className="p-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-full transition-colors relative">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-2 right-2 bg-jade-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button className="p-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-full transition-colors hidden sm:block">
                 <User size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu - Dark to match Header */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#121827] absolute w-full left-0 top-16 shadow-xl py-4 px-6 flex flex-col space-y-4 text-white z-50 border-t border-gray-800 h-screen">
             <div className="relative mb-2">
               <input 
                  type="text" 
                  placeholder="Search Jade Store" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white placeholder-gray-400 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-jade-500 border-none"
                />
               <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
            <Link to="/shop?category=women" className="text-lg font-medium text-gray-300 py-2 border-b border-gray-800">Women</Link>
            <Link to="/shop?category=men" className="text-lg font-medium text-gray-300 py-2 border-b border-gray-800">Men</Link>
            <Link to="/shop?category=home" className="text-lg font-medium text-gray-300 py-2 border-b border-gray-800">Home</Link>
            <Link to="/shop?category=beauty" className="text-lg font-medium text-gray-300 py-2 border-b border-gray-800">Beauty</Link>
            <Link to="/shop" className="text-lg font-medium text-jade-400 py-2">Sale</Link>
          </div>
        )}
      </header>

      {/* Hero Section - Clean, Rounded - Only on Homepage */}
      {isHomePage && (
        <div className="w-full max-w-[1440px] px-4 lg:px-6 pt-4 mb-8">
            <div className="relative w-full h-[500px] md:h-[600px] rounded-[28px] md:rounded-[48px] overflow-hidden bg-gray-100">
            <video 
                className="w-full h-full object-cover"
                src="https://cdn.coverr.co/videos/coverr-fashion-photoshoot-with-a-model-4982/1080p.mp4"
                autoPlay
                muted
                loop
                playsInline
            />
            <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-center p-6">
                <h1 className="text-4xl md:text-6xl font-normal text-white mb-6 leading-tight tracking-tight drop-shadow-sm">
                Summer Elegance. <br/> Redefined.
                </h1>
                <div className="flex gap-4">
                    <Link 
                    to="/shop" 
                    className="bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                    Shop Collection
                    </Link>
                </div>
            </div>
            </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow flex flex-col w-full max-w-[1440px]">
        {children}
      </main>

      {/* Footer - Dark Background */}
      <footer className="bg-[#121827] text-white border-t border-gray-800 pt-16 pb-8 w-full mt-auto">
        <div className="w-full max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div>
              <h3 className="text-sm font-medium text-white mb-4">Support</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-jade-400 hover:underline">Order Status</a></li>
                <li><a href="#" className="hover:text-jade-400 hover:underline">Returns</a></li>
                <li><a href="#" className="hover:text-jade-400 hover:underline">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white mb-4">About</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-jade-400 hover:underline">Our Story</a></li>
                <li><a href="#" className="hover:text-jade-400 hover:underline">Careers</a></li>
                <li><a href="#" className="hover:text-jade-400 hover:underline">Sustainability</a></li>
              </ul>
            </div>
             <div>
              <h3 className="text-sm font-medium text-white mb-4">Store</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-jade-400 hover:underline">Locations</a></li>
                <li><a href="#" className="hover:text-jade-400 hover:underline">Services</a></li>
              </ul>
            </div>
            <div>
                <div className="flex gap-4 mb-4">
                    {/* Social Icons Placeholder */}
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer transition-colors">f</div>
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer transition-colors">t</div>
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer transition-colors">in</div>
                </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
             <div className="flex gap-6 mb-4 md:mb-0">
                <span>United States</span>
                <a href="#" className="hover:text-gray-300">Privacy</a>
                <a href="#" className="hover:text-gray-300">Google Nest Commitment</a>
                <a href="#" className="hover:text-gray-300">Sales Terms</a>
                <a href="#" className="hover:text-gray-300">Terms of Service</a>
             </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button for Gemini Chat */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="bg-white hover:bg-gray-50 text-jade-600 rounded-full p-4 shadow-lg border border-gray-100 flex items-center justify-center transition-all hover:scale-105"
          >
            <MessageSquareMore size={24} />
          </button>
        )}
      </div>

      <GeminiChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Layout;