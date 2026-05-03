import React from 'react';
import { Bot, Brush, FileText, Gauge, Sparkles, Wand2 } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { ActionButton, PanelSection, PanelShell } from './PanelShell';

export default function AICreatePanel() {
  const {
    generateMockWebsite,
    generateMockSection,
    generateSEO,
    rewriteSelectedText,
    applyTheme,
    showToast,
  } = useBuilderStore();

  const sectionActions = [
    ['hero', 'Generate hero section'],
    ['services', 'Generate services section'],
    ['about', 'Generate about section'],
    ['pricing', 'Generate pricing section'],
    ['faq', 'Generate FAQ section'],
    ['contact', 'Generate contact section'],
  ];

  return (
    <PanelShell eyebrow="Mock AI" title="AI Create">
      <PanelSection title="Website generation">
        <ActionButton icon={Sparkles} label="Generate full website" description="Replaces the current page with a complete mock AI website." onClick={generateMockWebsite} />
        {sectionActions.map(([type, label]) => (
          <ActionButton key={type} icon={Wand2} label={label} onClick={() => generateMockSection(type)} />
        ))}
      </PanelSection>
      <PanelSection title="Content and SEO">
        <ActionButton icon={FileText} label="Generate website copy" onClick={() => rewriteSelectedText('longer')} />
        <ActionButton icon={Gauge} label="Generate SEO" onClick={generateSEO} />
        <ActionButton icon={Brush} label="Generate color palette" onClick={() => { applyTheme('startup-gradient'); showToast('Mock AI palette applied.'); }} />
        <ActionButton icon={Bot} label="Generate font pairing" onClick={() => showToast('Mock font pairing prepared for future API connection.')} />
        <ActionButton icon={Sparkles} label="Generate animation suggestions" onClick={() => showToast('Animation suggestions are available in the Animation panel.')} />
        <ActionButton icon={Brush} label="Generate brand kit" onClick={() => showToast('Brand kit generated as a structured placeholder.')} />
        <ActionButton icon={Wand2} label="Improve selected section" onClick={() => rewriteSelectedText('professional')} />
        <ActionButton icon={Gauge} label="Fix responsive design" onClick={() => showToast('Responsive fixer mock applied. Review mobile and tablet settings.')} />
      </PanelSection>
    </PanelShell>
  );
}
