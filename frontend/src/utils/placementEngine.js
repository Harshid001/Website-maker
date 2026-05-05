export const DEBUG_DROP_ENGINE = false;

const SNAP_THRESHOLD = 8;
const ACTIVE_ZONE_FALLBACK_DISTANCE = 80;

export const SECTION_LEVEL_TYPES = new Set([
  'section',
  'navbar',
  'footer',
  'hero',
  'services',
  'pricing',
  'testimonials',
  'faq',
  'about',
  'contact',
  'gallery',
  'team',
  'blog',
  'product',
  'custom',
  'newsletter',
  'booking',
  'portfolio',
  'restaurantMenu',
  'ecommerceProduct',
]);

const MEDIA_TYPES = new Set(['image', 'video', 'gallery', 'slider', 'map', 'mapEmbed', 'threeDObject', 'lottieAnimation']);
const CARD_TYPES = new Set(['card', 'blogCard', 'productCard', 'testimonialCard', 'pricingCard', 'serviceCard']);
const FORM_TYPES = new Set(['form', 'contactForm', 'bookingForm']);
const TEXT_TYPES = new Set(['heading', 'paragraph', 'button', 'navLink', 'footerLink', 'whatsappButton', 'socialLinks', 'countdown', 'searchBar', 'breadcrumb']);
const CONTAINER_TYPES = new Set(['section', 'navbar', 'footer', 'container', 'grid', 'flex', 'row', 'column', 'group', ...CARD_TYPES, ...FORM_TYPES, 'tabs', 'accordion', 'modal', 'dropdown', 'sidebar']);

const DEFAULT_SIZES = {
  heading: { width: 360, height: 76 },
  paragraph: { width: 420, height: 96 },
  button: { width: 160, height: 48 },
  navLink: { width: 120, height: 42 },
  footerLink: { width: 120, height: 32 },
  image: { width: 360, height: 240 },
  video: { width: 420, height: 260 },
  gallery: { width: 520, height: 300 },
  slider: { width: 520, height: 320 },
  card: { width: 280, height: 220 },
  blogCard: { width: 300, height: 240 },
  productCard: { width: 300, height: 320 },
  testimonialCard: { width: 300, height: 220 },
  pricingCard: { width: 300, height: 320 },
  serviceCard: { width: 280, height: 220 },
  form: { width: 380, height: 340 },
  contactForm: { width: 380, height: 340 },
  bookingForm: { width: 420, height: 380 },
  container: { width: 420, height: 220 },
  grid: { width: 560, height: 320 },
  flex: { width: 520, height: 220 },
  row: { width: 520, height: 180 },
  column: { width: 360, height: 260 },
  navbar: { width: 900, height: 88 },
  footer: { width: 900, height: 220 },
  section: { width: 680, height: 360 },
  customHtml: { width: 360, height: 180 },
};

export const getDefaultElementSize = (type = 'container') => (
  DEFAULT_SIZES[type] || (SECTION_LEVEL_TYPES.has(type) ? DEFAULT_SIZES.section : { width: 260, height: 160 })
);

export const normalizeRect = (rect = {}) => {
  const left = Number(rect.left ?? rect.x ?? 0);
  const top = Number(rect.top ?? rect.y ?? 0);
  const width = Math.max(0, Number(rect.width ?? 0));
  const height = Math.max(0, Number(rect.height ?? 0));
  return {
    left,
    top,
    x: left,
    y: top,
    width,
    height,
    right: Number(rect.right ?? left + width),
    bottom: Number(rect.bottom ?? top + height),
  };
};

export const screenToCanvasPoint = (clientX, clientY, canvasRect, zoom = 1, pan = { x: 0, y: 0 }) => ({
  x: (clientX - (canvasRect?.left || 0) - (pan?.x || 0)) / (zoom || 1),
  y: (clientY - (canvasRect?.top || 0) - (pan?.y || 0)) / (zoom || 1),
});

