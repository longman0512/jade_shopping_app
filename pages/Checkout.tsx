
import React, { useState } from 'react';
import { useCart, useUser } from '../App';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, ShoppingBag, ArrowRight, CheckCircle, Smartphone } from 'lucide-react';
import { Order, Address } from '../types';

const Checkout: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const { addresses, addOrder, addAddress } = useUser();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'PayPal'>('Credit Card');
  
  // New Address State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 75 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% Tax
  const total = subtotal + shipping + tax;

  const handleAddAddress = () => {
    if (newAddress.name && newAddress.street) {
        const addr: Address = {
            id: Date.now().toString(),
            name: newAddress.name || '',
            street: newAddress.street || '',
            city: newAddress.city || '',
            zip: newAddress.zip || '',
            country: newAddress.country || 'USA',
        };
        addAddress(addr);
        setSelectedAddressId(addr.id);
        setIsAddingAddress(false);
    }
  };

  const handlePlaceOrder = () => {
    const address = addresses.find(a => a.id === selectedAddressId);
    if (!address) return;

    const order: Order = {
        id: Math.floor(100000 + Math.random() * 900000).toString(),
        items: [...cartItems],
        date: new Date().toISOString(),
        status: 'Accepted',
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress: address,
        paymentMethod
    };

    addOrder(order);
    clearCart();
    navigate('/account/orders');
  };

  if (cartItems.length === 0) {
      return (
          <div className="pt-24 pb-12 text-center">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4"/>
              <h2 className="text-2xl font-medium text-gray-900">Your bag is empty</h2>
              <button onClick={() => navigate('/shop')} className="mt-4 text-jade-600 hover:underline">Continue Shopping</button>
          </div>
      );
  }

  return (
    <div className="bg-white min-h-screen py-12 px-4 lg:px-8">
      <div className="max-w-[1000px] mx-auto">
        <h1 className="text-3xl font-normal text-gray-900 mb-8 tracking-tight">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column: Steps */}
            <div className="lg:w-2/3 space-y-8">
                
                {/* Step 1: Address */}
                <div className={`border rounded-[24px] p-6 transition-colors ${step === 1 ? 'border-jade-600 bg-white shadow-lg ring-1 ring-jade-100' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-medium flex items-center gap-2"><MapPin size={20}/> Shipping Address</h2>
                        {step > 1 && <button onClick={() => setStep(1)} className="text-sm text-jade-600 underline">Edit</button>}
                    </div>
                    
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                {addresses.map(addr => (
                                    <div 
                                        key={addr.id} 
                                        onClick={() => setSelectedAddressId(addr.id)}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-jade-500 bg-jade-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <div className="font-bold text-gray-900">{addr.name}</div>
                                        <div className="text-sm text-gray-600">{addr.street}</div>
                                        <div className="text-sm text-gray-600">{addr.city}, {addr.zip}</div>
                                    </div>
                                ))}
                                <button 
                                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                                    className="p-4 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 hover:border-jade-500 hover:text-jade-500"
                                >
                                    + Add New Address
                                </button>
                            </div>

                            {isAddingAddress && (
                                <div className="mt-4 p-4 bg-gray-100 rounded-xl space-y-3">
                                    <input placeholder="Full Name" className="w-full p-2 rounded border" onChange={e => setNewAddress({...newAddress, name: e.target.value})} />
                                    <div className="relative">
                                        <input placeholder="Street Address" className="w-full p-2 rounded border" onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                                        <button className="absolute right-2 top-2 text-xs text-jade-600 flex items-center gap-1"><MapPin size={12}/> Locate Me</button>
                                    </div>
                                    <div className="flex gap-2">
                                        <input placeholder="City" className="w-1/2 p-2 rounded border" onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                                        <input placeholder="Zip Code" className="w-1/2 p-2 rounded border" onChange={e => setNewAddress({...newAddress, zip: e.target.value})} />
                                    </div>
                                    <button onClick={handleAddAddress} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">Save Address</button>
                                </div>
                            )}

                            <button onClick={() => setStep(2)} className="mt-4 bg-jade-600 text-white px-8 py-3 rounded-full font-medium hover:bg-jade-700">Continue to Payment</button>
                        </div>
                    )}
                </div>

                {/* Step 2: Payment */}
                <div className={`border rounded-[24px] p-6 transition-colors ${step === 2 ? 'border-jade-600 bg-white shadow-lg ring-1 ring-jade-100' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-medium flex items-center gap-2"><CreditCard size={20}/> Payment Method</h2>
                        {step > 2 && <button onClick={() => setStep(2)} className="text-sm text-jade-600 underline">Edit</button>}
                    </div>

                    {step === 2 && (
                        <div className="space-y-4">
                             <div className="flex gap-4">
                                <button 
                                    onClick={() => setPaymentMethod('Credit Card')}
                                    className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 ${paymentMethod === 'Credit Card' ? 'border-jade-500 bg-jade-50' : 'border-gray-200'}`}
                                >
                                    <CreditCard size={24}/>
                                    <span className="font-medium">Card</span>
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('PayPal')}
                                    className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 ${paymentMethod === 'PayPal' ? 'border-jade-500 bg-jade-50' : 'border-gray-200'}`}
                                >
                                    <div className="font-bold text-blue-800 italic">PayPal</div>
                                    <span className="font-medium">PayPal</span>
                                </button>
                             </div>

                             {paymentMethod === 'Credit Card' && (
                                 <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                                     <input placeholder="Card Number" className="w-full p-2 rounded border" />
                                     <div className="flex gap-3">
                                         <input placeholder="MM/YY" className="w-1/2 p-2 rounded border" />
                                         <input placeholder="CVC" className="w-1/2 p-2 rounded border" />
                                     </div>
                                 </div>
                             )}

                             <div className="flex gap-3">
                                <button onClick={() => setStep(1)} className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-full">Back</button>
                                <button onClick={() => setStep(3)} className="bg-jade-600 text-white px-8 py-3 rounded-full font-medium hover:bg-jade-700">Review Order</button>
                             </div>
                        </div>
                    )}
                </div>

                {/* Step 3: Review */}
                <div className={`border rounded-[24px] p-6 transition-colors ${step === 3 ? 'border-jade-600 bg-white shadow-lg ring-1 ring-jade-100' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                    <h2 className="text-xl font-medium mb-4 flex items-center gap-2"><CheckCircle size={20}/> Review & Place Order</h2>
                    {step === 3 && (
                        <div>
                             <p className="text-gray-600 mb-4">Review your items and shipping details before finalizing.</p>
                             <button onClick={handlePlaceOrder} className="w-full bg-jade-600 text-white py-4 rounded-full font-bold text-lg hover:bg-jade-700 shadow-lg hover:shadow-xl transition-all">
                                Place Order - ${total.toFixed(2)}
                             </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:w-1/3">
                <div className="bg-gray-50 p-6 rounded-[32px] sticky top-24">
                    <h3 className="font-medium text-lg mb-4">Order Summary</h3>
                    <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex gap-3 text-sm">
                                <img src={item.image} className="w-12 h-12 object-cover rounded-md" />
                                <div className="flex-1">
                                    <div className="font-medium truncate">{item.name}</div>
                                    <div className="text-gray-500">Qty: {item.quantity}</div>
                                </div>
                                <div>${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className={shipping === 0 ? "text-jade-600" : ""}>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Estimated Tax (8%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
