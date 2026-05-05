import React, { useCallback, useEffect, useRef, useState } from 'react';
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Sparkles } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import { LAYOUT_MODES } from '../../data/nodeSchema';
import { SECTION_LEVEL_TYPES, getDefaultElementSize } from '../../utils/placementEngine';
import { useDropZones } from '../../hooks/builder/useDropZones';
import { useSmartDrag } from '../../hooks/builder/useSmartDrag';
import { useSnapGuides } from '../../hooks/builder/useSnapGuides';
import CanvasFrame from './CanvasFrame';
import NodeRenderer from './NodeRenderer';
import DropZone from './DropZone';
import SelectionBox from './SelectionBox';
import DropZoneOverlay from './DropZoneOverlay';
import DragPreview from './DragPreview';
import AlignmentGuides from './AlignmentGuides';

const builderMime = 'application/shopcraft-builder';

const hasBuilderPayload = (types) => Array.from(types || []).includes(builderMime);

const readBuilderPayload = (event) => {
  const raw = event.dataTransfer?.getData(builderMime);
  try {
    const data = raw
      ? JSON.parse(raw)
      : (typeof window !== 'undefined' ? window.__shopcraftBuilderDragPayload : null);
    const type = data.sectionType || data.elementType || data.type;
    if (!type) return null;
    return {
      ...data,
      dragType: data.dragType || (SECTION_LEVEL_TYPES.has(type) ? 'new-section' : 'new-element'),
      elementType: data.elementType || data.sectionType || type,
      sectionType: data.sectionType,
      source: 'native',
    };
  } catch {
    return null;
  }
};

const centerFromRect = (rect) => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

const sizeFromRect = (rect) => ({ width: rect.width, height: rect.height });

const safeSelector = (value) => String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const boundsForRects = (rects = []) => {
  if (!rects.length) return null;
  const left = Math.min(...rects.map((rect) => rect.left));
  const top = Math.min(...rects.map((rect) => rect.top));
  const right = Math.max(...rects.map((rect) => rect.right));
  const bottom = Math.max(...rects.map((rect) => rect.bottom));
  return {
    left,
    top,
    x: left,
    y: top,
    right,
    bottom,
    width: Math.max(1, right - left),
    height: Math.max(1, bottom - top),
  };
};

const responsiveRulesFor = (warnings = [], activeDevice = 'desktop') => {
  const responsive = {};
  if (warnings.length) {
    responsive.tablet = { maxWidth: '100%' };
    responsive.mobile = { width: '100%', maxWidth: '100%', left: '0px' };
  }
  if (activeDevice !== 'desktop') {
    responsive[activeDevice] = {
      ...(responsive[activeDevice] || {}),
      maxWidth: '100%',
    };
  }
  return responsive;
};

const canMoveElement = (activeTool) => activeTool === 'hand';

