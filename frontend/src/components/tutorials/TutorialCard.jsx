import React from 'react';
import { Play, Clock, ChevronRight } from 'lucide-react';

export default function TutorialCard({ tutorial }) {
  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden hover:border-gray-500 transition-all group flex flex-col h-full">
      <div className="aspect-video relative overflow-hidden">
        <img src={tutorial.thumbnail} alt={tutorial.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
            <Play fill="currentColor" size={24} />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-bold flex items-center gap-1">
          <Clock size={10} /> {tutorial.duration}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-primary">{tutorial.category}</span>
        </div>
        <h4 className="text-lg font-bold text-white mb-2 leading-tight">{tutorial.title}</h4>
        <p className="text-gray-400 text-sm mb-6 line-clamp-2">{tutorial.description}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-gray-500">{tutorial.steps.length} Steps</span>
          <button className="text-primary hover:text-white transition-colors flex items-center gap-1 text-sm font-bold">
            Start Learning <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
