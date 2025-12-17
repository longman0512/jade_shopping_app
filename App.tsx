
import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { CartItem, Order, Address, Notification, UserSettings } from './types';
import { X } from 'lucide-react';

// --- Context Definitions ---

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}

interface UserContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addresses: Address[];
  addAddress: (address: Address) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

interface ProductDrawerContextType {
  openProduct: (id: string) => void;
  closeProduct: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const UserContext = createContext<UserContextType | undefined>(undefined);
const ProductDrawerContext = createContext<ProductDrawerContextType | undefined>(undefined);

// --- Hooks ---

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

export const useProductDrawer = () => {
  const context = useContext(ProductDrawerContext);
  if (!context) throw new Error('useProductDrawer must be used within a ProductDrawerProvider');
  return context;
};

// --- App Component ---

const App: React.FC = () => {
  // --- Cart State ---
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('jade_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('jade_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (newItem: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === newItem.id && item.selectedSize === newItem.selectedSize);
      if (existing) {
        return prev.map(item => 
          item.id === newItem.id && item.selectedSize === newItem.selectedSize 
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };
  
  const clearCart = () => setCartItems([]);

  // --- User State ---
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('jade_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('jade_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('jade_addresses');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Home', street: '123 Fashion Ave', city: 'New York', zip: '10001', country: 'USA', isDefault: true }
    ];
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Welcome to Jade', message: 'Thanks for joining us! Enjoy 10% off your first order.', date: new Date().toISOString(), read: false, type: 'system' }
  ]);

  const [settings, setSettings] = useState<UserSettings>({
    language: 'en',
    notifications: { email: true, push: true, inApp: true }
  });

  // Persist User State
  useEffect(() => { localStorage.setItem('jade_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('jade_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('jade_addresses', JSON.stringify(addresses)); }, [addresses]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    setNotifications(prev => [{
      id: Date.now().toString(),
      title: 'Order Confirmed',
      message: `Order #${order.id} has been placed successfully.`,
      date: new Date().toISOString(),
      read: false,
      type: 'order'
    }, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    setNotifications(prev => [{
      id: Date.now().toString(),
      title: 'Order Updated',
      message: `Order #${orderId} is now ${status}.`,
      date: new Date().toISOString(),
      read: false,
      type: 'order'
    }, ...prev]);
  };

  const addAddress = (addr: Address) => setAddresses(prev => [...prev, addr]);
  
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // --- Drawer State ---
  const [drawerProductId, setDrawerProductId] = useState<string | null>(null);

  const openProduct = (id: string) => {
    setDrawerProductId(id);
    document.body.style.overflow = 'hidden';
  };

  const closeProduct = () => {
    setDrawerProductId(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <UserContext.Provider value={{ 
      wishlist, toggleWishlist, 
      orders, addOrder, updateOrderStatus,
      addresses, addAddress,
      notifications, markNotificationRead,
      settings, updateSettings
    }}>
      <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
        <ProductDrawerContext.Provider value={{ openProduct, closeProduct }}>
          <HashRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/account/orders" element={<Orders />} />
                <Route path="/account/wishlist" element={<Wishlist />} />
                <Route path="/account/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </Layout>

            {/* Product Detail Sidebar Drawer */}
            {drawerProductId && (
              <>
                <div 
                  className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity" 
                  onClick={closeProduct}
                />
                <div className="fixed inset-y-0 right-0 w-full md:w-1/3 bg-white z-[70] shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
                   <button 
                      onClick={closeProduct} 
                      className="absolute top-4 right-4 z-20 p-2 bg-white/90 rounded-full hover:bg-gray-100 shadow-sm border border-gray-100"
                   >
                      <X size={24} className="text-gray-600"/>
                   </button>
                   <div className="flex-grow">
                     <ProductDetail productId={drawerProductId} isSidebar={true} onClose={closeProduct} />
                   </div>
                </div>
              </>
            )}
          </HashRouter>
        </ProductDrawerContext.Provider>
      </CartContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
