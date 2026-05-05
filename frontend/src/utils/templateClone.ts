import type { Project } from '../types/project.types';
import type { Template } from '../types/template.types';

export function deepClone<T>(value: T): T {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createProjectFromTemplate(template: Template): Project {
  const now = new Date().toISOString();
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${template.type}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  return {
    id,
    name: template.title,
    type: template.type,
    templateId: template.id,
    category: template.category,
    content: deepClone(template.content || {}),
    thumbnail: template.thumbnail,
    tags: deepClone(template.tags || []),
    createdAt: now,
    updatedAt: now,
    metadata: {
      designType: template.designType,
      suitableFor: template.suitableFor,
      workspaceType: template.workspaceType,
    },
  };
}
