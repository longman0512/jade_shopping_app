import React from 'react';
import { Product } from '../types';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { useProductDrawer } from '../App';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProduct } = useProductDrawer();
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/product/${product.id}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    openProduct(product.id);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Wishlist logic would go here
    console.log('Wishlist clicked for', product.id);
  };

  return (
    <div 
      className="group flex flex-col h-full bg-white border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300 rounded-sm relative cursor-pointer overflow-hidden" 
      onClick={handleCardClick}
    >
       {/* Wishlist Button */}
       <button 
         className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
         onClick={handleWishlistClick}
         title="Add to Wishlist"
       >
        <Heart size={18} />
      </button>

      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        {product.originalPrice && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider z-10">
            Sale
          </div>
        )}
        
        {/* Add to Bag Button Overlay */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-0 left-0 w-full bg-white/95 text-gray-900 font-bold py-3 uppercase text-xs tracking-wider translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 flex items-center justify-center gap-2 hover:bg-jade-600 hover:text-white"
        >
          <ShoppingBag size={16} /> Add to Bag
        </button>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="block">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{product.brand}</h3>
            <h2 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-jade-700 transition-colors h-10">
            {product.name}
            </h2>
        </div>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} strokeWidth={1} />
            ))}
          </div>
          <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className={`text-base font-bold ${product.originalPrice ? 'text-red-600' : 'text-gray-900'}`}>
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;