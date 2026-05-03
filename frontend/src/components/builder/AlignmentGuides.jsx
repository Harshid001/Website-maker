import { useBuilderStore } from '../../store/builderStore';

export default function AlignmentGuides() {
  const { selectedItem, snapEnabled } = useBuilderStore();
  if (!snapEnabled || !selectedItem) return null;

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