export const canvasToScreenRect = (rect, canvasRect, zoom = 1, pan = { x: 0, y: 0 }) => ({
  left: (canvasRect?.left || 0) + (pan?.x || 0) + (rect.x ?? rect.left ?? 0) * (zoom || 1),
  top: (canvasRect?.top || 0) + (pan?.y || 0) + (rect.y ?? rect.top ?? 0) * (zoom || 1),
  width: (rect.width || 0) * (zoom || 1),
  height: (rect.height || 0) * (zoom || 1),
});

export const getElementCanvasRect = (element = {}) => normalizeRect({
  left: element.x ?? element.left ?? element.layout?.x ?? 0,
  top: element.y ?? element.top ?? element.layout?.y ?? 0,
  width: element.width ?? element.layout?.width ?? 0,
  height: element.height ?? element.layout?.height ?? 0,
});

export const insetRect = (rect, padding = 0) => {
  const next = normalizeRect(rect);
  const pad = typeof padding === 'number'
    ? { top: padding, right: padding, bottom: padding, left: padding }
    : { top: 0, right: 0, bottom: 0, left: 0, ...padding };
  const left = next.left + pad.left;
  const top = next.top + pad.top;
  const width = Math.max(0, next.width - pad.left - pad.right);
  const height = Math.max(0, next.height - pad.top - pad.bottom);
  return normalizeRect({ left, top, width, height });
};

export const parsePadding = (value, fallback = 24) => {
  if (typeof value === 'number') return { top: value, right: value, bottom: value, left: value };
  const parts = String(value || '')
    .split(/\s+/)
    .map((part) => Number.parseFloat(part))
    .filter(Number.isFinite);
  if (!parts.length) return { top: fallback, right: fallback, bottom: fallback, left: fallback };
  const [top, right = top, bottom = top, left = right] = parts;
  return { top, right, bottom, left };
};

export const rectContainsPoint = (rect, point) => (
  Boolean(rect && point)
  && point.x >= rect.left
  && point.x <= rect.right
  && point.y >= rect.top
  && point.y <= rect.bottom
);

export const rectsIntersect = (a, b) => (
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
);

const intersectionArea = (a, b) => {
  const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return width * height;
};

const area = (rect) => Math.max(0, rect.width) * Math.max(0, rect.height);

const elementGroup = (type) => {
  if (SECTION_LEVEL_TYPES.has(type)) return 'section';
  if (MEDIA_TYPES.has(type)) return 'media';
  if (CARD_TYPES.has(type)) return 'card';
  if (FORM_TYPES.has(type)) return 'form';
  if (TEXT_TYPES.has(type)) return 'text';
  if (CONTAINER_TYPES.has(type)) return 'container';
  return 'element';
};

const defaultAcceptsForZone = (zone = {}) => {
  if (zone.accepts?.length) return zone.accepts;
  if (zone.type === 'page' || zone.kind === 'canvas') {
    return ['section', 'navbar', 'footer', 'container', 'grid', 'flex', 'row', 'column'];
  }
  if (zone.type === 'navbar') {
    return ['heading', 'paragraph', 'button', 'navLink', 'image', 'icon', 'socialLinks', 'searchBar', 'dropdown', 'container'];
  }
  if (zone.type === 'footer') {
    return ['heading', 'paragraph', 'button', 'footerLink', 'image', 'icon', 'socialLinks', 'container', 'customHtml'];
  }
  if (zone.type === 'grid') {
    return ['card', 'blogCard', 'productCard', 'testimonialCard', 'pricingCard', 'serviceCard', 'image', 'video', 'container'];
  }
  if (FORM_TYPES.has(zone.type)) {
    return ['heading', 'paragraph', 'button', 'icon', 'container'];
  }
  return [
    'heading',
    'paragraph',
    'button',
    'image',
    'video',
    'icon',
    'divider',
    'spacer',
    'container',
    'grid',
    'flex',
    'row',
    'column',
    'card',
    'blogCard',
    'productCard',
    'testimonialCard',
    'pricingCard',
    'serviceCard',
    'form',
    'contactForm',
    'bookingForm',
    'map',
    'mapEmbed',
    'whatsappButton',
    'socialLinks',
    'countdown',
    'slider',
    'gallery',
    'customHtml',
    'lottieAnimation',
    'threeDObject',
    'searchBar',
    'tabs',
    'accordion',
    'modal',
    'dropdown',
    'sidebar',
    'breadcrumb',
  ];
};

