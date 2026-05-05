const zoneStyle = (zone, isBest) => {
  const rect = zone.innerRect || zone.rect;
  const valid = zone.isValid ?? zone.status === 'valid';
  const warning = zone.status === 'warning';
  return {
    left: rect.left ?? rect.x ?? zone.x ?? 0,
    top: rect.top ?? rect.y ?? zone.y ?? 0,
    width: rect.width,
    height: rect.height,
    background: warning
      ? (isBest ? 'rgba(234, 179, 8, 0.24)' : 'rgba(234, 179, 8, 0.14)')
      : valid
      ? (isBest ? 'rgba(34, 197, 94, 0.25)' : 'rgba(34, 197, 94, 0.16)')
      : 'rgba(239, 68, 68, 0.12)',
    border: warning
      ? `${isBest ? 3 : 2}px dashed #eab308`
      : valid
      ? `${isBest ? 3 : 2}px solid #22c55e`
      : '2px dashed #ef4444',
    boxShadow: warning
      ? (isBest ? '0 0 28px rgba(234, 179, 8, 0.45)' : '0 0 18px rgba(234, 179, 8, 0.28)')
      : valid
      ? (isBest ? '0 0 28px rgba(34, 197, 94, 0.55)' : '0 0 20px rgba(34, 197, 94, 0.35)')
      : undefined,
    opacity: zone.pointerInside || isBest ? 1 : 0.72,
  };
};

export default function DropZoneOverlay({ zones = [], bestZoneId, activeDropZoneId, active = false }) {
  if (!active || !zones.length) return null;
  const resolvedActiveId = activeDropZoneId || bestZoneId;

  return (
    <div className="drop-zone-layer pointer-events-none absolute inset-0 z-[9999]">
      {zones.map((zone) => {
        const isBest = zone.id === resolvedActiveId || zone.sectionId === resolvedActiveId;
        const shouldLabel = isBest || zone.pointerInside || zones.length <= 5;
        const valid = zone.isValid ?? zone.status === 'valid';
        const warning = zone.status === 'warning';
        return (
          <div
            key={`${zone.id}-${zone.status}`}
            className={`absolute rounded-lg transition-[opacity,box-shadow,border-color,background-color] duration-150 ${warning ? 'drop-zone-warning' : valid ? 'drop-zone-valid' : 'drop-zone-invalid'} ${isBest ? 'drop-zone-active' : ''}`}
            style={zoneStyle(zone, isBest)}
          >
            {shouldLabel && (
              <span
                className="absolute left-2 top-2 max-w-[220px] truncate rounded-md bg-slate-950/90 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg"
              >
                {zone.label || zone.reason}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
