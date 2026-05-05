import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

const sortOptions = [
  { value: 'popular', label: 'Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'az', label: 'A-Z' },
  { value: 'beginner', label: 'Beginner first' },
];

export default function TemplateFilters({
  categories,
  tags,
  category,
  tag,
  sortBy,
  categoryLabel = 'All categories',
  tagLabel = 'All tags',
  onCategoryChange,
  onTagChange,
  onSortChange,
}) {
  const selectClass =
    'h-11 rounded-xl border border-slate-800 bg-slate-900 px-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3 lg:flex-row lg:items-center">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
        <SlidersHorizontal size={17} className="text-cyan-300" />
        Filters
      </div>

      <select value={category} onChange={(event) => onCategoryChange(event.target.value)} className={selectClass}>
        <option value="">{categoryLabel}</option>
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select value={tag} onChange={(event) => onTagChange(event.target.value)} className={selectClass}>
        <option value="">{tagLabel}</option>
        {tags.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select value={sortBy} onChange={(event) => onSortChange(event.target.value)} className={`${selectClass} lg:ml-auto`}>
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            Sort: {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
