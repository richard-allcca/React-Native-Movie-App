import {
  HTTP_TIMEOUT_MS,
  HttpAdapter,
  HttpError,
  HttpRequestOptions,
  QueryParams,
} from './http.adapter';

interface Options {
  baseUrl: string;
  params?: QueryParams;
}

export class FetchAdapter implements HttpAdapter {
  private baseUrl: string;
  private params: QueryParams;

  constructor(options: Options) {
    this.baseUrl = options.baseUrl;
    this.params = options.params ?? {};
  }

  private buildUrl(url: string, params?: QueryParams): string {
    const fullUrl = url.startsWith('http')
      ? url
      : [this.baseUrl.replace(/\/$/, ''), url.replace(/^\//, '')].join('/');

    const search = new URLSearchParams();
    Object.entries({...this.params, ...params}).forEach(([key, value]) => {
      search.append(key, String(value));
    });

    const query = search.toString();
    if (!query) {
      return fullUrl;
    }

    return fullUrl + (fullUrl.includes('?') ? '&' : '?') + query;
  }

  private bindCallerSignal(controller: AbortController, signal?: AbortSignal) {
    if (!signal) {
      return;
    }
    if (signal.aborted) {
      controller.abort();
      return;
    }
    signal.addEventListener('abort', () => controller.abort(), {once: true});
  }

  async get<T>(url: string, options?: HttpRequestOptions): Promise<T> {
    const fullUrl = this.buildUrl(url, options?.params);
    const controller = new AbortController();
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, HTTP_TIMEOUT_MS);
    this.bindCallerSignal(controller, options?.signal);

    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: options?.headers,
        signal: controller.signal,
      } as RequestInit);

      if (!response.ok) {
        throw await this.errorFromResponse(response, fullUrl);
      }

      try {
        return (await response.json()) as T;
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(
          'La respuesta no es JSON válido',
          response.status,
          fullUrl,
        );
      }
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(
        this.networkMessage(timedOut, options?.signal, error),
        undefined,
        fullUrl,
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async errorFromResponse(
    response: Response,
    fullUrl: string,
  ): Promise<HttpError> {
    let statusMessage: string | undefined;
    try {
      const body = (await response.json()) as {status_message?: unknown};
      if (body && typeof body.status_message === 'string') {
        statusMessage = body.status_message;
      }
    } catch {
      statusMessage = undefined;
    }

    return new HttpError(
      statusMessage ?? `Error HTTP ${response.status}`,
      response.status,
      fullUrl,
      statusMessage,
    );
  }

  private networkMessage(
    timedOut: boolean,
    signal: AbortSignal | undefined,
    error: unknown,
  ): string {
    if (timedOut) {
      return 'La petición superó el tiempo de espera';
    }
    if (signal?.aborted) {
      return 'La petición fue cancelada';
    }
    return error instanceof Error ? error.message : 'Error fetching data';
  }
}
