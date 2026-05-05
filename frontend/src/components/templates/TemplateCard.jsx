import React, { useState } from 'react';
import { Eye, Heart, Wand2, Star, Layers } from 'lucide-react';
import { getTypeLabel } from '../../utils/templateUtils';
import TemplateMiniPreview from '../builder/TemplateMiniPreview';

/* ── colour helpers ──────────────────────────────────────────── */
const difficultyColor = {
  Beginner: '#22c55e',
  Intermediate: '#f59e0b',
  Advanced: '#ef4444',
};

const gradientPalettes = [
  ['#0f172a', '#6366f1', '#22d3ee'],
  ['#111827', '#14b8a6', '#f59e0b'],
  ['#18181b', '#ec4899', '#8b5cf6'],
  ['#0b1120', '#22c55e', '#38bdf8'],
  ['#1f2937', '#f97316', '#facc15'],
  ['#050816', '#a855f7', '#22d3ee'],
  ['#111827', '#ef4444', '#fb7185'],
  ['#082f49', '#06b6d4', '#84cc16'],
];

const pickPalette = (id = '') => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return gradientPalettes[Math.abs(hash) % gradientPalettes.length];
};

/* ── gradient thumbnail with optional mini wireframe ─────────── */
function GradientThumbnail({ template }) {
  const [dark, accent, support] = pickPalette(template.id);
  const hasLayout = !!template.layoutPreview;

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-end overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${dark} 0%, ${accent} 55%, ${support} 100%)`,
      }}
    >
      {/* radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 78% 20%, rgba(255,255,255,0.22) 0%, transparent 55%)',
        }}
      />

      {/* wireframe preview for website templates */}
      {hasLayout && (
        <div className="relative z-[1] mx-auto mb-0 w-[78%] overflow-hidden rounded-t-xl border border-b-0 border-white/15 bg-slate-950/50 shadow-2xl shadow-black/30 backdrop-blur-sm">
          <TemplateMiniPreview layoutPreview={template.layoutPreview} className="rounded-t-lg opacity-80" />
        </div>
      )}

      {/* fallback text label when no wireframe */}
      {!hasLayout && (
        <div className="absolute bottom-5 left-5 z-[1]">
          <p className="text-xs font-semibold text-cyan-100">{getTypeLabel(template.type)}</p>
          <h3 className="mt-2 text-2xl font-black text-white drop-shadow-lg">{template.title}</h3>
        </div>
      )}
    </div>
  );
}

/* ── main premium card ───────────────────────────────────────── */
export default function TemplateCard({ template, isFavorite, onFavorite, onPreview, onUse }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasThumbnail = template.thumbnail && !imageFailed;

  const designLabel = template.designType || template.category || '';
  const diffColor = difficultyColor[template.difficulty] || '#94a3b8';

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/60 hover:shadow-indigo-950/30 hover:shadow-2xl">

      {/* ── thumbnail area ── */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        {hasThumbnail ? (
          <img
            src={template.thumbnail}
            alt={template.title}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <GradientThumbnail template={template} />
        )}

        {/* favourite heart */}
        <button
          type="button"
          onClick={() => onFavorite(template)}
          className={`absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/15 backdrop-blur-md transition-all duration-200 ${
            isFavorite
              ? 'bg-rose-500/90 text-white shadow-lg shadow-rose-500/30'
              : 'bg-black/30 text-white hover:bg-white/15'
          }`}
          aria-label={isFavorite ? 'Remove favorite' : 'Save favorite'}
        >
          <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* design type floating badge */}
        {designLabel && (
          <span className="absolute left-3 top-3 z-10 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white backdrop-blur-md">
            {designLabel}
          </span>
        )}

        {/* hover overlay with description + buttons */}
        <div className="absolute inset-0 z-[5] flex flex-col items-stretch justify-end bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="mb-4 line-clamp-2 text-[13px] leading-relaxed text-slate-200">{template.description}</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onUse(template)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white transition-colors hover:bg-indigo-500"
            >
              <Wand2 size={16} />
              Use Template
            </button>
            <button
              type="button"
              onClick={() => onPreview(template)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              <Eye size={16} />
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* ── card body ── */}
      <div className="space-y-3.5 p-5">
        {/* title row + category badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {designLabel && (
              <p className="mb-1 truncate text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
                {designLabel} Design
              </p>
            )}
            <h3 className="truncate text-lg font-bold leading-snug text-white">{template.title}</h3>
          </div>
          <span className="shrink-0 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold text-cyan-200">
            {template.category || getTypeLabel(template.type)}
          </span>
        </div>

        {/* difficulty */}
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold"
            style={{
              color: diffColor,
              backgroundColor: `${diffColor}12`,
              border: `1px solid ${diffColor}25`,
            }}
          >
            <Star size={10} fill="currentColor" />
            {template.difficulty}
          </span>
          {template.sectionsCount && (
            <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <Layers size={10} />
              {template.sectionsCount} sections
            </span>
          )}
        </div>

        {/* suitable for */}
        {template.suitableFor?.length > 0 && (
          <p className="line-clamp-2 text-[12px] leading-relaxed text-slate-400">
            <span className="font-semibold text-slate-300">Suitable for:</span>{' '}
            {template.suitableFor.slice(0, 5).join(', ')}
          </p>
        )}

        {/* tags row */}
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-200">
            {getTypeLabel(template.type)}
          </span>
          {(template.tags || []).slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-0.5 text-[10px] text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
