
import React, { useState } from 'react';
import { useUser } from '../App';
import { User, Bell, MapPin, Gift, Copy, Check } from 'lucide-react';

const Profile: React.FC = () => {
  const { settings, updateSettings, addresses } = useUser();
  const [copied, setCopied] = useState(false);
  const referralCode = "JADE-FRIEND-2024";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen py-12 px-4 lg:px-8">
      <div className="max-w-[800px] mx-auto">
        <h1 className="text-3xl font-normal text-gray-900 mb-10 tracking-tight">Account Settings</h1>

        <div className="space-y-8">
            {/* Notifications */}
            <div className="border border-gray-200 rounded-[24px] p-6">
                <h2 className="text-xl font-medium mb-4 flex items-center gap-2"><Bell size={20}/> Notifications</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Email Notifications</span>
                        <input 
                            type="checkbox" 
                            checked={settings.notifications.email} 
                            onChange={e => updateSettings({ notifications: { ...settings.notifications, email: e.target.checked } })}
                            className="w-5 h-5 rounded text-jade-600 focus:ring-jade-500" 
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Push Notifications</span>
                         <input 
                            type="checkbox" 
                            checked={settings.notifications.push} 
                            onChange={e => updateSettings({ notifications: { ...settings.notifications, push: e.target.checked } })}
                            className="w-5 h-5 rounded text-jade-600 focus:ring-jade-500" 
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">In-App Alerts</span>
                         <input 
                            type="checkbox" 
                            checked={settings.notifications.inApp} 
                            onChange={e => updateSettings({ notifications: { ...settings.notifications, inApp: e.target.checked } })}
                            className="w-5 h-5 rounded text-jade-600 focus:ring-jade-500" 
                        />
                    </div>
                </div>
            </div>

            {/* Refer a Friend */}
            <div className="border border-gray-200 rounded-[24px] p-6 bg-gradient-to-r from-jade-50 to-white">
                <h2 className="text-xl font-medium mb-4 flex items-center gap-2"><Gift size={20}/> Refer a Friend</h2>
                <p className="text-gray-600 mb-4">Give your friends 15% off their first order, and get 15% off when they make a purchase.</p>
                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200 w-fit">
                    <code className="text-lg font-bold text-jade-800 px-4">{referralCode}</code>
                    <button onClick={handleCopy} className="p-2 hover:bg-gray-100 rounded-lg">
                        {copied ? <Check size={20} className="text-green-500"/> : <Copy size={20} className="text-gray-500"/>}
                    </button>
                </div>
            </div>

            {/* Address Book */}
            <div className="border border-gray-200 rounded-[24px] p-6">
                <h2 className="text-xl font-medium mb-4 flex items-center gap-2"><MapPin size={20}/> Saved Addresses</h2>
                <div className="space-y-4">
                    {addresses.map(addr => (
                        <div key={addr.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <div>
                                <div className="font-medium">{addr.name} {addr.isDefault && <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600 ml-2">Default</span>}</div>
                                <div className="text-sm text-gray-500">{addr.street}, {addr.city}, {addr.country}</div>
                            </div>
                            <button className="text-sm text-jade-600 hover:underline">Edit</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
