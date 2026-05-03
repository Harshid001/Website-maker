import React from 'react';
import { Plus } from 'lucide-react';
import { sectionBlocks } from '../../../data/sectionBlocks';
import { useBuilderStore } from '../../../store/builderStore';
import { PanelShell } from './PanelShell';

export default function SectionsPanel() {
  const { addSection } = useBuilderStore();

  const handleDragStart = (type) => (event) => {
    event.dataTransfer.setData('application/shopcraft-builder', JSON.stringify({ dragType: 'new-section', sectionType: type }));
    event.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <PanelShell eyebrow="Blocks" title="Sections / Blocks">
      <div className="space-y-3">
        {sectionBlocks.map((block) => (
          <div key={block.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">{block.category}</p>
            <h3 className="mt-1 text-sm font-black uppercase tracking-widest text-white">{block.name}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-500">{block.preview}</p>
            <button type="button" draggable onDragStart={handleDragStart(block.type)} onClick={() => addSection(block.section)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-500">
              <Plus size={14} />
              Add block
            </button>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}
