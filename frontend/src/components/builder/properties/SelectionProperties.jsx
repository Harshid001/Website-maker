import React from 'react';
import { Copy, Eye, EyeOff, Lock, Trash2, Unlock } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { MiniButton, PropertyGroup, TextInput } from './PropertyControls';

export default function SelectionProperties() {
  const {
    getSelectedNode,
    currentPage,
    renamePage,
    updateNodeInMap,
    duplicateNodeInMap,
    deleteNodeFromMap,
    lockNodeInMap,
    hideNodeInMap,
    project,
  } = useBuilderStore();

  const node = getSelectedNode;
  const isPage = !node && currentPage;

  const updateName = (name) => {
    if (node) updateNodeInMap(node.id, { name });
    else if (currentPage) renamePage(currentPage.id, name);
  };

  const name = node?.name || currentPage?.name || project?.name || '';
  const kind = node ? 'Node' : 'Page';
  const typeLabel = node?.type || 'Page Frame';

  return (
    <PropertyGroup title="Selection">
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">{kind}</p>
        <p className="mt-1 text-sm font-black uppercase tracking-widest text-white">{typeLabel}</p>
      </div>
      <TextInput label="Name" value={name} onChange={updateName} />
      {node && (
        <div className="grid grid-cols-2 gap-2">
          <MiniButton onClick={() => duplicateNodeInMap(node.id)}><Copy size={13} className="mr-1 inline" /> Duplicate</MiniButton>
          <MiniButton tone="danger" onClick={() => deleteNodeFromMap(node.id)}><Trash2 size={13} className="mr-1 inline" /> Delete</MiniButton>
          <MiniButton onClick={() => lockNodeInMap(node.id)}>{node.locked ? <Unlock size={13} className="mr-1 inline" /> : <Lock size={13} className="mr-1 inline" />} {node.locked ? 'Unlock' : 'Lock'}</MiniButton>
          <MiniButton onClick={() => hideNodeInMap(node.id)}>{node.hidden ? <Eye size={13} className="mr-1 inline" /> : <EyeOff size={13} className="mr-1 inline" />} {node.hidden ? 'Show' : 'Hide'}</MiniButton>
        </div>
      )}
    </PropertyGroup>
  );
}
