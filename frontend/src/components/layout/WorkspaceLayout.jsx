import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Save, 
  Eye, 
  Rocket, 
  Download,
  MoreHorizontal
} from 'lucide-react';

export default function WorkspaceLayout({ 
  children, 
  projectName = "Untitled Project",
  onSave,
  onPreview,
  onPublish,
  leftPanel,
  rightPanel
}) {
  return (
    <div className="h-screen w-full flex flex-col bg-slate-950 text-slate-200 overflow-hidden">
      {/* Top Minimal Editor Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex justify-between items-center px-6 shrink-0 z-50">
        <div className="flex items-center gap-6">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-[0.2em] hidden md:block">Back to Dashboard</span>
          </Link>
          
          <div className="h-6 w-px bg-slate-800 hidden md:block" />
          
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-0.5">Editing</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-white leading-none">{projectName}</span>
              <button className="text-slate-600 hover:text-white transition-colors">
                <MoreHorizontal size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Save size={16} /> <span className="hidden sm:inline">Save</span>
          </button>
          
          <button 
            onClick={onPreview}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Eye size={16} /> <span className="hidden sm:inline">Preview</span>
          </button>

          <div className="h-6 w-px bg-slate-800 mx-2" />

          <button 
            onClick={onPublish}
            className="flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Rocket size={16} /> 
            <span className="hidden sm:inline">Publish</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        <aside className="w-16 md:w-20 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-6 shrink-0 overflow-y-auto custom-scrollbar">
          {leftPanel}
        </aside>

        {/* Center - Main Canvas/Design Area */}
        <main className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden p-4 md:p-8">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
          />
          <div className="w-full h-full relative z-10 flex items-center justify-center">
            {children}
          </div>
        </main>

        {/* Right Sidebar - Properties/Settings */}
        <aside className="w-64 md:w-80 bg-slate-900 border-l border-slate-800 shrink-0 overflow-y-auto custom-scrollbar hidden lg:block">
          {rightPanel}
        </aside>
      </div>
    </div>
  );
}
