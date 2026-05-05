import React from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import type { AnimationPreset } from './defaultAnimations';

export default function AnimationPreview({ preset }: { preset: AnimationPreset }) {
  React.useEffect(() => {
    gsap.to('.gsap-preview-chip', {
      y: -8,
      repeat: preset.loop ? -1 : 0,
      yoyo: true,
      duration: preset.speed,
      ease: 'power1.inOut',
    });
  }, [preset.loop, preset.speed]);

  return (
    <div
      className="grid min-h-[420px] place-items-center rounded-2xl bg-slate-950 p-8"
      style={
        {
          '--animation-color': preset.color,
          '--animation-speed': `${preset.speed}s`,
        } as React.CSSProperties
      }
    >
      <style>{preset.css}</style>
      <div className="grid gap-8 text-center">
        <div dangerouslySetInnerHTML={{ __html: preset.html }} />
        <motion.div
          className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-bold text-white"
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: preset.speed, repeat: preset.loop ? Infinity : 0 }}
        >
          Framer Motion placeholder
        </motion.div>
        <div className="gsap-preview-chip rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-bold text-cyan-100">
          GSAP placeholder
        </div>
      </div>
    </div>
  );
}
