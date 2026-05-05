import { useEffect, useRef, memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { NODE_TYPES, TEXT_NODE_TYPES, RESIZABLE_NODE_TYPES, CONTAINER_NODE_TYPES, LAYOUT_MODES, NODE_TAG_MAP } from '../../data/nodeSchema';
import { useBuilderStore } from '../../store/builderStore';
import { responsiveHidden, responsiveStylesFor } from '../../utils/renderHelpers';
import ResizeHandles from './ResizeHandles';
import FloatingToolbar from './FloatingToolbar';

const NodeRenderer = memo(({ nodeId, isPreview = false }) => {
  const {
    nodesMap,
    activeDevice,
    currentPage,
    selectedNodeIds,
    selectNode,
    selectNodes,
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
  const isRootSection = node?.parentId === currentPage?.id;

  const contentEditableRef = useRef(null);

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
    disabled: activeTool !== 'hand' || isEditing || node.locked,
  });

  // Keep contentEditable in sync with state when not editing
  useEffect(() => {
    if (contentEditableRef.current && !isEditing && node?.content) {
      if (contentEditableRef.current.innerHTML !== node.content) {
        contentEditableRef.current.innerHTML = node.content;
      }
    }
  }, [node?.content, isEditing]);

  if (!node || node.hidden || responsiveHidden(node, activeDevice)) return null;

  const handleContextMenu = (e) => {
    if (isPreview) return;
    e.preventDefault();
    e.stopPropagation();
    if (!selectedNodeIds.includes(nodeId)) {
      selectNode(nodeId);
    }
    openContextMenu({ x: e.clientX, y: e.clientY }, { kind: 'node', id: nodeId });
  };

  const handlePointerDown = (e) => {
    if (isPreview) return;
    e.stopPropagation();

    if (e.button === 2) {
      return;
    }

    if (activeTool === 'select') {
      if (e.shiftKey) {
        if (isSelected) {
          selectNodes(selectedNodeIds.filter((id) => id !== nodeId));
        } else {
          selectNodes([...selectedNodeIds, nodeId]);
        }
      } else {
        selectNode(nodeId);
      }
      return;
    }

    if (activeTool === 'hand') {
      e.stopPropagation();
      if (!isSelected) {
        selectNode(nodeId);
      }
      return;
    }
  };

  const handleDoubleClick = (e) => {
    if (isPreview) return;
    e.stopPropagation();
    
    if (activeTool === 'select' && TEXT_NODE_TYPES.has(node.type) && !node.locked) {
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
  const baseStyles = { ...(node.styles || {}) };
  const activeResponsiveStyles = responsiveStylesFor(node, activeDevice);
  
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
      baseStyles.position = baseStyles.position || 'relative';
    }
    if (!baseStyles.position) baseStyles.position = 'relative';
  }

  Object.assign(baseStyles, activeResponsiveStyles);

  // Merge drag transform
  const dragTransform = CSS.Transform.toString(transform);
  const style = {
    ...baseStyles,
    transform: [dragTransform, baseStyles.transform].filter(Boolean).join(' ') || undefined,
    transition: transition || baseStyles.transition,
    opacity: isDragging ? 0.4 : baseStyles.opacity || 1,
  };

  // ─── EDITOR CLASSES ──────────────────────────────────────
  let editorClasses = '';
  if (!isPreview) {
    editorClasses = 'group/node relative transition-[box-shadow] duration-200 ';
    editorClasses += activeTool === 'hand'
      ? 'cursor-grab active:cursor-grabbing '
      : 'cursor-pointer ';
    if (isSelected) {
      editorClasses += isRootSection
        ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-white z-20 '
        : 'ring-2 ring-indigo-500 ring-inset z-20 ';
    } else if (activeTool === 'select' && !node.locked) {
      editorClasses += isRootSection
        ? 'hover:ring-2 hover:ring-cyan-300/70 hover:ring-offset-2 hover:ring-offset-white '
        : 'hover:ring-2 hover:ring-indigo-400/50 hover:ring-inset ';
    }
  }

  // ─── RENDER SPECIFIC TYPES ───────────────────────────────

  if (node.type === NODE_TYPES.IMAGE) {
    return (
      <div
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses} overflow-hidden`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        <img
          src={node.props.src || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop'}
          alt={node.props.alt || 'Placeholder'}
          className="h-full w-full object-cover"
          style={{ objectFit: node.props.objectFit || 'cover', objectPosition: node.props.objectPosition || 'center' }}
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
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses} flex items-center justify-center`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
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

  if ([NODE_TYPES.FORM, NODE_TYPES.CONTACT_FORM, NODE_TYPES.BOOKING_FORM].includes(node.type)) {
    const fields = node.props?.fields || ['Name', 'Email', 'Message'];
    return (
      <form
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses} space-y-3`}
        onSubmit={(event) => event.preventDefault()}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        {fields.map((field) => (
          <label key={field} className="block text-sm font-bold text-slate-700">
            <span>{field}</span>
            {String(field).toLowerCase().includes('message') || String(field).toLowerCase().includes('note') ? (
              <textarea className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder={field} readOnly={isPreview} />
            ) : (
              <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder={field} readOnly={isPreview} />
            )}
          </label>
        ))}
        <button type="button" className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-black uppercase tracking-widest text-white">
          {node.props?.buttonText || 'Submit'}
        </button>
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </form>
    );
  }

  if ([NODE_TYPES.MAP, NODE_TYPES.MAP_EMBED].includes(node.type)) {
    return (
      <div
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses} flex items-center justify-center text-center`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-slate-700">Google Maps</p>
          <p className="mt-2 text-sm text-slate-500">{node.props?.location || node.content || 'Map location'}</p>
        </div>
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </div>
    );
  }

  if ([NODE_TYPES.GALLERY, NODE_TYPES.SLIDER].includes(node.type)) {
    const images = node.props?.images || [];
    return (
      <div
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses} ${node.type === NODE_TYPES.SLIDER ? 'block' : ''}`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        {images.length ? images.map((src, index) => (
          <img key={`${src}-${index}`} src={src} alt={`${node.name || 'Gallery'} ${index + 1}`} className="h-full min-h-32 w-full rounded-xl object-cover" draggable={false} />
        )) : <span className="text-sm text-slate-500">Add images from the Media Library.</span>}
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </div>
    );
  }

  if (node.type === NODE_TYPES.SOCIAL_LINKS) {
    const links = node.props?.links || ['Instagram', 'LinkedIn', 'YouTube'];
    return (
      <div
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses} flex flex-wrap gap-2`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        {links.map((link) => (
          <span key={link} className="rounded-full border border-current/20 px-3 py-1 text-sm font-bold">{link}</span>
        ))}
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </div>
    );
  }

  if (node.type === NODE_TYPES.SEARCH_BAR) {
    return (
      <form
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses}`}
        onSubmit={(event) => event.preventDefault()}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        <input className="min-w-0 flex-1 rounded-full border border-slate-200 px-3 py-2 text-sm" placeholder={node.props?.placeholder || 'Search'} readOnly />
        <button type="button" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white">{node.props?.buttonText || 'Search'}</button>
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </form>
    );
  }

  // ─── VIDEO ─────────────────────────────────────────────
  if (node.type === NODE_TYPES.VIDEO) {
    return (
      <div
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses} flex items-center justify-center overflow-hidden`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        {node.props?.src ? (
          <video src={node.props.src} poster={node.props.poster} controls={isPreview} muted className="h-full w-full object-cover" style={{ pointerEvents: isPreview ? 'auto' : 'none' }} />
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            <p className="text-sm font-bold text-slate-500">Video placeholder</p>
            <p className="text-xs text-slate-400">Set URL in Media Properties</p>
          </div>
        )}
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </div>
    );
  }

  // ─── COUNTDOWN ─────────────────────────────────────────
  if (node.type === NODE_TYPES.COUNTDOWN) {
    return (
      <div
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses}`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        {node.props?.label && <p className="mb-2 text-xs font-bold uppercase tracking-widest opacity-70">{node.props.label}</p>}
        <div className="flex gap-3">
          {['07', '12', '30'].map((val, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-3xl font-black tabular-nums">{val}</span>
              <span className="mt-1 text-[9px] font-bold uppercase tracking-widest opacity-60">{['Days', 'Hours', 'Min'][i]}</span>
            </div>
          ))}
        </div>
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </div>
    );
  }

  // ─── WHATSAPP BUTTON ───────────────────────────────────
  if (node.type === NODE_TYPES.WHATSAPP_BUTTON) {
    return (
      <a
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses}`}
        href={isPreview ? (node.props?.href || '#') : undefined}
        target={isPreview ? '_blank' : undefined}
        rel={isPreview ? 'noopener noreferrer' : undefined}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.09-1.12l-.29-.17-3.01.79.81-2.95-.19-.3A8 8 0 1112 20z"/></svg>
        <span>{node.content || 'WhatsApp'}</span>
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </a>
    );
  }

  // ─── LOTTIE ANIMATION ──────────────────────────────────
  if (node.type === NODE_TYPES.LOTTIE_ANIMATION) {
    return (
      <div
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses}`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-16 animate-pulse rounded-2xl bg-indigo-100" />
          <p className="text-sm font-bold text-slate-500">Lottie Animation</p>
          <p className="text-xs text-slate-400">Add .json URL in properties</p>
        </div>
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </div>
    );
  }

  // ─── 3D OBJECT ─────────────────────────────────────────
  if (node.type === NODE_TYPES.THREE_D_OBJECT) {
    return (
      <div
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses}`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="relative h-20 w-20">
            <div className="absolute inset-2 rotate-12 rounded-xl bg-indigo-500/30 border border-indigo-400/30" />
            <div className="absolute inset-0 -rotate-6 rounded-xl bg-indigo-500/20 border border-indigo-400/20" />
            <div className="absolute inset-1 rotate-3 rounded-xl bg-indigo-500/40 border border-indigo-400/40 flex items-center justify-center">
              <span className="text-lg font-black text-white/80">3D</span>
            </div>
          </div>
          <p className="text-sm font-bold text-white/70">3D Object</p>
          <p className="text-xs text-white/40">Upload .glb model in properties</p>
        </div>
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </div>
    );
  }

  // ─── CUSTOM HTML ───────────────────────────────────────
  if (node.type === NODE_TYPES.CUSTOM_HTML) {
    return (
      <div
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses}`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        {isPreview ? (
          <div dangerouslySetInnerHTML={{ __html: node.content || '<div>Custom HTML</div>' }} />
        ) : (
          <pre className="text-xs leading-5 whitespace-pre-wrap">{node.content || '<div>Custom HTML embed</div>'}</pre>
        )}
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </div>
    );
  }

  // ─── DIVIDER ───────────────────────────────────────────
  if (node.type === NODE_TYPES.DIVIDER) {
    return (
      <hr
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses} border-0`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      />
    );
  }

  // ─── SPACER ────────────────────────────────────────────
  if (node.type === NODE_TYPES.SPACER) {
    return (
      <div
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses} ${!isPreview ? 'bg-slate-100/30 border border-dashed border-slate-300/50' : ''}`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        {!isPreview && isSelected && <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold uppercase tracking-widest text-slate-400">Spacer</span>}
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </div>
    );
  }

  // ─── TABS ──────────────────────────────────────────────
  if (node.type === NODE_TYPES.TABS) {
    const tabs = node.props?.tabs || ['Overview', 'Details', 'FAQ'];
    const activeTab = node.props?.activeTab || tabs[0];
    return (
      <div
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses}`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        <div className="flex border-b border-slate-200 mb-3">
          {tabs.map((tab) => (
            <span key={tab} className={`px-4 py-2 text-sm font-bold ${tab === activeTab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>{tab}</span>
          ))}
        </div>
        <div className="p-3 text-sm text-slate-600">Content for "{activeTab}" tab. Double-click to edit or add child elements.</div>
        {node.children?.map((childId) => <NodeRenderer key={childId} nodeId={childId} isPreview={isPreview} />)}
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </div>
    );
  }

  // ─── ACCORDION ─────────────────────────────────────────
  if (node.type === NODE_TYPES.ACCORDION) {
    const items = node.props?.items || [{ title: 'Question', body: 'Answer content goes here.' }];
    return (
      <div
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses}`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        {items.map((item, i) => (
          <div key={i} className="border-b border-slate-200 py-3">
            <p className="text-sm font-bold text-slate-800 flex items-center justify-between">
              {item.title}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
            </p>
            <p className="mt-2 text-sm text-slate-600">{item.body}</p>
          </div>
        ))}
        {node.children?.map((childId) => <NodeRenderer key={childId} nodeId={childId} isPreview={isPreview} />)}
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </div>
    );
  }

  // ─── MODAL ─────────────────────────────────────────────
  if (node.type === NODE_TYPES.MODAL) {
    return (
      <div
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses}`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-slate-800">{node.props?.title || 'Modal title'}</p>
          <span className="text-slate-400 cursor-pointer text-lg">✕</span>
        </div>
        <div className="text-sm text-slate-600">{node.content || 'Modal content'}</div>
        {node.children?.map((childId) => <NodeRenderer key={childId} nodeId={childId} isPreview={isPreview} />)}
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </div>
    );
  }

  // ─── DROPDOWN ──────────────────────────────────────────
  if (node.type === NODE_TYPES.DROPDOWN) {
    const items = node.props?.items || ['Option 1', 'Option 2'];
    return (
      <div
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses}`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
          {node.props?.label || 'Menu'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
        </p>
        <div className="mt-2 space-y-1">
          {items.map((item) => (
            <p key={item} className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">{item}</p>
          ))}
        </div>
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </div>
    );
  }

  // ─── BREADCRUMB ────────────────────────────────────────
  if (node.type === NODE_TYPES.BREADCRUMB) {
    const crumbs = (node.content || 'Home / Page').split('/').map((s) => s.trim());
    return (
      <nav
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses}`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        {crumbs.map((crumb, i) => (
          <span key={i}>
            <span className={i === crumbs.length - 1 ? 'font-bold text-slate-800' : 'text-slate-500 hover:text-slate-700'}>{crumb}</span>
            {i < crumbs.length - 1 && <span className="mx-1 text-slate-400">/</span>}
          </span>
        ))}
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </nav>
    );
  }

  // ─── SIDEBAR ───────────────────────────────────────────
  if (node.type === NODE_TYPES.SIDEBAR) {
    return (
      <aside
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses}`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        <p className="text-sm font-bold mb-3">{node.content || 'Sidebar'}</p>
        {node.children?.map((childId) => <NodeRenderer key={childId} nodeId={childId} isPreview={isPreview} />)}
        {!isPreview && node.children?.length === 0 && <p className="text-xs opacity-50">Add child elements</p>}
        {!isPreview && isOnlySelected && RESIZABLE_NODE_TYPES.has(node.type) && <ResizeHandles nodeId={nodeId} />}
        {!isPreview && isOnlySelected && <FloatingToolbar nodeId={nodeId} />}
      </aside>
    );
  }

  if (TEXT_NODE_TYPES.has(node.type)) {
    const linkTypes = [NODE_TYPES.BUTTON, NODE_TYPES.NAV_LINK, NODE_TYPES.FOOTER_LINK, NODE_TYPES.WHATSAPP_BUTTON];
    const hasHref = Boolean(node.props?.href);
    const RenderTag = hasHref && !linkTypes.includes(node.type) ? 'a' : Tag;
    const linkProps = (hasHref || linkTypes.includes(node.type))
      ? {
          href: isPreview ? (node.props?.href || '#') : undefined,
          target: isPreview ? (node.props?.target || '_self') : undefined,
          rel: isPreview && node.props?.target === '_blank' ? 'noopener noreferrer' : undefined,
        }
      : {};
    return (
      <RenderTag
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses} outline-none cursor-text ${isEditing ? 'cursor-text ring-2 ring-indigo-500' : ''}`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClick}
        {...linkProps}
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
      </RenderTag>
    );
  }

  // ─── RENDER CONTAINER TYPES ──────────────────────────────
  if (CONTAINER_NODE_TYPES.has(node.type)) {
    return (
      <Tag
        ref={setNodeRef}
        data-node-id={nodeId}
        style={style}
        className={`${editorClasses} ${node.children?.length === 0 && !isPreview ? 'min-h-[60px] bg-slate-50/50' : ''}`}
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
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
      data-node-id={nodeId}
      style={style}
      className={editorClasses}
      onPointerDown={handlePointerDown}
      onContextMenu={handleContextMenu}
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
