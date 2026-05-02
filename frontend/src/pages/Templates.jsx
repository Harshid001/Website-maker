import React, { useState } from 'react';
import { websiteTemplates } from '../data/websiteTemplates';
import { designTemplates } from '../data/designTemplates';
import { animationTemplates } from '../data/animationTemplates';
import { modelTemplates } from '../data/modelTemplates';
import { Search, Filter, Grid, List } from 'lucide-react';

export default function Templates() {
  const [activeTab, setActiveTab] = useState('website');
  
  const allTemplates = {
    website: websiteTemplates,
    design2d: designTemplates,
    animation: animationTemplates,
    model3d: modelTemplates,
  };

  const tabs = [
    { id: 'website', label: 'Websites', icon: '🌐' },
    { id: 'design2d', label: '2D Designs', icon: '🎨' },
    { id: 'animation', label: 'Animations', icon: '🎬' },
    { id: 'model3d', label: '3D Models', icon: '🧊' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Template Library</h1>
        <p className="text-gray-400">Choose from hundreds of professional templates to jumpstart your project.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-8">
        <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search templates..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allTemplates[activeTab].map((temp) => (
          <div key={temp.id} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden group hover:border-primary transition-all">
            <div className="aspect-video bg-gray-900 relative overflow-hidden">
              <img src={temp.thumbnail} alt={temp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button className="bg-primary px-6 py-2 rounded-lg text-white font-bold">Use Template</button>
                <button className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg text-white hover:bg-white/20 transition-all">Preview</button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white">{temp.name}</h4>
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 px-2 py-1 bg-gray-900 rounded">{temp.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
