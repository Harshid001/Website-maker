import { Type, Wand2 } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { ActionButton, PanelSection, PanelShell } from './PanelShell';

const quick = [
  ['heading', 'Heading', { content: 'Compelling website headline' }],
  ['heading', 'Subheading', { content: 'A concise supporting headline', styles: { fontSize: '28px' } }],
  ['paragraph', 'Paragraph', { content: 'Add a clear paragraph that explains the value.' }],
  ['quote', 'Quote', { content: '"A short quote that builds trust."', styles: { fontStyle: 'italic' } }],
  ['label', 'Label', { content: 'Section label', styles: { fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' } }],
  ['badgeText', 'Badge Text', { content: 'New', styles: { display: 'inline-flex', fontSize: '12px', fontWeight: '800', padding: '6px 10px', borderRadius: '999px', backgroundColor: '#eef2ff', color: '#4338ca' } }],
  ['buttonText', 'Button Text', { content: 'Get Started' }],
  ['listText', 'List Text', { content: 'Benefit one\nBenefit two\nBenefit three', styles: { whiteSpace: 'pre-line' } }],
  ['priceText', 'Price Text', { content: '$99', styles: { fontSize: '36px', fontWeight: '900' } }],
  ['testimonialText', 'Testimonial Text', { content: 'This made our website launch feel simple and polished.', styles: { fontStyle: 'italic' } }],
];

export default function TextPanel() {
  const { addElement, rewriteSelectedText } = useBuilderStore();

  return (
    <PanelShell eyebrow="Copy" title="Text Tool">
      <PanelSection title="Quick add">
        {quick.map(([type, label, overrides]) => <ActionButton key={label} icon={Type} label={label} onClick={() => addElement(type, undefined, overrides)} />)}
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
