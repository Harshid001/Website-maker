import { validateInteractions } from './interactionResolver';

export const validateRoutes = (project) => validateInteractions(project);

export const buildRouteRows = (project) => {
  const pages = project?.pages || [];
  const pageName = (id) => pages.find((page) => page.id === id)?.name || 'Missing page';

  return (project?.interactions || []).map((interaction) => ({
    id: interaction.id,
    sourcePage: pageName(interaction.sourcePageId),
    sourceNode: interaction.sourceNodeId,
    trigger: interaction.trigger,
    action: interaction.action,
    targetPage: pageName(interaction.targetPageId),
    path:
      interaction.targetType === 'external'
        ? interaction.targetUrl
        : interaction.targetType === 'section'
          ? `#${interaction.targetSectionId || ''}`
          : `/${pages.find((page) => page.id === interaction.targetPageId)?.slug || ''}`,
  }));
};
