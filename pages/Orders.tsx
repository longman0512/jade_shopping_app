
import React from 'react';
import { useUser } from '../App';
import { Package, Truck, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Orders: React.FC = () => {
  const { orders, updateOrderStatus } = useUser();
  const navigate = useNavigate();

  if (orders.length === 0) {
      return (
          <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
              <Package size={64} className="text-gray-200 mb-4" />
              <h2 className="text-xl font-medium text-gray-900">No orders yet</h2>
              <button onClick={() => navigate('/shop')} className="mt-4 text-jade-600 hover:underline">Start Shopping</button>
          </div>
      );
  }

  const getStatusStep = (status: string) => {
      if (status === 'Accepted') return 1;
      if (status === 'In Delivery') return 2;
      return 3;
  };

  return (
    <div className="bg-white min-h-screen py-12 px-4 lg:px-8">
      <div className="max-w-[1000px] mx-auto">
        <h1 className="text-3xl font-normal text-gray-900 mb-8 tracking-tight">Your Orders</h1>

        <div className="space-y-8">
            {orders.map(order => (
                <div key={order.id} className="border border-gray-200 rounded-[24px] overflow-hidden bg-white hover:shadow-md transition-shadow">
                    <div className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100">
                        <div>
                            <div className="font-bold text-gray-900">Order #{order.id}</div>
                            <div className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="font-bold text-gray-900">${order.total.toFixed(2)}</div>
                            <div className="text-xs text-gray-500">{order.items.length} items</div>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Tracker */}
                        <div className="mb-8 mt-2">
                             <div className="flex items-center justify-between relative max-w-2xl mx-auto">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-0"></div>
                                <div 
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-jade-500 -z-0 transition-all duration-500"
                                    style={{ width: getStatusStep(order.status) === 1 ? '0%' : getStatusStep(order.status) === 2 ? '50%' : '100%' }}
                                ></div>

                                <div className="flex flex-col items-center gap-2 z-10 bg-white px-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${getStatusStep(order.status) >= 1 ? 'border-jade-500 bg-jade-50 text-jade-600' : 'border-gray-200 bg-white text-gray-300'}`}>
                                        <Package size={14} />
                                    </div>
                                    <span className="text-xs font-medium">Accepted</span>
                                </div>
                                
                                <div className="flex flex-col items-center gap-2 z-10 bg-white px-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${getStatusStep(order.status) >= 2 ? 'border-jade-500 bg-jade-50 text-jade-600' : 'border-gray-200 bg-white text-gray-300'}`}>
                                        <Truck size={14} />
                                    </div>
                                    <span className="text-xs font-medium">In Delivery</span>
                                </div>

                                <div className="flex flex-col items-center gap-2 z-10 bg-white px-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${getStatusStep(order.status) >= 3 ? 'border-jade-500 bg-jade-50 text-jade-600' : 'border-gray-200 bg-white text-gray-300'}`}>
                                        <Check size={14} />
                                    </div>
                                    <span className="text-xs font-medium">Finished</span>
                                </div>
                             </div>
                        </div>

                        {/* Order Items */}
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex-shrink-0 w-24">
                                    <img src={item.image} className="w-24 h-24 object-cover rounded-xl bg-gray-50 mb-2" />
                                    <p className="text-xs truncate">{item.name}</p>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex justify-end gap-3">
                            {order.status === 'Accepted' && (
                                <button 
                                    onClick={() => updateOrderStatus(order.id, 'In Delivery')} 
                                    className="text-sm px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
                                >
                                    Simulate Dispatch
                                </button>
                            )}
                            {order.status === 'In Delivery' && (
                                <button 
                                    onClick={() => updateOrderStatus(order.id, 'Finished')}
                                    className="text-sm px-4 py-2 bg-jade-600 text-white rounded-full hover:bg-jade-700 flex items-center gap-2"
                                >
                                    Confirm Receipt <Check size={14}/>
                                </button>
                            )}
                             <button onClick={() => navigate(`/product/${order.items[0].id}`)} className="text-sm px-4 py-2 text-jade-600 hover:bg-jade-50 rounded-full">
                                Buy Again
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
