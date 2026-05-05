import { CONTAINER_NODE_TYPES, LAYOUT_MODES, NODE_TAG_MAP, NODE_TYPES, TEXT_NODE_TYPES } from '../data/nodeSchema';

const SELF_CLOSING_TAGS = new Set(['img', 'hr', 'input', 'br', 'meta', 'link']);
const STYLE_KEYS_TO_SKIP = new Set(['--hover-transform']);

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const stripHtml = (value = '') => String(value).replace(/<[^>]*>/g, '');

const kebab = (value = '') =>
  String(value)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();

const safeClass = (node) => `node-${String(node.id || node.type || 'item').replace(/[^a-zA-Z0-9_-]/g, '-')}`;

const indent = (level) => '  '.repeat(level);

const resolveNodesMap = (project = {}) => project.nodesMap || project.nodes || {};

const isHiddenEverywhere = (node) =>
  node?.hidden ||
  (node?.responsive?.hideOnDesktop && node?.responsive?.hideOnTablet && node?.responsive?.hideOnMobile);

const rootIdsForPage = (page, nodesMap) => {
  const pageNode = nodesMap[page?.id];
  if (pageNode?.children?.length) return pageNode.children.filter((id) => nodesMap[id] && !isHiddenEverywhere(nodesMap[id]));
  return Object.values(nodesMap)
    .filter((node) => node.parentId === page?.id && !isHiddenEverywhere(node))
    .map((node) => node.id);
};

const semanticTagForNode = (node, context = {}) => {
  if (!node) return 'div';
  if (node.type === NODE_TYPES.HEADING) {
    const depth = Math.min(6, Math.max(1, context.headingLevel || 2));
    return `h${depth}`;
  }
  return NODE_TAG_MAP[node.type] || 'div';
};

const styleObjectForNode = (node) => {
  const styles = { ...(node.styles || {}) };
  const layout = node.layout || {};

  if (layout.positionMode === LAYOUT_MODES.FREE) {
    styles.position = node.type === NODE_TYPES.SECTION ? 'relative' : 'absolute';
    if (node.type !== NODE_TYPES.SECTION) {
      styles.left = `${layout.x || 0}px`;
      styles.top = `${layout.y || 0}px`;
    }
  }

  if (layout.width && layout.width !== 'auto') styles.width = layout.width;
  if (layout.height && layout.height !== 'auto') styles.height = layout.height;
  if (layout.rotation) styles.transform = `rotate(${layout.rotation}deg)`;
  if (layout.zIndex && layout.zIndex !== 'auto') styles.zIndex = layout.zIndex;

  if (CONTAINER_NODE_TYPES.has(node.type)) {
    if (layout.positionMode === LAYOUT_MODES.FLEX_ROW || layout.positionMode === LAYOUT_MODES.FLEX_COLUMN) {
      styles.display = 'flex';
      styles.flexDirection = layout.positionMode === LAYOUT_MODES.FLEX_ROW ? 'row' : 'column';
      if (layout.gap) styles.gap = layout.gap;
      if (layout.alignItems) styles.alignItems = layout.alignItems;
      if (layout.justifyContent) styles.justifyContent = layout.justifyContent;
    }

    if (layout.positionMode === LAYOUT_MODES.GRID) {
      styles.display = 'grid';
      styles.gridTemplateColumns = layout.gridTemplateColumns || 'repeat(3, minmax(0, 1fr))';
      if (layout.gap) styles.gap = layout.gap;
    }
  }

  return styles;
};

const cssFromObject = (styles = {}) =>
  Object.entries(styles)
    .filter(([key, value]) => value !== undefined && value !== null && value !== '' && !STYLE_KEYS_TO_SKIP.has(key))
    .map(([key, value]) => `  ${key.startsWith('--') ? key : kebab(key)}: ${value};`)
    .join('\n');

