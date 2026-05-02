import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Lock, Bell, Shield, Palette, Save } from 'lucide-react';

export default function Settings() {
  const { user } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('profile');

  const menu = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'password', label: 'Password & Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Account Settings</h1>
        <p className="text-gray-400">Manage your profile, security, and application preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-1">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSection === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="md:col-span-3">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">
                {menu.find(m => m.id === activeSection)?.label}
              </h3>
            </div>
            
            <div className="p-8 space-y-6">
              {activeSection === 'profile' && (
                <>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-3xl font-bold text-white">
                      {user?.name?.[0] || 'U'}
                    </div>
                    <button className="text-primary font-bold hover:underline">Change Avatar</button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Full Name</label>
                      <input type="text" defaultValue={user?.name || ''} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Email Address</label>
                      <input type="email" defaultValue={user?.email || ''} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Bio</label>
                      <textarea rows="4" placeholder="Tell us about yourself..." className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
                    </div>
                  </div>
                </>
              )}

              {activeSection !== 'profile' && (
                <div className="py-20 text-center">
                  <p className="text-gray-500 italic">Settings for {activeSection} are coming soon.</p>
                </div>
              )}

              <div className="pt-6 border-t border-gray-700 flex justify-end">
                <button className="bg-primary px-8 py-3 rounded-xl text-white font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all">
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
