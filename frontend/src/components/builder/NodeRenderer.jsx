import React, { useCallback, useEffect, useRef, useState, memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { NODE_TYPES, TEXT_NODE_TYPES, RESIZABLE_NODE_TYPES, CONTAINER_NODE_TYPES, LAYOUT_MODES, NODE_TAG_MAP } from '../../data/nodeSchema';
import { useBuilderStore } from '../../store/builderStore';
import ResizeHandles from './ResizeHandles';
import FloatingToolbar from './FloatingToolbar';
import ContextMenu from './ContextMenu';

const NodeRenderer = memo(({ nodeId, isPreview = false }) => {
  const {
    nodesMap,
    selectedNodeIds,
    selectNode,
    selectNodes,
    clearSelection,
    activeTool,
    editingNodeId,
    setEditingNodeId,
    updateNodeContentInMap,
    openContextMenu,
  } = useBuilderStore();

  const node = nodesMap[nodeId];
  const isSelected = selectedNodeIds.includes(nodeId);
  const isOnlySelected = selectedNodeIds.length === 1 && isSelected;
  const isEditing = editingNodeId === nodeId;

  const contentEditableRef = useRef(null);
  const containerRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: nodeId,
    data: { type: 'node', node },
    disabled: isPreview || node?.locked || activeTool !== 'select',
  });

  // Keep contentEditable in sync with state when not editing
  useEffect(() => {
    if (contentEditableRef.current && !isEditing && node?.content) {
      if (contentEditableRef.current.innerHTML !== node.content) {
        contentEditableRef.current.innerHTML = node.content;
      }
    }
  }, [node?.content, isEditing]);

  if (!node || node.hidden) return null;

  const handlePointerDown = (e) => {
    if (isPreview) return;
    e.stopPropagation();

    if (e.button === 2) {
      // Right click
      if (!selectedNodeIds.includes(nodeId)) {
        selectNode(nodeId);
      }
      openContextMenu(e.clientX, e.clientY, { kind: 'node', id: nodeId });
      return;
    }

    if (activeTool === 'hand') return;

    if (e.shiftKey) {
      if (isSelected) {
        selectNodes(selectedNodeIds.filter((id) => id !== nodeId));
      } else {
        selectNodes([...selectedNodeIds, nodeId]);
      }
    } else {
      selectNode(nodeId);
    }
  };

  const handleDoubleClick = (e) => {
    if (isPreview) return;
    e.stopPropagation();
    
    if (TEXT_NODE_TYPES.has(node.type) && !node.locked) {
      setEditingNodeId(nodeId);
      setTimeout(() => {
        if (contentEditableRef.current) {
          contentEditableRef.current.focus();
          // Select all text
          const range = document.createRange();
          range.selectNodeContents(contentEditableRef.current);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }, 0);
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      setEditingNodeId(null);
      if (contentEditableRef.current) {
        updateNodeContentInMap(nodeId, contentEditableRef.current.innerHTML);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      // Allow soft return
      return;
    }
    if (e.key === 'Escape') {
      handleBlur();
    }
  };

  const Tag = NODE_TAG_MAP[node.type] || 'div';

  // ─── STYLES & LAYOUT ─────────────────────────────────────
  const baseStyles = { ...node.styles };
  
  // Position Mode logic
  if (node.layout) {
    if (node.layout.positionMode === LAYOUT_MODES.FREE) {
      baseStyles.position = 'absolute';
      baseStyles.left = `${node.layout.x}px`;
      baseStyles.top = `${node.layout.y}px`;
    }
    if (node.layout.width !== 'auto') baseStyles.width = node.layout.width;
    if (node.layout.height !== 'auto') baseStyles.height = node.layout.height;
    if (node.layout.rotation) baseStyles.transform = `rotate(${node.layout.rotation}deg)`;
    if (node.layout.zIndex !== 'auto') baseStyles.zIndex = node.layout.zIndex;
  }

  // Flex/Grid logic for containers
  if (CONTAINER_NODE_TYPES.has(node.type) && node.layout) {
    if (node.layout.positionMode === LAYOUT_MODES.FLEX_ROW) {
      baseStyles.display = 'flex';
      baseStyles.flexDirection = 'row';
      if (node.layout.gap) baseStyles.gap = node.layout.gap;
      if (node.layout.alignItems) baseStyles.alignItems = node.layout.alignItems;
      if (node.layout.justifyContent) baseStyles.justifyContent = node.layout.justifyContent;
    } else if (node.layout.positionMode === LAYOUT_MODES.FLEX_COLUMN) {
      baseStyles.display = 'flex';
      baseStyles.flexDirection = 'column';
      if (node.layout.gap) baseStyles.gap = node.layout.gap;
      if (node.layout.alignItems) baseStyles.alignItems = node.layout.alignItems;
      if (node.layout.justifyContent) baseStyles.justifyContent = node.layout.justifyContent;
    } else if (node.layout.positionMode === LAYOUT_MODES.GRID) {
      baseStyles.display = 'grid';
      if (node.layout.gridTemplateColumns) baseStyles.gridTemplateColumns = node.layout.gridTemplateColumns;
      if (node.layout.gap) baseStyles.gap = node.layout.gap;
    } else if (node.layout.positionMode === LAYOUT_MODES.FREE) {
      baseStyles.position = 'relative'; // so children can be absolute relative to this
    }
  }

  // Merge drag transform
  const style = {
    ...baseStyles,
    transform: CSS.Transform.toString(transform) + (baseStyles.transform ? ` ${baseStyles.transform}` : ''),
    transition: transition || baseStyles.transition,
    opacity: isDragging ? 0.4 : baseStyles.opacity || 1,
  };

  // ─── EDITOR CLASSES ──────────────────────────────────────
  let editorClasses = '';
  if (!isPreview) {
    editorClasses = 'group/node relative transition-[box-shadow] duration-200 ';
    if (isSelected) {
      editorClasses += 'ring-2 ring-indigo-500 ring-inset z-20 ';
    } else if (activeTool === 'select' && !node.locked) {
      editorClasses += 'hover:ring-2 hover:ring-indigo-400/50 hover:ring-inset ';
    }
  }

  // ─── RENDER SPECIFIC TYPES ───────────────────────────────

  if (node.type === NODE_TYPES.IMAGE) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`${editorClasses} overflow-hidden`}
        onPointerDown={handlePointerDown}
        {...attributes}
        {...listeners}
      >
        <img
          src={node.props.src || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop'}
          alt={node.props.alt || 'Placeholder'}
          className="h-full w-full object-cover"
          style={{ objectFit: node.props.objectFit || 'cover' }}
          draggable={false}
        />
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </div>
    );
  }

  if (node.type === NODE_TYPES.ICON) {
    // Render icon placeholder for now
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`${editorClasses} flex items-center justify-center`}
        onPointerDown={handlePointerDown}
        {...attributes}
        {...listeners}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v18" /><path d="M3 12h18" />
        </svg>
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </div>
    );
  }

  if (TEXT_NODE_TYPES.has(node.type)) {
    return (
      <Tag
        ref={setNodeRef}
        style={style}
        className={`${editorClasses} outline-none cursor-text ${isEditing ? 'cursor-text ring-2 ring-indigo-500' : ''}`}
        onPointerDown={handlePointerDown}
        onDoubleClick={handleDoubleClick}
        {...(!isEditing ? attributes : {})}
        {...(!isEditing ? listeners : {})}
      >
        <span
          ref={contentEditableRef}
          contentEditable={isEditing && !isPreview}
          suppressContentEditableWarning
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="outline-none break-words min-w-[20px] inline-block w-full"
          dangerouslySetInnerHTML={{ __html: node.content }}
        />
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </Tag>
    );
  }

  // ─── RENDER CONTAINER TYPES ──────────────────────────────
  if (CONTAINER_NODE_TYPES.has(node.type)) {
    return (
      <Tag
        ref={setNodeRef}
        style={style}
        className={`${editorClasses} ${node.children?.length === 0 && !isPreview ? 'min-h-[60px] bg-slate-50/50' : ''}`}
        onPointerDown={handlePointerDown}
        onDoubleClick={handleDoubleClick}
        {...attributes}
        {...listeners}
      >
        {node.children?.map((childId) => (
          <NodeRenderer key={childId} nodeId={childId} isPreview={isPreview} />
        ))}
        {!isPreview && node.children?.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/node:opacity-100 transition-opacity pointer-events-none">
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-white/80 px-2 py-1 rounded">Empty Container</span>
          </div>
        )}
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </Tag>
    );
  }

  // Default fallback
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={editorClasses}
      onPointerDown={handlePointerDown}
      {...attributes}
      {...listeners}
    >
      {node.content}
      {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
      {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
    </div>
  );
});

export default NodeRenderer;
