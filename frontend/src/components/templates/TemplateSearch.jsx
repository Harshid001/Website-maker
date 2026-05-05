import React from 'react';
import { Search } from 'lucide-react';

export default function TemplateSearch({ value, onChange }) {
  return (
    <label className="relative block w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search templates by title, category, tags, or type"
        className="h-12 w-full rounded-2xl border border-slate-800 bg-slate-900/80 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      />
    </label>
  );
}
