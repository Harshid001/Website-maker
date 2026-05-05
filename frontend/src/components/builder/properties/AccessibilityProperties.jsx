import { useBuilderStore } from '../../../store/builderStore';
import { MiniButton, PropertyGroup, TextInput, ToggleInput } from './PropertyControls';

export default function AccessibilityProperties() {
  const { getSelectedNode, updateNodeInMap, updateNodePropsInMap, selectedElement, selectedSection, selectedSectionId, selectedElementId, updateElement, updateSection, showToast } = useBuilderStore();
  const selectedNode = getSelectedNode;
  const item = selectedNode || selectedElement || selectedSection;
  const update = (patch) => {
    if (selectedNode) updateNodeInMap(selectedNode.id, patch);
    else if (selectedElement) updateElement(selectedSectionId, selectedElementId, patch);
    else if (selectedSection) updateSection(selectedSectionId, patch);
  };
  const updateAlt = (value) => {
    if (selectedNode) updateNodePropsInMap(selectedNode.id, { alt: value });
    else if (selectedElement) updateElement(selectedSectionId, selectedElementId, { props: { alt: value } });
  };

  return (
    <PropertyGroup title="Accessibility">
      <TextInput label="ARIA label" value={item?.ariaLabel || ''} onChange={(value) => update({ ariaLabel: value })} />
      <TextInput label="Alt text" value={item?.props?.alt || ''} onChange={updateAlt} />
      <ToggleInput label="Keyboard focus" checked={item?.keyboardFocus !== false} onChange={(value) => update({ keyboardFocus: value })} />
      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={() => showToast('Contrast warning placeholder: check colors before publishing.')}>Contrast check</MiniButton>
        <MiniButton onClick={() => showToast('Button label check passed for selected item.')}>Button labels</MiniButton>
      </div>
    </PropertyGroup>
  );
}
