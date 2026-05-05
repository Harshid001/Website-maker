import { deepClone } from '../utils/deepClone';
import { createId, rekeyTree } from '../utils/ids';
import { slugify } from '../utils/slugify';
import { getThemePreset } from '../data/themePresets';
import { getSectionBlueprint } from '../data/sectionBlocks';
import { generateWebsiteCode } from './codeGenerator';

export const PROJECTS_KEY = 'shopcraft_projects';
export const CURRENT_PROJECT_KEY = 'shopcraft_current_project';
export const PUBLISHED_KEY = 'shopcraft_published_sites';

const storageAvailable = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const readJSON = (key, fallback) => {
  if (!storageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn(`Could not read ${key}`, error);
    return fallback;
  }
};

const writeJSON = (key, value) => {
  if (!storageAvailable()) return value;
  window.localStorage.setItem(key, JSON.stringify(value));
  return value;
};

const createBlankPage = (name = 'Home', overrides = {}) => ({
  id: overrides.id || createId('page'),
  type: 'page',
  name,
  slug: overrides.slug || slugify(name),
  path: overrides.path || (overrides.isHome ? '/' : `/${slugify(name)}`),
  isHome: Boolean(overrides.isHome),
  sections: overrides.sections || [],
  styles: {
    width: '1440px',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    ...(overrides.styles || {}),
  },
});

const cloneSections = (types = []) =>
  rekeyTree(types.map((type) => deepClone(getSectionBlueprint(type))));

const defaultPages = (sections = []) => [
  createBlankPage('Home', { isHome: true, slug: 'home', path: '/', sections }),
  createBlankPage('About', { slug: 'about', path: '/about', sections: [] }),
  createBlankPage('Services', { slug: 'services', path: '/services', sections: [] }),
  createBlankPage('Contact', { slug: 'contact', path: '/contact', sections: [] }),
];

export const normalizeProject = (project = {}) => {
  const now = new Date().toISOString();
  const id = project.id || createId('project');
  const name = project.name || project.businessDetails?.websiteName || 'Untitled Website';
  const starterSections = project.sections?.length ? project.sections : [];
  const pages = project.pages?.length ? project.pages : defaultPages(starterSections);
  const currentPageId = project.currentPageId || pages.find((page) => page.isHome)?.id || pages[0]?.id;
  const currentPage = pages.find((page) => page.id === currentPageId) || pages[0];
  const theme = project.theme?.colors ? project.theme : getThemePreset(project.theme?.id || project.theme || 'modern-dark');

  return {
    id,
    name,
    slug: project.slug || slugify(name),
    type: 'website',
    category: project.category || 'custom',
    businessDetails: project.businessDetails || {},
    pages,
    currentPageId: currentPage?.id,
    nodesMap: project.nodesMap || {},
    nodes: project.nodes || {},
    generatedCode: project.generatedCode || null,
    interactions: project.interactions || [],
    routes: project.routes || [],
    theme,
    sections: currentPage?.sections || [],
    assets: project.assets || [],
    seo: {
      metaTitle: project.seo?.metaTitle || `${name} | Official Website`,
      metaDescription: project.seo?.metaDescription || `Discover ${name}, services, offers, and contact details.`,
      keywords: project.seo?.keywords || [],
      slug: project.seo?.slug || slugify(name),
      ogTitle: project.seo?.ogTitle || name,
      ogImage: project.seo?.ogImage || '',
      score: project.seo?.score || 72,
      schema: project.seo?.schema || '',
    },
    animations: project.animations || [],
    integrations: project.integrations || {},
    settings: project.settings || {},
    favorite: Boolean(project.favorite),
    published: Boolean(project.published),
    status: project.status || (project.published ? 'published' : 'draft'),
    publishedAt: project.publishedAt || null,
    createdAt: project.createdAt || now,
    updatedAt: project.updatedAt || now,
  };
};

const saveProjects = (projects) => writeJSON(PROJECTS_KEY, projects.map(normalizeProject));

