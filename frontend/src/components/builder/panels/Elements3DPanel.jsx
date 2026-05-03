import React, { useState } from 'react';
import { Box } from 'lucide-react';
import { ActionButton, PanelSection, PanelShell } from './PanelShell';

const tools = ['3D Object Viewer', 'Product 3D Card', '3D Text', '3D Background', 'Rotate Model placeholder', 'Material Editor placeholder', 'Lighting Tool placeholder', 'Camera Tool placeholder', 'GLB/GLTF Upload placeholder', '3D Template Library'];

export default function Elements3DPanel() {
  const [active, setActive] = useState(null);
  return (
    <PanelShell eyebrow="Depth" title="3D Elements">
      <PanelSection title="3D tools">
        {tools.map((label) => <ActionButton key={label} icon={Box} label={label} onClick={() => setActive(label)} />)}
      </PanelSection>
      {active && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <div className="flex h-40 items-center justify-center rounded-xl bg-slate-900 text-slate-500">
            <Box size={44} />
          </div>
          <p className="mt-3 text-xs font-black uppercase tracking-widest text-white">{active}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Three.js is installed; this placeholder keeps the integration path clean.</p>
        </div>
      )}
    </PanelShell>
  );
}
