import React from 'react';

const tools = ['Select', 'Text', 'Rectangle', 'Image', 'Layer'];

export default function DesignToolbar({ onSelectTool }: { onSelectTool?: (tool: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-3">
      {tools.map((tool) => (
        <button
          key={tool}
          type="button"
          onClick={() => onSelectTool?.(tool)}
          className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white"
        >
          {tool}
        </button>
      ))}
    </div>
  );
}
