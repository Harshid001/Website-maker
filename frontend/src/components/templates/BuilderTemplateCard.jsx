import React from 'react';
import { Eye, Heart, Layers, Plus } from 'lucide-react';
import TemplateMiniPreview from '../builder/TemplateMiniPreview';

const difficultyColor = { Beginner: '#22c55e', Intermediate: '#f59e0b', Advanced: '#ef4444' };

/**
 * Compact template card designed for the builder left-panel sidebar.
 * Uses the same websiteDesignTemplates data but displays in a small form-factor.
 */
export default function BuilderTemplateCard({
  template,
  isFavorite,
  onFavorite,
  onPreview,
  onApply,
  onAdd,
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 transition-all hover:border-indigo-500/50">
      {/* Thumbnail */}
      <div className="relative overflow-hidden bg-slate-900 p-2">
        <TemplateMiniPreview layoutPreview={template.layoutPreview} className="rounded-lg" />
        {/* Design type badge */}
        <span className="absolute left-3 top-3 rounded-md bg-indigo-600/90 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest text-white">
          {template.designType}
        </span>
        {/* Favorite */}
        {onFavorite && (
          <button
            type="button"
            onClick={() => onFavorite(template.id)}
            className={`absolute right-3 top-3 transition-colors ${
              isFavorite
                ? 'text-pink-400'
                : 'text-slate-500 opacity-0 group-hover:opacity-100 hover:text-pink-300'
            }`}
          >
            <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-[11px] font-black uppercase tracking-wider leading-tight text-white">
          {template.title}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[8px] text-slate-500">
            {template.sectionsCount} sections • {template.pages} page
          </span>
          <span
            className="rounded px-1 py-0.5 text-[7px] font-bold uppercase"
            style={{
              color: difficultyColor[template.difficulty],
              backgroundColor: `${difficultyColor[template.difficulty]}15`,
            }}
          >
            {template.difficulty}
          </span>
        </div>
        <p className="mt-1 text-[8px] leading-relaxed text-slate-500">
          <span className="font-semibold text-slate-600">Suitable for:</span>{' '}
          {template.suitableFor.join(', ')}
        </p>

        {/* Buttons */}
        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => onPreview(template)}
            className="flex items-center justify-center gap-1 rounded-lg border border-slate-700 px-1.5 py-1.5 text-[8px] font-black uppercase tracking-widest text-slate-300 hover:border-slate-600 hover:text-white"
          >
            <Eye size={11} /> Preview
          </button>
          <button
            type="button"
            onClick={() => onApply(template)}
            className="flex items-center justify-center gap-1 rounded-lg bg-indigo-600 px-1.5 py-1.5 text-[8px] font-black uppercase tracking-widest text-white hover:bg-indigo-500"
          >
            <Layers size={11} /> Apply
          </button>
          <button
            type="button"
            onClick={() => onAdd(template)}
            className="flex items-center justify-center gap-1 rounded-lg border border-slate-700 px-1.5 py-1.5 text-[8px] font-black uppercase tracking-widest text-slate-300 hover:border-slate-600 hover:text-white"
          >
            <Plus size={11} /> Add
          </button>
        </div>
      </div>
    </article>
  );
}
