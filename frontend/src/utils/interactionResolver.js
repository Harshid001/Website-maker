import { createId } from './ids';

const actionForTarget = (targetType) => {
  if (targetType === 'page') return 'navigate';
  if (targetType === 'section' || targetType === 'node') return 'scrollToSection';
  if (targetType === 'external') return 'openExternalUrl';
  if (targetType === 'email') return 'openEmail';
  if (targetType === 'phone') return 'openPhone';
  if (targetType === 'whatsapp') return 'openWhatsApp';
  if (targetType === 'file') return 'downloadFile';
  if (targetType === 'payment') return 'checkout';
  if (targetType === 'modal') return 'openModal';
  return 'customAction';
};

export const findPageById = (project, pageId) =>
  (project?.pages || []).find((page) => page.id === pageId) || null;

export const findPageBySlug = (project, slug) =>
  (project?.pages || []).find((page) => page.slug === slug) || null;

export const findSectionById = (project, sectionId) => {
  for (const page of project?.pages || []) {
    const section = (page.sections || []).find((item) => item.id === sectionId);
    if (section) return { page, section };
  }
  return null;
};

export const findNodeById = (project, nodeId) => {
  for (const page of project?.pages || []) {
    for (const section of page.sections || []) {
      if (section.id === nodeId) return { page, section, node: section, kind: 'section' };
      const element = (section.elements || []).find((item) => item.id === nodeId);
      if (element) return { page, section, node: element, kind: 'element' };
    }
  }
  return null;
};

export const getNodeInteractions = (nodeId, project) =>
  (project?.interactions || []).filter((interaction) => interaction.sourceNodeId === nodeId);

export const createInteraction = (sourceNodeId, sourcePageId, targetData = {}) => {
  const now = new Date().toISOString();
  const targetType = targetData.targetType || 'page';
  return {
    id: createId('interaction'),
    name: targetData.name || 'Prototype connection',
    sourcePageId,
    sourceNodeId,
    trigger: targetData.trigger || 'click',
    action: targetData.action || actionForTarget(targetType),
    targetType,
    targetPageId: targetData.targetPageId || null,
    targetSectionId: targetData.targetSectionId || null,
    targetNodeId: targetData.targetNodeId || null,
    targetUrl: targetData.targetUrl || '',
    transition: targetData.transition || 'smartAnimate',
    duration: Number(targetData.duration ?? 300),
    easing: targetData.easing || 'easeInOut',
    delay: Number(targetData.delay ?? 0),
    scrollBehavior: targetData.scrollBehavior || 'smooth',
    overflowBehavior: targetData.overflowBehavior || 'vertical',
    positionBehavior: targetData.positionBehavior || 'scroll',
    preserveScroll: Boolean(targetData.preserveScroll),
    openInNewTab: Boolean(targetData.openInNewTab),
    createdAt: now,
    updatedAt: now,
  };
};

export const resolveInteraction = (interaction, project) => {
  const source = findNodeById(project, interaction?.sourceNodeId);
  const targetPage = interaction?.targetPageId ? findPageById(project, interaction.targetPageId) : null;
  const targetSection = interaction?.targetSectionId ? findSectionById(project, interaction.targetSectionId) : null;
  const targetNode = interaction?.targetNodeId ? findNodeById(project, interaction.targetNodeId) : null;

  return {
    source,
    targetPage,
    targetSection,
    targetNode,
    sourceLabel: source?.node?.name || source?.node?.type || 'Missing source',
    targetLabel:
      targetPage?.name ||
      targetSection?.section?.name ||
      targetNode?.node?.name ||
      interaction?.targetUrl ||
      'Choose target',
    valid:
      Boolean(source) &&
      (interaction?.targetType === 'external'
        ? Boolean(interaction.targetUrl)
        : interaction?.targetType === 'page'
          ? Boolean(targetPage)
          : interaction?.targetType === 'section'
            ? Boolean(targetSection)
            : interaction?.targetType === 'node'
              ? Boolean(targetNode)
              : true),
  };
};

const previewPath = (project, page) => `/preview/${project.id}/${page.slug}`;
const publishedPath = (project, page) => `/site/${project.slug}/${page.slug}`;

const openUrl = (url, newTab = true) => {
  if (!url) return false;
  if (newTab) window.open(url, '_blank', 'noopener,noreferrer');
  else window.location.href = url;
  return true;
};

