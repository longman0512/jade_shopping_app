import React from 'react';
import { useCart } from '../App';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
            <ShoppingBag size={40} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Your Bag is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-md text-center">Looks like you haven't added anything to your bag yet. Start shopping to find the latest trends.</p>
        <Link to="/shop" className="bg-jade-600 text-white px-8 py-3 font-bold tracking-wide hover:bg-jade-700 transition-colors">
          START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-10">Shopping Bag ({cartItems.length} items)</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="space-y-6">
                {cartItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-gray-100">
                        <div 
                          className="w-full sm:w-32 aspect-[3/4] bg-gray-100 flex-shrink-0 cursor-pointer" 
                          onClick={() => navigate(`/product/${item.id}`)}
                        >
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase">{item.brand}</h3>
                                    <h2 className="text-lg font-medium text-gray-900">
                                        <Link to={`/product/${item.id}`} className="hover:text-jade-600 text-left">{item.name}</Link>
                                    </h2>
                                </div>
                                <span className="font-bold text-gray-900">${item.price.toFixed(2)}</span>
                            </div>
                            
                            <div className="text-sm text-gray-500 mb-4 space-y-1">
                                {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                                <p>Qty: {item.quantity}</p>
                                <p className="text-green-600 text-xs">In Stock - Ships immediately</p>
                            </div>

                            <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-sm text-gray-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                            >
                                <Trash2 size={14} /> Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:w-1/3">
            <div className="bg-gray-50 p-8 rounded-sm sticky top-24">
                <h2 className="text-xl font-bold font-serif mb-6 text-gray-900">Order Summary</h2>
                
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 text-sm text-gray-600">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="font-medium text-gray-900">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Estimated Tax</span>
                        <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex justify-between mb-8 text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>

                <button className="w-full bg-red-600 text-white py-4 font-bold tracking-wide hover:bg-red-700 transition-colors mb-4 flex items-center justify-center gap-2">
                    PROCEED TO CHECKOUT <ArrowRight size={18} />
                </button>
                
                <p className="text-xs text-center text-gray-500">
                    By proceeding, you accept our Terms and Conditions.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;