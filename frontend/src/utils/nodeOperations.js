/**
 * nodeOperations.js
 * ─────────────────────────────────────────────────
 * Pure functions for CRUD operations on a normalized node map.
 * All functions accept a nodesMap { [id]: node } and return a new map (immutable).
 */

import { createId } from './ids';
import { deepClone } from './deepClone';
import {
  createNode,
  createPricingCard,
  createProductCard,
  createServiceCard,
  createTestimonialCard,
  LAYOUT_MODES,
  NODE_TYPES,
} from '../data/nodeSchema';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Queries (read-only, no mutation)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Get all root-level nodes (no parent) */
export const getRootNodes = (nodesMap) =>
  Object.values(nodesMap).filter((n) => !n.parentId);

/** Get direct children of a node, ordered by parent.children array */
export const getChildren = (nodesMap, nodeId) => {
  const parent = nodesMap[nodeId];
  if (!parent || !parent.children?.length) return [];
  return parent.children.map((childId) => nodesMap[childId]).filter(Boolean);
};

/** Get all descendants recursively (depth-first) */
export const getDescendants = (nodesMap, nodeId) => {
  const result = [];
  const walk = (id) => {
    const node = nodesMap[id];
    if (!node) return;
    for (const childId of node.children || []) {
      const child = nodesMap[childId];
      if (child) {
        result.push(child);
        walk(childId);
      }
    }
  };
  walk(nodeId);
  return result;
};

/** Get ancestor chain from node up to root */
export const getAncestors = (nodesMap, nodeId) => {
  const result = [];
  let current = nodesMap[nodeId];
  while (current?.parentId) {
    const parent = nodesMap[current.parentId];
    if (!parent) break;
    result.push(parent);
    current = parent;
  }
  return result;
};

/** Check if nodeId is a descendant of ancestorId */
export const isDescendantOf = (nodesMap, nodeId, ancestorId) => {
  let current = nodesMap[nodeId];
  while (current?.parentId) {
    if (current.parentId === ancestorId) return true;
    current = nodesMap[current.parentId];
  }
  return false;
};

/** Build a nested tree structure for a specific parent (for rendering) */
export const getNodeTree = (nodesMap, parentId) => {
  const parent = nodesMap[parentId];
  if (!parent) return [];
  
  return (parent.children || [])
    .map((childId) => {
      const node = nodesMap[childId];
      if (!node) return null;
      return {
        ...node,
        children: getNodeTree(nodesMap, childId),
      };
    })
    .filter(Boolean);
};

/** Flatten tree into ordered list (for layers panel or breadcrumbs) */
export const flattenTree = (nodesMap, rootId, depth = 0) => {
  const node = nodesMap[rootId];
  if (!node) return [];
  const result = [{ ...node, _depth: depth }];
  // We skip the rootId itself in the result if it's the page node? 
  // No, let's keep it consistent.
  for (const childId of node.children || []) {
    result.push(...flattenTree(nodesMap, childId, depth + 1));
  }
  return result;
};

