export interface ApiClientOptions extends RequestInit {
  timeoutMs?: number;
}

const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function apiClient<TResponse>(
  path: string,
  options: ApiClientOptions = {},
  baseUrl = DEFAULT_API_BASE_URL
): Promise<TResponse> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), options.timeoutMs || 15000);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : await response.text();

    if (!response.ok) {
      throw new Error(typeof payload === 'string' ? payload : payload?.message || 'API request failed');
    }

    return payload as TResponse;
  } finally {
    window.clearTimeout(timeout);
  }
}

export function getApiBaseUrl() {
  return DEFAULT_API_BASE_URL;
}