export const listProjects = () => readJSON(PROJECTS_KEY, []).map(normalizeProject);

export const getProject = (projectId) =>
  listProjects().find((project) => String(project.id) === String(projectId)) || null;

export const createProject = (data = {}) => {
  const project = normalizeProject({
    ...data,
    id: data.id || createId('project'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const projects = listProjects();
  saveProjects([project, ...projects.filter((item) => item.id !== project.id)]);
  writeJSON(CURRENT_PROJECT_KEY, project.id);
  return project;
};

export const updateProject = (projectId, data = {}) => {
  const projects = listProjects();
  const existing = projects.find((project) => String(project.id) === String(projectId));
  const merged = normalizeProject({
    ...(existing || {}),
    ...deepClone(data),
    id: projectId,
    updatedAt: new Date().toISOString(),
  });
  saveProjects(existing ? projects.map((project) => (String(project.id) === String(projectId) ? merged : project)) : [merged, ...projects]);
  writeJSON(CURRENT_PROJECT_KEY, merged.id);
  return merged;
};

export const deleteProject = (projectId) => {
  const projects = listProjects().filter((project) => String(project.id) !== String(projectId));
  saveProjects(projects);
  return true;
};

export const duplicateProject = (projectId) => {
  const project = getProject(projectId);
  if (!project) return null;
  return createProject({
    ...rekeyTree(project),
    id: createId('project'),
    name: `${project.name} Copy`,
    slug: slugify(`${project.slug}-copy`),
    published: false,
    status: 'draft',
    publishedAt: null,
  });
};

export const publishProject = (projectId) => {
  const project = getProject(projectId);
  if (!project) throw new Error('Project not found');

  const published = updateProject(projectId, {
    ...project,
    generatedCode: project.generatedCode || generateWebsiteCode(project),
    published: true,
    status: 'published',
    slug: project.slug || slugify(project.name),
    publishedAt: new Date().toISOString(),
  });

  const sites = readJSON(PUBLISHED_KEY, {});
  sites[published.slug] = published.id;
  writeJSON(PUBLISHED_KEY, sites);
  return published;
};

export const getPublishedSite = (slug) => {
  const sites = readJSON(PUBLISHED_KEY, {});
  const projectId = sites[slug];
  const project = projectId ? getProject(projectId) : listProjects().find((item) => item.slug === slug && item.published);
  return project?.published ? project : null;
};

export const createBlankProject = () => {
  const demoSeedVersion = 6;
  const projects = listProjects();
  const existing = projects.find((project) => project.id === 'demo-website-project');
  if (existing?.settings?.demoSeedVersion === demoSeedVersion) return existing;

  const homeSections = cloneSections(['navbar', 'hero', 'services', 'contact', 'footer']);
  const pages = [
    createBlankPage('Home', { isHome: true, slug: 'home', path: '/', sections: homeSections }),
    createBlankPage('About', { slug: 'about', path: '/about', sections: cloneSections(['about', 'team', 'footer']) }),
    createBlankPage('Services', { slug: 'services', path: '/services', sections: cloneSections(['services', 'pricing', 'faq', 'footer']) }),
    createBlankPage('Contact', { slug: 'contact', path: '/contact', sections: cloneSections(['contact', 'footer']) }),
  ];

  return createProject({
    id: 'demo-website-project',
    name: 'Untitled Website',
    slug: 'untitled-website',
    category: 'custom',
    businessDetails: {
      websiteName: 'Untitled Website',
    },
    theme: getThemePreset('modern-dark'),
    settings: { demoSeedVersion, startMode: 'blank' },
    pages,
    currentPageId: pages[0].id,
    sections: pages[0].sections,
  });
};

export const createDemoProject = createBlankProject;

export const projectStorage = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  duplicateProject,
  publishProject,
  getPublishedSite,
  createBlankProject,
  createDemoProject,
  normalizeProject,
};
