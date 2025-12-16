import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../constants';
import { useCart } from '../App';
import { Star, Truck, Shield, Minus, Plus, ShoppingBag, Sparkles } from 'lucide-react';
import { createChatSession, sendMessageToGemini } from '../services/geminiService';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  
  // Gemini State
  const [styleAdvice, setStyleAdvice] = useState<string>('');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  if (!product) return <div className="p-20 text-center">Product not found</div>;

  const handleAddToCart = () => {
    addToCart({ ...product, quantity, selectedSize });
  };

  const fetchStyleAdvice = async () => {
    setIsLoadingAdvice(true);
    try {
        const session = createChatSession();
        const prompt = `I am looking at the product called "${product.name}" by ${product.brand}. It is a ${product.category} item described as "${product.description}". 
        Can you give me 3 short bullet points on: 
        1. How to style this? 
        2. Where to wear it? 
        3. A care tip?
        Keep it brief and classy.`;
        
        const response = await sendMessageToGemini(session, prompt);
        setStyleAdvice(response);
    } catch (error) {
        console.error("Failed to get advice", error);
    } finally {
        setIsLoadingAdvice(false);
    }
  };

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Image Gallery */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden mb-4 relative group">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.originalPrice && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                      Sale
                  </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2">
            <div className="mb-2">
                <span className="text-jade-600 font-bold uppercase tracking-wider text-xs">{product.brand}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-6 gap-4">
               <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} strokeWidth={1} />
                ))}
              </div>
              <span className="text-sm text-gray-500 underline decoration-gray-300 underline-offset-4">{product.reviews} Reviews</span>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
               <span className={`text-2xl font-bold ${product.originalPrice ? 'text-red-600' : 'text-gray-900'}`}>
                  ${product.price.toFixed(2)}
               </span>
               {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
               )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
                {product.description}
            </p>

            {/* AI Stylist Section */}
            <div className="bg-jade-50 rounded-lg p-6 mb-8 border border-jade-100">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-full text-jade-600 shadow-sm mt-1">
                        <Sparkles size={18} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-jade-800 mb-2 text-sm uppercase tracking-wide">Jade Style Assistant</h3>
                        {!styleAdvice && !isLoadingAdvice ? (
                            <div className="text-sm text-jade-700">
                                <p className="mb-3">Wondering how to style this or where to wear it?</p>
                                <button 
                                    onClick={fetchStyleAdvice}
                                    className="text-xs font-bold bg-white px-4 py-2 rounded-full border border-jade-200 hover:bg-jade-600 hover:text-white hover:border-jade-600 transition-colors shadow-sm"
                                >
                                    Get AI Style Advice
                                </button>
                            </div>
                        ) : isLoadingAdvice ? (
                            <div className="flex items-center gap-2 text-sm text-jade-600">
                                <span className="w-4 h-4 border-2 border-jade-600 border-t-transparent rounded-full animate-spin"></span>
                                Consulting the fashion experts...
                            </div>
                        ) : (
                            <div className="text-sm text-jade-800 space-y-2 animate-in fade-in duration-500">
                                <div className="prose prose-sm prose-jade max-w-none">
                                    <pre className="whitespace-pre-wrap font-sans text-sm">{styleAdvice}</pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Selection */}
            {['Women', 'Men', 'Shoes'].includes(product.category) && (
                <div className="mb-8">
                    <label className="block text-sm font-bold text-gray-900 mb-2">Size</label>
                    <div className="flex flex-wrap gap-2">
                        {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-12 h-12 flex items-center justify-center border transition-all ${
                                    selectedSize === size 
                                    ? 'border-jade-600 bg-jade-600 text-white' 
                                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center border border-gray-300 w-32">
                    <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >
                        <Minus size={16} />
                    </button>
                    <div className="flex-1 text-center font-bold text-gray-900">{quantity}</div>
                    <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >
                        <Plus size={16} />
                    </button>
                </div>
                <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-gray-900 text-white h-12 flex items-center justify-center gap-2 font-bold tracking-wide hover:bg-jade-600 transition-colors"
                >
                    <ShoppingBag size={20} /> ADD TO BAG
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <Truck size={16} /> Free shipping on orders over $75
                </div>
                <div className="flex items-center gap-2">
                    <Shield size={16} /> 2-year extended warranty
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
