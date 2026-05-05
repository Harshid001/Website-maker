import { defaultAnimationPreset, type AnimationPreset } from './defaultAnimations';
import type { Template } from '../../types/template.types';

export function loadAnimationFromTemplate(template?: Template | null): AnimationPreset {
  if (!template?.content) return defaultAnimationPreset;

  return {
    ...defaultAnimationPreset,
    id: template.id,
    title: template.title,
    html: template.content.html || defaultAnimationPreset.html,
    css: template.content.css || defaultAnimationPreset.css,
    speed: Number(template.content.settings?.duration?.toString().replace('s', '')) || defaultAnimationPreset.speed,
    loop: typeof template.content.settings?.loop === 'boolean' ? template.content.settings.loop : defaultAnimationPreset.loop,
    color: (template.content.settings?.color as string) || defaultAnimationPreset.color,
  };
}