const attributesForNode = (node, className) => {
  const attrs = [`class="${className}"`];
  const props = node.props || {};

  if (node.htmlId) attrs.push(`id="${escapeHtml(node.htmlId)}"`);
  if (node.ariaLabel) attrs.push(`aria-label="${escapeHtml(node.ariaLabel)}"`);

  if (node.type === NODE_TYPES.IMAGE) {
    attrs.push(`src="${escapeHtml(props.src || '')}"`);
    attrs.push(`alt="${escapeHtml(props.alt || node.name || 'Image')}"`);
    if (props.loading !== 'eager') attrs.push('loading="lazy"');
  }

  if (node.type === NODE_TYPES.VIDEO && props.src) {
    attrs.push(`src="${escapeHtml(props.src)}"`);
    if (props.poster) attrs.push(`poster="${escapeHtml(props.poster)}"`);
    attrs.push('controls');
  }

  if ([NODE_TYPES.BUTTON, NODE_TYPES.NAV_LINK, NODE_TYPES.FOOTER_LINK, NODE_TYPES.WHATSAPP_BUTTON].includes(node.type)) {
    attrs.push(`href="${escapeHtml(props.href || props.scrollTo || '#')}"`);
    if (props.target === '_blank') attrs.push('target="_blank" rel="noopener noreferrer"');
  }

  if (node.className) attrs.push(`data-export-class="${escapeHtml(node.className)}"`);

  return attrs.join(' ');
};

export const generateNodeCode = (node, nodesMap, project = {}, context = {}) => {
  if (!node || isHiddenEverywhere(node)) return '';

  const tag = semanticTagForNode(node, context);
  const className = safeClass(node);
  const attrs = attributesForNode(node, className);
  const childIds = (node.children || []).filter((id) => nodesMap[id] && !isHiddenEverywhere(nodesMap[id]));

  if (SELF_CLOSING_TAGS.has(tag)) {
    return `${indent(context.depth || 0)}<${tag} ${attrs}>`;
  }

  if ([NODE_TYPES.FORM, NODE_TYPES.CONTACT_FORM, NODE_TYPES.BOOKING_FORM].includes(node.type)) {
    const fields = node.props?.fields || ['Name', 'Email', 'Message'];
    const fieldMarkup = fields.map((field) => {
      const fieldId = `${safeClass(node)}-${kebab(field)}`;
      const isMessage = /message|details|note/i.test(field);
      return [
        `${indent((context.depth || 0) + 1)}<label for="${fieldId}">${escapeHtml(field)}</label>`,
        `${indent((context.depth || 0) + 1)}${isMessage ? `<textarea id="${fieldId}" name="${kebab(field)}"></textarea>` : `<input id="${fieldId}" name="${kebab(field)}" type="text">`}`,
      ].join('\n');
    }).join('\n');
    return [
      `${indent(context.depth || 0)}<${tag} ${attrs}>`,
      fieldMarkup,
      `${indent((context.depth || 0) + 1)}<button type="submit">${escapeHtml(node.props?.buttonText || 'Submit')}</button>`,
      `${indent(context.depth || 0)}</${tag}>`,
    ].join('\n');
  }

  if ([NODE_TYPES.GALLERY, NODE_TYPES.SLIDER].includes(node.type)) {
    const images = node.props?.images || [];
    const imageMarkup = images.map((src, index) =>
      `${indent((context.depth || 0) + 1)}<img src="${escapeHtml(src)}" alt="${escapeHtml(`${node.name || 'Gallery'} ${index + 1}`)}" loading="lazy">`,
    ).join('\n');
    return [
      `${indent(context.depth || 0)}<${tag} ${attrs}>`,
      imageMarkup || `${indent((context.depth || 0) + 1)}${escapeHtml(node.content || 'Gallery')}`,
      `${indent(context.depth || 0)}</${tag}>`,
    ].join('\n');
  }

  const nextHeadingLevel = node.type === NODE_TYPES.SECTION ? Math.min(6, (context.headingLevel || 1) + 1) : context.headingLevel;
  const children = childIds
    .map((id) => generateNodeCode(nodesMap[id], nodesMap, project, {
      depth: (context.depth || 0) + 1,
      headingLevel: nextHeadingLevel,
    }))
    .filter(Boolean)
    .join('\n');

  const content = TEXT_NODE_TYPES.has(node.type) ? stripHtml(node.content || '') : node.content;
  const inner = children || (content ? `${indent((context.depth || 0) + 1)}${escapeHtml(content)}` : '');

  if (!inner) return `${indent(context.depth || 0)}<${tag} ${attrs}></${tag}>`;

  return [
    `${indent(context.depth || 0)}<${tag} ${attrs}>`,
    inner,
    `${indent(context.depth || 0)}</${tag}>`,
  ].join('\n');
};