const isTypeAccepted = (element, zone) => {
  const type = element.type;
  const accepts = defaultAcceptsForZone(zone);
  const group = elementGroup(type);
  if (group === 'section') return zone.type === 'page' || zone.kind === 'canvas';
  return accepts.includes(type) || accepts.includes(group) || accepts.includes('element');
};

const clamp = (value, min, max) => {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
};

const snapToCandidates = (value, candidates) => {
  let best = null;
  for (const candidate of candidates) {
    const distance = Math.abs(value - candidate.value);
    if (distance < SNAP_THRESHOLD && (!best || distance < best.distance)) {
      best = { ...candidate, distance };
    }
  }
  return best;
};

const siblingSnapCandidates = (element, zone, existingElements = []) => {
  const ignoreIds = new Set([element.id, ...(element.groupIds || [])].filter(Boolean));
  const zoneInner = normalizeRect(zone.innerRect || zone.rect);
  const siblings = existingElements.filter((item) => {
    if (ignoreIds.has(item.id)) return false;
    if (item.parentId !== zone.id && item.parentId !== zone.sectionId) return false;
    const rect = normalizeRect(item.rect);
    return rectsIntersect(rect, zoneInner);
  });
  const x = [];
  const y = [];
  siblings.forEach((item) => {
    const rect = normalizeRect(item.rect);
    x.push(
      { value: rect.left, guide: rect.left, label: `Align left with ${item.name || item.type || 'item'}` },
      { value: rect.right - element.width, guide: rect.right, label: `Align right with ${item.name || item.type || 'item'}` },
      { value: rect.left + rect.width / 2 - element.width / 2, guide: rect.left + rect.width / 2, label: `Center with ${item.name || item.type || 'item'}` },
    );
    y.push(
      { value: rect.top, guide: rect.top, label: `Align top with ${item.name || item.type || 'item'}` },
      { value: rect.bottom - element.height, guide: rect.bottom, label: `Align bottom with ${item.name || item.type || 'item'}` },
      { value: rect.top + rect.height / 2 - element.height / 2, guide: rect.top + rect.height / 2, label: `Middle align with ${item.name || item.type || 'item'}` },
    );
  });
  return { x, y };
};

export const calculateSnapPosition = (element, targetZone, existingElements = []) => {
  const zoneInner = normalizeRect(targetZone.innerRect || targetZone.rect);
  const pointer = element.pointer || {
    x: (element.originalRect?.left ?? zoneInner.left) + element.width / 2,
    y: (element.originalRect?.top ?? zoneInner.top) + element.height / 2,
  };
  const dragOffset = element.dragOffset || { x: element.width / 2, y: element.height / 2 };

  const maxX = Math.max(zoneInner.left, zoneInner.right - element.width);
  const maxY = Math.max(zoneInner.top, zoneInner.bottom - element.height);
  const rawX = pointer.x - dragOffset.x;
  const rawY = pointer.y - dragOffset.y;
  const startX = clamp(rawX, zoneInner.left, maxX);
  const startY = clamp(rawY, zoneInner.top, maxY);
  const gridColumns = targetZone.gridColumns || 12;
  const columnWidth = zoneInner.width / gridColumns;
  const columnCandidates = Array.from({ length: gridColumns + 1 }, (_, index) => ({
    value: zoneInner.left + columnWidth * index,
    guide: zoneInner.left + columnWidth * index,
    label: 'Grid column',
  }));
  const siblingCandidates = siblingSnapCandidates(element, targetZone, existingElements);

  const xCandidates = [
    { value: zoneInner.left, guide: zoneInner.left, label: 'Section left padding' },
    { value: zoneInner.left + zoneInner.width / 2 - element.width / 2, guide: zoneInner.left + zoneInner.width / 2, label: 'Center align with section' },
    { value: zoneInner.right - element.width, guide: zoneInner.right, label: 'Section right padding' },
    ...columnCandidates,
    ...siblingCandidates.x,
  ];
  const yCandidates = [
    { value: zoneInner.top, guide: zoneInner.top, label: 'Section top padding' },
    { value: zoneInner.top + zoneInner.height / 2 - element.height / 2, guide: zoneInner.top + zoneInner.height / 2, label: 'Middle align with section' },
    { value: zoneInner.bottom - element.height, guide: zoneInner.bottom, label: 'Section bottom padding' },
    ...siblingCandidates.y,
  ];

  const xSnap = snapToCandidates(startX, xCandidates);
  const ySnap = snapToCandidates(startY, yCandidates);
  const x = Math.round(clamp(xSnap?.value ?? startX, zoneInner.left, maxX));
  const y = Math.round(clamp(ySnap?.value ?? startY, zoneInner.top, maxY));
  const rect = normalizeRect({ left: x, top: y, width: element.width, height: element.height });
  const guides = [];

  if (xSnap) {
    guides.push({
      axis: 'x',
      position: Math.round(xSnap.guide),
      start: Math.round(targetZone.rect.top),
      end: Math.round(targetZone.rect.bottom),
      label: xSnap.label,
    });
  }
  if (ySnap) {
    guides.push({
      axis: 'y',
      position: Math.round(ySnap.guide),
      start: Math.round(targetZone.rect.left),
      end: Math.round(targetZone.rect.right),
      label: ySnap.label,
    });
  }

  return { x, y, rect, guides, snapped: Boolean(xSnap || ySnap) };
};

