import * as LucideIcons from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import { leftPanelTools } from '../../data/builderTools';

export default function LeftSidebar() {
  const { activeLeftTool, setActiveLeftTool } = useBuilderStore();

  return (
    <aside className="w-[72px] bg-slate-900 border-r border-slate-800 flex flex-col items-center gap-2 py-4 shrink-0 overflow-y-auto custom-scrollbar">
      {leftPanelTools.map((tool) => {
        const Icon = LucideIcons[tool.icon] || LucideIcons.Circle;
        const active = activeLeftTool === tool.id;
        return (
          <button
            key={tool.id}
            type="button"
            title={`${tool.name} - ${tool.description}`}
            onClick={() => setActiveLeftTool(tool.id)}
            className={`group relative h-11 w-11 rounded-xl flex items-center justify-center transition-all ${
              active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Icon size={19} />
            <span className="pointer-events-none absolute left-full ml-3 rounded-lg bg-slate-950 border border-slate-800 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 whitespace-nowrap z-[90]">
              {tool.name}
            </span>
            {tool.status !== 'working' && (
              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
            )}
          </button>
        );
      })}
    </aside>
  );
}
