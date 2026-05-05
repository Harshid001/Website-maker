import { useBuilderStore } from '../../store/builderStore';

export default function AlignmentGuides({ guides = [], active = false }) {
  const { selectedItem, snapEnabled } = useBuilderStore();
  if (!snapEnabled) return null;

  if (active && guides.length) {
    return (
      <div className="pointer-events-none absolute inset-0 z-[10001]">
        {guides.map((guide, index) => {
          if (guide.axis === 'x') {
            return (
              <div key={`${guide.axis}-${guide.position}-${index}`}>
                <div
                  className="absolute w-px bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.75)]"
                  style={{ left: guide.position, top: guide.start, height: Math.max(1, guide.end - guide.start) }}
                />
                {guide.label && (
                  <span className="absolute -translate-x-1/2 rounded-full bg-sky-500 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-lg" style={{ left: guide.position, top: Math.max(guide.start + 6, 6) }}>
                    {guide.label}
                  </span>
                )}
              </div>
            );
          }
          return (
            <div key={`${guide.axis}-${guide.position}-${index}`}>
              <div
                className="absolute h-px bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.75)]"
                style={{ top: guide.position, left: guide.start, width: Math.max(1, guide.end - guide.start) }}
              />
              {guide.label && (
                <span className="absolute -translate-y-1/2 rounded-full bg-sky-500 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-lg" style={{ left: Math.max(guide.start + 6, 6), top: guide.position }}>
                  {guide.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (!selectedItem) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-sky-400/45" />
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-sky-400/25" />
      <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-sky-500 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-white">
        Page center
      </div>
    </div>
  );
}
