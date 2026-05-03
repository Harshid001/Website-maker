import React, { memo } from 'react';
import { NODE_TYPES, TEXT_NODE_TYPES, CONTAINER_NODE_TYPES, LAYOUT_MODES, NODE_TAG_MAP } from '../../data/nodeSchema';
import * as LucideIcons from 'lucide-react';

const CleanRenderer = memo(({ nodeId, nodesMap }) => {
  const node = nodesMap[nodeId];
  if (!node || node.hidden) return null;

  const Tag = NODE_TAG_MAP[node.type] || 'div';

  // ─── STYLES & LAYOUT ─────────────────────────────────────
  const baseStyles = { ...node.styles };
  
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

  if (TEXT_NODE_TYPES.has(node.type)) {
    return (
      <Tag style={baseStyles} className="break-words">
        <span dangerouslySetInnerHTML={{ __html: node.content }} />
      </Tag>
    );
  }

  if (CONTAINER_NODE_TYPES.has(node.type)) {
    return (
      <Tag style={baseStyles}>
        {node.children?.map((childId) => (
          <CleanRenderer key={childId} nodeId={childId} nodesMap={nodesMap} />
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
