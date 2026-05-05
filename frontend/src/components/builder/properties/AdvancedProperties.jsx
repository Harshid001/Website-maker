import { useBuilderStore } from '../../../store/builderStore';
import { MiniButton, PropertyGroup, TextArea, TextInput } from './PropertyControls';

export default function AdvancedProperties() {
  const { selectedItem, getSelectedNode, updateNodeInMap, selectedElement, selectedSection, selectedSectionId, selectedElementId, updateElement, updateSection, showToast } = useBuilderStore();
  const selectedNode = getSelectedNode;
  const item = selectedNode || selectedItem;
  const update = (patch) => {
    if (selectedNode) updateNodeInMap(selectedNode.id, patch);
    else if (selectedElement) updateElement(selectedSectionId, selectedElementId, patch);
    else if (selectedSection) updateSection(selectedSectionId, patch);
  };
  const updateProps = (patch) => update({ props: { ...(item?.props || {}), ...patch } });

  return (
    <PropertyGroup title="Advanced Settings">
      <TextInput label="Custom CSS class" value={item?.className || ''} onChange={(value) => update({ className: value })} />
      <TextInput label="Element ID" value={item?.htmlId || ''} onChange={(value) => update({ htmlId: value })} placeholder="my-element" />
      <TextInput label="ARIA label" value={item?.ariaLabel || ''} onChange={(value) => update({ ariaLabel: value })} placeholder="Accessible label for screen readers" />
      <TextInput label="ARIA role" value={item?.ariaRole || ''} onChange={(value) => update({ ariaRole: value })} placeholder="button, navigation, banner..." />
      <TextArea label="Custom CSS" value={item?.customCss || ''} onChange={(value) => update({ customCss: value })} />
      <TextArea label="Custom JavaScript" value={item?.customJs || ''} onChange={(value) => update({ customJs: value })} />
      <TextArea label="HTML embed" value={item?.htmlEmbed || ''} onChange={(value) => update({ htmlEmbed: value })} />

      <div className="grid grid-cols-2 gap-2">
        <MiniButton onClick={() => { updateProps({ apiConnection: { enabled: true, method: 'GET', url: item?.props?.apiConnection?.url || '' } }); showToast('API connection settings enabled on this item.'); }}>API connection</MiniButton>
        <MiniButton onClick={() => { update({ trackingEnabled: true }); showToast('Tracking flag enabled on this item.'); }}>Tracking code</MiniButton>
        <MiniButton onClick={() => {
          const colors = item?.styles || {};
          const bg = colors.backgroundColor || '#ffffff';
          const text = colors.color || '#0f172a';
          showToast(`Contrast check — BG: ${bg}, Text: ${text}. Ensure WCAG AA contrast ratio of 4.5:1 for body text and 3:1 for large text.`);
        }}>Contrast check</MiniButton>
        <MiniButton onClick={() => { update({ keyboardFocus: true, tabIndex: item?.tabIndex ?? 0 }); showToast('Keyboard focus enabled for this item.'); }}>Focus order</MiniButton>
      </div>

      {/* Developer JSON view */}
      {item && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">Node data (read-only)</p>
          <pre className="max-h-32 overflow-auto rounded-xl bg-slate-900 p-2 text-[9px] leading-4 text-slate-400 custom-scrollbar">
            {JSON.stringify({ id: item.id, type: item.type, name: item.name, locked: item.locked, hidden: item.hidden }, null, 2)}
          </pre>
        </div>
      )}
    </PropertyGroup>
  );
}
