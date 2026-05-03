import React from 'react';
import {
  Box,
  Brain,
  Component,
  Film,
  GraduationCap,
  Image,
  Layers,
  LayoutGrid,
  Palette,
  Plug,
  Settings,
  Sparkles,
  SquareStack,
  Type,
  Wand2,
} from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

export const leftTools = [
  { id: 'layers', label: 'Layers', icon: Layers },
  { id: 'add', label: 'Insert', icon: Wand2 },
  { id: 'pages', label: 'Pages & Routing', icon: Film },
  { id: 'media', label: 'Assets', icon: Image },
  { id: 'components', label: 'Components', icon: Component },
  { id: 'templates', label: 'Templates', icon: SquareStack },
  { id: 'ai', label: 'AI Create', icon: Sparkles },
  { id: 'sections', label: 'Sections / Blocks', icon: LayoutGrid },
  { id: 'theme', label: 'Theme / Style Kit', icon: Palette },
  { id: 'text', label: 'Text Tool', icon: Type },
  { id: 'settings', label: 'Builder Settings', icon: Settings },
  { id: 'animation', label: 'Animation', icon: Brain },
  { id: 'elements3d', label: '3D Elements', icon: Box },
  { id: 'design2d', label: '2D Design Tools', icon: SquareStack },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'tutorials', label: 'Tutorials', icon: GraduationCap },
];

export default function LeftSidebar() {
  const { activeLeftTool, setActiveLeftTool } = useBuilderStore();

  return (
    <aside className="w-[72px] bg-slate-900 border-r border-slate-800 flex flex-col items-center gap-2 py-4 shrink-0 overflow-y-auto custom-scrollbar">
      {leftTools.map((tool) => {
        const Icon = tool.icon;
        const active = activeLeftTool === tool.id;
        return (
          <button
            key={tool.id}
            type="button"
            title={tool.label}
            onClick={() => setActiveLeftTool(tool.id)}
            className={`group relative h-11 w-11 rounded-xl flex items-center justify-center transition-all ${
              active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Icon size={19} />
            <span className="pointer-events-none absolute left-full ml-3 rounded-lg bg-slate-950 border border-slate-800 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 whitespace-nowrap z-[90]">
              {tool.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
