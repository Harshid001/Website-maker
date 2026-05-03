import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { PanelShell } from './PanelShell';

const tutorials = ['How to create website', 'How to use templates', 'How to edit text', 'How to add images', 'How to publish website', 'How to connect domain', 'How to use AI', 'How to make responsive design'];

export default function TutorialsPanel() {
  const [open, setOpen] = useState(tutorials[0]);
  return (
    <PanelShell eyebrow="Help" title="Tutorials">
      <div className="space-y-3">
        {tutorials.map((title) => (
          <div key={title} className="rounded-2xl border border-slate-800 bg-slate-950">
            <button type="button" onClick={() => setOpen(open === title ? null : title)} className="flex w-full items-center gap-3 p-4 text-left">
              <HelpCircle size={16} className="text-indigo-300" />
              <span className="text-xs font-black uppercase tracking-widest text-white">{title}</span>
            </button>
            {open === title && <p className="px-4 pb-4 text-xs leading-5 text-slate-500">Use the left panel to add or generate content, select items on the canvas, and edit details from the right panel.</p>}
          </div>
        ))}
      </div>
    </PanelShell>
  );
}
