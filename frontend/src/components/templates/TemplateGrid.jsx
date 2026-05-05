import React from 'react';
import TemplateCard from './TemplateCard';

export default function TemplateGrid({ templates, favorites, onFavorite, onPreview, onUse }) {
  if (!templates.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 p-14 text-center">
        <h3 className="text-xl font-bold text-white">No templates found</h3>
        <p className="mt-2 text-sm text-slate-400">
          Try a different search term, category, tag, or sort option.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          isFavorite={favorites.includes(template.id)}
          onFavorite={onFavorite}
          onPreview={onPreview}
          onUse={onUse}
        />
      ))}
    </div>
  );
}
