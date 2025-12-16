import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../constants';
import { useCart } from '../App';
import { Star, Truck, Shield, Minus, Plus, Sparkles, CheckCircle, Search, ChevronDown, ThumbsUp, ThumbsDown } from 'lucide-react';
import { createChatSession, sendMessageToGemini } from '../services/geminiService';

interface ProductDetailProps {
    productId?: string;
    isSidebar?: boolean;
    onClose?: () => void;
}

const MOCK_REVIEWS = [
  { id: 1, author: "KSE", verified: true, rating: 1, date: "11 hours ago", title: "Did not receive", content: "This was marked out of stock way after I ordered. Very disappointed service.", helpful: 0, unhelpful: 0 },
  { id: 2, author: "SarahM", verified: true, rating: 5, date: "2 days ago", title: "Perfect Summer Staple", content: "I absolutely love this item! The fit is true to size and material feels premium.", helpful: 15, unhelpful: 1 },
];

const ATTRIBUTES = ['Comfort', 'Value', 'Sizing', 'Quality', 'Length'];

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, isSidebar = false, onClose }) => {
  const { id: paramId } = useParams<{ id: string }>();
  const id = productId || paramId;
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  
  const [styleAdvice, setStyleAdvice] = useState<string>('');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [activeAttribute, setActiveAttribute] = useState('Comfort');

  useEffect(() => {
    setQuantity(1);
    setSelectedSize('');
    setStyleAdvice('');
  }, [id]);

  if (!product) return <div className="p-20 text-center">Product not found</div>;

  const handleAddToCart = () => {
    addToCart({ ...product, quantity, selectedSize });
    if (isSidebar && onClose) onClose();
  };

  const fetchStyleAdvice = async () => {
    setIsLoadingAdvice(true);
    try {
        const session = createChatSession();
        const prompt = `Short advice for product "${product.name}" (${product.category}): 1. Style it. 2. Wear it where? 3. Care tip.`;
        const response = await sendMessageToGemini(session, prompt);
        setStyleAdvice(response);
    } catch (error) { console.error(error); } 
    finally { setIsLoadingAdvice(false); }
  };

  return (
    <div className={`bg-white ${isSidebar ? 'pb-24' : 'py-12'}`}>
      <div className={`${isSidebar ? 'px-6 pt-12' : 'container mx-auto px-6 max-w-[1200px]'}`}>
        <div className={`flex flex-col ${isSidebar ? 'gap-8' : 'lg:flex-row gap-16'}`}>
          
          {/* Image - Updated to fill out */}
          <div className={`${isSidebar ? 'w-full' : 'w-full lg:w-1/2'}`}>
            <div className={`bg-[#f1f3f4] rounded-[32px] overflow-hidden relative ${isSidebar ? 'aspect-square' : 'aspect-[4/3] lg:aspect-square'}`}>
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Info */}
          <div className={`${isSidebar ? 'w-full' : 'w-full lg:w-1/2'} flex flex-col`}>
            <div className="mb-2 text-sm text-gray-500 font-medium">{product.brand}</div>
            <h1 className="text-3xl md:text-4xl font-normal text-gray-900 mb-4 tracking-tight leading-tight">{product.name}</h1>
            
            <div className="flex items-center mb-6 gap-2">
               <span className="text-2xl font-normal text-gray-900">${product.price.toFixed(2)}</span>
               {product.originalPrice && <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>}
               
               <div className="ml-auto flex items-center gap-1 bg-jade-50 px-3 py-1 rounded-full">
                  <Star size={14} className="text-jade-700" fill="currentColor" />
                  <span className="text-sm font-bold text-jade-700">{product.rating}</span>
                  <span className="text-xs text-jade-600">({product.reviews})</span>
               </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-sm">{product.description}</p>

            {/* AI Chip */}
            <div className="mb-8">
                {!styleAdvice && !isLoadingAdvice ? (
                    <button onClick={fetchStyleAdvice} className="flex items-center gap-2 text-sm font-medium text-jade-700 bg-jade-50 hover:bg-jade-100 px-4 py-2 rounded-full transition-colors w-fit">
                        <Sparkles size={16} /> Ask AI how to style this
                    </button>
                ) : (
                    <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-700 animate-in fade-in">
                        {isLoadingAdvice ? "Thinking..." : <pre className="whitespace-pre-wrap font-sans">{styleAdvice}</pre>}
                    </div>
                )}
            </div>

            {/* Size */}
            {['Women', 'Men', 'Shoes'].includes(product.category) && (
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-900 mb-3">Size</label>
                    <div className="flex flex-wrap gap-3">
                        {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                                    selectedSize === size ? 'bg-jade-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:border-jade-600'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Sticky Action Footer (Desktop: Inline, Mobile/Sidebar: Sticky Bottom) */}
            <div className={`mt-auto pt-6 border-t border-gray-100 ${isSidebar ? 'fixed bottom-0 left-0 w-full bg-white p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20' : ''}`}>
                <div className="flex gap-4">
                    <div className="flex items-center bg-gray-100 rounded-full px-4 h-12 w-32 justify-between">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:bg-gray-200 rounded-full"><Minus size={16}/></button>
                        <span className="font-medium">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:bg-gray-200 rounded-full"><Plus size={16}/></button>
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        className="flex-1 bg-jade-600 text-white h-12 rounded-full font-medium hover:bg-jade-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                        Add to Bag
                    </button>
                </div>
            </div>
            
            {/* Review Snapshot (Only Full Page) */}
            {!isSidebar && (
                 <div className="mt-24 pt-10 border-t border-gray-100">
                    <h2 className="text-2xl font-normal mb-8">Reviews</h2>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                             <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-5xl font-normal text-gray-900">4.3</span>
                                <div className="flex text-yellow-400"><Star size={20} fill="currentColor" /></div>
                             </div>
                             <div className="flex gap-2 flex-wrap mb-6">
                                {ATTRIBUTES.map(attr => (
                                    <button key={attr} onClick={() => setActiveAttribute(attr)} className={`px-4 py-1.5 rounded-full text-xs font-medium border ${activeAttribute === attr ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600'}`}>
                                        {attr}
                                    </button>
                                ))}
                             </div>
                        </div>
                        <div className="space-y-6">
                            {MOCK_REVIEWS.map(r => (
                                <div key={r.id} className="pb-6 border-b border-gray-100 last:border-0">
                                    <div className="flex justify-between mb-2">
                                        <h4 className="font-bold text-sm">{r.title}</h4>
                                        <span className="text-xs text-gray-400">{r.date}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{r.content}</p>
                                    <div className="flex gap-4 text-xs text-gray-400">
                                        <span>{r.author}</span>
                                        <span className="flex items-center gap-1"><CheckCircle size={12}/> Verified</span>
                                    </div>
                                </div>
                            ))}
                            <button className="text-jade-700 font-medium text-sm hover:underline">Read all 1,120 reviews</button>
                        </div>
                    </div>
                 </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;