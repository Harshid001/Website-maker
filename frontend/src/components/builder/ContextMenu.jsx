import {
  BoxSelect,
  Code2,
  Copy,
  Eye,
  EyeOff,
  Layers,
  Lock,
  Pencil,
  Plus,
  SendToBack,
  BringToFront,
  SquareStack,
  Trash2,
  Unlock,
} from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

const MenuItem = ({ icon: Icon, label, onClick, tone = 'default' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors ${
      tone === 'danger' ? 'text-red-200 hover:bg-red-500/15' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={14} />
    {label}
  </button>
);

export default function ContextMenu() {
  const {
    contextMenu,
    closeContextMenu,
    nodesMap,
    selectedNodeIds,
    duplicateNodeInMap,
    deleteNodesFromMap,
    lockNodeInMap,
    hideNodeInMap,
    copyNodesInMap,
    pasteNodesInMap,
    groupNodesInMap,
    ungroupNodeInMap,
    bringToFrontInMap,
    sendToBackInMap,
    showToast,
  } = useBuilderStore();

  if (!contextMenu) return null;
  const position = contextMenu.position || { x: 0, y: 0 };
  const targetId = contextMenu.target?.id || selectedNodeIds[0];
  const targetNode = targetId ? nodesMap[targetId] : null;

  const run = (action) => {
    action?.();
    closeContextMenu();
  };

  return (
    <div
      className="fixed z-[170] w-64 rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-2xl"
      style={{ left: position.x, top: position.y }}
      onContextMenu={(event) => event.preventDefault()}
    >
      <MenuItem icon={Pencil} label="Edit" onClick={() => run(() => showToast('Double click text or use the right inspector to edit.'))} />
      <MenuItem icon={Copy} label="Copy" onClick={() => run(copyNodesInMap)} />
      <MenuItem icon={Plus} label="Paste" onClick={() => run(pasteNodesInMap)} />
      
      {targetId && (
        <>
          <MenuItem icon={SquareStack} label="Duplicate" onClick={() => run(() => duplicateNodeInMap(targetId))} />
          <MenuItem icon={targetNode?.locked ? Unlock : Lock} label={targetNode?.locked ? 'Unlock' : 'Lock'} onClick={() => run(() => lockNodeInMap(targetId))} />
          <MenuItem icon={targetNode?.hidden ? Eye : EyeOff} label={targetNode?.hidden ? 'Show' : 'Hide'} onClick={() => run(() => hideNodeInMap(targetId))} />
          
          <MenuItem icon={BringToFront} label="Bring to front" onClick={() => run(() => bringToFrontInMap(targetId))} />
          <MenuItem icon={SendToBack} label="Send to back" onClick={() => run(() => sendToBackInMap(targetId))} />
        </>
      )}

      {selectedNodeIds.length > 1 && (
        <MenuItem icon={Layers} label="Group" onClick={() => run(() => groupNodesInMap(selectedNodeIds))} />
      )}
      
      {targetNode?.type === 'group' && (
        <MenuItem icon={BoxSelect} label="Ungroup" onClick={() => run(() => ungroupNodeInMap(targetId))} />
      )}
      
      <MenuItem icon={SquareStack} label="Create component" onClick={() => run(() => showToast('Component creation is ready as a placeholder.'))} />
      <MenuItem icon={SquareStack} label="Save as template" onClick={() => run(() => showToast('Saving custom templates is coming soon.'))} />
      
      {targetNode && (
        <MenuItem icon={Code2} label="Inspect node JSON" onClick={() => run(() => {
          navigator.clipboard.writeText(JSON.stringify(targetNode, null, 2));
          showToast('Node JSON copied to clipboard.', 'success');
        })} />
      )}
      
      <div className="my-1 h-px bg-slate-800" />
      <MenuItem icon={Trash2} label="Delete" tone="danger" onClick={() => run(() => deleteNodesFromMap(selectedNodeIds))} />
    </div>
  );
}
