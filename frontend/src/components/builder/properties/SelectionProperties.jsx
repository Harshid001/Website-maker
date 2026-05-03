import React from 'react';
import { Copy, Eye, EyeOff, Lock, Trash2, Unlock } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { MiniButton, PropertyGroup, TextInput } from './PropertyControls';

export default function SelectionProperties() {
  const {
    selectedItem,
    selectedKind,
    selectedSectionId,
    selectedElementId,
    selectedSection,
    selectedElement,
    currentPage,
    renamePage,
    updateSection,
    updateElement,
    duplicateSection,
    duplicateElement,
    deleteSection,
    deleteElement,
    project,
    showToast,
  } = useBuilderStore();

  const updateName = (name) => {
    if (selectedElement) updateElement(selectedSectionId, selectedElementId, { name });
    else if (selectedSection) updateSection(selectedSectionId, { name });
    else if (currentPage) renamePage(currentPage.id, name);
  };

  const togglePatch = (key) => {
    if (selectedElement) updateElement(selectedSectionId, selectedElementId, { [key]: !selectedElement[key] });
    else if (selectedSection) updateSection(selectedSectionId, { [key]: !selectedSection[key] });
    else showToast('Select a section or element first.');
  };

  return (
    <PropertyGroup title="Selection">
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">{selectedKind}</p>
        <p className="mt-1 text-sm font-black uppercase tracking-widest text-white">{selectedItem?.type || selectedItem?.name || 'Page Frame'}</p>
      </div>
      <TextInput label="Name" value={selectedItem?.name || currentPage?.name || project?.name || ''} onChange={updateName} />
      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={() => (selectedElement ? duplicateElement() : selectedSection ? duplicateSection() : showToast('Select a section or element to duplicate.'))}><Copy size={13} className="mr-1 inline" /> Duplicate</MiniButton>
        <MiniButton tone="danger" onClick={() => (selectedElement ? deleteElement() : selectedSection ? deleteSection() : showToast('Select a section or element to delete.'))}><Trash2 size={13} className="mr-1 inline" /> Delete</MiniButton>
        <MiniButton onClick={() => togglePatch('locked')}>{selectedItem?.locked ? <Unlock size={13} className="mr-1 inline" /> : <Lock size={13} className="mr-1 inline" />} {selectedItem?.locked ? 'Unlock' : 'Lock'}</MiniButton>
        <MiniButton onClick={() => togglePatch('hidden')}>{selectedItem?.hidden ? <Eye size={13} className="mr-1 inline" /> : <EyeOff size={13} className="mr-1 inline" />} {selectedItem?.hidden ? 'Show' : 'Hide'}</MiniButton>
      </div>
    </PropertyGroup>
  );
}
