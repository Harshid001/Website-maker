import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CreationCard({ title, description, icon, color, path }) {
  return (
    <Link 
      to={path}
      className="group relative block p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 hover:border-indigo-500 transition-all duration-500 overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] group-hover:scale-110 transition-all duration-700">
        <span className="text-9xl">{icon}</span>
      </div>
      
      <div 
        className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg"
        style={{ backgroundColor: `${color}20`, color, boxShadow: `0 8px 20px -8px ${color}` }}
      >
        {icon}
      </div>
      
      <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">{title}</h3>
      <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">{description}</p>
      
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
        Open {title} <ArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
      </div>
    </Link>
  );
}
