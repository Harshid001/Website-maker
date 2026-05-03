import {
  BoxSelect,
  Cable,
  Frame,
  Hand,
  Image,
  MessageCircle,
  MousePointer2,
  Rows3,
  Square,
  Type,
} from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

const tools = [
  { id: 'select', label: 'Select', shortcut: 'V', icon: MousePointer2 },
  { id: 'hand', label: 'Hand / Pan', shortcut: 'H', icon: Hand },
  { id: 'frame', label: 'Page frame', shortcut: 'F', icon: Frame },
  { id: 'section', label: 'Section', shortcut: 'S', icon: Rows3 },
  { id: 'container', label: 'Container', shortcut: 'R', icon: BoxSelect },
  { id: 'text', label: 'Text', shortcut: 'T', icon: Type },
  { id: 'image', label: 'Image', shortcut: 'I', icon: Image },
  { id: 'button', label: 'Button', shortcut: 'B', icon: Square },
  { id: 'comment', label: 'Comment', shortcut: 'C', icon: MessageCircle },
  { id: 'prototype', label: 'Prototype connector', shortcut: 'P', icon: Cable },
];

export default function ToolBar() {
  const { activeTool, setActiveTool, showToast } = useBuilderStore();

  const activateTool = (tool) => {
    if (tool.id === 'comment') {
      showToast('Comments are ready as a placeholder for collaborator notes.');
    }
    setActiveTool(tool.id);
  };

  return (
    <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950/80 p-1">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const active = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            type="button"
            title={`${tool.label} (${tool.shortcut})`}
            aria-label={`${tool.label} tool`}
            onClick={() => activateTool(tool)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
              active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Icon size={15} />
          </button>
        );
      })}
    </div>
  );
}
