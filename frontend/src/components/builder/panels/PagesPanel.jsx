import { AlertTriangle, Copy, Home, Plus, Trash2 } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { PanelShell } from './PanelShell';
import InteractionList from '../prototype/InteractionList';
import RouteMapPanel from '../prototype/RouteMapPanel';

export default function PagesPanel() {
  const { project, currentPage, addPage, renamePage, duplicatePage, deletePage, setHomePage, switchPage, validateRoutes, deleteInteraction, showToast } = useBuilderStore();
  const warnings = validateRoutes();

  return (
    <PanelShell eyebrow="Prototype" title="Pages & Routing">
      <button type="button" onClick={() => addPage(`Page ${project.pages.length + 1}`)} className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-xs font-black uppercase tracking-widest text-white">
        <Plus size={15} />
        Add Page
      </button>
      <div className="space-y-3">
        {(project?.pages || []).map((page) => (
          <div key={page.id} className={`rounded-2xl border p-3 ${currentPage?.id === page.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950'}`}>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => switchPage(page.id)} className="flex-1 text-left">
                <input value={page.name} onChange={(event) => renamePage(page.id, event.target.value)} className="w-full rounded-lg bg-transparent text-xs font-black uppercase tracking-widest text-white outline-none" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">/{page.slug}</span>
              </button>
              <button type="button" title="Set home page" onClick={() => setHomePage(page.id)} className={page.isHome ? 'text-indigo-300' : 'text-slate-500 hover:text-white'}><Home size={14} /></button>
              <button type="button" title="Duplicate page" onClick={() => duplicatePage(page.id)} className="text-slate-500 hover:text-white"><Copy size={14} /></button>
              <button type="button" title="Delete page" onClick={() => deletePage(page.id)} className="text-red-300 hover:text-red-200"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-3">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Broken route validation</p>
          {warnings.length ? (
            <div className="space-y-2">
              {warnings.map((warning) => (
                <div key={warning.id} className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3">
                  <p className="flex items-start gap-2 text-xs leading-5 text-amber-100">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    <span>{warning.message}</span>
                  </p>
                  {warning.interactionId && (
                    <button
                      type="button"
                      onClick={() => deleteInteraction(warning.interactionId)}
                      className="mt-2 rounded-lg bg-amber-500/20 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-amber-100"
                    >
                      Remove broken connection
                    </button>
                  )}
                  {!warning.interactionId && (
                    <button
                      type="button"
                      onClick={() => showToast('Open the page list above to fix this route warning.')}
                      className="mt-2 rounded-lg bg-amber-500/20 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-amber-100"
                    >
                      Fix manually
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs text-emerald-100">All prototype routes look valid.</div>
          )}
        </div>
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Interactions</p>
          <InteractionList />
        </div>
        <RouteMapPanel />
      </div>
    </PanelShell>
  );
}
