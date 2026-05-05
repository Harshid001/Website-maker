const titleForType = (type = 'element') => (
  String(type)
    .replace(/([A-Z])/g, ' $1')
    .replace(/^\w/, (letter) => letter.toUpperCase())
);

export default function DragPreview({ placement }) {
  const rect = placement?.previewRect || placement?.ghostRect;
  if (!placement?.active || !rect) return null;

  const valid = Boolean(placement.activeDropZone || placement.bestZone);
  const warning = (placement.activeDropZone || placement.bestZone)?.status === 'warning';
  const label = placement.message || (valid ? 'Drop here' : 'Cannot place here');

  return (
    <div className="pointer-events-none absolute inset-0 z-[10000]">
      <div
        className={`absolute rounded-lg border-2 border-dashed transition-transform duration-100 ${
          warning
            ? 'border-amber-400 bg-amber-300/14 shadow-[0_0_28px_rgba(234,179,8,0.28)]'
            : valid
              ? 'border-violet-400 bg-violet-400/12 shadow-[0_0_28px_rgba(139,92,246,0.32)]'
              : 'border-red-400 bg-red-500/12'
        }`}
        style={{
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        }}
      >
        <div className={`absolute -top-9 left-0 flex max-w-[280px] items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-widest shadow-xl ${
          warning ? 'bg-amber-500 text-slate-950' : valid ? 'bg-violet-600 text-white' : 'bg-red-500 text-white'
        }`}
        >
          <span className="truncate">{label}</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-md bg-slate-950/82 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white">
            {titleForType(placement.draggedElement?.type)}
          </span>
        </div>
      </div>
    </div>
  );
}
