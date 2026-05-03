import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import { responsiveHidden, responsiveStylesFor } from '../../utils/renderHelpers';
import ElementRenderer from './ElementRenderer';
import FloatingToolbar from './FloatingToolbar';
import ResizeHandles from './ResizeHandles';
import ConnectionHandle from './prototype/ConnectionHandle';

const groupElements = (section) => {
  const elements = section.elements || [];
  return {
    media: elements.filter((element) => ['image', 'video', 'gallery'].includes(element.type)),
    text: elements.filter((element) => !['image', 'video', 'gallery', 'card', 'pricingCard', 'testimonialCard', 'productCard', 'form'].includes(element.type)),
    cards: elements.filter((element) => ['card', 'pricingCard', 'testimonialCard', 'productCard'].includes(element.type)),
    forms: elements.filter((element) => element.type === 'form'),
    all: elements,
  };
};

export default function SectionRenderer({ section, index, readonly = false, device = 'desktop', runtimeMode = 'editor' }) {
  const navigate = useNavigate();
  const {
    currentPage,
    builderMode,
    selectedSectionId,
    selectedNodeIds,
    selectSection,
    selectNode,
    addElement,
    runNodeInteraction,
    openContextMenu,
    showToast,
  } = useBuilderStore();
  const sortable = useSortable({
    id: section.id,
    data: { dragType: 'section', sectionId: section.id },
    disabled: readonly || section.locked,
  });
  const selected = selectedSectionId === section.id || selectedNodeIds.includes(section.id);
  const hidden = section.hidden || responsiveHidden(section, device);

  if (hidden) return null;

  const groups = groupElements(section);
  const isMobile = device === 'mobile';
  const wrapperStyle = {
    ...(section.styles || {}),
    ...responsiveStylesFor(section, device),
    position: 'relative',
    opacity: section.styles?.opacity,
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };

  const handleSectionClick = (event) => {
    if (readonly) {
      const handled = runNodeInteraction(section.id, runtimeMode, navigate);
      if (handled) event.preventDefault();
      return;
    }
    event.stopPropagation();
    if (builderMode === 'prototype' && (event.ctrlKey || event.metaKey)) {
      const handled = runNodeInteraction(section.id, 'editor', navigate);
      if (!handled) showToast('No prototype interaction is connected to this section yet.');
      return;
    }
    if (event.shiftKey) {
      selectNode(section.id, { multi: true });
      return;
    }
    selectSection(section.id);
  };

  const handleContextMenu = (event) => {
    if (readonly) return;
    event.preventDefault();
    event.stopPropagation();
    selectSection(section.id);
    openContextMenu({ x: event.clientX, y: event.clientY }, { kind: 'section', sectionId: section.id, nodeId: section.id });
  };

  const renderDefault = () => (
    <div className="space-y-6">
      {groups.all.map((element) => (
        <ElementRenderer key={element.id} element={element} sectionId={section.id} readonly={readonly} device={device} runtimeMode={runtimeMode} />
      ))}
    </div>
  );

  const renderContent = () => {
    if (section.type === 'navbar') {
      return (
        <div className="flex flex-wrap items-center gap-4">
          {groups.all.map((element) => (
            <ElementRenderer key={element.id} element={element} sectionId={section.id} readonly={readonly} device={device} runtimeMode={runtimeMode} />
          ))}
        </div>
      );
    }

    if (section.type === 'hero') {
      return (
        <div className="grid items-center gap-10" style={{ gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.05fr) minmax(0, 0.95fr)' }}>
          <div className="space-y-5">
            {groups.text.map((element) => (
              <ElementRenderer key={element.id} element={element} sectionId={section.id} readonly={readonly} device={device} runtimeMode={runtimeMode} />
            ))}
          </div>
          <div className="space-y-5">
            {groups.media.map((element) => (
              <ElementRenderer key={element.id} element={element} sectionId={section.id} readonly={readonly} device={device} runtimeMode={runtimeMode} />
            ))}
          </div>
        </div>
      );
    }

    if (['services', 'pricing', 'testimonials', 'product', 'team', 'blog'].includes(section.type)) {
      return (
        <div className="space-y-8">
          <div className="max-w-3xl space-y-4">
            {groups.text.map((element) => (
              <ElementRenderer key={element.id} element={element} sectionId={section.id} readonly={readonly} device={device} runtimeMode={runtimeMode} />
            ))}
          </div>
          <div className="grid gap-5" style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {groups.cards.map((element) => (
              <ElementRenderer key={element.id} element={element} sectionId={section.id} readonly={readonly} device={device} runtimeMode={runtimeMode} />
            ))}
          </div>
        </div>
      );
    }

    if (section.type === 'contact') {
      return (
        <div className="grid gap-8" style={{ gridTemplateColumns: isMobile ? '1fr' : '0.9fr 1.1fr' }}>
          <div className="space-y-4">
            {groups.text.map((element) => (
              <ElementRenderer key={element.id} element={element} sectionId={section.id} readonly={readonly} device={device} runtimeMode={runtimeMode} />
            ))}
          </div>
          {groups.forms.map((element) => (
            <ElementRenderer key={element.id} element={element} sectionId={section.id} readonly={readonly} device={device} runtimeMode={runtimeMode} />
          ))}
        </div>
      );
    }

    if (section.type === 'gallery') {
      return (
        <div className="space-y-7">
          {groups.text.map((element) => (
            <ElementRenderer key={element.id} element={element} sectionId={section.id} readonly={readonly} device={device} runtimeMode={runtimeMode} />
          ))}
          {groups.media.map((element) => (
            <ElementRenderer key={element.id} element={element} sectionId={section.id} readonly={readonly} device={device} runtimeMode={runtimeMode} />
          ))}
        </div>
      );
    }

    return renderDefault();
  };

  return (
    <section
      ref={sortable.setNodeRef}
      style={wrapperStyle}
      onClick={handleSectionClick}
      onContextMenu={handleContextMenu}
      className={`relative ${sortable.isDragging ? 'z-30 opacity-50' : ''} ${!readonly ? 'cursor-pointer hover:outline hover:outline-1 hover:outline-indigo-300/70' : ''} ${selected && !readonly ? 'outline outline-2 outline-indigo-500' : ''}`}
      data-builder-section={section.id}
      data-node-id={section.id}
      data-section-id={section.id}
      data-page-id={currentPage?.id}
      data-prototype-target="section"
      id={section.id}
    >
      {!readonly && selected && (
        <FloatingToolbar
          item={section}
          kind="Section"
          sectionId={section.id}
          dragAttributes={sortable.attributes}
          dragListeners={sortable.listeners}
        />
      )}
      {!readonly && selected && (
        <div className="absolute left-4 top-4 z-20 rounded-lg bg-indigo-600 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-white">
          {index + 1}. {section.name}
        </div>
      )}
      {!readonly && selected && builderMode === 'prototype' && <ConnectionHandle sourceNodeId={section.id} sourcePageId={currentPage?.id} />}
      <SortableContext items={(section.elements || []).map((element) => element.id)} strategy={verticalListSortingStrategy}>
        {renderContent()}
      </SortableContext>
      {!readonly && selected && <ResizeHandles kind="section" sectionId={section.id} minWidth={260} minHeight={160} />}
      {!readonly && selected && (
        <button
          type="button"
          title="Add heading element"
          onClick={(event) => { event.stopPropagation(); addElement('heading', section.id); }}
          className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-slate-950/90 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-indigo-600"
        >
          <Plus size={14} />
          Add element
        </button>
      )}
    </section>
  );
}

