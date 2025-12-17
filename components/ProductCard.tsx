
import React from 'react';
import { Product } from '../types';
import { Star, Heart, Plus, Camera } from 'lucide-react';
import { useProductDrawer, useUser } from '../App';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProduct } = useProductDrawer();
  const { wishlist, toggleWishlist } = useUser();
  const navigate = useNavigate();

  const isLiked = wishlist.includes(product.id);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/product/${product.id}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    openProduct(product.id);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <div 
      className="group flex flex-col h-full bg-[#f1f3f4] hover:bg-[#ebedef] transition-colors duration-200 rounded-[28px] overflow-hidden cursor-pointer relative"
      onClick={handleCardClick}
    >
      {/* Wishlist Button - Minimal */}
       <button 
         className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all shadow-sm ${
           isLiked 
            ? 'bg-red-50 text-red-500 opacity-100' 
            : 'bg-white text-gray-500 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50'
         }`}
         onClick={handleWishlist}
       >
        <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
      </button>

      {/* VTO Badge */}
      {product.vtoAvailable && (
        <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
            <Camera size={10} /> VTO Available
        </div>
      )}

      {/* Image Area - "Floating" effect */}
      <div className="relative aspect-square w-full p-6 pb-0 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {product.originalPrice && !product.vtoAvailable && (
            <div className="absolute top-4 left-4 bg-jade-100 text-jade-800 text-[10px] font-bold px-2 py-1 rounded-md">
                Sale
            </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 pt-2 flex flex-col flex-grow text-center">
        <h2 className="text-lg font-medium text-gray-900 mb-1 leading-tight">
          {product.name}
        </h2>
        <p className="text-xs text-gray-500 mb-3">{product.brand}</p>
        
        <div className="mt-auto">
             <div className="flex items-center justify-center gap-2 mb-4">
                 <span className={`text-sm font-medium ${product.originalPrice ? 'text-jade-700' : 'text-gray-700'}`}>
                    ${product.price.toFixed(2)}
                 </span>
                 {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                         ${product.originalPrice.toFixed(2)}
                    </span>
                 )}
            </div>
            
            {/* Pill Button */}
            <button
                onClick={handleQuickAdd}
                className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 w-full max-w-[120px] mx-auto bg-white border border-gray-200 hover:bg-jade-50 hover:border-jade-200 text-jade-700 text-xs font-bold py-2 rounded-full flex items-center justify-center gap-1 shadow-sm"
            >
                <Plus size={14} strokeWidth={3} /> Add
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
