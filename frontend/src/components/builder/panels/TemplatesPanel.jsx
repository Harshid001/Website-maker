import React, { useState, useMemo } from 'react';
import { Save, Filter, Search, ChevronDown, X, Palette, Eye, Layers, Plus, Star, FileText, Heart } from 'lucide-react';
import { websiteDesignTemplates, templateCategories, designTypes } from '../../../data/websiteDesignTemplates';
import { useBuilderStore } from '../../../store/builderStore';
import { PanelShell } from './PanelShell';
import BuilderTemplateCard from '../../templates/BuilderTemplateCard';
import TemplateMiniPreview from '../TemplateMiniPreview';

const difficultyColor = { Beginner: '#22c55e', Intermediate: '#f59e0b', Advanced: '#ef4444' };

export default function TemplatesPanel() {
  const [favorites, setFavorites] = useState([]);
  const [preview, setPreview] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDesignType, setActiveDesignType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDesignFilter, setShowDesignFilter] = useState(false);
  const { applyDesignTemplate, project, showToast } = useBuilderStore();

  const filteredTemplates = useMemo(() => {
    let list = websiteDesignTemplates;
    if (activeCategory === 'favorites') {
      list = list.filter((t) => favorites.includes(t.id));
    } else if (activeCategory !== 'all') {
      list = list.filter((t) => t.category === activeCategory);
    }
    if (activeDesignType !== 'all') {
      list = list.filter((t) => t.designType.toLowerCase().includes(activeDesignType.toLowerCase()));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((t) =>
        t.title.toLowerCase().includes(q) ||
        t.designType.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.includes(q)) ||
        t.suitableFor.some((s) => s.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeCategory, activeDesignType, searchQuery, favorites]);

  const toggleFav = (id) => setFavorites((f) => f.includes(id) ? f.filter((x) => x !== id) : [...f, id]);

  const confirmApply = (template) => {
    if (window.confirm(`Replace current website with "${template.title}"? Current project will be auto-saved first.`)) {
      applyDesignTemplate(template, 'replace');
    }
  };

  const handleAdd = (template) => {
    applyDesignTemplate(template, 'append');
    showToast(`${template.title} sections added to current page.`, 'success');
  };

  const saveAsTemplate = () => {
    const name = project?.name || 'My Template';
    showToast(`"${name}" saved as a custom template.`, 'success');
  };

  return (
    <PanelShell eyebrow="Design library" title="Templates">
      {/* Search */}
      <div className="relative mb-3">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates..."
          className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-8 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500"
        />
        {searchQuery && (
          <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
            <X size={13} />
          </button>
        )}
      </div>

      {/* Save as template */}
      <button type="button" onClick={saveAsTemplate}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-indigo-300 hover:border-indigo-500 hover:bg-indigo-500/20 hover:text-white">
        <Save size={12} /> Save current as template
      </button>

      {/* Category filter */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <Filter size={10} className="text-slate-500" />
          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Category</span>
        </div>
        <div className="flex flex-wrap gap-1">
          <button type="button" onClick={() => setActiveCategory('all')}
            className={`rounded-lg px-2 py-1 text-[8px] font-bold uppercase tracking-widest ${activeCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>
            All ({websiteDesignTemplates.length})
          </button>
          <button type="button" onClick={() => setActiveCategory('favorites')}
            className={`rounded-lg px-2 py-1 text-[8px] font-bold uppercase tracking-widest ${activeCategory === 'favorites' ? 'bg-pink-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>
            ♥ ({favorites.length})
          </button>
          {templateCategories.filter((c) => c.id !== 'all').map((cat) => (
            <button key={cat.id} type="button" onClick={() => setActiveCategory(cat.id)}
              className={`rounded-lg px-2 py-1 text-[8px] font-bold uppercase tracking-widest ${activeCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Design type filter */}
      <div className="mb-4 relative">
        <button type="button" onClick={() => setShowDesignFilter(!showDesignFilter)}
          className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-white">
          <span><Palette size={10} className="inline mr-1.5" />Design: {activeDesignType === 'all' ? 'All Types' : activeDesignType}</span>
          <ChevronDown size={12} className={`transition-transform ${showDesignFilter ? 'rotate-180' : ''}`} />
        </button>
        {showDesignFilter && (
          <div className="absolute z-20 mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl">
            <button type="button" onClick={() => { setActiveDesignType('all'); setShowDesignFilter(false); }}
              className={`w-full rounded-lg px-2.5 py-1.5 text-left text-[9px] font-bold uppercase tracking-widest ${activeDesignType === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              All Types
            </button>
            {designTypes.map((dt) => (
              <button key={dt} type="button" onClick={() => { setActiveDesignType(dt); setShowDesignFilter(false); }}
                className={`w-full rounded-lg px-2.5 py-1.5 text-left text-[9px] font-bold uppercase tracking-widest ${activeDesignType === dt ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                {dt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-slate-600">
        {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
      </p>

      {/* Templates list */}
      {filteredTemplates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-center">
          <p className="text-xs text-slate-500">{activeCategory === 'favorites' ? 'No favorited templates yet.' : 'No templates match your filters.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTemplates.map((template) => (
            <BuilderTemplateCard
              key={template.id}
              template={template}
              isFavorite={favorites.includes(template.id)}
              onFavorite={toggleFav}
              onPreview={setPreview}
              onApply={confirmApply}
              onAdd={handleAdd}
            />
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/85 p-6" onClick={() => setPreview(null)}>
          <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl custom-scrollbar" onClick={(e) => e.stopPropagation()}>
            {/* Preview thumbnail */}
            <div className="bg-slate-950 p-4">
              <TemplateMiniPreview layoutPreview={preview.layoutPreview} className="rounded-xl" />
            </div>

            <div className="p-6">
              {/* Header */}
              <span className="rounded-md bg-indigo-600/90 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white">
                {preview.designType}
              </span>
              <h3 className="mt-2 text-xl font-black text-white">{preview.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{preview.description}</p>

              {/* Meta */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-lg bg-slate-800 px-2 py-1 text-[9px] font-bold text-slate-300">
                  <FileText size={10} className="inline mr-1" />{preview.sectionsCount} sections
                </span>
                <span className="rounded-lg bg-slate-800 px-2 py-1 text-[9px] font-bold text-slate-300">
                  {preview.pages} page
                </span>
                <span className="rounded-lg px-2 py-1 text-[9px] font-bold" style={{ color: difficultyColor[preview.difficulty], backgroundColor: `${difficultyColor[preview.difficulty]}15` }}>
                  <Star size={10} className="inline mr-1" />{preview.difficulty}
                </span>
              </div>

              {/* Suitable for */}
              <div className="mt-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Suitable for</p>
                <div className="flex flex-wrap gap-1">
                  {preview.suitableFor.map((s) => (
                    <span key={s} className="rounded-md bg-slate-800 px-2 py-0.5 text-[9px] text-slate-300">{s}</span>
                  ))}
                </div>
              </div>

              {/* Section list */}
              <div className="mt-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Sections</p>
                <div className="flex flex-wrap gap-1">
                  {preview.sectionTypes.map((s, i) => (
                    <span key={i} className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[9px] text-indigo-300 capitalize">{s}</span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => { confirmApply(preview); setPreview(null); }}
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-500">
                  Apply template
                </button>
                <button type="button" onClick={() => { handleAdd(preview); setPreview(null); }}
                  className="rounded-xl border border-slate-700 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white">
                  Add sections
                </button>
                <button type="button" onClick={() => setPreview(null)}
                  className="rounded-xl border border-slate-700 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white">
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
