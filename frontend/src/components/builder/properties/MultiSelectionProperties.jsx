import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignStartVertical, AlignCenterVertical, AlignEndVertical, AlignHorizontalDistributeCenter, AlignVerticalDistributeCenter, Group, Trash2 } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';

export default function MultiSelectionProperties() {
  const {
    selectedNodeIds,
    alignNodesInMap,
    distributeNodesInMap,
    groupNodesInMap,
    deleteNodesFromMap,
  } = useBuilderStore();

  if (selectedNodeIds.length < 2) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
          Multiple Selection ({selectedNodeIds.length})
        </h3>
        
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400">Align</span>
            <div className="flex items-center gap-1">
              <button onClick={() => alignNodesInMap('left')} className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white" title="Align Left"><AlignLeft size={16} /></button>
              <button onClick={() => alignNodesInMap('center')} className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white" title="Align Center"><AlignCenter size={16} /></button>
              <button onClick={() => alignNodesInMap('right')} className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white" title="Align Right"><AlignRight size={16} /></button>
              <div className="w-px h-4 bg-slate-700 mx-1" />
              <button onClick={() => alignNodesInMap('top')} className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white" title="Align Top"><AlignStartVertical size={16} /></button>
              <button onClick={() => alignNodesInMap('middle')} className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white" title="Align Middle"><AlignCenterVertical size={16} /></button>
              <button onClick={() => alignNodesInMap('bottom')} className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white" title="Align Bottom"><AlignEndVertical size={16} /></button>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400">Distribute</span>
            <div className="flex items-center gap-1">
              <button onClick={() => distributeNodesInMap('horizontal')} className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white" title="Distribute Horizontal"><AlignHorizontalDistributeCenter size={16} /></button>
              <button onClick={() => distributeNodesInMap('vertical')} className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white" title="Distribute Vertical"><AlignVerticalDistributeCenter size={16} /></button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={() => groupNodesInMap(selectedNodeIds)}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-500/10 px-4 py-2 text-xs font-bold text-indigo-400 hover:bg-indigo-500/20"
          >
            <Group size={14} />
            Group Nodes
          </button>
          
          <button
            onClick={() => deleteNodesFromMap(selectedNodeIds)}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20"
          >
            <Trash2 size={14} />
            Delete Selected
          </button>
        </div>
      </div>
    </div>
  );
}
