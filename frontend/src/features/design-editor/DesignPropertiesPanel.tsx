import React from 'react';
import type { DesignCanvasDocument } from './defaultDesignCanvas';

export default function DesignPropertiesPanel({ canvas }: { canvas: DesignCanvasDocument }) {
  return (
    <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-300">
      <div>
        <p className="text-sm font-bold text-white">Canvas</p>
        <p className="text-sm text-slate-400">
          {canvas.width} x {canvas.height}px
        </p>
      </div>
      <div>
        <p className="text-sm font-bold text-white">Layers</p>
        <div className="mt-2 space-y-2">
          {canvas.elements.map((element) => (
            <div key={element.id} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm">
              {element.text || element.type}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
