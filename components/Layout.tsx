
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Menu, X, User, MessageSquareMore, HelpCircle, Heart, Bell, Settings, LogOut, Package, LayoutDashboard, Globe } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart, useUser } from '../App';
import GeminiChat from './GeminiChat';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const { cartItems } = useCart();
  const { notifications, markNotificationRead, settings, updateSettings } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const unreadNotifs = notifications.filter(n => !n.read).length;
  const isHomePage = location.pathname === '/';

  const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-white text-[#202124] font-sans">
      {/* Top utility bar */}
      <div className="w-full bg-[#26966b] text-[11px] py-2 text-center text-white font-medium relative z-50">
        Free shipping on all orders. <span className="text-white font-bold ml-1 cursor-pointer hover:underline">Learn more</span>
      </div>

      {/* Header */}
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
                <span className="text-2xl font-normal tracking-tight text-white group-hover:text-jade-400 transition-colors">Jade</span>
              </Link>
            </div>

            {/* Center: Navigation (Desktop) */}
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

            {/* Right: Icons */}
            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <div className="hidden md:block relative group">
                  <button className="p-2 text-gray-300 hover:text-white flex items-center gap-1 text-xs uppercase font-medium">
                      <Globe size={16} /> {settings.language}
                  </button>
                  <div className="absolute right-0 top-full pt-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 w-32">
                      <div className="bg-white rounded-xl shadow-xl overflow-hidden py-1 border border-gray-100">
                          {LANGUAGES.map(lang => (
                              <button 
                                key={lang.code}
                                onClick={() => updateSettings({ language: lang.code as any })}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${settings.language === lang.code ? 'text-jade-600 font-bold' : 'text-gray-700'}`}
                              >
                                  {lang.label}
                              </button>
                          ))}
                      </div>
                  </div>
              </div>

              <div className="h-6 w-px bg-gray-700 mx-1 hidden sm:block"></div>

              <Link to="/cart" className="p-2 text-gray-300 hover:bg-white/10 hover:text-white rounded-full transition-colors relative">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-jade-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <div className="relative" ref={notifMenuRef}>
                <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="p-2 text-gray-300 hover:bg-white/10 hover:text-white rounded-full transition-colors relative"
                >
                    <Bell size={20} />
                    {unreadNotifs > 0 && (
                        <span className="absolute top-1.5 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-[#121827]"></span>
                    )}
                </button>
                
                {isNotifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-medium text-sm text-gray-900">Notifications</h3>
                            <button onClick={() => notifications.forEach(n => markNotificationRead(n.id))} className="text-xs text-jade-600 hover:underline">Mark all read</button>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-sm">No notifications yet</div>
                            ) : (
                                notifications.map(notif => (
                                    <div 
                                        key={notif.id} 
                                        onClick={() => markNotificationRead(notif.id)}
                                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-medium text-sm text-gray-900">{notif.title}</span>
                                            <span className="text-[10px] text-gray-400">{new Date(notif.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-snug">{notif.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2 text-gray-300 hover:bg-white/10 hover:text-white rounded-full transition-colors"
                >
                    <User size={20} />
                </button>
                
                {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <p className="font-medium text-gray-900 text-sm">Hello, Guest</p>
                            <p className="text-xs text-gray-500">Sign in for best experience</p>
                        </div>
                        <div className="py-2">
                             <Link to="/account/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-jade-600">
                                <User size={16} /> My Profile
                            </Link>
                            <Link to="/account/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-jade-600">
                                <Package size={16} /> My Orders
                            </Link>
                             <Link to="/account/wishlist" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-jade-600">
                                <Heart size={16} /> Wishlist
                            </Link>
                             <div className="h-px bg-gray-100 my-1"></div>
                             <Link to="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-jade-600">
                                <LayoutDashboard size={16} /> Admin Demo
                            </Link>
                        </div>
                    </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#121827] absolute w-full left-0 top-16 shadow-xl py-4 px-6 flex flex-col space-y-4 text-white z-50 border-t border-gray-800 h-screen overflow-y-auto pb-20">
             <div className="relative mb-2">
               <input 
                  type="text" 
                  placeholder="Search Jade Store" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white placeholder-gray-400 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-jade-500 border-none"
                />
               <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
            <Link to="/shop?category=women" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-gray-300 py-2 border-b border-gray-800">Women</Link>
            <Link to="/shop?category=men" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-gray-300 py-2 border-b border-gray-800">Men</Link>
            <Link to="/shop?category=home" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-gray-300 py-2 border-b border-gray-800">Home</Link>
            <Link to="/shop?category=beauty" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-gray-300 py-2 border-b border-gray-800">Beauty</Link>
            <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-jade-400 py-2">Sale</Link>
            <div className="pt-4 border-t border-gray-800">
                <Link to="/account/orders" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-400">Track Order</Link>
                <Link to="/account/wishlist" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-400">Wishlist</Link>
                <Link to="/account/profile" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-400">Account Settings</Link>
            </div>
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
                <li><Link to="/account/orders" className="hover:text-jade-400 hover:underline">Order Status</Link></li>
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
