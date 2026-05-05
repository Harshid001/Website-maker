import type { Project } from '../types/project.types';

export const CURRENT_PROJECT_KEY = 'shopcraft-current-project';
export const PROJECTS_KEY = 'shopcraft-template-projects';

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): T {
  if (canUseStorage()) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  return value;
}

export function listStoredProjects(): Project[] {
  return readJson<Project[]>(PROJECTS_KEY, []);
}

export function getStoredProject(projectId: string): Project | null {
  return listStoredProjects().find((project) => project.id === projectId) || null;
}

export function saveStoredProject(project: Project): Project {
  const projects = listStoredProjects();
  const nextProjects = [project, ...projects.filter((item) => item.id !== project.id)];
  writeJson(PROJECTS_KEY, nextProjects);
  writeJson(CURRENT_PROJECT_KEY, project);
  return project;
}

export function getCurrentStoredProject(): Project | null {
  return readJson<Project | null>(CURRENT_PROJECT_KEY, null);
}
