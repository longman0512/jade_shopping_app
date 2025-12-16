import React from 'react';
import { Product } from '../types';
import { Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group flex flex-col h-full bg-white border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300 rounded-sm relative">
       {/* Wishlist Button */}
       <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
        <Heart size={18} />
      </button>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="relative overflow-hidden aspect-[3/4] bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        {product.originalPrice && (
          <div className="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
            Sale
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{product.brand}</h3>
            <h2 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-jade-700 transition-colors h-10">
            {product.name}
            </h2>
        </Link>
        
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
