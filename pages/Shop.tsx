import React, { useState, useMemo } from 'react';
import { MOCK_PRODUCTS, CATEGORIES } from '../constants';
import ProductCard from '../components/ProductCard';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, ChevronDown } from 'lucide-react';

const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [sortBy, setSortBy] = useState('recommended');

  const filteredProducts = useMemo(() => {
    let products = [...MOCK_PRODUCTS];
    if (categoryParam) {
      products = products.filter(p => p.category.toLowerCase() === categoryParam.toLowerCase());
    }
    
    if (sortBy === 'price-low') products.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') products.sort((a, b) => b.price - a.price);
    
    return products;
  }, [categoryParam, sortBy]);

  const categoryName = categoryParam 
    ? CATEGORIES.find(c => c.slug === categoryParam)?.name 
    : "All Products";

  return (
    <div className="bg-white min-h-screen px-4 lg:px-8 py-8">
        <div className="w-full max-w-[1440px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-normal text-gray-900 tracking-tight">{categoryName}</h1>
                    <p className="text-sm text-gray-500 mt-1">{filteredProducts.length} results</p>
                </div>
                
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                     <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium hover:border-gray-300">
                            Sort by <ChevronDown size={14}/>
                        </button>
                         {/* Dropdown would go here, simplified for now to native select overlay */}
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        >
                            <option value="recommended">Recommended</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                     </div>
                     <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium hover:border-gray-300">
                        Price <ChevronDown size={14}/>
                     </button>
                </div>
            </div>

            {/* Quick Categories Pills */}
            <div className="flex gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
                 <Link to="/shop" className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border ${!categoryParam ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>All</Link>
                 {CATEGORIES.map(cat => (
                     <Link 
                        key={cat.id} 
                        to={`/shop?category=${cat.slug}`}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border ${categoryParam === cat.slug ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                     >
                        {cat.name}
                     </Link>
                 ))}
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="h-full">
                             <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-gray-50 rounded-[32px]">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                    <Link to="/shop" className="text-jade-600 hover:underline">View all items</Link>
                </div>
            )}
        </div>
    </div>
  );
};

export default Shop;