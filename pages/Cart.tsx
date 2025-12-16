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
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white p-4">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
            <ShoppingBag size={48} />
        </div>
        <h1 className="text-2xl font-normal text-gray-900 mb-2">Your Bag is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-md text-center">Looks like you haven't added anything to your bag yet.</p>
        <Link to="/shop" className="bg-jade-600 text-white px-8 py-3 rounded-full font-medium hover:bg-jade-700 transition-colors shadow-md hover:shadow-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white py-12 px-4 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl font-normal text-gray-900 mb-10 tracking-tight">Shopping Bag ({cartItems.length})</h1>
        
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="space-y-8">
                {cartItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex gap-6 pb-8 border-b border-gray-100 last:border-0">
                        <div 
                          className="w-32 h-32 bg-[#f1f3f4] rounded-2xl flex-shrink-0 cursor-pointer overflow-hidden" 
                          onClick={() => navigate(`/product/${item.id}`)}
                        >
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <div className="flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-1">
                                <h2 className="text-lg font-medium text-gray-900 hover:text-jade-700 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                                    {item.name}
                                </h2>
                                <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-auto">{item.brand}</p>
                            
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-600">
                                    {item.selectedSize && <span className="bg-gray-100 px-2 py-1 rounded-md mr-2">Size: {item.selectedSize}</span>}
                                    <span className="bg-gray-100 px-2 py-1 rounded-md">Qty: {item.quantity}</span>
                                </div>
                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-sm text-gray-400 hover:text-red-500 font-medium transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:w-1/3">
            <div className="bg-gray-50 p-8 rounded-[32px]">
                <h2 className="text-xl font-medium mb-6 text-gray-900">Order Summary</h2>
                
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 text-sm text-gray-600">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className={shipping === 0 ? 'text-jade-600 font-medium' : ''}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Estimated Tax</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex justify-between mb-8 text-xl font-medium text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>

                <button className="w-full bg-jade-600 text-white py-4 rounded-full font-medium hover:bg-jade-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                    Checkout <ArrowRight size={18} />
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;