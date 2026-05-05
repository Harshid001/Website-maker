import { Undo2, Redo2 } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import DeviceSwitcher from './DeviceSwitcher';
import ZoomControls from './ZoomControls';

export default function BottomCanvasToolbar() {
  const { history, future, undo, redo } = useBuilderStore();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-[calc(100%-1rem)] flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-950/90 px-3 py-2 shadow-2xl shadow-black/45 backdrop-blur-xl">
        <DeviceSwitcher />

        <div className="hidden h-8 w-px bg-slate-800 sm:block" />

        <ZoomControls />

        <div className="hidden h-8 w-px bg-slate-800 sm:block" />

        <div className="flex items-center p-1">
          <button
            type="button"
            title="Undo (Ctrl + Z)"
            aria-label="Undo"
            onClick={undo}
            disabled={!history.length}
            className="flex h-8 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Undo2 size={15} />
          </button>
          <button
            type="button"
            title="Redo (Ctrl + Y)"
            aria-label="Redo"
            onClick={redo}
            disabled={!future.length}
            className="flex h-8 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Redo2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
