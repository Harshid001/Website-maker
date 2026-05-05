import { useState } from 'react';
import { useBuilderStore } from '../../../store/builderStore';
import { PanelSection, PanelShell } from './PanelShell';

const settingsSections = [
  {
    id: 'website',
    label: 'Website Settings',
    fields: [
      { key: 'favicon', label: 'Favicon URL', placeholder: 'https://example.com/favicon.ico' },
      { key: 'language', label: 'Language', placeholder: 'en', type: 'select', options: ['en', 'hi', 'es', 'fr', 'de', 'ja', 'zh'] },
      { key: 'charset', label: 'Character set', placeholder: 'UTF-8' },
      { key: 'viewport', label: 'Viewport', placeholder: 'width=device-width, initial-scale=1' },
    ],
  },
  {
    id: 'page',
    label: 'Page Settings',
    fields: [
      { key: 'defaultBackground', label: 'Default page background', placeholder: '#ffffff', type: 'color' },
      { key: 'maxWidth', label: 'Max content width', placeholder: '1440px' },
      { key: 'defaultFont', label: 'Default font family', placeholder: 'Inter, system-ui, sans-serif' },
    ],
  },
  {
    id: 'seo',
    label: 'SEO Settings',
    fields: [
      { key: 'seoMetaTitle', label: 'Default meta title template', placeholder: '{page} — {site}' },
      { key: 'seoRobots', label: 'Robots directive', placeholder: 'index, follow' },
      { key: 'seoCanonical', label: 'Canonical base URL', placeholder: 'https://yoursite.com' },
    ],
  },
  {
    id: 'export',
    label: 'Export Settings',
    fields: [
      { key: 'exportFormat', label: 'Export format', placeholder: 'html', type: 'select', options: ['html', 'react', 'next.js'] },
      { key: 'minifyOutput', label: 'Minify HTML/CSS', placeholder: 'true', type: 'select', options: ['true', 'false'] },
      { key: 'includeAnalytics', label: 'Include analytics code', placeholder: 'true', type: 'select', options: ['true', 'false'] },
    ],
  },
  {
    id: 'publishing',
    label: 'Publishing Settings',
    fields: [
      { key: 'customDomain', label: 'Custom domain', placeholder: 'www.example.com' },
      { key: 'sslEnabled', label: 'SSL enabled', placeholder: 'true', type: 'select', options: ['true', 'false'] },
      { key: 'cdnProvider', label: 'CDN provider', placeholder: 'Default CDN' },
    ],
  },
  {
    id: 'workspace',
    label: 'Workspace Settings',
    fields: [
      { key: 'autoSave', label: 'Auto save interval (seconds)', placeholder: '30' },
      { key: 'snapToGrid', label: 'Snap to grid', placeholder: 'true', type: 'select', options: ['true', 'false'] },
      { key: 'gridSize', label: 'Grid size (px)', placeholder: '8' },
      { key: 'showRulers', label: 'Show rulers', placeholder: 'true', type: 'select', options: ['true', 'false'] },
    ],
  },
  {
    id: 'user',
    label: 'User Settings',
    fields: [
      { key: 'defaultTheme', label: 'Editor theme', placeholder: 'dark', type: 'select', options: ['dark', 'light'] },
      { key: 'keyboardShortcuts', label: 'Keyboard shortcuts', placeholder: 'enabled', type: 'select', options: ['enabled', 'disabled'] },
    ],
  },
];

export default function SettingsPanel() {
  const { project, updateProjectMeta, updateProjectSettings, showToast } = useBuilderStore();
  const settings = project?.settings || {};
  const [openSection, setOpenSection] = useState('website');
  const [localValues, setLocalValues] = useState({});

  const getValue = (key) => localValues[key] ?? settings[key] ?? '';
  const setValue = (key, value) => {
    setLocalValues((prev) => ({ ...prev, [key]: value }));
    updateProjectSettings({ [key]: value });
  };

  return (
    <PanelShell eyebrow="Builder" title="Builder Settings">
      <PanelSection title="Project identity">
        <label className="block rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Website name</span>
          <input
            value={project?.name || ''}
            onChange={(e) => updateProjectMeta({ name: e.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
          />
        </label>
        <label className="block rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Publishing slug</span>
          <input
            value={project?.slug || ''}
            onChange={(e) => updateProjectMeta({ slug: e.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
          />
        </label>
      </PanelSection>

      {settingsSections.map((section) => (
        <div key={section.id} className="mb-3">
          <button
            type="button"
            onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
            className={`w-full rounded-2xl border p-3 text-left text-xs font-black uppercase tracking-widest transition-all ${
              openSection === section.id
                ? 'border-indigo-500/40 bg-indigo-500/10 text-white'
                : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            {section.label}
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {openSection === section.id ? 'Editing' : (section.fields.some((f) => getValue(f.key)) ? 'Configured' : 'Click to configure')}
            </span>
          </button>

          {openSection === section.id && (
            <div className="mt-2 space-y-2 rounded-2xl border border-slate-800 bg-slate-950 p-4">
              {section.fields.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-1 block text-[9px] font-bold uppercase tracking-widest text-slate-500">{field.label}</span>
                  {field.type === 'select' ? (
                    <select
                      value={getValue(field.key) || field.options?.[0] || ''}
                      onChange={(e) => setValue(field.key, e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                    >
                      {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : field.type === 'color' ? (
                    <div className="flex gap-2">
                      <input type="color" value={getValue(field.key) || '#ffffff'} onChange={(e) => setValue(field.key, e.target.value)} className="h-9 w-10 rounded-lg border border-slate-800 bg-transparent" />
                      <input value={getValue(field.key) || ''} onChange={(e) => setValue(field.key, e.target.value)} placeholder={field.placeholder} className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500" />
                    </div>
                  ) : (
                    <input
                      value={getValue(field.key) || ''}
                      onChange={(e) => setValue(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  )}
                </label>
              ))}
              <button
                type="button"
                onClick={() => showToast(`${section.label} saved.`, 'success')}
                className="mt-2 w-full rounded-xl bg-indigo-600 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-500"
              >
                Save {section.label}
              </button>
            </div>
          )}
        </div>
      ))}
    </PanelShell>
  );
}
