import React from 'react';
import { themePresets } from '../../../data/themePresets';
import { useBuilderStore } from '../../../store/builderStore';
import { PanelSection, PanelShell } from './PanelShell';

export default function ThemePanel() {
  const { project, applyTheme, showToast } = useBuilderStore();
  const theme = project?.theme;
  const updateThemeColor = (key, value) => {
    applyTheme({
      ...(theme || {}),
      id: theme?.id || 'custom-theme',
      name: theme?.name || 'Custom Theme',
      colors: { ...(theme?.colors || {}), [key]: value },
      fonts: theme?.fonts || { heading: 'Inter', body: 'Inter' },
      radius: theme?.radius || '16px',
      shadow: theme?.shadow || '0 18px 45px rgba(15, 23, 42, 0.12)',
      buttonStyle: theme?.buttonStyle || 'solid',
    });
  };

  const updateThemeToken = (key, value) => {
    applyTheme({
      ...(theme || {}),
      id: theme?.id || 'custom-theme',
      name: theme?.name || 'Custom Theme',
      colors: theme?.colors || {},
      fonts: theme?.fonts || { heading: 'Inter', body: 'Inter' },
      [key]: value,
    });
  };

  return (
    <PanelShell eyebrow="Style kit" title="Theme / Style Kit">
      <PanelSection title="Theme presets">
        {themePresets.map((preset) => (
          <button key={preset.id} type="button" onClick={() => applyTheme(preset.id)} className={`w-full rounded-2xl border p-3 text-left transition-all ${theme?.id === preset.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950 hover:border-indigo-500/60'}`}>
            <div className="mb-3 flex gap-1">
              {Object.values(preset.colors).slice(0, 5).map((color) => <span key={color} className="h-5 flex-1 rounded-md" style={{ backgroundColor: color }} />)}
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-white">{preset.name}</p>
          </button>
        ))}
      </PanelSection>
      <PanelSection title="Global settings">
        {[
          ['primary', 'Primary color'],
          ['background', 'Background color'],
          ['text', 'Text color'],
          ['accent', 'Accent color'],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs font-bold text-slate-300">
            {label}
            <input type="color" value={theme?.colors?.[key] || '#6366f1'} onChange={(event) => updateThemeColor(key, event.target.value)} className="h-8 w-10 rounded-lg border border-slate-800 bg-transparent" />
          </label>
        ))}
        <label className="block rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs font-bold text-slate-300">
          Font family
          <select value={theme?.fonts?.heading || 'Inter'} onChange={(event) => applyTheme({ ...theme, fonts: { heading: event.target.value, body: event.target.value } })} className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white outline-none">
            {['Inter', 'Georgia', 'Arial', 'system-ui'].map((font) => <option key={font} value={font}>{font}</option>)}
          </select>
        </label>
        <label className="block rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs font-bold text-slate-300">
          Border radius
          <input value={theme?.radius || ''} onChange={(event) => updateThemeToken('radius', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white outline-none" />
        </label>
        <button type="button" onClick={() => showToast('Button, card, spacing, glass, and shadow presets are ready for backend expansion.')} className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white">
          More style presets
        </button>
      </PanelSection>
    </PanelShell>
  );
}
