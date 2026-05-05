import { apiClient } from './apiClient';

export interface AiRequest {
  prompt?: string;
  message?: string;
  context?: Record<string, unknown>;
  [key: string]: unknown;
}

export function chatWithAi(payload: AiRequest) {
  return apiClient('/ai/chat', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function generateTemplate(payload: AiRequest) {
  return apiClient('/ai/generate-template', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function suggestLayout(payload: AiRequest) {
  return apiClient('/ai/suggest-layout', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function improveCopy(payload: AiRequest) {
  return apiClient('/ai/improve-copy', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
