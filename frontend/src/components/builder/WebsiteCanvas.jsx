import React, { useRef, useState } from 'react';
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Sparkles } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import CanvasFrame from './CanvasFrame';
import NodeRenderer from './NodeRenderer';
import DropZone from './DropZone';
import SelectionBox from './SelectionBox';

export default function WebsiteCanvas({ readonly = false, runtimeMode = 'editor' }) {
  const {
    currentPageNodes,
    activeDevice,
    activeTool,
    clearSelection,
    selectNodes,
    addNodeToMap,
    moveNodeInMap,
    addPage,
    setActiveLeftTool,
    setMode,
    openContextMenu,
    showToast,
  } = useBuilderStore();
  const canvasRef = useRef(null);
  const [draggingFromPanel, setDraggingFromPanel] = useState(false);
  const [selectionBox, setSelectionBox] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || readonly) return;

    const activeData = active.data.current || {};
    const overData = over.data.current || {};

    // Standard node reordering in the tree
    if (activeData.type === 'node' && overData.type === 'node') {
      const activeNodeId = active.id;
      const overNodeId = over.id;
      if (activeNodeId !== overNodeId) {
        // Simple reorder: put dragged node after the drop target
        const overNode = overData.node;
        if (overNode && overNode.parentId) {
          // move node to same parent as target, right after it
          // TODO: calculate index properly for now we just append to parent
          moveNodeInMap(activeNodeId, overNode.parentId, -1);
        }
      }
      return;
    }

    if (activeData.dragType === 'new-section' || activeData.dragType === 'new-element') {
      const type = activeData.sectionType || activeData.elementType;
      if (overData.type === 'node') {
        const overNode = overData.node;
        addNodeToMap(overNode.id, { type });
      } else if (overData.type === 'dropzone') {
        // Drop on canvas background
        addNodeToMap(null, { type }); // Root level
      }
      return;
    }

    showToast('Drop target is not available for this item.');
  };

  const handleNativeDrop = (event) => {
    if (readonly) return;
    event.preventDefault();
    setDraggingFromPanel(false);
    const raw = event.dataTransfer.getData('application/shopcraft-builder');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      const type = data.sectionType || data.elementType;
      if (type) addNodeToMap(null, { type }); // add to root
    } catch {
      showToast('Could not read dropped builder item.', 'error');
    }
  };

  const allowPanelDrop = (event) => {
    if (readonly) return;
    if (event.dataTransfer.types.includes('application/shopcraft-builder')) {
      event.preventDefault();
      setDraggingFromPanel(true);
    }
  };

  const handleCanvasClick = (event) => {
    if (readonly) return;
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

  const getCanvasPoint = (event) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    return { x: event.clientX - (rect?.left || 0), y: event.clientY - (rect?.top || 0) };
  };

  const handlePointerDown = (event) => {
    if (readonly || activeTool !== 'select' || event.button !== 0 || event.target !== event.currentTarget) return;
    const point = getCanvasPoint(event);
    setSelectionBox({ startX: point.x, startY: point.y, endX: point.x, endY: point.y });
  };

  const handlePointerMove = (event) => {
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
      const ids = Array.from(canvasRef.current.querySelectorAll('[data-node-id]'))
        .filter((node) => {
          const rect = node.getBoundingClientRect();
          const nodeLeft = rect.left - frameRect.left;
          const nodeRight = rect.right - frameRect.left;
          const nodeTop = rect.top - frameRect.top;
          const nodeBottom = rect.bottom - frameRect.top;
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
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div
          ref={canvasRef}
          onClick={handleCanvasClick}
          onContextMenu={handleCanvasContextMenu}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onDragEnter={allowPanelDrop}
          onDragOver={allowPanelDrop}
          onDragLeave={(event) => {
            if (event.currentTarget === event.target) setDraggingFromPanel(false);
          }}
          onDrop={handleNativeDrop}
          className="relative min-h-[72vh]"
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
