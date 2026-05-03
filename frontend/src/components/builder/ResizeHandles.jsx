import React, { useCallback, useState } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { LAYOUT_MODES } from '../../data/nodeSchema';

const handles = [
  { id: 'nw', className: '-top-1.5 -left-1.5 cursor-nwse-resize' },
  { id: 'n', className: 'top-[-6px] left-1/2 -translate-x-1/2 cursor-ns-resize' },
  { id: 'ne', className: '-top-1.5 -right-1.5 cursor-nesw-resize' },
  { id: 'w', className: 'left-[-6px] top-1/2 -translate-y-1/2 cursor-ew-resize' },
  { id: 'e', className: 'right-[-6px] top-1/2 -translate-y-1/2 cursor-ew-resize' },
  { id: 'sw', className: '-bottom-1.5 -left-1.5 cursor-nesw-resize' },
  { id: 's', className: 'bottom-[-6px] left-1/2 -translate-x-1/2 cursor-ns-resize' },
  { id: 'se', className: '-bottom-1.5 -right-1.5 cursor-nwse-resize' },
];

export default function ResizeHandles({ nodeId, minWidth = 20, minHeight = 20 }) {
  const { nodesMap, resizeNodeInMap, dragNodeInMap, showToast } = useBuilderStore();
  const [liveSize, setLiveSize] = useState(null);
  
  const node = nodesMap[nodeId];

  const startResize = useCallback((event, handle) => {
    event.preventDefault();
    event.stopPropagation();

    if (!node || node.locked) {
      showToast('Locked items cannot be resized.');
      return;
    }

    const target = event.currentTarget.parentElement;
    const rect = target?.getBoundingClientRect();
    if (!rect) return;

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = rect.width;
    const startHeight = rect.height;
    
    // For free-positioning adjustments
    const isFree = node.layout?.positionMode === LAYOUT_MODES.FREE;
    const startNodeX = node.layout?.x || 0;
    const startNodeY = node.layout?.y || 0;

    let finalWidth = startWidth;
    let finalHeight = startHeight;
    let finalNodeX = startNodeX;
    let finalNodeY = startNodeY;

    const onMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      if (handle.includes('e')) finalWidth = Math.max(minWidth, Math.round(startWidth + deltaX));
      if (handle.includes('s')) finalHeight = Math.max(minHeight, Math.round(startHeight + deltaY));
      
      if (handle.includes('w')) {
        const diff = Math.min(startWidth - minWidth, deltaX);
        finalWidth = Math.round(startWidth - diff);
        if (isFree) finalNodeX = Math.round(startNodeX + diff);
      }
      
      if (handle.includes('n')) {
        const diff = Math.min(startHeight - minHeight, deltaY);
        finalHeight = Math.round(startHeight - diff);
        if (isFree) finalNodeY = Math.round(startNodeY + diff);
      }

      setLiveSize({ w: finalWidth, h: finalHeight });
      
      resizeNodeInMap(nodeId, { width: finalWidth, height: finalHeight });
      if (isFree) {
        dragNodeInMap(nodeId, { x: finalNodeX, y: finalNodeY });
      }
    };

    const onUp = () => {
      setLiveSize(null);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [node, dragNodeInMap, minHeight, minWidth, nodeId, resizeNodeInMap, showToast]);

  if (!node || node.locked) return null;

  return (
    <>
      {handles.map((handle) => (
        <span
          key={handle.id}
          role="presentation"
          onPointerDown={(event) => startResize(event, handle.id)}
          className={`absolute z-30 h-3 w-3 rounded-full border border-white bg-indigo-500 shadow-lg ${handle.className}`}
        />
      ))}
      {liveSize && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-40 pointer-events-none">
          {liveSize.w} &times; {liveSize.h}
        </div>
      )}
    </>
  );
}
