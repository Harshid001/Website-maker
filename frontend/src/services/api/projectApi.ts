import { apiClient } from './apiClient';
import type { Project } from '../../types/project.types';

export function createProject(payload: Partial<Project>) {
  return apiClient<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchProject(projectId: string) {
  return apiClient<Project>(`/projects/${projectId}`);
}

export function updateProject(projectId: string, payload: Partial<Project>) {
  return apiClient<Project>(`/projects/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
