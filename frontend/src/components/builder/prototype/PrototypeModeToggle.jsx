import { MousePointer2, Waypoints } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';

export default function PrototypeModeToggle() {
  const { builderMode, setMode } = useBuilderStore();

  return (
    <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-1">
      {[
        { id: 'design', label: 'Design', icon: MousePointer2 },
        { id: 'prototype', label: 'Prototype', icon: Waypoints },
      ].map((mode) => {
        const Icon = mode.icon;
        const active = builderMode === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => setMode(mode.id)}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              active ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-500 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Icon size={14} />
            <span className="hidden xl:inline">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
