import { FileText, Link2, Plus } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';

export default function PageTargetPanel() {
  const { project, currentPage, addPage, switchPage, showToast } = useBuilderStore();

  return (
    <div className="pointer-events-auto absolute right-4 top-4 z-40 w-56 rounded-2xl border border-sky-300/40 bg-white/95 p-3 text-slate-900 shadow-2xl shadow-sky-900/10 backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-sky-500">Prototype targets</p>
          <h3 className="text-sm font-black uppercase tracking-tight">Pages</h3>
        </div>
        <Link2 size={16} className="text-sky-500" />
      </div>
      <div className="max-h-72 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
        {(project?.pages || []).map((page) => (
          <button
            key={page.id}
            type="button"
            data-node-id={`page-target-${page.id}`}
            data-prototype-target="page"
            data-page-id={page.id}
            onClick={(event) => {
              event.stopPropagation();
              switchPage(page.id);
            }}
            className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-black uppercase tracking-widest transition-all ${
              currentPage?.id === page.id ? 'border-sky-400 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700'
            }`}
          >
            <FileText size={14} />
            <span className="min-w-0 flex-1 truncate">{page.name}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          addPage(`Page ${(project?.pages?.length || 0) + 1}`);
          showToast('New page target added.', 'success');
        }}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-sky-400"
      >
        <Plus size={14} />
        Add page target
      </button>
    </div>
  );
}
