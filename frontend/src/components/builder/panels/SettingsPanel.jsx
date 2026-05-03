import React from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { PanelSection, PanelShell } from './PanelShell';

export default function SettingsPanel() {
  const { project, updateProjectMeta, showToast } = useBuilderStore();
  return (
    <PanelShell eyebrow="Builder" title="Builder Settings">
      <PanelSection title="Project settings">
        <label className="block rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Website name</span>
          <input value={project?.name || ''} onChange={(event) => updateProjectMeta({ name: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white outline-none" />
        </label>
        {['Website Settings', 'Page Settings', 'User Settings', 'Workspace Settings', 'SEO Settings', 'Export Settings', 'Publishing Settings'].map((label) => (
          <button key={label} type="button" onClick={() => showToast(`${label} placeholder opened.`)} className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 text-left text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white">
            {label}
          </button>
        ))}
      </PanelSection>
    </PanelShell>
  );
}
