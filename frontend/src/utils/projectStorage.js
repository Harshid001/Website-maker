export const CURRENT_TEMPLATE_PROJECT_KEY = 'shopcraft-current-project';
export const TEMPLATE_PROJECTS_KEY = 'shopcraft-template-projects';

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

export const cloneData = (value) => {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
};

const readJson = (key, fallback) => {
  if (!canUseStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn(`Unable to read ${key}`, error);
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (canUseStorage()) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  return value;
};

const createProjectId = (type) => {
  const suffix =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `${type}-${Date.now()}-${suffix}`;
};

export const listTemplateProjects = () => readJson(TEMPLATE_PROJECTS_KEY, []);

export const saveTemplateProject = (project) => {
  const projects = listTemplateProjects();
  const nextProjects = [project, ...projects.filter((item) => item.id !== project.id)];
  writeJson(TEMPLATE_PROJECTS_KEY, nextProjects);
  writeJson(CURRENT_TEMPLATE_PROJECT_KEY, project);

  return project;
};

export const createProjectFromTemplate = (template) => {
  const now = new Date().toISOString();
  const project = {
    id: createProjectId(template.type),
    name: template.title,
    type: template.type,
    workspaceType: template.workspaceType,
    templateId: template.id,
    category: template.category,
    tags: cloneData(template.tags || []),
    description: template.description,
    thumbnail: template.thumbnail,
    content: cloneData(template.content),
    createdAt: now,
    updatedAt: now,
  };

  return saveTemplateProject(project);
};

export const getTemplateProject = (projectId) => {
  const projects = listTemplateProjects();
  const project = projects.find((item) => String(item.id) === String(projectId));
  if (project) return project;

  const currentProject = readJson(CURRENT_TEMPLATE_PROJECT_KEY, null);
  return currentProject && String(currentProject.id) === String(projectId) ? currentProject : null;
};

export const updateTemplateProject = (projectId, updates) => {
  const existing = getTemplateProject(projectId);
  if (!existing) return null;

  const updated = {
    ...existing,
    ...cloneData(updates),
    id: existing.id,
    updatedAt: new Date().toISOString(),
  };

  return saveTemplateProject(updated);
};

export const getCurrentTemplateProject = () => readJson(CURRENT_TEMPLATE_PROJECT_KEY, null);
