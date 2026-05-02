import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Eye, Rocket, Share2 } from 'lucide-react';

export default function EditorHeader({ projectName = 'Untitled Project' }) {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-50">
      {/* Left: Back & Project Name */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center gap-1 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest hidden md:block">Back to Dashboard</span>
        </button>
        <div className="h-6 w-px bg-slate-800"></div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Editing</span>
          <h1 className="text-sm font-bold text-white uppercase tracking-widest">{projectName}</h1>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-widest text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
          <Save size={18} />
          <span className="hidden sm:block">Save</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-widest text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
          <Eye size={18} />
          <span className="hidden sm:block">Preview</span>
        </button>
        <div className="h-6 w-px bg-slate-800 mx-2"></div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
          <Rocket size={18} />
          <span>Publish</span>
        </button>
      </div>
    </header>
  );
}
