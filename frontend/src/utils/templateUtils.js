import { templateTypeLabels } from '../data/templates';

export const templateTabs = [
  { id: 'website', label: templateTypeLabels.website },
  { id: '2d', label: templateTypeLabels['2d'] },
  { id: 'animation', label: templateTypeLabels.animation },
  { id: '3d', label: templateTypeLabels['3d'] },
];

export const getWorkspaceRoute = (project) => {
  if (project.workspaceType === 'website-builder') {
    return `/builder/website/${project.id}`;
  }

  const routes = {
    website: `/builder/website/${project.id}`,
    '2d': `/workspace/design/${project.id}`,
    '3d': `/workspace/3d/${project.id}`,
    animation: `/workspace/animation/${project.id}`,
  };

  return routes[project.type] || `/workspace/${project.id}`;
};

export const getTypeLabel = (type) => templateTypeLabels[type] || type;

export const uniqueSorted = (values = []) =>
  [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));

export const getTemplateCategories = (templates, type) =>
  uniqueSorted(
    templates
      .filter((template) => template.type === type)
      .map((template) => (type === 'website' ? template.designType : template.category))
  );

export const getTemplateTags = (templates, type) =>
  uniqueSorted(
    templates
      .filter((template) => template.type === type)
      .flatMap((template) => (type === 'website' ? template.suitableFor || [] : template.tags || []))
  );

export const searchTemplate = (template, query) => {
  const term = query.trim().toLowerCase();
  if (!term) return true;

  return [
    template.title,
    template.category,
    template.designType,
    template.description,
    template.type,
    ...(template.suitableFor || []),
    ...(template.sections || []),
    ...(template.content?.sections || []),
    ...(template.tags || []),
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(term));
};

export const sortTemplates = (items, sortBy) => {
  const difficultyRank = { Beginner: 0, Intermediate: 1, Advanced: 2 };
  const sorted = [...items];

  switch (sortBy) {
    case 'newest':
      return sorted.reverse();
    case 'az':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'beginner':
      return sorted.sort(
        (a, b) =>
          (difficultyRank[a.difficulty] ?? 9) - (difficultyRank[b.difficulty] ?? 9) ||
          a.title.localeCompare(b.title)
      );
    case 'popular':
    default:
      return sorted.sort((a, b) => {
        const scoreA = (a.tags?.length || 0) + (a.difficulty === 'Beginner' ? 2 : 0);
        const scoreB = (b.tags?.length || 0) + (b.difficulty === 'Beginner' ? 2 : 0);
        return scoreB - scoreA || a.title.localeCompare(b.title);
      });
  }
};

export const filterTemplates = (templates, filters) => {
  const { type, query, category, tag, sortBy } = filters;

  return sortTemplates(
    templates.filter((template) => {
      if (type && template.type !== type) return false;
      if (category && ![template.category, template.designType].includes(category)) return false;
      if (tag && ![...(template.tags || []), ...(template.suitableFor || [])].includes(tag)) return false;
      return searchTemplate(template, query || '');
    }),
    sortBy
  );
};
