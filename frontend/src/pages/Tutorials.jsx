import React from 'react';
import { tutorials, tutorialCategories } from '../data/tutorials';
import TutorialCard from '../components/tutorials/TutorialCard';
import { Search, PlayCircle, BookOpen } from 'lucide-react';

export default function Tutorials() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Learning Center</h1>
        <p className="text-gray-400">Master ShopCraft Studio with our step-by-step guides and video tutorials.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-primary" /> Categories
            </h3>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 rounded-lg bg-primary text-white text-sm font-bold">All Tutorials</button>
              {tutorialCategories.map((cat) => (
                <button key={cat.id} className="w-full text-left px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white text-sm transition-all flex items-center gap-2">
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-2xl text-white">
            <h3 className="font-bold mb-2">Need Expert Help?</h3>
            <p className="text-xs opacity-80 mb-4">Join our community Discord or contact our support team.</p>
            <button className="w-full bg-white text-primary py-2 rounded-lg text-sm font-bold">Contact Support</button>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="What do you want to learn today?" 
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