export const runInteraction = (interaction, project, mode = 'preview', navigate, options = {}) => {
  if (!interaction || !project) return false;
  const resolved = resolveInteraction(interaction, project);
  const currentPageId = options.currentPageId || project.currentPageId;
  const targetPage = resolved.targetPage || findPageById(project, interaction.targetPageId);
  const targetSectionId = interaction.targetSectionId || resolved.targetNode?.section?.id;

  const navigateToPage = (page, hash = '') => {
    if (!page) return false;
    if (mode === 'editor') {
      options.switchPage?.(page.id);
      if (hash) window.setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: interaction.scrollBehavior || 'smooth' }), 80);
      return true;
    }
    const path = mode === 'published' ? publishedPath(project, page) : previewPath(project, page);
    navigate?.(`${path}${hash ? `#${hash}` : ''}`);
    if (hash) window.setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: interaction.scrollBehavior || 'smooth' }), 120);
    return true;
  };

  if (interaction.action === 'navigate') return navigateToPage(targetPage);

  if (interaction.action === 'scrollToSection') {
    const sectionInfo = targetSectionId ? findSectionById(project, targetSectionId) : null;
    const page = targetPage || sectionInfo?.page || findPageById(project, currentPageId);
    if (!page) return false;
    if (page.id !== currentPageId) return navigateToPage(page, targetSectionId);
    document.getElementById(targetSectionId)?.scrollIntoView({ behavior: interaction.scrollBehavior || 'smooth' });
    return true;
  }

  if (interaction.action === 'openExternalUrl') {
    const url = /^https?:\/\//i.test(interaction.targetUrl || '') ? interaction.targetUrl : `https://${interaction.targetUrl}`;
    return openUrl(url, interaction.openInNewTab !== false);
  }

  if (interaction.action === 'openEmail') return openUrl(`mailto:${interaction.targetUrl || ''}`, false);
  if (interaction.action === 'openPhone') return openUrl(`tel:${interaction.targetUrl || ''}`, false);
  if (interaction.action === 'openWhatsApp') return openUrl(`https://wa.me/${String(interaction.targetUrl || '').replace(/\D/g, '')}`, true);

  options.showToast?.(`${interaction.action} is wired as a prototype placeholder.`);
  return true;
};

export const validateInteractions = (project) => {
  const warnings = [];
  const homePages = (project?.pages || []).filter((page) => page.isHome);
  if (!homePages.length) warnings.push({ id: 'missing-homepage', message: 'No homepage is set.', severity: 'warning', fix: 'setHome' });

  const slugMap = new Map();
  (project?.pages || []).forEach((page) => {
    if (slugMap.has(page.slug)) warnings.push({ id: `duplicate-${page.id}`, message: `Two pages use /${page.slug}.`, severity: 'warning', fix: 'slug' });
    slugMap.set(page.slug, page.id);
  });

  (project?.interactions || []).forEach((interaction) => {
    const resolved = resolveInteraction(interaction, project);
    if (!resolved.source) {
      warnings.push({ id: `missing-source-${interaction.id}`, interactionId: interaction.id, message: `Connection "${interaction.name}" starts from a deleted node.`, severity: 'error', fix: 'remove' });
    }
    if (interaction.targetType === 'page' && !resolved.targetPage) {
      warnings.push({ id: `missing-page-${interaction.id}`, interactionId: interaction.id, message: `Connection "${interaction.name}" links to a deleted page.`, severity: 'error', fix: 'reconnect' });
    }
    if (interaction.targetType === 'section' && !resolved.targetSection) {
      warnings.push({ id: `missing-section-${interaction.id}`, interactionId: interaction.id, message: `Connection "${interaction.name}" links to a deleted section.`, severity: 'error', fix: 'reconnect' });
    }
    if (interaction.targetType === 'external' && interaction.targetUrl && !/^https?:\/\/|^[\w.-]+\.[a-z]{2,}/i.test(interaction.targetUrl)) {
      warnings.push({ id: `bad-url-${interaction.id}`, interactionId: interaction.id, message: `Connection "${interaction.name}" has an invalid external URL.`, severity: 'warning', fix: 'edit' });
    }
  });

  return warnings;
};
