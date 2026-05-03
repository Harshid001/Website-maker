import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import DeviceSwitcher from './DeviceSwitcher';
import ZoomControls from './ZoomControls';

export default function BottomCanvasToolbar() {
  const { history, future, undo, redo } = useBuilderStore();

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/90 backdrop-blur-xl shadow-2xl px-3 py-2 pointer-events-auto">
      
      <DeviceSwitcher />
      
      <div className="h-8 w-px bg-slate-800" />
      
      <ZoomControls />
      
      <div className="h-8 w-px bg-slate-800" />
      
      <div className="flex items-center p-1">
        <button
          type="button"
          title="Undo (Ctrl + Z)"
          aria-label="Undo"
          onClick={undo}
          disabled={!history.length}
          className="h-8 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <Undo2 size={15} />
        </button>
        <button
          type="button"
          title="Redo (Ctrl + Y)"
          aria-label="Redo"
          onClick={redo}
          disabled={!future.length}
          className="h-8 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <Redo2 size={15} />
        </button>
      </div>

    </div>
  );
}
