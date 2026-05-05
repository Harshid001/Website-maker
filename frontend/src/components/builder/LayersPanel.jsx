import { useState } from 'react';
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Box,
  ChevronDown,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
  Image,
  LayoutPanelTop,
  Link2,
  Lock,
  MousePointerClick,
  PanelTop,
  Search,
  Square,
  Trash2,
  Type,
  Unlock,
} from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import { CONTAINER_NODE_TYPES, NODE_TYPES } from '../../data/nodeSchema';

const sectionTitle = (node) => {
  const label = (node?.name || node?.type || 'Section').trim();
  if (node?.type === NODE_TYPES.NAVBAR) return 'NAVBAR';
  if (node?.type === NODE_TYPES.FOOTER) return 'FOOTER SECTION';
  if (/hero/i.test(label)) return 'HERO SECTION';
  if (/service/i.test(label)) return 'SERVICES SECTION';
  return label.toUpperCase();
};

const iconForNode = (node) => {
  if (!node) return Square;
  if (node.type === NODE_TYPES.NAVBAR) return PanelTop;
  if (node.type === NODE_TYPES.FOOTER || node.parentId === null) return LayoutPanelTop;
  if (node.type === NODE_TYPES.SECTION) return LayoutPanelTop;
  if (node.type === NODE_TYPES.HEADING || node.type === NODE_TYPES.PARAGRAPH) return Type;
  if (node.type === NODE_TYPES.BUTTON) return MousePointerClick;
  if (node.type === NODE_TYPES.IMAGE || node.type === NODE_TYPES.GALLERY) return Image;
  if (node.type === NODE_TYPES.CARD || node.type?.toLowerCase().includes('card')) return Box;
  if (node.type === NODE_TYPES.SOCIAL_LINKS || node.type === 'link') return Link2;
  if (CONTAINER_NODE_TYPES.has(node.type)) return Square;
  return FileText;
};

const nodeMatches = (node, nodesMap, term) => {
  if (!term) return true;
  const label = `${node?.name || ''} ${node?.type || ''} ${node?.content || ''}`.toLowerCase();
  if (label.includes(term)) return true;
  return (node?.children || []).some((childId) => nodeMatches(nodesMap[childId], nodesMap, term));
};

