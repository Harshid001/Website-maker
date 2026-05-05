import { useBuilderStore } from '../../../store/builderStore';
import { MiniButton, PropertyGroup, TextInput, ToggleInput } from './PropertyControls';

const hexToRgb = (value = '') => {
  const hex = String(value).trim().replace('#', '');
  if (![3, 6].includes(hex.length)) return null;
  const full = hex.length === 3 ? hex.split('').map((char) => char + char).join('') : hex;
  const int = Number.parseInt(full, 16);
  return Number.isFinite(int) ? [(int >> 16) & 255, (int >> 8) & 255, int & 255] : null;
};

const luminance = (rgb) => {
  const normalized = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * normalized[0] + 0.7152 * normalized[1] + 0.0722 * normalized[2];
};

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
  const checkContrast = () => {
    const bg = hexToRgb(item?.styles?.backgroundColor || '#ffffff');
    const fg = hexToRgb(item?.styles?.color || '#0f172a');
    if (!bg || !fg) {
      showToast('Use hex colors to calculate an exact contrast ratio.', 'error');
      return;
    }
    const light = Math.max(luminance(bg), luminance(fg));
    const dark = Math.min(luminance(bg), luminance(fg));
    const ratio = ((light + 0.05) / (dark + 0.05)).toFixed(2);
    showToast(`Contrast ratio ${ratio}:1 ${ratio >= 4.5 ? 'passes AA body text.' : 'needs stronger contrast.'}`, ratio >= 4.5 ? 'success' : 'error');
  };
  const checkButtonLabel = () => {
    const label = item?.ariaLabel || item?.content || item?.props?.alt || item?.name;
    showToast(label ? 'Accessible label is present.' : 'Add visible text or an ARIA label.', label ? 'success' : 'error');
  };

  return (
    <PropertyGroup title="Accessibility">
      <TextInput label="ARIA label" value={item?.ariaLabel || ''} onChange={(value) => update({ ariaLabel: value })} />
      <TextInput label="Alt text" value={item?.props?.alt || ''} onChange={updateAlt} />
      <ToggleInput label="Keyboard focus" checked={item?.keyboardFocus !== false} onChange={(value) => update({ keyboardFocus: value })} />
      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={checkContrast}>Contrast check</MiniButton>
        <MiniButton onClick={checkButtonLabel}>Button labels</MiniButton>
      </div>
    </PropertyGroup>
  );
}
