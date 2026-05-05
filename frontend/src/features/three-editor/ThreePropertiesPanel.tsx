import React from 'react';
import type { ThreeScenePreset } from './defaultThreeScene';

export default function ThreePropertiesPanel({ scene }: { scene: ThreeScenePreset }) {
  return (
    <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-300">
      <div>
        <p className="text-sm font-bold text-white">Scene</p>
        <p className="text-sm text-slate-400">{scene.name}</p>
      </div>
      <div>
        <p className="text-sm font-bold text-white">Objects</p>
        <div className="mt-2 space-y-2">
          {scene.objects.map((object) => (
            <div key={object.id} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm">
              {object.name}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
