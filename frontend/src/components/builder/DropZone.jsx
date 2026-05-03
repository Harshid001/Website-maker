import React from 'react';
import { Plus } from 'lucide-react';

export default function DropZone({ label = 'Drop here', active = false, onDragOver, onDrop }) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`my-2 flex h-12 items-center justify-center rounded-2xl border border-dashed transition-all ${
        active
          ? 'border-indigo-400 bg-indigo-500/15 text-indigo-100'
          : 'border-transparent bg-transparent text-transparent hover:border-indigo-300/40 hover:bg-indigo-500/5 hover:text-indigo-200'
      }`}
    >
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
        <Plus size={14} />
        {label}
      </div>
    </div>
  );
}
