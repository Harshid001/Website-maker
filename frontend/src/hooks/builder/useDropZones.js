import { useCallback } from 'react';
import { CONTAINER_NODE_TYPES } from '../../data/nodeSchema';
import { insetRect, normalizeRect, screenToCanvasPoint } from '../../utils/placementEngine';

const px = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const safeSelector = (value) => String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const getAncestors = (nodesMap, nodeId) => {
  const ancestors = [];
  let current = nodesMap[nodeId];
  while (current?.parentId) {
    ancestors.push(current.parentId);
    current = nodesMap[current.parentId];
  }
  return ancestors;
};

const toCanvasRect = (rect, canvasRect, scale) => normalizeRect({
  left: (rect.left - canvasRect.left) / scale,
  top: (rect.top - canvasRect.top) / scale,
  width: rect.width / scale,
  height: rect.height / scale,
});

const getNodeElement = (canvas, nodeId) => (
  nodeId ? canvas.querySelector(`[data-node-id="${safeSelector(nodeId)}"]`) : null
);

export function useDropZones(canvasRef, nodesMap, currentPage) {
  const measureDropZones = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { zones: [], existingElements: [], canvasRect: null, scale: 1 };
    }

    const canvasDomRect = canvas.getBoundingClientRect();
    const scale = canvas.offsetWidth ? canvasDomRect.width / canvas.offsetWidth : 1;
    const canvasRect = normalizeRect({
      left: 0,
      top: 0,
      width: canvas.offsetWidth || canvasDomRect.width,
      height: canvas.offsetHeight || canvasDomRect.height,
    });

    const pageZone = {
      id: currentPage?.id || 'page',
      nodeId: currentPage?.id || 'page',
      pageId: currentPage?.id || 'page',
      type: 'page',
      kind: 'canvas',
      name: 'Page Canvas',
      depth: 0,
      rect: canvasRect,
      innerRect: canvasRect,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      accepts: ['section', 'element'],
      children: currentPage?.sections || currentPage?.children || [],
      ancestorIds: [],
    };

    const zones = [pageZone];
    const existingElements = [];

    Object.values(nodesMap || {}).forEach((node) => {
      if (!node || node.hidden || node.type === 'page') return;
      const element = getNodeElement(canvas, node.id);
      if (!element) return;

      const localRect = toCanvasRect(element.getBoundingClientRect(), canvasDomRect, scale);
      const styles = window.getComputedStyle(element);
      const padding = {
        top: px(styles.paddingTop),
        right: px(styles.paddingRight),
        bottom: px(styles.paddingBottom),
        left: px(styles.paddingLeft),
      };
      const nodeData = {
        id: node.id,
        nodeId: node.id,
        pageId: currentPage?.id || 'page',
        parentId: node.parentId,
        type: node.type,
        name: node.name,
        rect: localRect,
        locked: Boolean(node.locked),
        hidden: Boolean(node.hidden),
        fixed: node.props?.position === 'fixed' || node.styles?.position === 'fixed',
        zIndex: node.layout?.zIndex ?? node.styles?.zIndex,
        layout: node.layout,
        styles: node.styles,
        children: node.children || [],
      };

      existingElements.push(nodeData);

      if (CONTAINER_NODE_TYPES.has(node.type) && !node.locked) {
        zones.push({
          ...nodeData,
          depth: getAncestors(nodesMap, node.id).length,
          kind: node.parentId === currentPage?.id ? 'section' : 'container',
          innerRect: insetRect(localRect, padding),
          padding,
          accepts: node.props?.accepts,
          gridColumns: 12,
          ancestorIds: getAncestors(nodesMap, node.id),
        });
      }
    });

    return { zones, existingElements, canvasRect, scale };
  }, [canvasRef, currentPage?.children, currentPage?.id, currentPage?.sections, nodesMap]);

  const clientPointToCanvas = useCallback((clientPoint) => {
    const canvas = canvasRef.current;
    if (!canvas || !clientPoint) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.offsetWidth ? rect.width / canvas.offsetWidth : 1;
    return screenToCanvasPoint(clientPoint.x, clientPoint.y, rect, scale, { x: 0, y: 0 });
  }, [canvasRef]);

  const clientSizeToCanvas = useCallback((size) => {
    const canvas = canvasRef.current;
    if (!canvas || !size) return size || { width: 1, height: 1 };
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.offsetWidth ? rect.width / canvas.offsetWidth : 1;
    return {
      width: Math.max(1, size.width / scale),
      height: Math.max(1, size.height / scale),
    };
  }, [canvasRef]);

  return { measureDropZones, clientPointToCanvas, clientSizeToCanvas };
}
