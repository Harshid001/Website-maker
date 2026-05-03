import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cable, Play, Plus, Trash2 } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { getNodeInteractions, resolveInteraction } from '../../../utils/interactionResolver';
import { MiniButton, PropertyGroup, SelectInput, TextInput, ToggleInput } from '../properties/PropertyControls';

const triggers = [
  { value: 'click', label: 'On Click' },
  { value: 'hover', label: 'On Hover' },
  { value: 'mouseEnter', label: 'Mouse Enter' },
  { value: 'mouseLeave', label: 'Mouse Leave' },
  { value: 'pageLoad', label: 'Page Load' },
  { value: 'scrollIntoView', label: 'Scroll Into View' },
  { value: 'formSubmit', label: 'Form Submit' },
];

const actions = [
  { value: 'navigate', label: 'Navigate to Page' },
  { value: 'scrollToSection', label: 'Scroll to Section' },
  { value: 'openExternalUrl', label: 'Open External URL' },
  { value: 'openModal', label: 'Open Modal' },
  { value: 'closeModal', label: 'Close Modal' },
  { value: 'toggleVisibility', label: 'Toggle Visibility' },
  { value: 'downloadFile', label: 'Download File' },
  { value: 'openEmail', label: 'Email' },
  { value: 'openPhone', label: 'Phone' },
  { value: 'openWhatsApp', label: 'WhatsApp' },
  { value: 'checkout', label: 'Checkout' },
  { value: 'customAction', label: 'Custom Action' },
];

const transitions = ['instant', 'dissolve', 'slideLeft', 'slideRight', 'slideUp', 'slideDown', 'smartAnimate', 'fade', 'push'];
const easings = ['linear', 'ease', 'easeIn', 'easeOut', 'easeInOut'];
const scrollBehaviors = ['instant', 'smooth', 'scrollWithParent', 'fixed', 'sticky'];
const overflowBehaviors = ['none', 'vertical', 'horizontal', 'both'];
const positionBehaviors = ['scroll', 'fixed', 'sticky'];

export default function InteractionProperties() {
  const navigate = useNavigate();
  const {
    project,
    currentPage,
    selectedItem,
    selectedInteraction,
    selectedInteractionId,
    selectInteraction,
    addInteraction,
    updateInteraction,
    deleteInteraction,
    runInteraction,
    showToast,
  } = useBuilderStore();

  const itemInteractions = useMemo(() => (selectedItem ? getNodeInteractions(selectedItem.id, project) : []), [project, selectedItem]);
  const interaction = selectedInteraction || itemInteractions[0] || null;
  const resolved = interaction ? resolveInteraction(interaction, project) : null;
  const targetPage = (project?.pages || []).find((page) => page.id === interaction?.targetPageId) || (project?.pages || [])[0];
  const sectionOptions = (targetPage?.sections || []).map((section) => ({ value: section.id, label: section.name }));

  const update = (patch) => {
    if (!interaction) return;
    updateInteraction(interaction.id, patch);
  };

  const addDefaultInteraction = () => {
    if (!selectedItem) return showToast('Select a node before adding a prototype interaction.', 'error');
    const targetPageId = (project?.pages || []).find((page) => page.id !== currentPage?.id)?.id || currentPage?.id;
    addInteraction({
      sourcePageId: currentPage?.id,
      sourceNodeId: selectedItem.id,
      targetType: 'page',
      targetPageId,
      transition: 'smartAnimate',
    });
  };

  return (
    <PropertyGroup title={selectedInteractionId ? 'Interaction Connection' : 'Prototype Settings'}>
      <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4">
        <div className="flex items-center gap-2 text-sky-200">
          <Cable size={16} />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Figma-like prototype mode</p>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          Drag the blue handle from a selected item to a page target, section, node, or empty space to create a connection.
        </p>
      </div>

      {!selectedInteractionId && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Interactions from selection</p>
            <button type="button" onClick={addDefaultInteraction} className="inline-flex items-center gap-1 rounded-lg bg-sky-500 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-white">
              <Plus size={12} />
              Add
            </button>
          </div>
          {itemInteractions.length ? itemInteractions.map((item) => {
            const itemResolved = resolveInteraction(item, project);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectInteraction(item.id)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-left hover:border-sky-500"
              >
                <p className="text-xs font-black text-white">{itemResolved.sourceLabel} to {itemResolved.targetLabel}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">{item.trigger} / {item.action}</p>
              </button>
            );
          }) : (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950 p-3 text-xs text-slate-500">
              No interactions from this selected node yet.
            </div>
          )}
        </div>
      )}

      {interaction && (
        <>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Source to target</p>
            <p className="mt-1 text-sm font-black text-white">{resolved?.sourceLabel} to {resolved?.targetLabel}</p>
          </div>

          <SelectInput label="Trigger" value={interaction.trigger} onChange={(value) => update({ trigger: value })} options={triggers} />
          <SelectInput label="Action" value={interaction.action} onChange={(value) => update({ action: value })} options={actions} />

          {(interaction.action === 'navigate' || interaction.action === 'scrollToSection') && (
            <SelectInput
              label="Target Page"
              value={interaction.targetPageId || ''}
              onChange={(value) => update({ targetType: 'page', targetPageId: value })}
              options={(project?.pages || []).map((page) => ({ value: page.id, label: page.name }))}
            />
          )}

          {interaction.action === 'scrollToSection' && (
            <SelectInput
              label="Target Section"
              value={interaction.targetSectionId || ''}
              onChange={(value) => update({ targetType: 'section', targetSectionId: value })}
              options={sectionOptions.length ? sectionOptions : [{ value: '', label: 'No sections' }]}
            />
          )}

          {['openExternalUrl', 'openEmail', 'openPhone', 'openWhatsApp', 'downloadFile'].includes(interaction.action) && (
            <TextInput label="Target URL / Value" value={interaction.targetUrl || ''} onChange={(value) => update({ targetUrl: value, targetType: 'external' })} />
          )}

          <SelectInput label="Transition" value={interaction.transition} onChange={(value) => update({ transition: value })} options={transitions} />
          <div className="grid grid-cols-2 gap-2">
            <TextInput label="Duration" type="number" value={interaction.duration} onChange={(value) => update({ duration: Number(value) })} />
            <TextInput label="Delay" type="number" value={interaction.delay} onChange={(value) => update({ delay: Number(value) })} />
          </div>
          <SelectInput label="Easing" value={interaction.easing} onChange={(value) => update({ easing: value })} options={easings} />
          <SelectInput label="Scroll Behavior" value={interaction.scrollBehavior} onChange={(value) => update({ scrollBehavior: value })} options={scrollBehaviors} />
          <SelectInput label="Overflow Behavior" value={interaction.overflowBehavior} onChange={(value) => update({ overflowBehavior: value })} options={overflowBehaviors} />
          <SelectInput label="Position Behavior" value={interaction.positionBehavior} onChange={(value) => update({ positionBehavior: value })} options={positionBehaviors} />
          <ToggleInput label="Open in new tab" checked={interaction.openInNewTab} onChange={(value) => update({ openInNewTab: value })} />

          <div className="grid grid-cols-2 gap-2">
            <MiniButton onClick={() => runInteraction(interaction.id, 'editor', navigate)}><Play size={13} className="mr-1 inline" /> Test</MiniButton>
            <MiniButton tone="danger" onClick={() => deleteInteraction(interaction.id)}><Trash2 size={13} className="mr-1 inline" /> Delete</MiniButton>
          </div>
        </>
      )}
    </PropertyGroup>
  );
}
