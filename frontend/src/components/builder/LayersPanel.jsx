import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Eye, EyeOff, Lock, Trash2, Unlock } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

export default function LayersPanel() {
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState({});
  const {
    currentPage,
    selectedSectionId,
    selectedElementId,
    selectSection,
    selectElement,
    updateSection,
    updateElement,
    duplicateSection,
    duplicateElement,
    deleteSection,
    deleteElement,
    moveSection,
  } = useBuilderStore();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Page</p>
        <p className="mt-1 text-sm font-black text-white">{currentPage?.name || 'Home'}</p>
      </div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search layers"
        className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white outline-none focus:border-indigo-500"
      />
      <div className="space-y-3">
        {(currentPage?.sections || [])
          .filter((section) => {
            const term = query.trim().toLowerCase();
            if (!term) return true;
            return section.name?.toLowerCase().includes(term) || (section.elements || []).some((element) => (element.name || element.type).toLowerCase().includes(term));
          })
          .map((section) => (
          <div key={section.id} className={`rounded-2xl border p-3 ${selectedSectionId === section.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950'}`}>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setCollapsed((items) => ({ ...items, [section.id]: !items[section.id] }))} className="text-slate-500 hover:text-white">
                {collapsed[section.id] ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
              <button type="button" onClick={() => selectSection(section.id)} className="flex-1 text-left text-xs font-black uppercase tracking-widest text-white">
                {editingId === section.id ? (
                  <input
                    autoFocus
                    value={section.name}
                    onChange={(event) => updateSection(section.id, { name: event.target.value })}
                    onBlur={() => setEditingId(null)}
                    className="w-full rounded-lg bg-slate-900 px-2 py-1 outline-none"
                  />
                ) : (
                  section.name
                )}
              </button>
              <button type="button" onClick={() => moveSection(section.id, 'up')} className="text-slate-500 hover:text-white"><ChevronUp size={14} /></button>
              <button type="button" onClick={() => moveSection(section.id, 'down')} className="text-slate-500 hover:text-white"><ChevronDown size={14} /></button>
              <button type="button" onClick={() => duplicateSection(section.id)} className="text-slate-500 hover:text-white"><Copy size={14} /></button>
              <button type="button" onClick={() => updateSection(section.id, { hidden: !section.hidden })} className="text-slate-500 hover:text-white">{section.hidden ? <EyeOff size={14} /> : <Eye size={14} />}</button>
              <button type="button" onClick={() => updateSection(section.id, { locked: !section.locked })} className="text-slate-500 hover:text-white">{section.locked ? <Lock size={14} /> : <Unlock size={14} />}</button>
              <button type="button" onClick={() => deleteSection(section.id)} className="text-red-300 hover:text-red-200"><Trash2 size={14} /></button>
            </div>
            <button type="button" onClick={() => setEditingId(section.id)} className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-300">
              Rename
            </button>
            {!collapsed[section.id] && <div className="mt-3 space-y-1 pl-3">
              {(section.elements || []).map((element) => (
                <div key={element.id} className={`flex items-center gap-2 rounded-lg px-2 py-1 ${selectedElementId === element.id ? 'bg-indigo-500/20' : 'bg-slate-900/50'}`}>
                  <button type="button" onClick={() => selectElement(section.id, element.id)} className="flex-1 text-left text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    {element.name || element.type}
                  </button>
                  <button type="button" onClick={() => updateElement(section.id, element.id, { hidden: !element.hidden })} className="text-slate-500 hover:text-white">{element.hidden ? <EyeOff size={12} /> : <Eye size={12} />}</button>
                  <button type="button" onClick={() => updateElement(section.id, element.id, { locked: !element.locked })} className="text-slate-500 hover:text-white">{element.locked ? <Lock size={12} /> : <Unlock size={12} />}</button>
                  <button type="button" onClick={() => duplicateElement(section.id, element.id)} className="text-slate-500 hover:text-white"><Copy size={12} /></button>
                  <button type="button" onClick={() => deleteElement(section.id, element.id)} className="text-red-300 hover:text-red-200"><Trash2 size={12} /></button>
                </div>
              ))}
              {!(section.elements || []).length && <p className="rounded-lg border border-dashed border-slate-800 px-2 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">Empty section</p>}
            </div>}
          </div>
        ))}
      </div>
      {!(currentPage?.sections || []).length && (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-4 text-xs leading-5 text-slate-500">
          Blank page. Add a navbar, section, container, or element to build the layer tree.
        </div>
      )}
    </div>
  );
}
