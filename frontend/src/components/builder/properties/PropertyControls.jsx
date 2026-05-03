import React from 'react';

export function PropertyGroup({ title, children }) {
  return (
    <section className="border-b border-slate-800 px-5 py-5">
      <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function TextInput({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
      <input
        type={type}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
      />
    </label>
  );
}

export function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
      <textarea
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
      />
    </label>
  );
}

export function SelectInput({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
      <select
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
      >
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ToggleInput({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
      <input type="checkbox" checked={Boolean(checked)} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-indigo-600" />
    </label>
  );
}

export function ColorInput({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
      <input type="color" value={value || '#ffffff'} onChange={(event) => onChange(event.target.value)} className="h-8 w-10 rounded-lg border border-slate-800 bg-transparent" />
    </label>
  );
}

export function MiniButton({ children, onClick, tone = 'default' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
        tone === 'danger' ? 'bg-red-500/10 text-red-200 hover:bg-red-500/20' : 'bg-slate-950 text-slate-300 hover:bg-indigo-600 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}
