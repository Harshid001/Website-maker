import { useEffect } from 'react';
import { useBuilderStore } from '../../../store/builderStore';

const readTargetData = (element, sourceNodeId) => {
  const target = element?.closest?.('[data-prototype-target], [data-node-id]');
  if (!target) return null;
  if (target.dataset.nodeId === sourceNodeId) return null;
  if (target.dataset.prototypeTarget === 'page') {
    return { targetType: 'page', targetPageId: target.dataset.pageId };
  }
  if (target.dataset.prototypeTarget === 'external') {
    return { targetType: 'external', targetUrl: target.dataset.targetUrl || '' };
  }
  if (target.dataset.elementId) {
    return {
      targetType: 'node',
      targetPageId: target.dataset.pageId,
      targetSectionId: target.dataset.sectionId,
      targetNodeId: target.dataset.elementId,
    };
  }
  if (target.dataset.sectionId) {
    return {
      targetType: 'section',
      targetPageId: target.dataset.pageId,
      targetSectionId: target.dataset.sectionId,
    };
  }
  return null;
};

export default function ConnectionHandle({ sourceNodeId, sourcePageId }) {
  const { builderMode, startConnection, updateConnectionDrag, completeConnection, openInteractionModal } = useBuilderStore();

  useEffect(() => () => window.getSelection?.()?.removeAllRanges?.(), []);

  if (builderMode !== 'prototype') return null;

  const handlePointerDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    startConnection(sourceNodeId, sourcePageId);
    updateConnectionDrag({ x: event.clientX, y: event.clientY });

    const handlePointerMove = (moveEvent) => {
      updateConnectionDrag({ x: moveEvent.clientX, y: moveEvent.clientY });
    };

    const handlePointerUp = (upEvent) => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      const element = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
      const targetData = readTargetData(element, sourceNodeId);
      if (targetData) completeConnection(targetData);
      else openInteractionModal();
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <button
      type="button"
      aria-label="Create prototype connection"
      title="Drag to create a prototype connection"
      onPointerDown={handlePointerDown}
      className="absolute -right-3 top-1/2 z-40 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-white bg-sky-400 shadow-lg shadow-sky-500/40 ring-4 ring-sky-400/20 hover:scale-110"
      style={{ cursor: 'crosshair' }}
    />
  );
}
