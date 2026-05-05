import type { Project } from './project.types';
import type { TemplateKind } from './template.types';

export type WorkspaceMode = 'select' | 'edit' | 'preview' | 'export' | 'prototype' | string;

export interface CanvasElement {
  id: string;
  type: 'text' | 'shape' | 'image' | 'group' | 'mesh' | string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  color?: string;
  text?: string;
  locked?: boolean;
  visible?: boolean;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface EditorTool {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  workspaceTypes?: TemplateKind[];
  action?: string;
  disabled?: boolean;
}

export interface WorkspaceState {
  mode: WorkspaceMode;
  project?: Project;
  selectedElementIds: string[];
  zoom: number;
  pan: { x: number; y: number };
  activeTool?: EditorTool;
}
