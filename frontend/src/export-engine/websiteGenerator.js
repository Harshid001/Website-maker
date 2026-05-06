import { generateCSS } from './cssGenerator.js';
import { generateJS } from './jsGenerator.js';
import { generateSectionHTML } from './sectionGenerators.js';

const SUPPORTED_SECTION_TYPES = new Set([
  'navbar',
  'hero',
  'features',
  'services',
  'pricing',
  'testimonials',
  'faq',
  'contact',
  'footer',
]);

const SECTION_HINTS = [
  'navbar',
  'hero',
  'features',
  'services',
  'pricing',
  'testimonials',
  'faq',
  'contact',
  'footer',
];

export function escapeHTML(value = '') {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function stripHTML(value = '') {
  return String(value ?? '').replace(/<[^>]*>/g, '');
}

export function escapeText(value = '') {
  return escapeHTML(value);
}

export function escapeAttribute(value = '') {
  return escapeHTML(stripHTML(value)).replaceAll('`', '&#096;');
}

export function sanitizeHref(value = '#') {
  const href = String(value || '#').trim();
  if (!href) return '#';
  if (/^(https?:|mailto:|tel:|#|\/)/i.test(href)) return escapeAttribute(href);
  return '#';
}

export function safeClassName(prefix = 'export', value = '') {
  const safe = String(value || 'item').replace(/[^a-zA-Z0-9_-]/g, '-');
  return `${prefix}-${safe}`;
}

const normalizeTheme = (theme = {}) => {
  const colors = theme.colors || {};
  const fonts = theme.fonts || {};

  return {
    primaryColor: theme.primaryColor || colors.primary || '#667EEA',
    backgroundColor: theme.backgroundColor || colors.background || '#ffffff',
    textColor: theme.textColor || colors.text || '#111827',
    fontFamily: theme.fontFamily || fonts.body || fonts.heading || 'Inter, Arial, sans-serif',
  };
};

const normalizeSlug = (page = {}, index = 0) => {
  if (page.slug === '/' || page.path === '/' || page.isHome || index === 0) return '/';
  const raw = page.path || page.slug || page.name || `page-${index + 1}`;
  const slug = String(raw).replace(/^\/+/, '').replace(/[^a-zA-Z0-9/-]/g, '-').toLowerCase();
  return `/${slug || `page-${index + 1}`}`;
};

const normalizeElement = (element = {}) => ({
  id: element.id || safeClassName('element', element.name || element.type),
  type: element.type || 'container',
  name: element.name || element.type || 'Element',
  content: element.content ?? '',
  props: element.props || {},
  styles: element.styles || {},
  responsive: element.responsive || {},
  animation: element.animation || {},
  hidden: Boolean(element.hidden),
});

const serializeNodeTree = (node, nodesMap = {}) => {
  if (!node || node.hidden) return null;

  return {
    id: node.id,
    type: node.type || 'container',
    name: node.name || node.type || 'Element',
    content: node.content ?? '',
    props: node.props || {},
    styles: node.styles || {},
    layout: node.layout || {},
    responsive: node.responsive || {},
    animation: node.animation || {},
    hidden: Boolean(node.hidden),
    children: (node.children || [])
      .map((childId) => serializeNodeTree(nodesMap[childId], nodesMap))
      .filter(Boolean),
  };
};

const flattenNodeText = (node) => {
  if (!node) return '';
  return [
    node.type,
    node.name,
    node.id,
    node.content,
    ...(node.children || []).map(flattenNodeText),
  ].join(' ');
};

const inferNodeSectionType = (node) => {
  if (!node) return 'features';
  if (node.type === 'navbar') return 'navbar';
  if (node.type === 'footer') return 'footer';

  const haystack = flattenNodeText(node).toLowerCase();
  const hinted = SECTION_HINTS.find((type) => haystack.includes(type.replace(/s$/, '')));
  if (hinted) return hinted;

  const childTypes = new Set((node.children || []).map((child) => child?.type));
  if (childTypes.has('pricingCard')) return 'pricing';
  if (childTypes.has('testimonialCard')) return 'testimonials';
  if (childTypes.has('contactForm') || childTypes.has('bookingForm') || childTypes.has('form')) return 'contact';
  if (childTypes.has('card') || childTypes.has('serviceCard')) return 'features';

  return node.type === 'section' ? 'features' : node.type;
};

const normalizeLegacySection = (section = {}, index = 0) => {
  const type = section.type === 'about' ? 'features' : section.type || 'features';
  return {
    id: section.id || safeClassName('section', `${type}-${index + 1}`),
    type,
    props: {
      ...(section.props || {}),
      name: section.name || type,
      styles: section.styles || {},
      elements: (section.elements || []).map(normalizeElement),
    },
  };
};

const normalizeNodeSection = (node, index = 0) => {
  const sectionType = inferNodeSectionType(node);
  return {
    id: node.id || safeClassName('section', `${sectionType}-${index + 1}`),
    type: SUPPORTED_SECTION_TYPES.has(sectionType) ? sectionType : 'features',
    props: {
      source: 'node',
      name: node.name || sectionType,
      node,
    },
  };
};

const rootsForPage = (page, nodesMap = {}) => {
  const pageNode = nodesMap[page?.id];
  const childIds = pageNode?.children?.length
    ? pageNode.children
    : Object.values(nodesMap)
      .filter((node) => node?.parentId === page?.id)
      .map((node) => node.id);

  return childIds
    .map((id) => nodesMap[id])
    .filter((node) => node && node.type !== 'page' && !node.hidden);
};

const normalizePages = (project = {}, nodesMap = {}) => {
  const rawPages = project.pages?.length
    ? project.pages
    : [{
      id: project.currentPageId || 'home',
      name: 'Home',
      slug: '/',
      isHome: true,
      sections: project.sections || [],
    }];

  return rawPages.map((page, index) => {
    const nodeSections = rootsForPage(page, nodesMap)
      .map((node) => serializeNodeTree(node, nodesMap))
      .filter(Boolean);
    const sections = nodeSections.length
      ? nodeSections.map(normalizeNodeSection)
      : (page.sections || []).map(normalizeLegacySection);

    return {
      id: page.id || `page-${index + 1}`,
      name: page.name || (index === 0 ? 'Home' : `Page ${index + 1}`),
      slug: normalizeSlug(page, index),
      sections,
    };
  });
};

const exportMeta = (siteData) => ({
  siteName: siteData.siteName,
  pageTitle: siteData.pageTitle,
  theme: siteData.theme,
  pages: siteData.pages,
  generatedAt: new Date().toISOString(),
  exportVersion: 1,
});

export function normalizeBuilderState(builderState = {}) {
  const project = builderState.project
    ? { ...builderState.project, nodesMap: builderState.nodesMap || builderState.project.nodesMap }
    : builderState;
  const nodesMap = builderState.nodesMap || project.nodesMap || project.nodes || {};
  const siteName = project.siteName || project.name || project.businessDetails?.websiteName || 'My Website';
  const pageTitle = project.pageTitle || project.seo?.metaTitle || `${siteName} | Official Website`;

  return {
    siteName,
    pageTitle,
    description: project.seo?.metaDescription || project.description || '',
    theme: normalizeTheme(project.theme || builderState.theme || {}),
    pages: normalizePages(project, nodesMap),
  };
}

export function generateWebsiteFiles(builderState = {}) {
  const siteData = normalizeBuilderState(builderState);
  const page = siteData.pages.find((item) => item.slug === '/') || siteData.pages[0] || {
    id: 'home',
    name: 'Home',
    slug: '/',
    sections: [],
  };

  const sectionsHTML = page.sections
    .map((section) => generateSectionHTML(section, siteData.theme))
    .filter(Boolean)
    .join('\n');
  const css = generateCSS(siteData.theme, siteData);
  const js = generateJS();
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHTML(siteData.pageTitle || page.name || 'My Website')}</title>
  ${siteData.description ? `<meta name="description" content="${escapeAttribute(siteData.description)}" />` : ''}
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
${sectionsHTML || '  <main class="empty-site"><p>No sections were added yet.</p></main>'}
  <script src="./script.js"></script>
</body>
</html>`;

  return {
    'index.html': html,
    'style.css': css,
    'script.js': js,
    'meta.json': JSON.stringify(exportMeta(siteData), null, 2),
  };
}

export default {
  normalizeBuilderState,
  generateWebsiteFiles,
  escapeHTML,
  escapeText,
  escapeAttribute,
  sanitizeHref,
  safeClassName,
};
