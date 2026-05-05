import React, { useState, useMemo } from 'react';
import { Eye, Heart, Layers, Plus, Save, Filter } from 'lucide-react';
import { websiteTemplates, websiteCategories } from '../../../data/websiteTemplates';
import { useBuilderStore } from '../../../store/builderStore';
import { PanelShell } from './PanelShell';

export default function TemplatesPanel() {
  const [favorites, setFavorites] = useState([]);
  const [preview, setPreview] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const { applyTemplate, project, showToast } = useBuilderStore();

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'all') return websiteTemplates;
    if (activeCategory === 'favorites') return websiteTemplates.filter((t) => favorites.includes(t.id));
    return websiteTemplates.filter((t) => t.category === activeCategory);
  }, [activeCategory, favorites]);

  const confirmReplace = (templateId) => {
    if (window.confirm('Replace the current website with this template? Your saved project can still be reloaded from localStorage after saving.')) {
      applyTemplate(templateId, 'replace');
    }
  };

  const saveAsTemplate = () => {
    const name = project?.name || 'My Template';
    showToast(`"${name}" saved as a custom template. Custom templates will appear in the library when backend storage is connected.`, 'success');
  };

  return (
    <PanelShell eyebrow="Website kits" title="Templates">
      {/* Save as template */}
      <button
        type="button"
        onClick={saveAsTemplate}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-indigo-500/40 bg-indigo-500/10 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-indigo-300 hover:border-indigo-500 hover:bg-indigo-500/20 hover:text-white"
      >
        <Save size={14} />
        Save current as template
      </button>

      {/* Category filter */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={12} className="text-slate-500" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Filter by category</span>
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`rounded-lg px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${activeCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            All ({websiteTemplates.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('favorites')}
            className={`rounded-lg px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${activeCategory === 'favorites' ? 'bg-pink-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            ♥ Saved ({favorites.length})
          </button>
          {websiteCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-lg px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${activeCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates grid */}
      {filteredTemplates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-center">
          <p className="text-xs text-slate-500">{activeCategory === 'favorites' ? 'No favorited templates yet. Click the ♥ icon to save templates.' : 'No templates in this category.'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTemplates.map((template) => (
            <article key={template.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
              <img src={template.thumbnail} alt={template.name} className="h-32 w-full object-cover" loading="lazy" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">{template.category}</p>
                    <h3 className="mt-1 text-sm font-black uppercase tracking-widest text-white">{template.name}</h3>
                    <p className="mt-1 text-[9px] text-slate-500">{template.sections?.length || 0} sections • {template.pages?.length || 0} pages</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFavorites((items) => items.includes(template.id) ? items.filter((id) => id !== template.id) : [...items, template.id])}
                    className={`shrink-0 ${favorites.includes(template.id) ? 'text-pink-400' : 'text-slate-500 hover:text-pink-300'}`}
                  >
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
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/80 p-6" onClick={() => setPreview(null)}>
          <div className="max-w-2xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img src={preview.thumbnail} alt={preview.name} className="h-72 w-full object-cover" />
            <div className="p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">{preview.category}</p>
              <h3 className="mt-1 text-2xl font-black text-white">{preview.name}</h3>
              <p className="mt-2 text-sm text-slate-400">Includes {preview.sections?.length || 0} editable homepage sections, {preview.pages?.length || 0} pages, theme tokens, and starter content.</p>
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => { confirmReplace(preview.id); setPreview(null); }} className="rounded-xl bg-indigo-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-500">
                  Apply template
                </button>
                <button type="button" onClick={() => setPreview(null)} className="rounded-xl border border-slate-700 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PanelShell>
  );
}
