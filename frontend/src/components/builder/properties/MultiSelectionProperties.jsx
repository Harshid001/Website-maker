import { useState } from 'react';
import {
  AlignCenter,
  AlignCenterVertical,
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  AlignLeft,
  AlignRight,
  AlignStartVertical,
  AlignVerticalDistributeCenter,
  ArrowDown,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpToLine,
  Copy,
  EyeOff,
  Group,
  Lock,
  Trash2,
} from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { ColorInput, MiniButton, TextInput } from './PropertyControls';

const safeSelector = (id) => {
  if (window.CSS?.escape) return window.CSS.escape(id);
  return String(id).replace(/["\\]/g, '\\$&');
};

function MixedTextInput({ label, placeholder, onChange }) {
  const [value, setValue] = useState('');
  return (
    <TextInput
      label={label}
      value={value}
      placeholder={placeholder}
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
    />
  );
}

function MixedColorInput({ label, initialValue, onChange }) {
  const [value, setValue] = useState(initialValue);
  return (
    <ColorInput
      label={label}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
    />
  );
}

export default function MultiSelectionProperties() {
  const {
    selectedNodeIds,
    nodesMap,
    alignNodesInMap,
    distributeNodesInMap,
    groupNodesInMap,
    deleteNodesFromMap,
    duplicateSelected,
    lockSelected,
    hideSelected,
    nudgeSelected,
    updateSelectedStyles,
    bringForwardInMap,
    sendBackwardInMap,
    bringToFrontInMap,
    sendToBackInMap,
    showToast,
  } = useBuilderStore();

  if (selectedNodeIds.length < 2) return null;

  const selectedNodes = selectedNodeIds.map((id) => nodesMap[id]).filter(Boolean);
  const sameParent = selectedNodes.every((node) => node.parentId === selectedNodes[0]?.parentId);
  const hasText = selectedNodes.some((node) => ['heading', 'paragraph', 'button', 'navLink', 'footerLink'].includes(node.type));

  const getBoundingBoxes = () => {
    if (!sameParent) {
      showToast('Align and distribute require items inside the same parent.', 'error');
      return null;
    }

    const parentId = selectedNodes[0]?.parentId;
    const parentEl = parentId ? document.querySelector(`[data-node-id="${safeSelector(parentId)}"]`) : null;
    const parentRect = parentEl?.getBoundingClientRect() || document.body.getBoundingClientRect();
    const boxes = {};

    selectedNodeIds.forEach((id) => {
      const el = document.querySelector(`[data-node-id="${safeSelector(id)}"]`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      boxes[id] = {
        x: rect.left - parentRect.left,
        y: rect.top - parentRect.top,
        width: rect.width,
        height: rect.height,
      };
    });

    return Object.keys(boxes).length === selectedNodeIds.length ? boxes : null;
  };

  const align = (direction) => {
    const boxes = getBoundingBoxes();
    if (boxes) alignNodesInMap(direction, boxes);
  };

  const distribute = (direction) => {
    const boxes = getBoundingBoxes();
    if (boxes) distributeNodesInMap(direction, boxes);
  };

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
              <button onClick={() => align('left')} className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white" title="Align Left"><AlignLeft size={16} /></button>
              <button onClick={() => align('center')} className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white" title="Align Center"><AlignCenter size={16} /></button>
              <button onClick={() => align('right')} className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white" title="Align Right"><AlignRight size={16} /></button>
              <div className="w-px h-4 bg-slate-700 mx-1" />
              <button onClick={() => align('top')} className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white" title="Align Top"><AlignStartVertical size={16} /></button>
              <button onClick={() => align('middle')} className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white" title="Align Middle"><AlignCenterVertical size={16} /></button>
              <button onClick={() => align('bottom')} className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white" title="Align Bottom"><AlignEndVertical size={16} /></button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400">Distribute</span>
            <div className="flex items-center gap-1">
              <button onClick={() => distribute('horizontal')} className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white" title="Distribute Horizontal"><AlignHorizontalDistributeCenter size={16} /></button>
              <button onClick={() => distribute('vertical')} className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white" title="Distribute Vertical"><AlignVerticalDistributeCenter size={16} /></button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <span className="mb-2 block text-xs font-semibold text-slate-400">Move selection</span>
          <div className="grid grid-cols-4 gap-2">
            <MiniButton onClick={() => nudgeSelected(-10, 0)} title="Move left"><ArrowLeft size={13} /></MiniButton>
            <MiniButton onClick={() => nudgeSelected(10, 0)} title="Move right"><ArrowRight size={13} /></MiniButton>
            <MiniButton onClick={() => nudgeSelected(0, -10)} title="Move up"><ArrowUp size={13} /></MiniButton>
            <MiniButton onClick={() => nudgeSelected(0, 10)} title="Move down"><ArrowDown size={13} /></MiniButton>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <span className="mb-2 block text-xs font-semibold text-slate-400">Common styles</span>
          <div className="grid grid-cols-2 gap-2">
            <MixedTextInput label="Width" onChange={(value) => updateSelectedStyles({ width: value })} placeholder="240px" />
            <MixedTextInput label="Height" onChange={(value) => updateSelectedStyles({ height: value })} placeholder="120px" />
            <MixedTextInput label="Opacity" onChange={(value) => updateSelectedStyles({ opacity: value })} placeholder="0.85" />
            {hasText && <MixedTextInput label="Font size" onChange={(value) => updateSelectedStyles({ fontSize: value })} placeholder="18px" />}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <MixedColorInput label="Background" initialValue="#ffffff" onChange={(value) => updateSelectedStyles({ backgroundColor: value })} />
            {hasText && <MixedColorInput label="Text color" initialValue="#0f172a" onChange={(value) => updateSelectedStyles({ color: value })} />}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <MiniButton onClick={duplicateSelected}><Copy size={13} className="mr-1 inline" /> Duplicate</MiniButton>
          <MiniButton onClick={lockSelected}><Lock size={13} className="mr-1 inline" /> Lock</MiniButton>
          <MiniButton onClick={hideSelected}><EyeOff size={13} className="mr-1 inline" /> Hide</MiniButton>
          <MiniButton onClick={() => groupNodesInMap(selectedNodeIds)}><Group size={13} className="mr-1 inline" /> Group</MiniButton>
          <MiniButton onClick={() => selectedNodeIds.forEach((id) => bringForwardInMap(id))}><ArrowUp size={13} className="mr-1 inline" /> Forward</MiniButton>
          <MiniButton onClick={() => selectedNodeIds.forEach((id) => sendBackwardInMap(id))}><ArrowDown size={13} className="mr-1 inline" /> Backward</MiniButton>
          <MiniButton onClick={() => selectedNodeIds.forEach((id) => bringToFrontInMap(id))}><ArrowUpToLine size={13} className="mr-1 inline" /> Front</MiniButton>
          <MiniButton onClick={() => selectedNodeIds.forEach((id) => sendToBackInMap(id))}><ArrowDownToLine size={13} className="mr-1 inline" /> Back</MiniButton>
          <MiniButton tone="danger" onClick={() => deleteNodesFromMap(selectedNodeIds)}><Trash2 size={13} className="mr-1 inline" /> Delete</MiniButton>
        </div>
      </div>
    </div>
  );
}
