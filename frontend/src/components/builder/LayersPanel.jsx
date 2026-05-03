import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Eye, EyeOff, Lock, Trash2, Unlock } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import { CONTAINER_NODE_TYPES } from '../../data/nodeSchema';

const LayerItem = ({ node, depth = 0, collapsed, setCollapsed, editingId, setEditingId }) => {
  const {
    selectedNodeIds,
    selectNodes,
    updateNodeInMap,
    duplicateNodeInMap,
    deleteNodeFromMap,
  } = useBuilderStore();

  const isSelected = selectedNodeIds.includes(node.id);
  const isExpanded = !collapsed[node.id];
  const isContainer = CONTAINER_NODE_TYPES.has(node.type) && (node.children?.length > 0 || depth === 0);

  const toggleCollapse = (e) => {
    e.stopPropagation();
    setCollapsed(prev => ({ ...prev, [node.id]: !prev[node.id] }));
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    if (e.shiftKey) {
      if (isSelected) {
        selectNodes(selectedNodeIds.filter(id => id !== node.id));
      } else {
        selectNodes([...selectedNodeIds, node.id]);
      }
    } else {
      selectNodes([node.id]);
    }
  };

  return (
    <div className="flex flex-col">
      <div 
        className={`group flex items-center h-8 gap-1 px-2 cursor-pointer border-b border-slate-800/50 ${isSelected ? 'bg-indigo-500/20 text-indigo-200' : 'hover:bg-slate-800 text-slate-300'}`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleSelect}
        onDoubleClick={(e) => { e.stopPropagation(); setEditingId(node.id); }}
      >
        <div className="w-4 h-4 flex items-center justify-center shrink-0">
          {isContainer && (
            <button type="button" onClick={toggleCollapse} className="text-slate-500 hover:text-white">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
        </div>
        
        <div className="flex-1 truncate text-[11px] font-bold uppercase tracking-wider">
          {editingId === node.id ? (
            <input
              autoFocus
              value={node.name}
              onChange={(e) => updateNodeInMap(node.id, { name: e.target.value })}
              onBlur={() => setEditingId(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
              onClick={e => e.stopPropagation()}
              className="w-full bg-slate-900 px-1 py-0.5 outline-none text-white border border-indigo-500 rounded"
            />
          ) : (
            node.name || node.type
          )}
        </div>

        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0">
          <button type="button" onClick={(e) => { e.stopPropagation(); updateNodeInMap(node.id, { hidden: !node.hidden }); }} className="text-slate-500 hover:text-white">{node.hidden ? <EyeOff size={12} /> : <Eye size={12} />}</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); updateNodeInMap(node.id, { locked: !node.locked }); }} className="text-slate-500 hover:text-white">{node.locked ? <Lock size={12} /> : <Unlock size={12} />}</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); duplicateNodeInMap(node.id); }} className="text-slate-500 hover:text-white"><Copy size={12} /></button>
          <button type="button" onClick={(e) => { e.stopPropagation(); deleteNodeFromMap(node.id); }} className="text-red-400/70 hover:text-red-400"><Trash2 size={12} /></button>
        </div>
      </div>
      
      {isContainer && isExpanded && node.children?.length > 0 && (
        <div className="flex flex-col">
          {node.children.map(child => (
            <LayerItem 
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
      )}
    </div>
  );
};

export default function LayersPanel() {
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState({});
  const { currentPage, nodeTree } = useBuilderStore();

  const filterTree = (nodes, term) => {
    if (!nodes) return [];
    if (!term) return nodes;
    
    return nodes.filter(node => {
      const match = (node.name || node.type).toLowerCase().includes(term);
      if (match) return true;
      if (node.children?.length) {
        const matchingChildren = filterTree(node.children, term);
        return matchingChildren.length > 0;
      }
      return false;
    });
  };

  const filteredTree = filterTree(nodeTree, query.trim().toLowerCase());

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Page</p>
        <p className="mt-1 text-sm font-black text-white">{currentPage?.name || 'Home'}</p>
      </div>
      
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search layers..."
        className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white outline-none focus:border-indigo-500 transition-colors"
      />
      
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden py-2">
        {filteredTree?.length ? (
          <div className="flex flex-col">
            {filteredTree.map(node => (
              <LayerItem 
                key={node.id} 
                node={node} 
                collapsed={collapsed} 
                setCollapsed={setCollapsed}
                editingId={editingId}
                setEditingId={setEditingId}
              />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs leading-5 text-slate-500">
            {query ? 'No matching layers found.' : 'Blank page. Add elements to build the layer tree.'}
          </div>
        )}
      </div>
    </div>
  );
}
