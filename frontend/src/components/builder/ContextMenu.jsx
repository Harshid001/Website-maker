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
    duplicateSelected,
    deleteSelected,
    lockSelected,
    hideSelected,
    copySelected,
    pasteSelected,
    groupSelected,
    ungroupSelected,
    startConnection,
    selectedItem,
    currentPage,
    showToast,
  } = useBuilderStore();

  if (!contextMenu) return null;
  const position = contextMenu.position || { x: 0, y: 0 };

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
      <MenuItem icon={Copy} label="Copy" onClick={() => run(copySelected)} />
      <MenuItem icon={Plus} label="Paste" onClick={() => run(pasteSelected)} />
      <MenuItem icon={SquareStack} label="Duplicate" onClick={() => run(duplicateSelected)} />
      <MenuItem icon={selectedItem?.locked ? Unlock : Lock} label={selectedItem?.locked ? 'Unlock' : 'Lock'} onClick={() => run(lockSelected)} />
      <MenuItem icon={selectedItem?.hidden ? Eye : EyeOff} label={selectedItem?.hidden ? 'Show' : 'Hide'} onClick={() => run(hideSelected)} />
      <MenuItem icon={Layers} label="Group" onClick={() => run(groupSelected)} />
      <MenuItem icon={BoxSelect} label="Ungroup" onClick={() => run(ungroupSelected)} />
      <MenuItem icon={SendToBack} label="Bring to front" onClick={() => run(() => showToast('Layer ordering is controlled from Layers and the floating toolbar.'))} />
      <MenuItem icon={SendToBack} label="Send to back" onClick={() => run(() => showToast('Layer ordering is controlled from Layers and the floating toolbar.'))} />
      <MenuItem icon={Plus} label="Add interaction" onClick={() => run(() => selectedItem ? startConnection(selectedItem.id, currentPage?.id) : showToast('Select a node before adding an interaction.', 'error'))} />
      <MenuItem icon={SquareStack} label="Create component" onClick={() => run(() => showToast('Component creation is ready as a placeholder.'))} />
      <MenuItem icon={SquareStack} label="Save as section template" onClick={() => run(() => showToast('Saving custom section templates is coming soon.'))} />
      <MenuItem icon={Code2} label="Inspect node JSON" onClick={() => run(() => showToast(JSON.stringify(selectedItem || {}, null, 2).slice(0, 220)))} />
      <div className="my-1 h-px bg-slate-800" />
      <MenuItem icon={Trash2} label="Delete" tone="danger" onClick={() => run(deleteSelected)} />
    </div>
  );
}
