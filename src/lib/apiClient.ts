// lib/api-client.ts
import { z } from 'zod';

export interface ApiClientOptions {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  token?: string;
  onError?: (error: any, context: { url: string; method: string }) => void;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public details?: any,
    public request?: { url: string; method: string }
  ) {
    super(`API Error ${status}`);
  }
}

export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private timeout: number;
  private retries: number;
  private token?: string;
  private onError?: ApiClientOptions['onError'];

  constructor(opts: ApiClientOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/$/, '');
    this.headers = opts.headers ?? { 'Content-Type': 'application/json' };
    this.timeout = opts.timeout ?? 8000;
    this.retries = opts.retries ?? 1;
    this.token = opts.token;
    this.onError = opts.onError;
  }

  setToken(token: string) {
    this.token = token;
  }


  private async request<T>(method: string, endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    let lastError: any;

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const mergedHeaders = {
          ...this.headers,
          ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
          ...(headers ?? {}),
        };
        const res = await fetch(url, {
          method,
          signal: controller.signal,
          headers: mergedHeaders,
          body: body ? JSON.stringify(body) : undefined,
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : null;

        if (!res.ok) {
          const error = new ApiError(res.status, data, { url, method });
          this.onError?.(error, { url, method });
          throw error;
        }

        return data as T;
      } catch (err: any) {
        lastError = err;
        if (err.name === 'AbortError') throw err;
        if (attempt < this.retries) await new Promise(r => setTimeout(r, 300 * 2 ** attempt));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError;
  }

  get<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>('GET', endpoint, undefined, headers);
  }
  post<T>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>('POST', endpoint, body, headers);
  }
  put<T>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>('PUT', endpoint, body, headers);
  }
  delete<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>('DELETE', endpoint, undefined, headers);
  }

  async safePost<T, Schema extends z.ZodTypeAny>(
    endpoint: string,
    body: unknown,
    schema: Schema,
    headers?: Record<string, string>
  ): Promise<z.infer<Schema>> {
    const res = await this.post<T>(endpoint, body, headers);
    return schema.parse(res);
  }
}