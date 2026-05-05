import { memo } from 'react';
import { NODE_TYPES, TEXT_NODE_TYPES, CONTAINER_NODE_TYPES, LAYOUT_MODES, NODE_TAG_MAP } from '../../data/nodeSchema';
import { responsiveHidden, responsiveStylesFor } from '../../utils/renderHelpers';
import * as LucideIcons from 'lucide-react';

const CleanRenderer = memo(({ nodeId, nodesMap, device = 'desktop' }) => {
  const node = nodesMap[nodeId];
  if (!node || node.hidden || responsiveHidden(node, device)) return null;

  const Tag = NODE_TAG_MAP[node.type] || 'div';

  // ─── STYLES & LAYOUT ─────────────────────────────────────
  const baseStyles = { ...node.styles, ...responsiveStylesFor(node, device) };
  
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
      baseStyles.position = 'relative'; 
    }
  }

  // ─── RENDER SPECIFIC TYPES ───────────────────────────────

  if (node.type === NODE_TYPES.IMAGE) {
    return (
      <div style={baseStyles} className="overflow-hidden">
        <img
          src={node.props.src || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop'}
          alt={node.props.alt || 'Image'}
          className="h-full w-full object-cover"
          style={{ objectFit: node.props.objectFit || 'cover' }}
        />
      </div>
    );
  }

  if (node.type === NODE_TYPES.ICON) {
    const iconName = node.content?.trim() || 'Sparkles';
    const IconComponent = LucideIcons[iconName] || LucideIcons.Sparkles;
    return (
      <div style={baseStyles} className="flex items-center justify-center">
        <IconComponent size={24} color="currentColor" />
      </div>
    );
  }

  if ([NODE_TYPES.FORM, NODE_TYPES.CONTACT_FORM, NODE_TYPES.BOOKING_FORM].includes(node.type)) {
    const fields = node.props?.fields || ['Name', 'Email', 'Message'];
    return (
      <form style={baseStyles} className="space-y-3" onSubmit={(event) => event.preventDefault()}>
        {fields.map((field) => {
          const lower = String(field).toLowerCase();
          return (
            <label key={field} className="block text-sm font-bold text-slate-700">
              <span>{field}</span>
              {lower.includes('message') || lower.includes('note') ? (
                <textarea className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder={field} />
              ) : (
                <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder={field} />
              )}
            </label>
          );
        })}
        <button type="submit" className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-black uppercase tracking-widest text-white">
          {node.props?.buttonText || 'Submit'}
        </button>
      </form>
    );
  }

  if ([NODE_TYPES.MAP, NODE_TYPES.MAP_EMBED].includes(node.type)) {
    return (
      <div style={baseStyles} className="flex items-center justify-center text-center">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-slate-700">Google Maps</p>
          <p className="mt-2 text-sm text-slate-500">{node.props?.location || node.content || 'Map location'}</p>
        </div>
      </div>
    );
  }

  if ([NODE_TYPES.GALLERY, NODE_TYPES.SLIDER].includes(node.type)) {
    const images = node.props?.images || [];
    return (
      <div style={baseStyles}>
        {images.map((src, index) => (
          <img key={`${src}-${index}`} src={src} alt={`${node.name || 'Gallery'} ${index + 1}`} className="h-full min-h-32 w-full rounded-xl object-cover" />
        ))}
      </div>
    );
  }

  if (node.type === NODE_TYPES.SOCIAL_LINKS) {
    const links = node.props?.links || ['Instagram', 'LinkedIn', 'YouTube'];
    return (
      <div style={baseStyles} className="flex flex-wrap gap-2">
        {links.map((link) => <span key={link} className="rounded-full border border-current/20 px-3 py-1 text-sm font-bold">{link}</span>)}
      </div>
    );
  }

  if (node.type === NODE_TYPES.SEARCH_BAR) {
    return (
      <form style={baseStyles} onSubmit={(event) => event.preventDefault()}>
        <input className="min-w-0 flex-1 rounded-full border border-slate-200 px-3 py-2 text-sm" placeholder={node.props?.placeholder || 'Search'} />
        <button type="submit" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white">{node.props?.buttonText || 'Search'}</button>
      </form>
    );
  }

  if (TEXT_NODE_TYPES.has(node.type)) {
    const linkProps = [NODE_TYPES.BUTTON, NODE_TYPES.NAV_LINK, NODE_TYPES.FOOTER_LINK, NODE_TYPES.WHATSAPP_BUTTON].includes(node.type)
      ? { href: node.props?.href || '#', target: node.props?.target || '_self', rel: node.props?.target === '_blank' ? 'noopener noreferrer' : undefined }
      : {};
    return (
      <Tag style={baseStyles} className="break-words" {...linkProps}>
        <span dangerouslySetInnerHTML={{ __html: node.content }} />
      </Tag>
    );
  }

  if (CONTAINER_NODE_TYPES.has(node.type)) {
    return (
      <Tag style={baseStyles}>
        {node.children?.map((childId) => (
          <CleanRenderer key={childId} nodeId={childId} nodesMap={nodesMap} device={device} />
        ))}
      </Tag>
    );
  }

  return (
    <div style={baseStyles}>
      {node.content}
    </div>
  );
});

export default CleanRenderer;
