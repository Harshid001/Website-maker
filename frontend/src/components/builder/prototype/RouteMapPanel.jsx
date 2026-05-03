import { ArrowRight, GitBranch } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { resolveInteraction } from '../../../utils/interactionResolver';
import { buildRouteRows } from '../../../utils/routeValidator';

export default function RouteMapPanel() {
  const { project } = useBuilderStore();
  const rows = buildRouteRows(project);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <div className="mb-3 flex items-center gap-2 text-sky-300">
          <GitBranch size={15} />
          <p className="text-[10px] font-black uppercase tracking-widest">Route Map</p>
        </div>
        <div className="space-y-2">
          {(project?.interactions || []).slice(0, 6).map((interaction) => {
            const resolved = resolveInteraction(interaction, project);
            return (
              <div key={interaction.id} className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
                <span className="min-w-0 flex-1 truncate">{resolved.sourceLabel}</span>
                <ArrowRight size={12} className="text-sky-400" />
                <span className="min-w-0 flex-1 truncate text-sky-200">{resolved.targetLabel}</span>
              </div>
            );
          })}
          {!project?.interactions?.length && <p className="text-xs text-slate-500">No route links yet.</p>}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
        <div className="grid grid-cols-[0.8fr_0.8fr_0.7fr] border-b border-slate-800 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500">
          <span>Source</span>
          <span>Action</span>
          <span>Path</span>
        </div>
        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-[0.8fr_0.8fr_0.7fr] gap-2 border-b border-slate-900 px-3 py-2 text-[10px] font-bold text-slate-300 last:border-0">
            <span className="truncate">{row.sourcePage}</span>
            <span className="truncate">{row.action}</span>
            <span className="truncate text-sky-300">{row.path || '-'}</span>
          </div>
        ))}
        {!rows.length && <p className="p-3 text-xs text-slate-500">Route table is empty.</p>}
      </div>
    </div>
  );
}