export const detectOverlaps = (elementRect, existingElements = [], options = {}) => {
  const elementArea = Math.max(1, area(elementRect));
  const ignoreIds = new Set([options.ignoreId, ...(options.ignoreIds || [])].filter(Boolean));
  return existingElements
    .filter((item) => !ignoreIds.has(item.id) && rectsIntersect(elementRect, normalizeRect(item.rect)))
    .map((item) => {
      const rect = normalizeRect(item.rect);
      const ratio = intersectionArea(elementRect, rect) / elementArea;
      return { ...item, rect, ratio, locked: Boolean(item.locked), fixed: Boolean(item.fixed) };
    });
};

export const getResponsiveWarnings = (element, section, activeDevice = 'desktop') => {
  const warnings = [];
  if (SECTION_LEVEL_TYPES.has(element.type) && (section.type === 'page' || section.kind === 'canvas')) {
    return warnings;
  }
  const inner = normalizeRect(section.innerRect || section.rect);
  if (element.width > 340 && activeDevice !== 'mobile') {
    warnings.push('This element may not fit well on mobile.');
  }
  if (element.width > inner.width * 0.92) {
    warnings.push('Auto-resize is recommended for smaller screens.');
  }
  if (activeDevice === 'mobile' && element.width > inner.width) {
    warnings.push('Not enough mobile width.');
  }
  return [...new Set(warnings)];
};

export const isElementFitInSection = (element, section) => {
  const inner = normalizeRect(section.innerRect || section.rect);
  if (section.locked) {
    return { fits: false, reason: 'Locked section' };
  }
  if (!isTypeAccepted(element, section)) {
    return { fits: false, reason: 'Element type not allowed' };
  }
  if (SECTION_LEVEL_TYPES.has(element.type) && (section.type === 'page' || section.kind === 'canvas')) {
    return { fits: true, reason: 'Drop on page canvas' };
  }
  if (element.width > inner.width || element.height > inner.height) {
    return { fits: false, reason: 'Too small' };
  }
  return { fits: true, reason: 'Drop here' };
};

export const distanceToRect = (point, rectInput) => {
  const rect = normalizeRect(rectInput);
  const dx = point.x < rect.left ? rect.left - point.x : point.x > rect.right ? point.x - rect.right : 0;
  const dy = point.y < rect.top ? rect.top - point.y : point.y > rect.bottom ? point.y - rect.bottom : 0;
  return Math.sqrt(dx * dx + dy * dy);
};

