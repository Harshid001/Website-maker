import React, { useState } from 'react';
import { PenTool } from 'lucide-react';
import { ActionButton, PanelSection, PanelShell } from './PanelShell';

const tools = ['Poster Maker', 'Banner Maker', 'Business Card Maker', 'Instagram Post Maker', 'YouTube Thumbnail Maker', 'Flyer Maker', 'Logo Layout Tool', 'Shape Tool', 'Icon Tool', 'Text Effects', 'Export PNG/JPG/PDF placeholder'];

export default function Design2DPanel() {
  const [active, setActive] = useState(null);
  return (
    <PanelShell eyebrow="Design studio" title="2D Design Tools">
      <PanelSection title="Create marketing assets">
        {tools.map((label) => <ActionButton key={label} icon={PenTool} label={label} onClick={() => setActive(label)} />)}
      </PanelSection>
      {active && (
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4">
          <p className="text-xs font-black uppercase tracking-widest text-white">{active}</p>
          <div className="mt-3 flex h-36 items-center justify-center rounded-xl border border-dashed border-indigo-400/40 bg-slate-950 text-xs font-bold text-slate-400">
            Working mock canvas placeholder
          </div>
        </div>
      )}
    </PanelShell>
  );
}
