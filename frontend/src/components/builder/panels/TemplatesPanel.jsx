import React, { useState } from 'react';
import { Eye, Heart, Layers, Plus } from 'lucide-react';
import { websiteTemplates } from '../../../data/websiteTemplates';
import { useBuilderStore } from '../../../store/builderStore';
import { PanelShell } from './PanelShell';

export default function TemplatesPanel() {
  const [favorites, setFavorites] = useState([]);
  const [preview, setPreview] = useState(null);
  const { applyTemplate, showToast } = useBuilderStore();

  const confirmReplace = (templateId) => {
    if (window.confirm('Replace the current website with this template? Your saved project can still be reloaded from localStorage after saving.')) {
      applyTemplate(templateId, 'replace');
    }
  };

  return (
    <PanelShell eyebrow="Website kits" title="Templates">
      <div className="space-y-4">
        {websiteTemplates.map((template) => (
          <article key={template.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
            <img src={template.thumbnail} alt={template.name} className="h-32 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">{template.category}</p>
                  <h3 className="mt-1 text-sm font-black uppercase tracking-widest text-white">{template.name}</h3>
                </div>
                <button type="button" onClick={() => setFavorites((items) => items.includes(template.id) ? items.filter((id) => id !== template.id) : [...items, template.id])} className={`text-slate-500 hover:text-pink-300 ${favorites.includes(template.id) ? 'text-pink-400' : ''}`}>
                  <Heart size={16} fill={favorites.includes(template.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button type="button" onClick={() => setPreview(template)} className="rounded-xl border border-slate-800 px-2 py-2 text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-white">
                  <Eye size={13} className="mx-auto mb-1" /> Preview
                </button>
                <button type="button" onClick={() => confirmReplace(template.id)} className="rounded-xl bg-indigo-600 px-2 py-2 text-[9px] font-black uppercase tracking-widest text-white hover:bg-indigo-500">
                  <Layers size={13} className="mx-auto mb-1" /> Apply
                </button>
                <button type="button" onClick={() => { applyTemplate(template.id, 'append'); showToast('Template sections added to current page.'); }} className="rounded-xl border border-slate-800 px-2 py-2 text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-white">
                  <Plus size={13} className="mx-auto mb-1" /> Add
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {preview && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/80 p-6" onClick={() => setPreview(null)}>
          <div className="max-w-2xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <img src={preview.thumbnail} alt={preview.name} className="h-72 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font-black text-white">{preview.name}</h3>
              <p className="mt-2 text-sm text-slate-400">Includes {preview.sections.length} editable homepage sections, theme tokens, and starter pages.</p>
              <button type="button" onClick={() => { confirmReplace(preview.id); setPreview(null); }} className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white">
                Apply template
              </button>
            </div>
          </div>
        </div>
      )}
    </PanelShell>
  );
}