const getCandidateRectForZone = (element, zone) => {
  const zoneInner = normalizeRect(zone.innerRect || zone.rect);
  const dragOffset = element.dragOffset || { x: element.width / 2, y: element.height / 2 };
  const pointer = element.pointer || {
    x: (element.originalRect?.left ?? zoneInner.left) + dragOffset.x,
    y: (element.originalRect?.top ?? zoneInner.top) + dragOffset.y,
  };
  return normalizeRect({
    left: clamp(pointer.x - dragOffset.x, zoneInner.left, Math.max(zoneInner.left, zoneInner.right - element.width)),
    top: clamp(pointer.y - dragOffset.y, zoneInner.top, Math.max(zoneInner.top, zoneInner.bottom - element.height)),
    width: element.width,
    height: element.height,
  });
};

export const calculateDropZones = (draggedElement, sections = [], existingElements = [], options = {}) => {
  const element = {
    ...draggedElement,
    width: Math.max(1, draggedElement.width || getDefaultElementSize(draggedElement.type).width),
    height: Math.max(1, draggedElement.height || getDefaultElementSize(draggedElement.type).height),
  };
  const pointer = element.pointer || { x: 0, y: 0 };
  const canvasRect = options.canvasRect ? normalizeRect(options.canvasRect) : null;
  const outsideCanvas = canvasRect && !rectContainsPoint(canvasRect, pointer);

  return sections.map((section) => {
    const zone = {
      ...section,
      rect: normalizeRect(section.rect),
      innerRect: normalizeRect(section.innerRect || section.rect),
    };
    const sectionLevelOnPage = SECTION_LEVEL_TYPES.has(element.type) && (zone.type === 'page' || zone.kind === 'canvas');
    const isSelf = zone.id === element.id;
    const isDescendant = zone.ancestorIds?.includes(element.id);
    const fit = isElementFitInSection(element, zone);
    const candidateRect = getCandidateRectForZone(element, zone);
    const zoneElements = sectionLevelOnPage
      ? []
      : existingElements.filter((item) => item.parentId === zone.id && item.id !== element.id);
    const overlaps = sectionLevelOnPage ? [] : detectOverlaps(candidateRect, zoneElements, {
      ignoreId: element.id,
      ignoreIds: element.groupIds,
    });
    const lockedOverlap = overlaps.find((item) => item.locked || item.fixed);
    const normalOverlap = overlaps.find((item) => !item.locked && !item.fixed);
    const pointerInside = rectContainsPoint(zone.innerRect, pointer);

    let valid = fit.fits && !outsideCanvas && !isSelf && !isDescendant && !lockedOverlap;
    let reason = fit.reason;
    let status = valid && normalOverlap ? 'warning' : (valid ? 'valid' : 'invalid');
    if (outsideCanvas) reason = 'Outside page';
    else if (isSelf || isDescendant) reason = 'Cannot place inside itself';
    else if (lockedOverlap) reason = lockedOverlap.fixed ? 'Overlaps fixed element' : 'Overlaps locked element';
    else if (normalOverlap && valid) reason = 'Overlaps another element';

    if (SECTION_LEVEL_TYPES.has(element.type) && zone.type !== 'page' && zone.kind !== 'canvas') {
      valid = false;
      reason = 'Sections can only be added to the page canvas';
      status = 'invalid';
    }

    if (!valid) status = 'invalid';

    const warnings = valid ? [
      ...getResponsiveWarnings(element, zone, options.activeDevice),
      ...(normalOverlap ? ['Overlaps another element'] : []),
    ] : [];

    return {
      ...zone,
      valid,
      isValid: valid,
      invalid: !valid,
      status,
      reason,
      label: valid ? labelForValidDrop(element, zone, warnings, status) : reason,
      pointerInside,
      sectionId: zone.id,
      x: zone.rect.left,
      y: zone.rect.top,
      candidateRect,
      ghostRect: candidateRect,
      guides: [],
      warnings,
      overlaps,
      zIndex: nextZIndex(zoneElements),
    };
  });
};

