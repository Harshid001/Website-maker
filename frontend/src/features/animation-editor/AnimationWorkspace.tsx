import React, { useMemo, useState } from 'react';
import type { Template } from '../../types/template.types';
import AnimationPreview from './AnimationPreview';
import AnimationToolbar from './AnimationToolbar';
import AnimationPropertiesPanel from './AnimationPropertiesPanel';
import { loadAnimationFromTemplate } from './animationTemplateLoader';

export default function AnimationWorkspace({ template }: { template?: Template | null }) {
  const initialPreset = useMemo(() => loadAnimationFromTemplate(template), [template]);
  const [preset, setPreset] = useState(initialPreset);

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] gap-4 bg-slate-950 p-4 text-white">
      <AnimationToolbar />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <AnimationPreview preset={preset} />
        <AnimationPropertiesPanel preset={preset} onChange={setPreset} />
      </div>
    </div>
  );
}
