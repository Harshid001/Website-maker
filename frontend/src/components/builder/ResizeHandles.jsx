import React, { useCallback } from 'react';
import { useBuilderStore } from '../../store/builderStore';

const handles = [
  { id: 'se', className: '-bottom-1.5 -right-1.5 cursor-se-resize' },
  { id: 'e', className: 'right-[-6px] top-1/2 -translate-y-1/2 cursor-ew-resize' },
  { id: 's', className: 'bottom-[-6px] left-1/2 -translate-x-1/2 cursor-ns-resize' },
];

export default function ResizeHandles({ kind, sectionId, elementId, minWidth = 80, minHeight = 32 }) {
  const { selectedElement, selectedSection, updateElement, updateSection, showToast } = useBuilderStore();
  const item = kind === 'element' ? selectedElement : selectedSection;

  const startResize = useCallback((event, handle) => {
    event.preventDefault();
    event.stopPropagation();

    if (!item || item.locked) {
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

    const onMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const next = {};
      if (handle.includes('e')) next.width = `${Math.max(minWidth, Math.round(startWidth + deltaX))}px`;
      if (handle.includes('s')) next.height = `${Math.max(minHeight, Math.round(startHeight + deltaY))}px`;
      if (kind === 'element') updateElement(sectionId, elementId, { styles: next });
      else updateSection(sectionId, { styles: next });
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [elementId, item, kind, minHeight, minWidth, sectionId, showToast, updateElement, updateSection]);

  if (!item || item.locked) return null;

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
    </>
  );
}
