export interface AnimationPreset {
  id: string;
  title: string;
  html: string;
  css: string;
  speed: number;
  loop: boolean;
  color: string;
}

export const defaultAnimationPreset: AnimationPreset = {
  id: 'default-pulse',
  title: 'Pulse Preview',
  html: '<div class="animation-preview-dot"></div>',
  css: `
    .animation-preview-dot {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: var(--animation-color, #6366f1);
      animation: pulse var(--animation-speed, 1.6s) ease-in-out infinite;
    }
    @keyframes pulse {
      50% { transform: scale(1.22); box-shadow: 0 0 42px var(--animation-color, #6366f1); }
    }
  `,
  speed: 1.6,
  loop: true,
  color: '#6366f1',
};