/** Get all page root nodes for a specific page */
export const getPageRootNodes = (nodesMap, pageId) => {
  const page = nodesMap[pageId];
  if (!page) return [];
  return (page.children || []).map((id) => nodesMap[id]).filter(Boolean);
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Mutations (return new map)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Add a node to the map and register it as a child of parentId.
 * @param {object} nodesMap
 * @param {string} parentId
 * @param {object} nodeData - Partial node data (will be merged with createNode)
 * @param {number} [index] - Position in parent's children array. -1 or undefined = append.
 * @returns {object} { nodesMap, nodeId }
 */
export const addNode = (nodesMap, parentId, nodeData, index = -1) => {
  const type = nodeData.type || NODE_TYPES.CONTAINER;

  const cardFactory = {
    [NODE_TYPES.CARD]: (data) => createServiceCard({ ...data, type: NODE_TYPES.CARD }),
    [NODE_TYPES.BLOG_CARD]: (data) => createServiceCard({ ...data, type: NODE_TYPES.BLOG_CARD, title: data.title || 'Article title', description: data.description || 'A short article summary for this blog card.', buttonText: data.buttonText || 'Read More' }),
    [NODE_TYPES.SERVICE_CARD]: createServiceCard,
    [NODE_TYPES.PRODUCT_CARD]: createProductCard,
    [NODE_TYPES.TESTIMONIAL_CARD]: createTestimonialCard,
    [NODE_TYPES.PRICING_CARD]: createPricingCard,
  }[type];

  if (cardFactory && !nodeData.children?.length) {
    const bundle = cardFactory({ ...nodeData, parentId });
    let next = { ...nodesMap };
    for (const bundleNode of bundle.allNodes) {
      next[bundleNode.id] = bundleNode;
    }

    if (parentId && next[parentId]) {
      const parent = { ...next[parentId] };
      const children = [...(parent.children || [])];
      if (index >= 0 && index < children.length) {
        children.splice(index, 0, bundle.parent.id);
      } else {
        children.push(bundle.parent.id);
      }
      parent.children = children;
      next[parentId] = parent;
    }

    return { nodesMap: next, nodeId: bundle.parent.id };
  }

  const node = nodeData.id && nodeData.type ? { ...createNode(nodeData.type, nodeData), ...nodeData } : createNode(nodeData.type || NODE_TYPES.CONTAINER, nodeData);
  node.parentId = parentId;

  const next = { ...nodesMap, [node.id]: node };

  if (parentId && next[parentId]) {
    const parent = { ...next[parentId] };
    const children = [...(parent.children || [])];
    if (index >= 0 && index < children.length) {
      children.splice(index, 0, node.id);
    } else {
      children.push(node.id);
    }
    parent.children = children;
    next[parentId] = parent;
  }

  return { nodesMap: next, nodeId: node.id };
};

/**
 * Add multiple nodes at once (e.g., decomposed card with children).
 * @param {object} nodesMap
 * @param {object[]} nodes - Array of complete node objects
 * @returns {object} new nodesMap
 */
export const addNodes = (nodesMap, nodes) => {
  const next = { ...nodesMap };
  for (const node of nodes) {
    next[node.id] = node;
  }
  // Register parent-child relationships
  for (const node of nodes) {
    if (node.parentId && next[node.parentId]) {
      const parent = { ...next[node.parentId] };
      if (!parent.children?.includes(node.id)) {
        parent.children = [...(parent.children || []), node.id];
        next[node.parentId] = parent;
      }
    }
  }
  return next;
};

/**
 * Update a node with a shallow patch.
 * Nested objects (styles, props, layout, responsive, animation) are merged.
 */
export const updateNode = (nodesMap, nodeId, patch) => {
  const node = nodesMap[nodeId];
  if (!node) return nodesMap;

  const updated = { ...node };

  for (const key of Object.keys(patch)) {
    if (['styles', 'props', 'layout', 'responsive', 'animation'].includes(key) && typeof patch[key] === 'object' && patch[key] !== null) {
      updated[key] = { ...(node[key] || {}), ...patch[key] };
    } else {
      updated[key] = patch[key];
    }
  }

  updated.updatedAt = new Date().toISOString();
  return { ...nodesMap, [nodeId]: updated };
};

/** Update just the content of a node */
export const updateNodeContent = (nodesMap, nodeId, content) =>
  updateNode(nodesMap, nodeId, { content });

/** Update just the styles of a node */
export const updateNodeStyles = (nodesMap, nodeId, styles) =>
  updateNode(nodesMap, nodeId, { styles });

/** Update just the props of a node */
export const updateNodeProps = (nodesMap, nodeId, props) =>
  updateNode(nodesMap, nodeId, { props });

/** Update the layout of a node */
export const updateNodeLayout = (nodesMap, nodeId, layout) =>
  updateNode(nodesMap, nodeId, { layout });

/** Update responsive styles for a specific device */
export const updateNodeResponsive = (nodesMap, nodeId, device, deviceStyles) => {
  const node = nodesMap[nodeId];
  if (!node) return nodesMap;
  return updateNode(nodesMap, nodeId, {
    responsive: {
      ...(node.responsive || {}),
      [device]: { ...((node.responsive || {})[device] || {}), ...deviceStyles },
    },
  });
};

/** Update animation settings */
export const updateNodeAnimation = (nodesMap, nodeId, animation) =>
  updateNode(nodesMap, nodeId, { animation });

/**
 * Delete a node and all its descendants.
 * Also removes the node from its parent's children array.
 */
export const deleteNode = (nodesMap, nodeId) => {
  const node = nodesMap[nodeId];
  if (!node) return nodesMap;

  // Collect all IDs to remove (node + descendants)
  const idsToRemove = new Set([nodeId]);
  const collectDescendants = (id) => {
    const n = nodesMap[id];
    if (!n) return;
    for (const childId of n.children || []) {
      idsToRemove.add(childId);
      collectDescendants(childId);
    }
  };
  collectDescendants(nodeId);

  // Build new map without removed nodes
  const next = {};
  for (const [id, n] of Object.entries(nodesMap)) {
    if (idsToRemove.has(id)) continue;
    next[id] = n;
  }

  // Remove from parent's children
  if (node.parentId && next[node.parentId]) {
    const parent = { ...next[node.parentId] };
    parent.children = (parent.children || []).filter((id) => id !== nodeId);
    next[node.parentId] = parent;
  }

  return next;
};

/**
 * Delete multiple nodes.
 */
export const deleteNodes = (nodesMap, nodeIds) => {
  let result = nodesMap;
  for (const id of nodeIds) {
    result = deleteNode(result, id);
  }
  return result;
};

/**
 * Move a node to a new parent at a specific index.
 */
export const moveNode = (nodesMap, nodeId, newParentId, newIndex = -1) => {
  const node = nodesMap[nodeId];
  if (!node) return nodesMap;
  if (node.locked) return nodesMap;

  // Prevent moving into own descendants
  if (isDescendantOf(nodesMap, newParentId, nodeId)) return nodesMap;

  let next = { ...nodesMap };

  // Remove from old parent
  if (node.parentId && next[node.parentId]) {
    const oldParent = { ...next[node.parentId] };
    oldParent.children = (oldParent.children || []).filter((id) => id !== nodeId);
    next[oldParent.id] = oldParent;
  }

  // Add to new parent
  if (next[newParentId]) {
    const newParent = { ...next[newParentId] };
    const children = [...(newParent.children || [])].filter((id) => id !== nodeId);
    if (newIndex >= 0 && newIndex <= children.length) {
      children.splice(newIndex, 0, nodeId);
    } else {
      children.push(nodeId);
    }
    newParent.children = children;
    next[newParentId] = newParent;
  }

  // Update node's parentId
  next[nodeId] = { ...node, parentId: newParentId };

  return next;
};

/**
 * Reorder a node within its parent's children array.
 */
export const reorderNode = (nodesMap, nodeId, newIndex) => {
  const node = nodesMap[nodeId];
  if (!node?.parentId) return nodesMap;
  return moveNode(nodesMap, nodeId, node.parentId, newIndex);
};

/**
 * Drag a node to an absolute position (for free-position mode).
 */
export const dragNode = (nodesMap, nodeId, position) => {
  const node = nodesMap[nodeId];
  if (!node || node.locked) return nodesMap;
  return updateNode(nodesMap, nodeId, {
    layout: {
      ...(node.layout || {}),
      x: position.x,
      y: position.y,
    },
  });
};

/**
 * Move a node to a parent and store absolute placement metadata in one commit.
 */
export const placeNode = (nodesMap, nodeId, newParentId, placement = {}) => {
  const node = nodesMap[nodeId];
  if (!node || node.locked) return nodesMap;

  const moved = newParentId && newParentId !== node.parentId
    ? moveNode(nodesMap, nodeId, newParentId, placement.index ?? -1)
    : nodesMap;
  const latest = moved[nodeId];
  if (!latest) return moved;

  const responsive = { ...(latest.responsive || {}) };
  for (const [device, styles] of Object.entries(placement.responsive || {})) {
    responsive[device] = { ...(responsive[device] || {}), ...(styles || {}) };
  }

  return updateNode(moved, nodeId, {
    layout: {
      ...(latest.layout || {}),
      positionMode: LAYOUT_MODES.FREE,
      x: Math.round(Number(placement.x) || 0),
      y: Math.round(Number(placement.y) || 0),
      width: placement.width ?? latest.layout?.width ?? 'auto',
      height: placement.height ?? latest.layout?.height ?? 'auto',
      zIndex: placement.zIndex ?? latest.layout?.zIndex ?? 'auto',
      parentSectionId: placement.parentSectionId || newParentId || latest.parentId,
    },
    responsive,
  });
};

/**
 * Resize a node.
 */
export const resizeNode = (nodesMap, nodeId, size) => {
  const node = nodesMap[nodeId];
  if (!node || node.locked) return nodesMap;
  const styles = { ...(node.styles || {}) };
  if (size.width !== undefined) styles.width = typeof size.width === 'number' ? `${size.width}px` : size.width;
  if (size.height !== undefined) styles.height = typeof size.height === 'number' ? `${size.height}px` : size.height;
  return updateNode(nodesMap, nodeId, { styles });
};

/**
 * Duplicate a node and all its descendants with new IDs.
 * The duplicate is inserted after the original in its parent's children.
 */
export const duplicateNode = (nodesMap, nodeId) => {
  const node = nodesMap[nodeId];
  if (!node) return { nodesMap, newNodeId: null };

  // Deep clone the node tree
  const idMapping = {};
  const cloneWithNewIds = (id) => {
    const original = nodesMap[id];
    if (!original) return null;
    const newId = createId('node');
    idMapping[id] = newId;
    const cloned = {
      ...deepClone(original),
      id: newId,
      name: id === nodeId ? `${original.name} Copy` : original.name,
    };
    cloned.children = (original.children || [])
      .map((childId) => {
        const result = cloneWithNewIds(childId);
        return result ? idMapping[childId] : null;
      })
      .filter(Boolean);
    return cloned;
  };

  const rootClone = cloneWithNewIds(nodeId);
  if (!rootClone) return { nodesMap, newNodeId: null };

  // Collect all cloned nodes
  const clonedNodes = {};
  const collectClones = (originalId) => {
    const newId = idMapping[originalId];
    const original = nodesMap[originalId];
    if (!original || !newId) return;
    clonedNodes[newId] = {
      ...deepClone(original),
      id: newId,
      name: originalId === nodeId ? `${original.name} Copy` : original.name,
      parentId: original.parentId ? (idMapping[original.parentId] || original.parentId) : original.parentId,
      children: (original.children || []).map((cid) => idMapping[cid]).filter(Boolean),
    };
    for (const childId of original.children || []) {
      collectClones(childId);
    }
  };
  collectClones(nodeId);

  // Fix root clone's parentId to keep original parent
  const newRootId = idMapping[nodeId];
  if (clonedNodes[newRootId]) {
    clonedNodes[newRootId].parentId = node.parentId;
  }

  let next = { ...nodesMap, ...clonedNodes };

  // Insert after original in parent's children
  if (node.parentId && next[node.parentId]) {
    const parent = { ...next[node.parentId] };
    const children = [...(parent.children || [])];
    const originalIndex = children.indexOf(nodeId);
    if (originalIndex >= 0) {
      children.splice(originalIndex + 1, 0, newRootId);
    } else {
      children.push(newRootId);
    }
    parent.children = children;
    next[node.parentId] = parent;
  }

  return { nodesMap: next, newNodeId: newRootId };
};

/** Toggle lock on a node */
export const lockNode = (nodesMap, nodeId) => {
  const node = nodesMap[nodeId];
  if (!node) return nodesMap;
  return updateNode(nodesMap, nodeId, { locked: !node.locked });
};

/** Toggle hidden on a node */
export const hideNode = (nodesMap, nodeId) => {
  const node = nodesMap[nodeId];
  if (!node) return nodesMap;
  return updateNode(nodesMap, nodeId, { hidden: !node.hidden });
};

/**
 * Group multiple nodes into a new group container.
 * All nodes must share the same parent.
 */
export const groupNodes = (nodesMap, nodeIds) => {
  if (nodeIds.length < 2) return { nodesMap, groupId: null };

  const nodes = nodeIds.map((id) => nodesMap[id]).filter(Boolean);
  if (nodes.length < 2) return { nodesMap, groupId: null };

  // All nodes must share same parent
  const parentId = nodes[0].parentId;
  const sameParent = nodes.every((n) => n.parentId === parentId);
  if (!sameParent) return { nodesMap, groupId: null };

  const groupId = createId('node');
  const group = createNode(NODE_TYPES.GROUP, {
    id: groupId,
    name: 'Group',
    parentId,
    children: nodeIds,
    layout: { positionMode: LAYOUT_MODES.FLOW },
  });

  let next = { ...nodesMap, [groupId]: group };

  // Update children's parentId
  for (const id of nodeIds) {
    if (next[id]) {
      next[id] = { ...next[id], parentId: groupId };
    }
  }

  // Replace children in parent with group node
  if (parentId && next[parentId]) {
    const parent = { ...next[parentId] };
    const children = [...(parent.children || [])];
    // Find the position of first selected child
    const firstIndex = Math.min(...nodeIds.map((id) => children.indexOf(id)).filter((i) => i >= 0));
    // Remove selected children
    const filtered = children.filter((id) => !nodeIds.includes(id));
    // Insert group at first position
    const insertAt = Math.min(firstIndex, filtered.length);
    filtered.splice(insertAt, 0, groupId);
    parent.children = filtered;
    next[parentId] = parent;
  }

  return { nodesMap: next, groupId };
};

/**
 * Ungroup a group node — move children back to parent, delete group wrapper.
 */
export const ungroupNode = (nodesMap, groupNodeId) => {
  const group = nodesMap[groupNodeId];
  if (!group || group.type !== NODE_TYPES.GROUP) return nodesMap;

  const parentId = group.parentId;
  const childIds = group.children || [];
  let next = { ...nodesMap };

  // Reparent children to group's parent
  for (const childId of childIds) {
    if (next[childId]) {
      next[childId] = { ...next[childId], parentId };
    }
  }

  // Replace group with its children in parent's children array
  if (parentId && next[parentId]) {
    const parent = { ...next[parentId] };
    const children = [...(parent.children || [])];
    const groupIndex = children.indexOf(groupNodeId);
    if (groupIndex >= 0) {
      children.splice(groupIndex, 1, ...childIds);
    }
    parent.children = children;
    next[parentId] = parent;
  }

  // Delete group node
  delete next[groupNodeId];

  return next;
};

/**
 * Bring a node to the front (last in parent's children = highest z-index).
 */
export const bringToFront = (nodesMap, nodeId) => {
  const node = nodesMap[nodeId];
  if (!node?.parentId) return nodesMap;
  const parent = { ...nodesMap[node.parentId] };
  const children = (parent.children || []).filter((id) => id !== nodeId);
  children.push(nodeId);
  parent.children = children;
  return { ...nodesMap, [parent.id]: parent };
};

/**
 * Send a node to the back (first in parent's children = lowest z-index).
 */
export const sendToBack = (nodesMap, nodeId) => {
  const node = nodesMap[nodeId];
  if (!node?.parentId) return nodesMap;
  const parent = { ...nodesMap[node.parentId] };
  const children = (parent.children || []).filter((id) => id !== nodeId);
  children.unshift(nodeId);
  parent.children = children;
  return { ...nodesMap, [parent.id]: parent };
};

/**
 * Move a node one layer forward within its parent's stacking order.
 */
export const bringForward = (nodesMap, nodeId) => {
  const node = nodesMap[nodeId];
  if (!node?.parentId) return nodesMap;
  const parent = { ...nodesMap[node.parentId] };
  const children = [...(parent.children || [])];
  const index = children.indexOf(nodeId);
  if (index < 0 || index >= children.length - 1) return nodesMap;
  children.splice(index, 1);
  children.splice(index + 1, 0, nodeId);
  parent.children = children;
  return { ...nodesMap, [parent.id]: parent };
};

/**
 * Move a node one layer backward within its parent's stacking order.
 */
export const sendBackward = (nodesMap, nodeId) => {
  const node = nodesMap[nodeId];
  if (!node?.parentId) return nodesMap;
  const parent = { ...nodesMap[node.parentId] };
  const children = [...(parent.children || [])];
  const index = children.indexOf(nodeId);
  if (index <= 0) return nodesMap;
  children.splice(index, 1);
  children.splice(index - 1, 0, nodeId);
  parent.children = children;
  return { ...nodesMap, [parent.id]: parent };
};

/**
 * Align multiple nodes along an axis.
 * Requires DOM measurements (bounding boxes) to be passed in.
 * @param {object} nodesMap
 * @param {string[]} nodeIds
 * @param {'left'|'center'|'right'|'top'|'middle'|'bottom'} direction
 * @param {object} boundingBoxes - { [nodeId]: { x, y, width, height } }
 */
export const alignNodes = (nodesMap, nodeIds, direction, boundingBoxes = {}) => {
  if (nodeIds.length < 2) return nodesMap;

  const boxes = nodeIds.map((id) => ({ id, ...(boundingBoxes[id] || { x: 0, y: 0, width: 0, height: 0 }) }));
  const hasMeasurements = Object.keys(boundingBoxes || {}).length > 0;
  let next = { ...nodesMap };

  const allLeft = boxes.map((b) => b.x);
  const allRight = boxes.map((b) => b.x + b.width);
  const allTop = boxes.map((b) => b.y);
  const allBottom = boxes.map((b) => b.y + b.height);

  for (const box of boxes) {
    const node = next[box.id];
    if (!node || node.locked) continue;

    let newX = box.x;
    let newY = box.y;

    switch (direction) {
      case 'left': newX = Math.min(...allLeft); break;
      case 'center': newX = (Math.min(...allLeft) + Math.max(...allRight)) / 2 - box.width / 2; break;
      case 'right': newX = Math.max(...allRight) - box.width; break;
      case 'top': newY = Math.min(...allTop); break;
      case 'middle': newY = (Math.min(...allTop) + Math.max(...allBottom)) / 2 - box.height / 2; break;
      case 'bottom': newY = Math.max(...allBottom) - box.height; break;
    }

    next = updateNode(next, box.id, {
      layout: {
        ...(node.layout || {}),
        ...(hasMeasurements ? { positionMode: LAYOUT_MODES.FREE } : {}),
        x: Math.round(newX),
        y: Math.round(newY),
      },
    });
  }

  return next;
};

/**
 * Distribute nodes evenly along an axis.
 * @param {object} nodesMap
 * @param {string[]} nodeIds
 * @param {'horizontal'|'vertical'} direction
 * @param {object} boundingBoxes - { [nodeId]: { x, y, width, height } }
 */
export const distributeNodes = (nodesMap, nodeIds, direction, boundingBoxes = {}) => {
  if (nodeIds.length < 3) return nodesMap;

  const boxes = nodeIds
    .map((id) => ({ id, ...(boundingBoxes[id] || { x: 0, y: 0, width: 0, height: 0 }) }))
    .sort((a, b) => (direction === 'horizontal' ? a.x - b.x : a.y - b.y));

  let next = { ...nodesMap };

  if (direction === 'horizontal') {
    const totalWidth = boxes.reduce((sum, b) => sum + b.width, 0);
    const minX = boxes[0].x;
    const maxRight = boxes[boxes.length - 1].x + boxes[boxes.length - 1].width;
    const totalSpace = maxRight - minX - totalWidth;
    const gap = totalSpace / (boxes.length - 1);

    let currentX = minX;
    for (const box of boxes) {
      const node = next[box.id];
      if (node && !node.locked) {
        next = updateNode(next, box.id, { layout: { ...(node.layout || {}), positionMode: LAYOUT_MODES.FREE, x: Math.round(currentX) } });
      }
      currentX += box.width + gap;
    }
  } else {
    const totalHeight = boxes.reduce((sum, b) => sum + b.height, 0);
    const minY = boxes[0].y;
    const maxBottom = boxes[boxes.length - 1].y + boxes[boxes.length - 1].height;
    const totalSpace = maxBottom - minY - totalHeight;
    const gap = totalSpace / (boxes.length - 1);

    let currentY = minY;
    for (const box of boxes) {
      const node = next[box.id];
      if (node && !node.locked) {
        next = updateNode(next, box.id, { layout: { ...(node.layout || {}), positionMode: LAYOUT_MODES.FREE, y: Math.round(currentY) } });
      }
      currentY += box.height + gap;
    }
  }

  return next;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Migration: convert legacy section/element arrays to nodesMap
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Convert legacy project data (pages with sections and elements arrays)
 * into a normalized nodesMap.
 * @param {object[]} pages - Array of page objects from old format
 * @returns {object} nodesMap
 */
export const migrateFromLegacy = (pages = []) => {
  const nodesMap = {};

  for (const page of pages) {
    const pageNode = createNode(NODE_TYPES.PAGE, {
      id: page.id,
      name: page.name || 'Page',
      content: '',
      styles: page.styles || {},
      children: [],
    });

    const sectionIds = [];

    for (const section of page.sections || []) {
      const sectionType = mapLegacySectionType(section.type);
      const sectionNode = createNode(sectionType, {
        id: section.id,
        name: section.name || section.type || 'Section',
        parentId: page.id,
        content: '',
        styles: section.styles || {},
        locked: section.locked || false,
        hidden: section.hidden || false,
        animation: section.animation || {},
        responsive: section.responsive || {},
        children: [],
      });

      const elementIds = [];

      for (const element of section.elements || []) {
        const migrated = migrateLegacyElement(element, section.id);
        const migratedNodes = migrated.allNodes || [migrated];
        const rootNode = migrated.parent || migrated;
        for (const elementNode of migratedNodes) {
          nodesMap[elementNode.id] = elementNode;
        }
        elementIds.push(rootNode.id);
      }

      sectionNode.children = elementIds;
      nodesMap[sectionNode.id] = sectionNode;
      sectionIds.push(sectionNode.id);
    }

    pageNode.children = sectionIds;
    nodesMap[pageNode.id] = pageNode;
  }

  return nodesMap;
};

/** Map legacy section types to node types */
const mapLegacySectionType = (type) => {
  const mapping = {
    navbar: NODE_TYPES.NAVBAR,
    footer: NODE_TYPES.FOOTER,
    hero: NODE_TYPES.SECTION,
    services: NODE_TYPES.SECTION,
    pricing: NODE_TYPES.SECTION,
    testimonials: NODE_TYPES.SECTION,
    contact: NODE_TYPES.SECTION,
    about: NODE_TYPES.SECTION,
    team: NODE_TYPES.SECTION,
    blog: NODE_TYPES.SECTION,
    restaurantMenu: NODE_TYPES.SECTION,
    portfolio: NODE_TYPES.SECTION,
    ecommerceProduct: NODE_TYPES.SECTION,
    booking: NODE_TYPES.SECTION,
    newsletter: NODE_TYPES.SECTION,
    product: NODE_TYPES.SECTION,
    gallery: NODE_TYPES.SECTION,
    faq: NODE_TYPES.SECTION,
    custom: NODE_TYPES.SECTION,
    cta: NODE_TYPES.SECTION,
  };
  return mapping[type] || NODE_TYPES.SECTION;
};

/** Convert a legacy element to a node */
const migrateLegacyElement = (element, sectionId) => {
  const contentObject = typeof element.content === 'object' && element.content !== null ? element.content : {};
  const shared = {
    id: element.id,
    name: element.name || element.type || 'Element',
    parentId: sectionId,
    props: element.props || {},
    styles: element.styles || {},
    locked: element.locked || false,
    hidden: element.hidden || false,
    animation: element.animation || {},
    responsive: element.responsive || {},
  };

  if (element.type === NODE_TYPES.SERVICE_CARD || element.type === 'card') {
    return createServiceCard({
      ...shared,
      title: contentObject.title,
      description: contentObject.body || contentObject.description,
      buttonText: contentObject.buttonText,
    });
  }

  if (element.type === NODE_TYPES.PRODUCT_CARD) {
    return createProductCard({
      ...shared,
      title: contentObject.title,
      price: contentObject.price,
      description: contentObject.body || contentObject.description,
      imageSrc: element.props?.src || contentObject.image,
      imageAlt: element.props?.alt || contentObject.title,
      buttonText: contentObject.buttonText,
    });
  }

  if (element.type === NODE_TYPES.TESTIMONIAL_CARD) {
    return createTestimonialCard({
      ...shared,
      quote: contentObject.quote || contentObject.body,
      authorName: contentObject.author || contentObject.name,
      authorRole: contentObject.role,
      avatarSrc: element.props?.src || contentObject.avatar,
    });
  }

  if (element.type === NODE_TYPES.PRICING_CARD) {
    return createPricingCard({
      ...shared,
      planName: contentObject.title || contentObject.planName,
      price: contentObject.price,
      description: contentObject.body || contentObject.description,
      buttonText: contentObject.buttonText,
    });
  }

  // Map old card content objects to appropriate node content
  let content = element.content;
  if (typeof content === 'object' && content !== null) {
    // For cards with object content, extract displayable text
    content = content.title || content.quote || content.body || '';
  }

  return createNode(element.type || NODE_TYPES.CONTAINER, {
    id: element.id,
    name: element.name || element.type || 'Element',
    parentId: sectionId,
    content: content ?? '',
    props: element.props || {},
    styles: element.styles || {},
    locked: element.locked || false,
    hidden: element.hidden || false,
    animation: element.animation || {},
    responsive: element.responsive || {},
    children: [],
  });
};
