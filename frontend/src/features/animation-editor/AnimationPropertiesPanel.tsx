import React from 'react';
import type { AnimationPreset } from './defaultAnimations';

export default function AnimationPropertiesPanel({
  preset,
  onChange,
}: {
  preset: AnimationPreset;
  onChange: (next: AnimationPreset) => void;
}) {
  return (
    <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-300">
      <div>
        <p className="text-sm font-bold text-white">Animation</p>
        <p className="text-sm text-slate-400">{preset.title}</p>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">Speed</span>
        <input
          type="range"
          min="0.4"
          max="4"
          step="0.1"
          value={preset.speed}
          onChange={(event) => onChange({ ...preset, speed: Number(event.target.value) })}
          className="w-full accent-indigo-500"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">Color</span>
        <input
          type="color"
          value={preset.color}
          onChange={(event) => onChange({ ...preset, color: event.target.value })}
          className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950"
        />
      </label>
      <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm font-semibold">
        <input
          type="checkbox"
          checked={preset.loop}
          onChange={(event) => onChange({ ...preset, loop: event.target.checked })}
          className="accent-indigo-500"
        />
        Loop
      </label>
    </aside>
  );
}
