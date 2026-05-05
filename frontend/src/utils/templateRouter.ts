import type { Project } from '../types/project.types';
import type { TemplateKind } from '../types/template.types';

export function getWorkspaceRouteForType(type: TemplateKind, projectId: string) {
  const routes: Record<string, string> = {
    website: `/workspace/website/${projectId}`,
    '2d': `/workspace/design/${projectId}`,
    design: `/workspace/design/${projectId}`,
    '3d': `/workspace/3d/${projectId}`,
    animation: `/workspace/animation/${projectId}`,
  };

  return routes[type] || `/workspace/${projectId}`;
}

export function getWorkspaceRouteForProject(project: Project) {
  return getWorkspaceRouteForType(project.type, project.id);
}
