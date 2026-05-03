import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, Maximize2, Minus, Plus } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

const MIN_ZOOM = 10;
const MAX_ZOOM = 400;
const quickZooms = [25, 50, 75, 100, 144, 200, 300, 400];

const clampZoom = (value) => {
  const numeric = Number.parseFloat(String(value).replace('%', ''));
  if (!Number.isFinite(numeric)) return null;
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(numeric)));
};

export default function ZoomControls() {
  const { zoom, setZoom, fitToScreen, resetZoom, zoomIn, zoomOut } = useBuilderStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftZoom, setDraftZoom] = useState(String(Math.round(zoom)));
  const [panelPosition, setPanelPosition] = useState({ top: 64, right: 16 });
  const controlRef = useRef(null);

  const updatePanelPosition = useCallback(() => {
    const rect = controlRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Check if there's enough space below, otherwise open above
    const spaceBelow = window.innerHeight - rect.bottom;
    const panelHeight = 300; // estimated max height
    
    if (spaceBelow < panelHeight) {
      setPanelPosition({
        bottom: window.innerHeight - rect.top + 8,
        right: Math.max(12, window.innerWidth - rect.right),
      });
    } else {
      setPanelPosition({
        top: rect.bottom + 8,
        right: Math.max(12, window.innerWidth - rect.right),
      });
    }
  }, []);

  useEffect(() => {
    if (!editing) setDraftZoom(String(Math.round(zoom)));
  }, [editing, zoom]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!controlRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    updatePanelPosition();
    window.addEventListener('resize', updatePanelPosition);
    window.addEventListener('scroll', updatePanelPosition, true);
    return () => {
      window.removeEventListener('resize', updatePanelPosition);
      window.removeEventListener('scroll', updatePanelPosition, true);
    };
  }, [open, updatePanelPosition]);

  const commitDraftZoom = () => {
    const cleaned = draftZoom.trim();
    if (!cleaned) {
      setDraftZoom(String(Math.round(zoom)));
      setEditing(false);
      return;
    }

    const nextZoom = clampZoom(cleaned);
    if (!nextZoom) {
      setDraftZoom(String(Math.round(zoom)));
      setEditing(false);
      return;
    }

    setZoom(nextZoom);
    setDraftZoom(String(nextZoom));
    setEditing(false);
  };

  const togglePanel = () => {
    updatePanelPosition();
    setOpen((value) => !value);
  };

  return (
    <div ref={controlRef} className="relative flex h-10 items-center gap-1 px-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
      <button
        type="button"
        onClick={fitToScreen}
        className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        title="Fit canvas to screen (Ctrl + 1)"
      >
        <Maximize2 size={12} />
        Fit
      </button>

      <span className="h-5 w-px bg-slate-800" />

      <button
        type="button"
        onClick={() => zoomOut(10)}
        className="flex h-8 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        title="Zoom out"
      >
        <Minus size={13} />
      </button>

      <label className="relative block h-8 w-[62px]">
        <input
          value={draftZoom}
          onFocus={() => setEditing(true)}
          onChange={(event) => setDraftZoom(event.target.value.replace(/[^\d.%]/g, ''))}
          onBlur={commitDraftZoom}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur();
            if (event.key === 'Escape') {
              setDraftZoom(String(Math.round(zoom)));
              setEditing(false);
              event.currentTarget.blur();
            }
          }}
          className="h-8 w-full rounded-lg border border-slate-800 bg-slate-900 py-0 pl-2 pr-5 text-right text-[10px] font-black tracking-widest text-white outline-none transition-colors focus:border-indigo-500 focus:bg-slate-950"
          aria-label="Zoom percentage"
        />
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500">%</span>
      </label>

      <button
        type="button"
        onClick={() => zoomIn(10)}
        className="flex h-8 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        title="Zoom in"
      >
        <Plus size={13} />
      </button>

      <button
        type="button"
        onClick={togglePanel}
        className="flex h-8 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        title="Open zoom slider"
      >
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="fixed z-[120] max-h-72 w-[280px] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl shadow-black/50 custom-scrollbar"
          style={{ 
            top: panelPosition.top !== undefined ? panelPosition.top : 'auto', 
            bottom: panelPosition.bottom !== undefined ? panelPosition.bottom : 'auto',
            right: panelPosition.right 
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-400">Canvas zoom</p>
              <p className="mt-1 text-lg font-black tracking-tight text-white">{Math.round(zoom)}%</p>
            </div>
            <button
              type="button"
              onClick={resetZoom}
              className="rounded-xl border border-slate-800 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              100%
            </button>
          </div>

          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step="1"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="w-full accent-indigo-500"
            aria-label="Zoom slider"
          />

          <div className="mt-4 grid grid-cols-4 gap-2">
            {quickZooms.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setZoom(value)}
                className={`rounded-xl border px-2 py-2 text-[9px] font-black uppercase tracking-widest transition-colors ${
                  Math.round(zoom) === value
                    ? 'border-indigo-500 bg-indigo-600 text-white'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {value}%
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={fitToScreen}
            className="mt-3 w-full rounded-xl bg-indigo-600 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-500"
          >
            Fit to screen
          </button>
        </div>
      )}
    </div>
  );
}
