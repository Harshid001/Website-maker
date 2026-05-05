import { apiClient } from './apiClient';
import type { Template } from '../../types/template.types';

export function fetchTemplates() {
  return apiClient<Template[]>('/templates');
}
