import type { TemplateContent, TemplateKind } from './template.types';

export interface Project {
  id: string;
  name: string;
  type: TemplateKind;
  templateId?: string;
  category?: string;
  content?: TemplateContent;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface StoredProjectIndex {
  currentProjectId?: string;
  projects: Project[];
}
