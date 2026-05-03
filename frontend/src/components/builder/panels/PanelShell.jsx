import React from 'react';

export function PanelShell({ title, eyebrow, children }) {
  return (
    <div className="h-full overflow-y-auto p-5 custom-scrollbar">
      <div className="mb-5">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-black uppercase tracking-tight text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function PanelSection({ title, children }) {
  return (
    <section className="mb-6">
      <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

export function ActionButton({ label, description, onClick, onDragStart, icon: Icon }) {
  return (
    <button
      type="button"
      draggable={Boolean(onDragStart)}
      onDragStart={onDragStart}
      onClick={onClick}
      className="group w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 text-left transition-all hover:border-indigo-500/60 hover:bg-indigo-500/10"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white">
            <Icon size={16} />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-widest text-white">{label}</p>
          {description && <p className="mt-1 text-[10px] leading-4 text-slate-500">{description}</p>}
        </div>
      </div>
    </button>
  );
}
