
import React from 'react';
import { useUser } from '../App';
import { MOCK_PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Wishlist: React.FC = () => {
  const { wishlist } = useUser();
  const navigate = useNavigate();
  
  const products = MOCK_PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div className="bg-white min-h-screen py-12 px-4 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-3xl font-normal text-gray-900 mb-8 tracking-tight flex items-center gap-3">
            <Heart className="text-red-500 fill-red-500"/> Wishlist ({products.length})
        </h1>

        {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <div key={product.id} className="h-full">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        ) : (
            <div className="py-20 text-center bg-gray-50 rounded-[32px]">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 mb-6">Save items you love to find them easily later.</p>
                <button onClick={() => navigate('/shop')} className="bg-white border border-gray-300 px-6 py-2 rounded-full hover:bg-gray-100">Explore Products</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
