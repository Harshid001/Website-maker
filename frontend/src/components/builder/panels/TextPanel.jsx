import React from 'react';
import { Type, Wand2 } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { ActionButton, PanelSection, PanelShell } from './PanelShell';

const quick = [
  ['heading', 'Big heading'],
  ['heading', 'Small heading'],
  ['paragraph', 'Paragraph'],
  ['paragraph', 'Quote'],
  ['paragraph', 'Label'],
  ['button', 'CTA text'],
  ['paragraph', 'List'],
  ['paragraph', 'Badge text'],
];

export default function TextPanel() {
  const { addElement, rewriteSelectedText } = useBuilderStore();

  return (
    <PanelShell eyebrow="Copy" title="Text Tool">
      <PanelSection title="Quick add">
        {quick.map(([type, label]) => <ActionButton key={label} icon={Type} label={label} onClick={() => addElement(type)} />)}
      </PanelSection>
      <PanelSection title="AI text helpers">
        <ActionButton icon={Wand2} label="Rewrite selected text" onClick={() => rewriteSelectedText('professional')} />
        <ActionButton icon={Wand2} label="Make professional" onClick={() => rewriteSelectedText('professional')} />
        <ActionButton icon={Wand2} label="Make shorter" onClick={() => rewriteSelectedText('shorter')} />
        <ActionButton icon={Wand2} label="Make longer" onClick={() => rewriteSelectedText('longer')} />
        <ActionButton icon={Wand2} label="Generate CTA" onClick={() => rewriteSelectedText('cta')} />
        <ActionButton icon={Wand2} label="Generate tagline" onClick={() => rewriteSelectedText('professional')} />
      </PanelSection>
    </PanelShell>
  );
}
