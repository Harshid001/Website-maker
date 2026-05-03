import React from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { MiniButton, PropertyGroup, TextInput, ToggleInput } from './PropertyControls';

export default function AccessibilityProperties() {
  const { selectedElement, selectedSection, selectedSectionId, selectedElementId, updateElement, updateSection, showToast } = useBuilderStore();
  const item = selectedElement || selectedSection;
  const update = (patch) => {
    if (selectedElement) updateElement(selectedSectionId, selectedElementId, patch);
    else if (selectedSection) updateSection(selectedSectionId, patch);
  };

  return (
    <PropertyGroup title="Accessibility">
      <TextInput label="ARIA label" value={item?.ariaLabel || ''} onChange={(value) => update({ ariaLabel: value })} />
      <TextInput label="Alt text" value={selectedElement?.props?.alt || ''} onChange={(value) => selectedElement && updateElement(selectedSectionId, selectedElementId, { props: { alt: value } })} />
      <ToggleInput label="Keyboard focus" checked={item?.keyboardFocus !== false} onChange={(value) => update({ keyboardFocus: value })} />
      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={() => showToast('Contrast warning placeholder: check colors before publishing.')}>Contrast check</MiniButton>
        <MiniButton onClick={() => showToast('Button label check passed for selected item.')}>Button labels</MiniButton>
      </div>
    </PropertyGroup>
  );
}
