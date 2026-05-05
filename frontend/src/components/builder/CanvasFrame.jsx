import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import { getDeviceWidth } from '../../utils/renderHelpers';
import PrototypeOverlay from './prototype/PrototypeOverlay';
import AlignmentGuides from './AlignmentGuides';

export default function CanvasFrame({ children, showPrototypeOverlay = true }) {
  const { activeDevice, activeTool, project, currentPage, zoom, setZoom, fitRequestId, setCanvasPan, dragState } = useBuilderStore();
  const outerRef = useRef(null);
  const frameRef = useRef(null);
  const panRef = useRef(null);
  const [availableSize, setAvailableSize] = useState({ width: 1600, height: 900 });
  const [frameHeight, setFrameHeight] = useState(900);
  const [isPanning, setIsPanning] = useState(false);
  const width = getDeviceWidth(activeDevice);
  const scale = zoom / 100;
  const scaledWidth = Math.ceil(width * scale);
  const scaledHeight = Math.ceil(frameHeight * scale);

  useEffect(() => {
    if (!outerRef.current) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setAvailableSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(outerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!frameRef.current) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setFrameHeight(Math.max(1, entry.contentRect.height));
    });
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!fitRequestId) return;
    const paddedWidth = Math.max(240, availableSize.width - 112);
    const paddedHeight = Math.max(240, availableSize.height - 132);
    const fittedScale = Math.min(paddedWidth / width, paddedHeight / Math.max(frameHeight, 1));
    setZoom(fittedScale * 100);
  }, [availableSize.height, availableSize.width, fitRequestId, frameHeight, setZoom, width]);

  const handleWheel = (event) => {
    if (!outerRef.current) return;
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      setZoom((current) => current + (event.deltaY < 0 ? 5 : -5));
      return;
    }
    if (event.shiftKey) {
      outerRef.current.scrollLeft += event.deltaY;
    }
  };

  const mouseRef = useRef(null);
  const autoPanRef = useRef(null);

  const stopAutoPan = () => {
    if (autoPanRef.current) {
      cancelAnimationFrame(autoPanRef.current);
      autoPanRef.current = null;
    }
  };

  useEffect(() => {
    if (activeTool !== 'hand' || dragState?.isDragging) {
      stopAutoPan();
    }
  }, [activeTool, dragState?.isDragging]);

  const beginPan = (event) => {
    if (event.button !== 1 && activeTool !== 'hand') return;
    if (dragState?.isDragging) return;
    event.preventDefault();
    panRef.current = {
      x: event.clientX,
      y: event.clientY,
      left: outerRef.current?.scrollLeft || 0,
      top: outerRef.current?.scrollTop || 0,
    };
    mouseRef.current = { x: event.clientX, y: event.clientY };
    setIsPanning(true);
    outerRef.current?.setPointerCapture?.(event.pointerId);
  };

  const updatePan = (event) => {
    if (!panRef.current || !outerRef.current) return;
    
    mouseRef.current = { x: event.clientX, y: event.clientY };
    
    outerRef.current.scrollLeft = panRef.current.left - (event.clientX - panRef.current.x);
    outerRef.current.scrollTop = panRef.current.top - (event.clientY - panRef.current.y);
    setCanvasPan({ x: outerRef.current.scrollLeft, y: outerRef.current.scrollTop });

    const rect = outerRef.current.getBoundingClientRect();
    const EDGE = 40;
    const { x, y } = mouseRef.current;
    
    if (
      x - rect.left < EDGE || 
      rect.right - x < EDGE || 
      y - rect.top < EDGE || 
      rect.bottom - y < EDGE
    ) {
      if (!autoPanRef.current) {
        let lastTime = performance.now();
        const loop = (time) => {
          if (!mouseRef.current || !outerRef.current || !panRef.current) {
            autoPanRef.current = null;
            return;
          }
          
          const dt = time - lastTime;
          lastTime = time;
          
          const currentMouse = mouseRef.current;
          const currentRect = outerRef.current.getBoundingClientRect();
          const SPEED = 0.8;
          
          let dx = 0;
          let dy = 0;
          
          if (currentMouse.x - currentRect.left < EDGE) dx = -SPEED * dt;
          else if (currentRect.right - currentMouse.x < EDGE) dx = SPEED * dt;
          
          if (currentMouse.y - currentRect.top < EDGE) dy = -SPEED * dt;
          else if (currentRect.bottom - currentMouse.y < EDGE) dy = SPEED * dt;
          
          if (dx !== 0 || dy !== 0) {
            outerRef.current.scrollLeft += dx;
            outerRef.current.scrollTop += dy;
            panRef.current.left += dx;
            panRef.current.top += dy;
            setCanvasPan({ x: outerRef.current.scrollLeft, y: outerRef.current.scrollTop });
            autoPanRef.current = requestAnimationFrame(loop);
          } else {
            autoPanRef.current = null;
          }
        };
        autoPanRef.current = requestAnimationFrame(loop);
      }
    } else {
      stopAutoPan();
    }
  };

  const endPan = (event) => {
    stopAutoPan();
    if (!panRef.current) return;
    panRef.current = null;
    mouseRef.current = null;
    setIsPanning(false);
    outerRef.current?.releasePointerCapture?.(event.pointerId);
  };

  return (
    <div
      ref={outerRef}
      onWheel={handleWheel}
      onPointerDown={beginPan}
      onPointerMove={updatePan}
      onPointerUp={endPan}
      onPointerCancel={endPan}
      className={`h-full w-full overflow-auto p-4 lg:p-8 custom-scrollbar ${activeTool === 'hand' ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
    >
      <div className="min-h-full flex flex-col transition-[width] duration-300" style={{ minWidth: Math.max(scaledWidth + 220, availableSize.width - 32) }}>
        <div className="m-auto transition-[width,height] duration-300" style={{ width: scaledWidth, minHeight: scaledHeight }}>
          <div className="mx-auto mb-3 flex w-fit items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/95 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-300 shadow-xl">
            <span className="text-white">{currentPage?.name || 'Home'} Page</span>
            <span className="text-indigo-300">{activeDevice}</span>
            <span>{width}px canvas</span>
            <span>{Math.round(zoom)}%</span>
          </div>
        <div className="transition-transform duration-200" style={{ width, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <div ref={frameRef} className="rounded-2xl border border-slate-700/70 bg-white shadow-2xl shadow-black/40 overflow-hidden">
          <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            </div>
            <div className="mx-auto flex h-6 max-w-md flex-1 items-center gap-2 rounded-md border border-slate-200 bg-white px-3">
              <Search size={11} className="text-slate-400" />
              <span className="truncate text-[9px] font-bold uppercase tracking-widest text-slate-400">
                shopcraft.local/{project?.slug || 'website'}/{currentPage?.slug || 'home'}
              </span>
            </div>
          </div>
          <div className="relative min-h-[72vh] bg-white">
            {children}
            <AlignmentGuides />
            {showPrototypeOverlay && <PrototypeOverlay />}
          </div>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
}
