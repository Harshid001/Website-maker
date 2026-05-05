import React from 'react';
import { Box, Film, Globe2, Palette } from 'lucide-react';
import { templateTabs } from '../../utils/templateUtils';

const icons = {
  website: Globe2,
  '2d': Palette,
  animation: Film,
  '3d': Box,
};

export default function TemplateTabs({ activeType, counts, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-2">
      {templateTabs.map((tab) => {
        const Icon = icons[tab.id];
        const isActive = activeType === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex min-w-max items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Icon size={17} />
            <span>{tab.label}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-white/15 text-white' : 'bg-slate-800 text-slate-300'}`}>
              {counts[tab.id] || 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
