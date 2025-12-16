import React, { useState, useMemo } from 'react';
import { MOCK_PRODUCTS, CATEGORIES } from '../constants';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
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
    
    if (sortBy === 'price-low') {
        products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
        products.sort((a, b) => b.price - a.price);
    }
    
    return products;
  }, [categoryParam, sortBy]);

  const categoryName = categoryParam 
    ? CATEGORIES.find(c => c.slug === categoryParam)?.name 
    : "All Products";

  return (
    <div className="bg-white pb-20">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 py-12 mb-8">
            <div className="container mx-auto px-4 lg:px-8 text-center">
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">{categoryName}</h1>
                <p className="text-gray-500">{filteredProducts.length} items found</p>
            </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters (Desktop) */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24 space-y-8">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Categories</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><a href="/shop" className="hover:text-jade-600">All Products</a></li>
                            {CATEGORIES.map(cat => (
                                <li key={cat.id}>
                                    <a href={`/shop?category=${cat.slug}`} className={`hover:text-jade-600 ${categoryParam === cat.slug ? 'text-jade-600 font-bold' : ''}`}>
                                        {cat.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Price</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded border-gray-300 text-jade-600 focus:ring-jade-500" /> Under $50
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded border-gray-300 text-jade-600 focus:ring-jade-500" /> $50 - $100
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded border-gray-300 text-jade-600 focus:ring-jade-500" /> $100 - $200
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded border-gray-300 text-jade-600 focus:ring-jade-500" /> Over $200
                            </label>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-grow">
                {/* Mobile Filters & Sort */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 lg:border-none">
                    <button className="lg:hidden flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Filter size={18} /> Filter
                    </button>

                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
                        <div className="relative">
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-transparent text-sm font-bold text-gray-900 pr-8 pl-2 py-1 focus:outline-none cursor-pointer"
                            >
                                <option value="recommended">Recommended</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="newest">Newest Arrivals</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500 mb-6">Try selecting a different category or clearing your filters.</p>
                        <a href="/shop" className="inline-block px-6 py-2 bg-jade-600 text-white font-bold rounded hover:bg-jade-700 transition">Clear Filters</a>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Shop;