export const generatePageCode = (page, project = {}) => {
  const nodesMap = resolveNodesMap(project);
  const roots = rootIdsForPage(page, nodesMap);
  const body = roots
    .map((id) => generateNodeCode(nodesMap[id], nodesMap, project, { depth: 2, headingLevel: 1 }))
    .filter(Boolean)
    .join('\n');

  return [
    `  <main class="page page-${escapeHtml(page?.slug || 'home')}">`,
    body || '    <section class="empty-page"></section>',
    '  </main>',
  ].join('\n');
};

export const generateSEOHead = (project = {}, page = {}) => {
  const seo = project.seo || {};
  const title = page.metaTitle || seo.metaTitle || `${project.name || 'Website'} | Official Website`;
  const description = page.metaDescription || seo.metaDescription || '';
  const keywords = Array.isArray(seo.keywords) ? seo.keywords.join(', ') : seo.keywords || '';

  return [
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}">`,
    keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}">` : '',
    `<meta property="og:title" content="${escapeHtml(seo.ogTitle || title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    seo.ogImage ? `<meta property="og:image" content="${escapeHtml(seo.ogImage)}">` : '',
  ].filter(Boolean).join('\n  ');
};

export const generateResponsiveCSS = (project = {}) => {
  const nodesMap = resolveNodesMap(project);
  const tabletRules = [];
  const mobileRules = [];

  for (const node of Object.values(nodesMap)) {
    if (!node || isHiddenEverywhere(node)) continue;
    const className = `.${safeClass(node)}`;
    const responsive = node.responsive || {};
    const tablet = { ...(responsive.tablet || {}) };
    const mobile = { ...(responsive.mobile || {}) };

    if (responsive.hideOnTablet) tablet.display = 'none';
    if (responsive.hideOnMobile) mobile.display = 'none';
    if (responsive.tabletPadding) tablet.padding = responsive.tabletPadding;
    if (responsive.mobilePadding) mobile.padding = responsive.mobilePadding;
    if (responsive.tabletFontSize) tablet.fontSize = responsive.tabletFontSize;
    if (responsive.mobileFontSize) mobile.fontSize = responsive.mobileFontSize;
    if (responsive.stackDirectionOnMobile) mobile.flexDirection = responsive.stackDirectionOnMobile;
    if (responsive.fullWidthOnMobile) mobile.width = '100%';

    const tabletCss = cssFromObject(tablet);
    const mobileCss = cssFromObject(mobile);
    if (tabletCss) tabletRules.push(`${className} {\n${tabletCss}\n}`);
    if (mobileCss) mobileRules.push(`${className} {\n${mobileCss}\n}`);
  }

  return [
    tabletRules.length ? `@media (max-width: 1024px) {\n${tabletRules.map((rule) => rule.replace(/^/gm, '  ')).join('\n')}\n}` : '',
    mobileRules.length ? `@media (max-width: 640px) {\n${mobileRules.map((rule) => rule.replace(/^/gm, '  ')).join('\n')}\n}` : '',
  ].filter(Boolean).join('\n\n');
};

export const generateCSS = (project = {}) => {
  const nodesMap = resolveNodesMap(project);
  const theme = project.theme || {};
  const colors = theme.colors || {};
  const fonts = theme.fonts || {};
  const rules = [];

  rules.push(`:root {
  --color-primary: ${colors.primary || '#6366f1'};
  --color-secondary: ${colors.secondary || '#8b5cf6'};
  --color-background: ${colors.background || '#ffffff'};
  --color-surface: ${colors.surface || '#f8fafc'};
  --color-text: ${colors.text || '#0f172a'};
  --color-muted: ${colors.muted || '#64748b'};
  --color-accent: ${colors.accent || colors.primary || '#6366f1'};
  --font-heading: ${fonts.heading || 'Inter, sans-serif'};
  --font-body: ${fonts.body || 'Inter, sans-serif'};
}`);

  rules.push(`* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-body);
}
a { color: inherit; text-decoration: none; }
img, video { max-width: 100%; display: block; }
button, input, textarea { font: inherit; }
:focus-visible { outline: 3px solid var(--color-primary); outline-offset: 3px; }`);

  for (const node of Object.values(nodesMap)) {
    if (!node || isHiddenEverywhere(node) || node.type === NODE_TYPES.PAGE) continue;
    const css = cssFromObject(styleObjectForNode(node));
    if (css) rules.push(`.${safeClass(node)} {\n${css}\n}`);
    if (node.styles?.['--hover-transform']) {
      rules.push(`.${safeClass(node)}:hover {\n  transform: ${node.styles['--hover-transform']};\n}`);
    }
    if (node.animation?.type && node.animation.type !== 'none') {
      rules.push(`.${safeClass(node)} {\n  animation: ${kebab(node.animation.type)} ${node.animation.duration || 700}ms ${node.animation.easing || 'ease-out'} ${node.animation.delay || 0}ms both;\n}`);
    }
  }

  rules.push(`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes slide-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes zoom-in { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: scale(1); } }`);

  const responsive = generateResponsiveCSS(project);
  if (responsive) rules.push(responsive);

  return rules.join('\n\n');
};

export const generateAssetsManifest = (project = {}) => {
  const nodesMap = resolveNodesMap(project);
  const nodeAssets = Object.values(nodesMap)
    .filter((node) => node?.type === NODE_TYPES.IMAGE && node.props?.src && !isHiddenEverywhere(node))
    .map((node) => ({
      id: node.id,
      name: node.name || 'Image',
      type: 'image',
      src: node.props.src,
      alt: node.props.alt || node.name || 'Image',
    }));

  return [...(project.assets || []), ...nodeAssets];
};

const optimizationReport = (project, html, css) => {
  const nodesMap = resolveNodesMap(project);
  const nodes = Object.values(nodesMap);
  const hiddenNodes = nodes.filter(isHiddenEverywhere).length;
  const imageWarnings = nodes
    .filter((node) => node?.type === NODE_TYPES.IMAGE && !node.props?.alt)
    .map((node) => `${node.name || node.id} needs alt text`);
  const headingCount = nodes.filter((node) => node?.type === NODE_TYPES.HEADING && !isHiddenEverywhere(node)).length;

  return {
    pages: project.pages?.length || 0,
    nodes: nodes.length,
    exportedNodes: nodes.length - hiddenNodes,
    removedHiddenNodes: hiddenNodes,
    htmlSize: html.length,
    cssSize: css.length,
    seoScore: project.seo?.score || 72,
    accessibilityWarnings: [
      ...imageWarnings,
      headingCount ? null : 'No heading nodes were found on the current site.',
    ].filter(Boolean),
    imageOptimizationSuggestions: generateAssetsManifest(project).map((asset) => `Review ${asset.name || asset.id} for compression and WebP conversion.`),
  };
};

export const exportHTML = (project = {}) => {
  const homePage = project.pages?.find((page) => page.isHome) || project.pages?.[0] || {};
  const css = generateCSS(project);
  const pageHtml = generatePageCode(homePage, project);

  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    `  ${generateSEOHead(project, homePage)}`,
    '  <style>',
    css.split('\n').map((line) => `    ${line}`).join('\n'),
    '  </style>',
    '</head>',
    '<body>',
    pageHtml,
    '</body>',
    '</html>',
  ].join('\n');
};

export const exportReact = (project = {}) => {
  const nodesMap = resolveNodesMap(project);
  const pages = project.pages?.length ? project.pages : [{ id: project.currentPageId, name: 'Home', slug: 'home', isHome: true }];

  const renderNode = (nodeId, depth = 3) => {
    const node = nodesMap[nodeId];
    if (!node || isHiddenEverywhere(node)) return '';
    const tag = semanticTagForNode(node, { headingLevel: 2 });
    const className = safeClass(node);
    const props = node.props || {};
    const attrParts = [`className="${className}"`];
    if (node.type === NODE_TYPES.IMAGE) {
      attrParts.push(`src="${props.src || ''}"`, `alt="${props.alt || node.name || 'Image'}"`, 'loading="lazy"');
    }
    if ([NODE_TYPES.BUTTON, NODE_TYPES.NAV_LINK, NODE_TYPES.FOOTER_LINK, NODE_TYPES.WHATSAPP_BUTTON].includes(node.type)) {
      attrParts.push(`href="${props.href || props.scrollTo || '#'}"`);
      if (props.target === '_blank') attrParts.push('target="_blank" rel="noopener noreferrer"');
    }

    if (SELF_CLOSING_TAGS.has(tag)) return `${indent(depth)}<${tag} ${attrParts.join(' ')} />`;
    const children = (node.children || []).map((id) => renderNode(id, depth + 1)).filter(Boolean).join('\n');
    const content = TEXT_NODE_TYPES.has(node.type) ? escapeHtml(stripHtml(node.content || '')) : '';
    const inner = children || content;
    if (!inner) return `${indent(depth)}<${tag} ${attrParts.join(' ')} />`;
    return `${indent(depth)}<${tag} ${attrParts.join(' ')}>\n${inner.includes('\n') ? inner : `${indent(depth + 1)}${inner}`}\n${indent(depth)}</${tag}>`;
  };

  const pageComponents = pages.map((page) => {
    const componentName = `${String(page.name || 'Page').replace(/[^a-zA-Z0-9]/g, '') || 'Page'}Page`;
    const roots = rootIdsForPage(page, nodesMap);
    return `function ${componentName}() {
  return (
    <main className="page page-${page.slug || 'home'}">
${roots.map((id) => renderNode(id, 3)).filter(Boolean).join('\n')}
    </main>
  );
}`;
  }).join('\n\n');

  return `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/globals.css';

${pageComponents}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
${pages.map((page) => `        <Route path="${page.isHome ? '/' : `/${page.slug || ''}`}" element={<${String(page.name || 'Page').replace(/[^a-zA-Z0-9]/g, '') || 'Page'}Page />} />`).join('\n')}
      </Routes>
    </BrowserRouter>
  );
}
`;
};

export const generateWebsiteCode = (project = {}) => {
  const css = generateCSS(project);
  const html = exportHTML(project);
  const react = exportReact(project);

  return {
    html,
    css,
    react,
    pages: (project.pages || []).map((page) => ({
      id: page.id,
      slug: page.slug,
      html: generatePageCode(page, project),
      seoHead: generateSEOHead(project, page),
    })),
    assets: generateAssetsManifest(project),
    report: optimizationReport(project, html, css),
    generatedAt: new Date().toISOString(),
  };
};

export default {
  generateWebsiteCode,
  generatePageCode,
  generateNodeCode,
  generateCSS,
  generateResponsiveCSS,
  generateSEOHead,
  generateAssetsManifest,
  exportHTML,
  exportReact,
};
