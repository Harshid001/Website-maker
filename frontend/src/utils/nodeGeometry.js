const safeSelector = (value) => String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');

export const getNodeElement = (nodeId, root = document) => {
  if (!nodeId || typeof document === 'undefined') return null;
  return root.querySelector(`[data-node-id="${safeSelector(nodeId)}"]`);
};

export const getNodeRect = (nodeId, relativeTo, root = document) => {
  const element = getNodeElement(nodeId, root);
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  if (!relativeTo) return rect;
  const parentRect = relativeTo.getBoundingClientRect();
  const scale = parentRect.width && relativeTo.offsetWidth ? parentRect.width / relativeTo.offsetWidth : 1;
  return {
    left: (rect.left - parentRect.left) / scale + relativeTo.scrollLeft,
    top: (rect.top - parentRect.top) / scale + relativeTo.scrollTop,
    right: (rect.right - parentRect.left) / scale + relativeTo.scrollLeft,
    bottom: (rect.bottom - parentRect.top) / scale + relativeTo.scrollTop,
    width: rect.width / scale,
    height: rect.height / scale,
  };
};

export const getConnectorStartPoint = (sourceRect) => ({
  x: sourceRect.right,
  y: sourceRect.top + sourceRect.height / 2,
});

export const getConnectorEndPoint = (targetRect) => ({
  x: targetRect.left,
  y: targetRect.top + targetRect.height / 2,
});

export const createCurvePath = (start, end) => {
  const distance = Math.max(80, Math.abs(end.x - start.x) * 0.45);
  const c1 = { x: start.x + distance, y: start.y };
  const c2 = { x: end.x - distance, y: end.y };
  return `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
};

export const getInteractionTargetNodeId = (interaction) => {
  if (!interaction) return null;
  if (interaction.targetType === 'page') return `page-target-${interaction.targetPageId}`;
  if (interaction.targetType === 'section') return interaction.targetSectionId;
  if (interaction.targetType === 'node') return interaction.targetNodeId;
  return 'external-target-prototype';
};

export const pointFromClient = (position, relativeTo) => {
  if (!position || !relativeTo) return null;
  const rect = relativeTo.getBoundingClientRect();
  const scale = rect.width && relativeTo.offsetWidth ? rect.width / relativeTo.offsetWidth : 1;
  return {
    x: (position.x - rect.left) / scale + relativeTo.scrollLeft,
    y: (position.y - rect.top) / scale + relativeTo.scrollTop,
  };
};
