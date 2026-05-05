import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { ImageOff, MapPin, Play, Send, Sparkles } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import { animationClassFor, responsiveHidden, responsiveStylesFor } from '../../utils/renderHelpers';
import FloatingToolbar from './FloatingToolbar';
import ResizeHandles from './ResizeHandles';
import ConnectionHandle from './prototype/ConnectionHandle';

const getTextFromContent = (content) => {
  if (typeof content === 'string') return content;
  return content?.body || content?.title || content?.quote || '';
};

const resizableTypes = new Set(['image', 'video', 'button', 'card', 'container', 'spacer', 'gallery', 'productCard', 'form', 'testimonialCard', 'pricingCard']);

export default function ElementRenderer({ element, sectionId, readonly = false, device = 'desktop', runtimeMode = 'editor' }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [editing, setEditing] = useState(false);
  const {
    currentPage,
    builderMode,
    activeTool,
    selectedElementId,
    selectedNodeIds,
    selectElement,
    selectNode,
    updateElement,
    updateSelectedContent,
    runNodeInteraction,
    openContextMenu,
    showToast,
  } = useBuilderStore();
  const selected = selectedElementId === element.id || selectedNodeIds.includes(element.id);
  const hidden = element.hidden || responsiveHidden(element, device);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: element.id,
    data: { dragType: 'element', sectionId, elementId: element.id, elementType: element.type },
    disabled: readonly || element.locked || activeTool !== 'hand',
  });

  if (hidden) return null;

  const baseClass = `${animationClassFor(element.animation)}`;
  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (event) => {
    if (readonly) {
      const handled = runNodeInteraction(element.id, runtimeMode, navigate);
      if (handled) event.preventDefault();
      return;
    }
    event.stopPropagation();
    if (builderMode === 'prototype' && (event.ctrlKey || event.metaKey)) {
      const handled = runNodeInteraction(element.id, 'editor', navigate);
      if (!handled) showToast('No prototype interaction is connected to this element yet.');
      return;
    }
    if (element.locked) {
      showToast('This element is locked. Unlock it from the right panel to edit.');
    }
    if (event.shiftKey) {
      selectNode(element.id, { multi: true });
      return;
    }
    selectElement(sectionId, element.id);
  };

  const handleContextMenu = (event) => {
    if (readonly) return;
    event.preventDefault();
    event.stopPropagation();
    selectElement(sectionId, element.id);
    openContextMenu({ x: event.clientX, y: event.clientY }, { kind: 'element', sectionId, elementId: element.id, nodeId: element.id });
  };

  const beginEditing = (event) => {
    if (readonly || element.locked) return;
    event.stopPropagation();
    selectElement(sectionId, element.id);
    setEditing(true);
  };

  const finishStringEdit = (event) => {
    setEditing(false);
    updateSelectedContent(event.currentTarget.innerText);
  };

  const finishObjectEdit = (key) => (event) => {
    setEditing(false);
    updateElement(sectionId, element.id, { content: { ...(element.content || {}), [key]: event.currentTarget.innerText } });
  };

  const cancelEdit = (event) => {
    if (event.key === 'Escape') {
      event.currentTarget.innerText = typeof element.content === 'string' ? element.content : getTextFromContent(element.content);
      setEditing(false);
      event.currentTarget.blur();
    }
    if (event.key === 'Enter' && element.type !== 'paragraph') {
      event.preventDefault();
      event.currentTarget.blur();
    }
  };

  const stringEditableProps = {
    suppressContentEditableWarning: true,
    contentEditable: editing && !readonly && !element.locked,
    onDoubleClick: beginEditing,
    onBlur: finishStringEdit,
    onKeyDown: cancelEdit,
  };

  const renderElement = () => {
    const liveStyles = { ...(element.styles || {}), ...responsiveStylesFor(element, device) };
    if (element.type === 'heading') {
      return (
        <h2 style={liveStyles} className={`outline-none ${baseClass} ${editing ? 'cursor-text' : 'cursor-pointer'}`} {...stringEditableProps}>
          {element.content}
        </h2>
      );
    }

    if (element.type === 'paragraph') {
      return (
        <p style={liveStyles} className={`outline-none ${baseClass} ${editing ? 'cursor-text' : 'cursor-pointer'}`} {...stringEditableProps}>
          {element.content}
        </p>
      );
    }

    if (element.type === 'button') {
      return (
        <a
          href={readonly ? element.props?.href || '#' : '#'}
          target={element.props?.target || '_self'}
          rel="noreferrer"
          style={liveStyles}
          onClick={(event) => {
            if (!readonly) event.preventDefault();
          }}
          className={`inline-flex cursor-pointer no-underline transition-transform hover:-translate-y-0.5 ${baseClass}`}
          {...stringEditableProps}
        >
          {element.content}
        </a>
      );
    }

    if (element.type === 'image') {
      return imageError ? (
        <div className="flex min-h-[220px] items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          <ImageOff size={28} />
        </div>
      ) : (
        <img
          src={element.props?.src}
          alt={element.props?.alt || ''}
          onError={() => setImageError(true)}
          style={{ ...liveStyles, objectFit: element.props?.objectFit || 'cover', objectPosition: element.props?.objectPosition || 'center' }}
          className={`block max-w-full ${baseClass}`}
        />
      );
    }

    if (element.type === 'video') {
      return (
        <div style={liveStyles} className={`flex w-full items-center justify-center text-white ${baseClass}`}>
          <Play size={32} />
          <span className="ml-3 text-sm font-bold uppercase tracking-widest">{element.content}</span>
        </div>
      );
    }

    if (element.type === 'icon') {
      return (
        <div style={liveStyles} className={`inline-flex items-center justify-center ${baseClass}`}>
          <Sparkles size={24} />
        </div>
      );
    }

    if (element.type === 'divider' || element.type === 'spacer') {
      return <div aria-label={element.name} style={liveStyles} className={`block w-full ${baseClass}`} />;
    }

    if (element.type === 'form') {
      return (
        <form
          style={liveStyles}
          onSubmit={(event) => {
            event.preventDefault();
            showToast(element.props?.successMessage || 'Form submitted in preview mode.');
          }}
          className={`space-y-3 ${baseClass}`}
        >
          {(element.props?.fields || ['Name', 'Email', 'Message']).map((field) => (
            <input key={field} readOnly placeholder={field} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none" />
          ))}
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-widest text-white">
            <Send size={14} />
            {element.props?.buttonText || 'Submit'}
          </button>
        </form>
      );
    }

    if (element.type === 'map') {
      return (
        <div style={liveStyles} className={`flex w-full flex-col items-center justify-center text-slate-500 ${baseClass}`}>
          <MapPin size={26} />
          <span className="mt-2 text-xs font-bold uppercase tracking-widest">{element.props?.location || element.content}</span>
        </div>
      );
    }

    if (element.type === 'socialLinks') {
      return (
        <div style={liveStyles} className={`cursor-pointer ${baseClass}`}>
          {(element.props?.links || ['Instagram', 'LinkedIn']).map((link) => (
            <span key={link} className="inline-flex rounded-full border border-current/20 px-3 py-1 text-xs font-bold">
              {link}
            </span>
          ))}
        </div>
      );
    }

    if (element.type === 'gallery') {
      return (
        <div style={liveStyles} className={`cursor-pointer ${baseClass}`}>
          {(element.props?.images || []).map((src) => (
            <img key={src} src={src} alt="" className="h-40 w-full rounded-xl object-cover" />
          ))}
        </div>
      );
    }

    const content = element.content || {};
    return (
      <article style={liveStyles} className={`cursor-pointer ${baseClass}`}>
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
          <Sparkles size={18} />
        </div>
        <h3
          className="mb-2 text-xl font-black tracking-tight outline-none"
          suppressContentEditableWarning
          contentEditable={editing && !readonly && !element.locked}
          onDoubleClick={beginEditing}
          onBlur={finishObjectEdit(content.quote ? 'quote' : 'title')}
          onKeyDown={cancelEdit}
        >
          {content.quote || content.title || element.name || 'Card'}
        </h3>
        {content.price && (
          <p
            className="mb-3 text-3xl font-black outline-none"
            suppressContentEditableWarning
            contentEditable={editing && !readonly && !element.locked}
            onDoubleClick={beginEditing}
            onBlur={finishObjectEdit('price')}
            onKeyDown={cancelEdit}
          >
            {content.price}
          </p>
        )}
        <p
          className="text-sm leading-6 opacity-70 outline-none"
          suppressContentEditableWarning
          contentEditable={editing && !readonly && !element.locked}
          onDoubleClick={beginEditing}
          onBlur={finishObjectEdit('body')}
          onKeyDown={cancelEdit}
        >
          {content.body || getTextFromContent(content)}
        </p>
        {content.author && <p className="mt-4 text-xs font-black uppercase tracking-widest opacity-60">{content.author}</p>}
      </article>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={sortableStyle}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={`relative ${!readonly ? 'cursor-pointer' : ''} ${selected && !readonly ? 'z-20 ring-2 ring-indigo-500 ring-offset-2 ring-offset-white' : ''}`}
      data-builder-element={element.id}
      data-node-id={element.id}
      data-section-id={sectionId}
      data-element-id={element.id}
      data-page-id={currentPage?.id}
      data-prototype-target="node"
      id={element.props?.elementId || element.id}
    >
      {selected && !readonly && (
        <FloatingToolbar
          item={element}
          kind="Element"
          sectionId={sectionId}
          elementId={element.id}
          dragAttributes={attributes}
          dragListeners={listeners}
        />
      )}
      {selected && !readonly && builderMode === 'prototype' && <ConnectionHandle sourceNodeId={element.id} sourcePageId={currentPage?.id} />}
      {renderElement()}
      {selected && !readonly && resizableTypes.has(element.type) && (
        <ResizeHandles kind="element" sectionId={sectionId} elementId={element.id} minWidth={element.type === 'button' ? 80 : 120} minHeight={element.type === 'spacer' ? 12 : 40} />
      )}
    </div>
  );
}