const ActionButton = ({ title, onClick, children, danger = false }) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    onClick={(event) => {
      event.stopPropagation();
      onClick?.();
    }}
    className={`grid h-6 w-6 place-items-center rounded-md transition-colors ${
      danger ? 'text-red-300 hover:bg-red-500/15 hover:text-red-200' : 'text-slate-500 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {children}
  </button>
);

function LayerRow({ node, depth = 0, sectionHeader = false, collapsed, setCollapsed, editingId, setEditingId }) {
  const {
    nodesMap,
    selectedNodeIds,
    selectNodes,
    updateNodeInMap,
    duplicateNodeInMap,
    deleteNodeFromMap,
    lockNodeInMap,
    hideNodeInMap,
  } = useBuilderStore();

  const children = (node.children || []).map((id) => nodesMap[id]).filter(Boolean);
  const isContainer = CONTAINER_NODE_TYPES.has(node.type) && children.length > 0;
  const isExpanded = !collapsed[node.id];
  const isSelected = selectedNodeIds.includes(node.id);
  const Icon = iconForNode(node);
  const sortable = useSortable({
    id: node.id,
    data: { type: 'layer-node', nodeId: node.id, parentId: node.parentId },
    disabled: node.locked,
  });

  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };

  const selectRow = (event) => {
    event.stopPropagation();
    if (event.shiftKey) {
      selectNodes(isSelected ? selectedNodeIds.filter((id) => id !== node.id) : [...selectedNodeIds, node.id]);
    } else {
      selectNodes([node.id]);
    }
  };

  const toggleCollapse = (event) => {
    event.stopPropagation();
    setCollapsed((items) => ({ ...items, [node.id]: !items[node.id] }));
  };

  const rowLabel = sectionHeader ? sectionTitle(node) : node.name || node.type;

  return (
    <div ref={sortable.setNodeRef} style={style} className={sortable.isDragging ? 'opacity-50' : ''}>
      <div
        role="button"
        tabIndex={0}
        onClick={selectRow}
        onDoubleClick={(event) => {
          event.stopPropagation();
          setEditingId(node.id);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') selectRow(event);
        }}
        className={`group flex min-h-9 items-center gap-1.5 rounded-xl border px-2 transition-all ${
          isSelected
            ? 'border-indigo-500/70 bg-indigo-500/15 text-indigo-100 shadow-sm shadow-indigo-950/40'
            : sectionHeader
              ? 'border-slate-800 bg-slate-900/90 text-slate-200 hover:border-slate-700 hover:bg-slate-800/70'
              : 'border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900 hover:text-white'
        }`}
        style={{ paddingLeft: `${sectionHeader ? 8 : depth * 14 + 8}px` }}
      >
        <button
          type="button"
          className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-slate-800 hover:text-white"
          onClick={isContainer ? toggleCollapse : (event) => event.stopPropagation()}
          aria-label={isExpanded ? 'Collapse layer' : 'Expand layer'}
        >
          {isContainer ? (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />}
        </button>

        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg ${sectionHeader ? 'bg-indigo-500/15 text-indigo-300' : 'bg-slate-950 text-slate-500'}`}>
          <Icon size={14} />
        </span>

        <div className="min-w-0 flex-1">
          {editingId === node.id ? (
            <input
              autoFocus
              value={node.name || ''}
              onChange={(event) => updateNodeInMap(node.id, { name: event.target.value })}
              onBlur={() => setEditingId(null)}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === 'Escape') setEditingId(null);
              }}
              className="w-full rounded-md border border-indigo-500 bg-slate-950 px-2 py-1 text-[11px] font-bold text-white outline-none"
            />
          ) : (
            <>
              <p className={`truncate ${sectionHeader ? 'text-[10px] font-black uppercase tracking-[0.18em]' : 'text-[11px] font-bold'}`}>{rowLabel}</p>
              {!sectionHeader && <p className="truncate text-[9px] font-bold uppercase tracking-widest text-slate-600">{node.type}</p>}
            </>
          )}
        </div>

        <button
          type="button"
          {...sortable.attributes}
          {...sortable.listeners}
          onClick={(event) => event.stopPropagation()}
          className="grid h-6 w-5 shrink-0 place-items-center rounded-md text-slate-600 opacity-0 transition-opacity hover:bg-slate-800 hover:text-white group-hover:opacity-100"
          title="Drag layer"
          aria-label="Drag layer"
        >
          <GripVertical size={13} />
        </button>

        <div className="hidden shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:flex group-hover:opacity-100">
          <ActionButton title={node.hidden ? 'Show' : 'Hide'} onClick={() => hideNodeInMap(node.id)}>
            {node.hidden ? <EyeOff size={12} /> : <Eye size={12} />}
          </ActionButton>
          <ActionButton title={node.locked ? 'Unlock' : 'Lock'} onClick={() => lockNodeInMap(node.id)}>
            {node.locked ? <Lock size={12} /> : <Unlock size={12} />}
          </ActionButton>
          <ActionButton title="Duplicate" onClick={() => duplicateNodeInMap(node.id)}>
            <Copy size={12} />
          </ActionButton>
          <ActionButton title="Delete" danger onClick={() => deleteNodeFromMap(node.id)}>
            <Trash2 size={12} />
          </ActionButton>
        </div>
      </div>

      {!sectionHeader && isContainer && isExpanded && (
        <SortableContext items={children.map((child) => child.id)} strategy={verticalListSortingStrategy}>
          <div className="mt-1 space-y-1">
            {children.map((child) => (
              <LayerRow
                key={child.id}
                node={child}
                depth={depth + 1}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                editingId={editingId}
                setEditingId={setEditingId}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}

function SectionGroup({ section, collapsed, setCollapsed, editingId, setEditingId }) {
  const { nodesMap } = useBuilderStore();
  const children = (section.children || []).map((id) => nodesMap[id]).filter(Boolean);
  const isExpanded = !collapsed[section.id];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-2">
      <LayerRow
        node={section}
        sectionHeader
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        editingId={editingId}
        setEditingId={setEditingId}
      />
      {isExpanded && (
        <SortableContext items={children.map((child) => child.id)} strategy={verticalListSortingStrategy}>
          <div className="mt-2 space-y-1 border-l border-slate-800/80 pl-2">
            {children.length ? (
              children.map((child) => (
                <LayerRow
                  key={child.id}
                  node={child}
                  depth={1}
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                  editingId={editingId}
                  setEditingId={setEditingId}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-800 px-3 py-3 text-[11px] font-bold text-slate-600">
                Empty section
              </div>
            )}
          </div>
        </SortableContext>
      )}
    </section>
  );
}

function LayerPanel() {
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState({});
  const { currentPage, currentPageNodes, nodesMap, selectNodes, moveNodeInMap, showToast } = useBuilderStore();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const term = query.trim().toLowerCase();
  const sections = currentPageNodes.filter((node) => nodeMatches(node, nodesMap, term));

  const handleDragEnd = ({ active, over }) => {
    if (!active?.id || !over?.id || active.id === over.id) return;
    const activeNode = nodesMap[active.id];
    const overNode = nodesMap[over.id];
    if (!activeNode || !overNode) return;
    if (activeNode.parentId !== overNode.parentId) {
      showToast('Drag layers within the same section or parent.', 'error');
      return;
    }
    const parent = nodesMap[activeNode.parentId];
    const targetIndex = parent?.children?.indexOf(overNode.id) ?? -1;
    if (targetIndex < 0) return;
    moveNodeInMap(activeNode.id, activeNode.parentId, targetIndex);
  };

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => currentPage?.id && selectNodes([currentPage.id])}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && currentPage?.id) selectNodes([currentPage.id]);
        }}
        className="rounded-2xl border border-slate-800 bg-slate-950 p-4 hover:border-indigo-500/50"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Page</p>
        <p className="mt-1 text-sm font-black text-white">{currentPage?.name || 'Home'}</p>
      </div>

      <label className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2.5 focus-within:border-indigo-500">
        <Search size={15} className="text-slate-600" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search sections and layers..."
          className="min-w-0 flex-1 bg-transparent text-xs font-bold text-white outline-none placeholder:text-slate-600"
        />
      </label>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sections.length ? (
              sections.map((section) => (
                <SectionGroup
                  key={section.id}
                  section={section}
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                  editingId={editingId}
                  setEditingId={setEditingId}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-6 text-center text-xs leading-5 text-slate-500">
                {query ? 'No matching layers found.' : 'Blank page. Add Navbar, Hero, Services, or any new section.'}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default function LayersPanel() {
  return <LayerPanel />;
}
