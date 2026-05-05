import { useState } from 'react';
import { Sparkles, Clock } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { ActionButton, PanelSection, PanelShell } from './PanelShell';

const animations = [
  { type: 'fade-in', label: 'Fade In', trigger: 'scroll' },
  { type: 'slide-up', label: 'Slide Up', trigger: 'scroll' },
  { type: 'slide-left', label: 'Slide Left', trigger: 'scroll' },
  { type: 'slide-right', label: 'Slide Right', trigger: 'scroll' },
  { type: 'zoom-in', label: 'Zoom In', trigger: 'scroll' },
  { type: 'bounce', label: 'Bounce', trigger: 'scroll' },
  { type: 'hover-effects', label: 'Hover Effects', trigger: 'hover' },
  { type: 'scroll-animation', label: 'Scroll Animation', trigger: 'scroll' },
  { type: 'page-transition', label: 'Page Transition', trigger: 'load' },
  { type: 'parallax', label: 'Parallax', trigger: 'scroll' },
  { type: 'text-reveal', label: 'Text Reveal', trigger: 'scroll' },
  { type: 'button-glow', label: 'Button Glow', trigger: 'hover' },
  { type: 'card-flip', label: 'Card Flip', trigger: 'hover' },
  { type: 'floating-objects', label: 'Floating Objects', trigger: 'load' },
  { type: 'loading-animation', label: 'Loading Animation', trigger: 'load' },
  { type: 'lottie-placeholder', label: 'Lottie Animation', trigger: 'load' },
];

const easingOptions = ['ease-out', 'ease-in', 'ease-in-out', 'linear', 'cubic-bezier(0.22, 1, 0.36, 1)'];

export default function AnimationPanel() {
  const { updateSelectedAnimation, addElement, showToast, getSelectedNode } = useBuilderStore();
  const [duration, setDuration] = useState(700);
  const [delay, setDelay] = useState(0);
  const [easing, setEasing] = useState('ease-out');
  const node = getSelectedNode;

  const applyAnimation = (anim) => {
    if (anim.type === 'lottie-placeholder') {
      addElement('lottieAnimation');
      showToast('Lottie animation placeholder inserted.');
      return;
    }
    updateSelectedAnimation({
      type: anim.type,
      duration,
      delay,
      easing,
      trigger: anim.trigger,
    });
    showToast(`${anim.label} animation applied.`, 'success');
  };

  return (
    <PanelShell eyebrow="Motion" title="Animation">
      <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Quick config</p>
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Duration (ms)</span>
            <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value) || 700)} min={100} max={5000} step={100} className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-white outline-none focus:border-indigo-500" />
          </label>
          <label className="block">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Delay (ms)</span>
            <input type="number" value={delay} onChange={(e) => setDelay(Number(e.target.value) || 0)} min={0} max={3000} step={50} className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-white outline-none focus:border-indigo-500" />
          </label>
        </div>
        <label className="mt-2 block">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Easing</span>
          <select value={easing} onChange={(e) => setEasing(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-white outline-none focus:border-indigo-500">
            {easingOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </label>
        {node && (
          <div className="mt-3 rounded-xl bg-indigo-500/10 px-3 py-2">
            <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-300">
              Target: {node.name || node.type}
              {node.animation?.type && node.animation.type !== 'none' && ` • Current: ${node.animation.type}`}
            </p>
          </div>
        )}
        {!node && (
          <p className="mt-3 text-[9px] leading-4 text-amber-300/70">Select an element on the canvas first, then pick an animation below.</p>
        )}
      </div>

      <PanelSection title="Apply animation">
        {animations.map((anim) => (
          <ActionButton
            key={anim.type}
            icon={anim.trigger === 'load' ? Clock : Sparkles}
            label={anim.label}
            description={`Trigger: ${anim.trigger}`}
            onClick={() => applyAnimation(anim)}
          />
        ))}
      </PanelSection>

      <PanelSection title="Bulk actions">
        <ActionButton
          icon={Sparkles}
          label="Remove all animations"
          description="Clear animation from selected element"
          onClick={() => { updateSelectedAnimation({ type: 'none', duration: 0, delay: 0 }); showToast('Animation removed.'); }}
        />
      </PanelSection>
    </PanelShell>
  );
}