export const getActiveDropZone = (mousePoint, dropZones = []) => {
  if (!mousePoint) return null;

  const zonesUnderPointer = dropZones
    .filter((zone) => zone.isValid && rectContainsPoint(zone.innerRect, mousePoint))
    .sort((a, b) => {
      const areaA = area(normalizeRect(a.innerRect));
      const areaB = area(normalizeRect(b.innerRect));
      if (areaA !== areaB) return areaA - areaB;
      return Number(b.depth || 0) - Number(a.depth || 0);
    });

  if (zonesUnderPointer.length > 0) {
    return zonesUnderPointer[0];
  }

  const nearbyZones = dropZones
    .filter((zone) => zone.isValid)
    .map((zone) => ({
      ...zone,
      distance: distanceToRect(mousePoint, zone.innerRect),
    }))
    .filter((zone) => zone.distance < ACTIVE_ZONE_FALLBACK_DISTANCE)
    .sort((a, b) => a.distance - b.distance);

  return nearbyZones[0] || null;
};

export const getBestDropZone = (element, zones = []) => getActiveDropZone(element?.pointer, zones);

const getInvalidPointerZone = (mousePoint, zones = []) => zones
  .filter((zone) => !zone.isValid && rectContainsPoint(zone.innerRect || zone.rect, mousePoint))
  .sort((a, b) => {
    const areaA = area(normalizeRect(a.innerRect || a.rect));
    const areaB = area(normalizeRect(b.innerRect || b.rect));
    if (areaA !== areaB) return areaA - areaB;
    return Number(b.depth || 0) - Number(a.depth || 0);
  })[0] || null;

const localPlacementFor = (previewRect, zone) => {
  const zoneRect = normalizeRect(zone.rect);
  return {
    x: Math.round(previewRect.left - zoneRect.left),
    y: Math.round(previewRect.top - zoneRect.top),
    width: Math.round(previewRect.width),
    height: Math.round(previewRect.height),
    zIndex: zone.zIndex || 1,
    parentSectionId: zone.sectionId || zone.id,
  };
};

export const calculatePlacement = (element, sections, existingElements, options = {}) => {
  const zones = calculateDropZones(element, sections, existingElements, options);
  const mousePoint = element.pointer || { x: 0, y: 0 };
  const activeDropZone = getActiveDropZone(mousePoint, zones);
  const invalidPointerZone = activeDropZone ? null : getInvalidPointerZone(mousePoint, zones);
  const activeZone = activeDropZone || invalidPointerZone || null;
  const snap = activeDropZone ? calculateSnapPosition(element, activeDropZone, existingElements) : null;
  const previewRect = snap?.rect || null;
  const localPlacement = activeDropZone && previewRect ? localPlacementFor(previewRect, activeDropZone) : null;
  const warning = activeDropZone?.warnings?.[0] || null;
  const outsideCanvas = options.canvasRect && !rectContainsPoint(normalizeRect(options.canvasRect), mousePoint);

  if (DEBUG_DROP_ENGINE && typeof window !== 'undefined') {
    window.console.debug('[drop-engine]', {
      mouseCanvasPoint: mousePoint,
      activeDropZoneId: activeDropZone?.id || null,
      previewRect,
      currentPageId: options.currentPageId,
      warning,
    });
  }

  return {
    zones,
    bestZone: activeDropZone,
    activeDropZone,
    activeZone,
    activeDropZoneId: activeDropZone?.id || null,
    previewRect,
    ghostRect: previewRect,
    guides: snap?.guides || [],
    snapGuides: snap?.guides || [],
    warnings: activeDropZone?.warnings || [],
    warning,
    localPlacement,
    message: activeDropZone?.label || invalidPointerZone?.label || (outsideCanvas ? 'Outside page' : 'Cannot place here'),
  };
};

const nextZIndex = (elements) => {
  const max = elements.reduce((current, item) => {
    const raw = item.zIndex ?? item.layout?.zIndex ?? item.styles?.zIndex;
    const value = Number.parseInt(raw, 10);
    return Number.isFinite(value) ? Math.max(current, value) : current;
  }, 0);
  return max + 1;
};

const labelForValidDrop = (element, zone, warnings = [], status = 'valid') => {
  if (status === 'warning') return warnings[0] || 'Release to place';
  if (zone.type === 'page' || zone.kind === 'canvas') return 'Drop on page canvas';
  if (zone.type === 'grid') return 'Fits in Card Grid';
  if (zone.name) return element.dragType === 'move-node' ? `Move to ${zone.name}` : `Drop in ${zone.name}`;
  if (zone.type === 'section') return 'Fits in Section';
  return 'Release to place';
};