export default function SmartCanvas({ readonly = false }) {
  const {
    currentPage,
    currentPageNodes,
    nodesMap,
    activeDevice,
    activeTool,
    pendingInsert,
    dragState,
    selectedNodeIds,
    clearSelection,
    selectNodes,
    addNodeToMap,
    addSection,
    addPage,
    setActiveLeftTool,
    setMode,
    openContextMenu,
    showToast,
    moveNodeInMap,
    placeNodeInMap,
    placeNodesInMap,
    cancelSmartInsert,
    startPlacementMode,
    updatePlacementMode,
    clearPlacementMode,
  } = useBuilderStore();

  const canvasRef = useRef(null);
  const activeDragRef = useRef(null);
  const pointerDragRef = useRef(null);
  const [draggingFromPanel, setDraggingFromPanel] = useState(false);
  const [selectionBox, setSelectionBox] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const { measureDropZones, clientPointToCanvas, clientSizeToCanvas } = useDropZones(canvasRef, nodesMap, currentPage);
  const showMovePlacement = !readonly
    && activeTool === 'hand'
    && dragState.isDragging
    && dragState.dragType === 'move-element';
  const syncDragState = useCallback((nextDragState) => {
    if (!nextDragState) {
      clearPlacementMode();
      return;
    }
    updatePlacementMode(nextDragState);
  }, [clearPlacementMode, updatePlacementMode]);
  const {
    placement,
    startSmartDrag,
    updateSmartDrag,
    cancelSmartDrag,
    finishSmartDrag,
    getPlacement,
    flushSmartDrag,
    calculateImmediatePlacement,
  } = useSmartDrag({
    activeDevice,
    measureDropZones,
    clientPointToCanvas,
    clientSizeToCanvas,
    onDragStateChange: syncDragState,
  });
  const snapGuides = useSnapGuides(placement);

  useEffect(() => {
    if (!pendingInsert) {
      if (activeDragRef.current?.source === 'insert') {
        activeDragRef.current = null;
        cancelSmartDrag();
      }
      return;
    }
    activeDragRef.current = null;
  }, [cancelSmartDrag, pendingInsert]);

  useEffect(() => {
    if (pendingInsert) return;
    if (activeTool === 'hand') return;
    if (!activeDragRef.current && !pointerDragRef.current && !dragState.isDragging) return;
    activeDragRef.current = null;
    pointerDragRef.current = null;
    cancelSmartDrag();
    clearPlacementMode();
  }, [activeTool, cancelSmartDrag, clearPlacementMode, dragState.isDragging, pendingInsert]);

  const payloadType = (payload = {}) => payload.sectionType || payload.elementType || payload.type || 'container';

  const domRectToCanvasRect = useCallback((rect) => {
    const topLeft = clientPointToCanvas({ x: rect.left, y: rect.top });
    const size = clientSizeToCanvas(sizeFromRect(rect));
    return {
      left: topLeft.x,
      top: topLeft.y,
      x: topLeft.x,
      y: topLeft.y,
      width: size.width,
      height: size.height,
      right: topLeft.x + size.width,
      bottom: topLeft.y + size.height,
    };
  }, [clientPointToCanvas, clientSizeToCanvas]);

  const getExistingElementPayload = useCallback((event) => {
    if (readonly || pendingInsert || !canMoveElement(activeTool) || event.button !== 0) return null;
    const target = event.target;
    if (target?.isContentEditable || target?.closest?.('[contenteditable="true"]')) return null;
    if (target?.closest?.('[data-builder-toolbar]')) return null;
    if (target?.closest?.('[data-resize-handle]')) return null;
    const nodeElement = target?.closest?.('[data-node-id]');
    if (!nodeElement || !canvasRef.current?.contains(nodeElement)) return null;
    const nodeId = nodeElement.dataset.nodeId;
    const node = nodesMap[nodeId];
    if (!node || node.locked || node.type === 'page') return null;
    const rect = nodeElement.getBoundingClientRect();
    const isResize = Boolean(target?.closest?.('[data-resize-handle]'));
    const clickedSelectedGroup = selectedNodeIds.length > 1 && selectedNodeIds.includes(nodeId);
    const groupIds = clickedSelectedGroup ? selectedNodeIds.filter((id) => nodesMap[id] && !nodesMap[id].locked) : [nodeId];
    const groupOriginalRects = Object.fromEntries(groupIds
      .map((id) => {
        const element = canvasRef.current.querySelector(`[data-node-id="${safeSelector(id)}"]`);
        if (!element) return null;
        return [id, domRectToCanvasRect(element.getBoundingClientRect())];
      })
      .filter(Boolean));
    const measuredRects = Object.values(groupOriginalRects);
    const originalRect = boundsForRects(measuredRects) || domRectToCanvasRect(rect);
    const mousePoint = clientPointToCanvas({ x: event.clientX, y: event.clientY });
    const dragOffset = {
      x: mousePoint.x - originalRect.left,
      y: mousePoint.y - originalRect.top,
    };
    return {
      source: isResize ? 'resize-pointer' : 'existing-pointer',
      dragType: 'move-node',
      nodeId,
      elementType: node.type,
      parentId: node.parentId || null,
      groupIds,
      groupOriginalRects,
      originalRect,
      dragOffset,
      clientPoint: { x: event.clientX, y: event.clientY },
      size: { width: originalRect.width, height: originalRect.height },
    };
  }, [activeTool, clientPointToCanvas, domRectToCanvasRect, nodesMap, pendingInsert, readonly, selectedNodeIds]);

  const beginExistingElementPlacement = useCallback((event) => {
    const payload = getExistingElementPayload(event);
    if (!payload) return;
    activeDragRef.current = payload;
    pointerDragRef.current = {
      payload,
      pointerId: event.pointerId,
      startClient: { x: event.clientX, y: event.clientY },
      moved: false,
    };
    startPlacementMode({
      draggedElementId: payload.nodeId,
      draggedElementType: payload.elementType,
      dragType: 'move-element',
      draggedElementSize: payload.size,
      mousePosition: clientPointToCanvas(payload.clientPoint),
      currentMousePoint: clientPointToCanvas(payload.clientPoint),
      dragOffset: payload.dragOffset,
      originalRect: payload.originalRect,
      source: 'existing-element',
    });
    startSmartDrag(payload);
  }, [clientPointToCanvas, getExistingElementPayload, startPlacementMode, startSmartDrag]);

  const commitSmartPlacement = useCallback((smartPlacement, payload) => {
    if (readonly) return false;
    const zone = smartPlacement?.activeDropZone || smartPlacement?.bestZone;
    const previewRect = smartPlacement?.previewRect || smartPlacement?.ghostRect;
    const type = payloadType(payload);
    if (!zone || !previewRect) return false;

    if (payload.dragType === 'new-section' || SECTION_LEVEL_TYPES.has(type)) {
      addSection(type);
      return true;
    }

    const responsive = responsiveRulesFor(smartPlacement.warnings || zone.warnings, activeDevice);
    const localPlacement = smartPlacement.localPlacement || {
      x: Math.round((previewRect.left ?? previewRect.x ?? 0) - (zone.rect?.left ?? zone.rect?.x ?? 0)),
      y: Math.round((previewRect.top ?? previewRect.y ?? 0) - (zone.rect?.top ?? zone.rect?.y ?? 0)),
      width: Math.round(previewRect.width),
      height: Math.round(previewRect.height),
      zIndex: zone.zIndex || 1,
      parentSectionId: zone.sectionId || zone.id,
    };
    const layout = {
      positionMode: LAYOUT_MODES.FREE,
      x: localPlacement.x,
      y: localPlacement.y,
      width: localPlacement.width,
      height: localPlacement.height,
      zIndex: localPlacement.zIndex,
      parentSectionId: zone.sectionId || zone.id,
    };

    if (payload.nodeId && payload.groupIds?.length > 1 && payload.groupOriginalRects && payload.originalRect) {
      const previewLeft = previewRect.left ?? previewRect.x ?? 0;
      const previewTop = previewRect.top ?? previewRect.y ?? 0;
      const zoneLeft = zone.rect?.left ?? zone.rect?.x ?? 0;
      const zoneTop = zone.rect?.top ?? zone.rect?.y ?? 0;
      const delta = {
        x: previewLeft - payload.originalRect.left,
        y: previewTop - payload.originalRect.top,
      };
      const parentId = zone.sectionId || zone.id;
      placeNodesInMap(payload.groupIds.map((nodeId, index) => {
        const original = payload.groupOriginalRects[nodeId];
        if (!original) return null;
        return {
          nodeId,
          newParentId: parentId,
          placement: {
            positionMode: LAYOUT_MODES.FREE,
            x: Math.round(original.left + delta.x - zoneLeft),
            y: Math.round(original.top + delta.y - zoneTop),
            width: Math.round(original.width),
            height: Math.round(original.height),
            zIndex: (localPlacement.zIndex || 1) + index,
            parentSectionId: parentId,
            responsive,
          },
        };
      }).filter(Boolean));
      selectNodes(payload.groupIds);
      if (smartPlacement.warning) showToast(smartPlacement.warning);
      else showToast(smartPlacement.message || 'Elements placed.', 'success');
      return true;
    }

    if (payload.nodeId) {
      placeNodeInMap(payload.nodeId, zone.sectionId || zone.id, { ...layout, responsive });
      selectNodes([payload.nodeId]);
      if (smartPlacement.warning) showToast(smartPlacement.warning);
      else showToast(smartPlacement.message || zone.label || 'Element placed.', 'success');
      return true;
    }

    const nodeId = addNodeToMap(zone.sectionId || zone.id, { type, layout, responsive });
    if (smartPlacement.warning) showToast(smartPlacement.warning);
    return Boolean(nodeId);
  }, [activeDevice, addNodeToMap, addSection, placeNodeInMap, placeNodesInMap, readonly, selectNodes, showToast]);

  const updatePointerPlacement = useCallback((event) => {
    if (!canMoveElement(activeTool)) return;
    const pointerDrag = pointerDragRef.current;
    if (!pointerDrag) return;
    const dx = event.clientX - pointerDrag.startClient.x;
    const dy = event.clientY - pointerDrag.startClient.y;
    if (Math.sqrt(dx * dx + dy * dy) > 4) pointerDrag.moved = true;

    if (activeDragRef.current?.source === 'dnd' || activeDragRef.current?.source === 'native' || activeDragRef.current?.source === 'insert') {
      return;
    }

    const payload = pointerDrag.payload;
    updateSmartDrag({
      clientPoint: { x: event.clientX, y: event.clientY },
      size: payload.size,
    });
  }, [activeTool, updateSmartDrag]);

  const completePointerPlacement = useCallback((event) => {
    const pointerDrag = pointerDragRef.current;
    if (!pointerDrag) return;
    pointerDragRef.current = null;
    if (!canMoveElement(activeTool)) {
      activeDragRef.current = null;
      finishSmartDrag();
      clearPlacementMode();
      return;
    }

    if (activeDragRef.current?.source === 'dnd' || activeDragRef.current?.source === 'native' || activeDragRef.current?.source === 'insert') {
      return;
    }

    const payload = pointerDrag.payload;
    const shouldPlace = pointerDrag.moved && payload.source !== 'resize-pointer';
    const smartPlacement = shouldPlace
      ? flushSmartDrag({
        ...payload,
        clientPoint: { x: event.clientX, y: event.clientY },
        size: payload.size,
      })
      : getPlacement();

    activeDragRef.current = null;
    finishSmartDrag();
    clearPlacementMode();

    if (shouldPlace && !commitSmartPlacement(smartPlacement, payload)) {
      showToast(smartPlacement?.message || 'No valid placement zone found. The item returned to its original position.', 'error');
    }
  }, [activeTool, clearPlacementMode, commitSmartPlacement, finishSmartDrag, flushSmartDrag, getPlacement, showToast]);

  useEffect(() => {
    const handleWindowPointerMove = (event) => updatePointerPlacement(event);
    const handleWindowPointerUp = (event) => completePointerPlacement(event);
    const handleWindowPointerCancel = (event) => completePointerPlacement(event);
    const handleResizePlacement = (event) => {
      const pointerDrag = pointerDragRef.current;
      if (!pointerDrag || pointerDrag.payload.nodeId !== event.detail?.nodeId) return;
      pointerDrag.payload = {
        ...pointerDrag.payload,
        clientSize: event.detail.clientSize || pointerDrag.payload.clientSize,
      };
      updateSmartDrag({
        clientPoint: event.detail.clientPoint,
        clientSize: event.detail.clientSize,
      });
    };
    const handleWindowKeyDown = (event) => {
      if (event.key !== 'Escape' || !dragState.isDragging) return;
      activeDragRef.current = null;
      pointerDragRef.current = null;
      cancelSmartDrag();
      clearPlacementMode();
    };
    const handleWindowDragEnd = () => {
      if (activeDragRef.current?.source !== 'native') return;
      activeDragRef.current = null;
      if (typeof window !== 'undefined') window.__shopcraftBuilderDragPayload = null;
      cancelSmartDrag();
      clearPlacementMode();
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerCancel);
    window.addEventListener('shopcraft:placement-resize', handleResizePlacement);
    window.addEventListener('keydown', handleWindowKeyDown);
    window.addEventListener('dragend', handleWindowDragEnd);
    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerCancel);
      window.removeEventListener('shopcraft:placement-resize', handleResizePlacement);
      window.removeEventListener('keydown', handleWindowKeyDown);
      window.removeEventListener('dragend', handleWindowDragEnd);
    };
  }, [cancelSmartDrag, clearPlacementMode, completePointerPlacement, dragState.isDragging, updatePointerPlacement, updateSmartDrag]);

  const getDndPayload = useCallback((active) => {
    if (!canMoveElement(activeTool)) return null;
    const activeData = active?.data?.current || {};
    if (activeData.type === 'node') {
      const node = activeData.node || nodesMap[active.id];
      return {
        source: 'dnd',
        dragType: 'move-node',
        nodeId: active.id,
        elementType: node?.type || 'container',
        parentId: node?.parentId || null,
      };
    }
    if (activeData.dragType) {
      return {
        source: 'dnd',
        dragType: activeData.dragType,
        elementType: activeData.elementType || activeData.sectionType,
        sectionType: activeData.sectionType,
      };
    }
    return null;
  }, [activeTool, nodesMap]);

  const handleDndDragStart = (event) => {
    if (readonly || !canMoveElement(activeTool)) return;
    const payload = getDndPayload(event.active);
    const rect = event.active?.rect?.current?.initial;
    if (!payload || !rect) return;
    if (payload.nodeId && pointerDragRef.current?.payload?.nodeId === payload.nodeId) {
      activeDragRef.current = pointerDragRef.current.payload;
      return;
    }
    const originalRect = domRectToCanvasRect(rect);
    startSmartDrag({
      ...payload,
      originalRect,
      dragOffset: { x: originalRect.width / 2, y: originalRect.height / 2 },
      clientPoint: centerFromRect(rect),
      clientSize: sizeFromRect(rect),
    });
    activeDragRef.current = payload;
  };

  const handleDndDragMove = (event) => {
    if (readonly || !canMoveElement(activeTool) || !activeDragRef.current) return;
    if (activeDragRef.current.source === 'existing-pointer') return;
    const rect = event.active?.rect?.current?.translated || event.active?.rect?.current?.initial;
    if (!rect) return;
    updateSmartDrag({
      clientPoint: centerFromRect(rect),
      clientSize: sizeFromRect(rect),
    });
  };

  const handleDndDragCancel = () => {
    activeDragRef.current = null;
    pointerDragRef.current = null;
    cancelSmartDrag();
  };

  const handleDragEnd = (event) => {
    if (canMoveElement(activeTool)) {
      activeDragRef.current = null;
      return;
    }
    const payload = activeDragRef.current;
    if (payload?.source === 'existing-pointer') return;
    const rect = event.active?.rect?.current?.translated || event.active?.rect?.current?.initial;
    const smartPlacement = payload && rect
      ? flushSmartDrag({ ...payload, clientPoint: centerFromRect(rect), clientSize: sizeFromRect(rect) })
      : getPlacement();
    finishSmartDrag();
    activeDragRef.current = null;

    if (readonly) return;
    if (payload && commitSmartPlacement(smartPlacement, payload)) return;

    const { active, over } = event;
    if (!over) {
      showToast('No valid placement zone found. The item returned to its original position.', 'error');
      return;
    }

    const activeData = active.data.current || {};
    const overData = over.data.current || {};

    if (activeData.type === 'node' && overData.type === 'node') {
      const activeNodeId = active.id;
      const overNodeId = over.id;
      if (activeNodeId !== overNodeId) {
        const overNode = overData.node;
        if (overNode && overNode.parentId) {
          moveNodeInMap(activeNodeId, overNode.parentId, -1);
        }
      }
      return;
    }

    showToast('Drop target is not available for this item.', 'error');
  };

  const ensureNativeDragSession = (event) => {
    if (readonly || !hasBuilderPayload(event.dataTransfer?.types)) return null;
    const payload = readBuilderPayload(event);
    if (!payload) return null;
    const type = payloadType(payload);
    const size = getDefaultElementSize(type);

    if (!activeDragRef.current || activeDragRef.current.source !== 'native' || payloadType(activeDragRef.current) !== type) {
      activeDragRef.current = payload;
      startSmartDrag({
        ...payload,
        size,
        clientPoint: { x: event.clientX, y: event.clientY },
      });
    } else {
      updateSmartDrag({ clientPoint: { x: event.clientX, y: event.clientY }, size });
    }
    return payload;
  };

  const handleNativeDrop = (event) => {
    if (readonly) return;
    event.preventDefault();
    setDraggingFromPanel(false);
    const payload = activeDragRef.current || readBuilderPayload(event);
    if (typeof window !== 'undefined') window.__shopcraftBuilderDragPayload = null;
    const type = payload ? payloadType(payload) : 'container';
    const smartPlacement = payload
      ? flushSmartDrag({ ...payload, size: getDefaultElementSize(type), clientPoint: { x: event.clientX, y: event.clientY } })
      : getPlacement();
    activeDragRef.current = null;
    cancelSmartDrag();
    if (!payload) {
      showToast('Could not read dropped builder item.', 'error');
      return;
    }
    if (!commitSmartPlacement(smartPlacement, payload)) {
      showToast(smartPlacement?.message || 'No valid placement zone found.', 'error');
    }
  };

  const allowPanelDrop = (event) => {
    if (readonly || !hasBuilderPayload(event.dataTransfer?.types)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setDraggingFromPanel(true);
    ensureNativeDragSession(event);
  };

  const getCanvasPoint = (event) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const scale = canvasRef.current?.offsetWidth && rect?.width ? rect.width / canvasRef.current.offsetWidth : 1;
    return {
      x: (event.clientX - (rect?.left || 0)) / scale,
      y: (event.clientY - (rect?.top || 0)) / scale,
    };
  };

  const pendingPayload = useCallback((event) => {
    if (!pendingInsert) return null;
    const type = payloadType(pendingInsert);
    return {
      ...pendingInsert,
      source: 'insert',
      elementType: type,
      size: getDefaultElementSize(type),
      clientPoint: { x: event.clientX, y: event.clientY },
    };
  }, [pendingInsert]);

  const updatePendingInsertPreview = (event) => {
    const payload = pendingPayload(event);
    if (!payload) return;
    if (!activeDragRef.current || activeDragRef.current.source !== 'insert' || payloadType(activeDragRef.current) !== payload.elementType) {
      activeDragRef.current = payload;
      startSmartDrag(payload);
      return;
    }
    updateSmartDrag({ clientPoint: payload.clientPoint, size: payload.size });
  };

  const commitPendingInsert = (event) => {
    const payload = pendingPayload(event);
    if (!payload) return false;
    const smartPlacement = activeDragRef.current?.source === 'insert'
      ? flushSmartDrag(payload)
      : calculateImmediatePlacement(payload);
    const committed = commitSmartPlacement(smartPlacement, payload);
    activeDragRef.current = null;
    cancelSmartDrag();
    cancelSmartInsert();
    if (!committed) showToast(smartPlacement?.message || 'No valid placement zone found.', 'error');
    return true;
  };

  const handleCanvasClick = (event) => {
    if (readonly) return;

    if (pendingInsert) {
      event.preventDefault();
      event.stopPropagation();
      commitPendingInsert(event);
      return;
    }

    if (event.target !== event.currentTarget) return;

    if (activeTool === 'frame') {
      addPage('New Page');
      return;
    }
    if (activeTool === 'section') {
      addNodeToMap(null, { type: 'section' });
      return;
    }
    if (activeTool === 'container') {
      addNodeToMap(null, { type: 'container' });
      return;
    }
    if (activeTool === 'text') {
      addNodeToMap(null, { type: 'heading' });
      return;
    }
    if (activeTool === 'image') {
      addNodeToMap(null, { type: 'image' });
      return;
    }
    if (activeTool === 'button') {
      addNodeToMap(null, { type: 'button' });
      return;
    }
    if (activeTool === 'prototype') {
      setMode('prototype');
      showToast('Select a node, then drag its blue connector handle.');
      return;
    }

    if (activeTool === 'hand') {
      return;
    }

    clearSelection();
  };

  const handleCanvasContextMenu = (event) => {
    if (readonly) return;
    event.preventDefault();
    if (event.target === event.currentTarget) {
      clearSelection();
      openContextMenu({ x: event.clientX, y: event.clientY }, { kind: 'page' });
    }
  };

  const handlePointerDown = (event) => {
    if (readonly || pendingInsert || activeTool !== 'select' || event.button !== 0 || event.target !== event.currentTarget) return;
    const point = getCanvasPoint(event);
    setSelectionBox({ startX: point.x, startY: point.y, endX: point.x, endY: point.y });
  };

  const handlePointerMove = (event) => {
    if (pendingInsert) updatePendingInsertPreview(event);
    if (!selectionBox) return;
    const point = getCanvasPoint(event);
    setSelectionBox((box) => ({ ...box, endX: point.x, endY: point.y }));
  };

  const handlePointerUp = () => {
    if (!selectionBox || !canvasRef.current) return;
    const left = Math.min(selectionBox.startX, selectionBox.endX);
    const right = Math.max(selectionBox.startX, selectionBox.endX);
    const top = Math.min(selectionBox.startY, selectionBox.endY);
    const bottom = Math.max(selectionBox.startY, selectionBox.endY);
    if (Math.abs(right - left) > 8 && Math.abs(bottom - top) > 8) {
      const frameRect = canvasRef.current.getBoundingClientRect();
      const scale = canvasRef.current.offsetWidth && frameRect.width ? frameRect.width / canvasRef.current.offsetWidth : 1;
      const ids = Array.from(canvasRef.current.querySelectorAll('[data-node-id]'))
        .filter((node) => {
          const rect = node.getBoundingClientRect();
          const nodeLeft = (rect.left - frameRect.left) / scale;
          const nodeRight = (rect.right - frameRect.left) / scale;
          const nodeTop = (rect.top - frameRect.top) / scale;
          const nodeBottom = (rect.bottom - frameRect.top) / scale;
          return nodeLeft < right && nodeRight > left && nodeTop < bottom && nodeBottom > top;
        })
        .map((node) => node.dataset.nodeId)
        .filter(Boolean);
      if (ids.length) selectNodes(ids);
    }
    setSelectionBox(null);
  };

  return (
    <CanvasFrame showPrototypeOverlay={!readonly}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDndDragStart}
        onDragMove={handleDndDragMove}
        onDragCancel={handleDndDragCancel}
        onDragEnd={handleDragEnd}
      >
        <div
          ref={canvasRef}
          onClick={handleCanvasClick}
          onContextMenu={handleCanvasContextMenu}
          onPointerDownCapture={beginExistingElementPlacement}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onDragEnter={allowPanelDrop}
          onDragOver={allowPanelDrop}
          onDragLeave={(event) => {
            if (event.currentTarget === event.target) {
              setDraggingFromPanel(false);
              if (activeDragRef.current?.source === 'native') {
                if (typeof window !== 'undefined') window.__shopcraftBuilderDragPayload = null;
              }
            }
          }}
          onDrop={handleNativeDrop}
          className={`relative min-h-[72vh] ${pendingInsert ? 'cursor-copy' : activeTool === 'hand' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
        >
          {currentPageNodes.length ? (
            <SortableContext items={currentPageNodes.map((node) => node.id)} strategy={verticalListSortingStrategy}>
              {!readonly && <DropZone active={draggingFromPanel} label="Drop new section or element at top" onDragOver={allowPanelDrop} onDrop={handleNativeDrop} />}
              {currentPageNodes.map((node) => (
                <React.Fragment key={node.id}>
                  <NodeRenderer nodeId={node.id} isPreview={readonly} />
                  {!readonly && <DropZone active={draggingFromPanel} label="Drop new section or element here" onDragOver={allowPanelDrop} onDrop={handleNativeDrop} />}
                </React.Fragment>
              ))}
            </SortableContext>
          ) : (
            <div className="pointer-events-none flex min-h-[72vh] flex-col items-center justify-center p-10 text-center text-slate-500">
              <Sparkles size={44} className="mb-5 text-indigo-500" />
              <h2 className="mb-2 text-2xl font-black text-slate-900">Start designing your website</h2>
              <p className="mb-6 max-w-md text-sm leading-6">Your website starts blank. Add sections, elements, and pages from the left panel.</p>
              {!readonly && (
                <div className="pointer-events-auto flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={() => addNodeToMap(null, { type: 'navbar' })} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-widest text-white">
                    <Plus size={16} />
                    Add Navbar
                  </button>
                  <button type="button" onClick={() => addNodeToMap(null, { type: 'section' })} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white">
                    <Plus size={16} />
                    Add Hero Section
                  </button>
                  <button type="button" onClick={() => addNodeToMap(null, { type: 'container' })} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-700 hover:border-indigo-500">
                    Blank Section
                  </button>
                  <button type="button" onClick={() => addNodeToMap(null, { type: 'footer' })} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-700 hover:border-indigo-500">
                    Add Footer
                  </button>
                  <button type="button" onClick={() => setActiveLeftTool('templates')} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-700 hover:border-indigo-500">
                    Start with Template
                  </button>
                  <button type="button" onClick={() => setActiveLeftTool('ai')} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-700 hover:border-indigo-500">
                    Generate with AI
                  </button>
                </div>
              )}
            </div>
          )}
          <SelectionBox box={selectionBox} />
          <DropZoneOverlay
            active={showMovePlacement}
            zones={dragState.dropZones}
            activeDropZoneId={dragState.activeDropZoneId}
            bestZoneId={placement.bestZone?.id}
          />
          <DragPreview placement={showMovePlacement ? placement : null} />
          <AlignmentGuides active={showMovePlacement && placement.active} guides={snapGuides} />
        </div>
        <DragOverlay>
          <div className="rounded-xl border border-indigo-400 bg-slate-950 px-4 py-3 text-xs font-black uppercase tracking-widest text-white shadow-2xl">
            Moving item
          </div>
        </DragOverlay>
      </DndContext>
    </CanvasFrame>
  );
}
