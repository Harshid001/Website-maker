import React from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { MiniButton, PropertyGroup, TextArea, TextInput } from './PropertyControls';

export default function AdvancedProperties() {
  const { selectedItem, selectedElement, selectedSection, selectedSectionId, selectedElementId, updateElement, updateSection, showToast } = useBuilderStore();
  const update = (patch) => {
    if (selectedElement) updateElement(selectedSectionId, selectedElementId, patch);
    else if (selectedSection) updateSection(selectedSectionId, patch);
  };

  return (
    <PropertyGroup title="Advanced Settings">
      <TextInput label="Custom CSS class" value={selectedItem?.className || ''} onChange={(value) => update({ className: value })} />
      <TextInput label="Element ID" value={selectedItem?.htmlId || ''} onChange={(value) => update({ htmlId: value })} />
      <TextArea label="Custom CSS" value={selectedItem?.customCss || ''} onChange={(value) => update({ customCss: value })} />
      <TextArea label="HTML embed" value={selectedItem?.htmlEmbed || ''} onChange={(value) => update({ htmlEmbed: value })} />
      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={() => showToast('API connection placeholder saved for future backend endpoint.')}>API connection</MiniButton>
        <MiniButton onClick={() => showToast('Tracking code placeholder saved for publish pipeline.')}>Tracking code</MiniButton>
      </div>
    </PropertyGroup>
  );
}
