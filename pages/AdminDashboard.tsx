
import React from 'react';
import { BarChart, Map, ShoppingCart, Users, TrendingUp, DollarSign } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="bg-[#f8f9fa] min-h-screen py-12 px-4 lg:px-8 font-sans">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <span className="text-sm text-gray-500">Last 30 Days</span>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
                { label: 'Total Sales', value: '$124,500', change: '+12%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
                { label: 'Conversion Rate', value: '3.2%', change: '+0.4%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
                { label: 'Abandoned Carts', value: '245', change: '-5%', icon: ShoppingCart, color: 'text-red-600', bg: 'bg-red-100' },
                { label: 'Active Users', value: '1,200', change: '+8%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
            ].map((metric, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${metric.bg} ${metric.color}`}>
                            <metric.icon size={20} />
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${metric.change.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {metric.change}
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
                    <p className="text-sm text-gray-500">{metric.label}</p>
                </div>
            ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Sales by Location */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><Map size={18}/> Sales by Location</h3>
                <div className="space-y-4">
                    {[
                        { city: 'New York', amount: '$45,000', percent: '45%' },
                        { city: 'Los Angeles', amount: '$32,000', percent: '32%' },
                        { city: 'Chicago', amount: '$15,000', percent: '15%' },
                        { city: 'Miami', amount: '$8,000', percent: '8%' },
                    ].map((loc, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">{loc.city}</span>
                                <span className="text-gray-500">{loc.amount}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-jade-500 rounded-full" style={{ width: loc.percent }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><BarChart size={18}/> Top Performing Products</h3>
                <div className="space-y-4">
                     {[
                        { name: 'Cashmere Turtleneck', sales: 450 },
                        { name: 'Advanced Night Repair', sales: 380 },
                        { name: 'KitchenAid Mixer', sales: 210 },
                        { name: 'Leather Bag', sales: 150 },
                    ].map((prod, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <span className="font-bold text-gray-300 w-4">#{i+1}</span>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">{prod.name}</div>
                                <div className="text-xs text-gray-500">{prod.sales} sold</div>
                            </div>
                            <div className="h-1.5 w-24 bg-gray-100 rounded-full">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(prod.sales / 500) * 100}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
