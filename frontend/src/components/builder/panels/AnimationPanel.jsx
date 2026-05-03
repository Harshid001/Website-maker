import React from 'react';
import { Sparkles } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { ActionButton, PanelSection, PanelShell } from './PanelShell';

const animations = ['fade-in', 'slide-up', 'slide-left', 'slide-right', 'zoom-in', 'bounce', 'hover-effects', 'scroll-animation', 'page-transition', 'parallax', 'text-reveal', 'button-glow', 'card-flip', 'floating-objects', 'loading-animation', 'lottie-placeholder'];

export default function AnimationPanel() {
  const { updateSelectedAnimation, showToast } = useBuilderStore();
  return (
    <PanelShell eyebrow="Motion" title="Animation">
      <PanelSection title="Apply animation">
        {animations.map((type) => (
          <ActionButton
            key={type}
            icon={Sparkles}
            label={type.replaceAll('-', ' ')}
            onClick={() => {
              if (type.includes('placeholder')) showToast('Lottie animation placeholder ready for upload integration.');
              else updateSelectedAnimation({ type, duration: 700, delay: 0, easing: 'ease-out', trigger: type.includes('hover') ? 'hover' : 'scroll' });
            }}
          />
        ))}
      </PanelSection>
    </PanelShell>
  );
}
