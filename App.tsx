import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import { CartItem } from './types';
import { X } from 'lucide-react';

// Cart Context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

// Product Drawer Context
interface ProductDrawerContextType {
  openProduct: (id: string) => void;
  closeProduct: () => void;
}

const ProductDrawerContext = createContext<ProductDrawerContextType | undefined>(undefined);

export const useProductDrawer = () => {
  const context = useContext(ProductDrawerContext);
  if (!context) throw new Error('useProductDrawer must be used within a ProductDrawerProvider');
  return context;
};

const App: React.FC = () => {
  // Persist cart to local storage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('jade_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Drawer State
  const [drawerProductId, setDrawerProductId] = useState<string | null>(null);

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

  const openProduct = (id: string) => {
    setDrawerProductId(id);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  };

  const closeProduct = () => {
    setDrawerProductId(null);
    // Restore background scrolling
    document.body.style.overflow = 'unset';
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      <ProductDrawerContext.Provider value={{ openProduct, closeProduct }}>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </Layout>

          {/* Product Detail Sidebar Drawer */}
          {drawerProductId && (
            <>
              {/* Overlay */}
              <div 
                className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity" 
                onClick={closeProduct}
              />
              
              {/* Sidebar */}
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
  );
};

export default App;