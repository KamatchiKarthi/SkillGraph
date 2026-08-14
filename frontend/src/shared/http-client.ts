import type { ApiEnvelope } from './types/graph';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export async function httpGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
  }

  const response = await fetch(url.toString());
  let payload: ApiEnvelope<T> | null = null;

  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError('Invalid API response', 'INTERNAL', response.status);
  }

  if (!payload.success) {
    throw new ApiError(
      payload.error.message,
      payload.error.code,
      response.status,
    );
  }

  return payload.data;
}
