import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock3, Eye, Maximize2, Minimize2, MoreHorizontal, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Redo2, Rocket, Save, Undo2 } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import PrototypeModeToggle from './prototype/PrototypeModeToggle';
import ToolBar from './ToolBar';

const formatTime = (value) => {
  if (!value) return 'Not saved yet';
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
};

export default function BuilderTopBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    project,
    currentPage,
    history,
    future,
    isSaving,
    lastSavedAt,
    saveProject,
    publishProject,
    showToast,
    leftPanelCollapsed,
    rightPanelCollapsed,
    fullscreenCanvas,
    setLeftPanelCollapsed,
    setRightPanelCollapsed,
    setFullscreenCanvas,
  } = useBuilderStore();

  const handlePreview = async () => {
    const saved = await saveProject();
    if (saved) navigate(`/preview/${saved.id}`);
  };

  const handlePublish = async () => {
    const published = await publishProject();
    if (published) navigate(`/site/${published.slug}`);
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 lg:px-6 shrink-0 z-50">
      <div className="flex items-center gap-4 min-w-0">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={18} />
          <span className="hidden md:inline text-[10px] font-black uppercase tracking-[0.18em]">Back to Dashboard</span>
        </Link>
        <div className="h-7 w-px bg-slate-800 hidden md:block" />
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">
            <Clock3 size={11} />
            <span>{isSaving ? 'Saving...' : `Saved ${formatTime(lastSavedAt)}`}</span>
          </div>
          <h1 className="truncate text-sm font-black uppercase tracking-widest text-white">{project?.name || 'Website Builder'} <span className="text-slate-500">/ {currentPage?.name || 'Home'}</span></h1>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto px-2 custom-scrollbar">
        <PrototypeModeToggle />
        <ToolBar />
        <div className="h-7 w-px bg-slate-800" />
        <button
          type="button"
          title={leftPanelCollapsed ? 'Open left tool panel' : 'Collapse left tool panel'}
          aria-label={leftPanelCollapsed ? 'Open left tool panel' : 'Collapse left tool panel'}
          onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
          className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {leftPanelCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
        <button
          type="button"
          title={rightPanelCollapsed ? 'Open right properties panel' : 'Collapse right properties panel'}
          aria-label={rightPanelCollapsed ? 'Open right properties panel' : 'Collapse right properties panel'}
          onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
          className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {rightPanelCollapsed ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />}
        </button>
        <button
          type="button"
          title={fullscreenCanvas ? 'Exit fullscreen canvas' : 'Fullscreen canvas'}
          aria-label={fullscreenCanvas ? 'Exit fullscreen canvas' : 'Fullscreen canvas'}
          onClick={() => setFullscreenCanvas(!fullscreenCanvas)}
          className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {fullscreenCanvas ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Save"
          onClick={saveProject}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.16em] text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
        >
          <Save size={15} />
          <span className="hidden sm:inline">Save</span>
        </button>
        <button
          type="button"
          aria-label="Preview"
          onClick={handlePreview}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.16em] text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
        >
          <Eye size={15} />
          <span className="hidden sm:inline">Preview</span>
        </button>
        <button
          type="button"
          aria-label="Publish"
          onClick={handlePublish}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.16em] text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Rocket size={15} />
          <span className="hidden sm:inline">Publish</span>
        </button>
        <div className="relative">
          <button
            type="button"
            title="More options"
            onClick={() => setMenuOpen((open) => !open)}
            className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <MoreHorizontal size={18} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-11 w-56 rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-2xl">
              {['Export website', 'Version history', 'Connect domain', 'Open settings'].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    showToast(`${label} is ready as a structured placeholder.`);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
