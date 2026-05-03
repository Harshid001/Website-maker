import { AlertTriangle, Trash2 } from 'lucide-react';
import { useBuilderStore } from '../../../store/builderStore';
import { resolveInteraction } from '../../../utils/interactionResolver';

export default function InteractionList() {
  const { project, selectedInteractionId, selectInteraction, deleteInteraction } = useBuilderStore();

  if (!project?.interactions?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-4 text-xs leading-5 text-slate-500">
        Prototype connections will appear here after you drag a blue connector handle.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {project.interactions.map((interaction) => {
        const resolved = resolveInteraction(interaction, project);
        return (
          <div key={interaction.id} className={`rounded-2xl border p-3 ${selectedInteractionId === interaction.id ? 'border-sky-400 bg-sky-500/10' : 'border-slate-800 bg-slate-950'}`}>
            <button type="button" onClick={() => selectInteraction(interaction.id)} className="w-full text-left">
              <p className="text-xs font-black text-white">{resolved.sourceLabel} to {resolved.targetLabel}</p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">{interaction.trigger} / {interaction.action}</p>
              {!resolved.valid && (
                <p className="mt-2 inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-amber-200">
                  <AlertTriangle size={11} />
                  Needs target
                </p>
              )}
            </button>
            <button type="button" onClick={() => deleteInteraction(interaction.id)} className="mt-2 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-red-300 hover:text-red-200">
              <Trash2 size={11} />
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}
