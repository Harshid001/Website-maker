import { useCallback, useEffect, useRef, useState } from 'react';
import { calculatePlacement, getDefaultElementSize } from '../../utils/placementEngine';

const idlePlacement = {
  active: false,
  draggedElement: null,
  zones: [],
  bestZone: null,
  activeZone: null,
  activeDropZone: null,
  activeDropZoneId: null,
  previewRect: null,
  ghostRect: null,
  guides: [],
  snapGuides: [],
  warnings: [],
  warning: null,
  localPlacement: null,
  message: '',
};

export function useSmartDrag({
  activeDevice,
  measureDropZones,
  clientPointToCanvas,
  clientSizeToCanvas,
  onDragStateChange,
}) {
  const [placement, setPlacement] = useState(idlePlacement);
  const placementRef = useRef(idlePlacement);
  const sessionRef = useRef(null);
  const measurementsRef = useRef(null);
  const rafRef = useRef(null);

  const publishPlacement = useCallback((nextPlacement) => {
    placementRef.current = nextPlacement;
    setPlacement(nextPlacement);
    if (nextPlacement?.active && nextPlacement.draggedElement) {
      const activeDropZone = nextPlacement.activeDropZone || nextPlacement.bestZone || null;
      onDragStateChange?.({
        isDragging: true,
        dragType: nextPlacement.draggedElement.dragType === 'move-node'
          ? 'move-element'
          : nextPlacement.draggedElement.dragType || null,
        elementId: nextPlacement.draggedElement.id || null,
        elementType: nextPlacement.draggedElement.type || null,
        draggedElementId: nextPlacement.draggedElement.id || null,
        draggedElementType: nextPlacement.draggedElement.type || null,
        draggedElementSize: {
          width: nextPlacement.draggedElement.width || 0,
          height: nextPlacement.draggedElement.height || 0,
        },
        mousePosition: nextPlacement.draggedElement.pointer || { x: 0, y: 0 },
        currentMousePoint: nextPlacement.draggedElement.pointer || { x: 0, y: 0 },
        dragOffset: nextPlacement.draggedElement.dragOffset || null,
        originalRect: nextPlacement.draggedElement.originalRect || null,
        source: nextPlacement.draggedElement.dragType === 'new-element' || nextPlacement.draggedElement.dragType === 'new-section'
          ? 'new-element'
          : 'existing-element',
        activeDropZoneId: activeDropZone?.id || null,
        activeDropZone,
        dropZones: nextPlacement.zones || [],
        previewRect: nextPlacement.previewRect || null,
        snapGuides: nextPlacement.snapGuides || nextPlacement.guides || [],
        warning: nextPlacement.warning || null,
      });
      return;
    }
    onDragStateChange?.(null);
  }, [onDragStateChange]);

  const calculateNextPlacement = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return placementRef.current;

    if (!measurementsRef.current) {
      measurementsRef.current = measureDropZones();
    }

    const measurement = measurementsRef.current;
    const fallbackSize = getDefaultElementSize(session.elementType || session.type);
    const size = session.size || fallbackSize;
    const draggedElement = {
      id: session.nodeId,
      type: session.elementType || session.type,
      dragType: session.dragType,
      parentId: session.parentId,
      groupIds: session.groupIds || [],
      width: Math.max(1, size.width || fallbackSize.width),
      height: Math.max(1, size.height || fallbackSize.height),
      pointer: session.pointer || { x: 0, y: 0 },
      dragOffset: session.dragOffset || { x: (size.width || fallbackSize.width) / 2, y: (size.height || fallbackSize.height) / 2 },
      originalRect: session.originalRect || null,
    };

    const result = calculatePlacement(
      draggedElement,
      measurement.zones,
      measurement.existingElements,
      {
        canvasRect: measurement.canvasRect,
        activeDevice,
      },
    );

    publishPlacement({
      active: true,
      draggedElement,
      ...result,
    });
    return placementRef.current;
  }, [activeDevice, measureDropZones, publishPlacement]);

  const schedulePlacement = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      calculateNextPlacement();
    });
  }, [calculateNextPlacement]);

  const startSmartDrag = useCallback((payload = {}) => {
    measurementsRef.current = measureDropZones();
    const fallbackSize = getDefaultElementSize(payload.elementType || payload.type);
    sessionRef.current = {
      source: payload.source || 'canvas',
      dragType: payload.dragType || 'move-node',
      nodeId: payload.nodeId || null,
      elementType: payload.elementType || payload.type || 'container',
      parentId: payload.parentId || null,
      groupIds: payload.groupIds || [],
      size: payload.clientSize ? clientSizeToCanvas(payload.clientSize) : (payload.size || fallbackSize),
      pointer: payload.clientPoint ? clientPointToCanvas(payload.clientPoint) : (payload.pointer || null),
      dragOffset: payload.dragOffset || null,
      originalRect: payload.originalRect || null,
      groupOriginalRects: payload.groupOriginalRects || null,
    };
    calculateNextPlacement();
  }, [calculateNextPlacement, clientPointToCanvas, clientSizeToCanvas, measureDropZones]);

  const calculateImmediatePlacement = useCallback((payload = {}) => {
    const measurement = measureDropZones();
    const fallbackSize = getDefaultElementSize(payload.elementType || payload.type);
    const size = payload.clientSize ? clientSizeToCanvas(payload.clientSize) : (payload.size || fallbackSize);
    const pointer = payload.clientPoint ? clientPointToCanvas(payload.clientPoint) : (payload.pointer || { x: 0, y: 0 });
    const draggedElement = {
      id: payload.nodeId || null,
      type: payload.elementType || payload.type || 'container',
      dragType: payload.dragType || 'new-element',
      parentId: payload.parentId || null,
      groupIds: payload.groupIds || [],
      width: Math.max(1, size.width || fallbackSize.width),
      height: Math.max(1, size.height || fallbackSize.height),
      pointer,
      dragOffset: payload.dragOffset || { x: Math.max(1, size.width || fallbackSize.width) / 2, y: Math.max(1, size.height || fallbackSize.height) / 2 },
      originalRect: payload.originalRect || null,
    };
    const result = calculatePlacement(draggedElement, measurement.zones, measurement.existingElements, {
      canvasRect: measurement.canvasRect,
      activeDevice,
    });
    const nextPlacement = {
      active: true,
      draggedElement,
      ...result,
    };
    measurementsRef.current = measurement;
    sessionRef.current = {
      source: payload.source || 'insert',
      dragType: draggedElement.dragType,
      nodeId: draggedElement.id,
      elementType: draggedElement.type,
      parentId: draggedElement.parentId,
      groupIds: draggedElement.groupIds || [],
      size,
      pointer,
      dragOffset: draggedElement.dragOffset,
      originalRect: draggedElement.originalRect,
      groupOriginalRects: payload.groupOriginalRects || null,
    };
    publishPlacement(nextPlacement);
    return nextPlacement;
  }, [activeDevice, clientPointToCanvas, clientSizeToCanvas, measureDropZones, publishPlacement]);

  const updateSmartDrag = useCallback((payload = {}) => {
    if (!sessionRef.current) return;
    if (payload.clientPoint) {
      sessionRef.current.pointer = clientPointToCanvas(payload.clientPoint);
    } else if (payload.pointer) {
      sessionRef.current.pointer = payload.pointer;
    }
    if (payload.clientSize) {
      sessionRef.current.size = clientSizeToCanvas(payload.clientSize);
    } else if (payload.size) {
      sessionRef.current.size = payload.size;
    }
    if (payload.dragOffset) {
      sessionRef.current.dragOffset = payload.dragOffset;
    }
    if (payload.originalRect) {
      sessionRef.current.originalRect = payload.originalRect;
    }
    schedulePlacement();
  }, [clientPointToCanvas, clientSizeToCanvas, schedulePlacement]);

  const flushSmartDrag = useCallback((payload = null) => {
    if (!sessionRef.current) return placementRef.current;
    if (payload) {
      if (payload.clientPoint) {
        sessionRef.current.pointer = clientPointToCanvas(payload.clientPoint);
      } else if (payload.pointer) {
        sessionRef.current.pointer = payload.pointer;
      }
      if (payload.clientSize) {
        sessionRef.current.size = clientSizeToCanvas(payload.clientSize);
      } else if (payload.size) {
        sessionRef.current.size = payload.size;
      }
      if (payload.dragOffset) sessionRef.current.dragOffset = payload.dragOffset;
      if (payload.originalRect) sessionRef.current.originalRect = payload.originalRect;
    }
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    return calculateNextPlacement();
  }, [calculateNextPlacement, clientPointToCanvas, clientSizeToCanvas]);

  const refreshSmartDrag = useCallback(() => {
    if (!sessionRef.current) return;
    measurementsRef.current = measureDropZones();
    schedulePlacement();
  }, [measureDropZones, schedulePlacement]);

  const cancelSmartDrag = useCallback(() => {
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    sessionRef.current = null;
    measurementsRef.current = null;
    publishPlacement(idlePlacement);
  }, [publishPlacement]);

  const finishSmartDrag = useCallback(() => {
    const current = placementRef.current;
    cancelSmartDrag();
    return current;
  }, [cancelSmartDrag]);

  const getPlacement = useCallback(() => placementRef.current, []);

  useEffect(() => () => {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
  }, []);

  return {
    placement,
    startSmartDrag,
    updateSmartDrag,
    refreshSmartDrag,
    cancelSmartDrag,
    finishSmartDrag,
    getPlacement,
    flushSmartDrag,
    calculateImmediatePlacement,
  };
}
