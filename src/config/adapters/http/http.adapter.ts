export type QueryValue = string | number | boolean;

export type QueryParams = Record<string, QueryValue>;

export interface HttpRequestOptions {
  params?: QueryParams;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export class HttpError extends Error {
  readonly status?: number;
  readonly url: string;
  readonly statusMessage?: string;

  constructor(
    message: string,
    status: number | undefined,
    url: string,
    statusMessage?: string,
  ) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.url = url;
    this.statusMessage = statusMessage;
  }
}

export abstract class HttpAdapter {
  abstract get<T>(url: string, options?: HttpRequestOptions): Promise<T>;
}

export const HTTP_TIMEOUT_MS = 10000;
